import { Metadata } from 'next';
import { BackgroundRemover } from '@/components/tools/image/BackgroundRemover';

export const metadata: Metadata = {
  title: 'Background Remover - WebTools',
  description: 'Remove background from images automatically with AI',
  openGraph: {
    title: 'Background Remover',
    description: 'Remove background from images automatically with AI',
    type: 'website',
  },
};

export default function BackgroundRemoverPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
          Background Remover
        </h1>
        <BackgroundRemover />
      </div>
    </div>
  );
} 