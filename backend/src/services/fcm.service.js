import prisma from '../config/prisma.js';
import { messaging } from '../config/firebaseAdmin.js';
import crypto from 'crypto';

/**
 * Enterprise FCM (Firebase Cloud Messaging) Service
 * Manages Multi-Device Push Tokens, DB Notification Sync, and WebPush Delivery
 */

/**
 * 1. Register or Refresh Device Push Token
 */
export const registerDeviceToken = async ({ userId, token, deviceType = 'web', userAgent = '' }) => {
  if (!userId || !token) {
    throw new Error('userId and token are required to register device');
  }

  try {
    const id = crypto.randomUUID();
    // Parameterized upsert into fcm_devices
    await prisma.$executeRaw`
      INSERT INTO fcm_devices (id, user_id, token, device_type, user_agent, last_seen, created_at)
      VALUES (${id}, ${userId}, ${token}, ${deviceType}, ${userAgent}, NOW(), NOW())
      ON CONFLICT (token) 
      DO UPDATE SET 
        user_id = EXCLUDED.user_id,
        user_agent = EXCLUDED.user_agent,
        device_type = EXCLUDED.device_type,
        last_seen = NOW();
    `;

    return { success: true, message: 'Device token registered successfully' };
  } catch (error) {
    console.error('Error in registerDeviceToken:', error);
    throw error;
  }
};

/**
 * 2. Unregister Device Push Token (e.g. on logout or toggle off)
 */
export const unregisterDeviceToken = async ({ userId, token }) => {
  if (!token) return { success: false, message: 'Token required' };

  try {
    if (userId) {
      await prisma.$executeRaw`
        DELETE FROM fcm_devices 
        WHERE token = ${token} AND user_id = ${userId};
      `;
    } else {
      await prisma.$executeRaw`
        DELETE FROM fcm_devices 
        WHERE token = ${token};
      `;
    }
    return { success: true, message: 'Device token removed successfully' };
  } catch (error) {
    console.error('Error in unregisterDeviceToken:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 3. Get Active Tokens for a User
 */
export const getUserDeviceTokens = async (userId) => {
  if (!userId) return [];
  try {
    const records = await prisma.$queryRaw`
      SELECT token FROM fcm_devices 
      WHERE user_id = ${userId}
      ORDER BY last_seen DESC;
    `;
    return records.map((r) => r.token);
  } catch (error) {
    console.warn('Error fetching user device tokens:', error.message);
    return [];
  }
};

/**
 * 4. Send Targeted Push Notification to a Specific Dropshipper / User
 * Syncs simultaneously with PostgreSQL Notification Center and Web Push
 */
export const sendPushNotification = async ({
  userId,
  title,
  body,
  icon = '/favicon.ico',
  clickAction = '/dropshipper/dashboard',
  tag = 'dropshipper-notice',
  type = 'system', // 'order' | 'earning' | 'kyc' | 'dispute' | 'support' | 'system'
  priority = 'high', // 'high' | 'normal'
  data = {},
  saveToDb = true
}) => {
  if (!userId || !title || !body) {
    console.warn('sendPushNotification missing required fields (userId, title, body)');
    return { success: false, message: 'Missing parameters' };
  }

  let dbNotification = null;

  // Step A: Persist to Postgres Notification Table (In-app Bell Dropdown)
  if (saveToDb) {
    try {
      dbNotification = await prisma.notification.create({
        data: {
          userId,
          title,
          body,
          type,
          data: {
            ...data,
            clickAction,
            tag,
            priority,
            soundType: type === 'earning' ? 'cash_chime' : 'ping'
          },
          isRead: false
        }
      });
    } catch (err) {
      console.warn('Could not persist notification to DB:', err.message);
    }
  }

  // Step B: Dispatch WebPush via Firebase Admin FCM
  if (!messaging) {
    console.warn('Firebase Messaging not initialized. Push skipped.');
    return {
      success: true,
      webPushSent: false,
      reason: 'FCM messaging unavailable',
      notificationId: dbNotification?.id
    };
  }

  try {
    const tokens = await getUserDeviceTokens(userId);

    if (!tokens || tokens.length === 0) {
      return {
        success: true,
        webPushSent: false,
        reason: 'No active device tokens found for user',
        notificationId: dbNotification?.id
      };
    }

    // Format string payload for data attributes
    const formattedData = {};
    for (const [k, v] of Object.entries(data || {})) {
      formattedData[k] = typeof v === 'string' ? v : JSON.stringify(v);
    }
    formattedData.clickAction = clickAction;
    formattedData.tag = tag;
    formattedData.type = type;
    formattedData.priority = priority;
    formattedData.soundType = type === 'earning' ? 'cash_chime' : 'ping';
    formattedData.timestamp = String(Date.now());

    const isHighPriority = priority === 'high';

    const message = {
      tokens,
      notification: {
        title,
        body
      },
      data: formattedData,
      webpush: {
        headers: {
          Urgency: isHighPriority ? 'high' : 'normal',
          TTL: '86400'
        },
        fcmOptions: {
          link: clickAction
        },
        notification: {
          title,
          body,
          icon,
          badge: '/favicon.ico',
          vibrate: isHighPriority ? [300, 150, 300, 150, 300] : [200, 100, 200],
          tag,
          renotify: true,
          requireInteraction: isHighPriority,
          silent: false
        }
      },
      android: {
        priority: isHighPriority ? 'high' : 'normal',
        collapseKey: tag,
        notification: {
          tag,
          sound: 'default',
          channelId: type === 'earning' ? 'dropshipper_earnings' : 'dropshipper_orders'
        }
      },
      apns: {
        headers: {
          'apns-priority': isHighPriority ? '10' : '5'
        },
        payload: {
          aps: {
            sound: 'default',
            badge: 1
          }
        }
      }
    };

    const response = await messaging.sendEachForMulticast(message);

    // Step C: Auto-purge stale / expired tokens if any failed
    if (response.failureCount > 0) {
      const expiredTokens = [];
      response.responses.forEach((resp, idx) => {
        if (!resp.success) {
          const errCode = resp.error?.code;
          if (
            errCode === 'messaging/invalid-registration-token' ||
            errCode === 'messaging/registration-token-not-registered'
          ) {
            expiredTokens.push(tokens[idx]);
          }
        }
      });

      if (expiredTokens.length > 0) {
        (async () => {
          try {
            for (const expiredToken of expiredTokens) {
              await prisma.$executeRaw`
                DELETE FROM fcm_devices WHERE token = ${expiredToken};
              `;
            }
          } catch (cleanupErr) {
            console.warn('Error purging expired FCM tokens:', cleanupErr.message);
          }
        })();
      }
    }

    return {
      success: true,
      webPushSent: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      notificationId: dbNotification?.id
    };
  } catch (error) {
    console.error('Error dispatching FCM WebPush:', error);
    return {
      success: false,
      error: error.message,
      notificationId: dbNotification?.id
    };
  }
};

/**
 * 5. Common Pre-Built Lifecycle Triggers for Dropshippers
 */

// A. Margin Credited / Instant Wallet Release
export const sendMarginCreditedPush = async ({ userId, orderId, marginAmount, storeName }) => {
  return sendPushNotification({
    userId,
    title: `💰 Margin Credited: ₹${marginAmount}`,
    body: `Woohoo! ₹${marginAmount} profit margin has been unlocked and credited to your wallet for Order #${orderId}.`,
    type: 'earning',
    tag: `margin-${orderId}`,
    clickAction: '/dropshipper/dashboard?tab=wallet',
    data: { orderId, marginAmount: String(marginAmount), storeName }
  });
};

// B. Order Dispatched / In-Transit
export const sendOrderDispatchedPush = async ({ userId, orderId, courierName, trackingNumber }) => {
  return sendPushNotification({
    userId,
    title: `🚚 Order #${orderId} Dispatched`,
    body: `Package is now on the move via ${courierName || 'Courier'}. Tracking: ${trackingNumber || 'Available in portal'}.`,
    type: 'order',
    tag: `dispatch-${orderId}`,
    clickAction: '/dropshipper/dashboard?tab=orders',
    data: { orderId, courierName, trackingNumber }
  });
};

// C. Order Delivered Ping
export const sendOrderDeliveredPush = async ({ userId, orderId, customerName }) => {
  return sendPushNotification({
    userId,
    title: `🎉 Order #${orderId} Delivered!`,
    body: `Customer ${customerName || ''} successfully received their shipment. Escrow lock released.`,
    type: 'order',
    tag: `delivered-${orderId}`,
    clickAction: '/dropshipper/dashboard?tab=orders',
    data: { orderId }
  });
};

// D. KYC Verification Approval / Rejection
export const sendKycStatusPush = async ({ userId, status, reason }) => {
  const isApproved = status === 'APPROVED';
  return sendPushNotification({
    userId,
    title: isApproved ? '✅ Store KYC Approved!' : '⚠️ KYC Action Required',
    body: isApproved
      ? 'Congratulations! Your store verification is complete. You can now process unlimited orders.'
      : `KYC submission was not approved: ${reason || 'Please review your uploaded documents.'}`,
    type: 'kyc',
    tag: 'kyc-status',
    clickAction: '/dropshipper/dashboard?tab=profile',
    data: { status, reason: reason || '' }
  });
};

// E. ROT Return / Dispute Alert
export const sendRotDisputePush = async ({ userId, orderId, claimId, status }) => {
  return sendPushNotification({
    userId,
    title: `🛡️ ROT Dispute Update (${claimId || 'Claim'})`,
    body: `Your return freight dispute for Order #${orderId} is now ${status || 'Under Review'}. Debit freeze active.`,
    type: 'dispute',
    tag: `rot-${orderId}`,
    clickAction: '/dropshipper/dashboard?tab=rot',
    data: { orderId, claimId, status }
  });
};

// F. Support Desk Reply Ping
export const sendSupportTicketPush = async ({ userId, ticketId, subject }) => {
  return sendPushNotification({
    userId,
    title: `💬 New Reply on Ticket #${ticketId.slice(0, 8)}`,
    body: `A support agent updated your ticket: "${subject}". Tap to view discussion.`,
    type: 'support',
    tag: `ticket-${ticketId}`,
    clickAction: '/dropshipper/dashboard?tab=support',
    data: { ticketId }
  });
};

export default {
  registerDeviceToken,
  unregisterDeviceToken,
  getUserDeviceTokens,
  sendPushNotification,
  sendMarginCreditedPush,
  sendOrderDispatchedPush,
  sendOrderDeliveredPush,
  sendKycStatusPush,
  sendRotDisputePush,
  sendSupportTicketPush
};

