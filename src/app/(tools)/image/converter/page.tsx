'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import UploadProgress from '@/components/UploadProgress';
import { Metadata } from 'next';
import { generateMetadata } from '@/lib/utils/metadata';
import { imageService } from '@/services/image/imageService';
import { ImageFormat } from '@/lib/types/image';

export const metadata: Metadata = generateMetadata('/image/converter');

export default function ImageConverter() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [format, setFormat] = useState('png');
  const [quality, setQuality] = useState(90);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.gif']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  });

  const handleConvert = async () => {
    if (!image) return;

    try {
      setConverting(true);
      setProgress(0);

      const convertedImage = await imageService.convertImage(image, { format, quality });
      const url = URL.createObjectURL(convertedImage);
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted-image.${format}`;
      a.click();

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to convert image:', error);
      alert('Failed to convert image. Please try again.');
    } finally {
      setConverting(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      {/* Similar UI structure as video converter */}
    </div>
  );
} 