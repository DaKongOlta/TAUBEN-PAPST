import React, { useState, useEffect } from 'react';
import type { RivalSect } from '../types';
import { FaithIcon, HeresyIcon } from './icons';
import { RivalPopeSprite } from './RivalPopeSprite';
import { Tooltip } from './Tooltip';

interface RivalSectPanelProps {
  rival: RivalSect;
  lastAction: string | null;
  isDefeated: boolean;
}

export const RivalSectPanel: React.FC<RivalSectPanelProps> = ({ rival, lastAction, isDefeated }) => {
  const [displayAction, setDisplayAction] = useState<string | null>(null);
  const [isAttacking, setIsAttacking] = useState(false);

  useEffect(() => {
    if (lastAction) {
      setDisplayAction(lastAction.split('-')[0]); // Remove timestamp for display
      setIsAttacking(true);
      
      const displayTimer = setTimeout(() => setDisplayAction(null), 2000); // Display action for 2 seconds
      const attackTimer = setTimeout(() => setIsAttacking(false), 500); // attack animation duration
      
      return () => {
          clearTimeout(displayTimer);
          clearTimeout(attackTimer);
      };
    }
  }, [lastAction]);

  const animationState = isDefeated ? 'defeat' : isAttacking ? 'attack' : 'idle';

  return (
    <div className="bg-red-900/30 border-2 border-red-500/50 rounded-lg p-4 relative overflow-hidden">
        <div className="flex items-center gap-3">
            <RivalPopeSprite state={animationState} />
            <div>
                <h3 className="text-xl font-silkscreen text-red-300">Rival Sect!</h3>
                <h4 className="font-bold text-lg text-red-200">{rival.name}</h4>
            </div>
        </div>
        <div className="mt-3 space-y-1 text-sm">
            <Tooltip content="The rival sect's strength. Reduce this to zero to defeat them." widthClass="w-52" position="right">
                <div className="flex items-center justify-between bg-black/20 p-1 rounded cursor-help">
                    <span className="flex items-center gap-1 font-bold"><FaithIcon className="w-4 h-4 text-red-400"/> Faith</span>
                    <span>{rival.faith.toFixed(0)}</span>
                </div>
            </Tooltip>
             <Tooltip content="The rate at which the rival sect spreads dissent, reducing your flock's morale." widthClass="w-56" position="right">
                <div className="flex items-center justify-between bg-black/20 p-1 rounded cursor-help">
                    <span className="flex items-center gap-1 font-bold"><HeresyIcon className="w-4 h-4"/> Heresy Rate</span>
                    <span>{rival.heresyPerSecond.toFixed(1)}/s</span>
                </div>
            </Tooltip>
        </div>
        <div className="mt-3">
          <h5 className="text-center text-xs text-red-300/70 font-bold">HAND</h5>
          <div className="flex justify-center items-center gap-1 h-10">
            {rival.hand.map((card, i) => (
                <div key={i} className="w-6 h-9 bg-red-900/80 border border-red-500/50 rounded-sm" title="Rival Card"></div>
            ))}
          </div>
        </div>

        {/* Action Display */}
        {displayAction && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-2 animate-fade-out">
              <p className="text-center font-bold text-white text-lg">{displayAction}</p>
          </div>
        )}
        <style>{`
            @keyframes fade-out {
                0% { opacity: 1; transform: scale(1); }
                80% { opacity: 1; transform: scale(1); }
                100% { opacity: 0; transform: scale(0.9); }
            }
            .animate-fade-out {
                animation: fade-out 2s ease-in-out forwards;
            }
        `}</style>
    </div>
  );
};