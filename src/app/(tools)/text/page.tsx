import { CategoryLayout } from '@/components/CategoryLayout';
import { textTools } from '@/lib/constants/tools';

export default function TextPage() {
  return (
    <CategoryLayout
      title="Text Tools"
      description="Powerful text processing and conversion tools for all your needs."
      tools={textTools}
    />
  );
} 