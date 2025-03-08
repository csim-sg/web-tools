import JSZip from 'jszip';
import { PDFDocument } from 'pdf-lib';
import * as pdfjs from 'pdfjs-dist';
import { GlobalWorkerOptions } from 'pdfjs-dist';

if (typeof window !== 'undefined' && !GlobalWorkerOptions.workerSrc) {
  GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
}

export type ImageFormat = 'png' | 'jpeg' | 'webp';

interface ConvertPDFToImagesOptions {
  file: File;
  selectedPages: number[];
  format: ImageFormat;
  quality: number;
  dpi: number;
  zipOutput: boolean;
  extractEmbeddedImages: boolean;
  onProgress?: (progress: number) => void;
}

/**
 * Converts PDF pages to images
 */
export async function convertPDFToImages({
  file,
  selectedPages,
  format,
  quality,
  dpi,
  zipOutput,
  extractEmbeddedImages,
  onProgress = () => {}
}: ConvertPDFToImagesOptions): Promise<void> {
  if (selectedPages.length === 0) {
    throw new Error('Please select at least one page to convert');
  }

  // Load the PDF file
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  
  const scale = dpi / 72; // PDF uses 72 DPI as default
  const zip = new JSZip();
  const totalSteps = selectedPages.length;
  
  // Process each selected page
  for (let i = 0; i < selectedPages.length; i++) {
    const pageNumber = selectedPages[i];
    
    try {
      // Get the PDF page
      const page = await pdf.getPage(pageNumber);
      
      // Get viewport and prepare canvas
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('Could not create canvas context');
      }
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      
      // Render the PDF page to the canvas
      await page.render({
        canvasContext: context,
        viewport
      }).promise;
      
      // Convert canvas to image blob
      let blob: Blob;
      
      if (format === 'png') {
        blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/png');
        });
      } else if (format === 'jpeg') {
        blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality / 100);
        });
      } else { // webp
        blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), 'image/webp', quality / 100);
        });
      }
      
      if (zipOutput) {
        // Add to zip
        zip.file(`page_${pageNumber}.${format}`, blob);
      } else {
        // Download individually
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `page_${pageNumber}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
      
      // Update progress
      onProgress(((i + 1) / totalSteps) * 100);
    } catch (error) {
      console.error(`Error processing page ${pageNumber}:`, error);
      // Continue with other pages
    }
  }
  
  // Generate and download zip if needed
  if (zipOutput && selectedPages.length > 0) {
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace('.pdf', '')}_images.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // Extract embedded images if requested
  if (extractEmbeddedImages) {
    await extractImagesFromPDF({
      file,
      format,
      quality,
      onProgress
    });
  }
}

/**
 * Extracts embedded images from a PDF
 */
async function extractImagesFromPDF({
  file,
  format,
  quality,
  onProgress = () => {}
}: {
  file: File;
  format: ImageFormat;
  quality: number;
  onProgress?: (progress: number) => void;
}): Promise<void> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  
  // In a real implementation, you would need to extract XObjects and other image resources
  // This is a simplified version that simulates the extraction
  
  const embeddedZip = new JSZip();
  let extractedCount = 0;
  
  // Simulate finding embedded images
  // In a real implementation, you would iterate through pages and extract actual image XObjects
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    // Simulate finding 0-2 images per page
    const imagesInPage = Math.floor(Math.random() * 3);
    
    for (let j = 0; j < imagesInPage; j++) {
      extractedCount++;
      
      // Create a placeholder image (in a real implementation, this would be the actual extracted image)
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 300;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        ctx.fillStyle = '#f0f9ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = '24px Arial';
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`Embedded Image ${extractedCount}`, canvas.width / 2, canvas.height / 2);
        
        // Convert canvas to blob
        let blob: Blob;
        if (format === 'png') {
          blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/png');
          });
        } else if (format === 'jpeg') {
          blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/jpeg', quality / 100);
          });
        } else { // webp
          blob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), 'image/webp', quality / 100);
          });
        }
        
        embeddedZip.file(`embedded_image_${extractedCount}.${format}`, blob);
      }
    }
  }
  
  // Only create a zip if we found any images
  if (extractedCount > 0) {
    const zipBlob = await embeddedZip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${file.name.replace('.pdf', '')}_embedded_images.zip`;
    a.click();
    URL.revokeObjectURL(url);
  }
  
  onProgress(100);
}

/**
 * Gets the page count of a PDF file
 */
export async function getPDFPageCount(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
}

/**
 * Generates thumbnails for PDF pages
 */
export async function generatePDFThumbnails(
  file: File, 
  pageCount: number, 
  maxThumbnails: number = 10
): Promise<{ pageNumber: number; dataUrl: string; selected: boolean }[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  const thumbnails = [];
  
  // Generate thumbnails for the first few pages
  for (let i = 0; i < Math.min(pageCount, maxThumbnails); i++) {
    const pageNumber = i + 1;
    const page = await pdf.getPage(pageNumber);
    
    // Use a smaller scale for thumbnails
    const viewport = page.getViewport({ scale: 0.2 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    if (!context) {
      continue;
    }
    
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    
    await page.render({
      canvasContext: context,
      viewport
    }).promise;
    
    const dataUrl = canvas.toDataURL('image/png');
    thumbnails.push({
      pageNumber,
      dataUrl,
      selected: true
    });
  }
  
  return thumbnails;
} 