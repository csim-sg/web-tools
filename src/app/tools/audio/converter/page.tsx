'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import UploadProgress from '@/components/UploadProgress';

export default function AudioConverter() {
  const [audio, setAudio] = useState<File | null>(null);
  const [format, setFormat] = useState('mp3');
  const [progress, setProgress] = useState(0);
  const [converting, setConverting] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'audio/*': ['.mp3', '.wav', '.ogg', '.m4a']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setAudio(file);
      setProgress(100);
    }
  });

  const convertAudio = async () => {
    if (!audio) return;

    try {
      setConverting(true);
      setProgress(0);

      // Simulate conversion progress
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 5, 95));
      }, 100);

      const formData = new FormData();
      formData.append('audio', audio);
      formData.append('format', format);

      const response = await fetch('/api/convert/audio', {
        method: 'POST',
        body: formData
      });

      clearInterval(interval);

      if (!response.ok) throw new Error('Conversion failed');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `converted-audio.${format}`;
      a.click();

      setProgress(100);
    } catch (error) {
      console.error('Audio conversion failed:', error);
      alert('Failed to convert audio. Please try again.');
    } finally {
      setConverting(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Audio Converter</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600 dark:text-gray-300">
              Drag & drop your audio file here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: MP3, WAV, OGG, M4A
            </p>
          </div>

          {audio && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {audio.name}
                </span>
                <span className="text-sm text-gray-500">
                  {(audio.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Output Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-2 border rounded"
                  >
                    <option value="mp3">MP3</option>
                    <option value="wav">WAV</option>
                    <option value="ogg">OGG</option>
                    <option value="m4a">M4A</option>
                  </select>
                </div>

                {(progress > 0 || converting) && (
                  <UploadProgress progress={progress} />
                )}

                <button
                  onClick={convertAudio}
                  disabled={converting}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600
                    disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {converting ? 'Converting...' : 'Convert Audio'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 