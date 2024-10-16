import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoryForm from './components/StoryForm';
import StoryBook from './components/StoryBook';
import { Cloud, Sun, Moon, Star } from 'lucide-react';

const API_URL = '/api';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [story, setStory] = useState<{ text: string; images: string[] } | null>(null);
  const [theme, setTheme] = useState<string>('');

  useEffect(() => {
    console.log('App component mounted');
  }, []);

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Cloud className="text-white opacity-50 absolute top-10 left-10 w-16 h-16 floating" style={{animationDelay: '-1s'}} />
        <Sun className="text-yellow-300 opacity-50 absolute top-20 right-20 w-20 h-20 floating" style={{animationDelay: '-2s'}} />
        <Moon className="text-gray-300 opacity-50 absolute bottom-10 left-20 w-12 h-12 floating" style={{animationDelay: '-3s'}} />
        <Star className="text-yellow-200 opacity-50 absolute bottom-20 right-10 w-8 h-8 floating" style={{animationDelay: '-4s'}} />
      </div>
      <div className="z-10 w-full max-w-4xl">
        <h1 className="text-5xl font-bold text-indigo-800 mb-8 text-center">Bedtime Story Generator</h1>
        {error && <div className="text-red-600 mb-4 text-center">{error}</div>}
        {loading && <div className="text-indigo-600 mb-4 text-center">Generating your magical story...</div>}
        {!loading && !story && <StoryForm onSubmit={generateStory} loading={loading} />}
        {!loading && story && story.text && story.images && (
          <StoryBook story={story} theme={theme} onNewStory={() => setStory(null)} />
        )}
        <div className="mt-4 text-sm text-indigo-600 text-center">
          {story ? 'Your magical story is ready!' : 'Create your own magical story!'}
        </div>
      </div>
    </div>
  );
}

export default App;
