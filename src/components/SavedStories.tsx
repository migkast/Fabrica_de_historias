import React from 'react';

interface SavedStory {
  id: string;
  title: string;
  image: string;
}

interface SavedStoriesProps {
  stories: SavedStory[];
}

const SavedStories: React.FC<SavedStoriesProps> = ({ stories }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-blue-800 mb-4">Saved Stories</h2>
      {stories.length === 0 ? (
        <p className="text-gray-600">No saved stories yet. Generate a story and save it to see it here!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {stories.map((story) => (
            <div key={story.id} className="bg-blue-50 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
              <img src={story.image} alt={story.title} className="w-full h-40 object-cover rounded-md mb-2" />
              <h3 className="text-lg font-semibold text-blue-700 truncate">{story.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedStories;
