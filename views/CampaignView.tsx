import React from 'react';
import type { Card, RivalSect, Follower, Boss, PlayerStats, PopeCustomization, Relic, LootBox } from '../types';
import { CardComponent } from '../components/CardComponent';
import { PigeonPopeSprite } from '../components/PigeonPopeSprite';
import { FaithIcon, CrumbIcon, PigeonIcon, DivineFavorIcon, BreadCoinIcon, AscensionIcon, LuckIcon, XPIcon } from '../components/icons';
import { MoraleDisplay } from '../components/MoraleDisplay';
import { RivalSectPanel } from '../components/RivalSectPanel';
import { FollowerPigeonSprite } from '../components/FollowerPigeonSprite';
import { Tooltip } from '../components/Tooltip';
import { BossPanel } from '../components/BossPanel';

interface CampaignViewProps {
    faith: number;
    crumbs: number;
    followers: Follower[];
    divineFavor: number;
    morale: number;
    hand: Card[];
    rival: RivalSect;
    activeBoss: Boss | null;
    popeState: 'idle' | 'pecking';
    rivalLastAction: string | null;
    isRivalDefeated: boolean;
    isRevoltActive: boolean;
    revoltSparks: {id: number, x: number, y: number}[];
    onPlayCard: (card: Card) => void;
    breadCoin: number;
    ascensionPoints: number;
    inflation: number;
    playerStats: PlayerStats;
    popeCustomization: PopeCustomization;
    relics: Relic[];
    lootBoxes: LootBox[];
    onOpenLootBox: (id: string) => void;
}

export const CampaignView: React.FC<CampaignViewProps> = (props) => {
    const { faith, crumbs, followers, divineFavor, morale, hand, rival, activeBoss, popeState, rivalLastAction, isRivalDefeated, isRevoltActive, revoltSparks, onPlayCard, breadCoin, ascensionPoints, inflation, playerStats, popeCustomization, relics, lootBoxes, onOpenLootBox } = props;

    const canAfford = (card: Card) => {
        const inflatedCost = Math.ceil(card.cost.amount * inflation);
        if (card.cost.resource === 'Faith') return faith >= inflatedCost;
        if (card.cost.resource === 'Crumbs') return crumbs >= inflatedCost;
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

    const xpPercentage = (playerStats.xp / playerStats.xpToNextLevel) * 100;

    return (
         <div className={`flex flex-col h-full transition-shadow duration-500 ${isRevoltActive ? 'shadow-[inset_0_0_20px_10px_rgba(239,68,68,0.3)]' : ''}`}>
            {/* Top Bar */}
            <header className="flex items-center justify-between p-2 bg-stone-900/80 backdrop-blur-sm border-b-2 border-stone-700 z-20">
                <div className="flex items-center gap-4 flex-wrap">
                    <Tooltip content="Your divine connection. Used for Miracles."><div className="flex items-center gap-2 cursor-help"><FaithIcon className="w-6 h-6 text-amber-300"/> <span>{faith.toFixed(0)}</span></div></Tooltip>
                    <Tooltip content="Sacred sustenance. Used for buildings and rituals."><div className="flex items-center gap-2 cursor-help"><CrumbIcon className="w-6 h-6 text-yellow-600"/> <span>{crumbs.toFixed(0)}</span></div></Tooltip>
                    <Tooltip content="Your loyal congregation."><div className="flex items-center gap-2 cursor-help"><PigeonIcon className="w-6 h-6 text-stone-300"/> <span>{followers.length}</span></div></Tooltip>
                    <Tooltip content="Power to unlock new skills."><div className="flex items-center gap-2 cursor-help"><DivineFavorIcon className="w-6 h-6 text-yellow-300"/> <span>{divineFavor}</span></div></Tooltip>
                    <Tooltip content="A volatile, decentralized crumb-based currency."><div className="flex items-center gap-2 cursor-help"><BreadCoinIcon className="w-6 h-6 text-orange-400"/> <span>{breadCoin.toFixed(2)}</span></div></Tooltip>
                    <Tooltip content="Meta-currency for powerful upgrades after Ascension."><div className="flex items-center gap-2 cursor-help"><AscensionIcon className="w-6 h-6 text-purple-400"/> <span>{ascensionPoints}</span></div></Tooltip>
                    <Tooltip content={`Increases chances for fortunate outcomes. Current Luck: ${playerStats.luck}`}><div className="flex items-center gap-2 cursor-help"><LuckIcon className="w-6 h-6 text-green-400"/> <span>{playerStats.luck}</span></div></Tooltip>
                </div>
                <Tooltip content="The flock's happiness. Low morale can cause revolts."><div className="cursor-help"><MoraleDisplay morale={morale} /></div></Tooltip>
            </header>

            {/* XP Bar */}
            <div className="w-full bg-black/20 relative h-6 z-20">
                <div className="absolute top-0 left-2 text-sm z-10 font-bold flex items-center h-full">
                    <span className="bg-black/50 px-2 rounded">LVL {playerStats.level}</span>
                </div>
                 <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${xpPercentage}%` }}></div>
                 <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white" style={{textShadow: '1px 1px 2px #000'}}>
                     XP: {playerStats.xp.toFixed(0)} / {playerStats.xpToNextLevel}
                 </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow flex relative overflow-hidden campaign-bg">
                {activeBoss && <BossPanel boss={activeBoss} />}
                <div className="w-1/4 p-4 z-10 flex flex-col gap-4">
                    {!activeBoss && <RivalSectPanel rival={rival} lastAction={rivalLastAction} isDefeated={isRivalDefeated}/>}
                    {relics.length > 0 && (
                        <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-700">
                             <h4 className="font-silkscreen text-amber-200 text-center mb-2">Relics</h4>
                             <div className="flex flex-wrap justify-center gap-2">
                                {relics.map(relic => (
                                    <Tooltip key={relic.id} content={<><p className="font-bold">{relic.name}</p><p className="text-xs">{relic.description}</p></>} position="top">
                                        <div className="text-4xl cursor-help bg-black/20 p-1 rounded-md">{relic.art}</div>
                                    </Tooltip>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
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
                    <PigeonPopeSprite state={popeState} hatColor={popeCustomization.hatColor} />
                    <h2 className="font-silkscreen text-2xl text-amber-200 z-10" style={{textShadow: '1px 1px 3px #000'}}>The Pigeon Pope</h2>
                </div>
                <div className="w-1/4 p-4 z-10">
                    {lootBoxes.length > 0 && (
                        <div className="bg-stone-900/50 p-3 rounded-lg border border-stone-700">
                             <h4 className="font-silkscreen text-amber-200 text-center mb-2">Inventory</h4>
                             <div className="flex flex-wrap justify-center gap-2">
                                {lootBoxes.map((box, i) => (
                                    <Tooltip key={`${box.id}-${i}`} content={<><p className="font-bold">{box.name}</p><p className="text-xs">{box.description}</p></>} position="top">
                                        <button onClick={() => onOpenLootBox(box.id)} className="text-4xl cursor-pointer bg-black/20 p-1 rounded-md animate-loot-box-shimmer hover:animate-none">{box.art}</button>
                                    </Tooltip>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
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