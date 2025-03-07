export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} WebTools. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}