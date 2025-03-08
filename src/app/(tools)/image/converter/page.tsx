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

type ImageFormat = 'png' | 'jpeg' | 'webp' | 'avif';

export default function ImageConverter() {
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
      // Simulate conversion progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      // TODO: Implement actual conversion logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      clearInterval(interval);
      setProgress(100);

      // Simulate download
      const blob = new Blob([file], { type: `image/${format}` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.[^/.]+$/, `.${format}`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert image. Please try again.');
    } finally {
      setConverting(false);
      setProgress(0);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Image Converter</h1>
        <p className="text-muted-foreground">
          Convert your images to different formats while maintaining quality
        </p>
      </div>

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
    </div>
  );
} 