'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { allCategories } from '@/lib/constants/tools';

interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);

  // Generate breadcrumb items based on the current path
  const breadcrumbs: BreadcrumbItem[] = paths.map((path, index) => {
    const href = `/${paths.slice(0, index + 1).join('/')}`;
    
    // Find matching category
    const category = allCategories.find(cat => 
      cat.tools[0].href.split('/')[1] === path
    );

    // Find matching tool
    const tool = allCategories
      .flatMap(cat => cat.tools)
      .find(tool => tool.href === pathname);

    let label = '';
    if (index === paths.length - 1 && tool) {
      // Last item is a tool
      label = tool.name;
    } else if (category) {
      // Item is a category
      label = category.name;
    } else {
      // Fallback to capitalized path
      label = path.charAt(0).toUpperCase() + path.slice(1);
    }

    return { label, href };
  });

  return (
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
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center space-x-2">
            <span className="text-gray-400">/</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="text-gray-900 dark:text-white font-medium">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.href}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 