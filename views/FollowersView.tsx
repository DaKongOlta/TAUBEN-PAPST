import React from 'react';
import type { Follower, FollowerAnimationState, FollowerPersonality } from '../types';
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

const PersonalityIndicator: React.FC<{ personality: FollowerPersonality }> = ({ personality }) => {
    const styles: Record<FollowerPersonality, { text: string; icon: string; className: string }> = {
        Standard: { text: 'Standard', icon: '🐦', className: 'bg-stone-600' },
        Devout: { text: 'Devout', icon: '🙏', className: 'bg-amber-600' },
        Lazy: { text: 'Lazy', icon: '😴', className: 'bg-sky-600' },
        Rebel: { text: 'Rebel', icon: '🔥', className: 'bg-red-600' },
    };
    const style = styles[personality];

    return (
        <div className={`inline-block px-2 py-1 text-xs font-bold rounded-full text-white ${style.className}`}>
            {style.icon} {style.text}
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
                    emotions: { ...f.emotions, joy: Math.min(100, f.emotions.joy + 20) },
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
                        <div className="flex justify-between items-center">
                            <h3 className="font-bold text-lg font-silkscreen text-amber-200">{follower.name}</h3>
                            <PersonalityIndicator personality={follower.personality} />
                        </div>
                        
                        <div className="text-center text-xs text-stone-400">
                            Joy: {follower.emotions.joy.toFixed(0)} | Fear: {follower.emotions.fear.toFixed(0)}
                        </div>

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