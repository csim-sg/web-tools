'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

interface BatchProcessorProps {
  onProcess: (files: File[]) => Promise<void>;
  accept: Record<string, string[]>;
  maxFiles?: number;
  title: string;
  description: string;
}

export default function BatchImageProcessor({
  onProcess,
  accept,
  maxFiles = 10,
  title,
  description
}: BatchProcessorProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState<Record<string, number>>({});

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles,
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const handleProcess = async () => {
    if (files.length === 0) return;
    
    setProcessing(true);
    try {
      await onProcess(files);
    } catch (error) {
      console.error('Processing failed:', error);
      alert('Failed to process some files. Please try again.');
    } finally {
      setProcessing(false);
      setProgress({});
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
      >
        <input {...getInputProps()} />
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Maximum {maxFiles} files
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative rounded-lg overflow-hidden">
                  <Image
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
                {progress[file.name] !== undefined && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                    <div
                      className="h-full bg-blue-500 transition-all duration-300"
                      style={{ width: `${progress[file.name]}%` }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleProcess}
            disabled={processing}
            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600
              disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {processing ? 'Processing...' : `Process ${files.length} Files`}
          </button>
        </div>
      )}
    </div>
  );
} 