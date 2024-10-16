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
    duration: '',
    characterName: '',
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
      <div className="mb-4">
        <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age of child</label>
        <select
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Select age</option>
          <option value="3-5">3-5 years</option>
          <option value="6-8">6-8 years</option>
          <option value="9-12">9-12 years</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="theme" className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
        <select
          id="theme"
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Select theme</option>
          <option value="adventure">Adventure</option>
          <option value="fantasy">Fantasy</option>
          <option value="animals">Animals</option>
          <option value="space">Space</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Story duration</label>
        <select
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          required
        >
          <option value="">Select duration</option>
          <option value="short">Short (5 minutes)</option>
          <option value="medium">Medium (10 minutes)</option>
          <option value="long">Long (15 minutes)</option>
        </select>
      </div>
      <div className="mb-6">
        <label htmlFor="characterName" className="block text-sm font-medium text-gray-700 mb-1">Main character's name</label>
        <input
          type="text"
          id="characterName"
          name="characterName"
          value={formData.characterName}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter character name"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <Send className="mr-2" size={18} />
        )}
        {loading ? 'Generating...' : 'Generate Story'}
      </button>
    </form>
  );
};

export default StoryForm;