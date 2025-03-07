'use client';

import { useState, useRef, useEffect } from 'react';
import type QrScanner from 'qr-scanner';

interface QRScannerProps {
  onResult: (result: string) => void;
  onError: (error: string) => void;
}

export function QRScanner({ onResult, onError }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop();
      }
    };
  }, [scanner]);

  const startScanning = async () => {
    try {
      setIsScanning(true);
      
      if (!videoRef.current) return;

      const QrScannerModule = (await import('qr-scanner')).default;
      
      const newScanner = new QrScannerModule(
        videoRef.current,
        (result) => {
          onResult(result.data);
          newScanner.stop();
          setIsScanning(false);
        },
        {
          highlightScanRegion: true,
          highlightCodeOutline: true,
        }
      );

      setScanner(newScanner);
      await newScanner.start();
    } catch {
      onError('Failed to start scanner');
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scanner) {
      scanner.stop();
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={startScanning}
          disabled={isScanning}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                   dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
        >
          {isScanning ? 'Scanning...' : 'Start Scanning'}
        </button>
        {isScanning && (
          <button
            onClick={stopScanning}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600
                     dark:bg-red-600 dark:hover:bg-red-700"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
