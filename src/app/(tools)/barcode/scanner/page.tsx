import { Metadata } from 'next';
import { BarcodeScanner } from '@/components/tools/barcode/BarcodeScanner';

export const metadata: Metadata = {
  title: 'Barcode Scanner - WebTools',
  description: 'Scan QR codes and barcodes using your camera',
};

export default function BarcodeScannerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Barcode Scanner
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Scan QR codes and barcodes using your camera
        </p>
      </div>
      
      <BarcodeScanner />
    </div>
  );
} 