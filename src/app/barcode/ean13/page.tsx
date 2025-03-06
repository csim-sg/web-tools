import BarcodeGenerator from '@/components/BarcodeGenerator';

export default function EAN13() {
  return (
    <BarcodeGenerator
      type="ean13"
      title="EAN-13 Barcode Generator"
      description="Generate EAN-13 barcodes for retail products."
      placeholder="Enter 12 or 13 digits"
      maxLength={13}
      validator={(value) => /^\d{12,13}$/.test(value)}
    />
  );
} 