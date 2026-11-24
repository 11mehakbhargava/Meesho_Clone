import { Router } from 'express';
import {
  checkServiceabilityHandler,
  createShipmentHandler,
  trackShipmentHandler,
  getLabelHandler
} from '../controllers/shiprocket.controller.js';

const router = Router();

// Pincode Serviceability & Courier Rates
router.post('/serviceability', checkServiceabilityHandler);

// Create Shipment & Auto AWB Assignment
router.post('/create-shipment/:orderId', createShipmentHandler);

// Live AWB Tracking
router.get('/track/:awb', trackShipmentHandler);

// Shipping Label PDF
router.get('/label/:orderId', getLabelHandler);

export default router;
