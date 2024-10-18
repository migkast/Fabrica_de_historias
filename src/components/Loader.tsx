import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';

interface LoaderProps {
  storyReady: boolean;
}

const Loader: React.FC<LoaderProps> = ({ storyReady }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (storyReady) {
          return 100;
        }
        const newProgress = prevProgress + 1;
        return newProgress > 95 ? 95 : newProgress;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [storyReady]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-48 h-48 mb-4">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-40 h-40 border-8 border-indigo-200 rounded-full"></div>
        </div>
        <div 
          className="absolute inset-0 flex items-center justify-center animate-spin"
          style={{ 
            animation: 'spin 4s linear infinite',
            transformOrigin: 'center center'
          }}
        >
          <div 
            className="w-40 h-40 border-t-8 border-indigo-600 rounded-full"
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${50 + progress/2}% 0%, ${50 + progress/2}% ${progress}%, ${50 - progress/2}% ${progress}%, ${50 - progress/2}% 0%, 50% 0%)`
            }}
          ></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Rocket size={48} className="text-indigo-600 animate-bounce" />
        </div>
      </div>
      <p className="text-2xl font-bold text-indigo-800 mb-2">Blasting off to story land!</p>
      <p className="text-lg font-semibold text-indigo-600">{progress}% complete</p>
    </div>
  );
};

export default Loader;
