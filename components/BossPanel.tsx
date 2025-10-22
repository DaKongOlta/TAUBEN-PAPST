import React from 'react';
import type { Boss } from '../types';
import { FaithIcon, HeresyIcon } from './icons';
import { Tooltip } from './Tooltip';

interface BossPanelProps {
  boss: Boss;
}

export const BossPanel: React.FC<BossPanelProps> = ({ boss }) => {
  return (
    <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-[48rem] bg-red-900/50 backdrop-blur-sm p-4 rounded-lg border-4 border-red-500/80 animate-fade-in-down shadow-2xl shadow-red-500/20">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="text-6xl">{boss.art}</div>
                <div>
                    <h2 className="text-3xl font-silkscreen text-red-200">{boss.name}</h2>
                    <h3 className="text-md text-red-300">BOSS FIGHT!</h3>
                </div>
            </div>
            <div className="flex flex-col gap-2 text-right">
                <div className="flex items-center gap-2 text-xl font-bold">
                    <FaithIcon className="w-6 h-6 text-red-300"/>
                    <span>{boss.faith.toFixed(0)}</span>
                </div>
                 <div className="flex items-center gap-2 text-sm">
                    <HeresyIcon className="w-4 h-4 text-stone-300"/>
                    <span>{boss.heresyPerSecond.toFixed(1)}/s</span>
                </div>
            </div>
        </div>
        <div className="mt-2 text-center">
            <h4 className="text-sm font-bold text-red-200/80">SPECIAL ABILITIES</h4>
            <div className="flex justify-center gap-4 text-xs mt-1">
                {boss.specialAbilities.map(ability => (
                    <Tooltip key={ability.id} content={ability.description} position="bottom">
                        <span className="bg-black/30 px-2 py-1 rounded cursor-help">{ability.name}</span>
                    </Tooltip>
                ))}
            </div>
        </div>
    </div>
  );
};
