import React from 'react';
import type { Card, RivalSect, Follower } from '../types';
import { CardComponent } from '../components/CardComponent';
import { PigeonPopeSprite } from '../components/PigeonPopeSprite';
import { FaithIcon, CrumbIcon, PigeonIcon, DivineFavorIcon } from '../components/icons';
import { MoraleDisplay } from '../components/MoraleDisplay';
import { RivalSectPanel } from '../components/RivalSectPanel';
import { FollowerPigeonSprite } from '../components/FollowerPigeonSprite';
import { Tooltip } from '../components/Tooltip';

interface CampaignViewProps {
    faith: number;
    crumbs: number;
    followers: Follower[];
    divineFavor: number;
    morale: number;
    hand: Card[];
    rival: RivalSect;
    popeState: 'idle' | 'pecking';
    rivalLastAction: string | null;
    isRivalDefeated: boolean;
    isRevoltActive: boolean;
    revoltSparks: {id: number, x: number, y: number}[];
    onPlayCard: (card: Card) => void;
}

export const CampaignView: React.FC<CampaignViewProps> = (props) => {
    const { faith, crumbs, followers, divineFavor, morale, hand, rival, popeState, rivalLastAction, isRivalDefeated, isRevoltActive, revoltSparks, onPlayCard } = props;

    const canAfford = (card: Card) => {
        if (card.cost.resource === 'Faith') return faith >= card.cost.amount;
        if (card.cost.resource === 'Crumbs') return crumbs >= card.cost.amount;
        return false;
    };

    const followerPositions = [
        { top: '30%', left: '10%' }, { top: '35%', left: '80%' },
        { top: '60%', left: '5%' }, { top: '65%', left: '85%' },
        { top: '40%', left: '25%' }, { top: '45%', left: '65%' },
        { top: '70%', left: '20%' }, { top: '75%', left: '70%' },
        { top: '25%', left: '45%' }, { top: '80%', left: '40%' },
        { top: '50%', left: '0%' }, { top: '55%', left: '90%' },
    ];

    return (
         <div className={`flex flex-col h-full transition-shadow duration-500 ${isRevoltActive ? 'shadow-[inset_0_0_20px_10px_rgba(239,68,68,0.3)]' : ''}`}>
            {/* Top Bar */}
            <header className="flex items-center justify-between p-2 bg-stone-900/80 backdrop-blur-sm border-b-2 border-stone-700 z-20">
                <div className="flex items-center gap-4">
                    <Tooltip content="Your divine connection. Used for Miracles."><div className="flex items-center gap-2 cursor-help"><FaithIcon className="w-6 h-6 text-amber-300"/> <span>{faith.toFixed(0)}</span></div></Tooltip>
                    <Tooltip content="Sacred sustenance. Used for buildings and rituals."><div className="flex items-center gap-2 cursor-help"><CrumbIcon className="w-6 h-6 text-yellow-600"/> <span>{crumbs.toFixed(0)}</span></div></Tooltip>
                    <Tooltip content="Your loyal congregation."><div className="flex items-center gap-2 cursor-help"><PigeonIcon className="w-6 h-6 text-stone-300"/> <span>{followers.length}</span></div></Tooltip>
                    <Tooltip content="Power to unlock new skills."><div className="flex items-center gap-2 cursor-help"><DivineFavorIcon className="w-6 h-6 text-yellow-300"/> <span>{divineFavor}</span></div></Tooltip>
                </div>
                <Tooltip content="The flock's happiness. Low morale can cause revolts."><div className="cursor-help"><MoraleDisplay morale={morale} /></div></Tooltip>
            </header>

            {/* Main Content */}
            <div className="flex-grow flex relative overflow-hidden">
                <div className="w-1/4 p-4"><RivalSectPanel rival={rival} lastAction={rivalLastAction} isDefeated={isRivalDefeated}/></div>
                <div className="w-1/2 flex flex-col items-center justify-center relative">
                    <div className="absolute inset-0 pointer-events-none">
                        {followers.map((follower, i) => {
                            const pos = followerPositions[i % followerPositions.length];
                            const style = { top: pos.top, left: pos.left, '--anim-delay': `${(i * 0.3) % 2}s` } as React.CSSProperties;
                            return <div key={follower.id} className="absolute" style={style}><FollowerPigeonSprite animationState={follower.animationState} /></div>;
                        })}
                    </div>
                    <div className="absolute inset-0 pointer-events-none z-30">
                        {revoltSparks.map(spark => <div key={spark.id} className="revolt-spark" style={{ top: `${spark.y}%`, left: `${spark.x}%` }}/>)}
                    </div>
                    <PigeonPopeSprite state={popeState} />
                    <h2 className="font-silkscreen text-2xl text-amber-200 z-10" style={{textShadow: '1px 1px 3px #000'}}>The Pigeon Pope</h2>
                </div>
                <div className="w-1/4 p-4"></div>
            </div>
            
            {/* Hand */}
            <footer className="p-4 flex justify-center items-end gap-4 bg-gradient-to-t from-stone-950 to-transparent z-10 min-h-[20rem]">
                {hand.map((card, index) => (
                    <CardComponent key={`${card.id}-${index}`} card={card} onPlay={onPlayCard} canAfford={canAfford(card)} />
                ))}
            </footer>
        </div>
    );
};
