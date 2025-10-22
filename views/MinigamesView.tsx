import React from 'react';

interface MinigameCardProps { 
    title: string; 
    description: string; 
    art: string; 
    onPlay?: () => void;
    comingSoon?: boolean;
}

const MinigameCard: React.FC<MinigameCardProps> = ({ title, description, art, onPlay, comingSoon = true }) => (
    <div className="bg-stone-800/50 p-6 rounded-lg border border-stone-700 flex flex-col items-center text-center gap-3 relative overflow-hidden">
        {comingSoon && (
            <div className="absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-red-600 text-white rounded-full">
                COMING SOON
            </div>
        )}
        <div className="text-6xl">{art}</div>
        <h3 className="font-bold text-2xl font-silkscreen text-amber-200">{title}</h3>
        <p className="text-stone-400 text-sm flex-grow">{description}</p>
        <button 
            onClick={onPlay}
            disabled={comingSoon} 
            className="w-full mt-auto p-3 bg-green-600 hover:bg-green-500 disabled:bg-stone-600 disabled:cursor-not-allowed rounded-lg text-white font-silkscreen text-md transition-colors"
        >
            Play
        </button>
    </div>
);

interface MinigamesViewProps {
  onStartMinigame: (name: string) => void;
}

export const MinigamesView: React.FC<MinigamesViewProps> = ({ onStartMinigame }) => {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">Minigames</h2>
      <p className="text-stone-400 mb-6">Engage in various activities to earn rewards and prove your flock's dominance.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <MinigameCard 
            title="Breadfall"
            description="Manage falling crumbs in a fast-paced, arcade-style challenge."
            art="🍞"
            onPlay={() => onStartMinigame('breadfall')}
            comingSoon={false}
        />
         <MinigameCard 
            title="Seagull Defense"
            description="Defend your roost from waves of aggressive seagull attackers."
            art="🛡️"
        />
         <MinigameCard 
            title="Faith Rhythm"
            description="Tap to the beat of holy hymns to generate a massive boost of Faith."
            art="🎶"
        />
         <MinigameCard 
            title="Pigeon Racing"
            description="Train your fastest pigeon and compete for glory and prizes."
            art="🏁"
        />
      </div>
    </div>
  );
};