// components/BreadfallItemSprite.tsx
import React from 'react';
import type { FallingItem } from '../types';

interface BreadfallItemSpriteProps {
  item: FallingItem;
}

const itemArt: Record<FallingItem['type'], string> = {
    crumb: '🍞',
    golden_crumb: '🌟',
    anvil: '🧱',
};

export const BreadfallItemSprite: React.FC<BreadfallItemSpriteProps> = ({ item }) => {
    const style: React.CSSProperties = {
        left: `${item.x}%`,
        transform: `translate(-50%, ${item.y}px) rotate(${item.rotation}deg)`,
    };

    return (
        <div className="breadfall-item" style={style}>
            {itemArt[item.type]}
        </div>
    );
};
