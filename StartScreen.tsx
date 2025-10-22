import React, { useEffect } from 'react';
import { PigeonPopeSprite } from './PigeonPopeSprite';
import { playMusic } from '../audioManager';


interface StartScreenProps {
    onNewGame: () => void;
    onContinue: () => void;
    hasSaveData: boolean;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onNewGame, onContinue, hasSaveData }) => {

    useEffect(() => {
        playMusic('music_theme', 0.3, true);
    }, []);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white">
            <div className="start-screen-bg">
                <div className="parallax-layer parallax-clouds"></div>
                 <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className="shimmering-light" style={{ left: '20%', top: '30%', width: '150px', height: '150px', animationDuration: '8s' }}/>
                    <div className="shimmering-light" style={{ left: '80%', top: '50%', width: '100px', height: '100px', animationDuration: '12s', animationDelay: '3s' }}/>
                 </div>
            </div>
            <div className="relative z-10 text-center animate-fade-in-subtle">
                <div className="scale-150">
                    <PigeonPopeSprite state="idle" />
                </div>
                <h1 className="text-7xl lg:text-8xl font-silkscreen text-amber-200 mt-[-2rem] animate-title-glow">
                    Der Papst der Tauben
                </h1>
                <p className="text-xl text-stone-300 mt-2" style={{textShadow: '2px 2px 4px #000'}}>The Pigeon Pope</p>

                <div className="mt-12 space-y-4 flex flex-col items-center">
                    <button 
                        onClick={onNewGame}
                        className="start-menu-button font-silkscreen text-2xl bg-amber-500/80 text-white py-3 px-10 rounded-lg border-2 border-amber-300/50 w-72"
                    >
                        New Migration
                    </button>
                    <button 
                        onClick={onContinue}
                        disabled={!hasSaveData}
                        className="start-menu-button font-silkscreen text-2xl bg-stone-700/80 text-white py-3 px-10 rounded-lg border-2 border-stone-500/50 w-72 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};
