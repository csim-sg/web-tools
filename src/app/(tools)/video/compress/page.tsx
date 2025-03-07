'use client';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';
import UploadProgress from '@/components/UploadProgress';

const ffmpeg = createFFmpeg({ log: true });

export default function VideoCompressor() {
  const [video, setVideo] = useState<File | null>(null);
  const [quality, setQuality] = useState('medium');
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);

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
    if (!video) return;

    try {
      setProcessing(true);
      setProgress(0);

      if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
      }

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

      const a = document.createElement('a');
      a.href = url;
      a.download = 'compressed-video.mp4';
      a.click();

    } catch (error) {
      console.error('Video compression failed:', error);
      alert('Failed to compress video. Please try again.');
    } finally {
      setProcessing(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Video Compressor</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600 dark:text-gray-300">
              Drag & drop your video here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: MP4, AVI, MOV, MKV
            </p>
          </div>

          {video && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {video.name}
                </span>
                <span className="text-sm text-gray-500">
                  {(video.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Compression Quality
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full p-2 border rounded"
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
                  disabled={processing}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600
                    disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {processing ? 'Compressing...' : 'Compress Video'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 