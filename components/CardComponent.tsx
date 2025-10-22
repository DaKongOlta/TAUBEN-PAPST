

import React, { useRef } from 'react';
import type { Card } from '../types';
import { ResourceType } from '../types';
import { FaithIcon, CrumbIcon } from './icons';
import { Tooltip } from './Tooltip';

interface CardComponentProps {
  card: Card;
  onPlay: (card: Card, element: HTMLDivElement) => void;
  canAfford: boolean;
  isAnimatingOut?: boolean;
  isDrawingIn?: boolean;
}

const cardTypeStyles: { [key in Card['type']]: string } = {
  Miracle: 'bg-amber-200 border-amber-400 text-amber-900',
  Propaganda: 'bg-sky-200 border-sky-400 text-sky-900',
  Ritual: 'bg-purple-200 border-purple-400 text-purple-900',
  Conflict: 'bg-red-200 border-red-400 text-red-900',
};

export const CardComponent: React.FC<CardComponentProps> = ({ card, onPlay, canAfford, isAnimatingOut, isDrawingIn }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const baseStyle = 'w-48 h-64 rounded-lg border-4 p-3 flex flex-col justify-between transition-all duration-200';
  const disabledStyle = 'opacity-50 cursor-not-allowed';
  const enabledStyle = 'hover:scale-105 hover:-translate-y-2 cursor-pointer shadow-lg hover:shadow-xl hover:shadow-amber-500/20';

  return (
    <div
      ref={cardRef}
      className={`${baseStyle} ${cardTypeStyles[card.type]} ${canAfford && !isAnimatingOut ? enabledStyle : disabledStyle} ${isAnimatingOut ? 'animate-play-card' : ''} ${isDrawingIn ? 'animate-draw-card' : ''}`}
      onClick={() => canAfford && !isAnimatingOut && cardRef.current && onPlay(card, cardRef.current)}
    >
      <div>
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg leading-tight font-silkscreen">{card.name}</h3>
          <div className="text-4xl">{card.art}</div>
        </div>
        <p className="text-sm italic mt-1 bg-black/5 px-1 rounded">{card.type}</p>
      </div>

      <p className="text-sm my-2 flex-grow">{card.description}</p>

      <div className="text-center font-bold text-md border-t-2 border-black/20 pt-2">
        {card.cost.amount > 0 ? (
          <Tooltip content={`This card costs ${card.cost.amount} ${card.cost.resource}.`} widthClass="w-auto px-2 py-1" position="top">
            <div className="flex items-center justify-center gap-1 cursor-help">
              <span>{card.cost.amount}</span>
              {card.cost.resource === ResourceType.Faith ? (
                <FaithIcon className="w-5 h-5" />
              ) : (
                <CrumbIcon className="w-5 h-5" />
              )}
            </div>
          </Tooltip>
        ) : (
          'Free'
        )}
      </div>
    </div>
  );
};