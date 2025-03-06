export default function UploadProgress({ progress }: { progress: number }) {
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-blue-500 dark:text-blue-400">
          Uploading
        </span>
        <span className="text-sm font-medium text-blue-500 dark:text-blue-400">
          {progress}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div 
          className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
} 