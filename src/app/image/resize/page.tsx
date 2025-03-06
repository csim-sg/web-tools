'use client';
import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

export default function ImageResizer() {
  const [image, setImage] = useState<string | null>(null);
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizedImage, setResizedImage] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(URL.createObjectURL(file));
    }
  });

  const handleResize = () => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      setResizedImage(canvas.toDataURL());
    };

    img.src = image;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Image Resizer</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {!image ? (
            <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center">
              <input {...getInputProps()} />
              <p>Drag & drop an image here, or click to select</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Original Image</h3>
                  <div className="relative aspect-video">
                    <Image
                      src={image}
                      alt="Original"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Resized Image</h3>
                  <div className="relative aspect-video">
                    {resizedImage ? (
                      <Image
                        src={resizedImage}
                        alt="Resized"
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        <p>Click resize to see result</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="flex-1">
                    Width (px)
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border rounded"
                    />
                  </label>
                  
                  <label className="flex-1">
                    Height (px)
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-2 border rounded"
                    />
                  </label>
                </div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={maintainAspectRatio}
                    onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                    className="mr-2"
                  />
                  Maintain aspect ratio
                </label>
                
                <div className="flex space-x-4">
                  <button
                    onClick={handleResize}
                    className="flex-1 py-2 bg-blue-500 text-white rounded"
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
                      className="flex-1 py-2 bg-green-500 text-white rounded"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
}