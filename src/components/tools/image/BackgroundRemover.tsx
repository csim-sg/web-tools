'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import UploadProgress from '@/components/UploadProgress';

export function BackgroundRemover() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  });

  const handleRemoveBackground = async () => {
    if (!image) return;

    try {
      setProcessing(true);
      setProgress(0);

      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch('/api/image/remove-bg', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Background removal failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResult(url);

    } catch (error) {
      console.error('Background removal failed:', error);
      alert('Failed to remove background. Please try again.');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  // Cleanup function for object URLs
  const cleanup = () => {
    if (preview) URL.revokeObjectURL(preview);
    if (result) URL.revokeObjectURL(result);
    setPreview(null);
    setResult(null);
    setImage(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
      {!preview && (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600'}`}
        >
          <input {...getInputProps()} />
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Drag & drop your image here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Supports PNG, JPG, JPEG
            </p>
          </div>
        </div>
      )}

      {preview && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Original Image
              </h3>
              <div className="relative aspect-square w-full">
                <Image
                  src={preview}
                  alt="Original"
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Result
              </h3>
              <div className="relative aspect-square w-full">
                {processing ? (
                  <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <UploadProgress progress={progress} />
                  </div>
                ) : result ? (
                  <Image
                    src={result}
                    alt="Result"
                    fill
                    className="object-contain rounded-lg"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 dark:bg-gray-700 rounded-lg">
                    <button
                      onClick={handleRemoveBackground}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      disabled={processing}
                    >
                      Remove Background
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={cleanup}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Try Another Image
            </button>
            {result && (
              <button
                onClick={() => {
                  const a = document.createElement('a');
                  a.href = result;
                  a.download = 'removed-background.png';
                  a.click();
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Download Result
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 