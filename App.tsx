import React, { useState, useEffect, useCallback } from 'react';
import type {
  Card,
  RivalSect,
  Building,
  Follower,
  ActiveTab,
  GameEvent,
  ActiveWeatherEvent,
  Quest,
  Skill,
  MapSector,
  MapRoute,
  RouteType,
  StreamDeckAction,
} from './types';
import { ResourceType, QuestObjectiveType } from './types';
import {
  STARTING_FAITH,
  STARTING_CRUMBS,
  STARTING_FOLLOWERS,
  STARTING_MORALE,
  STARTING_DIVINE_FAVOR,
  BASE_FAITH_PER_SECOND,
  BASE_CRUMBS_PER_FOLLOWER,
  MAX_HAND_SIZE,
  initialDeck,
  RIVAL_SECTS,
  TYCOON_BUILDINGS,
  createInitialFollower,
  BUREAUCRACY_MINIGAME_REQUESTS,
} from './constants';
import { QUESTS } from './quests';
import { SKILLS_DATA } from './skills';
import { MAP_DATA } from './map';
import { StartScreen } from './components/StartScreen';
import { IntroSequence } from './components/IntroSequence';
import { TabNavigator } from './components/TabNavigator';
import { CampaignView } from './views/CampaignView';
import { EconomyView } from './views/EconomyView';
import { FollowersView } from './views/FollowersView';
import { MapView } from './views/MapView';
import { SkillsView } from './views/SkillsView';
import { IntegrationsView } from './views/IntegrationsView';
import { PlaceholderView } from './views/PlaceholderView';
import { EventModal } from './components/EventModal';
import { WeatherDisplay } from './components/WeatherDisplay';
import { QuestTracker } from './components/QuestTracker';
import { BureaucracyMinigame } from './components/BureaucracyMinigame';
import { playSound, playMusic, stopMusic } from './audioManager';
import { DivineVisionCutscene } from './components/DivineVisionCutscene';

const STREAM_DECK_KEY_COUNT = 15;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'start' | 'intro' | 'playing' | 'bureaucracy' | 'vision'>('start');
  const [hasSaveData, setHasSaveData] = useState(false);

  // Core Resources
  const [faith, setFaith] = useState(STARTING_FAITH);
  const [crumbs, setCrumbs] = useState(STARTING_CRUMBS);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [divineFavor, setDivineFavor] = useState(STARTING_DIVINE_FAVOR);
  const [morale, setMorale] = useState(STARTING_MORALE);

  // Card Game
  const [deck, setDeck] = useState<Card[]>(initialDeck);
  const [hand, setHand] = useState<Card[]>([]);
  const [discard, setDiscard] = useState<Card[]>([]);

  // UI State
  const [activeTab, setActiveTab] = useState<ActiveTab>('Campaign');
  const [popeState, setPopeState] = useState<'idle' | 'pecking'>('idle');

  // Rival
  const [rival, setRival] = useState<RivalSect>(RIVAL_SECTS[0]);
  const [rivalLastAction, setRivalLastAction] = useState<string | null>(null);
  const [isRivalDefeated, setIsRivalDefeated] = useState(false);

  // Tycoon / Economy
  const [buildings, setBuildings] = useState<Building[]>(TYCOON_BUILDINGS.map(b => ({ ...b, level: 0 })));

  // Events & Weather
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [activeWeather, setActiveWeather] = useState<ActiveWeatherEvent | null>(null);

  // Quests
  const [activeQuest, setActiveQuest] = useState<Quest | undefined>(QUESTS[0]);
  const [questProgress, setQuestProgress] = useState<Partial<Record<QuestObjectiveType, number>>>({});

  // Followers & Morale
  const [isRevoltActive, setIsRevoltActive] = useState(false);
  const [revoltSparks, setRevoltSparks] = useState<{ id: number; x: number; y: number }[]>([]);

  // Skills & Map
  const [skills, setSkills] = useState<Record<string, Skill>>(SKILLS_DATA);
  const [sectors, setSectors] = useState<MapSector[]>(MAP_DATA);
  const [routes, setRoutes] = useState<MapRoute[]>([]);
  
  const [bureaucracyMinigameActive, setBureaucracyMinigameActive] = useState(false);
  
  // Stream Deck Integration
  const [streamDeckConfig, setStreamDeckConfig] = useState<Array<StreamDeckAction | null>>(Array(STREAM_DECK_KEY_COUNT).fill(null));

  const drawCards = useCallback((numToDraw: number, currentDeck: Card[], currentDiscard: Card[], currentHand: Card[]) => {
    let deckToDrawFrom = [...currentDeck];
    let cardsDrawn: Card[] = [];
    let newDiscard = [...currentDiscard];

    for (let i = 0; i < numToDraw; i++) {
        if (currentHand.length + cardsDrawn.length >= MAX_HAND_SIZE) break;
        if (deckToDrawFrom.length === 0) {
            if (newDiscard.length === 0) break;
            deckToDrawFrom = [...newDiscard].sort(() => Math.random() - 0.5);
            newDiscard = [];
        }
        cardsDrawn.push(deckToDrawFrom.pop()!);
    }

    setHand(h => [...h, ...cardsDrawn]);
    setDeck(deckToDrawFrom);
    setDiscard(newDiscard);
  }, []);

  const startGame = useCallback(() => {
    setFaith(STARTING_FAITH);
    setCrumbs(STARTING_CRUMBS);
    setFollowers(Array.from({ length: STARTING_FOLLOWERS }, createInitialFollower));
    setDivineFavor(STARTING_DIVINE_FAVOR);
    setMorale(STARTING_MORALE);
    const newDeck = [...initialDeck].sort(() => Math.random() - 0.5);
    setDeck(newDeck);
    setDiscard([]);
    setHand([]);
    setRival(RIVAL_SECTS[0]);
    setIsRivalDefeated(false);
    setBuildings(TYCOON_BUILDINGS.map(b => ({ ...b, level: 0 })));
    setActiveQuest(QUESTS[0]);
    setQuestProgress({});
    setGameState('playing');
    stopMusic('music_theme');
    playMusic('music_game', 0.4, true);

    drawCards(5, newDeck, [], []);
  }, [drawCards]);

  const handlePlayCard = useCallback((card: Card) => {
    setFaith(f => f - (card.cost.resource === 'Faith' ? card.cost.amount : 0));
    setCrumbs(c => c - (card.cost.resource === 'Crumbs' ? card.cost.amount : 0));

    card.effects.forEach(effect => {
      switch (effect.type) {
        case 'GAIN_MORALE': setMorale(m => Math.min(100, m + effect.value)); break;
        case 'GAIN_CRUMBS': setCrumbs(c => c + effect.value); break;
        case 'GAIN_FOLLOWERS': setFollowers(f => [...f, ...Array.from({ length: effect.value }, createInitialFollower)]); break;
        case 'DAMAGE_RIVAL': setRival(r => ({ ...r, faith: Math.max(0, r.faith - effect.value) })); break;
      }
    });

    setPopeState('pecking');
    setTimeout(() => setPopeState('idle'), 500);

    const cardInHandIndex = hand.findIndex(c => c.id === card.id);
    setHand(h => h.filter((c, i) => i !== cardInHandIndex));
    setDiscard(d => [...d, card]);
    playSound('play_card');

    setTimeout(() => drawCards(1, deck, discard, hand.filter((c, i) => i !== cardInHandIndex)), 200);
  }, [deck, discard, hand, drawCards]);

  const handleUpgradeBuilding = useCallback((buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;
    const cost = Math.floor(building.baseCost * Math.pow(building.costMultiplier, building.level));

    const canAfford = (building.costResource === ResourceType.Crumbs && crumbs >= cost) || (building.costResource === ResourceType.Faith && faith >= cost);

    if (canAfford) {
        if (building.costResource === ResourceType.Crumbs) setCrumbs(c => c - cost);
        if (building.costResource === ResourceType.Faith) setFaith(f => f - cost);
        setBuildings(bs => bs.map(b => b.id === buildingId ? { ...b, level: b.level + 1 } : b));
        playSound('upgrade');
    } else {
        playSound('error');
    }
  }, [buildings, crumbs, faith]);
  
  const handleSetStreamDeckKey = useCallback((keyIndex: number, action: StreamDeckAction | null) => {
    setStreamDeckConfig(currentConfig => {
        const newConfig = [...currentConfig];
        newConfig[keyIndex] = action;
        return newConfig;
    });
    playSound('ui_click');
  }, []);

  const handleTriggerStreamDeckAction = useCallback((action: StreamDeckAction) => {
    switch(action.type) {
        case 'BASIC_ACTION':
            if (action.payload.actionName === 'Pray') {
                setFaith(f => f + 5);
                playSound('gain', 0.5);
            } else if (action.payload.actionName === 'Scrounge') {
                setCrumbs(c => c + 10);
                playSound('gain', 0.5);
            }
            break;
        case 'PLAY_CARD':
            const cardToPlay = hand.find(c => c.id === action.payload.id);
            if (cardToPlay) {
                const costVal = cardToPlay.cost.amount;
                const resource = cardToPlay.cost.resource;
                const canAfford = (resource === ResourceType.Faith && faith >= costVal) || (resource === ResourceType.Crumbs && crumbs >= costVal);
                if(canAfford) {
                    handlePlayCard(cardToPlay);
                } else {
                    playSound('error');
                }
            } else {
                playSound('error');
            }
            break;
        case 'UPGRADE_BUILDING':
            if(action.payload.id) {
                handleUpgradeBuilding(action.payload.id);
            }
            break;
        // SHOW_RESOURCE does nothing on trigger
    }
  }, [hand, faith, crumbs, handlePlayCard, handleUpgradeBuilding]);
  
  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const gameTick = setInterval(() => {
      let faithPerSecond = BASE_FAITH_PER_SECOND;
      let crumbsPerSecond = BASE_CRUMBS_PER_FOLLOWER * followers.length;
      buildings.forEach(b => {
        if (b.level > 0) {
          if (b.productionType === ResourceType.Faith) faithPerSecond += b.baseProduction * b.level;
          if (b.productionType === ResourceType.Crumbs) crumbsPerSecond += b.baseProduction * b.level;
        }
      });
      setFaith(f => f + faithPerSecond / 10);
      setCrumbs(c => c + crumbsPerSecond / 10);
      
      let heresyDrain = isRivalDefeated ? 0 : rival.heresyPerSecond;
      setMorale(m => Math.max(0, m - heresyDrain / 10));
    }, 100);

    return () => clearInterval(gameTick);
  }, [gameState, followers.length, buildings, rival.heresyPerSecond, isRivalDefeated]);

  // Quest Progression
  useEffect(() => {
    if (!activeQuest || gameState !== 'playing') return;
    const newProgress = { ...questProgress };
    let allObjectivesMet = true;
    activeQuest.objectives.forEach(obj => {
      let currentVal = 0;
      switch (obj.type) {
        case QuestObjectiveType.REACH_FOLLOWERS: currentVal = followers.length; break;
        case QuestObjectiveType.DEFEAT_RIVAL: currentVal = isRivalDefeated ? 1 : 0; break;
      }
      newProgress[obj.type] = currentVal;
      if (currentVal < obj.targetValue) allObjectivesMet = false;
    });
    setQuestProgress(newProgress);
    if (allObjectivesMet) {
      playSound('quest_complete');
      if (activeQuest.reward.divineFavor) setDivineFavor(df => df + activeQuest.reward.divineFavor!);
      const nextQuest = QUESTS.find(q => q.unlocksAfter === activeQuest.id);
      setActiveQuest(nextQuest);
      setQuestProgress({});
    }
  }, [followers.length, isRivalDefeated, activeQuest, gameState, questProgress]);
  
  // Rival defeat check
  useEffect(() => {
      if(rival.faith <= 0 && !isRivalDefeated) {
          setIsRivalDefeated(true);
          playSound('victory');
      }
  }, [rival.faith, isRivalDefeated]);

  // Morale and Revolt Check
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (morale < 20 && !isRevoltActive) setIsRevoltActive(true);
    else if (morale >= 40 && isRevoltActive) setIsRevoltActive(false);

    if (isRevoltActive) {
      const sparkInterval = setInterval(() => {
        const newSpark = { id: Date.now() + Math.random(), x: Math.random() * 100, y: Math.random() * 100 };
        setRevoltSparks(sparks => [...sparks.slice(-10), newSpark]);
      }, 500);
      return () => clearInterval(sparkInterval);
    } else {
      setRevoltSparks([]);
    }
  }, [gameState, morale, isRevoltActive]);

  if (gameState === 'start') return <StartScreen onNewGame={() => setGameState('intro')} onContinue={startGame} hasSaveData={hasSaveData} />;
  if (gameState === 'intro') return <IntroSequence onComplete={startGame} />;
  if (gameState === 'vision') return <DivineVisionCutscene onComplete={() => setGameState('playing')} />;
  if (bureaucracyMinigameActive) return <BureaucracyMinigame requests={BUREAUCRACY_MINIGAME_REQUESTS} onComplete={(score) => {
    setCrumbs(c => c + score * 10);
    setDivineFavor(d => d + Math.floor(score / 5));
    setBureaucracyMinigameActive(false);
    setGameState('playing');
    }} />;
  
  const renderActiveView = () => {
    switch (activeTab) {
      case 'Campaign': return <CampaignView {...{ faith, crumbs, followers, divineFavor, morale, hand, rival, popeState, rivalLastAction, isRivalDefeated, isRevoltActive, revoltSparks }} onPlayCard={handlePlayCard} />;
      case 'Economy': return <EconomyView buildings={buildings} onUpgrade={handleUpgradeBuilding} currentCrumbs={crumbs} currentFaith={faith} />;
      case 'Followers': return <FollowersView followers={followers} setFollowers={setFollowers} />;
      case 'Map': return <MapView sectors={sectors} setSectors={setSectors} routes={routes} onAddRoute={(from, to, type) => setRoutes(r => [...r, { id: `route-${Date.now()}`, fromSectorId: from, toSectorId: to, type }])} />;
      case 'Skills': return <SkillsView skills={skills} setSkills={setSkills} divineFavor={divineFavor} setDivineFavor={setDivineFavor} />;
      case 'Integrations': return <IntegrationsView streamDeckConfig={streamDeckConfig} onSetKey={handleSetStreamDeckKey} onTriggerAction={handleTriggerStreamDeckAction} resourceValues={{ faith, crumbs, followers: followers.length, divineFavor }} />;
      case 'Endgame': return <PlaceholderView title="Endgame" description="The Great Migration is not yet upon us. Achieve ultimate victory here... eventually." />;
      case 'Analytics': return <PlaceholderView title="Analytics" description="Charts and graphs for the data-driven deity. Coming soon." />;
      default: return null;
    }
  };

  return (
    <main className="w-screen h-screen bg-stone-900 text-stone-100 font-sans overflow-hidden flex flex-col">
      <TabNavigator activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-grow relative">{renderActiveView()}</div>
      <QuestTracker activeQuest={activeQuest} progressValues={questProgress} />
      {activeWeather && <WeatherDisplay weather={activeWeather} />}
      {activeEvent && <EventModal event={activeEvent} onChoice={() => setActiveEvent(null)} />}
    </main>
  );
};

export default App;