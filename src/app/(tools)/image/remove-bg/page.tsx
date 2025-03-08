import { Metadata } from 'next';
import { RemoveBackground } from '@/components/tools/image/RemoveBackground';

export const metadata: Metadata = {
  title: 'Background Remover - WebTools',
  description: 'Remove background from images automatically with AI',
  openGraph: {
    title: 'Background Remover',
    description: 'Remove background from images automatically with AI',
    type: 'website',
  },
};

export default function RemoveBackgroundPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Background Remover</h1>
        <p className="text-muted-foreground">
          Remove backgrounds from images automatically with AI
        </p>
      </div>
      <RemoveBackground />
    </div>
  );
} 