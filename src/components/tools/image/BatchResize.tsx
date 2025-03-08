'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileIcon, Download, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { batchProcessImages, formatFileSize } from '@/lib/utils/image-utils';
import JSZip from 'jszip';

export function BatchResize() {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [quality, setQuality] = useState(90);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles(acceptedFiles);
    }
  });

  const handleBatchResize = async () => {
    if (files.length === 0) return;
    setProcessing(true);
    setProgress(0);

    try {
      const result = await batchProcessImages(files, {
        width: width || undefined,
        height: height || undefined,
        maintainAspectRatio,
        quality,
        onProgress: setProgress
      });

      if (!result.success || !result.processedBlob) {
        throw new Error(result.message || 'Batch processing failed');
      }

      // Save the ZIP file
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const zipFileName = `resized-images-${timestamp}.zip`;
      const blob = result.processedBlob;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = zipFileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Show success message
      alert(`Successfully processed ${files.length} images!\nTotal size reduced from ${formatFileSize(result.originalSize!)} to ${formatFileSize(result.processedSize!)}`);

    } catch (error) {
      console.error('Batch processing failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to process images');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-gray-300 dark:border-gray-600'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
            <p>Drag & drop multiple images here, or click to select</p>
            <p className="text-sm text-muted-foreground">
              Supports PNG, JPG, WEBP (Max 50 files)
            </p>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {files.length} files selected ({formatFileSize(files.reduce((acc, file) => acc + file.size, 0))})
              </p>
              <Button 
                variant="outline" 
                onClick={() => setFiles([])}
              >
                Clear All
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Width (px)</Label>
                <Input
                  type="number"
                  value={width || ''}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  placeholder="Original width"
                />
              </div>
              <div className="space-y-2">
                <Label>Height (px)</Label>
                <Input
                  type="number"
                  value={height || ''}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  placeholder="Original height"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Quality ({quality}%)</Label>
              <Input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="aspect-ratio"
                checked={maintainAspectRatio}
                onCheckedChange={setMaintainAspectRatio}
              />
              <Label htmlFor="aspect-ratio">Maintain aspect ratio</Label>
            </div>

            {processing ? (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  Processing... {Math.round(progress)}%
                </p>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={handleBatchResize}
                disabled={files.length === 0}
              >
                <Download className="w-4 h-4 mr-2" />
                Process & Download ZIP
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
} 