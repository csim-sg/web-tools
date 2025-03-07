import { CategoryLayout } from '@/components/CategoryLayout';
import { pdfTools } from '@/lib/constants/tools';

export default function PDFPage() {
  return (
    <CategoryLayout
      title="PDF Tools"
      description="Convert, merge, and manipulate PDF files with ease."
      tools={pdfTools}
    />
  );
} 