import transporter from '../config/emailTransporter.js';

const FROM_NAME = process.env.EMAIL_FROM_NAME || 'MShoppy B2B Dropship Hub';
const FROM_EMAIL = process.env.SMTP_USER || 'pramodlodhi2003born@gmail.com';
const APP_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

/**
 * Enterprise Base HTML Email Template with inline CSS (compatible with Gmail, Outlook, Apple Mail)
 */
const getBaseEmailTemplate = ({
  headline,
  statusBadgeText,
  statusBadgeColor = '#b7004d',
  statusBadgeBg = '#fdf2f8',
  storeBrandName,
  contentHtml,
  ctaText,
  ctaLink,
  secondaryNote
}) => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${headline}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 32px 16px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #4a2135 0%, #b7004d 100%); padding: 28px 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <div style="font-size: 20px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px; text-transform: uppercase;">
                      ${storeBrandName ? `${storeBrandName} <span style="font-size: 11px; opacity: 0.8; font-weight: normal; text-transform: none;">• B2B Dropship</span>` : 'MShoppy B2B SuperApp'}
                    </div>
                    <div style="font-size: 12px; color: #fce7f3; margin-top: 4px; font-weight: 500;">
                      Official Automated Dispatch & Profit Notification
                    </div>
                  </td>
                  ${statusBadgeText ? `
                  <td align="right">
                    <span style="display: inline-block; background-color: ${statusBadgeBg}; color: ${statusBadgeColor}; font-size: 11px; font-weight: 800; padding: 6px 14px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px; border: 1px solid rgba(183, 0, 77, 0.2);">
                      ${statusBadgeText}
                    </span>
                  </td>
                  ` : ''}
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="font-size: 20px; font-weight: 800; color: #0f172a; margin: 0 0 16px 0; letter-spacing: -0.3px;">
                ${headline}
              </h1>

              ${contentHtml}

              <!-- Action CTA Button -->
              ${ctaText && ctaLink ? `
              <div style="margin: 28px 0 20px 0; text-align: center;">
                <a href="${ctaLink}" target="_blank" style="display: inline-block; background-color: #b7004d; color: #ffffff; font-weight: 700; font-size: 14px; padding: 14px 28px; border-radius: 12px; text-decoration: none; box-shadow: 0 4px 12px rgba(183, 0, 77, 0.25);">
                  ${ctaText} &rarr;
                </a>
              </div>
              ` : ''}

              <!-- Secondary Explanatory Callout -->
              ${secondaryNote ? `
              <div style="background-color: #f1f5f9; border-left: 4px solid #b7004d; border-radius: 8px; padding: 14px 16px; margin-top: 24px; font-size: 12px; color: #475569;">
                ${secondaryNote}
              </div>
              ` : ''}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 32px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #64748b; line-height: 1.5; text-align: center;">
              <p style="margin: 0 0 6px 0;">
                This is an automated system email sent from <strong>${storeBrandName || 'MShoppy Dropshipper Hub'}</strong>.
              </p>
              <p style="margin: 0;">
                For security, never share your OTP or banking passwords with anyone. All order margins are protected under Automated Escrow Lock.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

/**
 * Safe, Non-Blocking Email Dispatcher
 * Returns true if sent, false if failed, never throws an unhandled rejection.
 */
export const sendEmailSafely = async ({ to, subject, html, text }) => {
  if (!to || typeof to !== 'string' || !to.includes('@')) {
    console.warn('⚠️ [DropshipperEmail] Skipped sending email: Invalid or missing "to" address:', to);
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
      to,
      subject,
      html,
      text: text || subject
    });

    console.log(`📧 [DropshipperEmail] Successfully delivered email "${subject}" to ${to} (MessageId: ${info.messageId})`);
    return true;
  } catch (error) {
    console.error(`❌ [DropshipperEmail] Failed to send email to ${to}:`, error.message);
    return false;
  }
};

/**
 * 1. Dropshipper: Order Push & Escrow Lock Notification
 */
export const sendDropshipperOrderPushEmail = async ({
  partnerEmail,
  partnerName,
  storeName,
  orderId,
  productTitle,
  quantity = 1,
  customerPrice,
  resellMargin,
  escrowAmount,
  destinationCity
}) => {
  const headline = `Order #${orderId} Dispatched to Supplier Desk`;
  const subject = `🚀 Order #${orderId} Placed | ₹${Number(resellMargin || 0).toLocaleString('en-IN')} Margin Locked in Escrow`;

  const contentHtml = `
    <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
      Hello <strong>${partnerName || 'Partner'}</strong>, your dropship customer order has been successfully submitted to the wholesale supplier desk for packing and courier allocation.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 16px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px;">
        <tr>
          <td style="color: #64748b; font-weight: 600;">Order ID:</td>
          <td align="right" style="font-weight: 800; font-family: monospace; color: #0f172a;">#${orderId}</td>
        </tr>
        <tr>
          <td style="color: #64748b; font-weight: 600;">Product:</td>
          <td align="right" style="font-weight: 700; color: #0f172a;">${productTitle || 'Wholesale Sourced Item'} (Qty: ${quantity})</td>
        </tr>
        <tr>
          <td style="color: #64748b; font-weight: 600;">Destination:</td>
          <td align="right" style="color: #334155;">${destinationCity || 'India'}</td>
        </tr>
        <tr>
          <td style="color: #64748b; font-weight: 600;">Customer Billing Price:</td>
          <td align="right" style="font-weight: 800; color: #0f172a;">₹${Number(customerPrice || 0).toLocaleString('en-IN')}</td>
        </tr>
        <tr style="border-top: 1px solid #e2e8f0;">
          <td style="color: #059669; font-weight: 700; padding-top: 8px;">Your Resell Margin:</td>
          <td align="right" style="color: #059669; font-weight: 900; font-size: 15px; padding-top: 8px;">+₹${Number(resellMargin || 0).toLocaleString('en-IN')}</td>
        </tr>
      </table>
    </div>
  `;

  const html = getBaseEmailTemplate({
    headline,
    statusBadgeText: 'Escrow Locked',
    statusBadgeColor: '#059669',
    statusBadgeBg: '#ecfdf5',
    storeBrandName: storeName,
    contentHtml,
    ctaText: 'View Order & 4x6 Thermal Label',
    ctaLink: `${APP_URL}/dropshipper-orders-push`,
    secondaryNote: `🛡️ <strong>Automated Escrow Protection:</strong> Your profit margin of ₹${Number(resellMargin || 0).toLocaleString('en-IN')} is locked in escrow and will be credited to your available wallet balance immediately upon customer delivery confirmation.`
  });

  return sendEmailSafely({ to: partnerEmail, subject, html });
};

/**
 * 2. White-Label Customer Order Confirmation Email (Branded with Dropshipper's Store Name)
 */
export const sendCustomerWhiteLabelConfirmationEmail = async ({
  customerEmail,
  customerName,
  storeBrandName = 'Partner Store',
  orderId,
  productTitle,
  quantity = 1,
  totalAmount,
  shippingAddress,
  supportPhone = '+91 98765 43210'
}) => {
  if (!customerEmail) return false;

  const headline = `Thank You For Your Order with ${storeBrandName}!`;
  const subject = `Order Confirmed #${orderId} from ${storeBrandName}`;

  const contentHtml = `
    <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
      Dear <strong>${customerName || 'Valued Customer'}</strong>, thank you for shopping with <strong>${storeBrandName}</strong>! Your order has been confirmed and is being packaged for express air dispatch.
    </p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin: 16px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px;">
        <tr>
          <td style="color: #64748b; font-weight: 600;">Order Number:</td>
          <td align="right" style="font-weight: 800; font-family: monospace; color: #0f172a;">#${orderId}</td>
        </tr>
        <tr>
          <td style="color: #64748b; font-weight: 600;">Item Ordered:</td>
          <td align="right" style="font-weight: 700; color: #0f172a;">${productTitle} (Qty: ${quantity})</td>
        </tr>
        <tr>
          <td style="color: #64748b; font-weight: 600;">Delivery Address:</td>
          <td align="right" style="color: #334155;">${shippingAddress || 'Registered Address'}</td>
        </tr>
        <tr style="border-top: 1px solid #e2e8f0;">
          <td style="color: #0f172a; font-weight: 700; padding-top: 8px;">Total Payable Amount:</td>
          <td align="right" style="color: #0f172a; font-weight: 900; font-size: 15px; padding-top: 8px;">₹${Number(totalAmount || 0).toLocaleString('en-IN')}</td>
        </tr>
      </table>
    </div>
  `;

  const html = getBaseEmailTemplate({
    headline,
    statusBadgeText: 'Processing',
    statusBadgeColor: '#2563eb',
    statusBadgeBg: '#eff6ff',
    storeBrandName,
    contentHtml,
    secondaryNote: `📦 <strong>Need help or tracking?</strong> Contact ${storeBrandName} customer support directly at <strong>${supportPhone}</strong> or reply to this email.`
  });

  return sendEmailSafely({ to: customerEmail, subject, html });
};

/**
 * 3. Order Dispatched & Live Courier AWB Tracking
 */
export const sendOrderDispatchedEmail = async ({
  to,
  isCustomer = false,
  recipientName,
  storeName,
  orderId,
  courierName = 'Delhivery Express',
  awbNumber,
  productTitle,
  destinationCity
}) => {
  const headline = isCustomer 
    ? `Your Package from ${storeName || 'Our Store'} Has Shipped!` 
    : `Order #${orderId} Dispatched by Supplier`;

  const subject = `🚚 Out For Dispatch: #${orderId} via ${courierName} (AWB: ${awbNumber})`;

  const trackingLink = `https://www.delhivery.com/track/package/${awbNumber}`;

  const contentHtml = `
    <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
      Hello <strong>${recipientName || 'Valued Partner'}</strong>, the package for order <strong>#${orderId}</strong> has been handed over to <strong>${courierName}</strong> for transit to ${destinationCity || 'the destination'}.
    </p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 18px; margin: 16px 0; text-align: center;">
      <div style="font-size: 12px; font-weight: 700; color: #15803d; text-transform: uppercase; letter-spacing: 0.5px;">
        Courier Waybill Number (AWB)
      </div>
      <div style="font-size: 20px; font-weight: 900; font-family: monospace; color: #166534; margin: 6px 0;">
        ${awbNumber}
      </div>
      <div style="font-size: 12px; color: #15803d;">
        Courier Partner: ${courierName}
      </div>
    </div>
  `;

  const html = getBaseEmailTemplate({
    headline,
    statusBadgeText: 'In Transit',
    statusBadgeColor: '#2563eb',
    statusBadgeBg: '#eff6ff',
    storeBrandName: storeName,
    contentHtml,
    ctaText: 'Track Live Shipment Online',
    ctaLink: trackingLink,
    secondaryNote: isCustomer 
      ? `Please keep exact cash ready if your package is Cash On Delivery (COD).` 
      : `🛡️ <strong>100% ROT Return Shield Active:</strong> If this consignment encounters customer refusal or RTO, your reverse freight cost is 100% covered.`
  });

  return sendEmailSafely({ to, subject, html });
};

/**
 * 4. Order Delivered & Margin Released Notification
 */
export const sendOrderDeliveredMarginReleasedEmail = async ({
  partnerEmail,
  partnerName,
  storeName,
  orderId,
  productTitle,
  resellMargin,
  newWalletBalance
}) => {
  const headline = `Order #${orderId} Delivered — Margin Credited! 🎉`;
  const subject = `💰 Profit Credited! +₹${Number(resellMargin || 0).toLocaleString('en-IN')} Margin Released to Your Wallet`;

  const contentHtml = `
    <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
      Fantastic news <strong>${partnerName || 'Partner'}</strong>! The courier partner has successfully delivered order <strong>#${orderId}</strong> to the buyer.
    </p>

    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 20px; text-align: center; margin: 16px 0;">
      <div style="font-size: 12px; font-weight: 700; color: #047857; text-transform: uppercase;">
        Margin Released From Escrow
      </div>
      <div style="font-size: 28px; font-weight: 900; color: #065f46; margin: 8px 0;">
        +₹${Number(resellMargin || 0).toLocaleString('en-IN')}
      </div>
      <div style="font-size: 13px; color: #047857;">
        New Available Wallet Balance: <strong>₹${Number(newWalletBalance || 0).toLocaleString('en-IN')}</strong>
      </div>
    </div>
  `;

  const html = getBaseEmailTemplate({
    headline,
    statusBadgeText: 'Margin Cleared',
    statusBadgeColor: '#059669',
    statusBadgeBg: '#ecfdf5',
    storeBrandName: storeName,
    contentHtml,
    ctaText: 'Withdraw Margin to Bank',
    ctaLink: `${APP_URL}/dropshipper-settlements`,
    secondaryNote: `Your cleared earnings are instantly available for bank transfer or UPI payout in the Fintech Wallet.`
  });

  return sendEmailSafely({ to: partnerEmail, subject, html });
};

/**
 * 5. ROT Return Waiver Alert (Protection against RTO freight loss)
 */
export const sendRotWaiverAlertEmail = async ({
  partnerEmail,
  partnerName,
  storeName,
  orderId,
  returnReason = 'Customer Unavailable / Refused',
  waivedFreight = 120,
  tierName = 'Platinum 100% Shield'
}) => {
  const headline = `ROT Shield Activated for Order #${orderId}`;
  const subject = `🛡️ Zero Deduction: Reverse Freight Waived on Order #${orderId}`;

  const contentHtml = `
    <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
      Hello <strong>${partnerName || 'Partner'}</strong>, order <strong>#${orderId}</strong> was returned by the courier due to: <em>${returnReason}</em>.
    </p>

    <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 18px; margin: 16px 0;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="6" border="0" style="font-size: 13px;">
        <tr>
          <td style="color: #64748b; font-weight: 600;">Active Protection Tier:</td>
          <td align="right" style="font-weight: 800; color: #1d4ed8;">${tierName}</td>
        </tr>
        <tr>
          <td style="color: #64748b; font-weight: 600;">Standard 3PL Return Fee:</td>
          <td align="right" style="color: #94a3b8; text-decoration: line-through;">₹${waivedFreight}.00</td>
        </tr>
        <tr>
          <td style="color: #059669; font-weight: 700;">Your Reverse Freight Deduction:</td>
          <td align="right" style="color: #059669; font-weight: 900; font-size: 15px;">₹0.00 (100% Waived)</td>
        </tr>
      </table>
    </div>
  `;

  const html = getBaseEmailTemplate({
    headline,
    statusBadgeText: '100% Waived',
    statusBadgeColor: '#2563eb',
    statusBadgeBg: '#eff6ff',
    storeBrandName: storeName,
    contentHtml,
    ctaText: 'View ROT Claims Ledger',
    ctaLink: `${APP_URL}/dropshipper-rot-manager`,
    secondaryNote: `Our ROT Return Guarantee absorbs the reverse logistics risk so your business stays 100% protected against customer RTO return losses.`
  });

  return sendEmailSafely({ to: partnerEmail, subject, html });
};

/**
 * 6. Support Ticket & Dispute Activity Notification
 */
export const sendSupportTicketActivityEmail = async ({
  partnerEmail,
  partnerName,
  ticketId,
  subject: ticketSubject,
  category,
  orderId,
  message,
  isReply = false
}) => {
  const headline = isReply 
    ? `Support Desk Replied to Ticket #${ticketId}` 
    : `Support Ticket #${ticketId} Created`;

  const emailSubject = isReply 
    ? `💬 New Reply on Ticket #${ticketId}: ${ticketSubject || category}` 
    : `🎫 Ticket #${ticketId} Opened: ${ticketSubject || category}`;

  const contentHtml = `
    <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
      Hello <strong>${partnerName || 'Partner'}</strong>, ${isReply ? 'a support agent has posted a reply to your dispute ticket:' : 'your support inquiry has been recorded and assigned to a dispute manager:'}
    </p>

    <div style="background-color: #fdf2f8; border: 1px solid #fbcfe8; border-radius: 12px; padding: 18px; margin: 16px 0;">
      <p style="font-size: 13px; font-weight: 700; color: #9d174d; margin: 0 0 8px 0;">
        Category: ${category} ${orderId ? `• Order: #${orderId}` : ''}
      </p>
      <div style="font-size: 13px; color: #334155; background-color: #ffffff; padding: 12px 14px; border-radius: 8px; border: 1px solid #fce7f3; font-style: italic;">
        "${message || 'Details have been logged in the support ledger.'}"
      </div>
    </div>
  `;

  const html = getBaseEmailTemplate({
    headline,
    statusBadgeText: isReply ? 'Agent Response' : 'Ticket Queued',
    statusBadgeColor: '#b7004d',
    statusBadgeBg: '#fdf2f8',
    contentHtml,
    ctaText: 'Open Ticket & Reply',
    ctaLink: `${APP_URL}/dropshipper-support`,
    secondaryNote: `Our dedicated dispute desk reviews evidence photos within 4 to 24 business hours.`
  });

  return sendEmailSafely({ to: partnerEmail, subject: emailSubject, html });
};

/**
 * 7. Dropshipper KYC Verification Status Alert
 */
export const sendDropshipperKycStatusEmail = async ({
  partnerEmail,
  partnerName,
  storeName,
  status, // 'APPROVED' | 'REJECTED'
  rejectionReason
}) => {
  const isApproved = status === 'APPROVED';
  const headline = isApproved 
    ? 'Congratulations! Your Dropshipper Partner Account is Verified' 
    : 'Action Required: Your KYC Application Needs Attention';

  const subject = isApproved 
    ? '✅ Verified Dropshipper Partner Account Approved!' 
    : '⚠️ KYC Update Required for Your Dropshipper Account';

  const contentHtml = isApproved ? `
    <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
      Welcome to the inner circle, <strong>${partnerName || 'Partner'}</strong>! Your 4-step compliance documents, store profile, and payout bank details have been verified by the Compliance Desk.
    </p>

    <div style="background-color: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 18px; margin: 16px 0;">
      <ul style="margin: 0; padding-left: 20px; font-size: 13px; color: #065f46; line-height: 1.8;">
        <li><strong>Wholesale Sourcing:</strong> Direct B2B factory pricing unlocked.</li>
        <li><strong>Automated Escrow:</strong> 100% resell profit protection on every dispatch.</li>
        <li><strong>ROT Shield Active:</strong> Zero liability on courier returns.</li>
        <li><strong>Instant Withdrawals:</strong> Bank payouts cleared.</li>
      </ul>
    </div>
  ` : `
    <p style="font-size: 14px; color: #334155; margin: 0 0 16px 0;">
      Hello <strong>${partnerName || 'Partner'}</strong>, our compliance team reviewed your KYC submission, but some details could not be verified:
    </p>

    <div style="background-color: #fff1f2; border: 1px solid #fecdd3; border-radius: 12px; padding: 18px; margin: 16px 0;">
      <p style="font-size: 13px; font-weight: 700; color: #be123c; margin: 0 0 6px 0;">Review Note:</p>
      <p style="font-size: 13px; color: #4c0519; margin: 0;">${rejectionReason || 'Document unreadable or bank name mismatch. Please re-upload clear photos.'}</p>
    </div>
  `;

  const html = getBaseEmailTemplate({
    headline,
    statusBadgeText: isApproved ? 'Verified Partner' : 'Needs Attention',
    statusBadgeColor: isApproved ? '#059669' : '#e11d48',
    statusBadgeBg: isApproved ? '#ecfdf5' : '#fff1f2',
    storeBrandName: storeName,
    contentHtml,
    ctaText: isApproved ? 'Launch Executive Dashboard' : 'Re-upload KYC Documents',
    ctaLink: isApproved ? `${APP_URL}/dropshipper-dashboard` : `${APP_URL}/dropshipper-register`,
    secondaryNote: `If you have questions, our partner onboarding desk is available 24x7.`
  });

  return sendEmailSafely({ to: partnerEmail, subject, html });
};

