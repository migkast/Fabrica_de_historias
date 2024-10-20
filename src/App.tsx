import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoryForm from './components/StoryForm';
import StoryBook from './components/StoryBook';
import Loader from './components/Loader';

const API_URL = '/.netlify/functions';

function App() {
  const [story, setStory] = useState<{ text: string; images: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [storyReady, setStoryReady] = useState(false);

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
        const prompt = `Create an image for a Scene from a children's story. Image should not have any text on it. The style should be cartoonish or manga or pixar style. It should focus on the action of the plot, which is: ${storyParts[i * 2]}${storyParts[i * 2 + 1]}`;
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
      <div className="z-10 w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-8 animate-pulse text-center">Bedtime Adventure Generator</h1>
        {error && <div className="text-red-600 mb-4 animate-bounce text-center">{error}</div>}
        {!story || loading ? (
          loading ? <Loader storyReady={storyReady} /> : <StoryForm onSubmit={generateStory} loading={loading} />
        ) : (
          firstImageLoaded && <StoryBook story={story} onNewStory={() => setStory(null)} />
        )}
      </div>
    </div>
  );
}

export default App;
