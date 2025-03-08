'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileIcon, Download, Image as ImageIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { processImage, formatFileSize, type ImageFormat } from '@/lib/utils/image-utils';
import { saveAs } from 'file-saver';

export function ImageConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(90);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp', '.avif']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
      }
    }
  });

  const handleConversion = async () => {
    if (!file) return;
    setConverting(true);
    setProgress(0);

    try {
      const result = await processImage(file, {
        format,
        quality,
      });

      if (!result.success || !result.processedBlob) {
        throw new Error(result.message || 'Conversion failed');
      }

      // Save the converted image
      const newFileName = file.name.replace(/\.[^/.]+$/, `.${format}`);
      saveAs(result.processedBlob, newFileName);

      // Show success message
      const compressionRatio = ((file.size - result.processedSize!) / file.size * 100).toFixed(1);
      alert(`Conversion successful!\nSize reduced by ${compressionRatio}%\nOriginal: ${formatFileSize(file.size)}\nConverted: ${formatFileSize(result.processedSize!)}`);

    } catch (error) {
      console.error('Conversion failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to convert image');
    } finally {
      setConverting(false);
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
              Supports PNG, JPG, WEBP, AVIF
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
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFile(null);
                  setPreview('');
                }}
              >
                Change File
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Output Format</Label>
                <Select value={format} onValueChange={(value: ImageFormat) => setFormat(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="png">PNG</SelectItem>
                    <SelectItem value="jpeg">JPEG</SelectItem>
                    <SelectItem value="webp">WebP</SelectItem>
                    <SelectItem value="avif">AVIF</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quality ({quality}%)</Label>
                <Slider
                  value={[quality]}
                  onValueChange={(value) => setQuality(value[0])}
                  min={1}
                  max={100}
                  step={1}
                />
              </div>
            </div>

            {converting ? (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-sm text-center text-muted-foreground">
                  Converting... {Math.round(progress)}%
                </p>
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={handleConversion}
                disabled={!file}
              >
                <Download className="w-4 h-4 mr-2" />
                Convert & Download
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>Select an image to start converting</p>
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