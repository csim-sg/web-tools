'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ToolLayout } from '../components/ToolLayout';

const tools = [
  {
    name: 'Image Tools',
    description: 'Process and convert images',
    icon: '/icons/image-convert.svg',
    tools: [
      {
        name: 'Image Converter',
        description: 'Convert images between different formats',
        icon: '/icons/image-convert.svg',
        path: '/image/converter'
      },
      {
        name: 'Image Compressor',
        description: 'Compress images while maintaining quality',
        icon: '/icons/image-compress.svg',
        path: '/image/compress'
      },
      {
        name: 'Background Remover',
        description: 'Remove image backgrounds automatically',
        icon: '/icons/bg-remove.svg',
        path: '/image/remove-bg'
      },
      {
        name: 'Batch Processor',
        description: 'Process multiple images at once',
        icon: '/icons/image-batch.svg',
        path: '/image/batch'
      }
    ]
  },
  {
    name: 'Video Tools',
    description: 'Convert and compress videos',
    icon: '/icons/video-convert.svg',
    tools: [
      {
        name: 'Video Converter',
        description: 'Convert videos to different formats',
        icon: '/icons/video-convert.svg',
        path: '/video/converter'
      },
      {
        name: 'Video Compressor',
        description: 'Compress videos while maintaining quality',
        icon: '/icons/video-compress.svg',
        path: '/video/compress'
      },
      {
        name: 'Video Trimmer',
        description: 'Cut and trim video clips',
        icon: '/icons/trim.svg',
        path: '/video/trim'
      }
    ]
  },
  {
    name: 'PDF Tools',
    description: 'Convert and manipulate PDFs',
    icon: '/icons/pdf-word.svg',
    tools: [
      {
        name: 'PDF to Word',
        description: 'Convert PDF to editable Word documents',
        icon: '/icons/pdf-word.svg',
        path: '/pdf/to-word'
      },
      {
        name: 'PDF to Excel',
        description: 'Convert PDF tables to Excel spreadsheets',
        icon: '/icons/pdf-excel.svg',
        path: '/pdf/to-excel'
      },
      {
        name: 'Merge PDF',
        description: 'Combine multiple PDF files',
        icon: '/icons/merge.svg',
        path: '/pdf/merge'
      }
    ]
  },
  {
    name: 'Barcode Tools',
    description: 'Generate and scan barcodes',
    icon: '/icons/barcode-category.svg',
    tools: [
      {
        name: 'QR Code Generator',
        description: 'Create QR codes for URLs and text',
        icon: '/icons/qr-code.svg',
        path: '/barcode/qr-code'
      },
      {
        name: 'EAN-13 Generator',
        description: 'Generate EAN-13 barcodes for retail',
        icon: '/icons/barcode.svg',
        path: '/barcode/ean13'
      },
      {
        name: 'Code 128',
        description: 'Create Code 128 barcodes',
        icon: '/icons/barcode.svg',
        path: '/barcode/code128'
      },
      {
        name: 'Barcode Scanner',
        description: 'Scan QR codes and barcodes',
        icon: '/icons/scanner.svg',
        path: '/barcode/scanner'
      }
    ]
  },
  {
    name: 'Text Tools',
    description: 'Text processing and conversion',
    icon: '/icons/translate.svg',
    tools: [
      {
        name: 'Text Translator',
        description: 'Translate text between languages',
        icon: '/icons/translate.svg',
        path: '/text/translate'
      },
      {
        name: 'OCR',
        description: 'Extract text from images',
        icon: '/icons/ocr.svg',
        path: '/text/ocr'
      },
      {
        name: 'Text to Speech',
        description: 'Convert text to natural speech',
        icon: '/icons/tts.svg',
        path: '/text/tts'
      }
    ]
  },
  {
    name: 'Utilities',
    description: 'Helpful everyday tools',
    icon: '/icons/calculator.svg',
    tools: [
      {
        name: 'Calculator',
        description: 'Scientific calculator with advanced functions',
        icon: '/icons/calculator.svg',
        path: '/utilities/calculator'
      },
      {
        name: 'Currency Converter',
        description: 'Convert between different currencies',
        icon: '/icons/currency.svg',
        path: '/utilities/currency'
      },
      {
        name: 'Unit Converter',
        description: 'Convert between different units',
        icon: '/icons/unit-converter.svg',
        path: '/utilities/unit-converter'
      }
    ]
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, setTheme } = useTheme();
  
  const filteredTools = tools.map(category => ({
    ...category,
    tools: category.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.tools.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="dark:invert"
                />
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  WebTools
                </span>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tools..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <span className="absolute right-3 top-3 text-gray-400">
              🔍
            </span>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {tools.map((category) => (
            <Link
              key={category.name}
              href={category.tools[0].path.split('/')[1]}
              className="group block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                       hover:shadow-md transition-shadow duration-200 border border-gray-200 
                       dark:border-gray-700"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={40}
                    height={40}
                    className="dark:invert"
                  />
                </div>
                <div>
                  <h2 className="text-xl font-medium text-gray-900 dark:text-white group-hover:text-blue-500">
                    {category.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Tool Categories */}
        <div className="space-y-12">
          {filteredTools.map((category) => (
            <div key={category.name}>
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                {category.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.path}
                    href={tool.path}
                    className="group block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm 
                             hover:shadow-md transition-shadow duration-200 border border-gray-200 
                             dark:border-gray-700"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <Image
                          src={tool.icon}
                          alt={tool.name}
                          width={40}
                          height={40}
                          className="dark:invert"
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white group-hover:text-blue-500">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {tool.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} WebTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
