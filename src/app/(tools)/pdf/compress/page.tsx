import { Metadata } from 'next';
import { PDFCompressor } from '@/components/tools/pdf/pdf-compressor';

export const metadata: Metadata = {
  title: 'Compress PDF - WebTools',
  description: 'Reduce PDF file size while maintaining quality',
  openGraph: {
    title: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
  },
};

export default async function PDFCompressorPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Compress PDF</h1>
        <p className="text-muted-foreground mt-2">
          Reduce PDF file size while maintaining quality
        </p>
      </div>
      
      <PDFCompressor />
    </div>
  );
} 