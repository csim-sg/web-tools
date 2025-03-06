'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { PDFDocument } from 'pdf-lib';

export default function PDFMerger() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">PDF Merger</h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div {...getRootProps()} className="border-2 border-dashed rounded-lg p-8 text-center">
            <input {...getInputProps()} />
            <p>Drag & drop PDF files here, or click to select files</p>
          </div>
          
          {files.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Selected Files:</h3>
              <ul className="space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{file.name}</span>
                    <button
                      onClick={() => setFiles(files.filter((_, i) => i !== index))}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              
              <button
                onClick={mergePDFs}
                disabled={merging || files.length < 2}
                className="mt-4 w-full py-2 bg-blue-500 text-white rounded"
              >
                {merging ? `Merging... ${Math.round(progress)}%` : 'Merge PDFs'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 