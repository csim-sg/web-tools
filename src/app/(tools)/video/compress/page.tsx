import { Metadata } from 'next';
import { VideoCompressor } from '@/components/tools/video/VideoCompressor';

export const metadata: Metadata = {
  title: 'Video Compressor - WebTools',
  description: 'Compress videos while maintaining quality to reduce file size',
  openGraph: {
    title: 'Video Compressor',
    description: 'Compress videos while maintaining quality to reduce file size',
    type: 'website',
  },
};

export default function VideoCompressorPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Video Compressor
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Compress your videos with different quality settings while maintaining format
        </p>
        <VideoCompressor />
      </div>
    </div>
  );
} 