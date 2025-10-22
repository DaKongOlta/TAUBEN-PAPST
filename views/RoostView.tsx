import React from 'react';
import type { PlayerStats, PopeCustomization, Relic } from '../types';
import { PigeonPopeSprite } from '../components/PigeonPopeSprite';
import { XPIcon, LuckIcon } from '../components/icons';
import { Tooltip } from '../components/Tooltip';

interface RoostViewProps {
    playerStats: PlayerStats;
    popeCustomization: PopeCustomization;
    setPopeCustomization: React.Dispatch<React.SetStateAction<PopeCustomization>>;
    relics: Relic[];
    onSave: () => void;
    onLoad: () => void;
    onDelete: () => void;
    hasSaveData: boolean;
}

const HAT_COLORS = ['#fefae0', '#fca5a5', '#60a5fa', '#4ade80', '#c084fc'];

export const RoostView: React.FC<RoostViewProps> = ({ playerStats, popeCustomization, setPopeCustomization, relics, onSave, onLoad, onDelete, hasSaveData }) => {
    const xpPercentage = (playerStats.xp / playerStats.xpToNextLevel) * 100;

    return (
        <div className="p-6 h-full overflow-y-auto flex items-center justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl w-full">
                
                {/* Left Panel: Pope & Customization */}
                <div className="flex flex-col items-center bg-stone-800/50 p-6 rounded-lg border border-stone-700">
                    <h2 className="text-3xl font-silkscreen text-amber-300 mb-4">The Pigeon Pope</h2>
                    <PigeonPopeSprite state="idle" hatColor={popeCustomization.hatColor} />
                    <div className="mt-4 w-full">
                        <h3 className="text-lg font-bold text-center mb-2">Customize Hat</h3>
                        <div className="flex justify-center gap-3 bg-black/20 p-2 rounded-lg">
                            {HAT_COLORS.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setPopeCustomization(pc => ({...pc, hatColor: color}))}
                                    className={`w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110 ${popeCustomization.hatColor === color ? 'border-white' : 'border-transparent'}`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Set hat color to ${color}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Stats & Actions */}
                <div className="bg-stone-800/50 p-6 rounded-lg border border-stone-700 flex flex-col gap-6">
                    <div>
                        <h3 className="text-2xl font-silkscreen text-amber-200 mb-3">Pope Stats</h3>
                        <div className="space-y-4">
                            <div className="text-4xl font-bold font-silkscreen">Level: {playerStats.level}</div>
                            <div>
                                <div className="flex justify-between items-center text-sm mb-1">
                                    <span className="font-bold flex items-center gap-1"><XPIcon className="w-4 h-4"/> Experience</span>
                                    <span>{playerStats.xp.toFixed(0)} / {playerStats.xpToNextLevel}</span>
                                </div>
                                <div className="stat-bar bg-stone-700"><div className="stat-bar-inner bg-purple-500" style={{ width: `${xpPercentage}%` }}></div></div>
                            </div>
                            <div className="font-bold text-lg flex items-center gap-2"><LuckIcon className="w-6 h-6 text-green-400"/> Luck: {playerStats.luck}</div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-silkscreen text-amber-200 mb-3">Relic Shrine</h3>
                        <div className="min-h-[6rem] bg-black/20 p-3 rounded-lg flex flex-wrap gap-3 items-center">
                            {relics.length > 0 ? relics.map(relic => (
                                <Tooltip key={relic.id} content={<><p className="font-bold">{relic.name}</p><p className="text-xs">{relic.description}</p></>}>
                                    <div className="text-5xl cursor-help">{relic.art}</div>
                                </Tooltip>
                            )) : <p className="text-stone-500 italic">No relics collected yet.</p>}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-silkscreen text-amber-200 mb-3">Game Data</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                             <button onClick={onSave} className="p-3 bg-green-600 hover:bg-green-500 rounded text-sm font-bold transition-colors">Save Game</button>
                             <button onClick={onLoad} disabled={!hasSaveData} className="p-3 bg-sky-600 hover:bg-sky-500 disabled:bg-stone-600 disabled:cursor-not-allowed rounded text-sm font-bold transition-colors">Load Game</button>
                             <button onClick={onDelete} disabled={!hasSaveData} className="p-3 bg-red-600 hover:bg-red-500 disabled:bg-stone-600 disabled:cursor-not-allowed rounded text-sm font-bold transition-colors">Delete Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
