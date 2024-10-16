import React, { useState } from 'react';
import axios from 'axios';
import StoryForm from './components/StoryForm';
import StoryBook from './components/StoryBook';
import { Cloud, Sun, Moon, Star } from 'lucide-react';

const API_URL = '/.netlify/functions';

function App() {
  const [story, setStory] = useState<{ text: string; images: string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<string>('');

  const generateStory = async (formData: any) => {
    setLoading(true);
    setError(null);
    setTheme(formData.theme);
    try {
      console.log('Sending request to:', `${API_URL}/generate-story`);
      console.log('Form data:', formData);
      const response = await axios.post(`${API_URL}/generate-story`, formData);
      console.log('Response:', response.data);
      if (response.data && response.data.text && response.data.images) {
        setStory(response.data);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error generating story:', error);
      if (axios.isAxiosError(error)) {
        setError(`Error: ${error.response?.status} - ${error.response?.data?.error || error.message}`);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      setStory(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <Cloud className="absolute top-1/4 left-1/4 text-white opacity-50 w-16 h-16 floating" />
        <Sun className="absolute top-1/3 right-1/3 text-yellow-300 opacity-50 w-20 h-20 floating" />
        <Moon className="absolute bottom-1/4 left-1/3 text-gray-300 opacity-50 w-12 h-12 floating" />
        <Star className="absolute top-1/2 right-1/4 text-yellow-200 opacity-50 w-8 h-8 floating" />
      </div>
      <div className="z-10 w-full max-w-4xl">
        <h1 className="text-4xl font-bold text-center mb-8 text-white shadow-text">Bedtime Story Generator</h1>
        {!story ? (
          <StoryForm onSubmit={generateStory} loading={loading} />
        ) : (
          <StoryBook story={story} theme={theme} onNewStory={() => setStory(null)} />
        )}
        {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default App;
