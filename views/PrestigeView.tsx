import React from 'react';
import { AscensionIcon } from '../components/icons';

interface PrestigeViewProps {
  ascensionPoints: number;
  onPrestige: () => void;
}

export const PrestigeView: React.FC<PrestigeViewProps> = ({ ascensionPoints, onPrestige }) => {
  const canAscend = ascensionPoints > 0;

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center text-center">
        <AscensionIcon className="w-24 h-24 text-purple-300 mb-4" />
        <h2 className="text-5xl font-silkscreen text-purple-200 mb-2">Ascension</h2>
        <p className="text-stone-300 max-w-lg mb-8">
            When your migration is complete, you may Ascend. This will reset your progress, but grant you powerful Ascension Points to permanently enhance all future playthroughs.
        </p>

        <div className="bg-stone-900/50 p-6 rounded-lg border-2 border-purple-400/50">
            <h3 className="text-lg font-bold text-stone-400">Points on next Ascension</h3>
            <p className="text-6xl font-silkscreen text-purple-300 my-2">{ascensionPoints}</p>
            <p className="text-xs text-stone-500">(Calculated based on your progress this migration)</p>
        </div>

        <button 
            onClick={onPrestige}
            disabled={!canAscend}
            className="mt-8 px-10 py-4 bg-purple-600 hover:bg-purple-500 disabled:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-50 text-white font-silkscreen text-2xl rounded-lg transition-all"
        >
            Ascend (Coming Soon)
        </button>
    </div>
  );
};
