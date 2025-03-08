import { Metadata } from 'next';
import { ImageToPDF } from '@/components/tools/pdf/image-to-pdf';

export const metadata: Metadata = {
  title: 'Image to PDF Converter - WebTools',
  description: 'Convert images to PDF documents',
  openGraph: {
    title: 'Image to PDF Converter',
    description: 'Convert images to PDF documents',
  },
};

export default async function ImageToPDFPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Image to PDF Converter</h1>
        <p className="text-muted-foreground mt-2">
          Convert images to PDF documents
        </p>
      </div>
      
      <ImageToPDF />
    </div>
  );
} 