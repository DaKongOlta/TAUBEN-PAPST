import React, { useState, useEffect, useMemo, useRef } from 'react';
import type { BureaucracyRequest } from '../types';
import { playSound } from '../audioManager';

interface BureaucracyMinigameProps {
  requests: BureaucracyRequest[];
  onComplete: (score: number) => void;
}

const MINIGAME_DURATION = 20; // seconds

const shuffle = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export const BureaucracyMinigame: React.FC<BureaucracyMinigameProps> = ({ requests, onComplete }) => {
  const [timeLeft, setTimeLeft] = useState(MINIGAME_DURATION);
  const [score, setScore] = useState(0);
  const [currentRequestIndex, setCurrentRequestIndex] = useState(0);
  const [shuffledRequests] = useState(() => shuffle(requests));
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [stampAnimation, setStampAnimation] = useState<'approve' | 'deny' | null>(null);
  
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => prev - 0.1);
    }, 100);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      onComplete(score);
    }
  }, [timeLeft, onComplete, score]);

  const handleStamp = (action: 'approve' | 'deny') => {
    if (feedback) return; // Prevent spamming

    const currentRequest = shuffledRequests[currentRequestIndex];
    
    setStampAnimation(action);

    if (action === currentRequest.correctAction) {
      playSound('gain', 0.6);
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      playSound('peck', 0.8);
      setFeedback('incorrect');
    }

    setTimeout(() => {
        setFeedback(null);
        setStampAnimation(null);
        setCurrentRequestIndex(i => (i + 1) % shuffledRequests.length);
        playSound('play_card', 0.3);
    }, 500);
  };
  
  const currentRequest = shuffledRequests[currentRequestIndex];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-stone-800 border-4 border-amber-300/50 rounded-lg max-w-2xl w-full p-6 text-center relative overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
            <div>
                <h2 className="text-3xl font-silkscreen text-amber-300">Winged Bureaucracy</h2>
                <p className="text-stone-400">Process the paperwork before the holy timer runs out!</p>
            </div>
            <div className="text-center">
                <div className="text-lg font-bold">SCORE</div>
                <div className="text-4xl font-silkscreen text-amber-200">{score}</div>
            </div>
        </div>

        {/* Timer */}
        <div className="w-full bg-stone-900 rounded-full h-4 border border-stone-600 mb-4">
            <div className="bg-amber-400 h-full rounded-full transition-all duration-100 ease-linear" style={{ width: `${(timeLeft / MINIGAME_DURATION) * 100}%`}}></div>
        </div>
        
        {/* Document */}
        <div className="bg-[#fdf6e3] text-stone-800 p-6 rounded-md min-h-[200px] relative border-2 border-stone-400">
            <h3 className="font-bold font-silkscreen text-xl mb-2">{currentRequest.title}</h3>
            <p className="text-lg">{currentRequest.description}</p>
            {stampAnimation && (
                 <div className={`absolute inset-0 flex items-center justify-center`}>
                    <div className={`text-8xl font-silkscreen font-black border-8 p-4 rounded-full opacity-30 -rotate-12 animate-stamp-slam ${stampAnimation === 'approve' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'}`}>
                        {stampAnimation.toUpperCase()}
                    </div>
                 </div>
            )}
        </div>
        
        {/* Feedback Text */}
        {feedback && (
            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl font-silkscreen font-black animate-feedback-pop ${feedback === 'correct' ? 'text-green-400' : 'text-red-500'}`} style={{textShadow: '2px 2px 4px #000'}}>
                {feedback.toUpperCase()}!
            </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex justify-around gap-4">
            <button onClick={() => handleStamp('deny')} disabled={!!feedback} className="w-1/2 p-4 bg-red-700 hover:bg-red-600 disabled:bg-stone-500 border-4 border-red-900 rounded-lg text-white font-silkscreen text-3xl transition-transform transform hover:scale-105">
                DENY ❌
            </button>
            <button onClick={() => handleStamp('approve')} disabled={!!feedback} className="w-1/2 p-4 bg-green-700 hover:bg-green-600 disabled:bg-stone-500 border-4 border-green-900 rounded-lg text-white font-silkscreen text-3xl transition-transform transform hover:scale-105">
                APPROVE ✔️
            </button>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-8 -left-10 text-8xl opacity-10 pointer-events-none -rotate-12">📜</div>
        <div className="absolute -top-8 -right-10 text-8xl opacity-10 pointer-events-none rotate-12">🖋️</div>

      </div>
    </div>
  );
};