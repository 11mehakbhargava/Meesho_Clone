const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 1. Try Headless Browser Print-to-PDF first for rich graphics
const htmlPath = path.resolve(__dirname, '..', 'Meesho_Clone_Navigation_Flow.html');
const pdfPath = path.resolve(__dirname, '..', 'Meesho_Clone_Navigation_Flow.pdf');

const edgePaths = [
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
];

let browserPath = edgePaths.find(p => fs.existsSync(p));

if (browserPath) {
  try {
    const cmd = `"${browserPath}" --headless --disable-gpu --no-pdf-header-footer --print-to-pdf="${pdfPath}" "file:///${htmlPath.replace(/\\/g, '/')}"`;
    execSync(cmd);
    console.log('PDF successfully created via headless browser at: ' + pdfPath);
    process.exit(0);
  } catch (e) {
    console.log('Browser headless fallback: ' + e.message);
  }
}
