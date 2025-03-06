'use client';
import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function ImageWatermark() {
  const [image, setImage] = useState<File | null>(null);
  const [watermark, setWatermark] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [position, setPosition] = useState<'center' | 'corner'>('corner');
  const [opacity, setOpacity] = useState(0.5);
  const [size, setSize] = useState(30); // percentage of main image
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { getRootProps: getMainProps, getInputProps: getMainInput } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => {
      setImage(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    }
  });

  const { getRootProps: getWatermarkProps, getInputProps: getWatermarkInput } = useDropzone({
    accept: { 'image/*': ['.png'] },
    maxFiles: 1,
    onDrop: (files) => setWatermark(files[0])
  });

  const applyWatermark = async () => {
    if (!image || !watermark || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load images
    const mainImg = await createImageBitmap(image);
    const watermarkImg = await createImageBitmap(watermark);

    // Set canvas size
    canvas.width = mainImg.width;
    canvas.height = mainImg.height;

    // Draw main image
    ctx.drawImage(mainImg, 0, 0);

    // Calculate watermark size
    const watermarkWidth = mainImg.width * (size / 100);
    const watermarkHeight = (watermarkWidth / watermarkImg.width) * watermarkImg.height;

    // Calculate position
    let x = 0;
    let y = 0;
    if (position === 'center') {
      x = (mainImg.width - watermarkWidth) / 2;
      y = (mainImg.height - watermarkHeight) / 2;
    } else {
      x = mainImg.width - watermarkWidth - 20;
      y = mainImg.height - watermarkHeight - 20;
    }

    // Apply opacity
    ctx.globalAlpha = opacity;

    // Draw watermark
    ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);

    // Reset opacity
    ctx.globalAlpha = 1;

    // Create download link
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'watermarked-image.png';
      a.click();
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      {/* UI implementation */}
    </div>
  );
} 