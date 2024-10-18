import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

interface StoryBookProps {
  story: {
    text: string;
    images: string[];
  };
  onNewStory: () => void;
}

const StoryBook: React.FC<StoryBookProps> = ({ story, onNewStory }) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  // Split the story into exactly 5 parts
  const storyParts = story.text.split(/Part \d+:/g).filter(part => part.trim() !== '');
  const pages = storyParts.map(part => part.trim());

  const nextPage = () => {
    if (currentPage < 4) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        <img
          src={story.images[currentPage]}
          alt={`Story illustration ${currentPage + 1}`}
          className="object-cover rounded-lg w-full h-64"
        />
      </div>
      <div className="text-lg mb-4 min-h-[200px] overflow-y-auto">
        <h3 className="font-bold mb-2">Part {currentPage + 1}:</h3>
        {pages[currentPage]}
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="bg-indigo-600 text-white p-2 rounded-full disabled:opacity-50"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-sm text-gray-500">
          Page {currentPage + 1} of 5
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === 4}
          className="bg-indigo-600 text-white p-2 rounded-full disabled:opacity-50"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <button
        onClick={onNewStory}
        className="mt-4 w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center"
      >
        <RefreshCw className="mr-2" size={18} />
        Generate New Story
      </button>
    </div>
  );
};

export default StoryBook;
