'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import UploadProgress from '@/components/UploadProgress';

// Initialize ffmpeg outside component to prevent recreation
let ffmpeg: any = null;

export function VideoCompressor() {
  const [video, setVideo] = useState<File | null>(null);
  const [quality, setQuality] = useState('medium');
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [ffmpegLoaded, setFfmpegLoaded] = useState(false);

  // Initialize FFmpeg
  useEffect(() => {
    if (!ffmpeg) {
      ffmpeg = createFFmpeg({ 
        log: true,
        corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
      });
    }
    
    async function loadFFmpeg() {
      try {
        await ffmpeg.load();
        setFfmpegLoaded(true);
      } catch (error) {
        console.error('Failed to load FFmpeg:', error);
      }
    }

    if (!ffmpeg.isLoaded()) {
      loadFFmpeg();
    } else {
      setFfmpegLoaded(true);
    }

    return () => {
      // Cleanup any ongoing operations
      if (ffmpeg && ffmpeg.isLoaded()) {
        try {
          ffmpeg.exit();
        } catch (e) {
          console.error('FFmpeg cleanup failed:', e);
        }
      }
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      setVideo(file);
      setProgress(100); // Upload complete
    }
  });

  const compressVideo = async () => {
    if (!video || !ffmpegLoaded) return;

    try {
      setProcessing(true);
      setProgress(0);

      const inputName = 'input.mp4';
      const outputName = 'output.mp4';

      // Simulate progress during processing
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 1, 95));
      }, 100);

      ffmpeg.FS('writeFile', inputName, await fetchFile(video));

      const qualitySettings = {
        low: '-crf 28',
        medium: '-crf 23',
        high: '-crf 18'
      };

      await ffmpeg.run(
        '-i', inputName,
        '-c:v', 'libx264',
        ...qualitySettings[quality as keyof typeof qualitySettings].split(' '),
        '-c:a', 'aac',
        outputName
      );

      clearInterval(progressInterval);
      setProgress(100);

      const data = ffmpeg.FS('readFile', outputName);
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: 'video/mp4' })
      );

      // Clean up files from memory
      ffmpeg.FS('unlink', inputName);
      ffmpeg.FS('unlink', outputName);

      const a = document.createElement('a');
      a.href = url;
      a.download = `compressed-${video.name || 'video.mp4'}`;
      a.click();

      // Clean up blob URL
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Video compression failed:', error);
      alert('Failed to compress video. Please try again.');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
            : 'border-gray-300 dark:border-gray-600'}`}
      >
        <input {...getInputProps()} />
        <div className="space-y-2">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h18M3 16h18" />
          </svg>
          <p className="text-gray-600 dark:text-gray-300">
            Drag & drop your video here, or click to select
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Supported formats: MP4, AVI, MOV, MKV
          </p>
        </div>
      </div>

      {video && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              {video.name}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {(video.size / (1024 * 1024)).toFixed(2)} MB
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                Compression Quality
              </label>
              <select
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="w-full p-2 border rounded-md border-gray-300 dark:border-gray-600 
                         dark:bg-gray-700 dark:text-white"
              >
                <option value="low">Low (Smaller file size)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="high">High (Better quality)</option>
              </select>
            </div>

            {(progress > 0 || processing) && (
              <UploadProgress progress={progress} />
            )}

            <button
              onClick={compressVideo}
              disabled={processing || !ffmpegLoaded}
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600
                       disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {!ffmpegLoaded ? 'Loading FFmpeg...' : processing ? 'Compressing...' : 'Compress Video'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 