import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import Link from 'next/link';

interface Tool {
  name: string;
  description: string;
  icon: string;
  href: string;
}

interface ToolLayoutProps {
  category: string;
  description: string;
  tools: Tool[];
}

export function ToolLayout({ category, description, tools }: ToolLayoutProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">{category}</h1>
        <p className="text-muted-foreground mt-2">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link key={tool.href} href={tool.href}>
            <Card className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
                    <Image
                      src={tool.icon}
                      alt={tool.name}
                      width={24}
                      height={24}
                      className="text-primary group-hover:scale-110 transition-transform dark:invert"
                    />
                  </div>
                  <CardTitle className="text-lg">{tool.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{tool.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
} 