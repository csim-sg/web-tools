import { Metadata } from 'next';
import { PDFSplitter } from '@/components/tools/pdf/pdf-splitter';

export const metadata: Metadata = {
  title: 'Split PDF - WebTools',
  description: 'Split PDF files into multiple documents or extract specific pages',
  openGraph: {
    title: 'Split PDF',
    description: 'Split PDF files into multiple documents or extract specific pages',
  },
};

export default async function PDFSplitterPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Split PDF</h1>
        <p className="text-muted-foreground mt-2">
          Split PDF files into multiple documents or extract specific pages
        </p>
      </div>
      
      <PDFSplitter />
    </div>
  );
} 