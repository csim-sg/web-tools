import { Metadata } from 'next';
import { PDFToWord } from '@/components/tools/pdf/pdf-to-word';

export const metadata: Metadata = {
  title: 'PDF to Word Converter - WebTools',
  description: 'Convert PDF documents to editable Word files',
  openGraph: {
    title: 'PDF to Word Converter',
    description: 'Convert PDF documents to editable Word files',
  },
};

export default async function PDFToWordPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">PDF to Word Converter</h1>
        <p className="text-muted-foreground mt-2">
          Convert PDF documents to editable Word files
        </p>
      </div>
      
      <PDFToWord />
    </div>
  );
} 