import { allCategories } from '@/lib/constants/tools';

export function generateMetadata(pathname: string) {
  const paths = pathname.split('/').filter(Boolean);
  const lastPath = paths[paths.length - 1];

  // Find matching tool or category
  const tool = allCategories
    .flatMap(cat => cat.tools)
    .find(tool => tool.href.endsWith(lastPath));

  const category = allCategories.find(cat => 
    cat.tools[0].href.split('/')[1] === lastPath
  );

  if (tool) {
    return {
      title: tool.name,
      description: tool.description
    };
  }

  if (category) {
    return {
      title: category.name,
      description: category.description
    };
  }

  return {
    title: 'WebTools',
    description: 'Free online utilities and tools'
  };
} 