import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export type ImageFormat = 'png' | 'jpeg' | 'webp' | 'avif';
export type ImageEffect = 'grayscale' | 'blur' | 'sepia' | 'invert' | 'brightness' | 'contrast' | 'saturation';

export interface ProcessingResult {
  success: boolean;
  message: string;
  processedBlob?: Blob;
  originalSize?: number;
  processedSize?: number;
}

export interface ImageProcessingOptions {
  format?: ImageFormat;
  quality?: number;
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  effect?: ImageEffect;
  effectIntensity?: number;
}

export interface BatchProcessingOptions extends ImageProcessingOptions {
  onProgress?: (progress: number) => void;
}

// Base function for browser-based image processing
async function processImageInBrowser(
  file: File,
  options: ImageProcessingOptions
): Promise<ProcessingResult> {
  try {
    const img = await createImage(file);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    // Calculate dimensions
    let width = options.width || img.width;
    let height = options.height || img.height;

    if (options.maintainAspectRatio && (options.width || options.height)) {
      const ratio = img.width / img.height;
      if (options.width && !options.height) {
        height = Math.round(options.width / ratio);
      } else if (!options.width && options.height) {
        width = Math.round(options.height * ratio);
      } else if (options.width && options.height) {
        const fitRatio = Math.min(
          options.width / img.width,
          options.height / img.height
        );
        width = Math.round(img.width * fitRatio);
        height = Math.round(img.height * fitRatio);
      }
    }

    canvas.width = width;
    canvas.height = height;

    // Draw and process image
    ctx.drawImage(img, 0, 0, width, height);

    if (options.effect) {
      applyCanvasEffect(ctx, options.effect, options.effectIntensity || 1);
    }

    // Convert to blob
    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob(
        (blob) => resolve(blob as Blob),
        `image/${options.format || 'png'}`,
        options.quality ? options.quality / 100 : 0.9
      );
    });

    return {
      success: true,
      message: 'Image processed successfully',
      processedBlob: blob,
      originalSize: file.size,
      processedSize: blob.size
    };
  } catch (error) {
    console.error('Image processing failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Image processing failed'
    };
  }
}

// Process image with server-side features if needed
export async function processImage(
  file: File,
  options: ImageProcessingOptions
): Promise<ProcessingResult> {
  // For now, use browser-based processing
  // Later we can add server-side processing for more complex operations
  return processImageInBrowser(file, options);
}

// Resize images
export async function resizeImage(
  file: File,
  options: {
    width?: number;
    height?: number;
    maintainAspectRatio?: boolean;
    quality?: number;
    format?: ImageFormat;
  }
): Promise<ProcessingResult> {
  return processImage(file, options);
}

// Remove background
export async function removeBackground(
  file: File,
  options: { quality: 'fast' | 'high' }
): Promise<ProcessingResult> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('options', JSON.stringify(options));

  try {
    const response = await fetch('/api/image/remove-background', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Background removal failed');
    }

    const blob = await response.blob();
    return {
      success: true,
      message: 'Background removed successfully',
      processedBlob: blob,
      originalSize: file.size,
      processedSize: blob.size
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Background removal failed'
    };
  }
}

// Batch process images
export async function batchProcessImages(
  files: File[],
  options: BatchProcessingOptions
): Promise<ProcessingResult> {
  try {
    const zip = new JSZip();
    const total = files.length;
    let processed = 0;
    const results: Blob[] = [];

    for (const file of files) {
      const result = await processImage(file, options);
      if (result.success && result.processedBlob) {
        results.push(result.processedBlob);
        processed++;
        options.onProgress?.(Math.round((processed / total) * 100));
      }
    }

    // Create ZIP with processed images
    for (let i = 0; i < results.length; i++) {
      const originalName = files[i].name;
      const extension = options.format || originalName.split('.').pop() || 'png';
      const newName = originalName.replace(/\.[^/.]+$/, `.${extension}`);
      zip.file(newName, results[i]);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });

    return {
      success: true,
      message: 'Batch processing completed successfully',
      processedBlob: zipBlob,
      originalSize: files.reduce((acc, file) => acc + file.size, 0),
      processedSize: zipBlob.size
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Batch processing failed'
    };
  }
}

// Helper functions
function createImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function applyCanvasEffect(
  ctx: CanvasRenderingContext2D,
  effect: ImageEffect,
  intensity: number
) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const data = imageData.data;

  switch (effect) {
    case 'grayscale':
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = data[i + 1] = data[i + 2] = avg;
      }
      break;

    case 'brightness':
      const factor = 1 + intensity;
      for (let i = 0; i < data.length; i += 4) {
        data[i] *= factor;
        data[i + 1] *= factor;
        data[i + 2] *= factor;
      }
      break;

    case 'contrast':
      const contrast = (intensity * 255);
      const factor2 = (255 + contrast) / (255.01 - contrast);
      for (let i = 0; i < data.length; i += 4) {
        data[i] = factor2 * (data[i] - 128) + 128;
        data[i + 1] = factor2 * (data[i + 1] - 128) + 128;
        data[i + 2] = factor2 * (data[i + 2] - 128) + 128;
      }
      break;

    case 'sepia':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
        data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
        data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
      }
      break;

    case 'invert':
      for (let i = 0; i < data.length; i += 4) {
        data[i] = 255 - data[i];
        data[i + 1] = 255 - data[i + 1];
        data[i + 2] = 255 - data[i + 2];
      }
      break;

    case 'blur':
      // Simple box blur
      const width = ctx.canvas.width;
      const height = ctx.canvas.height;
      const radius = Math.floor(intensity * 10);
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = width;
      tempCanvas.height = height;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.putImageData(imageData, 0, 0);
      ctx.filter = `blur(${radius}px)`;
      ctx.drawImage(tempCanvas, 0, 0);
      return;

    case 'saturation':
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
        data[i] = gray + intensity * (r - gray);
        data[i + 1] = gray + intensity * (g - gray);
        data[i + 2] = gray + intensity * (b - gray);
      }
      break;
  }

  ctx.putImageData(imageData, 0, 0);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
} 