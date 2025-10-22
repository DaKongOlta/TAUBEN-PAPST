import React from 'react';

interface LoreItem {
    name: string;
    art: string;
    description: string;
    type?: string;
}

interface LoreCardProps {
  item: LoreItem;
  locked?: boolean;
}

export const LoreCard: React.FC<LoreCardProps> = ({ item, locked = false }) => {
    const name = locked ? '??????????' : item.name;
    const description = locked ? 'Unlock this by performing the Great Migration.' : item.description;
    const art = locked ? '❓' : item.art;
    const type = locked ? 'Locked' : item.type;

    return (
        <div className={`p-4 rounded-lg bg-stone-900/60 border border-stone-700 flex gap-4 items-start ${locked ? 'opacity-60' : ''}`}>
            <div className="text-5xl flex-shrink-0 pt-1">{art}</div>
            <div>
                <h4 className="font-bold text-lg font-silkscreen text-amber-200">{name}</h4>
                {type && <p className="text-xs italic text-stone-400 bg-black/20 px-1 rounded inline-block mb-1">{type}</p>}
                <p className="text-sm text-stone-300">{description}</p>
            </div>
        </div>
    );
};