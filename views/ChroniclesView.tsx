import React from 'react';
import type { ChronicleEntry } from '../types';

interface ChroniclesViewProps {
  entries: ChronicleEntry[];
}

export const ChroniclesView: React.FC<ChroniclesViewProps> = ({ entries }) => {
  return (
    <div className="p-6 h-full flex flex-col items-center">
      <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">The Great Chronicle</h2>
      <p className="text-stone-400 mb-6 max-w-2xl text-center">A living history of your flock's journey, written by the coo of fate itself. These are the sacred tales of your migration.</p>
      
      <div className="w-full max-w-3xl bg-stone-900/50 p-4 rounded-lg border border-stone-700 flex-grow overflow-y-auto">
        {entries.length === 0 ? (
          <p className="text-stone-500 italic text-center mt-8">The first page has yet to be written...</p>
        ) : (
          <ul className="space-y-3">
            {entries.map(entry => (
              <li key={entry.id} className="p-3 bg-stone-800/60 rounded-md border-l-4 border-amber-400">
                <span className="font-bold text-amber-200 mr-2">[Turn {entry.turn}]</span>
                <span className="text-stone-200">{entry.text}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};