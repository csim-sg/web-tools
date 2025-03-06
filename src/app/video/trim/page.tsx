'use client';
import { useState, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

export default function VideoTrimmer() {
  const [video, setVideo] = useState<string | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.webm', '.ogg']
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      setVideo(URL.createObjectURL(file));
    }
  });

  const handleTrim = async () => {
    // Implement video trimming logic
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      {/* Implementation similar to previous tools */}
    </div>
  );
} 