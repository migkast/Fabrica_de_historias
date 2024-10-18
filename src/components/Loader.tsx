import React from 'react';
import { Book } from 'lucide-react';

interface LoaderProps {
  progress: number;
}

const Loader: React.FC<LoaderProps> = ({ progress }) => {
  return (
    <div className="flex flex-col items-center justify-center bg-white p-8 rounded-lg shadow-lg">
      <div className="animate-bounce mb-4">
        <Book size={64} className="text-purple-600" />
      </div>
      <p className="text-2xl font-semibold text-purple-600 mb-4 font-comic-sans">Creating your magical story...</p>
      <div className="w-64 h-6 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-pink-400 to-purple-500 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-2 text-purple-600 font-comic-sans">{progress}% Complete</div>
    </div>
  );
};

export default Loader;
