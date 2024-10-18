import React, { useState } from 'react';
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
  const [loadingProgress, setLoadingProgress] = useState(0);

  const generateStory = async (formData: any) => {
    setLoading(true);
    setError(null);
    setFirstImageLoaded(false);
    setLoadingProgress(0);
    try {
      setLoadingProgress(20);
      const response = await axios.post(`${API_URL}/generate-story`, formData);
      setStory(response.data);
      setLoadingProgress(50);
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
        const prompt = `Scene from a children's story: ${storyParts[i * 2]}${storyParts[i * 2 + 1]}`;
        const response = await axios.post(`${API_URL}/generate-image`, { prompt });
        newImages[i] = response.data.imageUrl;
        setStory(prevStory => prevStory ? { ...prevStory, images: [...newImages] } : null);
        if (i === 0) {
          setFirstImageLoaded(true);
          setLoadingProgress(100);
          setLoading(false);
        } else {
          setLoadingProgress(50 + (i * 10));
        }
      } catch (error) {
        console.error('Error generating image:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-pink-200 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-purple-600 mb-8 font-comic-sans">Magical Bedtime Story Generator</h1>
      {error && <div className="text-red-600 mb-4 bg-white p-2 rounded-lg">{error}</div>}
      {!story || loading ? (
        loading ? <Loader progress={loadingProgress} /> : <StoryForm onSubmit={generateStory} loading={loading} />
      ) : (
        firstImageLoaded && <StoryBook story={story} onNewStory={() => setStory(null)} />
      )}
    </div>
  );
}

export default App;
