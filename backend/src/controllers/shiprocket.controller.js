import prisma from '../config/prisma.js';
import {
  checkPincodeServiceability,
  createShiprocketOrder,
  assignShiprocketAWB,
  generateShiprocketLabel,
  trackShiprocketByAWB,
  requestShiprocketPickup
} from '../services/shiprocket.service.js';
import { sendOrderDispatchedEmail } from '../services/dropshipperEmail.service.js';
import { sendOrderDispatchedPush } from '../services/fcm.service.js';

/**
 * 1. CHECK PINCODE SERVICEABILITY
 * POST /api/v1/shiprocket/serviceability
 * Body: { deliveryPostcode, pickupPostcode, weight, isCod }
 */
export const checkServiceabilityHandler = async (req, res) => {
  try {
    const { deliveryPostcode, pickupPostcode, weight, isCod } = req.body || {};

    if (!deliveryPostcode) {
      return res.status(400).json({
        success: false,
        message: 'deliveryPostcode is required (6 digits).'
      });
    }

    const result = await checkPincodeServiceability({
      deliveryPostcode,
      pickupPostcode,
      weight: Number(weight || 0.5),
      isCod: Boolean(isCod)
    });

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Shiprocket Serviceability Controller Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to check pincode serviceability'
    });
  }
};

/**
 * 2. DISPATCH ORDER VIA SHIPROCKET (Create Order + Assign AWB + Get Label)
 * POST /api/v1/shiprocket/create-shipment/:orderId
 * Body: { courierId, pickupLocation, weight, dimensions }
 */
export const createShipmentHandler = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { courierId, pickupLocation = 'Primary', weight = 0.5, dimensions } = req.body || {};

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId is required.' });
    }

    // 1. Fetch full authoritative order details from PostgreSQL
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // 2. Create Adhoc Order in Shiprocket
    const orderResult = await createShiprocketOrder({
      order,
      pickupLocation,
      weight,
      dimensions
    });

    const shipmentId = orderResult.shipmentId;
    if (!shipmentId) {
      throw new Error('Shiprocket did not return a valid shipmentId.');
    }

    // 3. Assign AWB to Shipment
    let awbResult = {};
    try {
      awbResult = await assignShiprocketAWB({ shipmentId, courierId });
    } catch (awbErr) {
      console.warn('AWB auto-assign warning:', awbErr.message);
    }

    // 4. Generate Shipping Label PDF URL
    let labelUrl = null;
    try {
      const labelResult = await generateShiprocketLabel(shipmentId);
      labelUrl = labelResult.labelUrl || null;
    } catch (lblErr) {
      console.warn('Label auto-generation warning:', lblErr.message);
    }

    // 5. Update Order in PostgreSQL Database
    const currentAddr = typeof order.shippingAddress === 'string'
      ? JSON.parse(order.shippingAddress || '{}')
      : (order.shippingAddress || {});

    const awbNumber = awbResult.awbNumber || null;
    const courierName = awbResult.courierName || 'Delhivery Express';
    const trackingUrl = awbNumber ? `https://www.delhivery.com/track/package/${awbNumber}` : '';

    const updatedShippingAddress = {
      ...currentAddr,
      awb: awbNumber,
      trackingNumber: awbNumber,
      courier: courierName,
      courierPartner: courierName,
      trackingUrl,
      labelUrl,
      shiprocketOrderId: orderResult.orderId,
      shiprocketShipmentId: shipmentId,
      shippedAt: new Date().toISOString()
    };

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        orderStatus: 'SHIPPED',
        shippingAddress: updatedShippingAddress
      }
    });

    // 6. Asynchronously dispatch Email & FCM Push Notification to Customer
    const customerEmail = currentAddr.email || order.user?.email;
    if (customerEmail && awbNumber) {
      sendOrderDispatchedEmail({
        to: customerEmail,
        isCustomer: true,
        recipientName: currentAddr.fullName || order.user?.fullName || 'Valued Customer',
        orderId: order.id,
        courierName,
        awbNumber,
        destinationCity: currentAddr.city || 'your address'
      }).catch((e) => console.error('Error sending dispatch email:', e.message));
    }

    if (order.userId && awbNumber) {
      sendOrderDispatchedPush({
        userId: order.userId,
        orderId: order.id,
        courierName,
        trackingNumber: awbNumber
      }).catch((e) => console.error('Error sending dispatch push:', e.message));
    }

    return res.status(200).json({
      success: true,
      message: `Order successfully booked with Shiprocket via ${courierName}!`,
      data: {
        orderId: order.id,
        orderStatus: 'SHIPPED',
        shiprocketOrderId: orderResult.orderId,
        shipmentId,
        awbNumber,
        courierName,
        labelUrl,
        trackingUrl
      }
    });
  } catch (error) {
    console.error('Shiprocket Create Shipment Controller Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to create shipment on Shiprocket'
    });
  }
};

/**
 * 3. LIVE SHIPMENT TRACKING
 * GET /api/v1/shiprocket/track/:awb
 */
export const trackShipmentHandler = async (req, res) => {
  try {
    const { awb } = req.params;

    if (!awb) {
      return res.status(400).json({ success: false, message: 'AWB number is required.' });
    }

    const trackingData = await trackShiprocketByAWB(awb);

    return res.status(200).json({
      success: true,
      data: trackingData
    });
  } catch (error) {
    console.error('Shiprocket Tracking Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch live tracking details'
    });
  }
};

/**
 * 4. DOWNLOAD SHIPPING LABEL
 * GET /api/v1/shiprocket/label/:orderId
 */
export const getLabelHandler = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    const shipping = typeof order.shippingAddress === 'string'
      ? JSON.parse(order.shippingAddress || '{}')
      : (order.shippingAddress || {});

    if (shipping.labelUrl) {
      return res.status(200).json({
        success: true,
        labelUrl: shipping.labelUrl
      });
    }

    const shipmentId = shipping.shiprocketShipmentId;
    if (!shipmentId) {
      return res.status(400).json({
        success: false,
        message: 'No active Shiprocket shipment found for this order.'
      });
    }

    const labelResult = await generateShiprocketLabel(shipmentId);
    return res.status(200).json({
      success: true,
      labelUrl: labelResult.labelUrl
    });
  } catch (error) {
    console.error('Shiprocket Label Error:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch shipping label'
    });
  }
};
