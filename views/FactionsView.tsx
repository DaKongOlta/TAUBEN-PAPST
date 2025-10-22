import React from 'react';
import type { Faction } from '../types';
import { playSound } from '../audioManager';

interface FactionsViewProps {
  factions: Record<string, Faction>;
  onStartDialogue: (dialogueId: string) => void;
}

const RelationshipBar: React.FC<{ value: number }> = ({ value }) => {
    const percentage = ((value + 100) / 200) * 100;
    const color = value > 20 ? 'bg-green-500' : value < -20 ? 'bg-red-500' : 'bg-yellow-500';
    
    let statusText = "Neutral";
    if (value > 75) statusText = "Alliance";
    else if (value > 20) statusText = "Friendly";
    else if (value < -75) statusText = "War";
    else if (value < -20) statusText = "Hostile";

    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-stone-300">Relationship: {statusText}</span>
                <span className="font-bold">{value}</span>
            </div>
            <div className="w-full bg-stone-700 rounded-full h-4 border border-stone-900">
                <div className={`h-full rounded-full transition-all duration-300 ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    );
};

export const FactionsView: React.FC<FactionsViewProps> = ({ factions, onStartDialogue }) => {
    return (
        <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">Factions of the City</h2>
            <p className="text-stone-400 mb-6">Manage your relationships with the other powers of the sky and streets. Alliances can be powerful, but betrayal is always an option.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {Object.values(factions).map((
                    // FIX: Explicitly typing 'faction' resolves type inference issues where it was being inferred as 'unknown'.
                    faction: Faction
                ) => (
                    <div key={faction.id} className="bg-stone-800/50 p-4 rounded-lg border border-stone-700 flex flex-col gap-4">
                        <div className="flex items-start gap-3">
                           <div className="text-6xl bg-stone-900 p-2 rounded-md">{faction.art}</div>
                           <div>
                                <h3 className="font-bold text-xl font-silkscreen text-amber-200">{faction.name}</h3>
                                <p className="text-sm text-stone-400">{faction.description}</p>
                           </div>
                        </div>
                        <RelationshipBar value={faction.relationship} />
                        <button 
                            onClick={() => {
                                onStartDialogue(faction.dialogueId);
                                playSound('ui_click');
                            }}
                            className="w-full p-2 bg-sky-600 hover:bg-sky-500 rounded text-md font-bold transition-colors mt-auto"
                        >
                            Diplomacy
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};