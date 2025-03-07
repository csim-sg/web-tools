import { Metadata } from 'next';
import { ImageResizer } from '@/components/tools/image/ImageResizer';

export const metadata: Metadata = {
  title: 'Image Resizer - WebTools',
  description: 'Resize images to specific dimensions while maintaining aspect ratio',
  openGraph: {
    title: 'Image Resizer',
    description: 'Resize images to specific dimensions while maintaining aspect ratio',
    type: 'website',
  },
};

export default function ImageResizerPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Image Resizer
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Resize your images to exact dimensions while maintaining quality
        </p>
        <ImageResizer />
      </div>
    </div>
  );
}