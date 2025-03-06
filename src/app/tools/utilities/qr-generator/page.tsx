'use client';
import { useState } from 'react';
import QRCode from 'qrcode';

export default function QRGenerator() {
  const [text, setText] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [size, setSize] = useState(300);
  const [color, setColor] = useState('#000000');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');

  const generateQR = async () => {
    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 1,
        color: {
          dark: color,
          light: backgroundColor
        }
      });
      setQrCode(url);
    } catch (err) {
      console.error('Failed to generate QR code:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      {/* Implementation similar to previous tools */}
    </div>
  );
} 