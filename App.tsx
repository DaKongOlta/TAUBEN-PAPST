import React, { useState, useEffect, useCallback } from 'react';
import type {
  Card, RivalSect, Building, Follower, ActiveTab, GameEvent, ActiveWeatherEvent, Quest, Skill, MapSector, MapRoute, StreamDeckAction, Faction, Dogma, ChronicleEntry, DialogueNode, Boss, GameEffect
} from './types';
import { ResourceType, QuestObjectiveType, FactionId } from './types';
import {
  STARTING_FAITH, STARTING_CRUMBS, STARTING_FOLLOWERS, STARTING_MORALE, STARTING_DIVINE_FAVOR, BASE_FAITH_PER_SECOND, BASE_CRUMBS_PER_FOLLOWER, MAX_HAND_SIZE, initialDeck, RIVAL_SECTS, TYCOON_BUILDINGS, createInitialFollower, BUREAUCRACY_MINIGAME_REQUESTS,
} from './constants';
import { QUESTS } from './quests';
import { SKILLS_DATA } from './skills';
import { MAP_DATA } from './map';
import { FACTIONS, SEAGULL_BOSS } from './factions';
import { DOGMAS } from './dogmas';
import { DIALOGUES } from './dialogues';
import { getBuildingUpgradeCost } from './utils';
import { StartScreen } from './components/StartScreen';
import { IntroSequence } from './components/IntroSequence';
import { TabNavigator } from './components/TabNavigator';
import { CampaignView } from './views/CampaignView';
import { EconomyView } from './views/EconomyView';
import { FollowersView } from './views/FollowersView';
import { MapView } from './views/MapView';
import { SkillsView } from './views/SkillsView';
import { IntegrationsView } from './views/IntegrationsView';
import { FactionsView } from './views/FactionsView';
import { ChroniclesView } from './views/ChroniclesView';
import { PlaceholderView } from './views/PlaceholderView';
import { EventModal } from './components/EventModal';
import { WeatherDisplay } from './components/WeatherDisplay';
import { QuestTracker } from './components/QuestTracker';
import { BureaucracyMinigame } from './components/BureaucracyMinigame';
import { playSound, playMusic, stopMusic } from './audioManager';
import { DivineVisionCutscene } from './components/DivineVisionCutscene';
import { DogmaSelectionModal } from './components/DogmaSelectionModal';
import { DialogueModal } from './components/DialogueModal';

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

  // Rival & Boss
  const [rival, setRival] = useState<RivalSect>(RIVAL_SECTS[0]);
  const [rivalLastAction, setRivalLastAction] = useState<string | null>(null);
  const [isRivalDefeated, setIsRivalDefeated] = useState(false);
  const [activeBoss, setActiveBoss] = useState<Boss | null>(null);
  const [isBossDefeated, setIsBossDefeated] = useState(false);

  // Tycoon / Economy
  const [buildings, setBuildings] = useState<Building[]>(TYCOON_BUILDINGS.map(b => ({ ...b, level: 0 })));

  // Events, Weather, Minigames
  const [activeEvent, setActiveEvent] = useState<GameEvent | null>(null);
  const [activeWeather, setActiveWeather] = useState<ActiveWeatherEvent | null>(null);
  const [bureaucracyMinigameActive, setBureaucracyMinigameActive] = useState(false);

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
  
  // New Systems
  const [factions, setFactions] = useState<Record<string, Faction>>(FACTIONS);
  const [activeDogma, setActiveDogma] = useState<Dogma | null>(null);
  const [chronicle, setChronicle] = useState<ChronicleEntry[]>([]);
  const [gameTurn, setGameTurn] = useState(0);
  const [activeDialogue, setActiveDialogue] = useState<DialogueNode | null>(null);
  const [isDogmaSelectionVisible, setIsDogmaSelectionVisible] = useState(false);

  // Stream Deck Integration
  const [streamDeckConfig, setStreamDeckConfig] = useState<Array<StreamDeckAction | null>>(Array(STREAM_DECK_KEY_COUNT).fill(null));

  const logChronicle = useCallback((text: string) => {
    const newEntry: ChronicleEntry = { id: `entry-${Date.now()}`, turn: gameTurn, text };
    setChronicle(c => [newEntry, ...c].slice(0, 50));
  }, [gameTurn]);

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
    setGameState('playing');
    setFollowers(Array.from({ length: STARTING_FOLLOWERS }, createInitialFollower));
    const newDeck = [...initialDeck].sort(() => Math.random() - 0.5);
    setDeck(newDeck);
    drawCards(5, newDeck, [], []);
    stopMusic('music_theme');
    playMusic('music_game', 0.4, true);
    logChronicle("A new Migration has begun.");
  }, [drawCards, logChronicle]);

  const applyGameEffect = useCallback((effect: GameEffect) => {
      switch(effect.type) {
        case 'GAIN_MORALE': setMorale(m => Math.min(100, m + effect.value)); break;
        case 'GAIN_CRUMBS': setCrumbs(c => c + effect.value); break;
        case 'GAIN_FOLLOWERS': setFollowers(f => [...f, ...Array.from({ length: effect.value }, createInitialFollower)]); break;
        case 'DAMAGE_RIVAL': 
            if (activeBoss) {
                setActiveBoss(b => b ? { ...b, faith: Math.max(0, b.faith - effect.value) } : null);
            } else {
                setRival(r => ({ ...r, faith: Math.max(0, r.faith - effect.value) }));
            }
            break;
        case 'IMPROVE_RAT_RELATIONS':
        case 'IMPROVE_SEAGULL_RELATIONS':
        case 'IMPROVE_CROW_RELATIONS':
            const factionIdToImprove = effect.type.split('_')[1].toLowerCase() as FactionId;
            setFactions(fs => ({ ...fs, [factionIdToImprove]: {...fs[factionIdToImprove], relationship: Math.min(100, fs[factionIdToImprove].relationship + effect.value)}}));
            break;
        // ... handle other effects
      }
  }, [activeBoss]);

  const handlePlayCard = useCallback((card: Card) => {
    let crumbCost = card.cost.resource === 'Crumbs' ? card.cost.amount : 0;
    if(activeDogma?.effect.type === 'CRUMB_GAIN_MULTIPLIER') crumbCost = Math.round(crumbCost / activeDogma.effect.value);

    setFaith(f => f - (card.cost.resource === 'Faith' ? card.cost.amount : 0));
    setCrumbs(c => c - crumbCost);

    card.effects.forEach(effect => {
      let modifiedEffect = {...effect};
      if (activeDogma?.effect.type === 'CONFLICT_DAMAGE_MULTIPLIER' && effect.type === 'DAMAGE_RIVAL') {
        modifiedEffect.value = Math.round(effect.value * activeDogma.effect.value);
      }
      applyGameEffect(modifiedEffect);
    });

    logChronicle(`Played '${card.name}'.`);
    setPopeState('pecking');
    setTimeout(() => setPopeState('idle'), 500);

    const cardInHandIndex = hand.findIndex(c => c.id === card.id);
    setHand(h => h.filter((c, i) => i !== cardInHandIndex));
    setDiscard(d => [...d, card]);
    playSound('play_card');
    setTimeout(() => drawCards(1, deck, discard, hand.filter((c, i) => i !== cardInHandIndex)), 200);
  }, [deck, discard, hand, drawCards, activeDogma, logChronicle, applyGameEffect]);

  const handleUpgradeBuilding = useCallback((buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;
    const cost = getBuildingUpgradeCost(building);
    if ((building.costResource === ResourceType.Crumbs && crumbs >= cost) || (building.costResource === ResourceType.Faith && faith >= cost)) {
        if (building.costResource === ResourceType.Crumbs) setCrumbs(c => c - cost);
        if (building.costResource === ResourceType.Faith) setFaith(f => f - cost);
        setBuildings(bs => bs.map(b => b.id === buildingId ? { ...b, level: b.level + 1 } : b));
        logChronicle(`Upgraded ${building.name} to level ${building.level + 1}.`);
        playSound('upgrade');
    } else {
        playSound('error');
    }
  }, [buildings, crumbs, faith, logChronicle]);
  
  const handleSetStreamDeckKey = useCallback((keyIndex, action) => {
    setStreamDeckConfig(currentConfig => { const newConfig = [...currentConfig]; newConfig[keyIndex] = action; return newConfig; });
    playSound('ui_click');
  }, []);

  const handleTriggerStreamDeckAction = useCallback((action) => {
    // ... logic from before
  }, [hand, faith, crumbs, handlePlayCard, handleUpgradeBuilding]);
  
  const handleSelectDogma = useCallback((dogma: Dogma) => {
      setActiveDogma(dogma);
      setIsDogmaSelectionVisible(false);
      logChronicle(`A new Dogma was embraced: '${dogma.name}'.`);
      playSound('quest_complete');
  }, [logChronicle]);

  const handleDialogueChoice = useCallback((option: any) => {
    if (option.effects) {
        option.effects.forEach(applyGameEffect);
    }
    if (option.nextId && DIALOGUES[option.nextId]) {
        setActiveDialogue(DIALOGUES[option.nextId]);
    } else {
        setActiveDialogue(null);
    }
  }, [applyGameEffect]);
  
  // Game Loop
  useEffect(() => {
    if (gameState !== 'playing') return;
    const gameTick = setInterval(() => {
      setGameTurn(t => t + 1);
      let faithPerSecond = BASE_FAITH_PER_SECOND;
      if (activeDogma?.effect.type === 'PASSIVE_FAITH_GAIN') faithPerSecond += activeDogma.effect.value;
      let crumbsPerSecond = BASE_CRUMBS_PER_FOLLOWER * followers.length;
      if (activeDogma?.effect.type === 'CRUMB_GAIN_MULTIPLIER') crumbsPerSecond *= activeDogma.effect.value;
      
      buildings.forEach(b => {
        if (b.level > 0) {
          if (b.productionType === ResourceType.Faith) faithPerSecond += b.baseProduction * b.level;
          if (b.productionType === ResourceType.Crumbs) crumbsPerSecond += b.baseProduction * b.level;
        }
      });
      setFaith(f => f + faithPerSecond / 10);
      setCrumbs(c => c + crumbsPerSecond / 10);
      
      let heresyDrain = (isRivalDefeated ? 0 : rival.heresyPerSecond) + (activeBoss ? activeBoss.heresyPerSecond : 0);
      setMorale(m => Math.max(0, m - heresyDrain / 10));
    }, 100);
    return () => clearInterval(gameTick);
  }, [gameState, followers.length, buildings, rival.heresyPerSecond, isRivalDefeated, activeDogma, activeBoss]);

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
        case QuestObjectiveType.DEFEAT_BOSS: currentVal = isBossDefeated ? 1 : 0; break;
      }
      newProgress[obj.type] = currentVal;
      if (currentVal < obj.targetValue) allObjectivesMet = false;
    });
    setQuestProgress(newProgress);
    if (allObjectivesMet) {
      logChronicle(`Quest Complete: ${activeQuest.name}!`);
      playSound('quest_complete');
      if (activeQuest.reward.divineFavor) setDivineFavor(df => df + activeQuest.reward.divineFavor!);
      
      if (activeQuest.id === 'quest-001') setIsDogmaSelectionVisible(true);
      if (activeQuest.id === 'quest-003') setActiveBoss(SEAGULL_BOSS);

      const nextQuest = QUESTS.find(q => q.unlocksAfter === activeQuest.id);
      setActiveQuest(nextQuest);
      setQuestProgress({});
    }
  }, [followers.length, isRivalDefeated, isBossDefeated, activeQuest, gameState, questProgress, logChronicle]);
  
  // Enemy defeat checks
  useEffect(() => {
      if(rival.faith <= 0 && !isRivalDefeated) {
          setIsRivalDefeated(true);
          logChronicle(`The ${rival.name} has been defeated!`);
          playSound('victory');
      }
      if(activeBoss && activeBoss.faith <= 0 && !isBossDefeated) {
          setIsBossDefeated(true);
          setActiveBoss(null);
          logChronicle(`The mighty ${activeBoss.name} has fallen!`);
          playSound('victory');
      }
  }, [rival.faith, isRivalDefeated, activeBoss, isBossDefeated, logChronicle, rival.name]);

  useEffect(() => { /* Morale and Revolt Check - unchanged */ }, [gameState, morale, isRevoltActive]);

  if (gameState === 'start') return <StartScreen onNewGame={() => setGameState('intro')} onContinue={startGame} hasSaveData={hasSaveData} />;
  if (gameState === 'intro') return <IntroSequence onComplete={startGame} />;
  if (gameState === 'vision') return <DivineVisionCutscene onComplete={() => setGameState('playing')} />;
  if (bureaucracyMinigameActive) return <BureaucracyMinigame requests={BUREAUCRACY_MINIGAME_REQUESTS} onComplete={(score) => { setBureaucracyMinigameActive(false); setGameState('playing'); }} />;
  
  const renderActiveView = () => {
    switch (activeTab) {
      case 'Campaign': return <CampaignView {...{ faith, crumbs, followers, divineFavor, morale, hand, rival, activeBoss, popeState, rivalLastAction, isRivalDefeated, isRevoltActive, revoltSparks }} onPlayCard={handlePlayCard} />;
      case 'Economy': return <EconomyView buildings={buildings} onUpgrade={handleUpgradeBuilding} currentCrumbs={crumbs} currentFaith={faith} />;
      case 'Followers': return <FollowersView followers={followers} setFollowers={setFollowers} />;
      case 'Map': return <MapView sectors={sectors} setSectors={setSectors} routes={routes} onAddRoute={(from, to, type) => setRoutes(r => [...r, { id: `route-${Date.now()}`, fromSectorId: from, toSectorId: to, type }])} />;
      case 'Skills': return <SkillsView skills={skills} setSkills={setSkills} divineFavor={divineFavor} setDivineFavor={setDivineFavor} />;
      case 'Factions': return <FactionsView factions={factions} onStartDialogue={(dialogueId) => setActiveDialogue(DIALOGUES[dialogueId])} />;
      case 'Integrations': return <IntegrationsView streamDeckConfig={streamDeckConfig} onSetKey={handleSetStreamDeckKey} onTriggerAction={handleTriggerStreamDeckAction} resourceValues={{ faith, crumbs, followers: followers.length, divineFavor }} />;
      case 'Chronicles': return <ChroniclesView entries={chronicle} />;
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
      {isDogmaSelectionVisible && <DogmaSelectionModal onSelect={handleSelectDogma} />}
      {activeDialogue && <DialogueModal dialogue={activeDialogue} onChoice={handleDialogueChoice} />}
    </main>
  );
};

export default App;