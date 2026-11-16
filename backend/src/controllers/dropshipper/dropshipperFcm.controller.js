import prisma from '../../config/prisma.js';
import {
  registerDeviceToken,
  unregisterDeviceToken,
  getUserDeviceTokens,
  sendPushNotification
} from '../../services/fcm.service.js';

/**
 * 1. Register or Update FCM Device Push Token
 * POST /api/v1/dropshipper/fcm/register
 */
export const registerDropshipperFcmToken = async (req, res) => {
  try {
    const { token, deviceType = 'web', userAgent = '' } = req.body;
    const firebaseUid = req.body.firebaseUid || req.user?.uid || req.user?.id;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'firebaseUid or authenticated user is required'
      });
    }

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'FCM push registration token is required'
      });
    }

    const result = await registerDeviceToken({
      userId: firebaseUid,
      token,
      deviceType,
      userAgent: userAgent || req.headers['user-agent'] || ''
    });

    return res.status(200).json({
      success: true,
      message: 'FCM WebPush token successfully linked to dropshipper profile',
      data: result
    });
  } catch (error) {
    console.error('Error in registerDropshipperFcmToken:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to register device push token',
      error: error.message
    });
  }
};

/**
 * 2. Unregister Device Push Token
 * POST /api/v1/dropshipper/fcm/unregister
 */
export const unregisterDropshipperFcmToken = async (req, res) => {
  try {
    const { token } = req.body;
    const firebaseUid = req.body.firebaseUid || req.user?.uid || req.user?.id;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Device token is required to unregister'
      });
    }

    const result = await unregisterDeviceToken({
      userId: firebaseUid,
      token
    });

    return res.status(200).json({
      success: true,
      message: 'FCM token removed successfully',
      result
    });
  } catch (error) {
    console.error('Error in unregisterDropshipperFcmToken:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unregister push token',
      error: error.message
    });
  }
};

/**
 * 3. Get FCM Registration Status & Device Count
 * GET /api/v1/dropshipper/fcm/status/:firebaseUid
 */
export const getDropshipperFcmStatus = async (req, res) => {
  try {
    const firebaseUid = req.params.firebaseUid || req.user?.uid;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'firebaseUid is required'
      });
    }

    const tokens = await getUserDeviceTokens(firebaseUid);

    return res.status(200).json({
      success: true,
      isRegistered: tokens.length > 0,
      activeDevicesCount: tokens.length,
      hasPushActive: tokens.length > 0
    });
  } catch (error) {
    console.error('Error in getDropshipperFcmStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve FCM push status',
      error: error.message
    });
  }
};

/**
 * 4. Send Instant Test Push Notification
 * POST /api/v1/dropshipper/fcm/test-push
 */
export const sendDropshipperTestPush = async (req, res) => {
  try {
    const {
      firebaseUid,
      title = '⚡ Test Push: Dropshipper Notifications Active!',
      body = 'Instant browser alerts for orders, delivered margins, and dispute updates are fully configured.',
      clickAction = '/dropshipper/dashboard?tab=orders'
    } = req.body;

    const targetUid = firebaseUid || req.user?.uid;

    if (!targetUid) {
      return res.status(400).json({
        success: false,
        message: 'firebaseUid is required to dispatch test push'
      });
    }

    const pushResult = await sendPushNotification({
      userId: targetUid,
      title,
      body,
      clickAction,
      type: 'system',
      tag: 'test-push',
      data: {
        sentAt: new Date().toISOString(),
        testMode: true
      },
      saveToDb: true
    });

    return res.status(200).json({
      success: true,
      message: pushResult.webPushSent
        ? 'Test WebPush ping sent to your active devices!'
        : 'Push recorded in notification center (no active device tokens detected or FCM skipping)',
      details: pushResult
    });
  } catch (error) {
    console.error('Error in sendDropshipperTestPush:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send test push notification',
      error: error.message
    });
  }
};

/**
 * 5. Get Notification Center History for In-App Bell Dropdown
 * GET /api/v1/dropshipper/notifications/:firebaseUid
 */
export const getDropshipperNotifications = async (req, res) => {
  try {
    const firebaseUid = req.params.firebaseUid || req.user?.uid;
    const limit = parseInt(req.query.limit, 10) || 30;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'firebaseUid is required'
      });
    }

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        where: { userId: firebaseUid },
        orderBy: { createdAt: 'desc' },
        take: limit
      }),
      prisma.notification.count({
        where: {
          userId: firebaseUid,
          isRead: false
        }
      })
    ]);

    return res.status(200).json({
      success: true,
      unreadCount,
      total: notifications.length,
      notifications
    });
  } catch (error) {
    console.error('Error in getDropshipperNotifications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to load notifications history',
      error: error.message
    });
  }
};

/**
 * 6. Mark Single Notification As Read
 * PATCH /api/v1/dropshipper/notifications/:id/read
 */
export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    return res.status(200).json({
      success: true,
      notification: updated
    });
  } catch (error) {
    console.error('Error in markNotificationRead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read',
      error: error.message
    });
  }
};

/**
 * 7. Mark All Notifications Read for User
 * POST /api/v1/dropshipper/notifications/:firebaseUid/read-all
 */
export const markAllNotificationsRead = async (req, res) => {
  try {
    const firebaseUid = req.params.firebaseUid || req.user?.uid;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'firebaseUid is required'
      });
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId: firebaseUid,
        isRead: false
      },
      data: { isRead: true }
    });

    return res.status(200).json({
      success: true,
      markedCount: result.count,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Error in markAllNotificationsRead:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
};

