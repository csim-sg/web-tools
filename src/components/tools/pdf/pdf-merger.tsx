'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2 } from 'lucide-react';

export function PDFMerger() {
  const [files, setFiles] = useState<File[]>([]);
  const [merging, setMerging] = useState(false);
  const [progress, setProgress] = useState(0);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const mergePDFs = async () => {
    if (files.length < 2) return;
    
    setMerging(true);
    setProgress(0);
    
    try {
      const mergedPdf = await PDFDocument.create();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => mergedPdf.addPage(page));
        
        setProgress(((i + 1) / files.length) * 100);
      }
      
      const mergedPdfFile = await mergedPdf.save();
      const blob = new Blob([mergedPdfFile], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      a.click();
    } catch (error) {
      console.error('Failed to merge PDFs:', error);
      alert('Failed to merge PDFs. Please try again.');
    } finally {
      setMerging(false);
      setProgress(0);
    }
  };

  return (
    <Card className="p-6">
      <div 
        {...getRootProps()} 
        className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p>Drag & drop PDF files here, or click to select files</p>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Selected Files:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center p-2 bg-muted rounded">
                <span className="truncate max-w-[80%]">{file.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
          
          {merging && (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Merging...</span>
                <span className="text-sm">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
          
          <Button
            onClick={mergePDFs}
            disabled={merging || files.length < 2}
            className="w-full"
          >
            {merging ? 'Merging...' : 'Merge PDFs'}
          </Button>
        </div>
      )}
    </Card>
  );
} 