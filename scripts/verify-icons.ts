import fs from 'fs';
import path from 'path';

const iconsDir = path.join(process.cwd(), 'public', 'icons');

// Create icons directory if it doesn't exist
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// List of required icons
const requiredIcons = [
  'calculator.svg',
  'currency.svg',
  'password.svg',
  'loan.svg',
  'unit-converter.svg',
  'color.svg',
  'rate-calculator.svg',
  'repayment-calculator.svg'
];

// Verify each icon exists
requiredIcons.forEach(icon => {
  const iconPath = path.join(iconsDir, icon);
  if (!fs.existsSync(iconPath)) {
    console.error(`Missing icon: ${icon}`);
  }
}); 