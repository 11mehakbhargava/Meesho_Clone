import crypto from 'crypto';
import { auth as firebaseAuth, serviceAccount } from '../config/firebaseAdmin.js';

// Helper to verify Firebase Custom Token cryptographically using the Service Account RSA key
const verifyFirebaseCustomToken = (token) => {
  if (!serviceAccount || !serviceAccount.private_key || !serviceAccount.client_email) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [headerB64, payloadB64, sigB64] = parts;

    const payload = JSON.parse(Buffer.from(payloadB64, 'base64url').toString('utf8'));

    // Verify issuer & expiration from Firebase
    if (payload.iss !== serviceAccount.client_email) return null;
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) return null;

    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(`${headerB64}.${payloadB64}`);
    const publicKey = crypto.createPublicKey(serviceAccount.private_key);
    const isValid = verifier.verify(publicKey, Buffer.from(sigB64, 'base64url'));

    return isValid ? payload : null;
  } catch {
    return null;
  }
};

export const verifySupplier = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'];
    }

    // 1. Verify with Firebase Authentication
    if (token) {
      if (firebaseAuth) {
        // A) Verify as Firebase ID Token
        try {
          const firebaseDecoded = await firebaseAuth.verifyIdToken(token);
          req.user = firebaseDecoded;
          req.supplierId = firebaseDecoded.uid;
          return next();
        } catch (_) {
          // B) Verify as Firebase Custom Token
          const customPayload = verifyFirebaseCustomToken(token);
          if (customPayload && customPayload.uid) {
            req.user = {
              uid: customPayload.uid,
              id: customPayload.uid,
              role: customPayload.claims?.role || 'SUPPLIER',
              email: customPayload.claims?.email,
              ...customPayload,
            };
            req.supplierId = customPayload.uid;
            return next();
          }
        }
      }

      return res.status(401).json({
        success: false,
        message: 'Invalid or expired Firebase authentication token. Please login again.',
      });
    }

    // 2. Fallback for Local Development & Testing (If header x-supplier-id or non-production environment)
    if (process.env.NODE_ENV !== 'production' || req.headers['x-supplier-id']) {
      const devSupplierId = req.headers['x-supplier-id'] || 'supplier_demo_001';
      req.supplierId = devSupplierId;
      req.user = {
        id: devSupplierId,
        role: 'SUPPLIER',
        name: 'Demo Supplier',
      };
      return next();
    }

    return res.status(401).json({
      success: false,
      message: 'Access denied: No authentication token provided.',
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};
