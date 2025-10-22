import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { CardComponent } from './components/CardComponent';
import { EventModal } from './components/EventModal';
import { WeatherDisplay } from './components/WeatherDisplay';
import { RivalSectPanel } from './components/RivalSectPanel';
import { LoreCard } from './components/LoreCard';
import { PigeonPopeSprite } from './components/PigeonPopeSprite';
import { FollowerPigeonSprite } from './components/FollowerPigeonSprite';
import { QuestTracker } from './components/QuestTracker';
import { MoraleDisplay } from './components/MoraleDisplay';
import { FaithOscillator } from './components/FaithOscillator';
import { BureaucracyMinigame } from './components/BureaucracyMinigame';
import { StartScreen } from './components/StartScreen';
import { IntroSequence } from './components/IntroSequence';
import { FaithIcon, CrumbIcon, DivineFavorIcon, PigeonIcon, HeresyIcon } from './components/icons';
import type { Card, Upgrade, MetaUpgrade, TemporaryEffect, GameEvent, EventChoice, RivalSect, Relic, ActiveWeatherEvent, Quest, Follower, FollowerAnimationState } from './types';
import { ResourceType, EffectType, WeatherType, QuestObjectiveType } from './types';
import { INITIAL_CARDS, UPGRADES, META_UPGRADES, MAX_HAND_SIZE, FOLLOWER_FAITH_PER_SECOND, RIVAL_SECTS_DATA, RELICS, RIVAL_CARDS, BUREAUCRACY_REQUESTS } from './constants';
import { GAME_EVENTS } from './events';
import { WEATHER_EVENTS } from './weather';
import { QUESTS } from './quests';
import { playSound, preloadSounds, playMusic, stopMusic } from './audioManager';

const shuffle = <T,>(array: T[]): T[] => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

const prepareDraw = (amount: number, currentHand: Card[], currentDeck: Card[], currentDiscard: Card[]): { cardsToDraw: Card[], newDeck: Card[], newDiscard: Card[] } => {
    let cardsToDraw: Card[] = [];
    let newDeck = [...currentDeck];
    let newDiscard = [...currentDiscard];

    for (let i = 0; i < amount; i++) {
        if (currentHand.length + cardsToDraw.length >= MAX_HAND_SIZE) break;

        if (newDeck.length === 0) {
            if (newDiscard.length === 0) break;
            newDeck = shuffle([...newDiscard]);
            newDiscard = [];
        }

        const [nextCard, ...remainingDeck] = newDeck;
        cardsToDraw.push(nextCard);
        newDeck = remainingDeck;
    }
    return { cardsToDraw, newDeck, newDiscard };
}

type TimeOfDay = 'day' | 'sunset' | 'night' | 'dawn';
type GameState = 'startScreen' | 'intro' | 'playing' | 'loading';

const SAVE_KEY = 'pigeonPopeSaveData';
const GAME_VERSION = '1.0.7'; // Increment to invalidate old saves

// This is now a pure function to be used by both the game loop and the loading logic
const calculateRunBonuses = (metaUpgrades: MetaUpgrade[], activeRelic: Relic | null) => {
    const bonuses = {
        startFaith: metaUpgrades.find(u => u.id === 'meta-001')!.level * 50,
        startCrumbs: metaUpgrades.find(u => u.id === 'meta-002')!.level * 25,
        baseFps: metaUpgrades.find(u => u.id === 'meta-003')!.level * 0.5,
        crumbMultiplier: 1,
        initialDraw: 0,
    };

    if (activeRelic) {
        if (activeRelic.effect.type === EffectType.STARTING_CRUMBS) {
            bonuses.startCrumbs += activeRelic.effect.value;
        }
        if (activeRelic.effect.type === EffectType.BASE_FPS_ADD) {
            bonuses.baseFps += activeRelic.effect.value;
        }
        if (activeRelic.effect.type === EffectType.CRUMB_GAIN_MULTIPLIER) {
            bonuses.crumbMultiplier += activeRelic.effect.value;
        }
        if (activeRelic.effect.type === EffectType.DRAW_CARDS) {
            bonuses.initialDraw += activeRelic.effect.value;
        }
    }
    return bonuses;
};

/**
 * Processes a single turn for the Rival AI.
 * This function is pure and returns the new state and side effects.
 */
const runRivalTurn = (
    currentRival: RivalSect, 
    playerState: { faith: number; crumbs: number; followerCount: number; heresy: number },
    faithGainMultiplier: number
) => {
    // 1. Gain Resources
    let updatedRival = { ...currentRival, faith: currentRival.faith + (5 * faithGainMultiplier) };

    // 2. AI Decides which card to play
    const playableCards = updatedRival.hand.filter(c => updatedRival.faith >= c.cost.amount);
    if (playableCards.length === 0) {
        return { updatedRival, playerEffects: [], action: null }; // Can't play anything, just gained faith
    }

    const { faith, crumbs, followerCount, heresy } = playerState;
    const scoredCards = playableCards.map(card => {
        let score = 10;
        const heresyPressure = Math.max(1, 60 - heresy);

        switch(card.effect.type) {
            case EffectType.STEAL_FOLLOWERS: score += followerCount * 5; break;
            case EffectType.ATTACK_PLAYER_FAITH: score += faith / 10; break;
            case EffectType.BOOST_HERESY_PER_SECOND: score += heresyPressure * 1.2; break;
            case EffectType.ADD_HERESY_FLAT: score += heresyPressure; break;
            case EffectType.STEAL_CRUMBS: score += crumbs / 5; break;
        }
        return { card, score: score + Math.random() * 5 };
    });

    scoredCards.sort((a, b) => b.score - a.score);
    const bestCard = scoredCards[0].card;
    
    // 3. Determine card effects
    const playerEffects: { type: EffectType, value: number }[] = [];
    
    if (bestCard.effect.type === EffectType.BOOST_HERESY_PER_SECOND) {
        updatedRival.heresyPerSecond += bestCard.effect.value;
    } else {
        playerEffects.push({ type: bestCard.effect.type, value: bestCard.effect.value });
    }

    // 4. Update rival's state after playing (pay cost, move card)
    updatedRival.faith -= bestCard.cost.amount;
    updatedRival.hand = updatedRival.hand.filter(c => c.id !== bestCard.id);
    updatedRival.discard = [...updatedRival.discard, bestCard];

    // 5. Draw a new card, shuffling if necessary
    if (updatedRival.deck.length === 0 && updatedRival.discard.length > 0) {
        updatedRival.deck = shuffle([...updatedRival.discard]);
        updatedRival.discard = [];
    }
    if (updatedRival.deck.length > 0) {
        const [nextCard, ...remainingDeck] = updatedRival.deck;
        updatedRival.hand.push(nextCard);
        updatedRival.deck = remainingDeck;
    }
    
    return { 
        updatedRival, 
        playerEffects, 
        action: `Played '${bestCard.name}'!` 
    };
};

const App: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>('loading');
    const [hasSaveData, setHasSaveData] = useState(false);

    // Meta Progression State
    const [divineFavor, setDivineFavor] = useState(0);
    const [metaUpgrades, setMetaUpgrades] = useState<MetaUpgrade[]>(META_UPGRADES);
    const [unlockedRelics, setUnlockedRelics] = useState<string[]>([]);
    const [activeRelicId, setActiveRelicId] = useState<string | null>(null);

    // Run-specific State
    const [faith, setFaith] = useState(0);
    const [crumbs, setCrumbs] = useState(0);
    const [followers, setFollowers] = useState<Follower[]>([]);
    const [flockMorale, setFlockMorale] = useState(100);
    const [timeSinceLastSermon, setTimeSinceLastSermon] = useState(0);
    const [heresy, setHeresy] = useState(0);
    const [crumbsPerClick, setCrumbsPerClick] = useState(1);
    const [upgrades, setUpgrades] = useState<Upgrade[]>(UPGRADES);

    const [deck, setDeck] = useState<Card[]>([]);
    const [hand, setHand] = useState<Card[]>([]);
    const [discard, setDiscard] = useState<Card[]>([]);
    const [playingCardId, setPlayingCardId] = useState<string | null>(null);
    const [drawQueue, setDrawQueue] = useState(0);
    const [animatingCardDraw, setAnimatingCardDraw] = useState(false);
    const [newlyDrawnCardIds, setNewlyDrawnCardIds] = useState<Set<string>>(new Set());
    
    const [activeBoosts, setActiveBoosts] = useState<TemporaryEffect[]>([]);
    const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);
    const [activeMinigame, setActiveMinigame] = useState<string | null>(null);
    const [activeWeather, setActiveWeather] = useState<ActiveWeatherEvent | null>(null);
    const eventTimeoutRef = useRef<number | null>(null);
    
    const [rivalSect, setRivalSect] = useState<RivalSect | null>(null);
    const [isRivalDefeated, setIsRivalDefeated] = useState(false);
    const [lastRivalAction, setLastRivalAction] = useState<string | null>(null);
    const rivalSpawnedRef = useRef(false);

    // Unique Mechanics
    const [faithOscillator, setFaithOscillator] = useState({ angle: 0, multiplier: 1 });

    // Flock AI State
    const [flockAIState, setFlockAIState] = useState<'following' | 'scattering' | 'gathering'>('following');
    const flockStateTimeoutRef = useRef<number | null>(null);

    // Quest State
    const [completedQuests, setCompletedQuests] = useState<string[]>([]);
    
    const [activeTab, setActiveTab] = useState('game');
    const [activeLoreTab, setActiveLoreTab] = useState('cards');

    // Visual State
    const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
    const [particles, setParticles] = useState<{ id: number, x: number, y: number }[]>([]);
    const [floatingTexts, setFloatingTexts] = useState<{ id: number, text: string, x: number, y: number, type: 'faith' | 'crumbs' }[]>([]);
    const [popeState, setPopeState] = useState<'idle' | 'pecking'>('idle');
    const peckButtonRef = useRef<HTMLButtonElement>(null);
    const particleIdCounter = useRef(0);
    const animationFrameRef = useRef<number>();
    const floatingTextIdCounter = useRef(0);
    const faithIconRef = useRef<HTMLDivElement>(null);
    const crumbIconRef = useRef<HTMLDivElement>(null);
    const faithGainedOfflineRef = useRef(0);

    const activeRelic = useMemo(() => RELICS.find(r => r.id === activeRelicId) ?? null, [activeRelicId]);
    const runBonuses = useMemo(() => calculateRunBonuses(metaUpgrades, activeRelic), [metaUpgrades, activeRelic]);

    const activeQuest = useMemo(() => {
        return QUESTS.find(q => 
            !completedQuests.includes(q.id) &&
            (q.unlocksAfter ? completedQuests.includes(q.unlocksAfter) : true)
        );
    }, [completedQuests]);

    const formatNumber = (num: number): string => {
        if (num < 1) return num.toFixed(1);
        if (num < 1000) return num.toFixed(0);
        if (num < 1_000_000) return `${(num / 1000).toFixed(2)}K`;
        if (num < 1_000_000_000) return `${(num / 1_000_000).toFixed(2)}M`;
        return `${(num / 1_000_000_000).toFixed(2)}B`;
    };

    const createFloatingText = useCallback((amount: number, type: 'faith' | 'crumbs') => {
        const ref = type === 'faith' ? faithIconRef : crumbIconRef;
        if (ref.current && amount > 0) {
            const rect = ref.current.getBoundingClientRect();
            const newText = {
                id: floatingTextIdCounter.current++,
                text: `+${formatNumber(amount)}`,
                x: rect.left + rect.width / 2,
                y: rect.top,
                type: type
            };
            setFloatingTexts(current => [...current, newText]);
            setTimeout(() => {
                setFloatingTexts(current => current.filter(t => t.id !== newText.id));
            }, 1500); // Animation duration
        }
    }, []);

    const gainFaith = useCallback((amount: number) => {
        if (amount <= 0) return;
        setFaith(prev => prev + amount);
        createFloatingText(amount, 'faith');
    }, [createFloatingText]);

    const gainCrumbs = useCallback((amount: number) => {
        if (amount <= 0) return;
        setCrumbs(prev => prev + amount);
        createFloatingText(amount, 'crumbs');
    }, [createFloatingText]);

    const setTemporaryFlockState = useCallback((state: 'scattering' | 'gathering', duration: number) => {
        setFlockAIState(state);

        if (state === 'scattering') {
            // Assign a one-time scatter target for each follower
            setFollowers(currentFlock => currentFlock.map(f => ({
                ...f,
                targetX: Math.random() < 0.5 ? Math.random() * 20 : 80 + Math.random() * 20, // screen edges
                targetY: Math.random() * 90,
            })));
        }
        // For 'gathering', the animate function will handle it per-frame to create a swarm effect.

        if (flockStateTimeoutRef.current) clearTimeout(flockStateTimeoutRef.current);
        flockStateTimeoutRef.current = window.setTimeout(() => {
            setFlockAIState('following');
        }, duration);
    }, []);

    // Preload sounds on initial mount
    useEffect(() => {
        preloadSounds();
    }, []);

    // Day/Night Cycle
    useEffect(() => {
        if (gameState !== 'playing') return;
        const cycle: TimeOfDay[] = ['day', 'sunset', 'night', 'dawn'];
        let currentIndex = 0;
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cycle.length;
            setTimeOfDay(cycle[currentIndex]);
        }, 60000); // 1 minute per phase
        return () => clearInterval(interval);
    }, [gameState]);

    const totalCrumbMultiplier = useMemo(() => {
        let multiplier = runBonuses.crumbMultiplier;
        if (activeWeather) {
            const weatherDef = WEATHER_EVENTS.find(w => w.id === activeWeather.id);
            if (weatherDef?.crumbGainMultiplier) {
                multiplier *= weatherDef.crumbGainMultiplier;
            }
        }
        return multiplier;
    }, [runBonuses.crumbMultiplier, activeWeather]);

    const faithPerSecond = useMemo(() => {
        const followerFps = followers.length * FOLLOWER_FAITH_PER_SECOND;
        const boostFps = activeBoosts.reduce((sum, boost) => sum + boost.value, 0);
        
        let weatherMultiplier = 1;
        if (activeWeather?.type === WeatherType.MORNING_SUNLIGHT || activeWeather?.type === WeatherType.FAITH_ECLIPSE) {
            const weatherDef = WEATHER_EVENTS.find(w => w.id === activeWeather.id);
            if (weatherDef?.faithGainMultiplier) {
                weatherMultiplier = weatherDef.faithGainMultiplier;
            }
        }
        
        let moraleMultiplier = 1.0;
        if (flockMorale > 80) {
            moraleMultiplier = 1.2; // 20% bonus for zealous flock
        } else if (flockMorale <= 40) {
            moraleMultiplier = 0.5; // 50% penalty for wavering morale
        }
        
        const baseFps = (runBonuses.baseFps + followerFps + boostFps) * weatherMultiplier * moraleMultiplier;
        return baseFps * faithOscillator.multiplier;
    }, [followers.length, activeBoosts, runBonuses.baseFps, activeWeather, flockMorale, faithOscillator.multiplier]);

    const effectiveFaithPerSecond = useMemo(() => {
        const rivalHeresyRate = rivalSect ? rivalSect.heresyPerSecond : 0;
        let weatherHeresyRate = 0;
        if (activeWeather) {
            const weatherDef = WEATHER_EVENTS.find(w => w.id === activeWeather.id);
            if (weatherDef?.heresyPerSecondAdd) {
                weatherHeresyRate = weatherDef.heresyPerSecondAdd;
            }
        }
        return Math.max(0, faithPerSecond - heresy - rivalHeresyRate - weatherHeresyRate);
    }, [faithPerSecond, heresy, rivalSect, activeWeather]);

    const startRun = useCallback((isNewGame: boolean) => {
        if(isNewGame) localStorage.removeItem(SAVE_KEY);

        setFaith(runBonuses.startFaith);
        setCrumbs(runBonuses.startCrumbs);
        setFollowers([{ id: `follower-${Date.now()}`, x: 50, y: 50, targetX: 50, targetY: 50, animationDelay: '0s', animationState: 'idle' }]);
        setHeresy(0);
        setFlockMorale(100);
        setTimeSinceLastSermon(0);
        rivalSpawnedRef.current = false;
        setCompletedQuests([]);
        
        setCrumbsPerClick(1);
        setUpgrades(UPGRADES.map(u => ({...u, owned: 0, cost: u.cost})));

        const newDeck = shuffle([...INITIAL_CARDS]);
        const { cardsToDraw, newDeck: remainingDeckAfterInitialDraw } = prepareDraw(MAX_HAND_SIZE + runBonuses.initialDraw, [], newDeck, []);
        
        setDeck(remainingDeckAfterInitialDraw);
        setHand(cardsToDraw);
        setDiscard([]);
        setActiveBoosts([]);
        setCurrentEvent(null);
        setActiveMinigame(null);
        setActiveWeather(null);
        setRivalSect(null);
        setIsRivalDefeated(false);
        setLastRivalAction(null);
        if (eventTimeoutRef.current) clearTimeout(eventTimeoutRef.current);
    }, [runBonuses]);
    
    // Main Game Loop Tick
    useEffect(() => {
        if (gameState !== 'playing') return;
        const timer = setInterval(() => {
            setFaith(prev => prev + effectiveFaithPerSecond / 10);
            setTimeSinceLastSermon(prev => prev + 0.1);
            setActiveBoosts(prevBoosts => 
                prevBoosts.map(b => ({...b, duration: b.duration - 0.1})).filter(b => b.duration > 0)
            );
            setActiveWeather(prevWeather => {
                if (!prevWeather) return null;
                const newDuration = prevWeather.duration - 0.1;
                return newDuration > 0 ? { ...prevWeather, duration: newDuration } : null;
            });
            // Update Faith Oscillator
            const period = 8000; // 8 seconds for a full swing
            const sinValue = Math.sin((Date.now() % period) / period * 2 * Math.PI); // -1 to 1
            const angle = sinValue * 60; // Swing 60 degrees left/right

            const minMultiplier = 0.2;
            const maxMultiplier = 5.0;
            const normalized = (sinValue + 1) / 2; // map to [0, 1]
            const multiplier = minMultiplier + normalized * (maxMultiplier - minMultiplier);

            setFaithOscillator({ angle, multiplier });

        }, 100);
        return () => clearInterval(timer);
    }, [effectiveFaithPerSecond, gameState]);
    
    // Morale Decay Logic
    useEffect(() => {
        if (gameState !== 'playing') return;
        if (timeSinceLastSermon >= 120) { // 2 minutes
            setFlockMorale(m => Math.max(0, m - 5));
            setTimeSinceLastSermon(0);
        }
    }, [timeSinceLastSermon, gameState]);

    // Flock Movement Logic
    useEffect(() => {
        if (gameState !== 'playing') return;
        const animateFlock = () => {
            setFollowers(currentFlock => {
                if (currentFlock.length === 0) return [];
                const POPE_CENTER_X = 50; // %
                const POPE_CENTER_Y = 55; // %
                const time = Date.now() / 3000;

                // Adjust formation based on morale
                let formationRadiusX = 25 + Math.min(currentFlock.length, 50) * 0.2;
                let formationRadiusY = 15 + Math.min(currentFlock.length, 50) * 0.15;
                let speed = 0.05;

                if (flockMorale > 80) { // Zealous
                    formationRadiusX *= 0.8;
                    formationRadiusY *= 0.8;
                    speed = 0.07;
                } else if (flockMorale <= 40) { // Wavering
                    formationRadiusX *= 1.5;
                    formationRadiusY *= 1.5;
                    speed = 0.03;
                }

                return currentFlock.map((follower, i) => {
                    let targetX = follower.targetX;
                    let targetY = follower.targetY;
                    let lerpSpeed = speed;

                    switch (flockAIState) {
                        case 'scattering':
                            // Targets are pre-set by setTemporaryFlockState. Move towards them.
                            lerpSpeed = 0.08;
                            break;
                        
                        case 'gathering':
                            // Swarm at bottom center (where crumbs would be)
                            targetX = 50 + (Math.random() - 0.5) * 40;
                            targetY = 90 + (Math.random() - 0.5) * 10;
                            lerpSpeed = 0.06;
                            break;

                        case 'following':
                        default:
                            const angle = (i / currentFlock.length) * 2 * Math.PI + time;
                            // When wavering, followers are more scattered and less uniform.
                            const randomOffset = flockMorale <= 40 ? (Math.random() - 0.5) * 10 : 0;
                            targetX = POPE_CENTER_X + formationRadiusX * Math.cos(angle) + randomOffset;
                            targetY = POPE_CENTER_Y + formationRadiusY * Math.sin(angle) + randomOffset;
                            break;
                    }
                    
                    // Lerp towards target
                    const newX = follower.x + (targetX - follower.x) * lerpSpeed;
                    const newY = follower.y + (targetY - follower.y) * lerpSpeed;

                    return { ...follower, x: newX, y: newY, targetX, targetY };
                });
            });
            animationFrameRef.current = requestAnimationFrame(animateFlock);
        };
        animationFrameRef.current = requestAnimationFrame(animateFlock);
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [flockAIState, flockMorale, gameState]);

    // Flock Animation State Logic
    useEffect(() => {
        if (gameState !== 'playing') return;

        const animationInterval = setInterval(() => {
            const animationStates: FollowerAnimationState[] = ['pecking', 'looking', 'flapping'];
            const animationDurations: { [key in FollowerAnimationState]?: number } = {
                pecking: 500,
                looking: 3000,
                flapping: 700,
            };

            setFollowers(currentFollowers => currentFollowers.map(f => {
                const now = Date.now();

                // Revert to idle if animation is finished
                if (f.animationState !== 'idle' && f.animationEndTimestamp && now > f.animationEndTimestamp) {
                    return { ...f, animationState: 'idle', animationEndTimestamp: undefined };
                }

                // Start a new animation if idle
                if (f.animationState === 'idle' && Math.random() < 0.05) { // 5% chance each second to do something
                    const newState = animationStates[Math.floor(Math.random() * animationStates.length)];
                    return {
                        ...f,
                        animationState: newState,
                        animationEndTimestamp: now + (animationDurations[newState] ?? 1000),
                    };
                }

                return f;
            }));
        }, 1000);

        return () => clearInterval(animationInterval);
    }, [gameState]);

    const completeQuest = useCallback((questId: string) => {
        if (completedQuests.includes(questId)) return;

        const quest = QUESTS.find(q => q.id === questId);
        if (!quest) return;

        playSound('prestige');
        setCompletedQuests(prev => [...prev, questId]);

        if (quest.reward.divineFavor) {
            setDivineFavor(df => df + quest.reward.divineFavor!);
        }
        if (quest.reward.relicId && !unlockedRelics.includes(quest.reward.relicId)) {
            setUnlockedRelics(prev => [...prev, quest.reward.relicId!]);
        }
    }, [completedQuests, unlockedRelics]);

    // Quest Completion Logic
    useEffect(() => {
        if (gameState !== 'playing' || !activeQuest) return;
        
        const followerObjective = activeQuest.objectives.find(o => o.type === QuestObjectiveType.REACH_FOLLOWERS);
        if (followerObjective && followers.length >= followerObjective.targetValue) {
            completeQuest(activeQuest.id);
        }

    }, [followers.length, activeQuest, gameState, completeQuest]);

    // Rival Sect Spawn Logic
    useEffect(() => {
        if (gameState !== 'playing') return;
        if(followers.length >= 10 && !rivalSect && !rivalSpawnedRef.current) {
            rivalSpawnedRef.current = true;
            const rivalData = RIVAL_SECTS_DATA[Math.floor(Math.random() * RIVAL_SECTS_DATA.length)];
            const rivalDeck = shuffle([...RIVAL_CARDS[rivalData.id]]);
            
            setRivalSect({
                ...rivalData,
                faith: 100 + Math.floor(followers.length * 5), // Scale with player's progress
                deck: rivalDeck.slice(3),
                hand: rivalDeck.slice(0, 3),
                discard: [],
                heresyPerSecond: 0.2, // Base rate
            });
        }
    }, [followers.length, rivalSect, gameState]);

    // Rival AI Turn Logic
    useEffect(() => {
        if (!rivalSect || isRivalDefeated || gameState !== 'playing') return;

        const turnInterval = setInterval(() => {
            let rivalFaithMultiplier = 1;
            if (activeWeather?.type === WeatherType.FAITH_ECLIPSE) {
                const weatherDef = WEATHER_EVENTS.find(w => w.id === activeWeather.id);
                rivalFaithMultiplier = weatherDef?.rivalFaithGainMultiplier ?? 1;
            }
            
            const playerState = { faith, crumbs, followerCount: followers.length, heresy };
            const { updatedRival, playerEffects, action } = runRivalTurn(rivalSect, playerState, rivalFaithMultiplier);

            if (action) {
                setLastRivalAction(`${action}-${Date.now()}`); // Append timestamp to ensure re-trigger
            }

            // Apply effects to the player
            let wasAttacked = false;
            playerEffects.forEach(effect => {
                switch (effect.type) {
                    case EffectType.ADD_HERESY_FLAT: setHeresy(h => h + effect.value); break;
                    case EffectType.STEAL_FOLLOWERS:
                        setFollowers(f => f.slice(0, Math.max(0, f.length - effect.value)));
                        wasAttacked = true;
                        break;
                    case EffectType.ATTACK_PLAYER_FAITH:
                        setFaith(f => Math.max(0, f - effect.value));
                        wasAttacked = true;
                        break;
                    case EffectType.STEAL_CRUMBS: setCrumbs(c => Math.max(0, c - effect.value)); break;
                }
            });

            if (wasAttacked) {
                setTemporaryFlockState('scattering', 4000);
            }

            setRivalSect(updatedRival);

        }, 5000);

        return () => clearInterval(turnInterval);
    }, [rivalSect, faith, crumbs, followers.length, heresy, gameState, activeWeather, setTemporaryFlockState, isRivalDefeated]);

    // Event Trigger Timer
    useEffect(() => {
        if (gameState !== 'playing') return;
        const scheduleNextEvent = () => {
            const delay = 30000 + Math.random() * 30000; // 30-60 seconds
            eventTimeoutRef.current = window.setTimeout(() => {
                if(!currentEvent && !activeWeather && !activeMinigame) {
                    const event = GAME_EVENTS[Math.floor(Math.random() * GAME_EVENTS.length)];
                    playSound('event');
                    if(event.minigame) {
                        setActiveMinigame(event.minigame);
                    } else {
                        setCurrentEvent(event);
                    }
                }
            }, delay);
        };
        if(!currentEvent && !activeMinigame) {
            scheduleNextEvent();
        }
        return () => {
            if (eventTimeoutRef.current) clearTimeout(eventTimeoutRef.current);
        };
    }, [currentEvent, activeWeather, gameState, activeMinigame]);

    // Weather Trigger Timer
    useEffect(() => {
        if (gameState !== 'playing') return;
        const scheduleNextWeather = () => {
            const delay = 90000 + Math.random() * 90000; // 90-180 seconds
            const timeoutId = window.setTimeout(() => {
                if(!activeWeather && !currentEvent && !activeMinigame) { // Don't overlap with other modals
                    const weatherDef = WEATHER_EVENTS[Math.floor(Math.random() * WEATHER_EVENTS.length)];
                    setActiveWeather({
                        id: weatherDef.id,
                        type: weatherDef.type,
                        name: weatherDef.name,
                        description: weatherDef.description,
                        art: weatherDef.art,
                        duration: weatherDef.duration,
                        initialDuration: weatherDef.duration,
                    });
                    playSound('event'); 
                }
            }, delay);
            return timeoutId;
        };

        let timeoutId: number | undefined;
        if(!activeWeather) {
            timeoutId = scheduleNextWeather();
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [activeWeather, currentEvent, gameState, activeMinigame]);
    
    const executeDraw = (amount: number) => {
        if (animatingCardDraw || amount <= 0) return;
    
        setAnimatingCardDraw(true);
    
        // Use functional updates to get fresh state for deck/discard
        setDeck(currentDeck => {
            setDiscard(currentDiscard => {
                const { cardsToDraw, newDeck, newDiscard } = prepareDraw(amount, hand, currentDeck, currentDiscard);
                
                if (cardsToDraw.length > 0) {
                    // Animate them in one by one
                    const drawWithAnimation = async () => {
                        for (const card of cardsToDraw) {
                            await new Promise(resolve => setTimeout(resolve, 150));
                            playSound('play_card', 0.4);
                            
                            setHand(h => [...h, card]);
                            setNewlyDrawnCardIds(prev => new Set(prev).add(card.id));
                        }
                        await new Promise(resolve => setTimeout(resolve, 500));
                        setNewlyDrawnCardIds(new Set());
                        setAnimatingCardDraw(false);
                    };
                    drawWithAnimation();
                } else {
                    setAnimatingCardDraw(false);
                }
    
                setDeck(newDeck);
                return newDiscard;
            });
            return currentDeck;
        });
    };

    // Effect to handle all card drawing logic
    useEffect(() => {
        if (gameState !== 'playing') return;
        if (playingCardId !== null || animatingCardDraw) return;
        
        if (drawQueue > 0) {
            executeDraw(drawQueue);
            setDrawQueue(0);
        } 
        else if (hand.length < MAX_HAND_SIZE) {
            executeDraw(MAX_HAND_SIZE - hand.length);
        }
    }, [hand.length, playingCardId, drawQueue, animatingCardDraw, gameState]);


    const handlePeck = () => {
        playSound('peck', 0.7);
        gainCrumbs(crumbsPerClick * totalCrumbMultiplier);
        
        setPopeState('pecking');
        setTimeout(() => setPopeState('idle'), 300); // Duration of the peck animation

        // Particle effect
        const buttonRect = peckButtonRef.current?.getBoundingClientRect();
        if (buttonRect) {
            const newParticles = Array.from({ length: 5 }).map(() => ({
                id: particleIdCounter.current++,
                x: buttonRect.left + buttonRect.width / 2 + (Math.random() - 0.5) * buttonRect.width,
                y: buttonRect.top + buttonRect.height / 2 + (Math.random() - 0.5) * buttonRect.height,
            }));
            setParticles(prev => [...prev, ...newParticles]);
            const idsToRemove = newParticles.map(p => p.id);
            setTimeout(() => {
                setParticles(current => current.filter(p => !idsToRemove.includes(p.id)));
            }, 700);
        }
    };

    const canAffordCard = (card: Card) => {
        if (card.cost.resource === ResourceType.Faith) return faith >= card.cost.amount;
        return crumbs >= card.cost.amount;
    };

    const handlePlayCard = (card: Card, element: HTMLDivElement) => {
        if (!canAffordCard(card) || playingCardId) return;
        
        const moraleGain = activeRelic?.id === 'relic-b-001' ? 2 * 1.2 : 2;
        setTimeSinceLastSermon(0);
        setFlockMorale(m => Math.min(100, m + moraleGain));

        playSound('play_card');
        setPlayingCardId(card.id);

        const rect = element.getBoundingClientRect();
        const newParticles = Array.from({ length: 8 }).map(() => ({
            id: particleIdCounter.current++,
            x: rect.left + rect.width / 2 + (Math.random() - 0.5) * rect.width,
            y: rect.top + rect.height / 2 + (Math.random() - 0.5) * rect.height,
        }));
        setParticles(prev => [...prev, ...newParticles]);
        const idsToRemove = newParticles.map(p => p.id);
        setTimeout(() => {
            setParticles(current => current.filter(p => !idsToRemove.includes(p.id)));
        }, 700);

        setTimeout(() => {
            if (card.cost.resource === ResourceType.Faith) setFaith(prev => prev - card.cost.amount);
            else setCrumbs(prev => prev - card.cost.amount);

            switch (card.effect.type) {
                case EffectType.ADD_FAITH: gainFaith(card.effect.value); playSound('gain'); break;
                case EffectType.ADD_CRUMBS:
                    const crumbAmount = card.effect.value * totalCrumbMultiplier;
                    gainCrumbs(crumbAmount);
                    playSound('gain');
                    if (crumbAmount > 20) {
                        setTemporaryFlockState('gathering', 3000);
                    }
                    break;
                case EffectType.ADD_FOLLOWERS:
                    setFollowers(prev => {
                        const newFollowers: Follower[] = [];
                        for(let i = 0; i < card.effect.value; i++) {
                            newFollowers.push({
                                id: `follower-${Date.now()}-${i}`,
                                x: 50 + (Math.random() - 0.5) * 10,
                                y: 55 + (Math.random() - 0.5) * 10,
                                targetX: 0, targetY: 0, // will be calculated in next frame
                                animationDelay: `${Math.random() * 2}s`,
                                animationState: 'idle',
                            });
                        }
                        return [...prev, ...newFollowers];
                    });
                    playSound('gain', 0.8);
                    break;
                case EffectType.DRAW_CARDS: 
                    setDrawQueue(q => q + card.effect.value);
                    break;
                case EffectType.TEMP_FPS_ADD:
                    const newBoost: TemporaryEffect = {
                        id: crypto.randomUUID(), description: `+${card.effect.value.toFixed(1)} Faith/sec`,
                        type: card.effect.type, value: card.effect.value, duration: card.effect.duration!, sourceName: card.name,
                    };
                    setActiveBoosts(prev => [...prev, newBoost]);
                    break;
                case EffectType.ATTACK_RIVAL:
                    if (rivalSect) {
                        const newFaith = rivalSect.faith - card.effect.value;
                        if (newFaith <= 0) {
                            gainFaith(150);
                            playSound('prestige');
                            setIsRivalDefeated(true);
                            setTimeout(() => {
                                setRivalSect(null);
                                setHeresy(h => Math.max(0, h-20));
                                setIsRivalDefeated(false);
                            }, 2000); // Defeat animation duration

                            if (activeQuest?.objectives.some(o => o.type === QuestObjectiveType.DEFEAT_RIVAL)) {
                                completeQuest(activeQuest.id);
                            }
                        } else {
                            setRivalSect({...rivalSect, faith: newFaith});
                        }
                    }
                    break;
                case EffectType.REDUCE_HERESY: setHeresy(h => Math.max(0, h - card.effect.value)); break;
            }
            
            setHand(h => h.filter(c => c.id !== card.id));
            setDiscard(d => [...d, card]);
            setPlayingCardId(null);
        }, 500); // Animation duration
    };
    
    const handleBuyUpgrade = (upgradeId: string) => {
        const upgrade = upgrades.find(u => u.id === upgradeId);
        if (!upgrade) return;

        const canAfford = upgrade.costResource === ResourceType.Faith ? faith >= upgrade.cost : crumbs >= upgrade.cost;
        if (!canAfford) return;
        
        playSound('upgrade');

        if (upgrade.costResource === ResourceType.Faith) setFaith(f => f - upgrade.cost);
        else setCrumbs(c => c - upgrade.cost);

        setUpgrades(upgrades.map(u => 
            u.id === upgradeId ? { ...u, owned: u.owned + 1, cost: Math.ceil(u.cost * 1.15) } : u
        ));

        if (upgrade.effect.type === 'ADD_FOLLOWERS') {
             setFollowers(prev => {
                const newFollowers: Follower[] = [];
                for(let i = 0; i < upgrade.effect.value; i++) {
                    newFollowers.push({
                        id: `follower-${Date.now()}-${i}`,
                        x: 50 + (Math.random() - 0.5) * 10,
                        y: 55 + (Math.random() - 0.5) * 10,
                        targetX: 0, targetY: 0,
                        animationDelay: `${Math.random() * 2}s`,
                        animationState: 'idle',
                    });
                }
                return [...prev, ...newFollowers];
            });
        }
        else if (upgrade.effect.type === 'ADD_CPC') setCrumbsPerClick(cpc => cpc + upgrade.effect.value);
    };
    
    const handleBuyMetaUpgrade = (upgradeId: string) => {
        const upgrade = metaUpgrades.find(u => u.id === upgradeId);
        if (!upgrade || upgrade.level >= upgrade.maxLevel) return;
        const cost = upgrade.cost * (upgrade.level + 1);
        if (divineFavor < cost) return;

        playSound('upgrade', 0.8);
        setDivineFavor(df => df - cost);
        setMetaUpgrades(prev => prev.map(u => u.id === upgradeId ? {...u, level: u.level + 1} : u));
    };

    const handlePrestige = () => {
        const favorGained = Math.floor(Math.log10(faith + 1) * 5);
        if (favorGained <= 0) {
            alert("You need more Faith to perform the Great Migration and earn Divine Favor!");
            return;
        }
        if (window.confirm(`Perform the Great Migration? You will restart your cult but gain ${favorGained} Divine Favor.`)) {
            playSound('prestige');
            setDivineFavor(df => df + favorGained);
            
            const availableRelics = RELICS.filter(r => !unlockedRelics.includes(r.id) && !r.id.startsWith('relic-b-'));
            if(availableRelics.length > 0) {
                const newRelic = availableRelics[Math.floor(Math.random() * availableRelics.length)];
                setUnlockedRelics(prev => [...prev, newRelic.id]);
                alert(`A Holy Relic has been revealed to you: ${newRelic.name}!`);
            }

            startRun(true);
            setActiveTab('meta');
        }
    };
    
    const handleResolveEvent = (choice: EventChoice) => {
        playSound('gain');
        choice.effects.forEach(effect => {
            switch (effect.type) {
                case EffectType.ADD_FAITH: gainFaith(effect.value); break;
                case EffectType.ADD_CRUMBS:
                    const crumbAmount = effect.value * totalCrumbMultiplier;
                    gainCrumbs(crumbAmount);
                    if (crumbAmount > 50) {
                        setTemporaryFlockState('gathering', 3500);
                    }
                    break;
                case EffectType.ADD_FOLLOWERS:
                    if (effect.value > 0) {
                        setFollowers(prev => {
                            const newFollowers: Follower[] = Array.from({ length: effect.value }, (_, i) => ({
                                id: `follower-${Date.now()}-${i}`,
                                x: 50, y: 55, targetX: 0, targetY: 0,
                                animationDelay: `${Math.random() * 2}s`,
                                animationState: 'idle',
                            }));
                            return [...prev, ...newFollowers];
                        });
                    } else {
                        setFollowers(prev => prev.slice(0, Math.max(0, prev.length + effect.value)));
                    }
                    break;
            }
        });
        setCurrentEvent(null);
    };

    const handleBureaucracyComplete = (score: number) => {
        setActiveMinigame(null);
        let message = `You processed ${score} documents. The bureaucracy is adequately satisfied.`;
        
        const faithGained = score * 25;
        gainFaith(faithGained);

        if (score >= 5) {
            const potentialRelics = RELICS.filter(r => r.id.startsWith('relic-b-') && !unlockedRelics.includes(r.id));
            if(potentialRelics.length > 0) {
                const unlocked = potentialRelics[0];
                setUnlockedRelics(prev => [...prev, unlocked.id]);
                message = `Your administrative prowess is a miracle! You processed ${score} documents, earning ${faithGained} Faith and unlocking a new Relic: ${unlocked.name}!`;
                playSound('prestige');
            } else {
                 message = `A masterful performance! You processed ${score} documents, earning ${faithGained} Faith!`;
                 playSound('gain');
            }
        } else if (score > 0) {
             message = `You processed ${score} documents, earning ${faithGained} Faith. The paperwork is eternal.`;
             playSound('gain');
        } else {
            message = `You failed to process any documents correctly. The bureaucracy is unimpressed.`;
        }

        alert(message);
    };

    const backgroundParticles = useMemo(() => {
        const particles = [];
        let numCrumbs = 15;
        let numLights = 7;

        if (activeWeather?.type === WeatherType.BREAD_STORM) numCrumbs = 45;
        if (activeWeather?.type === WeatherType.MORNING_SUNLIGHT) numLights = 21;
        if (activeWeather?.type === WeatherType.FAITH_ECLIPSE) numLights = 2;
        
        // Floating Crumbs
        for (let i = 0; i < numCrumbs; i++) {
            const size = 4 + Math.random() * 4;
            particles.push({
                id: `crumb-${i}`,
                type: 'crumb',
                style: {
                    left: `${Math.random() * 100}%`,
                    bottom: `${-10 + Math.random() * 10}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDuration: `${10 + Math.random() * 15}s`,
                    animationDelay: `${Math.random() * 20}s`,
                }
            });
        }
        // Shimmering Lights
        for (let i = 0; i < numLights; i++) {
            const size = 50 + Math.random() * 50;
            particles.push({
                id: `light-${i}`,
                type: 'light',
                style: {
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    animationDuration: `${6 + Math.random() * 8}s`,
                    animationDelay: `${Math.random() * 14}s`,
                }
            });
        }
        return particles;
    }, [activeWeather]);
    
    // --- SAVE AND LOAD ---

    const saveGame = useCallback(() => {
        if (gameState !== 'playing') return; // Don't save if not in game

        const rivalSectSave = rivalSect ? {
            id: rivalSect.id, faith: rivalSect.faith,
            deck: rivalSect.deck.map(c => c.id), hand: rivalSect.hand.map(c => c.id),
            discard: rivalSect.discard.map(c => c.id), heresyPerSecond: rivalSect.heresyPerSecond,
        } : null;

        const saveData = {
            version: GAME_VERSION, lastSaveTimestamp: Date.now(),
            divineFavor, metaUpgrades: metaUpgrades.map(({ id, level }) => ({ id, level })), unlockedRelics, activeRelicId,
            faith, crumbs, followers, heresy, crumbsPerClick, flockMorale, timeSinceLastSermon,
            upgrades: upgrades.map(({ id, owned, cost }) => ({ id, owned, cost })),
            deck: deck.map(c => c.id), hand: hand.map(c => c.id), discard: discard.map(c => c.id),
            activeBoosts, currentEventId: currentEvent ? currentEvent.id : null, activeWeather,
            rivalSpawned: rivalSpawnedRef.current, rivalSect: rivalSectSave,
            completedQuests,
        };
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    }, [gameState, divineFavor, metaUpgrades, unlockedRelics, activeRelicId, faith, crumbs, followers, heresy, crumbsPerClick, upgrades, deck, hand, discard, activeBoosts, currentEvent, rivalSect, activeWeather, completedQuests, flockMorale, timeSinceLastSermon]);
    
    const loadGame = useCallback((savedData: any) => {
        const allCards = [...INITIAL_CARDS, ...Object.values(RIVAL_CARDS).flat()];
        const findCard = (id: string) => allCards.find(c => c.id)!;
        
        setDivineFavor(savedData.divineFavor);
        setMetaUpgrades(META_UPGRADES.map(mu => ({ ...mu, level: savedData.metaUpgrades.find((smu: any) => smu.id === mu.id)?.level ?? 0 })));
        setUnlockedRelics(savedData.unlockedRelics);
        setActiveRelicId(savedData.activeRelicId);
        setCompletedQuests(savedData.completedQuests || []);
        setFlockMorale(savedData.flockMorale || 100);
        setTimeSinceLastSermon(savedData.timeSinceLastSermon || 0);

        const loadedMetaUpgrades = META_UPGRADES.map(mu => ({ ...mu, level: savedData.metaUpgrades.find((smu: any) => smu.id === mu.id)?.level ?? 0 }));
        const loadedActiveRelic = RELICS.find(r => r.id === savedData.activeRelicId) ?? null;
        const loadedRunBonuses = calculateRunBonuses(loadedMetaUpgrades, loadedActiveRelic);

        const offlineTimeMs = Date.now() - savedData.lastSaveTimestamp;
        const effectiveOfflineSeconds = Math.min(Math.max(0, Math.floor(offlineTimeMs / 1000)), 2 * 3600);
        
        const savedBoosts = savedData.activeBoosts || [];
        const boostFps = savedBoosts.reduce((sum: number, boost: TemporaryEffect) => sum + boost.value, 0);
        const followerFps = (savedData.followers?.length || 0) * FOLLOWER_FAITH_PER_SECOND;
        const baseFps = loadedRunBonuses.baseFps;
        const rivalHeresyRate = savedData.rivalSect ? savedData.rivalSect.heresyPerSecond : 0;
        
        const savedMorale = savedData.flockMorale || 100;
        let moraleMultiplier = 1.0;
        if (savedMorale > 80) moraleMultiplier = 1.2;
        else if (savedMorale <= 40) moraleMultiplier = 0.5;

        const savedWeather = savedData.activeWeather as ActiveWeatherEvent | null;
        let weatherFaithMultiplier = 1;
        let weatherHeresyRate = 0;
        if (savedWeather) {
             const weatherDef = WEATHER_EVENTS.find(w => w.id === savedWeather.id);
             if (weatherDef) {
                if (weatherDef.faithGainMultiplier) weatherFaithMultiplier = weatherDef.faithGainMultiplier;
                if (weatherDef.heresyPerSecondAdd) weatherHeresyRate = weatherDef.heresyPerSecondAdd;
             }
        }
        
        const effectiveOfflineFps = Math.max(0, ((baseFps + followerFps + boostFps) * weatherFaithMultiplier * moraleMultiplier) - savedData.heresy - rivalHeresyRate - weatherHeresyRate);
        const faithGainedOffline = effectiveOfflineFps * effectiveOfflineSeconds;
        faithGainedOfflineRef.current = faithGainedOffline;

        setFaith(savedData.faith + faithGainedOffline);

        setCrumbs(savedData.crumbs);
        setFollowers(savedData.followers || [{ id: `follower-${Date.now()}`, x: 50, y: 50, targetX: 50, targetY: 50, animationDelay: '0s', animationState: 'idle' }]);
        setHeresy(savedData.heresy);
        setCrumbsPerClick(savedData.crumbsPerClick);
        setUpgrades(UPGRADES.map(u => { const su = savedData.upgrades.find((s:any) => s.id === u.id); return su ? { ...u, owned: su.owned, cost: su.cost } : u; }));
        setDeck(savedData.deck.map(findCard).filter(Boolean));
        setHand(savedData.hand.map(findCard).filter(Boolean));
        setDiscard(savedData.discard.map(findCard).filter(Boolean));
        setActiveBoosts(savedBoosts.map((b: TemporaryEffect) => ({ ...b, duration: b.duration - effectiveOfflineSeconds })).filter((b: TemporaryEffect) => b.duration > 0));
        setCurrentEvent(GAME_EVENTS.find(e => e.id === savedData.currentEventId && !e.minigame) ?? null);
        if (savedWeather) {
            const newDuration = savedWeather.duration - effectiveOfflineSeconds;
            if (newDuration > 0) setActiveWeather({ ...savedWeather, duration: newDuration });
        }
        rivalSpawnedRef.current = savedData.rivalSpawned;
        if (savedData.rivalSect) {
            const rivalData = RIVAL_SECTS_DATA.find(rsd => rsd.id === savedData.rivalSect.id);
            if (rivalData) {
                setRivalSect({
                    ...rivalData, faith: savedData.rivalSect.faith,
                    deck: savedData.rivalSect.deck.map(findCard).filter(Boolean),
                    hand: savedData.rivalSect.hand.map(findCard).filter(Boolean),
                    discard: savedData.rivalSect.discard.map(findCard).filter(Boolean),
                    heresyPerSecond: savedData.rivalSect.heresyPerSecond
                });
            }
        }

        if (faithGainedOffline > 1) {
            setTimeout(() => alert(`Welcome back! You gained ${formatNumber(faithGainedOffline)} Faith while you were away.`), 200);
        }
    }, []);

    useEffect(() => {
        const saveInterval = setInterval(saveGame, 15000);
        window.addEventListener('beforeunload', saveGame);
        return () => {
            clearInterval(saveInterval);
            window.removeEventListener('beforeunload', saveGame);
        };
    }, [saveGame]);
    
    // Initial Load
    useEffect(() => {
        const savedDataString = localStorage.getItem(SAVE_KEY);
        if (savedDataString) {
            try {
                const savedData = JSON.parse(savedDataString);
                if (savedData.version === GAME_VERSION) {
                    setHasSaveData(true);
                } else {
                    console.warn("Save data is from an old version. Starting fresh.");
                    localStorage.removeItem(SAVE_KEY);
                }
            } catch {
                localStorage.removeItem(SAVE_KEY);
            }
        }
        setGameState('startScreen');
    }, []);
    
    useEffect(() => {
        if (gameState === 'playing' && faithGainedOfflineRef.current > 1) {
             setTimeout(() => {
                createFloatingText(faithGainedOfflineRef.current, 'faith');
                faithGainedOfflineRef.current = 0;
            }, 100);
        }
    }, [gameState, createFloatingText]);
    
    const handleStartNewGame = () => {
        stopMusic();
        setGameState('intro');
    }

    const handleContinue = () => {
        const savedDataString = localStorage.getItem(SAVE_KEY);
        if (savedDataString) {
            loadGame(JSON.parse(savedDataString));
        }
        setGameState('playing');
        playMusic('music_theme');
    }

    const handleIntroComplete = () => {
        startRun(true);
        setGameState('playing');
        playMusic('music_theme');
    }

    const handleResetProgress = () => {
        if (window.confirm("Are you absolutely sure you want to delete all your progress? This includes all Divine Favor, Relics, and Meta Upgrades. This cannot be undone.")) {
            localStorage.removeItem(SAVE_KEY);
            window.location.reload();
        }
    };
    
    if (gameState === 'loading') {
        return <div className="min-h-screen bg-stone-900 text-white flex items-center justify-center"><h1 className="text-3xl font-silkscreen animate-pulse">Loading the Flock...</h1></div>;
    }
    
    if (gameState === 'startScreen') {
        return <StartScreen onNewGame={handleStartNewGame} onContinue={handleContinue} hasSaveData={hasSaveData} />;
    }

    if (gameState === 'intro') {
        return <IntroSequence onComplete={handleIntroComplete} />;
    }

    return (
        <div className="min-h-screen bg-stone-900 bg-[url('https://www.transparenttextures.com/patterns/concrete-wall.png')] text-stone-100 p-4 flex flex-col items-center">
            {currentEvent && !currentEvent.minigame && <EventModal event={currentEvent} onChoice={handleResolveEvent} />}
            {activeMinigame === 'bureaucracy' && <BureaucracyMinigame requests={BUREAUCRACY_REQUESTS} onComplete={handleBureaucracyComplete} />}
            {activeWeather && <WeatherDisplay weather={activeWeather} />}
            {floatingTexts.map(text => (
                <div
                    key={text.id}
                    className={`floating-text font-silkscreen ${text.type === 'faith' ? 'floating-text-faith' : 'floating-text-crumbs'}`}
                    style={{ left: text.x, top: text.y, transform: 'translateX(-50%)' }}
                >
                    {text.text}
                </div>
            ))}
            <QuestTracker 
                activeQuest={activeQuest} 
                progressValues={{ [QuestObjectiveType.REACH_FOLLOWERS]: followers.length }} 
            />
            {particles.map(p => <div key={p.id} className="particle-sparkle" style={{ left: p.x, top: p.y }}/>)}

            <header className="w-full max-w-6xl text-center mb-4">
                <h1 className="text-5xl font-bold text-amber-300 font-silkscreen tracking-wider">Der Papst der Tauben</h1>
                <p className="text-stone-400">The Pigeon Pope</p>
                <div className="mt-4 grid grid-cols-2 md:grid-cols-6 gap-4 text-xl bg-stone-800/50 p-3 rounded-lg border-2 border-stone-700">
                    <div ref={faithIconRef} className="flex items-center justify-center gap-2" title="Faith">
                        <FaithIcon className="w-8 h-8 text-yellow-400" />
                        <span className="font-bold">{formatNumber(faith)}</span>
                        <span className="text-sm text-stone-400">({effectiveFaithPerSecond.toFixed(1)}/s)</span>
                    </div>
                    <div ref={crumbIconRef} className="flex items-center justify-center gap-2" title="Crumbs">
                        <CrumbIcon className="w-8 h-8 text-amber-600" />
                        <span className="font-bold">{Math.floor(crumbs)}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2" title="Followers">
                        <PigeonIcon className="w-8 h-8 text-stone-300" />
                        <span className="font-bold">{followers.length}</span>
                    </div>
                     <MoraleDisplay morale={flockMorale} />
                    <div className="flex items-center justify-center gap-2" title="Heresy">
                        <HeresyIcon className="w-8 h-8 text-red-500" />
                        <span className="font-bold">{heresy.toFixed(1)}</span>
                    </div>
                     <div className="flex items-center justify-center gap-2" title="Divine Favor">
                        <DivineFavorIcon className="w-8 h-8 text-cyan-400" />
                        <span className="font-bold">{divineFavor}</span>
                    </div>
                </div>
            </header>

            <div className="w-full max-w-6xl flex justify-center border-b-2 border-amber-300/50 mb-4">
                <button onClick={() => setActiveTab('game')} className={`px-4 py-2 font-silkscreen text-lg ${activeTab === 'game' ? 'bg-amber-300/80 text-stone-900' : 'bg-stone-800/50'}`}>Game</button>
                <button onClick={() => setActiveTab('meta')} className={`px-4 py-2 font-silkscreen text-lg ${activeTab === 'meta' ? 'bg-amber-300/80 text-stone-900' : 'bg-stone-800/50'}`}>Great Migration</button>
                <button onClick={() => setActiveTab('lore')} className={`px-4 py-2 font-silkscreen text-lg ${activeTab === 'lore' ? 'bg-amber-300/80 text-stone-900' : 'bg-stone-800/50'}`}>Lore</button>
            </div>

            <main className="w-full max-w-6xl flex-grow">
                {activeTab === 'game' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-1 bg-stone-800/50 p-4 rounded-lg border-2 border-stone-700 space-y-4">
                             {rivalSect && <RivalSectPanel rival={rivalSect} lastAction={lastRivalAction} isDefeated={isRivalDefeated} />}
                             <div>
                                <h2 className="text-2xl font-silkscreen text-amber-300 mb-4">Doctrines</h2>
                                <div className="space-y-2">
                                    {upgrades.map(u => (
                                        <button 
                                            key={u.id}
                                            onClick={() => handleBuyUpgrade(u.id)}
                                            className="w-full text-left p-3 bg-stone-700/60 rounded-lg border-2 border-stone-600 hover:bg-stone-600/60 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={(u.costResource === ResourceType.Faith ? faith : crumbs) < u.cost}
                                        >
                                            <div className="flex justify-between items-center">
                                                <h4 className="font-bold text-lg">{u.name}</h4>
                                                <span className="text-sm font-bold bg-stone-900 px-2 py-1 rounded">{u.owned}</span>
                                            </div>
                                            <p className="text-sm text-stone-400">{u.description}</p>
                                            <div className="text-sm mt-1 flex items-center gap-1 font-bold">Cost: {Math.ceil(u.cost)} {u.costResource === ResourceType.Faith ? <FaithIcon className="w-4 h-4"/> : <CrumbIcon className="w-4 h-4"/>}</div>
                                        </button>
                                    ))}
                                </div>
                             </div>
                        </div>

                        <div className="md:col-span-2 bg-stone-800/50 p-4 rounded-lg border-2 border-stone-700 flex flex-col items-center">
                            <FaithOscillator angle={faithOscillator.angle} multiplier={faithOscillator.multiplier} />
                            <div className="parallax-container w-full h-80 rounded-lg bg-stone-700">
                                <div className={`parallax-bg time-of-day-${timeOfDay} weather-effect-${activeWeather?.type ?? 'none'}`}></div>
                                <div className="parallax-layer parallax-clouds"></div>
                                <div className="absolute inset-0 z-10 pointer-events-none">
                                    {backgroundParticles.map(p => (
                                        <div
                                            key={p.id}
                                            className={p.type === 'crumb' ? 'floating-crumb' : 'shimmering-light'}
                                            style={p.style as React.CSSProperties}
                                        />
                                    ))}
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-center items-center">
                                     <div className="relative">
                                        <div className="leader-aura"></div>
                                        <PigeonPopeSprite state={popeState} />
                                     </div>
                                     <button ref={peckButtonRef} onClick={handlePeck} className="z-20 bg-amber-600 hover:bg-amber-500 text-stone-900 font-bold p-4 rounded-full w-48 h-48 flex flex-col justify-center items-center transition-transform transform hover:scale-105">
                                        <span className="text-6xl">🍞</span>
                                        <span className="text-xl">Peck for Crumbs</span>
                                        <span className="text-sm">({(crumbsPerClick * totalCrumbMultiplier).toFixed(1)} per peck)</span>
                                    </button>
                                </div>
                                {followers.map((follower) => (
                                    <div 
                                      key={follower.id} 
                                      className={`absolute z-20 transition-opacity duration-500 ${flockMorale <= 40 ? 'follower-wavering' : ''}`}
                                      style={{ 
                                          left: `${follower.x}%`, 
                                          top: `${follower.y}%`, 
                                          transform: `translate(-50%, -50%) scaleX(${follower.targetX > follower.x ? -1 : 1})`,
                                      }}
                                    >
                                      <FollowerPigeonSprite animationState={follower.animationState} />
                                    </div>
                                ))}
                            </div>
                             <div className="mt-4 w-full">
                                <h3 className="text-lg font-silkscreen text-center text-amber-200">Active Rituals</h3>
                                <div className="space-y-1 mt-2 text-center text-sm">
                                {activeBoosts.length > 0 ? activeBoosts.map(b => (
                                    <div key={b.id} className="bg-purple-900/40 text-purple-200 p-1 rounded-md">
                                        {b.sourceName}: {b.description} ({Math.ceil(b.duration)}s)
                                    </div>
                                )) : <p className="text-stone-500 italic">No active rituals.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {activeTab === 'meta' && (
                     <div className="bg-stone-800/50 p-6 rounded-lg border-2 border-cyan-400/50 text-center space-y-8">
                        <div>
                            <h2 className="text-3xl font-silkscreen text-cyan-300 mb-4">The Great Migration</h2>
                            <p className="text-stone-300 mb-6 max-w-2xl mx-auto">Abandon this roost and seek new horizons. Your legend will echo, granting you Divine Favor to carry into the next life. This will reset your current Faith, Crumbs, and Upgrades.</p>
                            <button onClick={handlePrestige} className="bg-cyan-500 hover:bg-cyan-400 text-stone-900 font-bold py-3 px-6 rounded-lg text-xl font-silkscreen transition-transform transform hover:scale-105">Migrate Now</button>
                            <p className="mt-2 text-sm text-stone-400">Potential Gain: {Math.floor(Math.log10(faith + 1) * 5)} <DivineFavorIcon className="w-4 h-4 inline-block -mt-1"/></p>
                        </div>

                        <div className="border-t-2 border-cyan-400/30 pt-6">
                            <h3 className="text-2xl font-silkscreen text-cyan-300 mb-4">Holy Relics</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                                {RELICS.map(r => (
                                    <button 
                                        key={r.id}
                                        onClick={() => unlockedRelics.includes(r.id) && setActiveRelicId(prev => prev === r.id ? null : r.id)}
                                        disabled={!unlockedRelics.includes(r.id)}
                                        className={`p-3 rounded-lg border-2 transition-all ${activeRelicId === r.id ? 'bg-amber-400/30 border-amber-300 shadow-lg shadow-amber-500/20' : 'bg-stone-900/50 border-stone-700'} disabled:opacity-40 disabled:cursor-not-allowed`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <h4 className="font-bold text-lg text-amber-200">{r.name}</h4>
                                            <span className="text-3xl">{r.art}</span>
                                        </div>
                                        <p className="text-sm text-stone-400 my-1">{r.description}</p>
                                        {activeRelicId === r.id && <div className="text-center font-bold text-amber-200 text-xs mt-2 bg-black/30 rounded-full py-0.5">ACTIVE</div>}
                                    </button>
                                ))}
                            </div>
                             {unlockedRelics.length === 0 && <p className="text-stone-500 italic">Perform the Great Migration or complete certain events to unlock powerful relics.</p>}
                        </div>

                        <div className="border-t-2 border-cyan-400/30 pt-6">
                            <h3 className="text-2xl font-silkscreen text-cyan-300 mb-4">Eternal Doctrines</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                                {metaUpgrades.map(u => (
                                    <div key={u.id} className="bg-stone-900/50 p-4 rounded-lg border border-stone-700">
                                        <h4 className="font-bold text-lg text-cyan-200">{u.name}</h4>
                                        <p className="text-sm text-stone-400 my-1">{u.description}</p>
                                        <p className="text-sm font-bold text-cyan-400">Current: {u.effect(u.level)}</p>
                                        <p className="text-xs text-stone-500">Level {u.level} / {u.maxLevel}</p>
                                        {u.level < u.maxLevel && (
                                            <button onClick={() => handleBuyMetaUpgrade(u.id)} className="w-full mt-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-1 px-3 rounded-md text-sm disabled:bg-stone-600 disabled:cursor-not-allowed" disabled={divineFavor < u.cost * (u.level + 1)}>
                                                Upgrade ({u.cost * (u.level + 1)} <DivineFavorIcon className="w-3 h-3 inline"/>)
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="border-t-2 border-red-500/30 pt-6 mt-8">
                            <h3 className="text-2xl font-silkscreen text-red-400 mb-4">Danger Zone</h3>
                            <p className="text-stone-400 mb-4 max-w-2xl mx-auto">
                                If you wish to erase all your progress, including Divine Favor and Relics, and start anew from the very beginning, you may do so here. This action cannot be undone.
                            </p>
                            <button onClick={handleResetProgress} className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-5 rounded-lg transition-colors">
                                Reset All Progress
                            </button>
                        </div>

                    </div>
                )}
                {activeTab === 'lore' && (
                     <div className="bg-stone-800/50 p-6 rounded-lg border-2 border-amber-300/50">
                        <h2 className="text-3xl font-silkscreen text-amber-300 mb-4 text-center">The Pigeon Scrolls</h2>
                        
                        <div className="flex justify-center border-b-2 border-amber-300/20 mb-4">
                            <button onClick={() => setActiveLoreTab('cards')} className={`px-4 py-1 text-lg ${activeLoreTab === 'cards' ? 'bg-amber-300/20 text-amber-200' : ''}`}>Cards</button>
                            <button onClick={() => setActiveLoreTab('relics')} className={`px-4 py-1 text-lg ${activeLoreTab === 'relics' ? 'bg-amber-300/20 text-amber-200' : ''}`}>Relics</button>
                            <button onClick={() => setActiveLoreTab('events')} className={`px-4 py-1 text-lg ${activeLoreTab === 'events' ? 'bg-amber-300/20 text-amber-200' : ''}`}>Events</button>
                            <button onClick={() => setActiveLoreTab('rivals')} className={`px-4 py-1 text-lg ${activeLoreTab === 'rivals' ? 'bg-amber-300/20 text-amber-200' : ''}`}>Rival Sects</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[60vh] overflow-y-auto p-2 lore-scrollbar">
                            {activeLoreTab === 'cards' && INITIAL_CARDS.map(item => <LoreCard key={item.id} item={item} />)}
                            {activeLoreTab === 'relics' && RELICS.map(item => <LoreCard key={item.id} item={{...item, type: 'Relic'}} locked={!unlockedRelics.includes(item.id)} />)}
                            {activeLoreTab === 'events' && GAME_EVENTS.map(item => <LoreCard key={item.id} item={{...item, name: item.title, type: 'Event'}} />)}
                            {activeLoreTab === 'rivals' && RIVAL_SECTS_DATA.map(item => <LoreCard key={item.id} item={{...item, description: `A rival sect that spreads heresy through its own dark rituals and propaganda.`, type: 'Rival Sect'}} />)}
                        </div>
                    </div>
                )}
            </main>

            <footer className="w-full max-w-6xl mt-4">
                <div className="h-2 bg-stone-700/50 rounded-full mb-2"></div>
                <div className="flex justify-center items-center gap-4 h-72">
                    {hand.map(card => (
                        <CardComponent 
                            key={card.id} 
                            card={card} 
                            onPlay={handlePlayCard} 
                            canAfford={canAffordCard(card)}
                            isAnimatingOut={playingCardId === card.id}
                            isDrawingIn={newlyDrawnCardIds.has(card.id)}
                        />
                    ))}
                </div>
                <div className="text-center mt-2 text-stone-500 text-sm">
                    Deck: {deck.length} | Discard: {discard.length}
                </div>
            </footer>
        </div>
    );
};

export default App;
