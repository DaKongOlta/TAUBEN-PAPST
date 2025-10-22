import React from 'react';
import type { Faction, FactionId, DiplomaticStatus, GameEffect } from '../types';
import { playSound } from '../audioManager';
import { Tooltip } from '../components/Tooltip';

interface FactionsViewProps {
  factions: Record<string, Faction>;
  onStartDialogue: (dialogueId: string) => void;
  onProposeTreaty: (factionId: FactionId) => void;
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

const DiplomaticStatusDisplay: React.FC<{ status: DiplomaticStatus }> = ({ status }) => {
    const styles: Record<DiplomaticStatus, { text: string; className: string }> = {
        Neutral: { text: 'Neutral', className: 'bg-stone-500 text-white' },
        Rivalry: { text: 'Rivalry', className: 'bg-red-600 text-white' },
        Alliance: { text: 'Alliance', className: 'bg-sky-500 text-white' },
    };
    const style = styles[status];
    return <div className={`px-3 py-1 text-sm font-bold rounded-full ${style.className}`}>{style.text}</div>;
};

const formatBonus = (effect: GameEffect): string => {
    const value = effect.value as number;
    switch(effect.type) {
        case 'FOLLOWER_CRUMB_PRODUCTION_MULTIPLIER':
            return `+${(value * 100).toFixed(0)}% Crumb production from followers.`;
        case 'GLOBAL_COMBAT_DAMAGE_MULTIPLIER':
            return `+${((value - 1) * 100).toFixed(0)}% damage in combat.`;
        case 'GLOBAL_XP_GAIN_MULTIPLIER':
            return `+${((value - 1) * 100).toFixed(0)}% XP from all sources.`;
        default:
            return 'A mysterious bonus.';
    }
}

export const FactionsView: React.FC<FactionsViewProps> = ({ factions, onStartDialogue, onProposeTreaty }) => {
    return (
        <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">Factions of the City</h2>
            <p className="text-stone-400 mb-6">Manage your relationships with the other powers of the sky and streets. Alliances can be powerful, but betrayal is always an option.</p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Fix: Explicitly type `faction` as `Faction` to resolve type inference issue with Object.values. */}
                {Object.values(factions).map((faction: Faction) => {
                    const activeTreaty = faction.treaties.find(t => t.isActive);
                    const availableTreaties = faction.treaties.filter(t => !t.isActive);
                    const isRival = faction.diplomaticStatus === 'Rivalry';
                    const isAlly = faction.diplomaticStatus === 'Alliance';

                    let proposeTooltip = "Propose a formal treaty with this faction.";
                    if (isRival) proposeTooltip = "Cannot propose treaties with rivals!";
                    else if (availableTreaties.length === 0) proposeTooltip = "No available treaties with this faction.";

                    return (
                        <div key={faction.id} className="bg-stone-800/50 p-4 rounded-lg border border-stone-700 flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-start gap-3">
                                   <div className="text-6xl bg-stone-900 p-2 rounded-md">{faction.art}</div>
                                   <div>
                                        <h3 className="font-bold text-xl font-silkscreen text-amber-200">{faction.name}</h3>
                                        <p className="text-sm text-stone-400">{faction.description}</p>
                                   </div>
                                </div>
                                <DiplomaticStatusDisplay status={faction.diplomaticStatus} />
                            </div>
                            <RelationshipBar value={faction.relationship} />

                            {isAlly && faction.allianceBonus && (
                                <div className="p-2 bg-sky-900/50 rounded-md text-center border border-sky-700">
                                    <p className="font-bold text-sky-300 text-sm">Alliance Bonus</p>
                                    <p className="text-xs text-stone-300">{formatBonus(faction.allianceBonus)}</p>
                                </div>
                            )}

                            <div className="flex-grow space-y-2 bg-black/20 p-3 rounded-md">
                                <h4 className="font-bold text-md text-stone-300 border-b border-stone-600 pb-1 mb-2">Diplomatic Treaties</h4>
                                {activeTreaty ? (
                                    <Tooltip content={activeTreaty.description} position="right">
                                        <div className="text-sm cursor-help">
                                            <span className="font-bold text-green-400">Active:</span> {activeTreaty.name}
                                        </div>
                                    </Tooltip>
                                ) : (
                                    <p className="text-sm text-stone-500 italic">No active treaties.</p>
                                )}
                                {availableTreaties.length > 0 && (
                                    <div>
                                        <p className="text-sm font-bold text-stone-400 mt-2">Available:</p>
                                        <ul className="list-disc list-inside text-xs pl-2">
                                            {availableTreaties.map(treaty => (
                                                <Tooltip key={treaty.id} content={treaty.description} position="right">
                                                    <li className="text-stone-300 cursor-help">{treaty.name}</li>
                                                </Tooltip>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>


                            <div className="mt-auto pt-4 border-t border-stone-600/50 grid grid-cols-2 gap-2">
                                <button 
                                    onClick={() => {
                                        onStartDialogue(faction.dialogueId);
                                        playSound('ui_click');
                                    }}
                                    className="w-full p-2 bg-sky-600 hover:bg-sky-500 rounded text-md font-bold transition-colors"
                                >
                                    Open Diplomacy
                                </button>
                                <Tooltip content={proposeTooltip}>
                                  <div className="w-full">
                                    <button 
                                        onClick={() => onProposeTreaty(faction.id)}
                                        disabled={isRival || availableTreaties.length === 0}
                                        className="w-full p-2 bg-stone-600 hover:bg-stone-500 text-md font-bold rounded transition-colors disabled:bg-stone-700 disabled:cursor-not-allowed"
                                    >
                                        Propose Treaty
                                    </button>
                                  </div>
                                </Tooltip>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};