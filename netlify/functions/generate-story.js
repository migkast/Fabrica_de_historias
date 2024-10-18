const { OpenAI } = require('openai');
const axios = require('axios');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

exports.handler = async (event, context) => {
  console.log('Function invoked with event:', JSON.stringify(event));
  
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    console.log('Parsing request body');
    const { age, theme, characterName, sideCharacter } = JSON.parse(event.body);

    if (!age || !theme || !characterName) {
      console.log('Missing required fields:', { age, theme, characterName });
      Certainly! I'll update the StoryForm component to remove the story duration option and add an optional side character field. I'll also update the generate-story function to reflect these changes. Here are the modifications:

<boltArtifact id="update-story-form-and-function" title="Update StoryForm and generate-story function">
<boltAction type="file" filePath="src/components/StoryForm.tsx">
import React, { useState } from 'react';
import { Send } from 'lucide-react';

interface StoryFormProps {
  onSubmit: (formData: any) => void;
  loading: boolean;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    age: '',
    theme: '',
    characterName: '',
    sideCharacter: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
      <h2 className="text-2xl font-bold text-purple-600 mb-4 font-comic-sans">Create Your Story</h2>
      <div className="mb-4">
        <label htmlFor="age" className="block text-lg font-medium text-purple-600 mb-1 font-comic-sans">How old are you?</label>
        <select
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 border-2 border-purple-300 rounded-md focus:ring-purple-500 focus:border-purple-500 font-comic-sans"
          required
        >
          <option value="">Pick your age</option>
          <option value="3-5">3-5 years</option>
          <option value="6-8">6-8 years</option>
          <option value="9-12">9-12 years</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="theme" className="block text-lg font-medium text-purple-600 mb-1 font-comic-sans">What kind of story?</label>
        <select
          id="theme"
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          className="w-full p-2 border-2 border-purple-300 rounded-md focus:ring-purple-500 focus:border-purple-500 font-comic-sans"
          required
        >
          <option value="">Choose a theme</option>
          <option value="adventure">Adventure</option>
          <option value="fantasy">Fantasy</option>
          <option value="animals">Animals</option>
          <option value="space">Space</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="characterName" className="block text-lg font-medium text-purple-600 mb-1 font-comic-sans">What's the main character's name?</label>
        <input
          type="text"
          id="characterName"
          name="characterName"
          value={formData.characterName}
          onChange={handleChange}
          className="w-full p-2 border-2 border-purple-300 rounded-md focus:ring-purple-500 focus:border-purple-500 font-comic-sans"
          placeholder="Enter a name"
          required
        />
      </div>
      <div className="mb-6">
        <label htmlFor="sideCharacter" className="block text-lg font-medium text-purple-600 mb-1 font-comic-sans">Side character's name (optional)</label>
        <input
          type="text"
          id="sideCharacter"
          name="sideCharacter"
          value={formData.sideCharacter}
          onChange={handleChange}
          className="w-full p-2 border-2 border-purple-300 rounded-md focus:ring-purple-500 focus:border-purple-500 font-comic-sans"
          placeholder="Enter a name (optional)"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white p-3 rounded-md hover:from-pink-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 flex items-center justify-center font-comic-sans text-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <Send className="mr-2" size={24} />
        )}
        {loading ? 'Creating Magic...' : 'Create My Story!'}
      </button>
