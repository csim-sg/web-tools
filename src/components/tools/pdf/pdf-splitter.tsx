'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function PDFSplitter() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitting, setSplitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitMethod, setSplitMethod] = useState<'range' | 'all'>('range');
  const [pageRange, setPageRange] = useState('');
  const [previewPages, setPreviewPages] = useState<number[]>([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFile(file);
        
        // Get page count from the PDF
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await PDFDocument.load(arrayBuffer);
          const count = pdf.getPageCount();
          setPageCount(count);
          
          // Set preview pages (first 5 pages or all if less than 5)
          setPreviewPages(Array.from({ length: Math.min(count, 5) }, (_, i) => i + 1));
        } catch (error) {
          console.error('Error loading PDF:', error);
          alert('Failed to load PDF. Please try again with a valid PDF file.');
          setFile(null);
        }
      }
    }
  });

  const splitPDF = async () => {
    if (!file) return;
    
    setSplitting(true);
    setProgress(0);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourcePdf = await PDFDocument.load(arrayBuffer);
      
      let pagesToExtract: number[] = [];
      
      if (splitMethod === 'all') {
        // Extract each page as a separate PDF
        pagesToExtract = Array.from({ length: pageCount }, (_, i) => i);
      } else {
        // Extract specific page range
        const ranges = pageRange.split(',').map(range => range.trim());
        
        for (const range of ranges) {
          if (range.includes('-')) {
            const [start, end] = range.split('-').map(num => parseInt(num.trim()) - 1);
            for (let i = start; i <= end; i++) {
              if (i >= 0 && i < pageCount) {
                pagesToExtract.push(i);
              }
            }
          } else {
            const pageNum = parseInt(range) - 1;
            if (pageNum >= 0 && pageNum < pageCount) {
              pagesToExtract.push(pageNum);
            }
          }
        }
      }
      
      if (pagesToExtract.length === 0) {
        alert('Please specify valid page numbers to extract.');
        setSplitting(false);
        return;
      }
      
      if (splitMethod === 'all') {
        // Create individual PDFs for each page
        for (let i = 0; i < pagesToExtract.length; i++) {
          const newPdf = await PDFDocument.create();
          const [page] = await newPdf.copyPages(sourcePdf, [pagesToExtract[i]]);
          newPdf.addPage(page);
          
          const pdfBytes = await newPdf.save();
          const blob = new Blob([pdfBytes], { type: 'application/pdf' });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = `${file.name.replace('.pdf', '')}_page_${pagesToExtract[i] + 1}.pdf`;
          a.click();
          
          setProgress(((i + 1) / pagesToExtract.length) * 100);
        }
      } else {
        // Create a single PDF with selected pages
        const newPdf = await PDFDocument.create();
        const pages = await newPdf.copyPages(sourcePdf, pagesToExtract);
        
        pages.forEach(page => newPdf.addPage(page));
        
        const pdfBytes = await newPdf.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${file.name.replace('.pdf', '')}_extracted.pdf`;
        a.click();
        
        setProgress(100);
      }
    } catch (error) {
      console.error('Failed to split PDF:', error);
      alert('Failed to split PDF. Please try again.');
    } finally {
      setSplitting(false);
      setProgress(0);
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
            <div>
              <h3 className="font-medium">{file.name}</h3>
              <p className="text-sm text-muted-foreground">{pageCount} pages</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => {
                setFile(null);
                setPageCount(0);
                setPageRange('');
              }}
            >
              Change File
            </Button>
          </div>
          
          <div className="space-y-4 pt-4 border-t">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="split-all" 
                  checked={splitMethod === 'all'} 
                  onChange={() => setSplitMethod('all')}
                />
                <Label htmlFor="split-all">Split into individual pages</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input 
                  type="radio" 
                  id="split-range" 
                  checked={splitMethod === 'range'} 
                  onChange={() => setSplitMethod('range')}
                />
                <Label htmlFor="split-range">Extract specific pages</Label>
              </div>
            </div>
            
            {splitMethod === 'range' && (
              <div className="space-y-2">
                <Label htmlFor="page-range">Page Range</Label>
                <Input
                  id="page-range"
                  placeholder="e.g., 1-3, 5, 7-9"
                  value={pageRange}
                  onChange={(e) => setPageRange(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Enter page numbers and/or ranges separated by commas (e.g., 1-3, 5, 7-9)
                </p>
              </div>
            )}
            
            {splitting && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Splitting...</span>
                  <span className="text-sm">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
            
            <Button
              onClick={splitPDF}
              disabled={splitting || (splitMethod === 'range' && !pageRange)}
              className="w-full"
            >
              {splitting ? 'Processing...' : 'Split PDF'}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
} 