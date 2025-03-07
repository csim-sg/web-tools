import { popularTools } from '@/lib/constants/tools';
import { CategoryLayout } from '@/components/CategoryLayout';

export default function PopularToolsPage() {
  return (
    <CategoryLayout
      title="Popular Tools"
      description="Most frequently used tools and calculators"
      tools={popularTools}
    />
  );
} 