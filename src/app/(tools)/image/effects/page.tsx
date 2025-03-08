import { ImageEffects } from '@/components/tools/image/ImageEffects';

export default function ImageEffectsPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Image Effects</h1>
        <p className="text-muted-foreground">
          Apply various filters and effects to your images
        </p>
      </div>
      <ImageEffects />
    </div>
  );
} 