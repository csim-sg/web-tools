'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface FluidMenuProps {
  items: {
    href: string;
    label: string;
  }[];
}

export const FluidMenu = ({ items }: FluidMenuProps) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [highlightRect, setHighlightRect] = useState({ width: 0, left: 0 });

  useEffect(() => {
    const updateHighlight = () => {
      if (hoveredIndex === null || !menuRef.current) return;
      
      const menuItem = menuRef.current.children[hoveredIndex] as HTMLElement;
      if (!menuItem) return;
      
      const menuRect = menuRef.current.getBoundingClientRect();
      const itemRect = menuItem.getBoundingClientRect();
      
      setHighlightRect({
        width: itemRect.width,
        left: itemRect.left - menuRect.left,
      });
    };

    updateHighlight();
  }, [hoveredIndex]);

  return (
    <nav 
      ref={menuRef}
      className="relative flex items-center gap-2 rounded-lg p-2 text-sm font-medium"
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {hoveredIndex !== null && (
        <div
          className="absolute inset-0 transition-all duration-200"
          style={{
            width: highlightRect.width,
            left: highlightRect.left,
            background: 'hsl(var(--primary) / 0.1)',
            borderRadius: '0.5rem',
            height: '80%',
            top: '10%',
          }}
        />
      )}
      {items.map((item, index) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'relative px-3 py-2 transition-colors hover:text-foreground/80',
            activeIndex === index ? 'text-foreground' : 'text-foreground/60'
          )}
          onMouseEnter={() => setHoveredIndex(index)}
          onClick={() => setActiveIndex(index)}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
};
