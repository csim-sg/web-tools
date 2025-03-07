'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import { allCategories } from '@/lib/constants/tools';
import { Breadcrumb } from '@/components/shared/Breadcrumb';

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme, setTheme } = useTheme();
  
  // Use categories from shared constants
  const categories = allCategories.map(cat => ({
    name: cat.name.replace(' Tools', ''),
    href: `/${cat.tools[0].href.split('/')[1]}`,
    icon: cat.icon
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb />
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
    </div>
  );
} 