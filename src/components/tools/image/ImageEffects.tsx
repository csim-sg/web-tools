'use client';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileIcon, Download, Image as ImageIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { processImage, formatFileSize, type ImageEffect } from '@/lib/utils/image-utils';
import { saveAs } from 'file-saver';

const effects: { value: ImageEffect; label: string }[] = [
  { value: 'grayscale', label: 'Grayscale' },
  { value: 'blur', label: 'Blur' },
  { value: 'sepia', label: 'Sepia' },
  { value: 'invert', label: 'Invert' },
  { value: 'brightness', label: 'Brightness' },
  { value: 'contrast', label: 'Contrast' },
  { value: 'saturation', label: 'Saturation' }
];

export function ImageEffects() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [processedPreview, setProcessedPreview] = useState<string>('');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [effect, setEffect] = useState<ImageEffect>('grayscale');
  const [intensity, setIntensity] = useState(50);

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

  // Update preview when effect or intensity changes
  useEffect(() => {
    if (!file) return;

    const updatePreview = async () => {
      try {
        const result = await processImage(file, {
          effect,
          effectIntensity: intensity / 100,
        });

        if (result.success && result.processedBlob) {
          const previewUrl = URL.createObjectURL(result.processedBlob);
          setProcessedPreview(previewUrl);
        }
      } catch (error) {
        console.error('Preview generation failed:', error);
      }
    };

    const timer = setTimeout(updatePreview, 300);
    return () => clearTimeout(timer);
  }, [file, effect, intensity]);

  const handleApplyEffect = async () => {
    if (!file) return;
    setProcessing(true);
    setProgress(0);

    try {
      const result = await processImage(file, {
        effect,
        effectIntensity: intensity / 100,
      });

      if (!result.success || !result.processedBlob) {
        throw new Error(result.message || 'Effect application failed');
      }

      // Save the processed image
      const addingFileName = file.name.match(/\.[^/.]+$/)
      const newFileName = file.name.replace(/\.[^/.]+$/, `-${effect}${addingFileName && addingFileName.length>0?addingFileName[0]: ""}`);
      saveAs(result.processedBlob, newFileName);

      // Show success message
      alert('Effect applied successfully!');

    } catch (error) {
      console.error('Effect application failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to apply effect');
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
              <div className="space-y-2">
                <Label>Effect</Label>
                <Select value={effect} onValueChange={(value: ImageEffect) => setEffect(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select effect" />
                  </SelectTrigger>
                  <SelectContent>
                    {effects.map(effect => (
                      <SelectItem key={effect.value} value={effect.value}>
                        {effect.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Intensity ({intensity}%)</Label>
                <Slider
                  value={[intensity]}
                  onValueChange={(value) => setIntensity(value[0])}
                  min={0}
                  max={100}
                  step={1}
                />
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
                onClick={handleApplyEffect}
                disabled={!file}
              >
                <Download className="w-4 h-4 mr-2" />
                Apply Effect & Download
              </Button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <p>Select an image to start applying effects</p>
          </div>
        )}
      </Card>

      {preview && (
        <Card className="p-6 md:col-span-2">
          <div className="space-y-2">
            <Label>Preview</Label>
            <div className="grid grid-cols-2 gap-4">
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
              <div className="space-y-2">
                <Label>With Effect</Label>
                <div className="rounded-lg overflow-hidden border bg-background">
                  <img
                    src={processedPreview || preview}
                    alt="Preview with effect"
                    className="max-w-full h-auto mx-auto"
                    style={{ maxHeight: '400px' }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
} 