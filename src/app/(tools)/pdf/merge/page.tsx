'use server'
import { Metadata } from 'next';
import { PDFMerger } from '@/components/tools/pdf/pdf-merger';

export const metadata: Metadata = {
  title: 'PDF Merger - WebTools',
  description: 'Combine multiple PDF files into a single document',
  openGraph: {
    title: 'PDF Merger',
    description: 'Combine multiple PDF files into a single document',
  },
};

export default async function PDFMergerPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">PDF Merger</h1>
        <p className="text-muted-foreground mt-2">
          Combine multiple PDF files into a single document
        </p>
      </div>
      
      <PDFMerger />
    </div>
  );
} 