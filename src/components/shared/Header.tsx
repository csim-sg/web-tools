 'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { allCategories } from '@/lib/constants/tools';

export function Header() {
  const { theme, setTheme } = useTheme();
  
  const categories = allCategories.map(cat => ({
    name: cat.name.replace(' Tools', ''),
    href: `/${cat.tools[0].href.split('/')[1]}`,
    icon: cat.icon
  }));

  return (
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
  );
}