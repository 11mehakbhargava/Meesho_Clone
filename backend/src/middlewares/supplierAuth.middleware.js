import jwt from 'jsonwebtoken';
import { auth as firebaseAuth } from '../config/firebaseAdmin.js';

const JWT_SECRET = process.env.JWT_SECRET || 'meesho_supplier_super_secret_jwt_token_2026';

export const verifySupplier = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.headers['x-access-token']) {
      token = req.headers['x-access-token'];
    }

    // 1. Try Custom JWT Token
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        req.supplierId = decoded.id || decoded.userId;
        return next();
      } catch (jwtErr) {
        // If JWT failed, check if Firebase token verification is available
        if (firebaseAuth) {
          try {
            const firebaseDecoded = await firebaseAuth.verifyIdToken(token);
            req.user = firebaseDecoded;
            req.supplierId = firebaseDecoded.uid;
            return next();
          } catch (fbErr) {
            return res.status(401).json({
              success: false,
              message: 'Invalid or expired session token. Please login again.',
            });
          }
        } else {
          return res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token. Please login again.',
          });
        }
      }
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
