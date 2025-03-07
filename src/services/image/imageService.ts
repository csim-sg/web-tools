import { ImageFormat } from "@/lib/types/image";

export interface ImageConvertOptions {
  format: ImageFormat;
  quality: number;
}

export interface BatchResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  resizeMode: 'fit' | 'fill' | 'contain';
}

export const imageService = {
  async convertImage(file: File, options: ImageConvertOptions): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('format', options.format);
    formData.append('quality', options.quality.toString());

    const response = await fetch('/api/image/convert', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to convert image');
    }

    return response.blob();
  },

  async removeBackground(file: File): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/image/remove-bg', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to remove background');
    }

    return response.blob();
  },

  async applyEffects(file: File, effects: string[]): Promise<Blob> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('effects', JSON.stringify(effects));

    const response = await fetch('/api/image/effects', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to apply effects');
    }

    return response.blob();
  },

  async batchResize(files: File[], options: BatchResizeOptions): Promise<Blob> {
    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('width', options.width.toString());
    formData.append('height', options.height.toString());
    formData.append('maintainAspectRatio', options.maintainAspectRatio.toString());
    formData.append('resizeMode', options.resizeMode);

    const response = await fetch('/api/image/batch-resize', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to resize images');
    }

    return response.blob();
  }
}; 