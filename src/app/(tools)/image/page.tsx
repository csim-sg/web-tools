import { CategoryLayout } from '@/components/CategoryLayout';

const imageTools = [
  {
    name: 'Image Converter',
    description: 'Convert images between different formats like PNG, JPG, WEBP, and more',
    icon: '/icons/image-convert.svg',
    href: '/image/converter',
    tags: ['convert', 'format', 'png', 'jpg', 'webp']
  },
  {
    name: 'Image Compressor',
    description: 'Compress images while maintaining quality to reduce file size',
    icon: '/icons/image-compress.svg',
    href: '/image/compress',
    tags: ['compress', 'optimize', 'size']
  },
  {
    name: 'Background Remover',
    description: 'Remove backgrounds from images automatically with AI',
    icon: '/icons/bg-remove.svg',
    href: '/image/remove-bg',
    tags: ['background', 'remove', 'transparent']
  },
  {
    name: 'Image Resizer',
    description: 'Resize images to specific dimensions while maintaining aspect ratio',
    icon: '/icons/image-resize.svg',
    href: '/image/resize',
    tags: ['resize', 'dimensions', 'scale']
  },
  {
    name: 'Effects',
    description: 'Apply various filters and effects to your images',
    icon: '/icons/image-effects.svg',
    href: '/image/effects',
    tags: ['filters', 'effects', 'edit']
  },
  {
    name: 'Watermark',
    description: 'Add text or image watermarks to your images',
    icon: '/icons/watermark.svg',
    href: '/image/watermark',
    tags: ['watermark', 'copyright', 'protect']
  },
  {
    name: 'Batch Resize',
    description: 'Process multiple images at once with various operations',
    icon: '/icons/image-batch.svg',
    href: '/image/batch-resize',
    tags: ['batch', 'bulk', 'multiple']
  }
];

export default function ImagePage() {
  return (
    <CategoryLayout
      title="Image Tools"
      description="A collection of powerful tools to edit, convert, and enhance your images."
      tools={imageTools}
    />
  );
} 