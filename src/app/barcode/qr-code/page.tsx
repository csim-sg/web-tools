import BarcodeGenerator from '@/components/BarcodeGenerator';

export default function QRCode() {
  return (
    <BarcodeGenerator
      type="qr"
      title="QR Code Generator"
      description="Generate QR codes for URLs, text, contact information, and more."
      placeholder="Enter URL, text, or contact information"
    />
  );
} 