import { Metadata } from 'next';
import { VideoConverter } from '@/components/tools/video/VideoConverter';

export const metadata: Metadata = {
  title: 'Video Converter - WebTools',
  description: 'Convert videos between different formats with high quality',
  openGraph: {
    title: 'Video Converter',
    description: 'Convert videos between different formats with high quality',
    type: 'website',
  },
};

export default function VideoConverterPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Video Converter
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Convert your videos to different formats while maintaining quality
        </p>
        <VideoConverter />
      </div>
    </div>
  );
}