interface ToolPageProps {
  params: {
    category: string;
    tool: string;
  };
}

export default function ToolPage({ params }: ToolPageProps) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          {params.tool.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </h1>
        <p className="mt-2 text-gray-600">
          Description of what this tool does
        </p>
      </div>

      {/* Tool-specific content */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        {/* Your tool implementation */}
      </div>
    </div>
  );
} 