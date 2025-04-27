import { Download, Share2 } from 'lucide-react';
import { ReactNode } from 'react';

interface ResultDisplayProps {
  title: string;
  children: ReactNode;
  onDownload?: () => void;
  onShare?: () => void;
}

const ResultDisplay = ({ title, children, onDownload, onShare }: ResultDisplayProps) => {
  return (
    <div className="bg-white dark:bg-[#1a202c] rounded-xl shadow-md p-6 mt-6 transition-colors duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex gap-2">
          {onDownload && (
            <button 
              onClick={onDownload}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              aria-label="Download results"
            >
              <Download size={18} />
            </button>
          )}
          {onShare && (
            <button 
              onClick={onShare}
              className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
              aria-label="Share results"
            >
              <Share2 size={18} />
            </button>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4 bg-white bg-opacity-60 dark:bg-[#2d3748] dark:bg-opacity-60 rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default ResultDisplay;
