import crypto from 'crypto';
import transporter from '../config/emailTransporter.js';

// In-memory thread-safe store with auto-expiry
// Map<identifier, { otp, email, phone, expiresAt, lastSentAt, attempts, verified, token, tokenExpiresAt, amount }>
const otpStore = new Map();

// Periodic cleanup of expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of otpStore.entries()) {
    if (data.expiresAt < now && (!data.tokenExpiresAt || data.tokenExpiresAt < now)) {
      otpStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Generate high-converting branded HTML email for COD Order Security Verification
 */
export const getCodOtpEmailHtml = ({ otp, name, orderAmount, shortId }) => {
  const safeName = name && name.trim() ? name.trim() : 'Valued Customer';
  const amountStr = orderAmount ? Number(orderAmount).toLocaleString('en-IN') : '0';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Cash on Delivery Order - MShoppy</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #fff4f6;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 560px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 15px 35px rgba(183, 0, 77, 0.08);
      border: 1px solid #ffe2e8;
    }
    .header-banner {
      background: linear-gradient(135deg, #9f0038 0%, #b7004d 50%, #ff527b 100%);
      padding: 34px 28px;
      text-align: center;
      color: #ffffff;
    }
    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.22);
      padding: 5px 16px;
      border-radius: 50px;
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 10px;
      border: 1px solid rgba(255, 255, 255, 0.35);
    }
    .title {
      font-size: 26px;
      font-weight: 900;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .content {
      padding: 34px 32px;
      color: #334155;
    }
    .otp-card {
      background: #fff0f3;
      border: 2px dashed #b7004d;
      border-radius: 18px;
      padding: 24px;
      text-align: center;
      margin: 24px 0;
    }
    .otp-code {
      font-size: 42px;
      font-weight: 900;
      letter-spacing: 12px;
      color: #b7004d;
      font-family: 'SFMono-Regular', Consolas, Monaco, monospace;
      margin: 0;
      padding-left: 12px;
    }
    .otp-expiry {
      font-size: 12px;
      color: #9f0038;
      font-weight: 700;
      margin-top: 8px;
    }
    .order-summary-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      padding: 16px 20px;
      margin-bottom: 22px;
      font-size: 13.5px;
    }
    .security-notice {
      background: #fff8f9;
      border-left: 4px solid #b7004d;
      border-radius: 8px;
      padding: 14px 16px;
      font-size: 12px;
      color: #475569;
      line-height: 1.5;
    }
    .footer {
      background: #fafafa;
      padding: 20px 30px;
      text-align: center;
      border-top: 1px solid #f1f5f9;
      font-size: 11px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header-banner">
      <div class="badge">🔒 COD ORDER VERIFICATION</div>
      <h1 class="title">Confirm Your Order</h1>
      <p style="margin: 6px 0 0 0; font-size: 13px; opacity: 0.95;">Verification code for Cash on Delivery checkout</p>
    </div>

    <div class="content">
      <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 10px 0;">
        Hello ${safeName}, 👋
      </h2>
      <p style="font-size: 14px; line-height: 1.6; color: #475569; margin: 0 0 18px 0;">
        You have initiated a <strong>Cash on Delivery (COD)</strong> order on MShoppy. To verify your contact details and finalize your booking, please enter the one-time security code below:
      </p>

      <div class="otp-card">
        <div class="otp-code">${otp}</div>
        <div class="otp-expiry">⏱️ Valid for 5 minutes &bull; Resend in 30s</div>
      </div>

      <div class="order-summary-box">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="color: #64748b; font-weight: 600; padding: 4px 0;">Payment Method:</td>
            <td style="text-align: right; font-weight: 800; color: #d97706; padding: 4px 0;">Cash on Delivery (COD)</td>
          </tr>
          <tr>
            <td style="color: #0f172a; font-weight: 800; font-size: 15px; padding-top: 8px; border-top: 1px dashed #cbd5e1;">Amount to Pay at Doorstep:</td>
            <td style="text-align: right; color: #9f0038; font-weight: 900; font-size: 16px; padding-top: 8px; border-top: 1px dashed #cbd5e1;">₹${amountStr}</td>
          </tr>
        </table>
      </div>

      <div class="security-notice">
        <strong style="color: #9f0038;">🛡️ Security Notice:</strong>
        This verification ensures protection against unauthorized orders. Never share this code with anyone. Your order will be processed and dispatched immediately upon entering this code on the checkout screen.
      </div>
    </div>

    <div class="footer">
      <p style="margin: 0 0 4px 0; font-weight: 600;">© 2026 MShoppy Internet Commerce. All rights reserved.</p>
      <p style="margin: 0;">Automated System Notification &bull; Do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
};

/**
 * Generate 6-digit cryptographically secure numeric OTP
 */
const generateSecureOtp = () => {
  return Math.floor(100000 + crypto.randomInt(900000)).toString();
};

/**
 * Send COD Order OTP to customer email & return cooldown/session info
 */
export const sendCodOtp = async ({ email, phone, orderAmount, recipientName }) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').trim();

  const identifier = cleanEmail || cleanPhone;
  if (!identifier) {
    throw new Error('Customer email or phone is required for COD verification.');
  }

  const existing = otpStore.get(identifier);
  const now = Date.now();

  // Enforce 30-second resend cooldown
  if (existing && existing.lastSentAt && (now - existing.lastSentAt < 30000)) {
    const remaining = Math.ceil((30000 - (now - existing.lastSentAt)) / 1000);
    return {
      success: false,
      message: `Please wait ${remaining}s before requesting a new OTP.`,
      cooldown: remaining
    };
  }

  const otp = generateSecureOtp();
  const expiresAt = now + 5 * 60 * 1000; // 5 minutes validity

  otpStore.set(identifier, {
    otp,
    email: cleanEmail,
    phone: cleanPhone,
    orderAmount,
    expiresAt,
    lastSentAt: now,
    attempts: 0,
    verified: false,
    token: null,
    tokenExpiresAt: null
  });

  // Dispatch branded email via SMTP
  let emailSent = false;
  let emailError = null;

  if (cleanEmail && cleanEmail.includes('@') && !cleanEmail.endsWith('@customer.meesho')) {
    try {
      const html = getCodOtpEmailHtml({
        otp,
        name: recipientName,
        orderAmount
      });

      const sender = process.env.EMAIL_FROM || `"MShoppy Orders" <${process.env.SMTP_USER || 'pramodlodhi2003born@gmail.com'}>`;
      const info = await transporter.sendMail({
        from: sender,
        to: cleanEmail,
        subject: `🔐 Cash on Delivery (COD) Order Verification OTP: ${otp}`,
        html
      });

      console.log(`✅ [COD OTP] Verification code sent to ${cleanEmail} (Message ID: ${info.messageId})`);
      emailSent = true;
    } catch (err) {
      console.error('❌ [COD OTP] Error sending email:', err.message);
      emailError = err.message;
    }
  }

  // Also log for sandbox / development visibility
  console.log(`\n========================================\n[COD OTP GENERATED]\nTarget: ${identifier}\nOTP Code: ${otp}\nOrder Amount: ₹${orderAmount}\nExpires: 5 Minutes\n========================================\n`);

  return {
    success: true,
    message: emailSent
      ? `Verification OTP sent to ${cleanEmail}`
      : 'Verification OTP sent to your registered contact.',
    cooldown: 30,
    expiresIn: 300,
    emailSent
  };
};

/**
 * Verify COD Order OTP and return signed verification token
 */
export const verifyCodOtp = ({ email, phone, otp }) => {
  const cleanEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').trim();
  const identifier = cleanEmail || cleanPhone;

  if (!identifier) {
    return { success: false, message: 'Customer identifier is required.' };
  }

  const record = otpStore.get(identifier);
  if (!record) {
    return { success: false, message: 'No active OTP found. Please request a new verification code.' };
  }

  const now = Date.now();
  if (record.expiresAt < now) {
    otpStore.delete(identifier);
    return { success: false, message: 'OTP has expired (validity is 5 minutes). Please click Resend.' };
  }

  if (record.attempts >= 5) {
    otpStore.delete(identifier);
    return { success: false, message: 'Maximum verification attempts exceeded. Please request a new OTP.' };
  }

  record.attempts += 1;

  const cleanInputOtp = (otp || '').toString().trim();
  if (cleanInputOtp !== record.otp) {
    const remaining = 5 - record.attempts;
    return {
      success: false,
      message: `Invalid OTP code. Please check and try again (${remaining} attempt${remaining === 1 ? '' : 's'} remaining).`
    };
  }

  // Mark verified and generate single-use cryptographically random verification token
  const codVerificationToken = `COD_VERIF_${crypto.randomBytes(24).toString('hex')}`;
  record.verified = true;
  record.token = codVerificationToken;
  record.tokenExpiresAt = now + 15 * 60 * 1000; // 15 minutes to complete order creation

  // Save by token as well for O(1) lookup
  otpStore.set(codVerificationToken, {
    identifier,
    email: record.email,
    phone: record.phone,
    verified: true,
    tokenExpiresAt: record.tokenExpiresAt
  });

  console.log(`✅ [COD OTP Verified] Customer ${identifier} verified. Token: ${codVerificationToken.slice(0, 20)}...`);

  return {
    success: true,
    message: 'OTP verified successfully! Finalizing your Cash on Delivery order...',
    codVerificationToken
  };
};

/**
 * Validates and single-use consumes the verification token during order creation
 */
export const validateCodVerificationToken = (token, email) => {
  if (!token || typeof token !== 'string') return false;

  const entry = otpStore.get(token);
  if (!entry) return false;

  const now = Date.now();
  if (!entry.verified || (entry.tokenExpiresAt && entry.tokenExpiresAt < now)) {
    otpStore.delete(token);
    return false;
  }

  // Single-use: delete immediately to prevent duplicate orders with same token
  otpStore.delete(token);
  if (entry.identifier) {
    otpStore.delete(entry.identifier);
  }

  return true;
};
