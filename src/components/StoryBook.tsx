import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface StoryBookProps {
  story: {
    text: string;
    images: string[];
  };
  theme: string;
  onNewStory: () => void;
}

const StoryBook: React.FC<StoryBookProps> = ({ story, theme, onNewStory }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);

  useEffect(() => {
    const splitStory = () => {
      const parts = story.text.split(/Part \d+:/i).filter(part => part.trim() !== '');
      setPages(parts);
    };

    splitStory();
  }, [story.text]);

  const nextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const getThemeColor = () => {
    switch (theme) {
      case 'adventure': return 'bg-green-100';
      case 'fantasy': return 'bg-purple-100';
      case 'animals': return 'bg-yellow-100';
      case 'space': return 'bg-blue-100';
      default: return 'bg-pink-100';
    }
  };

  return (
    <div className={`w-full max-w-4xl ${getThemeColor()} rounded-3xl shadow-2xl overflow-hidden p-8`}>
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/2">
          <img
            src={story.images[currentPage] || 'https://via.placeholder.com/1024x1024?text=Loading+Image'}
            alt={`Story illustration ${currentPage + 1}`}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-lg"
          />
        </div>
        <div className="w-full md:w-1/2 bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Part {currentPage + 1}</h2>
          <div className="text-lg overflow-y-auto max-h-64 md:max-h-80">
            {pages[currentPage]}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="bg-indigo-500 text-white p-3 rounded-full disabled:opacity-50 hover:bg-indigo-600 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-lg font-semibold text-indigo-800">
          Page {currentPage + 1} of {pages.length}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === pages.length - 1}
          className="bg-indigo-500 text-white p-3 rounded-full disabled:opacity-50 hover:bg-indigo-600 transition-colors"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <button
        onClick={onNewStory}
        className="mt-6 w-full bg-indigo-500 text-white p-3 rounded-xl hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center transition-colors"
      >
        <RefreshCw className="mr-2" size={18} />
        New Story
      </button>
    </div>
  );
};

export default StoryBook;
