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
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full transform transition-all hover:scale-105">
      <div className="aspect-w-16 aspect-h-9 mb-4">
        {story.images[currentPage] ? (
          <img
            src={story.images[currentPage]}
            alt={`Story illustration ${currentPage + 1}`}
            className="object-cover rounded-lg w-full h-64 transition-all duration-300 ease-in-out transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
      <div className="text-lg mb-4 min-h-[200px] overflow-y-auto bg-blue-50 p-4 rounded-lg">
        <h3 className="font-bold mb-2 text-blue-800">Chapter {currentPage + 1}:</h3>
        {pages[currentPage]}
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className="bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ChevronLeft size={24} />
        </button>
        <span className="text-lg font-bold text-blue-800">
          Page {currentPage + 1} of 5
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === 4}
          className="bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <button
        onClick={onNewStory}
        className="mt-6 w-full bg-green-600 text-white p-3 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center text-xl font-bold transition-all hover:transform hover:scale-105"
      >
        <RefreshCw className="mr-2" size={24} />
        Start a New Adventure!
      </button>
    </div>
  );
};

export default StoryBook;
