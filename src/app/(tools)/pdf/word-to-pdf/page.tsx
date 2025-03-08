import { Metadata } from 'next';
import { WordToPDF } from '@/components/tools/pdf/word-to-pdf';

export const metadata: Metadata = {
  title: 'Word to PDF Converter - WebTools',
  description: 'Convert Word documents to PDF format',
  openGraph: {
    title: 'Word to PDF Converter',
    description: 'Convert Word documents to PDF format',
  },
};

export default async function WordToPDFPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Word to PDF Converter</h1>
        <p className="text-muted-foreground mt-2">
          Convert Word documents to PDF format
        </p>
      </div>
      
      <WordToPDF />
    </div>
  );
} 