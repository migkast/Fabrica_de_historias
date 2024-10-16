import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StoryForm from './components/StoryForm';
import StoryBook from './components/StoryBook';
import { Cloud, Sun, Moon, Star } from 'lucide-react';

// Update this line to use the correct Netlify function URL
const API_URL = '/.netlify/functions';

function App() {
  // ... (rest of the component code remains the same)

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

  // ... (rest of the component code remains the same)
}

export default App;
