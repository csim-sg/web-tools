'use client';

import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';

// Import FFmpeg dynamically to avoid SSR issues
let ffmpegInstance: any = null;
let fetchFileInstance: any = null;

export function VideoConverter() {
  const [video, setVideo] = useState<File | null>(null);
  const [format, setFormat] = useState<string>('mp4');
  const [quality, setQuality] = useState<string>('high');
  const [progress, setProgress] = useState<number>(0);
  const [converting, setConverting] = useState<boolean>(false);
  const [ready, setReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);

  // Initialize FFmpeg
  useEffect(() => {
    const loadFFmpeg = async () => {
      try {
        const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
        ffmpegInstance = createFFmpeg({ 
          log: true,
          progress: ({ ratio }: { ratio: number }) => {
            setProgress(Math.round(ratio * 100));
          }
        });
        fetchFileInstance = fetchFile;
        await ffmpegInstance.load();
        setReady(true);
      } catch (err) {
        console.error('Error loading FFmpeg:', err);
        setError('Failed to load video converter. Please try again later.');
      }
    };

    loadFFmpeg();

    // Cleanup
    return () => {
      if (ffmpegInstance && ffmpegInstance.isLoaded()) {
        ffmpegInstance.exit();
      }
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
      }
    };
  }, []);

  // Handle file drop
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setVideo(acceptedFiles[0]);
        // Clear previous conversion
        if (outputUrl) {
          URL.revokeObjectURL(outputUrl);
          setOutputUrl(null);
        }
        setProgress(0);
      }
    }
  });

  // Get FFmpeg parameters based on quality
  const getQualityParams = (quality: string): string => {
    switch (quality) {
      case 'high':
        return '-c:v libx264 -crf 18 -preset slow -c:a aac -b:a 192k';
      case 'medium':
        return '-c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k';
      case 'low':
        return '-c:v libx264 -crf 28 -preset fast -c:a aac -b:a 96k';
      default:
        return '-c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k';
    }
  };

  // Convert video
  const convertVideo = async () => {
    if (!video || !ffmpegInstance || !fetchFileInstance) return;
    
    try {
      setConverting(true);
      setProgress(0);
      setError(null);
      
      // Clear previous output URL
      if (outputUrl) {
        URL.revokeObjectURL(outputUrl);
        setOutputUrl(null);
      }

      const inputName = 'input.mp4';
      const outputName = `output.${format}`;
      
      // Write the file to memory
      ffmpegInstance.FS('writeFile', inputName, await fetchFileInstance(video));
      
      // Get quality parameters
      const qualityParams = getQualityParams(quality);
      
      // Run the FFmpeg command
      await ffmpegInstance.run(
        '-i', inputName, 
        ...qualityParams.split(' '), 
        outputName
      );
      
      // Read the result
      const data = ffmpegInstance.FS('readFile', outputName);
      
      // Create a URL
      const blob = new Blob([data.buffer], { type: `video/${format}` });
      const url = URL.createObjectURL(blob);
      
      setOutputUrl(url);
      setConverting(false);
      
      // Clean up
      ffmpegInstance.FS('unlink', inputName);
      ffmpegInstance.FS('unlink', outputName);
    } catch (err) {
      console.error('Error during conversion:', err);
      setError('An error occurred during conversion. Please try again.');
      setConverting(false);
    }
  };

  // Download the converted video
  const downloadVideo = () => {
    if (!outputUrl) return;
    
    const a = document.createElement('a');
    a.href = outputUrl;
    a.download = `converted-video.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {!ready ? (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-300">Loading video converter...</p>
          </div>
        </div>
      ) : (
        <>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
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

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md dark:bg-red-900/30 dark:text-red-400">
              {error}
            </div>
          )}

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Output Format</Label>
                  <Select value={format} onValueChange={setFormat}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mp4">MP4</SelectItem>
                      <SelectItem value="webm">WEBM</SelectItem>
                      <SelectItem value="mov">MOV</SelectItem>
                      <SelectItem value="avi">AVI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Quality</Label>
                  <Select value={quality} onValueChange={setQuality}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select quality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High Quality</SelectItem>
                      <SelectItem value="medium">Medium Quality</SelectItem>
                      <SelectItem value="low">Low Quality</SelectItem>
                    </SelectContent>
                  </Select>
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
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {outputUrl && (
                <div className="mt-4">
                  <Button 
                    onClick={downloadVideo}
                    className="w-full"
                    variant="outline"
                  >
                    Download Converted Video
                  </Button>
                </div>
              )}

              <Button
                onClick={convertVideo}
                disabled={converting || !video}
                className="w-full"
              >
                {converting ? 'Converting...' : 'Convert Video'}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}