import React from 'react';

interface PlaceholderViewProps {
  title: string;
  description: string;
}

export const PlaceholderView: React.FC<PlaceholderViewProps> = ({ title, description }) => {
  return (
    <div className="p-6 h-full flex flex-col items-center justify-center text-center">
      <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">{title}</h2>
      <p className="text-stone-400 max-w-md">{description}</p>
    </div>
  );
};
