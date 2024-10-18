import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

interface StoryFormProps {
  onSubmit: (formData: any) => void;
  loading: boolean;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    age: '',
    theme: '',
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
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full transform transition-all hover:scale-105">
      <div className="mb-4">
        <label htmlFor="age" className="block text-lg font-bold text-blue-700 mb-2">Quantos anos você tem?</label>
        <select
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-3 border-2 border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
          required
        >
          <option value="">Escolha sua faixa etária</option>
          <option value="3-5">3-5 anos (Pequeno Aventureiro)</option>
          <option value="6-8">6-8 anos (Explorador Corajoso)</option>
          <option value="9-12">9-12 anos (Herói em Treinamento)</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="theme" className="block text-lg font-bold text-blue-700 mb-2">Escolha o tipo de aventura!</label>
        <select
          id="theme"
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          className="w-full p-3 border-2 border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
          required
        >
          <option value="">Selecione sua missão</option>
          <option value="fantasy">Mundo Mágico</option>
          <option value="dinosaurs">Aventura Jurássica</option>
          <option value="superheroes">Esquadrão de Super-Heróis</option>
          <option value="pirates">Caça ao Tesouro Pirata</option>
        </select>
      </div>
      <div className="mb-6">
        <label htmlFor="characterName" className="block text-lg font-bold text-blue-700 mb-2">Qual é o nome do seu herói?</label>
        <input
          type="text"
          id="characterName"
          name="characterName"
          value={formData.characterName}
          onChange={handleChange}
          className="w-full p-3 border-2 border-blue-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-lg"
          placeholder="Digite o nome incrível do seu herói"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className={`w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center text-xl font-bold transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:transform hover:scale-105'}`}
      >
        {loading ? (
          <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <BookOpen className="mr-2" size={24} />
        )}
        {loading ? 'Criando sua história...' : 'Começar a Aventura!'}
      </button>
    </form>
  );
};

export default StoryForm;
