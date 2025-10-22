import React from 'react';
import type { Dogma } from '../types';
import { DOGMAS } from '../dogmas';

interface DogmaSelectionModalProps {
  onSelect: (dogma: Dogma) => void;
}

const DogmaCard: React.FC<{ dogma: Dogma; onSelect: () => void; }> = ({ dogma, onSelect }) => (
    <button
        onClick={onSelect}
        className="w-full p-4 bg-stone-700 hover:bg-stone-600 border-2 border-stone-600 hover:border-amber-400 rounded-lg transition-all text-left flex items-start gap-4"
    >
        <div className="text-5xl mt-1">{dogma.art}</div>
        <div>
            <p className="font-bold text-lg font-silkscreen text-amber-300">{dogma.name}</p>
            <p className="text-sm text-stone-300">{dogma.description}</p>
        </div>
    </button>
);

export const DogmaSelectionModal: React.FC<DogmaSelectionModalProps> = ({ onSelect }) => {
  const dogmaChoices = Object.values(DOGMAS); // In a real game, you might offer a random selection

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-800 border-4 border-amber-300/50 rounded-lg max-w-lg w-full p-6 text-center animate-fade-in">
        <h2 className="text-3xl font-silkscreen text-amber-300 mb-2">A New Dogma is Revealed!</h2>
        <p className="text-stone-300 mb-6">Your flock's faith has solidified into a core belief. This choice is permanent and will shape your path.</p>
        <div className="space-y-3">
          {dogmaChoices.map((dogma) => (
            <DogmaCard key={dogma.id} dogma={dogma} onSelect={() => onSelect(dogma)} />
          ))}
        </div>
      </div>
    </div>
  );
};