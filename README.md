# Web Utilities

A collection of free online tools and utilities built with Next.js 15, TypeScript, and Tailwind CSS & ShadcnUI.

## 🛠️ Tools Available

### PDF Tools

- PDF to Image Converter
  - Supports PNG, JPEG, WebP output formats
  - Custom DPI and quality settings
  - Page selection (all, range, custom)
  - Batch processing with ZIP output
  - Embedded image extraction
- PDF to Word Converter
  - Maintains formatting and layout
  - Supports tables and images
  - Multiple output formats (DOCX, RTF)
- PDF Merger
  - Drag-and-drop interface
  - Page reordering
  - Custom page selection
- PDF Splitter
  - Split by page ranges
  - Extract specific pages
  - Batch processing
- PDF Compressor
  - Multiple compression levels
  - Quality-size optimization
  - Batch processing support

### Image Tools

- Image Converter (PNG, JPG, WEBP, etc.)
- Image Compressor
- Background Remover
- Image Resizer
- Image Effects
- Watermark Tool
- Batch Image Processor

### Video Tools

- Video Converter
- Video Compressor
- Video Trimmer
- GIF Creator

### Barcode Tools

- QR Code Generator
- Code 128 Generator
- EAN-13 Generator
- UPC-A Generator
- Code 39 Generator
- DataMatrix Generator
- PDF417 Generator
- Barcode Scanner

### Text Tools

- Text Translator
- OCR (Optical Character Recognition)
- Text to Speech

### Utilities

- Calculator
- Currency Converter
- Unit Converter

## 📝 Changelog

### v1.1.0 (2024-03-08)
- ✨ Added PDF to Image converter with advanced features
  - Multiple output formats (PNG, JPEG, WebP)
  - Custom DPI and quality settings
  - Page selection and preview
  - ZIP output option
  - Embedded image extraction
- 🔧 Enhanced PDF processing capabilities
  - Improved error handling
  - Better progress tracking
  - Optimized file handling
- 🎨 UI/UX Improvements
  - Added thumbnail previews for PDF pages
  - Enhanced drag-and-drop interface
  - Improved responsive design

### v1.0.0 (2024-03-07)
- 🚀 Initial release
- ✨ Core PDF tools implementation
  - PDF to Word converter
  - PDF Merger
  - PDF Splitter
  - PDF Compressor
- 🎨 Implemented base UI components with ShadcnUI
- 🔧 Set up project infrastructure
  - Next.js 15 setup
  - TypeScript configuration
  - Tailwind CSS integration

## 🔧 Technology Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Icons**: Custom SVG icons
- **Image Processing**: Sharp
- **PDF Processing**: pdf-lib
- **Barcode Generation**: bwip-js, qrcode
- **Video Processing**: FFmpeg

## 🚀 Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/web-utilities.git
cd web-utilities
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# API Keys
REMOVE_BG_API_KEY=your_remove_bg_api_key
TRANSLATE_API_KEY=your_translate_api_key

# Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 🎨 Customization

### Theme

- Edit `tailwind.config.js` to customize colors, fonts, and other design tokens
- Modify `src/app/globals.css` for global styles
- Update `src/components/ToolLayout.tsx` for layout changes

### Icons

- Custom SVG icons are stored in `public/icons/`
- Each icon is optimized for both light and dark modes

## 📱 Progressive Web App

This project is PWA-ready with:

- Service Worker for offline support
- Manifest file for installation
- Icons for various devices
- Responsive design for all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Sharp](https://sharp.pixelplumbing.com/)
- [FFmpeg](https://ffmpeg.org/)
