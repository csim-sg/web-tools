'use client';
import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';

const QrScanner = dynamic(() => import('qr-scanner'), { ssr: false });

export default function BarcodeScanner() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);

  const startScanning = async () => {
    try {
      setScanning(true);
      setError('');
      
      if (!videoRef.current) return;

      const scanner = new QrScanner(
        videoRef.current,
        (result) => {
          setResult(result.data);
          scanner.stop();
          setScanning(false);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      await scanner.start();
    } catch (err) {
      setError('Failed to start scanner');
      setScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Barcode Scanner
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Scan QR codes and barcodes using your camera
        </p>
      </div>

      <div className="max-w-lg mx-auto space-y-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={startScanning}
            disabled={scanning}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                     dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
          >
            {scanning ? 'Scanning...' : 'Start Scanning'}
          </button>
        </div>

        {error && (
          <p className="text-center text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {result && (
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <h3 className="font-medium text-gray-900 dark:text-white">
              Scan Result:
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400 break-all">
              {result}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 