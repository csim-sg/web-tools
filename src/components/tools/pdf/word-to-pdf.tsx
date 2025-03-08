'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { FileIcon } from 'lucide-react';

export function WordToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    }
  });

  const convertToPDF = async () => {
    if (!file) return;
    
    setConverting(true);
    setProgress(0);
    
    // Simulate conversion progress
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
      // In a real implementation, you would send the file to a server for conversion
      // or use a client-side library if available
      
      // For this example, we'll simulate conversion with a timeout
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // In a real implementation, you would create a Blob from the converted PDF
      // and provide it for download
      const blob = new Blob([await file.arrayBuffer()], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name.replace(/\.(docx|doc)$/, '')}.pdf`;
      a.click();
      
      setProgress(100);
    } catch (error) {
      console.error('Failed to convert Word to PDF:', error);
      alert('Failed to convert Word to PDF. Please try again.');
    } finally {
      setConverting(false);
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
            <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p>Drag & drop a Word document here, or click to select</p>
            <p className="text-sm text-muted-foreground">
              Supported formats: .docx, .doc
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileIcon className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">{file.name}</h3>
                <p className="text-sm text-muted-foreground">Size: {formatFileSize(file.size)}</p>
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
          
          {converting && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Converting...</span>
                <span className="text-sm">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
          
          <Button
            onClick={convertToPDF}
            disabled={converting}
            className="w-full"
          >
            {converting ? 'Converting...' : 'Convert to PDF'}
          </Button>
        </div>
      )}
    </Card>
  );
} 