/**
 * Universal CSV Export Utility for Supplier Portal
 * 
 * Complies with RFC 4180 standard and prepends UTF-8 BOM (\uFEFF)
 * so that Microsoft Excel, Apple Numbers, and Google Sheets render
 * currency symbols (₹), addresses, and Indian names without mojibake.
 */

/**
 * Format a single CSV cell value with escaping
 */
function formatCsvCell(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val).trim();
  // Escape double quotes by doubling them
  const escaped = str.replace(/"/g, '""');
  // Always wrap in quotes if contains comma, quote, newline or semicolon
  if (escaped.search(/("|,|\n|\r|;)/g) >= 0 || str.includes('₹')) {
    return `"${escaped}"`;
  }
  return `"${escaped}"`;
}

/**
 * Core export function triggering browser download
 */
export function exportToCsv(filename, headers, rows) {
  try {
    const csvRows = [];

    // Header row
    csvRows.push(headers.map(formatCsvCell).join(','));

    // Data rows
    for (const row of rows) {
      csvRows.push(row.map(formatCsvCell).join(','));
    }

    const csvString = csvRows.join('\r\n');
    // Prepend UTF-8 BOM (\uFEFF) for Microsoft Excel compatibility
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('CSV Export Error:', err);
    return false;
  }
}

/**
 * Format date string to clean readable Indian format DD/MM/YYYY, hh:mm A
 */
function formatDate(d) {
  if (!d) return 'N/A';
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return String(d);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (_) {
    return String(d);
  }
}

/**
 * 1. Export Orders Data to CSV
 */
export function exportOrdersToCsv(orders = [], supplierName = 'Supplier') {
  if (!orders || orders.length === 0) return 0;

  const headers = [
    'Order ID',
    'Order Date',
    'Customer Name',
    'Customer Phone',
    'Shipping City',
    'Shipping State',
    'Delivery Address',
    'Item Titles',
    'Total Quantity',
    'Order Total (INR)',
    'Payment Method',
    'Payment Status',
    'Fulfillment Status',
  ];

  const rows = orders.map((ord) => {
    let parsedAddress = {};
    if (typeof ord.shippingAddress === 'string') {
      try {
        parsedAddress = JSON.parse(ord.shippingAddress);
      } catch (_) {}
    } else if (ord.shippingAddress) {
      parsedAddress = ord.shippingAddress;
    }

    const items = ord.items || [];
    const itemTitles = items
      .map((it) => `${it.product?.title || it.productTitle || 'Item'} (Qty: ${it.quantity || 1})`)
      .join('; ');
    const totalQty = items.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);

    return [
      `#${String(ord.id || '').toUpperCase()}`,
      formatDate(ord.createdAt),
      parsedAddress.fullName || parsedAddress.name || ord.user?.fullName || ord.customerName || 'Customer',
      parsedAddress.phone || ord.user?.phone || 'N/A',
      parsedAddress.city || 'N/A',
      parsedAddress.state || 'N/A',
      parsedAddress.addressLine1 || parsedAddress.address || 'N/A',
      itemTitles || 'Merchandise Item',
      totalQty || 1,
      Number(ord.totalAmount || 0).toFixed(2),
      ord.paymentMethod || 'COD',
      ord.paymentStatus || 'PENDING',
      (ord.orderStatus || ord.status || 'ORDERED').toUpperCase(),
    ];
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `mshoppy_orders_${timestamp}.csv`;
  exportToCsv(filename, headers, rows);
  return orders.length;
}

/**
 * 2. Export Inventory Catalog Data to CSV
 */
export function exportInventoryToCsv(products = [], supplierName = 'Supplier') {
  if (!products || products.length === 0) return 0;

  const headers = [
    'Product ID',
    'SKU Code',
    'Product Title',
    'Category',
    'Selling Price (INR)',
    'MRP (INR)',
    'Stock Quantity',
    'Stock Availability',
    'Rating',
    'Reviews Count',
    'Created Date',
  ];

  const rows = products.map((prod) => {
    const stock = Number(prod.stock || 0);
    const stockStatus = stock === 0 ? 'Out of Stock' : stock < 10 ? 'Low Stock' : 'In Stock';

    return [
      prod.id || 'N/A',
      prod.sku || `SKU-${String(prod.id || '').slice(0, 8).toUpperCase()}`,
      prod.title || 'Untitled Product',
      prod.category?.name || prod.categorySlug || 'General',
      Number(prod.price || 0).toFixed(2),
      Number(prod.mrp || (prod.price ? prod.price * 1.3 : 0)).toFixed(2),
      stock,
      stockStatus,
      prod.rating ? Number(prod.rating).toFixed(1) : 'New (5.0)',
      prod.reviewCount || prod.reviewsCount || 0,
      formatDate(prod.createdAt),
    ];
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `mshoppy_inventory_catalog_${timestamp}.csv`;
  exportToCsv(filename, headers, rows);
  return products.length;
}

/**
 * 3. Export Financial Settlements & Ledger Data to CSV
 */
export function exportSettlementsToCsv(transactions = [], summary = {}) {
  const headers = [
    'Transaction / Payout ID',
    'Date & Time',
    'Order Reference',
    'Transaction Type',
    'Gross Sale Value (INR)',
    'Platform Commission (0%)',
    'Shipping Fee (INR)',
    'TDS u/s 194-O (1%) (INR)',
    'Net Bank Payout (INR)',
    'Bank Account / UTR',
    'Settlement Status',
  ];

  // If no transactions exist, create sample row from summary if available
  const list = Array.isArray(transactions) && transactions.length > 0 ? transactions : [];

  const rows = list.map((tx) => {
    const amount = Number(tx.amount || 0);
    const tds = (amount * 0.01).toFixed(2);
    const gross = (amount * 1.05).toFixed(2);
    const shipping = '0.00';

    return [
      tx.id || `TXN-${Date.now()}`,
      formatDate(tx.createdAt || tx.date),
      tx.orderId ? `#${tx.orderId.slice(-8).toUpperCase()}` : 'PAYOUT-BATCH',
      tx.type || 'ORDER_PAYOUT',
      gross,
      '0.00 (0% Commission)',
      shipping,
      tds,
      amount.toFixed(2),
      summary?.bankAccount || 'Verified Bank Account',
      (tx.status || 'SETTLED').toUpperCase(),
    ];
  });

  // If empty, export account summary as single row
  if (rows.length === 0 && summary) {
    rows.push([
      'WALLET-BALANCE-STATEMENT',
      formatDate(new Date()),
      'CURRENT-CYCLE',
      'AVAILABLE_BALANCE',
      Number(summary.walletBalance || 0).toFixed(2),
      '0.00',
      '0.00',
      '0.00',
      Number(summary.walletBalance || 0).toFixed(2),
      summary.bankAccount || 'Bank A/C Linked',
      'ACTIVE',
    ]);
  }

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `mshoppy_settlements_ledger_${timestamp}.csv`;
  exportToCsv(filename, headers, rows);
  return rows.length;
}

/**
 * 4. Export Returns & RTO Claims Data to CSV
 */
export function exportReturnsToCsv(returns = []) {
  if (!returns || returns.length === 0) return 0;

  const headers = [
    'Return Claim ID',
    'Order ID',
    'Date Initiated',
    'Claim Type',
    'Customer Reason & Remarks',
    'Returned Product',
    'Quantity',
    'Total Claim Value (INR)',
    'Reverse AWB Number',
    'Courier Partner',
    'Customer Name',
    'Customer City',
    'Proof Photos Count',
    'Claim Status',
  ];

  const rows = returns.map((ret) => {
    const prod = ret.product || ret.items?.[0]?.product || {};
    const displayOrderId = String(ret.orderId || ret.id || '').toUpperCase();
    const proofCount = ret.proofImages?.length || ret.images?.length || 0;

    return [
      `#${String(ret.id || ret.returnRequestId || '').slice(-8).toUpperCase()}`,
      `#${displayOrderId.slice(-8)}`,
      formatDate(ret.createdAt),
      ret.claimType || 'CUSTOMER_RETURN',
      ret.reason || ret.customerReason || 'Customer doorstep return',
      prod.title || ret.items?.[0]?.productTitle || 'Product Item',
      prod.quantity || 1,
      Number(ret.totalAmount || prod.price || 0).toFixed(2),
      ret.awb || 'RTO-PENDING',
      ret.courier || 'Reverse Logistics',
      ret.customer?.name || 'Customer',
      ret.customer?.city || 'India',
      proofCount,
      (ret.rtoStatus || ret.orderStatus || 'REQUESTED').toUpperCase(),
    ];
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `mshoppy_returns_claims_${timestamp}.csv`;
  exportToCsv(filename, headers, rows);
  return returns.length;
}

/**
 * 5. Export Product Reviews & Ratings to CSV
 */
export function exportReviewsToCsv(reviews = []) {
  if (!reviews || reviews.length === 0) return 0;

  const headers = [
    'Review ID',
    'Review Date',
    'Product Title',
    'Rating (Stars)',
    'Review Headline',
    'Customer Feedback Comment',
    'Customer Name',
    'Unboxing Photos Count',
    'Seller Reply Status',
    'Official Seller Reply',
  ];

  const rows = reviews.map((r) => [
    `#${String(r.id || '').slice(-8).toUpperCase()}`,
    formatDate(r.createdAt),
    r.product?.title || 'Catalog Product',
    `${r.rating || 5} Star(s)`,
    r.title || 'Product Feedback',
    r.comment || '',
    r.customer?.name || 'Verified Buyer',
    r.customerPhotos?.length || 0,
    r.hasReply ? 'Replied' : 'Pending Reply',
    r.adminReply || 'No reply yet',
  ]);

  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `mshoppy_customer_reviews_${timestamp}.csv`;
  exportToCsv(filename, headers, rows);
  return reviews.length;
}

/**
 * 6. Download Sample Bulk Product Catalog Template (CSV)
 */
export function downloadBulkProductTemplateCsv() {
  const headers = [
    'Title',
    'Category',
    'Price',
    'MRP',
    'Stock',
    'SKU',
    'Sizes',
    'Colors',
    'Thickness',
    'Images',
    'Description',
  ];

  const sampleRows = [
    [
      'Anarkali Printed Rayon Kurti & Dupatta Set',
      'Women Ethnic',
      499,
      999,
      60,
      'KURTI-ANAR-01',
      'S, M, L, XL, XXL',
      'Red, Navy Blue, Emerald Green',
      '180 GSM (Regular / Bio-Wash)',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800, https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800',
      'Premium 100% breathable rayon anarkali kurti with intricate foil work and matching dupatta.',
    ],
    [
      'Men Pure Cotton Casual Spread Collar Shirt',
      'Men Western',
      399,
      799,
      50,
      'SHIRT-COT-02',
      'M, L, XL, XXL',
      'White, Sky Blue, Charcoal Grey',
      '220 GSM (Heavy / Winter Wear)',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800',
      'Pre-shrunk combed cotton casual shirt for formal and daily office styling. Double stitched buttons.',
    ],
    [
      'Embroidered Silk Blend Festive Saree with Blouse Piece',
      'Sarees',
      699,
      1499,
      40,
      'SAREE-SILK-03',
      'Free Size',
      'Maroon, Mustard Yellow, Royal Blue',
      'Jacquard Weave 120 GSM',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800',
      'Traditional woven kanjivaram style art silk saree with rich pallu design. Includes 0.8m unstitched blouse.',
    ],
  ];

  const filename = `mshoppy_bulk_catalog_sample_template.csv`;
  exportToCsv(filename, headers, sampleRows);
  return true;
}

/**
 * 7. Parse CSV String into Product Objects (RFC 4180 Compliant with Header Normalization)
 */
export function parseProductsCsv(csvString) {
  if (!csvString || typeof csvString !== 'string') {
    throw new Error('CSV content is empty or invalid.');
  }

  // Strip UTF-8 BOM if present
  let cleanCsv = csvString;
  if (cleanCsv.charCodeAt(0) === 0xFEFF) {
    cleanCsv = cleanCsv.slice(1);
  }

  // Parse lines considering quoted cells with newlines
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < cleanCsv.length; i++) {
    const char = cleanCsv[i];
    const nextChar = cleanCsv[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++; // skip escaped quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some((c) => c !== '')) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some((c) => c !== '')) {
      rows.push(currentRow);
    }
  }

  if (rows.length < 2) {
    throw new Error('CSV must contain a header row and at least one product row.');
  }

  const rawHeaders = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ''));

  // Header mapping dictionary
  const headerMap = {
    title: ['title', 'producttitle', 'productname', 'name', 'itemname'],
    category: ['category', 'categoryname', 'categoryslug', 'cat'],
    price: ['price', 'sellingprice', 'offerprice', 'unitprice', 'finalprice'],
    mrp: ['mrp', 'originalprice', 'regularprice', 'retailprice', 'strikeprice'],
    stock: ['stock', 'quantity', 'qty', 'inventory', 'units', 'initialstock'],
    sku: ['sku', 'skucode', 'itemcode', 'productcode', 'stylecode'],
    sizes: ['sizes', 'size', 'availablesizes', 'variantsizes'],
    colors: ['colors', 'color', 'availablecolors', 'variantcolors', 'colour', 'colours'],
    thickness: ['thickness', 'thicknesses', 'gsm', 'fabricweight', 'weight'],
    images: ['images', 'image', 'imageurl', 'imageurls', 'photos', 'photourls'],
    description: ['description', 'desc', 'productdescription', 'details'],
  };

  const colIndices = {};
  for (const [key, aliases] of Object.entries(headerMap)) {
    const idx = rawHeaders.findIndex((h) => aliases.includes(h));
    if (idx !== -1) {
      colIndices[key] = idx;
    }
  }

  if (colIndices.title === undefined || colIndices.price === undefined) {
    throw new Error('CSV missing required header columns: "Title" and "Price" are mandatory.');
  }

  const parsedProducts = [];
  const errors = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const rowNum = r + 1;

    const title = colIndices.title !== undefined ? (row[colIndices.title] || '').trim() : '';
    if (!title) {
      errors.push(`Row ${rowNum}: Title is empty`);
      continue;
    }

    const priceRaw = colIndices.price !== undefined ? row[colIndices.price] : '';
    const cleanPrice = String(priceRaw).replace(/[^0-9.]/g, '');
    const priceNum = parseFloat(cleanPrice);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.push(`Row ${rowNum} ("${title}"): Invalid selling price "${priceRaw}"`);
      continue;
    }

    const mrpRaw = colIndices.mrp !== undefined ? row[colIndices.mrp] : '';
    const cleanMrp = String(mrpRaw).replace(/[^0-9.]/g, '');
    const mrpNum = parseFloat(cleanMrp) || Math.round(priceNum * 1.3);

    const stockRaw = colIndices.stock !== undefined ? row[colIndices.stock] : '50';
    const cleanStock = String(stockRaw).replace(/[^0-9]/g, '');
    let stockNum = parseInt(cleanStock, 10);
    if (isNaN(stockNum) || stockNum < 0) stockNum = 50;

    const category = colIndices.category !== undefined && row[colIndices.category]
      ? row[colIndices.category].trim()
      : 'Women Ethnic';

    const sku = colIndices.sku !== undefined && row[colIndices.sku]
      ? row[colIndices.sku].trim()
      : `MSH-${Date.now().toString().slice(-5)}-${r}`;

    const sizesRaw = colIndices.sizes !== undefined ? (row[colIndices.sizes] || '') : '';
    const sizes = sizesRaw
      ? sizesRaw.split(/[,;|]/).map((s) => s.trim()).filter(Boolean)
      : ['Free Size'];

    const colorsRaw = colIndices.colors !== undefined ? (row[colIndices.colors] || '') : '';
    const colors = colorsRaw
      ? colorsRaw.split(/[,;|]/).map((c) => c.trim()).filter(Boolean)
      : [];

    const thickness = colIndices.thickness !== undefined && row[colIndices.thickness]
      ? row[colIndices.thickness].trim()
      : null;

    const imagesRaw = colIndices.images !== undefined ? (row[colIndices.images] || '') : '';
    const images = imagesRaw
      ? imagesRaw.split(/[,;\s]+/).map((u) => u.trim()).filter((u) => u.startsWith('http'))
      : [];
    if (images.length === 0) {
      images.push('https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800');
    }

    const description = colIndices.description !== undefined && row[colIndices.description]
      ? row[colIndices.description].trim()
      : 'Premium quality verified wholesale catalog item directly from verified manufacturer.';

    parsedProducts.push({
      rowNumber: rowNum,
      title,
      category,
      categorySlug: category.toLowerCase().replace(/\s+/g, '-'),
      price: priceNum,
      mrp: mrpNum,
      stock: stockNum,
      sku,
      sizes: sizes.length > 0 ? sizes : ['Free Size'],
      colors,
      thickness,
      images,
      imageUrl: images[0] || '',
      description,
    });
  }

  return {
    products: parsedProducts,
    errors,
    totalRows: rows.length - 1,
    validRows: parsedProducts.length,
  };
}

