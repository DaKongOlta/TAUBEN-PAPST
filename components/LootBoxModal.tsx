import React from 'react';
import type { GameEffect } from '../types';
import { CrumbIcon, FaithIcon, XPIcon } from './icons';
import { RELICS } from '../relics';

interface LootBoxModalProps {
  results: GameEffect[];
  onClose: () => void;
  onApply: (effect: GameEffect, sourceName: string) => void;
}

const getResultDisplay = (effect: GameEffect) => {
    switch (effect.type) {
        case 'GAIN_CRUMBS':
            return <div className="flex items-center gap-2 text-2xl"><CrumbIcon className="w-8 h-8 text-yellow-500" /> +{effect.value} Crumbs</div>;
        case 'GAIN_FAITH':
            return <div className="flex items-center gap-2 text-2xl"><FaithIcon className="w-8 h-8 text-amber-400" /> +{effect.value} Faith</div>;
        case 'GAIN_XP':
            return <div className="flex items-center gap-2 text-2xl"><XPIcon className="w-8 h-8 text-purple-400" /> +{effect.value} XP</div>;
        case 'GAIN_RELIC':
            const relic = RELICS[effect.value as string];
            if (!relic) return 'Unknown Relic';
            return (
                <div className="flex items-center gap-4 text-left p-2 bg-black/20 rounded-lg">
                    <div className="text-6xl">{relic.art}</div>
                    <div>
                        <p className="text-sm text-amber-300">New Relic!</p>
                        <p className="text-xl font-bold">{relic.name}</p>
                    </div>
                </div>
            );
        default:
            return `Gained ${effect.type}`;
    }
};

export const LootBoxModal: React.FC<LootBoxModalProps> = ({ results, onClose, onApply }) => {
    
    const handleConfirm = () => {
        results.forEach(effect => onApply(effect, "Loot Box"));
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-stone-800 border-4 border-amber-300/50 rounded-lg max-w-md w-full p-6 text-center animate-fade-in">
                <div className="text-7xl mb-4 animate-icon-pulse">🥚✨</div>
                <h2 className="text-3xl font-silkscreen text-amber-300 mb-4">It hatched!</h2>
                
                <div className="space-y-4 my-6">
                    {results.map((effect, index) => (
                        <div key={index} className="font-bold text-white">
                            {getResultDisplay(effect)}
                        </div>
                    ))}
                </div>

                <button
                    onClick={handleConfirm}
                    className="w-full p-4 bg-amber-600 hover:bg-amber-500 rounded-lg text-white font-silkscreen text-xl transition-colors"
                >
                    Coo-l!
                </button>
            </div>
        </div>
    );
};
