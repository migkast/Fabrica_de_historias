import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoryForm from './components/StoryForm';
import StoryBook from './components/StoryBook';
import Loader from './components/Loader';
import SavedStories from './components/SavedStories';

const API_URL = '/.netlify/functions';

function App() {
  const [story, setStory] = useState<{ text: string; images: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [storyReady, setStoryReady] = useState(false);
  const [savedStories, setSavedStories] = useState<Array<{ id: string; title: string; image: string }>>([]);

  useEffect(() => {
    // Load saved stories from localStorage
    const loadedStories = localStorage.getItem('savedStories');
    if (loadedStories) {
      setSavedStories(JSON.parse(loadedStories));
    }
  }, []);

  const generateStory = async (formData: any) => {
    setLoading(true);
    setError(null);
    setFirstImageLoaded(false);
    setStoryReady(false);
    try {
      const response = await axios.post(`${API_URL}/generate-story`, formData);
      setStory(response.data);
      setStoryReady(true);
      generateImages(response.data.text);
    } catch (error) {
      console.error('Error generating story:', error);
      if (axios.isAxiosError(error)) {
        setError(`Error: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
        if (error.response?.data?.details) {
          console.error('Error details:', error.response.data.details);
        }
        if (error.response?.data?.stack) {
          console.error('Error stack:', error.response.data.stack);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setLoading(false);
    }
  };

  const generateImages = async (storyText: string) => {
    const storyParts = storyText.split('\n\n');
    const newImages = Array(5).fill('');
    for (let i = 0; i < 5; i++) {
      try {
        const prompt = `Scene from a children's story: ${storyParts[i * 2]}${storyParts[i * 2 + 1]}`;
        const response = await axios.post(`${API_URL}/generate-image`, { prompt });
        newImages[i] = response.data.imageUrl;
        setStory(prevStory => prevStory ? { ...prevStory, images: [...newImages] } : null);
        if (i === 0) {
          setFirstImageLoaded(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  const saveStory = (title: string) => {
    if (story) {
      const newSavedStory = {
        id: Date.now().toString(),
        title,
        image: story.images[0] || 'https://via.placeholder.com/300x200?text=Story+Image'
      };
      const updatedSavedStories = [...savedStories, newSavedStory];
      setSavedStories(updatedSavedStories);
      localStorage.setItem('savedStories', JSON.stringify(updatedSavedStories));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-green-200 flex flex-col items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`
            }}
          >
            {['🚀', '🌟', '🌙', '🪐', '👽'][Math.floor(Math.random() * 5)]}
          </div>
        ))}
      </div>
      <div className="z-10 w-full max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-8 animate-pulse text-center">Bedtime Adventure Generator</h1>
        {error && <div className="text-red-600 mb-4 animate-bounce text-center">{error}</div>}
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            {!story || loading ? (
              loading ? <Loader storyReady={storyReady} /> : <StoryForm onSubmit={generateStory} loading={loading} />
            ) : (
              firstImageLoaded && <StoryBook story={story} onNewStory={() => setStory(null)} onSaveStory={saveStory} />
            )}
          </div>
          <div className="w-full md:w-1/2">
            <SavedStories stories={savedStories} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
