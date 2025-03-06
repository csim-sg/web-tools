import BarcodeGenerator from '@/components/BarcodeGenerator';

export default function Code128() {
  return (
    <BarcodeGenerator
      type="code128"
      title="Code 128 Barcode Generator"
      description="Generate Code 128 barcodes for general-purpose use."
      placeholder="Enter alphanumeric text"
      validator={(value) => /^[\x20-\x7F]+$/.test(value)}
    />
  );
} 