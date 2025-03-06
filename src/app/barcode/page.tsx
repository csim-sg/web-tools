import { ToolLayout } from '@/components/ToolLayout';

const barcodeTools = [
  {
    name: 'QR Code',
    description: 'Generate and scan QR codes for URLs, text, and more',
    icon: '/icons/qr-code.svg',
    href: '/barcode/qr-code'
  },
  {
    name: 'Code 128',
    description: 'Generate Code 128 barcodes for general-purpose use',
    icon: '/icons/barcode.svg',
    href: '/barcode/code128'
  },
  {
    name: 'EAN-13',
    description: 'Create EAN-13 barcodes for retail products',
    icon: '/icons/barcode.svg',
    href: '/barcode/ean13'
  },
  {
    name: 'UPC-A',
    description: 'Generate UPC-A barcodes for North American retail',
    icon: '/icons/barcode.svg',
    href: '/barcode/upca'
  },
  {
    name: 'Code 39',
    description: 'Create Code 39 barcodes for industrial use',
    icon: '/icons/barcode.svg',
    href: '/barcode/code39'
  },
  {
    name: 'DataMatrix',
    description: '2D barcodes for industrial and commercial use',
    icon: '/icons/datamatrix.svg',
    href: '/barcode/datamatrix'
  },
  {
    name: 'PDF417',
    description: 'Generate PDF417 barcodes for documents and ID cards',
    icon: '/icons/pdf417.svg',
    href: '/barcode/pdf417'
  },
  {
    name: 'Barcode Scanner',
    description: 'Scan and decode various types of barcodes',
    icon: '/icons/scanner.svg',
    href: '/barcode/scanner'
  }
];

export default function BarcodeTools() {
  return (
    <ToolLayout
      category="Barcode Tools"
      description="Generate and scan various types of barcodes for different purposes."
      tools={barcodeTools}
    />
  );
} 