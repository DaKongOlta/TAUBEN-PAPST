// views/BreadfallMinigameView.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { FallingItem, FallingItemType } from '../types';
import { BreadfallPlayerSprite } from '../components/BreadfallPlayerSprite';
import { BreadfallItemSprite } from '../components/BreadfallItemSprite';
import { playSound } from '../audioManager';

interface BreadfallMinigameViewProps {
  onComplete: (score: number) => void;
}

const GAME_DURATION = 30; // seconds
const PLAYER_WIDTH = 120;
const ITEM_WIDTH = 40;

const ITEM_CONFIG: Record<FallingItemType, { speed: number; score: number }> = {
    crumb: { speed: 3, score: 10 },
    golden_crumb: { speed: 4, score: 100 },
    anvil: { speed: 5, score: -50 },
};

export const BreadfallMinigameView: React.FC<BreadfallMinigameViewProps> = ({ onComplete }) => {
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [items, setItems] = useState<FallingItem[]>([]);
  const [playerX, setPlayerX] = useState(50); // Player position in percentage
  const [isHit, setIsHit] = useState(false);

  const gameAreaRef = useRef<HTMLDivElement>(null);
  const gameLoopRef = useRef<number>();
  const lastItemSpawn = useRef(Date.now());

  // Countdown effect
  useEffect(() => {
    if (gameState === 'countdown') {
      if (countdown > 0) {
        playSound('ui_click', 0.5);
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setGameState('playing');
      }
    }
  }, [gameState, countdown]);

  // Game timer effect
  useEffect(() => {
    if (gameState === 'playing') {
      const timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('finished');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [gameState]);

  const gameLoop = useCallback(() => {
    if (gameState !== 'playing') return;

    setItems(prevItems => {
        const newItems: FallingItem[] = [];
        const gameArea = gameAreaRef.current;
        if (!gameArea) return prevItems;
        
        const playerRect = {
            left: (playerX / 100) * gameArea.clientWidth - PLAYER_WIDTH / 2,
            right: (playerX / 100) * gameArea.clientWidth + PLAYER_WIDTH / 2,
            bottom: gameArea.clientHeight,
            top: gameArea.clientHeight - 100,
        };

        for (const item of prevItems) {
            const newItem = { ...item, y: item.y + ITEM_CONFIG[item.type].speed };

            // Collision check
            const itemRect = {
                left: (newItem.x / 100) * gameArea.clientWidth - ITEM_WIDTH / 2,
                right: (newItem.x / 100) * gameArea.clientWidth + ITEM_WIDTH / 2,
                top: newItem.y,
                bottom: newItem.y + ITEM_WIDTH,
            };
            
            if (
                itemRect.left < playerRect.right &&
                itemRect.right > playerRect.left &&
                itemRect.top < playerRect.bottom &&
                itemRect.bottom > playerRect.top
            ) {
                const config = ITEM_CONFIG[item.type];
                setScore(s => s + config.score);
                if (item.type === 'anvil') {
                    playSound('error', 0.8);
                    setIsHit(true);
                    setTimeout(() => setIsHit(false), 300);
                } else {
                    playSound('gain', 0.5);
                }
                continue; // Skip adding item to newItems array (it's "collected")
            }

            if (newItem.y < gameArea.clientHeight + 50) {
                newItems.push(newItem);
            }
        }
        return newItems;
    });

    // Spawn new items
    if (Date.now() - lastItemSpawn.current > 500) {
        lastItemSpawn.current = Date.now();
        const rand = Math.random();
        let type: FallingItemType;
        if (rand < 0.1) type = 'anvil';
        else if (rand < 0.2) type = 'golden_crumb';
        else type = 'crumb';
        
        setItems(prev => [...prev, {
            id: Date.now() + Math.random(),
            type,
            x: Math.random() * 90 + 5, // 5% to 95% width
            y: -50,
            rotation: Math.random() * 360,
        }]);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameState, playerX]);

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current);
    };
  }, [gameState, gameLoop]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (gameState !== 'playing' || !gameAreaRef.current) return;
    const rect = gameAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentageX = (x / rect.width) * 100;
    setPlayerX(Math.max(5, Math.min(95, percentageX))); // Clamp between 5% and 95%
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white bg-sky-400">
      <div 
        ref={gameAreaRef} 
        onMouseMove={handleMouseMove} 
        className={`w-full h-full relative overflow-hidden breadfall-bg ${isHit ? 'animate-player-hit-flash' : ''}`}
      >
        {gameState === 'playing' || gameState === 'finished' ? (
          <>
            {/* HUD */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center bg-black/30 p-4 rounded-lg">
                <div className="text-3xl font-silkscreen">Score: <span className="text-amber-300">{score}</span></div>
                <div className="text-3xl font-silkscreen">Time: <span className="text-amber-300">{timeLeft}</span></div>
            </div>
            
            {/* Player */}
            <BreadfallPlayerSprite style={{ left: `${playerX}%`, transform: `translateX(-50%)` }} />
            
            {/* Items */}
            {items.map(item => <BreadfallItemSprite key={item.id} item={item} />)}
          </>
        ) : null}

        {gameState === 'countdown' && (
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-9xl font-silkscreen text-white animate-countdown-pop" style={{textShadow: '5px 5px 10px #000'}}>
                    {countdown > 0 ? countdown : 'GO!'}
                </div>
             </div>
        )}

        {gameState === 'finished' && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center z-30 animate-fade-in">
                <h2 className="text-6xl font-silkscreen text-amber-300 mb-4">Time's Up!</h2>
                <p className="text-3xl mb-2">Final Score</p>
                <p className="text-8xl font-silkscreen text-amber-300 mb-8">{score}</p>
                <p className="text-xl mb-4">You earned <span className="font-bold text-yellow-400">{Math.floor(score/2)} Crumbs</span>!</p>
                <button 
                    onClick={() => onComplete(score)}
                    className="px-8 py-4 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg text-xl"
                >
                    Return to Roost
                </button>
            </div>
        )}
      </div>
    </div>
  );
};
