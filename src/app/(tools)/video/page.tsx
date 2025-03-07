import { CategoryLayout } from '@/components/CategoryLayout';
import { videoTools } from '@/lib/constants/tools';

export default function VideoPage() {
  return (
    <CategoryLayout
      title="Video Tools"
      description="Professional tools to convert, compress, and edit your videos."
      tools={videoTools}
    />
  );
} 