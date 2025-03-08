'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FileIcon, ArrowDownIcon } from 'lucide-react';

type CompressionLevel = 'low' | 'medium' | 'high';

export function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium');
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);
        setOriginalSize(file.size);
      }
    }
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const compressPDF = async () => {
    if (!file) return;
    
    setCompressing(true);
    setProgress(0);
    
    // Simulate compression progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 5;
      });
    }, 200);
    
    try {
      // In a real implementation, you would send the file to a server for compression
      // or use a client-side library like pdf-lib with specific compression settings
      
      // For this example, we'll simulate compression with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Simulate compression result based on selected level
      const compressionFactors = {
        low: 0.8,
        medium: 0.6,
        high: 0.4
      };
      
      const simulatedCompressedSize = Math.floor(originalSize * compressionFactors[compressionLevel]);
      setCompressedSize(simulatedCompressedSize);
      
      // In a real implementation, you would create a Blob from the compressed PDF
      // and provide it for download
      const blob = new Blob([await file.arrayBuffer()], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace('.pdf', '')}_compressed.pdf`;
      a.click();
      
      setProgress(100);
    } catch (error) {
      console.error('Failed to compress PDF:', error);
      alert('Failed to compress PDF. Please try again.');
    } finally {
      setCompressing(false);
    }
  };

  return (
    <Card className="p-6">
      {!file ? (
        <div 
          {...getRootProps()} 
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-2">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p>Drag & drop a PDF file here, or click to select</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">Size: {formatFileSize(originalSize)}</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setFile(null);
                setOriginalSize(0);
                setCompressedSize(0);
              }}
            >
              Change File
            </Button>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <Label>Compression Level</Label>
              <RadioGroup 
                value={compressionLevel} 
                onValueChange={(value) => setCompressionLevel(value as CompressionLevel)}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low (Better quality, larger file size)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium (Balanced quality and file size)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High (Lower quality, smaller file size)</Label>
                </div>
              </RadioGroup>
            </div>
            
            {compressing && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Compressing...</span>
                  <span className="text-sm">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
            
            <Button
              onClick={compressPDF}
              disabled={compressing}
              className="w-full"
            >
              {compressing ? 'Compressing...' : 'Compress PDF'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
} 