/**
 * catalogExportGenerators.js
 * High-performance 1-Click CSV generator for Shopify, WooCommerce, and Universal B2B feeds
 * Formats strictly adhere to official Shopify and WooCommerce Product Importer Specifications
 */

// Helper to escape RFC-4180 CSV fields
function escapeCsv(val) {
  if (val === null || val === undefined) return '""';
  const str = String(val);
  return `"${str.replace(/"/g, '""')}"`;
}

// Generate URL slug for Shopify handles
function slugify(text) {
  return String(text || 'product')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculates selling price and MRP strike-through discount based on dropshipper margin strategy
 */
export function calculateExportPrices(product, marginConfig, options = {}) {
  const wholesale = Number(product.price || product.wholesalePrice || 0);
  const strategy = options.marginStrategy || 'SAVED_RULES';
  let selling = wholesale;

  if (strategy === 'SAVED_RULES') {
    // If dropshipper has saved category/percentage rules
    const pct = Number(marginConfig?.percentageMarkup || 30);
    const fixed = Number(marginConfig?.fixedMarkup || 250);
    if (marginConfig?.pricingStrategy === 'FIXED') {
      selling = wholesale + fixed;
    } else {
      selling = wholesale * (1 + pct / 100);
    }
  } else if (strategy === 'PERCENTAGE') {
    const pct = Number(options.customPercent || 35);
    selling = wholesale * (1 + pct / 100);
  } else if (strategy === 'FIXED') {
    const fixed = Number(options.customFixed || 200);
    selling = wholesale + fixed;
  } else {
    // Default 30% margin
    selling = wholesale * 1.3;
  }

  // Shipping cost consideration
  if (options.includeShippingInPrice) {
    selling += Number(options.shippingFee || 60);
  }

  // Psychological Pricing (.99 / 49 / 99)
  let roundedSelling = Math.round(selling);
  if (options.roundTo99 && roundedSelling >= 100) {
    if (roundedSelling < 500) {
      roundedSelling = Math.floor(roundedSelling / 10) * 10 + 9; // e.g. 249, 399
    } else {
      // Round to nearest 99 or 49
      const baseHundred = Math.floor(roundedSelling / 100) * 100;
      const remainder = roundedSelling % 100;
      roundedSelling = remainder < 50 ? baseHundred + 49 : baseHundred + 99;
    }
  }

  // MRP / Compare-at Price (for strike-through discount display)
  const mrpMarkupPct = Number(options.mrpMarkupPct || 40);
  let compareAtPrice = Math.round(roundedSelling * (1 + mrpMarkupPct / 100));
  if (options.roundTo99 && compareAtPrice >= 100) {
    compareAtPrice = Math.floor(compareAtPrice / 100) * 100 + 99; // e.g. 999, 1499
  }

  const netMargin = Math.max(0, roundedSelling - wholesale);
  const marginPct = roundedSelling > 0 ? Math.round((netMargin / roundedSelling) * 100) : 0;

  return {
    wholesale,
    selling: roundedSelling,
    compareAtPrice,
    netMargin,
    marginPct
  };
}

/**
 * 1. OFFICIAL SHOPIFY PRODUCT CSV GENERATOR
 * Standard Shopify 2024 Product Import Specification
 */
export function generateShopifyCsv(products, marginConfig, options = {}) {
  const headers = [
    'Handle',
    'Title',
    'Body (HTML)',
    'Vendor',
    'Product Category',
    'Type',
    'Tags',
    'Published',
    'Option1 Name',
    'Option1 Value',
    'Option2 Name',
    'Option2 Value',
    'Variant SKU',
    'Variant Grams',
    'Variant Inventory Tracker',
    'Variant Inventory Qty',
    'Variant Inventory Policy',
    'Variant Fulfillment Service',
    'Variant Price',
    'Variant Compare At Price',
    'Variant Requires Shipping',
    'Variant Taxable',
    'Variant Barcode',
    'Image Src',
    'Image Position',
    'Image Alt Text',
    'Gift Card',
    'SEO Title',
    'SEO Description',
    'Cost per item',
    'Status'
  ];

  const vendorName = options.storeName || 'My Dropship Store';
  const rows = [];

  products.forEach((product) => {
    const title = product.title || product.name || 'Wholesale Product';
    const handle = `${slugify(title)}-${String(product.id || '').slice(0, 6)}`;
    const category = product.category?.name || product.categorySlug || 'Apparel & Accessories';
    const sku = product.sku || `MSH-${String(product.id || '').slice(0, 8).toUpperCase()}`;
    const pricing = calculateExportPrices(product, marginConfig, options);

    // Multi-image parsing
    let imageList = [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      imageList = product.images.filter(Boolean);
    } else if (product.image) {
      imageList = [product.image];
    } else {
      imageList = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];
    }

    // Rich HTML description for high Shopify conversion
    const descriptionHtml = `
      <p><strong>${title}</strong></p>
      <p>${product.description || 'Premium quality wholesale curated product with verified manufacturer quality assurance.'}</p>
      <ul>
        <li><strong>Category:</strong> ${category}</li>
        <li><strong>Dispatch SLA:</strong> Dispatches within 24-48 business hours</li>
        <li><strong>Quality Check:</strong> 100% Quality Inspected before dispatch</li>
        <li><strong>Return Policy:</strong> 7-day doorstep replacement warranty</li>
      </ul>
      <p><em>Sourced with verified B2B direct manufacturer fulfillment.</em></p>
    `.replace(/\n\s+/g, ' ').trim();

    // Base Product Row
    rows.push([
      escapeCsv(handle),
      escapeCsv(title),
      escapeCsv(descriptionHtml),
      escapeCsv(vendorName),
      escapeCsv(category),
      escapeCsv(category),
      escapeCsv(`${category}, dropshipping, verified, trending`),
      escapeCsv('true'),
      escapeCsv('Title'),
      escapeCsv('Default Title'),
      escapeCsv(''),
      escapeCsv(''),
      escapeCsv(sku),
      escapeCsv('400'),
      escapeCsv('shopify'),
      escapeCsv(String(product.stock || 50)),
      escapeCsv('deny'),
      escapeCsv('manual'),
      escapeCsv(pricing.selling.toFixed(2)),
      escapeCsv(pricing.compareAtPrice.toFixed(2)),
      escapeCsv('true'),
      escapeCsv('false'),
      escapeCsv(''),
      escapeCsv(imageList[0] || ''),
      escapeCsv('1'),
      escapeCsv(title),
      escapeCsv('false'),
      escapeCsv(`${title} - Best Price Online`),
      escapeCsv(`Buy ${title} at best retail price with fast nationwide delivery.`),
      escapeCsv(pricing.wholesale.toFixed(2)), // Cost per item tracks dropshipper net margin in Shopify
      escapeCsv('active')
    ].join(','));

    // Subsequent image rows for Shopify (multi-image support under same handle)
    for (let i = 1; i < imageList.length; i++) {
      rows.push([
        escapeCsv(handle),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(imageList[i]),
        escapeCsv(String(i + 1)),
        escapeCsv(`${title} - Image ${i + 1}`),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv(''),
        escapeCsv('')
      ].join(','));
    }
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * 2. OFFICIAL WOOCOMMERCE PRODUCT CSV GENERATOR
 * Standard WooCommerce Importer Specification
 */
export function generateWooCommerceCsv(products, marginConfig, options = {}) {
  const headers = [
    'ID',
    'Type',
    'SKU',
    'Name',
    'Published',
    'Is featured?',
    'Visibility in catalog',
    'Short description',
    'Description',
    'In stock?',
    'Stock',
    'Backorders allowed?',
    'Sold individually?',
    'Weight (kg)',
    'Allow customer reviews?',
    'Sale price',
    'Regular price',
    'Categories',
    'Tags',
    'Shipping class',
    'Images'
  ];

  const rows = products.map((product) => {
    const title = product.title || product.name || 'Wholesale Product';
    const sku = product.sku || `MSH-${String(product.id || '').slice(0, 8).toUpperCase()}`;
    const category = product.category?.name || product.categorySlug || 'Wholesale Sourcing';
    const pricing = calculateExportPrices(product, marginConfig, options);

    let imageList = [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      imageList = product.images.filter(Boolean);
    } else if (product.image) {
      imageList = [product.image];
    } else {
      imageList = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];
    }

    const shortDesc = `Verified factory source. Quick dispatch in 24-48 hours.`;
    const fullDesc = `
      <p><strong>${title}</strong></p>
      <p>${product.description || 'Premium quality wholesale catalog product curated for high-margin e-commerce reselling.'}</p>
      <p><strong>Highlights:</strong></p>
      <ul>
        <li>Direct Indian Manufacturer Sourcing</li>
        <li>100% Doorstep Quality Check</li>
        <li>Fast Shipping with Tracking</li>
      </ul>
    `.replace(/\n\s+/g, ' ').trim();

    return [
      escapeCsv(''), // Empty for auto-assigning ID in WooCommerce
      escapeCsv('simple'),
      escapeCsv(sku),
      escapeCsv(title),
      escapeCsv('1'), // Published
      escapeCsv('0'), // Featured
      escapeCsv('visible'),
      escapeCsv(shortDesc),
      escapeCsv(fullDesc),
      escapeCsv('1'), // In stock?
      escapeCsv(String(product.stock || 50)),
      escapeCsv('0'),
      escapeCsv('0'),
      escapeCsv('0.5'),
      escapeCsv('1'),
      escapeCsv(pricing.selling.toFixed(2)), // Sale price
      escapeCsv(pricing.compareAtPrice.toFixed(2)), // Regular price (MRP)
      escapeCsv(category),
      escapeCsv(`${category}, dropshipping, b2b`),
      escapeCsv(''),
      escapeCsv(imageList.join(', ')) // WooCommerce accepts comma-separated image URLs
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * 3. UNIVERSAL B2B EXCEL / CSV FEED
 * Human-readable table for custom inventory management and spreadsheet auditing
 */
export function generateUniversalCsv(products, marginConfig, options = {}) {
  const headers = [
    'MShoppy Product ID',
    'SKU',
    'Product Title',
    'Category',
    'Supplier Hub',
    'Wholesale Cost (INR)',
    'Suggested Resale Price (INR)',
    'Compare-At MRP (INR)',
    'Net Profit Margin (INR)',
    'Margin Percentage (%)',
    'Inventory Stock',
    'Primary Image URL',
    'All Image URLs (Comma Separated)'
  ];

  const rows = products.map((product) => {
    const title = product.title || product.name || 'Wholesale Product';
    const sku = product.sku || `MSH-${String(product.id || '').slice(0, 8).toUpperCase()}`;
    const category = product.category?.name || product.categorySlug || 'Wholesale Sourcing';
    const hub = product.supplierName || product.hub || 'Surat Hub';
    const pricing = calculateExportPrices(product, marginConfig, options);

    let imageList = [];
    if (Array.isArray(product.images) && product.images.length > 0) {
      imageList = product.images.filter(Boolean);
    } else if (product.image) {
      imageList = [product.image];
    } else {
      imageList = ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'];
    }

    return [
      escapeCsv(product.id || ''),
      escapeCsv(sku),
      escapeCsv(title),
      escapeCsv(category),
      escapeCsv(hub),
      escapeCsv(pricing.wholesale),
      escapeCsv(pricing.selling),
      escapeCsv(pricing.compareAtPrice),
      escapeCsv(pricing.netMargin),
      escapeCsv(`${pricing.marginPct}%`),
      escapeCsv(product.stock || 50),
      escapeCsv(imageList[0] || ''),
      escapeCsv(imageList.join(', '))
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * 4. DOWNLOAD TRIGGER HELPER WITH UTF-8 BOM
 * Ensures Excel & Sheets open Indian Rupee symbols and characters cleanly without encoding glitches
 */
export function triggerCsvDownload(csvString, filename) {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

