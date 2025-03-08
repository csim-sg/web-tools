import { Metadata } from 'next';
import { PDFToImage } from '@/components/tools/pdf/pdf-to-image';

export const metadata: Metadata = {
  title: 'PDF to Image Converter - WebTools',
  description: 'Extract images from PDF or convert pages to images',
  openGraph: {
    title: 'PDF to Image Converter',
    description: 'Extract images from PDF or convert pages to images',
  },
};

export default async function PDFToImagePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">PDF to Image Converter</h1>
        <p className="text-muted-foreground mt-2">
          Extract images from PDF or convert pages to images
        </p>
      </div>
      
      <PDFToImage />
    </div>
  );
} 