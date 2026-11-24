import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  restoreProduct,
  subscribeBackInStock
} from '../controllers/product.controller.js';
import { uploadProductMedia } from '../middlewares/upload.middleware.js';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', uploadProductMedia.array('images', 8), createProduct);
router.put('/:id', uploadProductMedia.array('images', 8), updateProduct);
router.delete('/:id', deleteProduct);
router.post('/:id/restore', restoreProduct);
router.post('/:id/back-in-stock', subscribeBackInStock);

export default router;


