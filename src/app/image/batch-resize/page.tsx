'use client';
import { useState } from 'react';
import BatchImageProcessor from '@/components/BatchImageProcessor';

export default function BatchResize() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [resizeMode, setResizeMode] = useState<'exact' | 'fit' | 'fill'>('fit');

  const handleBatchResize = async (files: File[]) => {
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    formData.append('width', width.toString());
    formData.append('height', height.toString());
    formData.append('maintainAspectRatio', maintainAspectRatio.toString());
    formData.append('resizeMode', resizeMode);

    const response = await fetch('/api/image/batch-resize', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error('Batch resize failed');

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resized-images.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Batch Image Resizer</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Width (px)</label>
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Height (px)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={maintainAspectRatio}
                onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                className="mr-2"
              />
              Maintain aspect ratio
            </label>

            <div>
              <label className="block text-sm font-medium mb-2">Resize Mode</label>
              <select
                value={resizeMode}
                onChange={(e) => setResizeMode(e.target.value as any)}
                className="w-full p-2 border rounded"
              >
                <option value="exact">Exact Size</option>
                <option value="fit">Fit Within</option>
                <option value="fill">Fill Space</option>
              </select>
            </div>
          </div>

          <BatchImageProcessor
            onProcess={handleBatchResize}
            accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] }}
            maxFiles={20}
            title="Batch Image Resizer"
            description="Drag & drop images here, or click to select"
          />
        </div>
      </div>
    </div>
  );
} 