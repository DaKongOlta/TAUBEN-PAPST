import React from 'react';
import type { DialogueNode } from '../types';
import { playSound } from '../audioManager';

interface IncomingMessageToastProps {
  message: DialogueNode;
  onView: () => void;
}

export const IncomingMessageToast: React.FC<IncomingMessageToastProps> = ({ message, onView }) => {
  const handleViewClick = () => {
    playSound('ui_click');
    onView();
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-stone-800 border-2 border-sky-400/50 rounded-lg p-3 shadow-lg animate-fade-in-down flex items-center gap-4 max-w-md w-full">
      <div className="text-4xl bg-stone-900 p-1 rounded-md">{message.art}</div>
      <div className="flex-grow">
        <h3 className="font-bold text-sky-200">Incoming Message</h3>
        <p className="text-sm text-stone-300">You have a message from {message.speaker}.</p>
      </div>
      <button
        onClick={handleViewClick}
        className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-lg transition-colors"
      >
        View
      </button>
    </div>
  );
};