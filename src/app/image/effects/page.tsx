'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

type Effect = 'grayscale' | 'sepia' | 'blur' | 'sharpen' | 'vintage' | 'brightness' | 'contrast';

export default function ImageEffects() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedEffect, setSelectedEffect] = useState<Effect>('grayscale');
  const [intensity, setIntensity] = useState(50);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: (files) => {
      setImage(files[0]);
      setPreview(URL.createObjectURL(files[0]));
    }
  });

  const applyEffect = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('effect', selectedEffect);
    formData.append('intensity', intensity.toString());

    const response = await fetch('/api/image/effects', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Effect application failed');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `effect-${selectedEffect}.png`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      {/* UI implementation */}
    </div>
  );
} 