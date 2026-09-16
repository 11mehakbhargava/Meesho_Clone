const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const outputDir = path.resolve(rootDir, 'pdf_navigation_flows');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let browserPath = edgePaths.find(p => fs.existsSync(p));

if (!browserPath) {
  console.error('No supported browser (Edge/Chrome) found on standard paths.');
  process.exit(1);
}

const flows = [
  {
    html: path.resolve(rootDir, 'Meesho_Clone_Navigation_Flow.html'),
    pdf: path.resolve(outputDir, '0_Master_Meesho_Clone_All_Modules_Navigation_Flow.pdf'),
    title: 'Master All Modules (63 Screens)'
  },
  {
    html: path.resolve(rootDir, 'docs_navigation_flow', 'Module_1_Reseller_Fintech_Flow.html'),
    pdf: path.resolve(outputDir, 'Module_1_Reseller_Fintech_Navigation_Flow.pdf'),
    title: 'Module 1: Reseller & Fintech (18 Screens)'
  },
  {
    html: path.resolve(rootDir, 'docs_navigation_flow', 'Module_2_Customer_Shopping_Flow.html'),
    pdf: path.resolve(outputDir, 'Module_2_Customer_Shopping_Navigation_Flow.pdf'),
    title: 'Module 2: Customer Shopping & Checkout (15 Screens)'
  },
  {
    html: path.resolve(rootDir, 'docs_navigation_flow', 'Module_3_Logistics_Driver_Flow.html'),
    pdf: path.resolve(outputDir, 'Module_3_Logistics_Driver_Navigation_Flow.pdf'),
    title: 'Module 3: Logistics & Driver Operations (9 Screens)'
  },
  {
    html: path.resolve(rootDir, 'docs_navigation_flow', 'Module_4_Supplier_Hub_Flow.html'),
    pdf: path.resolve(outputDir, 'Module_4_Supplier_Hub_Navigation_Flow.pdf'),
    title: 'Module 4: Supplier Hub & Merchant Operations (9 Screens)'
  },
  {
    html: path.resolve(rootDir, 'docs_navigation_flow', 'Module_5_Admin_Support_Flow.html'),
    pdf: path.resolve(outputDir, 'Module_5_Admin_Support_Navigation_Flow.pdf'),
    title: 'Module 5: Admin Panel & Customer Support (6 Screens)'
  },
  {
    html: path.resolve(rootDir, 'docs_navigation_flow', 'Module_6_Design_Themes_Flow.html'),
    pdf: path.resolve(outputDir, 'Module_6_Design_Themes_Navigation_Flow.pdf'),
    title: 'Module 6: Design Ecosystem & Themes (6 Screens)'
  }
];

console.log('\n======================================================');
console.log('🚀 Generating Module-Wise PDF Navigation Guides...');
console.log('======================================================\n');

for (const flow of flows) {
  if (fs.existsSync(flow.html)) {
    try {
      const fileUrl = 'file:///' + flow.html.replace(/\\/g, '/');
      const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${flow.pdf}" "${fileUrl}"`;
      execSync(cmd);
      console.log(`✅ Generated: ${path.basename(flow.pdf)}`);
    } catch (err) {
      console.error(`❌ Error generating ${path.basename(flow.pdf)}:`, err.message);
    }
  } else {
    console.warn(`⚠️ HTML not found: ${flow.html}`);
  }
}

console.log('\n✨ All module PDFs generated in: ' + outputDir + '\n');
