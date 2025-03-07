import BarcodeGenerator from '@/components/BarcodeGenerator';
import { validateCode128 } from '@/lib/validators/barcode';

export default function Code128() {
  return (
    <BarcodeGenerator
      type="code128"
      title="Code 128 Barcode Generator"
      description="Generate Code 128 barcodes for general-purpose use."
      placeholder="Enter alphanumeric text"
      validator={validateCode128}
    />
  );
} 