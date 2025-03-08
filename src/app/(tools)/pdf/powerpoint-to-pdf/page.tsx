import { Metadata } from 'next';
import { PowerPointToPDF } from '@/components/tools/pdf/powerpoint-to-pdf';

export const metadata: Metadata = {
  title: 'PowerPoint to PDF Converter - WebTools',
  description: 'Convert PowerPoint presentations to PDF format',
  openGraph: {
    title: 'PowerPoint to PDF Converter',
    description: 'Convert PowerPoint presentations to PDF format',
  },
};

export default async function PowerPointToPDFPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">PowerPoint to PDF Converter</h1>
        <p className="text-muted-foreground mt-2">
          Convert PowerPoint presentations to PDF format
        </p>
      </div>
      
      <PowerPointToPDF />
    </div>
  );
} 