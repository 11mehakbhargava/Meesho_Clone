import { Router } from 'express';
import healthRoutes from './health.routes.js';
import supplierRoutes from './supplier.routes.js';
import supplierAuthRoutes from './supplierAuth.routes.js';
import adminAuthRoutes from './admin/adminAuth.routes.js';
import authRoutes from './auth.routes.js';
import affiliateAuthRoutes from './affiliate/affiliateAuth.routes.js';
import userAuthRoutes from './user/userAuth.routes.js';

const apiRouter = Router();

// Health check endpoint
apiRouter.use('/', healthRoutes);

// Admin Authentication endpoints
apiRouter.use('/admin-auth', adminAuthRoutes);

// Supplier Authentication endpoints
apiRouter.use('/supplier/auth', supplierAuthRoutes);
apiRouter.use('/auth/supplier', supplierAuthRoutes);

// Supplier module (protected catalog, inventory, orders, profile)
apiRouter.use('/supplier', supplierRoutes);

// Auth module (Reseller, Customer, Affiliate general endpoints)
apiRouter.use('/auth', authRoutes);

// Dedicated affiliate and user auth routes
apiRouter.use('/affiliate/auth', affiliateAuthRoutes);
apiRouter.use('/auth/affiliate', affiliateAuthRoutes);
apiRouter.use('/affiliate-auth', affiliateAuthRoutes);
apiRouter.use('/user/auth', userAuthRoutes);
apiRouter.use('/auth/user', userAuthRoutes);
apiRouter.use('/user-auth', userAuthRoutes);
// apiRouter.use('/products', productRoutes);
// apiRouter.use('/orders', orderRoutes);
// apiRouter.use('/kyc', kycRoutes);
// apiRouter.use('/returns', returnRoutes);

export default apiRouter;
