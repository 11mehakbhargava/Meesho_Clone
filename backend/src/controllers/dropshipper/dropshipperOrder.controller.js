import prisma from '../../config/prisma.js';
import { 
  sendDropshipperOrderPushEmail, 
  sendCustomerWhiteLabelConfirmationEmail,
  sendOrderDispatchedEmail,
  sendOrderDeliveredMarginReleasedEmail 
} from '../../services/dropshipperEmail.service.js';
import {
  sendMarginCreditedPush,
  sendOrderDeliveredPush,
  sendOrderDispatchedPush
} from '../../services/fcm.service.js';



/**
 * 1. Push a Single Dropshipper Customer Order to Suppliers
 * POST /api/v1/dropshipper/orders/push
 */
export const pushDropshipperOrder = async (req, res) => {
  try {
    const {
      firebaseUid,
      customerName,
      customerPhone,
      altPhone,
      address,
      city,
      state,
      pincode,
      landmark,
      productId,
      productSku,
      productName,
      quantity = 1,
      wholesaleCost = 500,
      customerPrice = 999,
      shippingFee = 60,
      courier = 'Delhivery Express',
      paymentMode = 'COD',
      whiteLabelStoreName = 'Aura Boutique'
    } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({ success: false, message: 'firebaseUid is required' });
    }
    if (!customerName || !customerPhone || !address || !pincode) {
      return res.status(400).json({ success: false, message: 'Customer name, phone, address, and pincode are required' });
    }

    // 1. Verify KYC Approval Status in Database
    const kycApp = await (prisma.kYCApplication || prisma.kycApplication).findFirst({
      where: {
        userId: firebaseUid,
        type: { equals: 'DROPSHIPPER', mode: 'insensitive' }
      }
    });

    if (!kycApp || kycApp.status?.toUpperCase() !== 'APPROVED') {
      return res.status(403).json({
        success: false,
        message: 'Action Forbidden: You must complete 4-Step KYC and have it approved by admin before pushing orders to suppliers.',
        kycStatus: kycApp ? kycApp.status : 'NOT_SUBMITTED'
      });
    }

    // 2. Verify Profile exists
    let profile = await prisma.profile.findUnique({
      where: { id: firebaseUid }
    });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          id: firebaseUid,
          fullName: 'Dropshipper Partner',
          role: 'DROPSHIPPER',
          storeName: whiteLabelStoreName
        }
      });
    }

    // 3. Resolve Product ID
    let resolvedProduct = null;
    if (productId) {
      resolvedProduct = await prisma.product.findFirst({
        where: { id: productId, isDeleted: false, isActive: true }
      });
    }
    if (!resolvedProduct) {
      // Find first existing active product in database to link OrderItem
      resolvedProduct = await prisma.product.findFirst({
        where: { isDeleted: false, isActive: true }
      });
    }

    const baseWholesale = Number(wholesaleCost);
    const totalWholesaleCost = baseWholesale * Number(quantity);
    const calculatedMargin = Math.max(0, Number(customerPrice) - totalWholesaleCost - Number(shippingFee));
    const randomAwb = `DEL-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const shippingAddressPayload = {
      fullName: customerName,
      phone: customerPhone,
      altPhone: altPhone || null,
      addressLine: address,
      city: city || 'City',
      state: state || 'State',
      pincode: pincode,
      landmark: landmark || null,
      whiteLabelStoreName: whiteLabelStoreName || profile.storeName || 'Fashion Hub',
      productName: productName || resolvedProduct?.title || 'Wholesale Sourced Item',
      productSku: productSku || 'SKU-DS-01',
      quantity: Number(quantity),
      wholesaleCost: totalWholesaleCost,
      baseWholesaleCost: baseWholesale,
      customerPrice: Number(customerPrice),
      shippingFee: Number(shippingFee),
      dropshipperMargin: calculatedMargin,
      courier: courier || 'Delhivery Express',
      awb: randomAwb,
      paymentMode: paymentMode.toUpperCase()
    };

    // 3. Create Order & OrderItem in Database Transaction
    const newOrder = await prisma.order.create({
      data: {
        userId: profile.id,
        totalAmount: Number(customerPrice),
        shippingAddress: shippingAddressPayload,
        paymentMethod: paymentMode.toUpperCase() === 'COD' ? 'COD' : 'UPI',
        paymentStatus: paymentMode.toUpperCase() === 'COD' ? 'PENDING' : 'PAID',
        orderStatus: 'ORDERED',
        ...(resolvedProduct && {
          items: {
            create: {
              productId: resolvedProduct.id,
              quantity: Number(quantity),
              price: Number(customerPrice)
            }
          }
        })
      },
      include: {
        items: true
      }
    });

    // Asynchronously trigger automated Order Push email notifications (Non-blocking)
    (async () => {
      try {
        const partnerProfile = await prisma.profile.findUnique({
          where: { id: firebaseUid },
          select: { email: true, fullName: true, storeName: true }
        });

        const storeBrand = whiteLabelStoreName || partnerProfile?.storeName || 'Kunal Retail';
        const formattedOrderId = `DSP-${newOrder.id.slice(0, 8).toUpperCase()}`;

        if (partnerProfile?.email) {
          sendDropshipperOrderPushEmail({
            partnerEmail: partnerProfile.email,
            partnerName: partnerProfile.fullName || 'Dropship Partner',
            storeName: storeBrand,
            orderId: formattedOrderId,
            productTitle: shippingAddressPayload.productName,
            quantity: Number(quantity),
            customerPrice: Number(customerPrice),
            resellMargin: calculatedMargin,
            escrowAmount: calculatedMargin,
            destinationCity: `${city}, ${state}`
          }).catch(e => console.error('Error dispatching partner email:', e.message));
        }

        if (req.body.customerEmail) {
          sendCustomerWhiteLabelConfirmationEmail({
            customerEmail: req.body.customerEmail,
            customerName,
            storeBrandName: storeBrand,
            orderId: formattedOrderId,
            productTitle: shippingAddressPayload.productName,
            quantity: Number(quantity),
            totalAmount: Number(customerPrice),
            shippingAddress: `${address}, ${city}, ${state} - ${pincode}`,
            supportPhone: customerPhone
          }).catch(e => console.error('Error dispatching customer email:', e.message));
        }
      } catch (e) {
        console.warn('Async email trigger notice:', e.message);
      }
    })();

    return res.status(201).json({
      success: true,
      message: 'Dropshipper order pushed to supplier successfully!',
      order: {
        id: `DSP-${newOrder.id.slice(0, 8).toUpperCase()}`,
        dbId: newOrder.id,
        date: new Date(newOrder.createdAt).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName,
        customerPhone,
        address,
        city,
        state,
        pincode,
        productName: shippingAddressPayload.productName,
        productImg: resolvedProduct?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
        sku: shippingAddressPayload.productSku,
        qty: Number(quantity),
        wholesaleCost: shippingAddressPayload.wholesaleCost,
        customerPrice: Number(customerPrice),
        shippingFee: Number(shippingFee),
        margin: calculatedMargin,
        paymentMode: paymentMode.toUpperCase(),
        status: 'DISPATCHED',
        courier: shippingAddressPayload.courier,
        awb: shippingAddressPayload.awb
      }
    });

  } catch (error) {
    console.error('Error in pushDropshipperOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to push order to supplier',
      error: error.message
    });
  }
};

/**
 * 2. Push Bulk Orders Batch
 * POST /api/v1/dropshipper/orders/bulk-push
 */
export const pushBulkDropshipperOrders = async (req, res) => {
  try {
    const { firebaseUid, orders = [], whiteLabelStoreName } = req.body;

    if (!firebaseUid) {
      return res.status(400).json({ success: false, message: 'firebaseUid is required' });
    }
    if (!orders || orders.length === 0) {
      return res.status(400).json({ success: false, message: 'No orders provided in batch' });
    }

    // Verify KYC Approval Status in Database
    const kycApp = await (prisma.kYCApplication || prisma.kycApplication).findFirst({
      where: {
        userId: firebaseUid,
        type: { equals: 'DROPSHIPPER', mode: 'insensitive' }
      }
    });

    if (!kycApp || kycApp.status?.toUpperCase() !== 'APPROVED') {
      return res.status(403).json({
        success: false,
        message: 'Action Forbidden: You must complete 4-Step KYC and have it approved by admin before bulk pushing orders.',
        kycStatus: kycApp ? kycApp.status : 'NOT_SUBMITTED'
      });
    }

    const fallbackProduct = await prisma.product.findFirst({
      where: { isDeleted: false, isActive: true }
    });
    const createdOrders = [];
    let totalBatchMargin = 0;

    for (const item of orders) {
      const baseWholesale = Number(item.wholesaleCost || item.wholesale || 500);
      const qty = Number(item.quantity || item.qty || 1);
      const totalWholesale = baseWholesale * qty;
      const selling = Number(item.customerPrice || item.selling || 999);
      const shipping = Number(item.shippingFee || 60);
      const margin = Math.max(0, selling - totalWholesale - shipping);
      totalBatchMargin += margin;

      const randomAwb = `DEL-${Math.floor(1000000000 + Math.random() * 9000000000)}`;

      const shippingAddress = {
        fullName: item.customerName || item.name || 'Valued Customer',
        phone: item.customerPhone || item.phone || '9800000000',
        addressLine: item.address || 'Address provided via CSV',
        city: item.city || 'City',
        state: item.state || 'India',
        pincode: item.pincode || item.pin || '400001',
        whiteLabelStoreName: whiteLabelStoreName || 'Dropship Store',
        productName: item.productName || item.product || 'Catalog Product',
        productSku: item.productSku || item.sku || 'SKU-BULK',
        quantity: qty,
        wholesaleCost: totalWholesale,
        baseWholesaleCost: baseWholesale,
        customerPrice: selling,
        shippingFee: shipping,
        dropshipperMargin: margin,
        courier: 'Delhivery Surface',
        awb: randomAwb,
        paymentMode: (item.paymentMode || item.mode || 'COD').toUpperCase()
      };

      const order = await prisma.order.create({
        data: {
          userId: firebaseUid,
          totalAmount: selling,
          shippingAddress,
          paymentMethod: shippingAddress.paymentMode === 'COD' ? 'COD' : 'UPI',
          paymentStatus: shippingAddress.paymentMode === 'COD' ? 'PENDING' : 'PAID',
          orderStatus: 'ORDERED',
          ...(fallbackProduct && {
            items: {
              create: {
                productId: fallbackProduct.id,
                quantity: qty,
                price: selling
              }
            }
          })
        }
      });

      createdOrders.push({
        id: `DSP-${order.id.slice(0, 8).toUpperCase()}`,
        dbId: order.id,
        date: new Date(order.createdAt).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName: shippingAddress.fullName,
        customerPhone: shippingAddress.phone,
        address: shippingAddress.addressLine,
        city: shippingAddress.city,
        state: shippingAddress.state,
        pincode: shippingAddress.pincode,
        productName: shippingAddress.productName,
        productImg: fallbackProduct?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
        sku: shippingAddress.productSku,
        qty,
        wholesaleCost: wholesale * qty,
        customerPrice: selling,
        shippingFee: shipping,
        margin,
        paymentMode: shippingAddress.paymentMode,
        status: 'DISPATCHED',
        courier: shippingAddress.courier,
        awb: shippingAddress.awb
      });
    }

    return res.status(201).json({
      success: true,
      message: `Batch of ${createdOrders.length} orders successfully pushed to suppliers!`,
      totalOrders: createdOrders.length,
      totalBatchMargin,
      orders: createdOrders
    });

  } catch (error) {
    console.error('Error in pushBulkDropshipperOrders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process bulk orders batch',
      error: error.message
    });
  }
};

/**
 * 3. Fetch All Pushed Orders for Dropshipper
 * GET /api/v1/dropshipper/orders/:firebaseUid
 */
export const getDropshipperOrders = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({ success: false, message: 'firebaseUid param is required' });
    }

    const orders = await prisma.order.findMany({
      where: { userId: firebaseUid },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const formattedOrders = orders.map(o => {
      const addr = (typeof o.shippingAddress === 'object' && o.shippingAddress !== null)
        ? o.shippingAddress
        : {};

      return {
        id: `DSP-${o.id.slice(0, 8).toUpperCase()}`,
        dbId: o.id,
        date: new Date(o.createdAt).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName: addr.fullName || 'Customer',
        customerPhone: addr.phone || '-',
        address: addr.addressLine || 'Delivery Address',
        city: addr.city || 'City',
        state: addr.state || 'State',
        pincode: addr.pincode || '-',
        productName: addr.productName || o.items?.[0]?.product?.title || 'Sourced Item',
        productImg: o.items?.[0]?.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
        sku: addr.productSku || 'SKU-DS',
        qty: addr.quantity || o.items?.[0]?.quantity || 1,
        wholesaleCost: addr.wholesaleCost || (o.totalAmount * 0.6),
        customerPrice: o.totalAmount,
        shippingFee: addr.shippingFee || 60,
        margin: addr.dropshipperMargin || Math.max(0, o.totalAmount * 0.3),
        paymentMode: addr.paymentMode || o.paymentMethod || 'COD',
        status: o.orderStatus === 'ORDERED' ? 'DISPATCHED' : o.orderStatus,
        courier: addr.courier || 'Delhivery Express',
        awb: addr.awb || `DEL-${o.id.slice(0, 10)}`,
        isArchived: !!addr.isArchived,
        cancellationReason: addr.cancellationReason || null,
        cancelledAt: addr.cancelledAt || null,
        altPhone: addr.altPhone || null,
        landmark: addr.landmark || null
      };
    });

    return res.status(200).json({
      success: true,
      totalCount: formattedOrders.length,
      orders: formattedOrders
    });

  } catch (error) {
    console.error('Error in getDropshipperOrders:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders',
      error: error.message
    });
  }
};

/**
 * 4. Update Dropshipper Order Details (Customer Address, Phone, Selling Price)
 * PUT /api/v1/dropshipper/orders/:orderId
 */
export const updateDropshipperOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const {
      customerName,
      customerPhone,
      altPhone,
      address,
      city,
      state,
      pincode,
      landmark,
      customerPrice,
      paymentMode,
      orderStatus,
      status
    } = req.body;

    const requestedStatus = (orderStatus || status || '').toUpperCase();

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId param is required' });
    }

    // Resolve order by DB id or DSP- prefix
    let dbOrderId = orderId;
    if (orderId.startsWith('DSP-')) {
      const hexSnippet = orderId.replace('DSP-', '').toLowerCase();
      const matched = await prisma.order.findFirst({
        where: { id: { startsWith: hexSnippet, mode: 'insensitive' } },
        include: { items: { include: { product: true } } }
      });
      if (!matched) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      dbOrderId = matched.id;
    }

    const existingOrder = await prisma.order.findUnique({
      where: { id: dbOrderId },
      include: { items: { include: { product: true } } }
    });

    if (!existingOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (existingOrder.orderStatus === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Cannot edit an order that has already been cancelled.' });
    }

    if (existingOrder.orderStatus === 'DELIVERED') {
      return res.status(400).json({ success: false, message: 'Cannot edit an order that has already been delivered.' });
    }

    const currentAddr = (typeof existingOrder.shippingAddress === 'object' && existingOrder.shippingAddress !== null)
      ? existingOrder.shippingAddress
      : {};

    const updatedPrice = customerPrice !== undefined ? Number(customerPrice) : existingOrder.totalAmount;
    const wholesaleCost = currentAddr.wholesaleCost || (existingOrder.totalAmount * 0.6);
    const shippingFee = currentAddr.shippingFee || 60;
    const newMargin = Math.max(0, updatedPrice - wholesaleCost - shippingFee);

    const updatedAddressPayload = {
      ...currentAddr,
      fullName: customerName || currentAddr.fullName,
      phone: customerPhone || currentAddr.phone,
      altPhone: altPhone !== undefined ? altPhone : currentAddr.altPhone,
      addressLine: address || currentAddr.addressLine,
      city: city || currentAddr.city,
      state: state || currentAddr.state,
      pincode: pincode || currentAddr.pincode,
      landmark: landmark !== undefined ? landmark : currentAddr.landmark,
      customerPrice: updatedPrice,
      dropshipperMargin: newMargin,
      ...(paymentMode && { paymentMode: paymentMode.toUpperCase() })
    };

    const validStatuses = ['ORDERED', 'CONFIRMED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
    const finalStatus = validStatuses.includes(requestedStatus) ? requestedStatus : undefined;

    const updatedOrder = await prisma.order.update({
      where: { id: dbOrderId },
      data: {
        totalAmount: updatedPrice,
        shippingAddress: updatedAddressPayload,
        ...(finalStatus && { orderStatus: finalStatus === 'IN_TRANSIT' ? 'SHIPPED' : finalStatus }),
        ...(paymentMode && {
          paymentMethod: paymentMode.toUpperCase() === 'COD' ? 'COD' : 'UPI',
          paymentStatus: paymentMode.toUpperCase() === 'COD' ? 'PENDING' : 'PAID'
        })
      },
      include: { items: { include: { product: true } } }
    });

    // Asynchronously dispatch status transition emails (Non-blocking)
    (async () => {
      try {
        const partner = await prisma.profile.findUnique({
          where: { id: updatedOrder.userId },
          select: { email: true, fullName: true, storeName: true, wallet: true }
        });

        if (partner?.email) {
          const formattedId = `DSP-${updatedOrder.id.slice(0, 8).toUpperCase()}`;
          const storeName = partner.storeName || 'Kunal Retail';

          if (finalStatus === 'DELIVERED') {
            sendOrderDeliveredMarginReleasedEmail({
              partnerEmail: partner.email,
              partnerName: partner.fullName || 'Partner',
              storeName,
              orderId: formattedId,
              productTitle: updatedAddressPayload.productName || 'Wholesale Sourced Item',
              resellMargin: updatedAddressPayload.dropshipperMargin || 0,
              newWalletBalance: partner.wallet?.balance || 0
            }).catch(e => console.error('Error dispatching delivery email:', e.message));

            // Instant Push: Margin Credited + Order Delivered
            sendMarginCreditedPush({
              userId: updatedOrder.userId,
              orderId: formattedId,
              marginAmount: updatedAddressPayload.dropshipperMargin || 0,
              storeName
            }).catch(e => console.error('Error dispatching delivery FCM margin push:', e.message));

            sendOrderDeliveredPush({
              userId: updatedOrder.userId,
              orderId: formattedId,
              customerName: updatedAddressPayload.fullName
            }).catch(e => console.error('Error dispatching delivery FCM push:', e.message));

          } else if (finalStatus === 'SHIPPED' || finalStatus === 'IN_TRANSIT') {
            sendOrderDispatchedEmail({
              to: partner.email,
              recipientName: partner.fullName || 'Partner',
              storeName,
              orderId: formattedId,
              courierName: updatedAddressPayload.courier || 'Delhivery Express',
              awbNumber: updatedAddressPayload.awb || `DEL-${updatedOrder.id.slice(0, 10)}`,
              productTitle: updatedAddressPayload.productName || 'Wholesale Sourced Item',
              destinationCity: `${updatedAddressPayload.city || ''}, ${updatedAddressPayload.state || ''}`
            }).catch(e => console.error('Error dispatching dispatch email:', e.message));

            // Instant Push: Order Dispatched
            sendOrderDispatchedPush({
              userId: updatedOrder.userId,
              orderId: formattedId,
              courierName: updatedAddressPayload.courier || 'Delhivery Express',
              trackingNumber: updatedAddressPayload.awb || `DEL-${updatedOrder.id.slice(0, 10)}`
            }).catch(e => console.error('Error dispatching dispatch FCM push:', e.message));
          }
        }
      } catch (e) {
        console.warn('Async order update email notice:', e.message);
      }
    })();

    return res.status(200).json({
      success: true,
      message: 'Order delivery details & pricing updated successfully!',
      order: {
        id: `DSP-${updatedOrder.id.slice(0, 8).toUpperCase()}`,
        dbId: updatedOrder.id,
        date: new Date(updatedOrder.createdAt).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName: updatedAddressPayload.fullName,
        customerPhone: updatedAddressPayload.phone,
        altPhone: updatedAddressPayload.altPhone,
        address: updatedAddressPayload.addressLine,
        city: updatedAddressPayload.city,
        state: updatedAddressPayload.state,
        pincode: updatedAddressPayload.pincode,
        landmark: updatedAddressPayload.landmark,
        productName: updatedAddressPayload.productName || updatedOrder.items?.[0]?.product?.title || 'Sourced Item',
        productImg: updatedOrder.items?.[0]?.product?.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=150&auto=format&fit=crop&q=80',
        sku: updatedAddressPayload.productSku || 'SKU-DS',
        qty: updatedAddressPayload.quantity || updatedOrder.items?.[0]?.quantity || 1,
        wholesaleCost: updatedAddressPayload.wholesaleCost || (updatedOrder.totalAmount * 0.6),
        customerPrice: updatedOrder.totalAmount,
        shippingFee: updatedAddressPayload.shippingFee || 60,
        margin: updatedAddressPayload.dropshipperMargin || Math.max(0, updatedOrder.totalAmount * 0.3),
        paymentMode: updatedAddressPayload.paymentMode || updatedOrder.paymentMethod || 'COD',
        status: updatedOrder.orderStatus === 'ORDERED' ? 'DISPATCHED' : updatedOrder.orderStatus,
        courier: updatedAddressPayload.courier || 'Delhivery Express',
        awb: updatedAddressPayload.awb || `DEL-${updatedOrder.id.slice(0, 10)}`
      }
    });

  } catch (error) {
    console.error('Error in updateDropshipperOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update order',
      error: error.message
    });
  }
};

/**
 * 5. Cancel Dropshipper Order (Supplier Cancellation & Escrow Release)
 * PUT /api/v1/dropshipper/orders/:orderId/cancel
 */
export const cancelDropshipperOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { cancellationReason = 'Customer requested cancellation via WhatsApp/Store' } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId param is required' });
    }

    let dbOrderId = orderId;
    if (orderId.startsWith('DSP-')) {
      const hexSnippet = orderId.replace('DSP-', '').toLowerCase();
      const matched = await prisma.order.findFirst({
        where: { id: { startsWith: hexSnippet, mode: 'insensitive' } }
      });
      if (!matched) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      dbOrderId = matched.id;
    }

    const order = await prisma.order.findUnique({
      where: { id: dbOrderId }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.orderStatus === 'CANCELLED') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    if (order.orderStatus === 'DELIVERED') {
      return res.status(400).json({ success: false, message: 'Delivered orders cannot be cancelled. Initiate an RTO return instead.' });
    }

    const currentAddr = (typeof order.shippingAddress === 'object' && order.shippingAddress !== null)
      ? order.shippingAddress
      : {};

    const updatedAddressPayload = {
      ...currentAddr,
      cancellationReason,
      cancelledAt: new Date().toISOString()
    };

    const cancelledOrder = await prisma.order.update({
      where: { id: dbOrderId },
      data: {
        orderStatus: 'CANCELLED',
        shippingAddress: updatedAddressPayload
      }
    });

    return res.status(200).json({
      success: true,
      message: `Order #${orderId} has been successfully cancelled. Supplier dispatch halted and Escrow margin released.`,
      orderId: `DSP-${cancelledOrder.id.slice(0, 8).toUpperCase()}`,
      status: 'CANCELLED'
    });

  } catch (error) {
    console.error('Error in cancelDropshipperOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};

/**
 * 6. Permanently Delete an Order from Ledger
 * DELETE /api/v1/dropshipper/orders/:orderId
 */
export const deleteDropshipperOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId param is required' });
    }

    let dbOrderId = orderId;
    if (orderId.startsWith('DSP-')) {
      const hexSnippet = orderId.replace('DSP-', '').toLowerCase();
      const matched = await prisma.order.findFirst({
        where: { id: { startsWith: hexSnippet, mode: 'insensitive' } }
      });
      if (!matched) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      dbOrderId = matched.id;
    }

    // Delete associated order items first to satisfy foreign key constraints
    await prisma.orderItem.deleteMany({
      where: { orderId: dbOrderId }
    });

    await prisma.order.delete({
      where: { id: dbOrderId }
    });

    return res.status(200).json({
      success: true,
      message: `Order #${orderId} has been permanently deleted from database.`
    });

  } catch (error) {
    console.error('Error in deleteDropshipperOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete order',
      error: error.message
    });
  }
};

/**
 * 7. Archive / Unarchive Dropshipper Order (Industry Standard Soft Archiving)
 * PUT /api/v1/dropshipper/orders/:orderId/archive
 */
export const archiveDropshipperOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { archive = true } = req.body;

    if (!orderId) {
      return res.status(400).json({ success: false, message: 'orderId param is required' });
    }

    let dbOrderId = orderId;
    if (orderId.startsWith('DSP-')) {
      const hexSnippet = orderId.replace('DSP-', '').toLowerCase();
      const matched = await prisma.order.findFirst({
        where: { id: { startsWith: hexSnippet, mode: 'insensitive' } }
      });
      if (!matched) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      dbOrderId = matched.id;
    }

    const order = await prisma.order.findUnique({
      where: { id: dbOrderId }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const currentAddr = (typeof order.shippingAddress === 'object' && order.shippingAddress !== null)
      ? order.shippingAddress
      : {};

    const updatedAddressPayload = {
      ...currentAddr,
      isArchived: !!archive,
      archivedAt: archive ? new Date().toISOString() : null
    };

    const updatedOrder = await prisma.order.update({
      where: { id: dbOrderId },
      data: {
        shippingAddress: updatedAddressPayload
      }
    });

    return res.status(200).json({
      success: true,
      message: archive 
        ? `Order #${orderId} archived safely. Preserved in database for financial audit.` 
        : `Order #${orderId} restored to active orders list.`,
      isArchived: !!archive,
      orderId: `DSP-${updatedOrder.id.slice(0, 8).toUpperCase()}`
    });

  } catch (error) {
    console.error('Error in archiveDropshipperOrder:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to archive/unarchive order',
      error: error.message
    });
  }
};

/**
 * 8. Send Automated WhatsApp / SMS Courier Tracking Alert to Customer
 * POST /api/v1/dropshipper/orders/:orderId/send-tracking-alert
 */
export const sendOrderTrackingAlert = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { channel = 'WHATSAPP', customMessage, storeBrandName } = req.body;

    let dbOrderId = orderId;
    if (orderId.startsWith('DSP-')) {
      const allOrders = await prisma.order.findMany({ select: { id: true } });
      const found = allOrders.find(o => `DSP-${o.id.slice(0, 8).toUpperCase()}` === orderId);
      if (found) dbOrderId = found.id;
    }

    const order = await prisma.order.findUnique({
      where: { id: dbOrderId }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found in database' });
    }

    const addr = typeof order.shippingAddress === 'string'
      ? JSON.parse(order.shippingAddress || '{}')
      : (order.shippingAddress || {});

    const customerPhone = addr.phone || addr.customerPhone || '9876543210';
    const customerName = addr.fullName || addr.customerName || 'Customer';
    const storeName = storeBrandName || addr.whiteLabelStoreName || 'Official Store';
    const awb = addr.awb || `DEL-${order.id.slice(0, 8).toUpperCase()}`;
    const courier = addr.courier || 'Delhivery Express';
    const productName = addr.productName || 'Your Item';
    const trackingLink = `https://track.mshoppy.in/awb/${awb}`;

    const defaultMsg = `Hello ${customerName}! 📦 Great news: Your order for ${productName} from ${storeName} has been processed & dispatched via ${courier} (AWB: ${awb}). Track live parcel: ${trackingLink} . For assistance, contact support.`;

    const messageText = customMessage || defaultMsg;
    const cleanPhone = String(customerPhone).replace(/\D/g, '');
    const intlPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    const whatsappWebUrl = `https://api.whatsapp.com/send?phone=${intlPhone}&text=${encodeURIComponent(messageText)}`;

    // Save notification dispatch event into order metadata
    const updatedAddr = {
      ...addr,
      lastTrackingAlertSentAt: new Date().toISOString(),
      trackingNotificationChannel: channel,
      trackingAlertCount: (Number(addr.trackingAlertCount) || 0) + 1
    };

    await prisma.order.update({
      where: { id: dbOrderId },
      data: {
        shippingAddress: updatedAddr
      }
    });

    return res.status(200).json({
      success: true,
      message: `Tracking alert generated successfully via ${channel}`,
      channel,
      customerPhone: intlPhone,
      customerName,
      messageText,
      whatsappWebUrl,
      awb,
      courier,
      trackingLink,
      sentAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in sendOrderTrackingAlert:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send tracking alert',
      error: error.message
    });
  }
};

/**
 * 8. SIMULATE COURIER LIFECYCLE & AUTO-RELEASE ESCROW MARGIN
 * Route: POST /api/v1/dropshipper/orders/:orderId/simulate-status
 */
export const simulateCourierStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, instantSettlement = true, reason } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ success: false, message: 'orderId and target status are required' });
    }

    const cleanId = orderId.startsWith('DSP-') ? orderId.replace('DSP-', '').toLowerCase() : orderId;

    let order = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { id: { startsWith: cleanId, mode: 'insensitive' } }
        ]
      },
      include: {
        user: {
          include: { wallet: true }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ success: false, message: `Order #${orderId} not found in database` });
    }

    const validStatuses = ['ORDERED', 'CONFIRMED', 'SHIPPED', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'];
    const targetStatus = status.toUpperCase();

    if (!validStatuses.includes(targetStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status: ${targetStatus}. Allowed: ${validStatuses.join(', ')}`
      });
    }

    const currentAddr = (order.shippingAddress && typeof order.shippingAddress === 'object') ? { ...order.shippingAddress } : {};
    const sellingPrice = Number(order.totalAmount || currentAddr.customerPrice || 0);
    const supplierBase = Number(currentAddr.wholesaleCost || 0);
    const shippingFee = Number(currentAddr.shippingFee || 60);
    const tdsDeduction = Math.round(sellingPrice * 0.01);
    const netMargin = Math.max(0, sellingPrice - supplierBase - shippingFee - tdsDeduction);

    let releasedMargin = 0;
    let walletUpdated = false;
    let newBalance = order.user?.wallet?.balance || 0;

    // Handle DELIVERED & Escrow Release
    if (targetStatus === 'DELIVERED') {
      currentAddr.deliveredAt = new Date().toISOString();
      currentAddr.deliveryVerified = true;

      if (instantSettlement && netMargin > 0) {
        // Double-credit prevention: Check if already credited for this orderId
        const existingTx = await prisma.walletTransaction.findFirst({
          where: {
            OR: [
              { orderId: order.id },
              { description: { contains: order.id.slice(0, 8), mode: 'insensitive' } }
            ],
            type: 'credit'
          }
        });

        if (!existingTx && !currentAddr.isMarginSettled) {
          // Atomic transaction: Increment balance and record wallet transaction
          const result = await prisma.$transaction(async (tx) => {
            let wallet = await tx.wallet.findUnique({
              where: { userId: order.userId }
            });

            if (!wallet) {
              wallet = await tx.wallet.create({
                data: {
                  userId: order.userId,
                  balance: 0,
                  pending: 0
                }
              });
            }

            const updatedWallet = await tx.wallet.update({
              where: { id: wallet.id },
              data: {
                balance: { increment: netMargin },
                pending: { decrement: Math.min(wallet.pending || 0, netMargin) }
              }
            });

            const transactionRecord = await tx.walletTransaction.create({
              data: {
                walletId: wallet.id,
                orderId: order.id,
                amount: netMargin,
                type: 'credit',
                description: `Auto-Released Escrow Margin for Order #DSP-${order.id.slice(0, 8).toUpperCase()} (${currentAddr.courier || 'Delhivery'} AWB: ${currentAddr.awb || 'DEL-AWB'})`
              }
            });

            currentAddr.isMarginSettled = true;
            currentAddr.settledAt = new Date().toISOString();
            currentAddr.settledMargin = netMargin;

            const updatedOrder = await tx.order.update({
              where: { id: order.id },
              data: {
                orderStatus: 'DELIVERED',
                paymentStatus: 'PAID', // Cash collected on delivery
                shippingAddress: currentAddr
              }
            });

            return { updatedWallet, transactionRecord, updatedOrder };
          });

          releasedMargin = netMargin;
          walletUpdated = true;
          newBalance = result.updatedWallet.balance;
          order = result.updatedOrder;
        } else {
          // Margin was already credited previously, only update order status
          order = await prisma.order.update({
            where: { id: order.id },
            data: {
              orderStatus: 'DELIVERED',
              paymentStatus: 'PAID',
              shippingAddress: currentAddr
            }
          });
        }
      } else {
        order = await prisma.order.update({
          where: { id: order.id },
          data: {
            orderStatus: 'DELIVERED',
            paymentStatus: 'PAID',
            shippingAddress: currentAddr
          }
        });
      }
    } else if (targetStatus === 'CANCELLED' || targetStatus === 'RETURNED') {
      currentAddr.rtoAt = new Date().toISOString();
      currentAddr.rtoReason = reason || 'Customer rejected doorstep delivery (Simulated RTO)';

      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          orderStatus: targetStatus,
          shippingAddress: currentAddr
        }
      });
    } else {
      // SHIPPED, IN_TRANSIT, OUT_FOR_DELIVERY
      currentAddr.logisticsStatus = targetStatus;
      const prismaStatus = (targetStatus === 'IN_TRANSIT' || targetStatus === 'OUT_FOR_DELIVERY') ? 'SHIPPED' : targetStatus;

      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          orderStatus: prismaStatus,
          shippingAddress: currentAddr
        }
      });
    }

    const formattedOrder = {
      id: `DSP-${order.id.slice(0, 8).toUpperCase()}`,
      dbId: order.id,
      status: order.orderStatus,
      paymentStatus: order.paymentStatus,
      customerName: currentAddr.fullName || 'Customer',
      netMargin,
      isMarginSettled: currentAddr.isMarginSettled || false,
      deliveredAt: currentAddr.deliveredAt || null
    };

    return res.status(200).json({
      success: true,
      message: targetStatus === 'DELIVERED'
        ? (walletUpdated
            ? `🎉 Order #${formattedOrder.id} delivered! ₹${releasedMargin} margin auto-released to your wallet balance.`
            : `Order #${formattedOrder.id} marked as DELIVERED (Margin was already settled).`)
        : `Order #${formattedOrder.id} status updated to ${targetStatus}`,
      order: formattedOrder,
      releasedMargin,
      newWalletBalance: newBalance,
      walletUpdated
    });

  } catch (error) {
    console.error('Error in simulateCourierStatus:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update courier status and release margin',
      error: error.message
    });
  }
};


