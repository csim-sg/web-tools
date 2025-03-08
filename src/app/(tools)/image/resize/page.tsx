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

export default function ImageResizePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Image Resizer</h1>
        <p className="text-muted-foreground">
          Resize images to specific dimensions while maintaining aspect ratio
        </p>
      </div>
      <ImageResizer />
    </div>
  );
}