'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import Image from 'next/image';
import UploadProgress from '@/components/UploadProgress';

export default function ImageCompressor() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState('medium');

  const compressionOptions = {
    high: { maxSizeMB: 0.5, maxWidthOrHeight: 1024 },
    medium: { maxSizeMB: 1, maxWidthOrHeight: 1920 },
    low: { maxSizeMB: 2, maxWidthOrHeight: 2560 }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setCompressedPreview(null);
    }
  });

  const handleCompress = async () => {
    if (!image) return;

    try {
      setCompressing(true);
      setProgress(0);

      const options = {
        ...compressionOptions[compressionLevel as keyof typeof compressionOptions],
        onProgress: (progress: number) => setProgress(progress),
      };

      const compressedFile = await imageCompression(image, options);
      const compressedUrl = URL.createObjectURL(compressedFile);
      setCompressedPreview(compressedUrl);

      // Create download link
      const a = document.createElement('a');
      a.href = compressedUrl;
      a.download = `compressed-${image.name}`;
      a.click();

    } catch (error) {
      console.error('Compression failed:', error);
      alert('Failed to compress image. Please try again.');
    } finally {
      setCompressing(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      {/* Similar UI structure */}
    </div>
  );
} 