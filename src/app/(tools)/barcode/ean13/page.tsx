import BarcodeGenerator from '@/components/BarcodeGenerator';
import { validateEAN13 } from '@/lib/validators/barcode';

export default function EAN13() {
  return (
    <BarcodeGenerator
      type="ean13"
      title="EAN-13 Barcode Generator"
      description="Generate EAN-13 barcodes for retail products."
      placeholder="Enter 12 or 13 digits"
      maxLength={13}
      validator={validateEAN13}
    />
  );
} 