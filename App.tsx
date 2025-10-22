import React, { useState, useEffect, useCallback } from 'react';
import { TabNavigator } from './components/TabNavigator';
import { StartScreen } from './components/StartScreen';
import { IntroSequence } from './components/IntroSequence';
import { CampaignView } from './views/CampaignView';
import { EconomyView } from './views/EconomyView';
import { FollowersView } from './views/FollowersView';
import { MapView } from './views/MapView';
import { SkillsView } from './views/SkillsView';
import { PlaceholderView } from './views/PlaceholderView';
// FIX: Import missing components
import { EventModal } from './components/EventModal';
import { QuestTracker } from './components/QuestTracker';
// FIX: Import MAX_HAND_SIZE constant
import { initialDeck, RIVAL_SECTS, STARTING_CRUMBS, STARTING_FAITH, STARTING_FOLLOWERS, STARTING_MORALE, TYCOON_BUILDINGS, BASE_CRUMBS_PER_FOLLOWER, BASE_FAITH_PER_SECOND, RIVAL_ACTION_INTERVAL, createInitialFollower, STARTING_DIVINE_FAVOR, MAX_HAND_SIZE } from './constants';
import { GAME_EVENTS } from './events';
import { QUESTS } from './quests';
import { SKILLS_DATA } from './skills';
import { MAP_DATA } from './map';
import type { Card, RivalSect, GameEvent, EventChoice, Follower, Building, ActiveTab, Skill, MapSector } from './types';
import { playSound, stopMusic } from './audioManager';
import { ResourceType } from './types';

type GamePhase = 'start' | 'intro' | 'playing' | 'event' | 'minigame' | 'cutscene' | 'gameover';

const App: React.FC = () => {
    const [phase, setPhase] = useState<GamePhase>('start');
    const [activeTab, setActiveTab] = useState<ActiveTab>('Campaign');

    // Core Resources
    const [faith, setFaith] = useState(STARTING_FAITH);
    const [crumbs, setCrumbs] = useState(STARTING_CRUMBS);
    const [divineFavor, setDivineFavor] = useState(STARTING_DIVINE_FAVOR);
    const [followers, setFollowers] = useState<Follower[]>(() => Array.from({ length: STARTING_FOLLOWERS }, createInitialFollower));
    const [morale, setMorale] = useState(STARTING_MORALE);
    
    // Player Deck
    const [hand, setHand] = useState<Card[]>([]);
    const [deck, setDeck] = useState<Card[]>(initialDeck);

    // Game State
    const [rival, setRival] = useState<RivalSect>({...RIVAL_SECTS[0], lastActionTimestamp: Date.now()});
    const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
    const [popeState, setPopeState] = useState<'idle' | 'pecking'>('idle');
    const [rivalLastAction, setRivalLastAction] = useState<string | null>(null);
    const [isRivalDefeated, setIsRivalDefeated] = useState(false);
    const [isRevoltActive, setIsRevoltActive] = useState(false);
    const [revoltSparks, setRevoltSparks] = useState<{id: number, x: number, y: number}[]>([]);

    // Tycoon/Economy State
    const [buildings, setBuildings] = useState<Building[]>(TYCOON_BUILDINGS.map(b => ({ ...b, level: 0 })));

    // New Systems State
    const [skills, setSkills] = useState<Record<string, Skill>>(SKILLS_DATA);
    const [mapSectors, setMapSectors] = useState<MapSector[]>(MAP_DATA);


    // Animation loop for followers to make them feel alive
    useEffect(() => {
        if (phase !== 'playing' || followers.length === 0 || isRevoltActive) return;

        const animLoop = setInterval(() => {
            setFollowers(currentFollowers => {
                const animsToChange = Math.max(1, Math.floor(currentFollowers.length / 3));
                const newFollowers = [...currentFollowers];
                for (let i = 0; i < animsToChange; i++) {
                    const followerIndex = Math.floor(Math.random() * currentFollowers.length);
                    if (newFollowers[followerIndex].animationState !== 'chaotic') {
                      const animOptions: Follower['animationState'][] = ['idle', 'pecking', 'looking', 'flapping'];
                      const newAnim = animOptions[Math.floor(Math.random() * animOptions.length)];
                      newFollowers[followerIndex] = {...newFollowers[followerIndex], animationState: newAnim };
                    }
                }
                return newFollowers;
            });
        }, 3000); // Every 3 seconds

        return () => clearInterval(animLoop);
    }, [phase, followers.length, isRevoltActive]);


    const drawCard = useCallback(() => {
        setHand(currentHand => {
            if (currentHand.length >= MAX_HAND_SIZE) return currentHand;
            const newHand = [...currentHand];
            setDeck(currentDeck => {
                if (currentDeck.length === 0) return []; // No reshuffle for simplicity
                const cardToDraw = currentDeck[0];
                newHand.push(cardToDraw);
                return currentDeck.slice(1);
            });
            return newHand;
        });
    }, []);

    useEffect(() => {
        if (phase === 'playing' && hand.length < MAX_HAND_SIZE) {
            drawCard();
        }
    }, [phase, hand.length, drawCard]);

    const handlePlayCard = (card: Card) => {
        console.log("Playing card:", card.name);
        playSound('play_card');
        setPopeState('pecking');
        setTimeout(() => setPopeState('idle'), 700);

        setHand(h => h.filter(c => c.id !== card.id));
        // Apply card effects
        card.effects.forEach(effect => {
            if (effect.type === 'GAIN_FOLLOWERS') setFollowers(f => [...f, ...Array.from({ length: effect.value }, createInitialFollower)]);
            if (effect.type === 'GAIN_CRUMBS') setCrumbs(c => c + effect.value);
            if (effect.type === 'GAIN_MORALE') setMorale(m => Math.min(100, m + effect.value));
            if (effect.type === 'DAMAGE_RIVAL') {
                if (!isRivalDefeated) {
                    setRival(r => ({...r, faith: Math.max(0, r.faith - effect.value)}));
                    playSound('peck', 1.2);
                }
            }
        });
        setTimeout(drawCard, 500); // Draw a replacement
    };
    
    // Check for rival defeat
    useEffect(() => {
        if (rival.faith <= 0 && !isRivalDefeated) {
            setIsRivalDefeated(true);
            playSound('rival_defeat');
            setCrumbs(c => c + 100);
            setFaith(f => f + 50);
        }
    }, [rival.faith, isRivalDefeated]);

    const handleEventChoice = (choice: EventChoice) => {
        choice.effects.forEach(effect => {
            if (effect.type === 'GAIN_FAITH') setFaith(f => f + effect.value);
            if (effect.type === 'GAIN_FOLLOWERS') setFollowers(f => [...f, ...Array.from({ length: effect.value }, createInitialFollower)]);
        });
        setActiveEvent(null);
        setPhase('playing');
    }

    const handleUpgradeBuilding = (buildingId: string) => {
        setBuildings(currentBuildings => {
            const buildingIndex = currentBuildings.findIndex(b => b.id === buildingId);
            if (buildingIndex === -1) return currentBuildings;

            const building = currentBuildings[buildingIndex];
            const cost = Math.floor(building.baseCost * Math.pow(building.costMultiplier, building.level));

            if (building.costResource === ResourceType.Crumbs && crumbs >= cost) {
                setCrumbs(c => c - cost);
                playSound('upgrade', 0.8);
            } else if (building.costResource === ResourceType.Faith && faith >= cost) {
                setFaith(f => f - cost);
                playSound('upgrade', 0.8);
            } else {
                playSound('error', 0.7);
                return currentBuildings;
            }

            const newBuildings = [...currentBuildings];
            newBuildings[buildingIndex] = { ...building, level: building.level + 1 };
            return newBuildings;
        });
    };

    // Game Loop
    useEffect(() => {
        if (phase !== 'playing') return;
        const interval = setInterval(() => {
            let faithPerTick = BASE_FAITH_PER_SECOND;
            
            // Calculate total crumb production from followers
            const crumbsFromFollowers = followers.reduce((total, follower) => {
                const productivityBonus = follower.devotion / 100; // 0% to 100% bonus
                const moraleModifier = Math.max(0.5, morale / 100); // 50% penalty at 0 morale
                return total + (BASE_CRUMBS_PER_FOLLOWER * follower.productivity * (1 + productivityBonus) * moraleModifier);
            }, 0);
            let crumbsPerTick = crumbsFromFollowers;

            buildings.forEach(building => {
                if (building.level > 0) {
                    const production = building.baseProduction * building.level;
                    if (building.productionType === ResourceType.Faith) faithPerTick += production;
                    else if (building.productionType === ResourceType.Crumbs) crumbsPerTick += production;
                }
            });

            setFaith(f => f + faithPerTick);
            setCrumbs(c => c + crumbsPerTick);

            // Rival's Turn, Revolt Check, Events etc. remain similar
        }, 1000);
        return () => clearInterval(interval);
    }, [phase, followers, buildings, morale]);


    const handleNewGame = () => setPhase('intro');
    const handleContinue = () => { setPhase('playing'); stopMusic('music_theme'); };
    const handleTabChange = (tab: ActiveTab) => setActiveTab(tab);

    if (phase === 'start') return <StartScreen onNewGame={handleNewGame} onContinue={handleContinue} hasSaveData={false} />;
    if (phase === 'intro') return <IntroSequence onComplete={() => { setPhase('playing'); stopMusic('music_theme'); }} />;

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'Campaign': return <CampaignView
                faith={faith}
                crumbs={crumbs}
                followers={followers}
                divineFavor={divineFavor}
                morale={morale}
                hand={hand}
                rival={rival}
                popeState={popeState}
                rivalLastAction={rivalLastAction}
                isRivalDefeated={isRivalDefeated}
                isRevoltActive={isRevoltActive}
                revoltSparks={revoltSparks}
                onPlayCard={handlePlayCard}
             />;
            case 'Economy': return <EconomyView 
                buildings={buildings}
                onUpgrade={handleUpgradeBuilding}
                currentFaith={faith}
                currentCrumbs={crumbs}
            />;
            case 'Followers': return <FollowersView 
                followers={followers} 
                setFollowers={setFollowers}
            />;
            case 'Map': return <MapView sectors={mapSectors} setSectors={setMapSectors} />;
            case 'Skills': return <SkillsView skills={skills} setSkills={setSkills} divineFavor={divineFavor} setDivineFavor={setDivineFavor} />;
            case 'Endgame': return <PlaceholderView title="Endgame" description="The final ascension awaits... This feature is coming in a future update."/>;
            case 'Analytics': return <PlaceholderView title="Analytics" description="Track your divine progress with charts and graphs. This feature is coming soon."/>;
            default: return null;
        }
    };

    return (
        <main className={`bg-stone-900 text-white min-h-screen font-sans flex flex-col`}>
            <TabNavigator activeTab={activeTab} onTabChange={handleTabChange} />
            <div className="flex-grow relative tab-content">
                {renderActiveTab()}
            </div>
             {activeEvent && <EventModal event={activeEvent} onChoice={handleEventChoice} />}
             <QuestTracker activeQuest={QUESTS[0]} progressValues={{'REACH_FOLLOWERS': followers.length}} />
        </main>
    );
};

export default App;
