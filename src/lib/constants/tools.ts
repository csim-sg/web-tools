export interface Tool {
  name: string;
  description: string;
  icon: string;
  href: string;
  tags?: string[];
}

export interface ToolCategory {
  name: string;
  description: string;
  icon: string;
  href: string;
  tools: Tool[];
}

export const imageTools: Tool[] = [
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

export const videoTools: Tool[] = [
  {
    name: 'Video Converter',
    description: 'Convert videos between different formats with high quality',
    icon: '/icons/video-convert.svg',
    href: '/video/converter',
    tags: ['convert', 'format', 'mp4', 'mov', 'avi']
  },
  {
    name: 'Video Compressor',
    description: 'Compress videos while maintaining quality to reduce file size',
    icon: '/icons/video-compress.svg',
    href: '/video/compress',
    tags: ['compress', 'optimize', 'size', 'reduce']
  },
  {
    name: 'Video Trimmer',
    description: 'Cut and trim video clips with precision',
    icon: '/icons/trim.svg',
    href: '/video/trim',
    tags: ['trim', 'cut', 'edit', 'clip']
  },
  {
    name: 'GIF Creator',
    description: 'Create animated GIFs from videos or images',
    icon: '/icons/gif.svg',
    href: '/video/gif',
    tags: ['gif', 'animate', 'convert']
  }
];

export const pdfTools: Tool[] = [
  {
    name: 'PDF to Word',
    description: 'Convert PDF files to editable Word documents',
    icon: '/icons/pdf-word.svg',
    href: '/pdf/to-word',
    tags: ['convert', 'word', 'doc', 'docx']
  },
  {
    name: 'PDF to Excel',
    description: 'Extract tables from PDF to Excel spreadsheets',
    icon: '/icons/pdf-excel.svg',
    href: '/pdf/to-excel',
    tags: ['convert', 'excel', 'xlsx', 'table']
  },
  {
    name: 'PDF to PowerPoint',
    description: 'Convert PDF files to PowerPoint presentations',
    icon: '/icons/pdf-ppt.svg',
    href: '/pdf/to-powerpoint',
    tags: ['convert', 'powerpoint', 'pptx']
  },
  {
    name: 'Word to PDF',
    description: 'Convert Word documents to PDF format',
    icon: '/icons/word-pdf.svg',
    href: '/pdf/word-to-pdf',
    tags: ['convert', 'word', 'doc', 'docx', 'pdf']
  },
  {
    name: 'PowerPoint to PDF',
    description: 'Convert PowerPoint presentations to PDF format',
    icon: '/icons/ppt-pdf.svg',
    href: '/pdf/powerpoint-to-pdf',
    tags: ['convert', 'powerpoint', 'pptx', 'pdf']
  },
  {
    name: 'Image to PDF',
    description: 'Convert images to PDF documents',
    icon: '/icons/image-pdf.svg',
    href: '/pdf/image-to-pdf',
    tags: ['convert', 'image', 'jpg', 'png', 'pdf']
  },
  {
    name: 'PDF to Image',
    description: 'Extract images from PDF or convert pages to images',
    icon: '/icons/pdf-image.svg',
    href: '/pdf/to-image',
    tags: ['convert', 'extract', 'image', 'jpg', 'png']
  },
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one document',
    icon: '/icons/merge.svg',
    href: '/pdf/merge',
    tags: ['merge', 'combine', 'join']
  },
  {
    name: 'Split PDF',
    description: 'Split PDF files into multiple documents',
    icon: '/icons/split.svg',
    href: '/pdf/split',
    tags: ['split', 'separate', 'divide']
  },
  {
    name: 'Compress PDF',
    description: 'Reduce PDF file size while maintaining quality',
    icon: '/icons/compress.svg',
    href: '/pdf/compress',
    tags: ['compress', 'reduce', 'optimize']
  }
];

export const barcodeTools: Tool[] = [
  {
    name: 'QR Code Generator',
    description: 'Generate QR codes for URLs, text, and more',
    icon: '/icons/qr-code.svg',
    href: '/barcode/qr-code',
    tags: ['qr', 'generate', 'url']
  },
  {
    name: 'Code 128',
    description: 'Generate Code 128 barcodes for general-purpose use',
    icon: '/icons/barcode.svg',
    href: '/barcode/code128',
    tags: ['code128', 'generate', 'barcode']
  },
  {
    name: 'EAN-13',
    description: 'Create EAN-13 barcodes for retail products',
    icon: '/icons/barcode.svg',
    href: '/barcode/ean13',
    tags: ['ean13', 'retail', 'product']
  },
  {
    name: 'UPC-A',
    description: 'Generate UPC-A barcodes for North American retail',
    icon: '/icons/barcode.svg',
    href: '/barcode/upca',
    tags: ['upca', 'retail', 'usa']
  },
  {
    name: 'Code 39',
    description: 'Create Code 39 barcodes for industrial use',
    icon: '/icons/barcode.svg',
    href: '/barcode/code39',
    tags: ['code39', 'industrial', 'barcode']
  },
  {
    name: 'DataMatrix',
    description: '2D barcodes for industrial and commercial use',
    icon: '/icons/datamatrix.svg',
    href: '/barcode/datamatrix',
    tags: ['datamatrix', '2d', 'industrial']
  },
  {
    name: 'PDF417',
    description: 'Generate PDF417 barcodes for documents and ID cards',
    icon: '/icons/pdf417.svg',
    href: '/barcode/pdf417',
    tags: ['pdf417', 'document', 'id']
  },
  {
    name: 'Barcode Scanner',
    description: 'Scan and decode various types of barcodes',
    icon: '/icons/scanner.svg',
    href: '/barcode/scanner',
    tags: ['scan', 'decode', 'read']
  }
];

export const textTools: Tool[] = [
  {
    name: 'Text Translator',
    description: 'Translate text between multiple languages instantly',
    icon: '/icons/translate.svg',
    href: '/text/translate',
    tags: ['translate', 'language', 'multilingual']
  },
  {
    name: 'OCR',
    description: 'Extract text from images and scanned documents',
    icon: '/icons/ocr.svg',
    href: '/text/ocr',
    tags: ['ocr', 'extract', 'scan', 'image']
  },
  {
    name: 'Text to Speech',
    description: 'Convert text to natural-sounding speech',
    icon: '/icons/tts.svg',
    href: '/text/tts',
    tags: ['tts', 'speech', 'audio', 'voice']
  },
  {
    name: 'Text Formatter',
    description: 'Format and beautify text, code, and markup',
    icon: '/icons/text.svg',
    href: '/text/format',
    tags: ['format', 'beautify', 'clean']
  },
  {
    name: 'Text Diff',
    description: 'Compare and find differences between texts',
    icon: '/icons/text.svg',
    href: '/text/diff',
    tags: ['compare', 'diff', 'difference']
  }
];

export const popularTools: Tool[] = [
  {
    name: 'Calculator',
    description: 'Scientific calculator with advanced functions',
    icon: '/icons/calculator.svg',
    href: '/popular/calculator',
    tags: ['math', 'scientific', 'basic']
  },
  {
    name: 'Currency Converter',
    description: 'Real-time currency conversion with latest rates',
    icon: '/icons/currency.svg',
    href: '/popular/currency',
    tags: ['money', 'exchange', 'forex']
  },
  {
    name: 'Password Generator',
    description: 'Generate secure passwords with custom requirements',
    icon: '/icons/password.svg',
    href: '/popular/password-generator',
    tags: ['security', 'password', 'generator']
  },
  {
    name: 'Loan Calculator',
    description: 'Calculate loan payments and interest rates',
    icon: '/icons/loan.svg',
    href: '/popular/loan-calculator',
    tags: ['finance', 'loan', 'mortgage']
  },
  {
    name: 'Unit Converter',
    description: 'Convert between different units of measurement',
    icon: '/icons/convert.svg',
    href: '/popular/unit-converter',
    tags: ['convert', 'units', 'measurement']
  },
  {
    name: 'Color Converter',
    description: 'Convert between different color formats',
    icon: '/icons/color.svg',
    href: '/popular/color-converter',
    tags: ['color', 'hex', 'rgb', 'hsl']
  }
];

export const allCategories: ToolCategory[] = [
  {
    name: 'Popular Tools',
    description: 'Most frequently used tools and calculators',
    icon: '/icons/popular.svg',
    href: '/popular',
    tools: popularTools
  },
  {
    name: 'Image Tools',
    description: 'Process, convert, and enhance your images',
    icon: '/icons/image.svg',
    href: '/image',
    tools: imageTools
  },
  {
    name: 'Video Tools',
    description: 'Convert, compress, and edit your videos',
    icon: '/icons/video.svg',
    href: '/video',
    tools: videoTools
  },
  {
    name: 'PDF Tools',
    description: 'Convert and manipulate PDF documents',
    icon: '/icons/pdf.svg',
    href: '/pdf',
    tools: pdfTools
  },
  {
    name: 'Barcode Tools',
    description: 'Generate and scan various types of barcodes',
    icon: '/icons/barcode.svg',
    href: '/barcode',
    tools: barcodeTools
  },
  {
    name: 'Text Tools',
    description: 'Process and manipulate text content',
    icon: '/icons/text.svg',
    href: '/text',
    tools: textTools
  }
]; 