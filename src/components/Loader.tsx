import React from 'react';
import { Book } from 'lucide-react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-bounce mb-4">
        <Book size={48} className="text-indigo-600" />
      </div>
      <p className="text-lg font-semibold text-indigo-800">Creating your magical story...</p>
    </div>
  );
};

export default Loader;
