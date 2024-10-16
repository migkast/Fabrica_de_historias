import React, { useState } from 'react';
import axios from 'axios';
import StoryForm from './components/StoryForm';
import StoryBook from './components/StoryBook';

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

  const getBackgroundClass = () => {
    switch (theme) {
      case 'adventure':
        return 'bg-gradient-to-br from-green-100 to-blue-200';
      case 'fantasy':
        return 'bg-gradient-to-br from-purple-100 to-pink-200';
      case 'animals':
        return 'bg-gradient-to-br from-yellow-100 to-green-200';
      case 'space':
        return 'bg-gradient-to-br from-indigo-100 to-purple-200';
      default:
        return 'bg-gradient-to-br from-gray-100 to-gray-200';
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundClass()} flex flex-col items-center justify-center p-4`}>
      <h1 className="text-4xl font-bold text-amber-800 mb-8">Bedtime Story Generator</h1>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {loading && <div className="text-amber-600 mb-4">Generating your story...</div>}
      {!loading && !story && <StoryForm onSubmit={generateStory} loading={loading} />}
      {!loading && story && story.text && story.images && (
        <StoryBook story={story} theme={theme} onNewStory={() => setStory(null)} />
      )}
    </div>
  );
}

export default App;
