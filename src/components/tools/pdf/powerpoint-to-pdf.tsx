'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileIcon, Download, FileText, FileType } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  convertPowerPointToPDF, 
  validatePowerPointFile, 
  savePDF,
  type PowerPointToPDFOptions 
} from '@/lib/utils/powerpoint-utils';

export function PowerPointToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [quality, setQuality] = useState<'standard' | 'high'>('high');
  const [preserveAnimations, setPreserveAnimations] = useState(true);
  const [preserveComments, setPreserveComments] = useState(false);
  const [loading, setLoading] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB max file size
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    }
  });

  const handleConversion = async () => {
    if (!file) return;

    setConverting(true);
    setProgress(0);

    try {
      // Validate file
      validatePowerPointFile(file);

      // Convert file
      const result = await convertPowerPointToPDF({
        file,
        quality,
        preserveAnimations,
        preserveComments,
        onProgress: setProgress
      });

      if (!result.success || !result.pdfBlob) {
        throw new Error(result.message || 'Conversion failed');
      }

      // Save the converted PDF
      savePDF(result.pdfBlob, file.name);

    } catch (error) {
      console.error('Conversion failed:', error);
      alert(error instanceof Error ? error.message : 'Failed to convert PowerPoint to PDF');
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
    <div className="space-y-6">
      <Card className="p-6">
        {!file ? (
          <div 
            {...getRootProps()} 
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-gray-300 dark:border-gray-600'}`}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-2">
              <FileType className="w-12 h-12 text-muted-foreground" />
              <p>Drag & drop a PowerPoint file here, or click to select</p>
              <p className="text-sm text-muted-foreground">
                Supported formats: .pptx, .ppt (Max: 50MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileType className="h-8 w-8 text-primary" />
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
                  setProgress(0);
                }}
              >
                Change File
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Quality</Label>
                <Select value={quality} onValueChange={(value: 'standard' | 'high') => setQuality(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select quality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Quality</SelectItem>
                    <SelectItem value="high">High Quality</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="preserve-animations"
                    checked={preserveAnimations}
                    onCheckedChange={setPreserveAnimations}
                  />
                  <Label htmlFor="preserve-animations">Preserve animations</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="preserve-comments"
                    checked={preserveComments}
                    onCheckedChange={setPreserveComments}
                  />
                  <Label htmlFor="preserve-comments">Include comments</Label>
                </div>
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
                <FileText className="w-4 h-4 mr-2" />
                Convert to PDF
              </Button>
            )}
          </div>
        )}
      </Card>
    </div>
  );
} 