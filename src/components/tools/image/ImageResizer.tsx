'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileIcon, Download, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { resizeImage, formatFileSize } from '@/lib/utils/image-utils';
import { saveAs } from 'file-saver';

type ResizeMode = 'custom' | 'preset';
type PresetSize = '640x480' | '1280x720' | '1920x1080' | '3840x2160';

export function ImageResizer() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [resizeMode, setResizeMode] = useState<ResizeMode>('custom');
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);
  const [presetSize, setPresetSize] = useState<PresetSize>('1280x720');
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);
        
        // Get image dimensions
        const img = new Image();
        img.onload = () => {
          setOriginalDimensions({ width: img.width, height: img.height });
          setWidth(img.width);
          setHeight(img.height);
        };
        img.src = URL.createObjectURL(file);
        setPreview(img.src);
      }
    }
  });

  // Update dimensions when preset size changes
  useEffect(() => {
    if (resizeMode === 'preset') {
      const [w, h] = presetSize.split('x').map(Number);
      setWidth(w);
      setHeight(h);
    }
  }, [presetSize, resizeMode]);

  // Update height when width changes and maintain aspect ratio
  useEffect(() => {
    if (maintainAspectRatio && originalDimensions && width > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setHeight(Math.round(width / ratio));
    }
  }, [width, maintainAspectRatio, originalDimensions]);

  const handleResize = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);

    try {
      const result = await resizeImage(file, {
        width,
        height,
        maintainAspectRatio,
        quality: 90
      });

      if (!result.success || !result.processedBlob) {
        throw new Error(result.message || 'Resize failed');
      }

      // Save the resized image
      const dimensions = `${width}x${height}`;
      const addingFileName = file.name.match(/\.[^/.]+$/)
      const newFileName = file.name.replace(/\.[^/.]+$/, `-${dimensions}${addingFileName && addingFileName.length>0?addingFileName[0]: ""}`);
      saveAs(result.processedBlob, newFileName);

      // Show success message
      alert(`Image resized successfully!\nNew dimensions: ${width}x${height}`);

    } catch (error) {
      console.error('Resize failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to resize image');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
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
            <p>Drag & drop an image here, or click to select</p>
            <p className="text-sm text-muted-foreground">
              Supports PNG, JPG, WEBP
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-6 space-y-6">
        {file ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-medium">{file.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                  {originalDimensions && (
                    <p className="text-sm text-muted-foreground">
                      Original: {originalDimensions.width}x{originalDimensions.height}
                    </p>
                  )}
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFile(null);
                  setPreview('');
                  setOriginalDimensions(null);
                }}
              >
                Change File
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Resize Mode</Label>
                <Select value={resizeMode} onValueChange={(value: ResizeMode) => setResizeMode(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Size</SelectItem>
                    <SelectItem value="preset">Preset Size</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {resizeMode === 'preset' ? (
                <div className="space-y-2">
                  <Label>Preset Size</Label>
                  <Select value={presetSize} onValueChange={(value: PresetSize) => setPresetSize(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="640x480">640x480 (VGA)</SelectItem>
                      <SelectItem value="1280x720">1280x720 (HD)</SelectItem>
                      <SelectItem value="1920x1080">1920x1080 (Full HD)</SelectItem>
                      <SelectItem value="3840x2160">3840x2160 (4K)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Width (px)</Label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Height (px)</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      disabled={maintainAspectRatio}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="aspect-ratio"
                  checked={maintainAspectRatio}
                  onCheckedChange={setMaintainAspectRatio}
                />
                <Label htmlFor="aspect-ratio">Maintain Aspect Ratio</Label>
              </div>
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
                onClick={handleResize}
                disabled={!file}
              >
                <Download className="w-4 h-4 mr-2" />
                Resize & Download
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>Select an image to start resizing</p>
          </div>
        )}
      </Card>

      {preview && (
        <Card className="p-6 md:col-span-2">
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="rounded-lg overflow-hidden border bg-background">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full h-auto mx-auto"
                style={{ maxHeight: '400px' }}
              />
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 