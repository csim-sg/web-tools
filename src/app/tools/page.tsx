import Link from 'next/link';
import Image from 'next/image';

const tools = [
  {
    category: 'Image Tools',
    description: 'Edit, convert, and enhance your images',
    href: '/tools/image',
    icon: '/icons/image-convert.svg',
    tools: ['Converter', 'Compressor', 'Background Remover', 'Batch Processing']
  },
  {
    category: 'Video Tools',
    description: 'Convert and compress video files',
    href: '/tools/video',
    icon: '/icons/video-convert.svg',
    tools: ['Converter', 'Compressor', 'Trimmer', 'GIF Creator']
  },
  {
    category: 'Audio Tools',
    description: 'Process and convert audio files',
    href: '/tools/audio',
    icon: '/icons/audio-convert.svg',
    tools: ['Converter', 'Text to Speech', 'Speech to Text']
  },
  {
    category: 'PDF Tools',
    description: 'Convert and manipulate PDF files',
    href: '/tools/pdf',
    icon: '/icons/pdf-word.svg',
    tools: ['PDF to Word', 'PDF to Excel', 'Merge PDF', 'Split PDF']
  },
  {
    category: 'Text Tools',
    description: 'Text processing and conversion tools',
    href: '/tools/text',
    icon: '/icons/translate.svg',
    tools: ['Translator', 'OCR', 'Text to Speech']
  },
  {
    category: 'Utilities',
    description: 'Helpful everyday tools',
    href: '/tools/utilities',
    icon: '/icons/calculator.svg',
    tools: ['Calculator', 'Currency Converter', 'Unit Converter']
  }
];

export default function ToolsPage() {
  return (
    <div className="space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Online Tools & Utilities
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Free online tools to help you with everyday tasks
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((category) => (
          <Link
            key={category.href}
            href={category.href}
            className="group block bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Image
                    src={category.icon}
                    alt={category.category}
                    width={40}
                    height={40}
                    className="text-blue-600"
                  />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600">
                    {category.category}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {category.description}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <ul className="text-sm text-gray-500 space-y-2">
                  {category.tools.map((tool) => (
                    <li key={tool} className="flex items-center">
                      <svg
                        className="h-4 w-4 text-blue-500 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {tool}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 