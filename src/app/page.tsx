'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { ToolLayout } from '../components/ToolLayout';
import { allCategories } from '@/lib/constants/tools';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, setTheme } = useTheme();
  
  const filteredCategories = allCategories.map(category => ({
    ...category,
    tools: category.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })).filter(category => category.tools.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
      {/* Tool Categories */}
      <div className="space-y-12">
        {filteredCategories.map((category) => (
          <div key={category.name}>
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
              {category.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
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
    </div>
  );
}
