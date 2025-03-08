import { Metadata } from 'next';
import { CategoryLayout } from '@/components/CategoryLayout';
import { pdfTools } from '@/lib/constants/tools';

export const metadata: Metadata = {
  title: 'PDF Tools - WebTools',
  description: 'Convert, merge, and manipulate PDF files with ease',
  openGraph: {
    title: 'PDF Tools',
    description: 'Convert, merge, and manipulate PDF files with ease',
  },
};

export default async function PDFPage() {
  return (
    <CategoryLayout
      title="PDF Tools"
      description="Convert, merge, and manipulate PDF files with ease."
      tools={pdfTools}
    />
  );
} 