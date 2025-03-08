'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export function PDFToWord() {
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setConverting(true);
        setProgress(0);
        
        // Simulate conversion progress
        const interval = setInterval(() => {
          setProgress(prev => {
            if (prev >= 95) {
              clearInterval(interval);
              return prev;
            }
            return prev + 5;
          });
        }, 200);

        try {
          const formData = new FormData();
          formData.append('file', acceptedFiles[0]);

          // Replace with your actual API endpoint
          const response = await fetch('/api/convert/pdf-to-word', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) throw new Error('Conversion failed');

          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = acceptedFiles[0].name.replace('.pdf', '.docx');
          a.click();
        } catch (error) {
          console.error('Conversion failed:', error);
          alert('Failed to convert file. Please try again.');
        } finally {
          setConverting(false);
          setProgress(0);
        }
      }
    }
  });

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
          <div className="space-y-4">
            <div className="flex justify-center">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-foreground">
              Drag & drop your PDF file here, or click to select
            </p>
            <p className="text-sm text-muted-foreground">
              Maximum file size: 50MB
            </p>
          </div>
        </div>

        {converting && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Converting</span>
              <span className="text-sm">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            How to convert PDF to Word
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li>Upload your PDF file by dragging it into the box above</li>
            <li>Wait for the conversion to complete</li>
            <li>Download your converted Word document</li>
          </ol>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Features
          </h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>Maintains original formatting</li>
            <li>Converts text, images, and tables</li>
            <li>Fast and secure conversion</li>
            <li>Free to use</li>
          </ul>
        </Card>
      </div>
    </div>
  );
} 