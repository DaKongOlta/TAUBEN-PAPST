import React from 'react';
import type { DialogueNode, DialogueOption } from '../types';

interface DialogueModalProps {
  dialogue: DialogueNode;
  onChoice: (choice: DialogueOption) => void;
}

export const DialogueModal: React.FC<DialogueModalProps> = ({ dialogue, onChoice }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-800 border-4 border-sky-300/50 rounded-lg max-w-2xl w-full p-6 animate-fade-in">
        <div className="flex items-start gap-4 mb-4">
            <div className="text-6xl bg-stone-900 p-2 rounded-md">{dialogue.art}</div>
            <div>
                <h2 className="text-2xl font-silkscreen text-sky-200">{dialogue.speaker}</h2>
                <p className="text-stone-200 text-lg">{dialogue.text}</p>
            </div>
        </div>
        
        <div className="space-y-3 border-t border-stone-600 pt-4">
          {dialogue.options.map((choice, index) => (
            <button
              key={index}
              onClick={() => onChoice(choice)}
              className="w-full p-3 bg-stone-700 hover:bg-stone-600 border-2 border-stone-600 rounded-lg transition-colors text-left"
            >
              <p className="font-bold text-md text-stone-100 italic">"{choice.text}"</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};