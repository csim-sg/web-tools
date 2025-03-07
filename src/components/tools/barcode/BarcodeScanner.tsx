'use client';

import { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';


// Import QrScanner dynamically with proper type handling
// const QrScanner = dynamic(
//   () => import('qr-scanner').then((mod) => mod.default),
//   { 
//     ssr: false,
//     loading: () => (
//       <div className="flex items-center justify-center aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg">
//         <p className="text-gray-500 dark:text-gray-400">Loading scanner...</p>
//       </div>
//     )
//   }
// );

export function BarcodeScanner() {
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<any>(null);

  const startScanning = async () => {
    try {
      setScanning(true);
      setError('');
      setResult('');
      
      if (!videoRef.current) return;

      // Clean up previous scanner instance
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }

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
          returnDetailedScanResult: true,
        }
      );

      scannerRef.current = scanner;
      await scanner.start();
    } catch (err) {
      setError('Failed to start scanner. Please make sure camera permissions are granted.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="max-w-lg mx-auto space-y-4">
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={scanning ? stopScanning : startScanning}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                     dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50
                     transition-colors duration-200"
          >
            {scanning ? 'Stop Scanning' : 'Start Scanning'}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-center text-red-600 dark:text-red-400">
              {error}
            </p>
          </div>
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