'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileIcon, Download, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { removeBackground, formatFileSize } from '@/lib/utils/image-utils';
import { saveAs } from 'file-saver';

export function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [processedPreview, setProcessedPreview] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [highQuality, setHighQuality] = useState(true);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setProcessedPreview('');
      }
    }
  });

  const handleRemoveBackground = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);

    try {
      const result = await removeBackground(file, {
        quality: highQuality ? 'high' : 'fast'
      });

      if (!result.success || !result.processedBlob) {
        throw new Error(result.message || 'Background removal failed');
      }

      // Create preview
      const processedUrl = URL.createObjectURL(result.processedBlob);
      setProcessedPreview(processedUrl);

      // Save the processed image
      const newFileName = file.name.replace(/\.[^/.]+$/, '-nobg.png');
      saveAs(result.processedBlob, newFileName);

      // Show success message
      alert('Background removed successfully!');

    } catch (error) {
      console.error('Background removal failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to remove background');
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
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => {
                  setFile(null);
                  setPreview('');
                  setProcessedPreview('');
                }}
              >
                Change File
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="high-quality"
                  checked={highQuality}
                  onCheckedChange={setHighQuality}
                />
                <Label htmlFor="high-quality">High Quality Processing</Label>
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
                onClick={handleRemoveBackground}
                disabled={!file}
              >
                <Download className="w-4 h-4 mr-2" />
                Remove Background & Download
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>Select an image to start processing</p>
          </div>
        )}
      </Card>

      {(preview || processedPreview) && (
        <Card className="p-6 md:col-span-2">
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="grid grid-cols-2 gap-4">
              {preview && (
                <div className="space-y-2">
                  <Label>Original</Label>
                  <div className="rounded-lg overflow-hidden border bg-background">
                    <img
                      src={preview}
                      alt="Original"
                      className="max-w-full h-auto mx-auto"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                </div>
              )}
              {processedPreview && (
                <div className="space-y-2">
                  <Label>Processed</Label>
                  <div className="rounded-lg overflow-hidden border bg-background">
                    <img
                      src={processedPreview}
                      alt="Processed"
                      className="max-w-full h-auto mx-auto"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 