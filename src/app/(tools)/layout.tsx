'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  const categories = [
    { name: 'Image', href: '/image', icon: '/icons/image-convert.svg' },
    { name: 'Video', href: '/video', icon: '/icons/video-convert.svg' },
    { name: 'Audio', href: '/audio', icon: '/icons/audio-convert.svg' },
    { name: 'PDF', href: '/pdf', icon: '/icons/pdf-word.svg' },
    { name: 'Text', href: '/text', icon: '/icons/translate.svg' },
    { name: 'Utilities', href: '/utilities', icon: '/icons/calculator.svg' },
  ];

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

            {/* Category Links */}
            <nav className="hidden md:flex space-x-6">
              {categories.map((category) => (
                <Link
                  key={category.href}
                  href={category.href}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
                >
                  <Image
                    src={category.icon}
                    alt={category.name}
                    width={20}
                    height={20}
                    className="dark:invert"
                  />
                  <span>{category.name}</span>
                </Link>
              ))}
            </nav>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
          <div className="px-4 py-3 space-y-1">
            {categories.map((category) => (
              <Link
                key={category.href}
                href={category.href}
                className="flex items-center space-x-2 py-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <Image
                  src={category.icon}
                  alt={category.name}
                  width={20}
                  height={20}
                  className="dark:invert"
                />
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="mb-8 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link 
                href="/" 
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Home
              </Link>
            </li>
          </ol>
        </nav>

        {/* Page Content */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-4 py-5 sm:p-6">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>© {new Date().getFullYear()} WebTools. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 