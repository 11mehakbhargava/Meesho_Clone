/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Shiprocket 3PL Logistics Service (Official Integration)
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides automated courier rate check, adhoc order creation,
 * real AWB assignment, barcode shipping label generation & live tracking.
 */

const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * 1. Authenticate with Shiprocket API (Auto Cached for 8 Days)
 */
export async function getShiprocketToken() {
  const email = process.env.SHIPROCKET_EMAIL;
  const password = process.env.SHIPROCKET_PASSWORD;

  if (!email || !password) {
    throw new Error('SHIPROCKET_EMAIL or SHIPROCKET_PASSWORD missing in environment configuration.');
  }

  // Return cached token if valid (valid for 10 days, cache for 8)
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  try {
    const res = await fetch(`${SHIPROCKET_API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok || !data?.token) {
      const errMsg = data?.message || (typeof data === 'string' ? data : 'Authentication failed with Shiprocket API');
      throw new Error(`Shiprocket Auth Error: ${errMsg}`);
    }

    cachedToken = data.token;
    tokenExpiresAt = Date.now() + 8 * 24 * 60 * 60 * 1000; // 8 days cache
    return cachedToken;
  } catch (err) {
    console.error('Shiprocket Authentication Error:', err.message);
    throw err;
  }
}

/**
 * Helper to make authenticated requests to Shiprocket API
 */
async function shiprocketFetch(endpoint, options = {}) {
  const token = await getShiprocketToken();
  const url = endpoint.startsWith('http') ? endpoint : `${SHIPROCKET_API_BASE}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...(options.headers || {})
  };

  const res = await fetch(url, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const errMsg = data?.message || data?.errors || `Shiprocket request failed with HTTP ${res.status}`;
    const formatted = typeof errMsg === 'object' ? JSON.stringify(errMsg) : errMsg;
    throw new Error(formatted);
  }

  return data;
}

/**
 * 2. Check Pincode Delivery Serviceability & Compare Courier Rates
 */
export async function checkPincodeServiceability({
  pickupPostcode = '395002', // Default Surat Warehouse
  deliveryPostcode,
  weight = 0.5,
  isCod = false
}) {
  if (!deliveryPostcode) {
    throw new Error('Delivery pincode is required for serviceability check.');
  }

  const cleanDeliveryPin = deliveryPostcode.toString().replace(/\D/g, '').slice(-6);
  const cleanPickupPin = pickupPostcode.toString().replace(/\D/g, '').slice(-6);
  const codFlag = isCod ? 1 : 0;

  const endpoint = `/courier/serviceability/?pickup_postcode=${cleanPickupPin}&delivery_postcode=${cleanDeliveryPin}&weight=${weight}&cod=${codFlag}`;
  const response = await shiprocketFetch(endpoint);

  const couriers = response?.data?.available_courier_companies || [];
  
  // Format clean list sorted by rate
  const formattedCouriers = couriers.map((c) => ({
    courierId: c.courier_company_id,
    courierName: c.courier_name,
    rate: Number(c.rate || 0),
    etd: c.etd,
    estimatedDays: c.estimated_delivery_days,
    rating: Number(c.rating || 4.5),
    isCodAvailable: Boolean(c.cod)
  })).sort((a, b) => a.rate - b.rate);

  return {
    isServiceable: formattedCouriers.length > 0,
    deliveryPostcode: cleanDeliveryPin,
    courierCount: formattedCouriers.length,
    cheapestCourier: formattedCouriers[0] || null,
    availableCouriers: formattedCouriers
  };
}

/**
 * 3. Create Adhoc Order in Shiprocket
 */
export async function createShiprocketOrder({
  order,
  pickupLocation = 'Primary',
  weight = 0.5,
  dimensions = { length: 10, breadth: 10, height: 5 }
}) {
  if (!order || !order.id) {
    throw new Error('Valid order object is required.');
  }

  const shipping = typeof order.shippingAddress === 'string'
    ? JSON.parse(order.shippingAddress || '{}')
    : (order.shippingAddress || {});

  const fullName = shipping.fullName || shipping.name || order.user?.fullName || 'Customer';
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || 'User';

  const isCod = (order.paymentMethod || 'COD').toUpperCase() === 'COD';
  const cleanPhone = (shipping.phone || order.user?.phone || '9999999999').toString().replace(/\D/g, '').slice(-10);

  const items = Array.isArray(order.items) && order.items.length > 0
    ? order.items.map((it) => ({
        name: it.product?.title || it.title || 'Marketplace Item',
        sku: (it.product?.sku || it.sku || `SKU-${it.productId || it.id || 'ITEM'}`).slice(0, 30),
        units: Number(it.quantity || 1),
        selling_price: Number(it.price || 0),
        discount: 0,
        tax: 0
      }))
    : [{
        name: 'Marketplace Product Package',
        sku: `SKU-${order.id.slice(0, 10).toUpperCase()}`,
        units: 1,
        selling_price: Number(order.totalAmount || 0),
        discount: 0,
        tax: 0
      }];

  const orderDate = new Date(order.createdAt || Date.now())
    .toISOString()
    .replace('T', ' ')
    .slice(0, 19);

  const payload = {
    order_id: order.id,
    order_date: orderDate,
    pickup_location: pickupLocation,
    billing_customer_name: firstName,
    billing_last_name: lastName,
    billing_address: (shipping.addressLine || shipping.details || shipping.street || 'Delivery Address').slice(0, 95),
    billing_city: shipping.city || 'Delhi',
    billing_pincode: (shipping.pincode || '110001').toString().slice(-6),
    billing_state: shipping.state || 'Delhi',
    billing_country: 'India',
    billing_email: (shipping.email || order.user?.email || 'customer@mshoppy.com').toLowerCase(),
    billing_phone: cleanPhone,
    shipping_is_billing: true,
    order_items: items,
    payment_method: isCod ? 'COD' : 'Prepaid',
    sub_total: Number(order.totalAmount || 0),
    length: Number(dimensions.length || 10),
    breadth: Number(dimensions.breadth || 10),
    height: Number(dimensions.height || 5),
    weight: Number(weight || 0.5)
  };

  const response = await shiprocketFetch('/orders/create/adhoc', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return {
    orderId: response.order_id,
    shipmentId: response.shipment_id,
    status: response.status,
    statusCode: response.status_code,
    raw: response
  };
}

/**
 * 4. Assign AWB (Air Waybill) to Shipment
 */
export async function assignShiprocketAWB({ shipmentId, courierId }) {
  if (!shipmentId) {
    throw new Error('shipmentId is required to generate AWB.');
  }

  const payload = { shipment_id: shipmentId };
  if (courierId) {
    payload.courier_id = courierId;
  }

  const response = await shiprocketFetch('/courier/assign/awb', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  const awbData = response?.response?.data;
  return {
    awbNumber: awbData?.awb_code || response?.awb_code,
    courierName: awbData?.courier_name || response?.courier_name || 'Delhivery',
    courierId: awbData?.courier_company_id || courierId,
    appliedWeight: awbData?.applied_weight,
    shipmentId: shipmentId
  };
}

/**
 * 5. Generate Printable Barcode Shipping Label PDF
 */
export async function generateShiprocketLabel(shipmentId) {
  if (!shipmentId) {
    throw new Error('shipmentId is required to generate shipping label.');
  }

  const payload = {
    shipment_id: Array.isArray(shipmentId) ? shipmentId : [Number(shipmentId)]
  };

  const response = await shiprocketFetch('/courier/generate/label', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return {
    labelCreated: Boolean(response.label_created),
    labelUrl: response.label_url || null
  };
}

/**
 * 6. Request Courier Pickup from Warehouse
 */
export async function requestShiprocketPickup(shipmentId) {
  if (!shipmentId) {
    throw new Error('shipmentId is required to request pickup.');
  }

  const payload = {
    shipment_id: Array.isArray(shipmentId) ? shipmentId : [Number(shipmentId)]
  };

  const response = await shiprocketFetch('/courier/generate/pickup', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return {
    pickupStatus: response.pickup_status,
    pickupTokenNumber: response.response?.pickup_token_number || null,
    pickupScheduledDate: response.response?.pickup_scheduled_date || null
  };
}

/**
 * 7. Live Real-Time Shipment Tracking by AWB Number
 */
export async function trackShiprocketByAWB(awbNumber) {
  if (!awbNumber) {
    throw new Error('awbNumber is required for tracking.');
  }

  const cleanAwb = awbNumber.toString().trim();
  const response = await shiprocketFetch(`/courier/track/awb/${cleanAwb}`);
  const trackingData = response?.tracking_data;

  return {
    trackStatus: trackingData?.track_status || 0,
    shipmentStatus: trackingData?.shipment_status || 'IN_TRANSIT',
    courierName: trackingData?.courier_name || 'Courier Partner',
    origin: trackingData?.origin || '',
    destination: trackingData?.destination || '',
    currentLocation: trackingData?.current_status || '',
    estimatedDeliveryDate: trackingData?.etd || '',
    checkpoints: trackingData?.scans || []
  };
}
