import React from 'react';
import type { GameEvent, EventChoice } from '../types';

interface EventModalProps {
  event: GameEvent;
  onChoice: (choice: EventChoice) => void;
}

export const EventModal: React.FC<EventModalProps> = ({ event, onChoice }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-800 border-4 border-amber-300/50 rounded-lg max-w-lg w-full p-6 text-center animate-fade-in">
        <div className="text-6xl mb-4">{event.art}</div>
        <h2 className="text-3xl font-silkscreen text-amber-300 mb-2">{event.title}</h2>
        <p className="text-stone-300 mb-6">{event.description}</p>
        <div className="space-y-3">
          {event.choices.map((choice, index) => (
            <button
              key={index}
              onClick={() => onChoice(choice)}
              className="w-full p-4 bg-stone-700 hover:bg-stone-600 border-2 border-stone-600 rounded-lg transition-colors"
            >
              <p className="font-bold text-lg">{choice.text}</p>
              <p className="text-sm text-stone-400">{choice.description}</p>
            </button>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};