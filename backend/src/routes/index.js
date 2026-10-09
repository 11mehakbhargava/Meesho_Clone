import { Router } from 'express';
import healthRoutes from './health.routes.js';
import supplierRoutes from './supplier.routes.js';
import supplierAuthRoutes from './supplierAuth.routes.js';
import adminAuthRoutes from './admin/adminAuth.routes.js';

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

// Other module placeholders
// apiRouter.use('/auth', authRoutes);
// apiRouter.use('/products', productRoutes);
// apiRouter.use('/orders', orderRoutes);
// apiRouter.use('/kyc', kycRoutes);
// apiRouter.use('/returns', returnRoutes);

export default apiRouter;
