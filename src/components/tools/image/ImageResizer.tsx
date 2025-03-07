'use client';

import { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import {default as NextImage} from 'next/image';

export function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const url = URL.createObjectURL(file);
      setImage(url);

      // Get original dimensions
      const img = new Image();
      img.onload = () => {
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = url;
    }
  });

  // Handle aspect ratio
  useEffect(() => {
    if (maintainAspectRatio && originalDimensions.width > 0) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      if (width !== originalDimensions.width) {
        setHeight(Math.round(width / aspectRatio));
      } else {
        setWidth(Math.round(height * aspectRatio));
      }
    }
  }, [width, height, maintainAspectRatio, originalDimensions]);

  // Cleanup function for object URLs
  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image);
      if (resizedImage) URL.revokeObjectURL(resizedImage);
    };
  }, [image, resizedImage]);

  const handleResize = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      
      // Use better quality settings
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob for better quality
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          if (resizedImage) URL.revokeObjectURL(resizedImage);
          setResizedImage(url);
        }
      }, 'image/png', 1.0);
    };

    img.src = image;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {!image ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-300">
              Drag & drop an image here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports PNG, JPG, JPEG, WebP
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Original Image</h3>
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <NextImage
                  src={image}
                  alt="Original"
                  fill
                  className="object-contain"
                />
                <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                  {originalDimensions.width} x {originalDimensions.height}
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Resized Image</h3>
              <div className="relative aspect-video bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                {resizedImage ? (
                  <>
                    <NextImage
                      src={resizedImage}
                      alt="Resized"
                      fill
                      className="object-contain"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                      {width} x {height}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                    Click resize to see result
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">Width (px)</span>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm"
                  min="1"
                />
              </label>
              
              <label className="block">
                <span className="text-gray-700 dark:text-gray-300">Height (px)</span>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm"
                  min="1"
                />
              </label>
            </div>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600"
              />
              <span className="text-gray-700 dark:text-gray-300">Maintain aspect ratio</span>
            </label>
            
            <div className="flex space-x-4">
              <button
                onClick={handleResize}
                className="flex-1 py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              >
                Resize
              </button>
              
              {resizedImage && (
                <button
                  onClick={() => {
                    const a = document.createElement('a');
                    a.href = resizedImage;
                    a.download = 'resized-image.png';
                    a.click();
                  }}
                  className="flex-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors"
                >
                  Download
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
} 