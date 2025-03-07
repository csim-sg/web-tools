'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';

export default function PDFToWord() {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          PDF to Word Converter
        </h1>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600'}`}
          >
            <input {...getInputProps()} />
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                Drag & drop your PDF file here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Maximum file size: 50MB
              </p>
            </div>
          </div>

          {converting && (
            <div className="mt-8">
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
                      Converting
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-blue-600 dark:text-blue-200">
                      {progress}%
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200 dark:bg-blue-900">
                  <div 
                    style={{ width: `${progress}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              How to convert PDF to Word
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Upload your PDF file by dragging it into the box above</li>
              <li>Wait for the conversion to complete</li>
              <li>Download your converted Word document</li>
            </ol>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Features
            </h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li>Maintains original formatting</li>
              <li>Converts text, images, and tables</li>
              <li>Fast and secure conversion</li>
              <li>Free to use</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 