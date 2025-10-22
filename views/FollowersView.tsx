import React from 'react';
import type { Follower, FollowerAnimationState } from '../types';
import { playSound } from '../audioManager';

interface FollowersViewProps {
  followers: Follower[];
  setFollowers: React.Dispatch<React.SetStateAction<Follower[]>>;
}

const StatBar: React.FC<{ value: number; color: string; label: string }> = ({ value, color, label }) => (
    <div>
        <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-stone-300">{label}</span>
            <span>{value.toFixed(0)}/100</span>
        </div>
        <div className="stat-bar bg-stone-700">
            <div className="stat-bar-inner" style={{ width: `${value}%`, backgroundColor: color }}></div>
        </div>
    </div>
);

const FollowerActionIndicator: React.FC<{ state: FollowerAnimationState }> = ({ state }) => {
    const actions: Record<FollowerAnimationState, { text: string; icon: string; className: string }> = {
        idle: { text: 'Idle', icon: '💤', className: 'text-stone-400' },
        pecking: { text: 'Eating', icon: '🍞', className: 'text-yellow-500' },
        looking: { text: 'Socializing', icon: '💬', className: 'text-sky-400' },
        flapping: { text: 'Praying', icon: '🙏', className: 'text-amber-300' },
        chaotic: { text: 'Rioting!', icon: '🔥', className: 'text-red-500 font-bold animate-pulse' },
    };

    const action = actions[state] || actions.idle;

    return (
        <div className={`p-1 text-center rounded bg-stone-900/50 my-2 ${action.className}`}>
            <span className="text-sm font-semibold">{action.icon} {action.text}</span>
        </div>
    );
};


export const FollowersView: React.FC<FollowersViewProps> = ({ followers, setFollowers }) => {

    const handlePraise = (followerId: string) => {
        playSound('gain');
        setFollowers(current => current.map(f => {
            if (f.id === followerId) {
                return {
                    ...f,
                    devotion: Math.min(100, f.devotion + 10),
                    loyalty: Math.min(100, f.loyalty + 5),
                };
            }
            return f;
        }));
    };

    const handleExcommunicate = (followerId: string) => {
        playSound('error');
        setFollowers(current => current.filter(f => f.id !== followerId));
    };

    return (
        <div className="p-6 h-full overflow-y-auto">
            <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">Manage Flock</h2>
            <p className="text-stone-400 mb-6">Oversee your loyal (and not-so-loyal) followers. Praise them to increase their stats, or excommunicate the heretics.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {followers.map(follower => (
                    <div key={follower.id} className="bg-stone-800/50 p-4 rounded-lg border border-stone-700 flex flex-col gap-3">
                        <h3 className="font-bold text-lg font-silkscreen text-amber-200 text-center">{follower.name}</h3>
                        
                        <FollowerActionIndicator state={follower.animationState} />

                        <div className="space-y-3">
                            <StatBar value={follower.devotion} color="#fde047" label="Devotion" />
                            <StatBar value={follower.loyalty} color="#60a5fa" label="Loyalty" />
                            <StatBar value={follower.productivity * 100} color="#4ade80" label="Productivity" />
                            <StatBar value={follower.chaosIndex} color="#f87171" label="Chaos Index" />
                        </div>
                        <div className="flex gap-2 mt-auto">
                            <button onClick={() => handlePraise(follower.id)} className="flex-1 p-2 bg-green-600 hover:bg-green-500 rounded text-sm font-bold transition-colors">Praise</button>
                            <button onClick={() => handleExcommunicate(follower.id)} className="flex-1 p-2 bg-red-600 hover:bg-red-500 rounded text-sm font-bold transition-colors">Excommunicate</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
