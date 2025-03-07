'use client';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import dynamic from 'next/dynamic';

// Dynamically import FFmpeg with no SSR
const FFmpeg = dynamic(
  async () => {
    const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
    return { createFFmpeg, fetchFile };
  },
  { ssr: false }
);

export default function VideoConverter() {
  const [ffmpeg, setFFmpeg] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState<File | null>(null);
  const [format, setFormat] = useState('mp4');
  const [quality, setQuality] = useState('medium');
  const [progress, setProgress] = useState(0);
  const [converting, setConverting] = useState(false);

  // Initialize FFmpeg
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const { createFFmpeg } = await FFmpeg;
        const ffmpegInstance = createFFmpeg({ 
          log: true,
          corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
        });
        await ffmpegInstance.load();
        setFFmpeg(ffmpegInstance);
        setReady(true);
      } catch (error) {
        console.error('Failed to load FFmpeg:', error);
      }
    };
    loadFFmpeg();
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setVideo(acceptedFiles[0]);
    }
  });

  const getFFmpegParams = () => {
    // Based on FFmpeg documentation for different quality presets
    const qualitySettings = {
      high: {
        videoBitrate: '4000k',
        audioBitrate: '192k',
        bufSize: '8000k',
        preset: 'slow'
      },
      medium: {
        videoBitrate: '2000k',
        audioBitrate: '128k',
        bufSize: '4000k',
        preset: 'medium'
      },
      low: {
        videoBitrate: '1000k',
        audioBitrate: '96k',
        bufSize: '2000k',
        preset: 'fast'
      }
    };

    const settings = qualitySettings[quality as keyof typeof qualitySettings];

    return [
      '-i', 'input.mp4',
      // Video codec settings
      '-c:v', 'libx264',
      '-preset', settings.preset,
      // Force CBR mode as per documentation
      '-b:v', settings.videoBitrate,
      '-maxrate', settings.videoBitrate,
      '-minrate', settings.videoBitrate,
      '-bufsize', settings.bufSize,
      // GOP settings (keyframe interval)
      '-g', '30',
      // Audio settings
      '-c:a', 'aac',
      '-b:a', settings.audioBitrate,
      // Output format forcing
      '-f', format,
      // Overwrite output files
      '-y',
      'output.' + format
    ];
  };

  const convertVideo = async () => {
    if (!video || !ready || !ffmpeg) return;

    try {
      setConverting(true);
      setProgress(0);

      const { fetchFile } = await FFmpeg;

      // Write input file
      ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(video));

      // Set up progress handler
      ffmpeg.setProgress(({ ratio }) => {
        setProgress(Math.round(ratio * 100));
      });

      // Run the conversion with proper parameters
      await ffmpeg.run(...getFFmpegParams());

      // Read the result
      const data = ffmpeg.FS('readFile', `output.${format}`);
      
      // Create a download link
      const url = URL.createObjectURL(
        new Blob([data.buffer], { type: `video/${format}` })
      );
      const link = document.createElement('a');
      link.href = url;
      link.download = `converted-video.${format}`;
      link.click();

      // Cleanup
      URL.revokeObjectURL(url);
      ffmpeg.FS('unlink', 'input.mp4');
      ffmpeg.FS('unlink', `output.${format}`);

    } catch (error) {
      console.error('Conversion failed:', error);
      alert('Failed to convert video. Please try again.');
    } finally {
      setConverting(false);
      setProgress(0);
    }
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading video converter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Video Converter</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
              ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
          >
            <input {...getInputProps()} />
            <p className="text-gray-600 dark:text-gray-300">
              Drag & drop your video here, or click to select
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Supported formats: MP4, AVI, MOV, MKV, WEBM
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Output Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="mp4">MP4</option>
                    <option value="webm">WEBM</option>
                    <option value="mov">MOV</option>
                    <option value="avi">AVI</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Quality
                  </label>
                  <select
                    value={quality}
                    onChange={(e) => setQuality(e.target.value)}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value="high">High Quality</option>
                    <option value="medium">Medium Quality</option>
                    <option value="low">Low Quality</option>
                  </select>
                </div>
              </div>

              {(progress > 0 || converting) && (
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-blue-500 dark:text-blue-400">
                      Converting
                    </span>
                    <span className="text-sm font-medium text-blue-500 dark:text-blue-400">
                      {progress}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={convertVideo}
                disabled={converting || !video}
                className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600
                  disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {converting ? 'Converting...' : 'Convert Video'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}