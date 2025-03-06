'use client';
import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';

interface BarcodeGeneratorProps {
  type: 'qr' | 'code128' | 'ean13' | 'upca' | 'code39' | 'datamatrix' | 'pdf417';
  title: string;
  description: string;
  validator?: (value: string) => boolean;
  placeholder?: string;
  maxLength?: number;
}

export default function BarcodeGenerator({
  type,
  title,
  description,
  validator,
  placeholder = 'Enter text or URL',
  maxLength = 100
}: BarcodeGeneratorProps) {
  const [input, setInput] = useState('');
  const [barcodeUrl, setBarcodeUrl] = useState('');
  const [error, setError] = useState('');
  const [size, setSize] = useState(200);
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const { theme } = useTheme();

  useEffect(() => {
    if (!input) {
      setBarcodeUrl('');
      setError('');
      return;
    }

    if (validator && !validator(input)) {
      setError('Invalid input format');
      setBarcodeUrl('');
      return;
    }

    generateBarcode();
  }, [input, size, color, backgroundColor]);

  const generateBarcode = async () => {
    try {
      const response = await fetch('/api/barcode/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          input,
          size,
          color,
          backgroundColor
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate barcode');
      }

      const blob = await response.blob();
      setBarcodeUrl(URL.createObjectURL(blob));
      setError('');
    } catch (err) {
      setError('Failed to generate barcode');
      setBarcodeUrl('');
    }
  };

  const downloadBarcode = () => {
    if (!barcodeUrl) return;

    const a = document.createElement('a');
    a.href = barcodeUrl;
    a.download = `${type}-barcode.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {title}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Content
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={maxLength}
              placeholder={placeholder}
              className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-600 
                       shadow-sm py-2 px-3 bg-white dark:bg-gray-700
                       text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {error && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Size (px)
            </label>
            <input
              type="range"
              min="100"
              max="400"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="mt-1 block w-full"
            />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {size}px
            </span>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Colors
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400">
                  Barcode Color
                </label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="mt-1 block w-full h-8 rounded-md"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 dark:text-gray-400">
                  Background
                </label>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="mt-1 block w-full h-8 rounded-md"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-4">
          {barcodeUrl ? (
            <>
              <div className="p-4 bg-white rounded-lg shadow">
                <Image
                  src={barcodeUrl}
                  alt="Generated Barcode"
                  width={size}
                  height={size}
                  className="max-w-full h-auto"
                />
              </div>
              <button
                onClick={downloadBarcode}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600
                         dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Download
              </button>
            </>
          ) : (
            <div className="text-center text-gray-500 dark:text-gray-400">
              Enter content to generate barcode
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 