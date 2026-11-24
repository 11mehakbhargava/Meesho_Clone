import fs from 'fs';
import PDFDocument from 'pdfkit';

const doc = new PDFDocument({
  size: 'A4',
  margin: 40,
  bufferPages: true,
  info: {
    Title: 'Meesho SuperApp - Logistics & Shiprocket Architecture Flow',
    Author: 'Meesho Engineering Team',
    Subject: 'Logistics and Delivery Operations Roadmap'
  }
});

const outputPath = 'D:/Meesho/MEESHO_LOGISTICS_AND_SHIPROCKET_FLOW.pdf';
const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const primary = '#831843'; // Rose/Wine
const dark = '#0f172a';
const textDark = '#1e293b';
const textMuted = '#475569';
const cardBg = '#f8fafc';
const border = '#e2e8f0';
const emerald = '#166534';
const blue = '#1d4ed8';

// Helpers
function drawHeader(title, subtitle) {
  doc.rect(40, 40, 515, 65).fill('#0f172a');
  doc.rect(40, 40, 6, 65).fill('#ff3f6c');
  
  doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text(title, 60, 52);
  doc.fillColor('#cbd5e1').fontSize(9).font('Helvetica').text(subtitle, 60, 74);
  doc.fillColor('#ffb5c5').fontSize(8).font('Helvetica-Bold').text('PRODUCTION ROADMAP (HINGLISH)', 410, 54, { align: 'right', width: 130 });
  doc.y = 120;
}

function drawSectionHeading(num, title) {
  if (doc.y > 680) doc.addPage();
  const y = doc.y + 10;
  doc.rect(40, y, 515, 24).fill('#f1f5f9');
  doc.rect(40, y, 4, 24).fill(primary);
  doc.fillColor(dark).fontSize(11).font('Helvetica-Bold').text(`${num}. ${title.toUpperCase()}`, 52, y + 6);
  doc.y = y + 34;
}

function drawCard(title, points) {
  if (doc.y > 670) doc.addPage();
  const startY = doc.y + 4;
  
  doc.fillColor(primary).fontSize(10).font('Helvetica-Bold').text(title, 48, startY + 6);
  doc.y = startY + 22;
  
  points.forEach(pt => {
    doc.fillColor(textDark).fontSize(8.5).font('Helvetica').text(`•  ${pt}`, 55, doc.y, { width: 485, lineGap: 3 });
  });
  
  const endY = doc.y + 6;
  doc.rect(40, startY, 515, endY - startY).lineWidth(0.8).stroke(border);
  doc.y = endY + 8;
}

// -- PAGE 1 -----------------------------------------------------------
drawHeader('MEESHO SUPERAPP - LOGISTICS FLOW', 'Comprehensive Architecture & Integration Guide (Shiprocket 3PL)');

// Overview
doc.fillColor(textDark).fontSize(9.5).font('Helvetica').text(
  'Ye document Meesho SuperApp ke Logistics & Delivery architecture ko step-by-step Hinglish me explain karta hai. ' +
  'Production me Pan-India delivery ke liye Shiprocket 3PL Aggregator sabse safe, cost-effective aur fast tareeqa hai.',
  40, doc.y, { width: 515, lineGap: 4 }
);
doc.y += 12;

drawSectionHeading('1', 'Kyu Shiprocket Chuna Gya? (Shiprocket vs Driver App)');
drawCard('Pan-India E-Commerce vs Hyperlocal Fleet', [
  'Pan-India Reality: Meesho par seller Surat/Delhi me hota hai aur customer Patna ya Bangalore me. 1500+ km doori ke liye hum bike riders nahi bhej sakte.',
  'Shiprocket Advantage: Ek hi integration se Delhivery, BlueDart, Ekart, DTDC, Shadowfax aur Xpressbees sab mil jate hain.',
  'Pincode Reach: 29,000+ Indian pincodes par COD aur Prepaid delivery automatically handle hoti hai.',
  'Zero Fixed Fleet Cost: Na koi driver hire karna hai, na monthly bike/fuel ka kharcha. Sirf parcel dispatch par actual shipping charge lagta hai.'
]);

drawSectionHeading('2', 'End-to-End Delivery Lifecycle (Step-by-Step Flow)');
drawCard('Step 1: Customer Order & Pincode Serviceability', [
  'Customer app me product dekhta hai aur apna Delivery Pincode dalta hai.',
  'Shiprocket API check karti hai ki us pincode par Delhivery/BlueDart deliver karta hai ya nahi aur kitne din lagenge (ETA: 3-5 days).',
  'Customer COD ya Online payment select karke order place karta hai (Status: CONFIRMED).'
]);

drawCard('Step 2: Supplier Packing & Weight Verification', [
  'Supplier/Seller ko uske dashboard me naya order dikhta hai.',
  'Supplier parcel pack karta hai aur box ka weight (e.g. 0.5 kg) aur dimensions (L x B x H) check karta hai.',
  'Supplier dashboard me "Ready to Ship" par click karta hai.'
]);

drawCard('Step 3: Shiprocket API Push & Courier Selection', [
  'Admin ya Supplier panel se "Ship with Shiprocket" button click hota hai.',
  'Backend automatically Shiprocket me Adhoc Order create karta hai (/orders/create/adhoc).',
  'Shiprocket customer ke pincode ke liye cheapest & fastest courier (e.g. Delhivery Surface) choose karta hai.'
]);

// -- PAGE 2 -----------------------------------------------------------
doc.addPage();
drawHeader('MEESHO SUPERAPP - LOGISTICS FLOW (PAGE 2)', 'AWB Generation, Label Printing, Pickup & Live Tracking');

drawCard('Step 4: Real AWB & Barcode Shipping Label Generation', [
  'Shiprocket courier partner se real AWB Number (e.g. DEL99824102) assign karwata hai.',
  'Shiprocket turant official PDF Shipping Label generate karta hai jisme Courier Name, AWB Barcode, Supplier Address aur Customer Delivery Address hota hai.',
  'Supplier is label ko print karke parcel ke upar chipka (paste) deta hai.'
]);

drawCard('Step 5: Courier Pickup Request & Manifest', [
  'System Shiprocket par automatic Pickup Request trigger karta hai (/courier/generate/pickup).',
  'Courier boy (Delhivery/Ekart) supplier ke warehouse/store par aakar parcel pickup karta hai.',
  'Supplier manifest copy par courier rider ke signature leta hai as proof of pickup.'
]);

drawCard('Step 6: Customer Notification & Real-Time Tracking', [
  'Order status update hokar SHIPPED ho jata hai.',
  'Customer ko instant SMS, WhatsApp aur Email notification jata hai:',
  '  "Aapka order Delhivery dwara dispatch ho chuka hai (AWB: DEL99824102). Yahan track karein: [Live Link]"',
  'Customer app me "Track Order" click karta hai toh seedha official Delhivery/BlueDart ka live status dikhta hai.'
]);

drawCard('Step 7: Doorstep Delivery & Customer Verification', [
  'Jab courier delivery hub par pahunchta hai, status OUT_FOR_DELIVERY ho jata hai.',
  'Prepaid ya high-value orders ke liye customer ke phone par Delivery OTP jata hai.',
  'Courier rider customer ko parcel deliver karta hai, COD cash leta hai aur status DELIVERED mark ho jata hai.'
]);

drawSectionHeading('3', 'Shiprocket Technical API Architecture (Backend Endpoints)');
drawCard('Core API Endpoints Jo Backend me Wire Hogi', [
  '1. Auth Login: POST https://apiv2.shiprocket.in/v2/console/auth/login (Returns 10-day JWT Bearer Token)',
  '2. Serviceability: GET /v2/console/courier/serviceability/ (Pincode, weight, COD check)',
  '3. Create Order: POST /v2/console/orders/create/adhoc (Creates order payload with items & address)',
  '4. Assign AWB: POST /v2/console/courier/assign/awb (Generates live courier tracking number)',
  '5. Shipping Label: POST /v2/console/courier/generate/label (Returns printable barcode PDF URL)',
  '6. Tracking: GET /v2/console/courier/track/awb/:awb (Fetches live transit checkpoints)'
]);

// -- PAGE 3 -----------------------------------------------------------
doc.addPage();
drawHeader('MEESHO SUPERAPP - LOGISTICS FLOW (PAGE 3)', 'Manual Fallback Mode & Implementation Checklist');

drawSectionHeading('4', 'Emergency Manual Fallback Mode (Agar API Down Ho)',);
drawCard('Fail-Safe Architecture: Zero Business Downtime', [
  'Agar kisi din Shiprocket API down ho ya credentials configure na hon, toh system ruka nahi rahega.',
  'Admin/Supplier manually kisi bhi local courier (DTDC, India Post Speed Post, BlueDart) se parcel bhej sakta hai.',
  'Admin panel me "Manual AWB Entry" modal hoga jahan Courier Name aur AWB daalte hi customer ko real tracking link ban kar chala jayega.'
]);

drawSectionHeading('5', 'Returns & Reverse Pickup QC Flow',);
drawCard('Return Pickup Flow (Customer to Seller)', [
  'Customer app me Return Request daalta hai (e.g. Size Issue ya Defect Photo upload).',
  'Supplier/Admin return approve karta hai.',
  'Shiprocket Reverse Pickup API call hoti hai -> Courier boy customer ke ghar jakar parcel pick karta hai.',
  'Warehouse me parcel deliver hone ke baad QC pass hota hai aur customer ka refund/wallet credit ho jata hai.'
]);

drawSectionHeading('6', 'Action Checklist for Team & Sir');
drawCard('Production Readiness Steps (What is needed now)', [
  'Step 1: app.shiprocket.in par free business account create karein.',
  'Step 2: Settings > API > Configure me jakar "API User" create karein (Email & Password).',
  'Step 3: backend/.env me SHIPROCKET_EMAIL aur SHIPROCKET_PASSWORD daalein.',
  'Step 4: Backend service (shiprocket.service.js) connect karein aur test order dispatch run karein.',
  'Step 5: Admin Panel me "Ship with Shiprocket" aur "Print Label" button live karein.'
]);

// Footer on all pages
const pages = doc.bufferedPageRange();
for (let i = 0; i < pages.count; i++) {
  doc.switchToPage(i);
  doc.rect(40, 785, 515, 0.5).fill('#cbd5e1');
  doc.fillColor('#64748b').fontSize(7.5).font('Helvetica').text(
    `Meesho SuperApp Logistics Engineering Architecture  |  Confidential  |  Page ${i + 1} of ${pages.count}`,
    40, 795, { align: 'center', width: 515 }
  );
}

doc.end();

stream.on('finish', () => {
  console.log('PDF Generated Successfully at:', outputPath);
});
