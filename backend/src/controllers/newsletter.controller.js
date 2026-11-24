import prisma from '../config/prisma.js';
import { sendNewsletterWelcomeEmail } from '../utils/emailTemplates.js';

/**
 * Subscribe customer or affiliate to MShoppy Newsletter
 */
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Upsert subscription into database
    const subscription = await prisma.newsletterSubscription.upsert({
      where: { email: cleanEmail },
      update: { isActive: true },
      create: {
        email: cleanEmail,
        isActive: true
      }
    });

    // Extract client origin to ensure email buttons point to the user's active client
    let clientOrigin = req.headers.origin || null;
    if (!clientOrigin && req.headers.referer) {
      try { clientOrigin = new URL(req.headers.referer).origin; } catch (_) {}
    }
    if (!clientOrigin) clientOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';

    // Send branded welcome email with WELCOME10 coupon
    sendNewsletterWelcomeEmail({ email: cleanEmail, appUrl: clientOrigin }).catch((err) => {
      console.warn('⚠️ Newsletter welcome email notice:', err.message);
    });

    return res.status(200).json({
      success: true,
      message: '🎉 You have successfully subscribed to the MShoppy Newsletter! Check your inbox for your 10% OFF coupon.',
      data: subscription
    });
  } catch (error) {
    console.error('Error in subscribeNewsletter:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter',
      error: error.message
    });
  }
};
