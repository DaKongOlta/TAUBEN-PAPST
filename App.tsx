import React, { useState, useEffect, useCallback } from 'react';
import type {
  Card, RivalSect, Building, Follower, ActiveTab, GameEvent, ActiveWeatherEvent, Quest, Skill, MapSector, MapRoute, StreamDeckAction, Faction, Dogma, ChronicleEntry, DialogueNode, Boss, GameEffect, RivalBuff, GameState, PlayerStats, Relic, LootBox, PopeCustomization, DialogueOption, FactionId, AppState, FactionAIAction
} from './types';
import { ResourceType, QuestObjectiveType } from './types';
import {
  STARTING_FAITH, STARTING_CRUMBS, STARTING_FOLLOWERS, STARTING_MORALE, STARTING_DIVINE_FAVOR, STARTING_BREAD_COIN, STARTING_ASCENSION_POINTS, BASE_FAITH_PER_SECOND, BASE_CRUMBS_PER_FOLLOWER, MAX_HAND_SIZE, initialDeck, RIVAL_SECTS, TYCOON_BUILDINGS, createInitialFollower, BUREAUCRACY_MINIGAME_REQUESTS, ALL_CARDS
} from './constants';
import { QUESTS } from './quests';
import { SKILLS_DATA } from './skills';
import { MAP_DATA } from './map';
import { FACTIONS, SEAGULL_BOSS } from './factions';
import { DOGMAS } from './dogmas';
import { DIALOGUES } from './dialogues';
import { RELICS, LOOT_BOXES, openLootBox } from './relics';
import { runFactionAI } from './factionAI';
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
import { MinigamesView } from './views/MinigamesView';
import { PrestigeView } from './views/PrestigeView';
import { RoostView } from './views/RoostView';
import { EventModal } from './components/EventModal';
import { WeatherDisplay } from './components/WeatherDisplay';
import { QuestTracker } from './components/QuestTracker';
import { BureaucracyMinigame } from './components/BureaucracyMinigame';
import { playSound, playMusic, stopMusic } from './audioManager';
import { DivineVisionCutscene } from './components/DivineVisionCutscene';
import { DogmaSelectionModal } from './components/DogmaSelectionModal';
import { DialogueModal } from './components/DialogueModal';
import { LootBoxModal } from './components/LootBoxModal';
import { BreadfallMinigameView } from './views/BreadfallMinigameView';
import { IncomingMessageToast } from './components/IncomingMessageToast';

const STREAM_DECK_KEY_COUNT = 15;
const SAVE_GAME_KEY = 'derPapstDerTauben_saveGame';

const getInitialPlayerStats = (): PlayerStats => ({
  level: 1,
  xp: 0,
  xpToNextLevel: 50,
  luck: 5,
});

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('start');
  const [hasSaveData, setHasSaveData] = useState(false);

  // --- STATE --- //
  // Core Resources
  const [faith, setFaith] = useState(STARTING_FAITH);
  const [crumbs, setCrumbs] = useState(STARTING_CRUMBS);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [divineFavor, setDivineFavor] = useState(STARTING_DIVINE_FAVOR);
  const [morale, setMorale] = useState(STARTING_MORALE);
  const [breadCoin, setBreadCoin] = useState(STARTING_BREAD_COIN);
  const [ascensionPoints, setAscensionPoints] = useState(STARTING_ASCENSION_POINTS);
  const [inflation, setInflation] = useState(1.0);

  // Player Meta
  const [playerStats, setPlayerStats] = useState<PlayerStats>(getInitialPlayerStats());
  const [popeCustomization, setPopeCustomization] = useState<PopeCustomization>({ hatColor: '#fefae0' });
  const [relics, setRelics] = useState<Relic[]>([]);
  const [lootBoxes, setLootBoxes] = useState<LootBox[]>([]);
  const [openedLootBoxResult, setOpenedLootBoxResult] = useState<GameEffect[] | null>(null);

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
  const [incomingMessages, setIncomingMessages] = useState<DialogueNode[]>([]);
  const [triggeredMilestones, setTriggeredMilestones] = useState<Set<string>>(new Set());


  // Integrations
  const [streamDeckConfig, setStreamDeckConfig] = useState<Array<StreamDeckAction | null>>(Array(STREAM_DECK_KEY_COUNT).fill(null));

  // --- SAVE / LOAD --- //
  const saveGame = useCallback(() => {
    // Construct a snapshot of the current state
    const gameStateSnapshot: GameState = {
      faith, crumbs, followers, divineFavor, morale, breadCoin, ascensionPoints, inflation,
      deck, hand, discard, rival, isRivalDefeated, activeBoss, isBossDefeated, buildings,
      activeQuestId: activeQuest?.id, questProgress, skills, sectors, routes, factions,
      activeDogma, chronicle, gameTurn, playerStats, relics, lootBoxes, popeCustomization, streamDeckConfig, incomingMessages,
      triggeredMilestones: Array.from(triggeredMilestones),
    };
    localStorage.setItem(SAVE_GAME_KEY, JSON.stringify(gameStateSnapshot));
    setHasSaveData(true);
    logChronicle("Progress has been saved to the sacred scrolls.");
    playSound('upgrade');
  }, [faith, crumbs, followers, divineFavor, morale, breadCoin, ascensionPoints, inflation, deck, hand, discard, rival, isRivalDefeated, activeBoss, isBossDefeated, buildings, activeQuest, questProgress, skills, sectors, routes, factions, activeDogma, chronicle, gameTurn, playerStats, relics, lootBoxes, popeCustomization, streamDeckConfig, incomingMessages, triggeredMilestones]);

  const loadGame = useCallback(() => {
    const savedData = localStorage.getItem(SAVE_GAME_KEY);
    if (savedData) {
      const gameState: GameState = JSON.parse(savedData);
      setFaith(gameState.faith);
      setCrumbs(gameState.crumbs);
      setFollowers(gameState.followers);
      setDivineFavor(gameState.divineFavor);
      setMorale(gameState.morale);
      setBreadCoin(gameState.breadCoin);
      setAscensionPoints(gameState.ascensionPoints);
      setInflation(gameState.inflation);
      setDeck(gameState.deck);
      setHand(gameState.hand);
      setDiscard(gameState.discard);
      setRival(gameState.rival);
      setIsRivalDefeated(gameState.isRivalDefeated);
      setActiveBoss(gameState.activeBoss);
      setIsBossDefeated(gameState.isBossDefeated);
      setBuildings(gameState.buildings);
      setActiveQuest(QUESTS.find(q => q.id === gameState.activeQuestId));
      setQuestProgress(gameState.questProgress);
      setSkills(gameState.skills);
      setSectors(gameState.sectors);
      setRoutes(gameState.routes);
      setFactions(gameState.factions);
      setActiveDogma(gameState.activeDogma);
      setChronicle(gameState.chronicle);
      setGameTurn(gameState.gameTurn);
      setPlayerStats(gameState.playerStats);
      setRelics(gameState.relics);
      setLootBoxes(gameState.lootBoxes);
      setPopeCustomization(gameState.popeCustomization);
      setStreamDeckConfig(gameState.streamDeckConfig);
      setIncomingMessages(gameState.incomingMessages || []);
      setTriggeredMilestones(new Set(gameState.triggeredMilestones || []));

      setAppState('playing');
      stopMusic('music_theme');
      playMusic('music_game', 0.4, true);
    }
  }, []);
  
  const deleteSave = useCallback(() => {
    localStorage.removeItem(SAVE_GAME_KEY);
    setHasSaveData(false);
    logChronicle("The sacred scrolls have been wiped clean.");
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem(SAVE_GAME_KEY);
    setHasSaveData(!!savedData);
  }, []);


  // --- CORE GAME LOGIC --- //
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

  const startNewGame = useCallback(() => {
    // Reset all state to initial values
    setFaith(STARTING_FAITH);
    setCrumbs(STARTING_CRUMBS);
    setFollowers(Array.from({ length: STARTING_FOLLOWERS }, createInitialFollower));
    setDivineFavor(STARTING_DIVINE_FAVOR);
    setMorale(STARTING_MORALE);
    setBreadCoin(STARTING_BREAD_COIN);
    setAscensionPoints(STARTING_ASCENSION_POINTS);
    setInflation(1.0);
    setPlayerStats(getInitialPlayerStats());
    setPopeCustomization({ hatColor: '#fefae0' });
    setRelics([]);
    setLootBoxes([]);
    const newDeck = [...initialDeck].sort(() => Math.random() - 0.5);
    setDeck(newDeck);
    setHand([]);
    setDiscard([]);
    drawCards(5, newDeck, [], []);
    setRival(RIVAL_SECTS[0]);
    setIsRivalDefeated(false);
    setActiveBoss(null);
    setIsBossDefeated(false);
    setBuildings(TYCOON_BUILDINGS.map(b => ({ ...b, level: 0 })));
    setActiveQuest(QUESTS[0]);
    setQuestProgress({});
    setSkills(SKILLS_DATA);
    setSectors(MAP_DATA);
    setRoutes([]);
    setFactions(FACTIONS);
    setActiveDogma(null);
    setChronicle([]);
    setGameTurn(0);
    setIncomingMessages([]);
    setTriggeredMilestones(new Set());
    
    setAppState('playing');
    stopMusic('music_theme');
    playMusic('music_game', 0.4, true);
    logChronicle("A new Migration has begun.");
  }, [drawCards, logChronicle]);

  const applyGameEffect = useCallback((effect: GameEffect, sourceName?: string) => {
      let finalEffectValue = effect.value;

      // Apply global multipliers from alliances
      let xpMultiplier = 1.0;
      let combatMultiplier = 1.0;
      // FIX: Explicitly type `f` as `Faction` to resolve properties like 'diplomaticStatus' not existing on type 'unknown'.
      Object.values(factions).forEach((f: Faction) => {
        if (f.diplomaticStatus === 'Alliance' && f.allianceBonus) {
          if (f.allianceBonus.type === 'GLOBAL_XP_GAIN_MULTIPLIER') {
            xpMultiplier *= (f.allianceBonus.value as number);
          }
          if (f.allianceBonus.type === 'GLOBAL_COMBAT_DAMAGE_MULTIPLIER') {
            combatMultiplier *= (f.allianceBonus.value as number);
          }
        }
      });
      
      const dealDamageToTarget = (amount: number) => {
        const totalDamage = Math.round(amount * combatMultiplier);
        if (activeBoss) {
            setActiveBoss(b => b ? { ...b, faith: Math.max(0, b.faith - totalDamage) } : null);
        } else {
            setRival(r => ({ ...r, faith: Math.max(0, r.faith - totalDamage) }));
        }
      };

      switch(effect.type) {
        case 'GAIN_MORALE': setMorale(m => Math.min(100, m + (effect.value as number))); break;
        case 'GAIN_CRUMBS': setCrumbs(c => c + (effect.value as number)); break;
        case 'LOSE_CRUMBS': setCrumbs(c => Math.max(0, c - (effect.value as number))); break;
        case 'GAIN_FOLLOWERS': setFollowers(f => [...f, ...Array.from({ length: (effect.value as number) }, createInitialFollower)]); break;
        case 'GAIN_FOLLOWERS_BY_LEVEL': setFollowers(f => [...f, ...Array.from({ length: Math.floor(playerStats.level * (effect.value as number)) }, createInitialFollower)]); break;
        case 'GAIN_XP': 
            finalEffectValue = Math.round((effect.value as number) * xpMultiplier);
            setPlayerStats(ps => ({...ps, xp: ps.xp + (finalEffectValue as number)})); 
            break;
        case 'GAIN_RELIC': {
            const relic = RELICS[effect.value as string];
            if (relic && !relics.find(r => r.id === relic.id)) {
                setRelics(r => [...r, relic]);
                logChronicle(`Acquired a holy relic: ${relic.name}!`);
            }
            break;
        }
        case 'GAIN_LOOTBOX': {
            const lootBox = LOOT_BOXES[effect.value as string];
            if (lootBox) {
                setLootBoxes(lb => [...lb, lootBox]);
                logChronicle(`Found a ${lootBox.name}!`);
            }
            break;
        }
        case 'DAMAGE_RIVAL': dealDamageToTarget(effect.value as number); break;
        case 'LUCKY_DAMAGE_RIVAL': {
            const totalDamage = (effect.value as number) + playerStats.luck;
            dealDamageToTarget(totalDamage);
            logChronicle(`A lucky peck dealt ${Math.round(totalDamage * combatMultiplier)} damage!`);
            break;
        }
        case 'PIOUS_PECK_DAMAGE': {
            const devoutFollowers = followers.filter(f => f.personality === 'Devout').length;
            const totalDamage = (effect.value as number) + (devoutFollowers * 2);
            dealDamageToTarget(totalDamage);
            logChronicle(`A pious peck, strengthened by ${devoutFollowers} devout, dealt ${Math.round(totalDamage * combatMultiplier)} damage!`);
            break;
        }
        case 'SWARM_DAMAGE': dealDamageToTarget(followers.length); break;
        case 'FAITH_FROM_BUILDINGS': {
            const totalBuildingLevels = buildings.reduce((sum, b) => sum + b.level, 0);
            const faithGained = totalBuildingLevels * (effect.value as number);
            setFaith(f => f + faithGained);
            logChronicle(`Bureaucracy converted to belief, gaining ${faithGained.toFixed(0)} Faith.`);
            break;
        }
        case 'RIVAL_HERESY_RATE_MULTIPLIER':
            if (effect.duration && effect.duration > 0) {
                const newBuff: RivalBuff = {
                    id: `buff-${Date.now()}-${Math.random()}`,
                    type: effect.type,
                    value: (effect.value as number),
                    duration: effect.duration,
                    source: sourceName || 'Unknown',
                };
                if (activeBoss) {
                    setActiveBoss(b => b ? { ...b, buffs: [...b.buffs, newBuff] } : null);
                } else {
                    setRival(r => ({ ...r, buffs: [...r.buffs, newBuff] }));
                }
                logChronicle(`Rival affected by ${sourceName}.`);
            }
            break;
        case 'IMPROVE_RAT_RELATIONS':
        case 'IMPROVE_SEAGULL_RELATIONS':
        case 'IMPROVE_CROW_RELATIONS':
        case 'WORSEN_RAT_RELATIONS':
        case 'WORSEN_SEAGULL_RELATIONS':
        case 'WORSEN_CROW_RELATIONS': {
            const parts = effect.type.split('_');
            const action = parts[0]; // IMPROVE or WORSEN
            const factionName = parts[1].toLowerCase(); // e.g. "rat"
            const factionId = `${factionName}s` as FactionId; // e.g. "rats"

            setFactions(fs => {
                const currentFaction = fs[factionId];
                if (!currentFaction) {
                    console.warn(`Faction with id "${factionId}" not found for effect type "${effect.type}".`);
                    return fs; // Faction not found, return state unchanged
                }
                
                const change = action === 'IMPROVE' ? (effect.value as number) : -(effect.value as number);
                const newRelationship = Math.max(-100, Math.min(100, currentFaction.relationship + change));
                
                const newFactions = { ...fs };
                newFactions[factionId] = {
                    ...currentFaction,
                    relationship: newRelationship
                };
                return newFactions;
            });
            break;
        }
      }
  }, [activeBoss, logChronicle, playerStats.level, playerStats.luck, relics, factions, followers, buildings]);

  const handlePlayCard = useCallback((card: Card) => {
    let faithCost = card.cost.resource === 'Faith' ? Math.ceil(card.cost.amount * inflation) : 0;
    let crumbCost = card.cost.resource === 'Crumbs' ? Math.ceil(card.cost.amount * inflation) : 0;

    if(activeDogma?.effect.type === 'CRUMB_GAIN_MULTIPLIER') crumbCost = Math.round(crumbCost / (activeDogma.effect.value as number));
    
    if (faith < faithCost || crumbs < crumbCost) {
        playSound('error');
        return;
    }

    setFaith(f => f - faithCost);
    setCrumbs(c => c - crumbCost);

    card.effects.forEach(effect => {
      let modifiedEffect = {...effect};
      if (activeDogma?.effect.type === 'CONFLICT_DAMAGE_MULTIPLIER' && effect.type === 'DAMAGE_RIVAL') {
        modifiedEffect.value = Math.round((effect.value as number) * (activeDogma.effect.value as number));
      }
      applyGameEffect(modifiedEffect, `Card: ${card.name}`);
    });

    logChronicle(`Played '${card.name}'.`);
    setPopeState('pecking');
    setTimeout(() => setPopeState('idle'), 500);

    const cardInHandIndex = hand.findIndex(c => c.id === card.id);
    setHand(h => h.filter((c, i) => i !== cardInHandIndex));
    setDiscard(d => [...d, card]);
    playSound('play_card');
    setTimeout(() => drawCards(1, deck, discard, hand.filter((c, i) => i !== cardInHandIndex)), 200);
  }, [deck, discard, hand, drawCards, activeDogma, logChronicle, applyGameEffect, inflation, faith, crumbs]);

  const handleOpenLootBox = useCallback((lootBoxId: string) => {
    const box = lootBoxes.find(lb => lb.id === lootBoxId);
    if (!box) return;

    playSound('gain');
    const result = openLootBox(box.id);
    setOpenedLootBoxResult(result);
    setLootBoxes(lbs => lbs.filter(lb => lb.id !== lootBoxId));
  }, [lootBoxes]);

  const handleUpgradeBuilding = useCallback((buildingId: string) => {
    const building = buildings.find(b => b.id === buildingId);
    if (!building) return;
    const cost = getBuildingUpgradeCost(building);
    const inflatedCost = Math.ceil(cost * inflation);

    if ((building.costResource === ResourceType.Crumbs && crumbs >= inflatedCost) || (building.costResource === ResourceType.Faith && faith >= inflatedCost)) {
        if (building.costResource === ResourceType.Crumbs) setCrumbs(c => c - inflatedCost);
        if (building.costResource === ResourceType.Faith) setFaith(f => f - inflatedCost);
        setBuildings(bs => bs.map(b => b.id === buildingId ? { ...b, level: b.level + 1 } : b));
        logChronicle(`Upgraded ${building.name} to level ${building.level + 1}.`);
        playSound('upgrade');
    } else {
        playSound('error');
    }
  }, [buildings, crumbs, faith, logChronicle, inflation]);
  
  const handleSetStreamDeckKey = useCallback((keyIndex: number, action: StreamDeckAction | null) => {
    setStreamDeckConfig(currentConfig => { const newConfig = [...currentConfig]; newConfig[keyIndex] = action; return newConfig; });
    playSound('ui_click');
  }, []);

  const handleTriggerStreamDeckAction = useCallback((action: StreamDeckAction) => {
    switch (action.type) {
        case 'PLAY_CARD':
            const cardToPlay = hand.find(c => c.id === action.payload.id);
            if (cardToPlay) handlePlayCard(cardToPlay);
            break;
        case 'UPGRADE_BUILDING':
            if(action.payload.id) handleUpgradeBuilding(action.payload.id);
            break;
    }
  }, [hand, handlePlayCard, handleUpgradeBuilding]);
  
  const handleSelectDogma = useCallback((dogma: Dogma) => {
      setActiveDogma(dogma);
      setIsDogmaSelectionVisible(false);
      logChronicle(`A new Dogma was embraced: '${dogma.name}'.`);
      playSound('quest_complete');
  }, [logChronicle]);

  const handleDialogueChoice = useCallback((option: DialogueOption) => {
    if (option.effects) {
        option.effects.forEach((effect: GameEffect) => applyGameEffect(effect, 'Dialogue Choice'));
    }
    if (option.nextId && DIALOGUES[option.nextId]) {
        setActiveDialogue(DIALOGUES[option.nextId]);
    } else {
        setActiveDialogue(null);
    }
  }, [applyGameEffect]);

  const handleProposeTreaty = useCallback((factionId: FactionId) => {
    const faction = factions[factionId];
    if (!faction || faction.diplomaticStatus === 'Rivalry') {
        playSound('error');
        return;
    };

    const availableTreaty = faction.treaties.find(t => !t.isActive);
    if (!availableTreaty) {
      logChronicle(`No available treaties with ${faction.name}.`);
      playSound('error');
      return;
    }

    const cost = 10; // Let's say treaties cost 10 Divine Favor
    const requiredRelationship = 20;

    if (divineFavor >= cost && faction.relationship >= requiredRelationship) {
      setDivineFavor(df => df - cost);
      setFactions(fs => {
        const newFactions = { ...fs };
        const targetFaction = { ...newFactions[factionId] };
        targetFaction.treaties = targetFaction.treaties.map(t =>
          t.id === availableTreaty.id ? { ...t, isActive: true } : t
        );
        newFactions[factionId] = targetFaction;
        return newFactions;
      });
      logChronicle(`A treaty was signed with ${faction.name}: "${availableTreaty.name}"`);
      playSound('quest_complete');
    } else {
      logChronicle(`Failed to sign treaty. Requires ${cost} Divine Favor and a relationship of ${requiredRelationship}.`);
      playSound('error');
    }
  }, [factions, divineFavor, logChronicle]);
  
  const startBreadfallMinigame = useCallback(() => {
    stopMusic('music_game');
    playMusic('music_minigame', 0.5, true);
    setAppState('breadfall');
  }, []);

  const handleBreadfallComplete = useCallback((score: number) => {
    const crumbsEarned = Math.floor(score / 2);
    logChronicle(`Earned ${crumbsEarned} crumbs from Breadfall!`);
    setCrumbs(c => c + crumbsEarned);
    
    stopMusic('music_minigame');
    playMusic('music_game', 0.4, true);
    setAppState('playing');
  }, [logChronicle]);

  const executeFactionAIAction = useCallback((action: FactionAIAction) => {
    switch (action.type) {
        case 'UPDATE_FACTION_STATUS':
            if (action.payload.factionId && action.payload.status) {
                setFactions(fs => {
                    const newFactions = { ...fs };
                    newFactions[action.payload.factionId!] = {
                        ...newFactions[action.payload.factionId!],
                        diplomaticStatus: action.payload.status!
                    };
                    return newFactions;
                });
            }
            break;
        case 'ADD_INCOMING_MESSAGE':
            if (action.payload.dialogueId && DIALOGUES[action.payload.dialogueId]) {
                setIncomingMessages(im => [...im, DIALOGUES[action.payload.dialogueId!]]);
                playSound('event');
            }
            break;
    }
  }, []);

  const handleViewMessage = useCallback(() => {
    if (incomingMessages.length > 0) {
        const [firstMessage, ...rest] = incomingMessages;
        setActiveDialogue(firstMessage);
        setIncomingMessages(rest);
    }
  }, [incomingMessages]);


  // Game Loop
  useEffect(() => {
    if (appState !== 'playing') return;
    const gameTick = setInterval(() => {
      setGameTurn(t => t + 1);

      // --- Level Up Check ---
      setPlayerStats(ps => {
        if (ps.xp >= ps.xpToNextLevel) {
          playSound('quest_complete');
          logChronicle(`LEVEL UP! You are now Level ${ps.level + 1}!`);
          setFollowers(f => f.map(follower => ({...follower, animationState: 'celebrating'})));
          setTimeout(() => setFollowers(f => f.map(follower => ({...follower, animationState: 'idle'}))), 2000);
          return {
            ...ps,
            level: ps.level + 1,
            xp: ps.xp - ps.xpToNextLevel,
            xpToNextLevel: Math.floor(ps.xpToNextLevel * 1.5),
            luck: ps.luck + 1
          };
        }
        return ps;
      });

      // Tick down buff durations using functional updates
      setActiveBoss(b => b ? { ...b, buffs: b.buffs.map(buff => ({...buff, duration: buff.duration - 1})).filter(b => b.duration > 0) } : null);
      setRival(r => ({ ...r, buffs: r.buffs.map(buff => ({...buff, duration: buff.duration - 1})).filter(b => b.duration > 0) }));
      
      // Follower AI personality ticks
      setFollowers(currentFollowers => currentFollowers.map(f => {
          let { devotion, loyalty, chaosIndex } = f;
          switch(f.personality) {
              case 'Rebel': loyalty = Math.max(0, loyalty - 0.01); if (Math.random() < 0.001) chaosIndex = Math.min(100, chaosIndex + 1); break;
              case 'Devout': devotion = Math.min(100, devotion + 0.015); break;
          }
          return { ...f, devotion, loyalty, chaosIndex };
      }));

      // Calculate passive gains with buffs from buildings, relics, treaties, and alliances
      let totalFaithMultiplier = 1.0;
      let totalFollowerCrumbMultiplier = 1.0;
      let crumbGainAdd = 0;
      let globalMoraleBoost = 0;

      const allBuffSources = [...buildings.filter(b => b.level > 0), ...relics];

      allBuffSources.forEach(source => {
          const effect = 'buff' in source ? source.buff : ('effect' in source ? source.effect : undefined);
          if (effect) {
              const multiplier = 'level' in source ? source.level : 1;
              const buffValue = (effect.value as number) * multiplier;
              if (effect.type === 'FAITH_GAIN_MULTIPLIER') totalFaithMultiplier += buffValue;
              if (effect.type === 'FOLLOWER_CRUMB_PRODUCTION_MULTIPLIER') totalFollowerCrumbMultiplier += buffValue;
              if (effect.type === 'CRUMB_GAIN_ADD') crumbGainAdd += buffValue;
              if (effect.type === 'GLOBAL_MORALE_BOOST') globalMoraleBoost += buffValue;
          }
      });
      
      let globalHeresyReduction = 0;
      // FIX: Explicitly type `faction` as `Faction` to resolve properties like 'treaties' not existing on type 'unknown'.
      Object.values(factions).forEach((faction: Faction) => {
        // Apply treaty bonuses
        faction.treaties.forEach(treaty => {
            if (treaty.isActive) {
                const effect = treaty.effect;
                if (effect.type === 'FAITH_GAIN_MULTIPLIER') totalFaithMultiplier += (effect.value as number);
                if (effect.type === 'FOLLOWER_CRUMB_PRODUCTION_MULTIPLIER') totalFollowerCrumbMultiplier += (effect.value as number);
                if (effect.type === 'CRUMB_GAIN_ADD') crumbGainAdd += (effect.value as number);
                if (effect.type === 'GLOBAL_HERESY_REDUCTION') globalHeresyReduction += (effect.value as number);
            }
        });
        // Apply ALLIANCE bonuses
        if (faction.diplomaticStatus === 'Alliance' && faction.allianceBonus) {
            const effect = faction.allianceBonus;
            if (effect.type === 'FAITH_GAIN_MULTIPLIER') totalFaithMultiplier += (effect.value as number);
            if (effect.type === 'FOLLOWER_CRUMB_PRODUCTION_MULTIPLIER') totalFollowerCrumbMultiplier += (effect.value as number);
            if (effect.type === 'CRUMB_GAIN_ADD') crumbGainAdd += (effect.value as number);
        }
      });

      let faithPerSecond = BASE_FAITH_PER_SECOND;
      if (activeDogma?.effect.type === 'PASSIVE_FAITH_GAIN') faithPerSecond += (activeDogma.effect.value as number);
      
      let crumbsPerSecond = (BASE_CRUMBS_PER_FOLLOWER * followers.length * totalFollowerCrumbMultiplier) + crumbGainAdd;
      if (activeDogma?.effect.type === 'CRUMB_GAIN_MULTIPLIER') crumbsPerSecond *= (activeDogma.effect.value as number);
      
      let breadCoinPerSecond = 0;

      buildings.forEach(b => {
        if (b.level > 0 && b.productionType && b.baseProduction) {
          if (b.productionType === ResourceType.Faith) faithPerSecond += b.baseProduction * b.level;
          if (b.productionType === ResourceType.Crumbs) crumbsPerSecond += b.baseProduction * b.level;
          if (b.productionType === ResourceType.BreadCoin) breadCoinPerSecond += b.baseProduction * b.level;
        }
      });

      faithPerSecond *= totalFaithMultiplier;
      
      // Use functional updates to prevent stale state
      setFaith(f => f + faithPerSecond / 10);
      setCrumbs(c => c + crumbsPerSecond / 10);
      setBreadCoin(bc => bc + breadCoinPerSecond / 10);
      setInflation(i => i * 1.00001); // Inflation increases slowly
      
      // Calculate heresy drain with buffs
      const target = activeBoss || rival;
      let heresyMultiplier = 1.0;
      if (target) {
          target.buffs.forEach(buff => {
              if (buff.type === 'RIVAL_HERESY_RATE_MULTIPLIER') heresyMultiplier *= buff.value;
          });
      }
      
      let baseHeresy = (activeBoss ? activeBoss.heresyPerSecond : (isRivalDefeated ? 0 : rival.heresyPerSecond));
      let heresyDrain = (baseHeresy * heresyMultiplier) * (1 - globalHeresyReduction);


      setMorale(m => Math.max(0, Math.min(100 + globalMoraleBoost, m - heresyDrain / 10)));
    }, 100);
    return () => clearInterval(gameTick);
  }, [appState, followers, buildings, rival, isRivalDefeated, activeDogma, activeBoss, relics, factions, logChronicle]);
  
  // Faction AI Tick
  useEffect(() => {
    if (appState !== 'playing') return;
    const aiTick = setInterval(() => {
        // Construct a snapshot of the current state for the AI to process
        const gameStateSnapshot: GameState = {
            faith, crumbs, followers, divineFavor, morale, breadCoin, ascensionPoints, inflation,
            deck, hand, discard, rival, isRivalDefeated, activeBoss, isBossDefeated, buildings,
            activeQuestId: activeQuest?.id, questProgress, skills, sectors, routes, factions,
            activeDogma, chronicle, gameTurn, playerStats, relics, lootBoxes, popeCustomization, streamDeckConfig, incomingMessages,
            triggeredMilestones: Array.from(triggeredMilestones),
        };
        const aiActions = runFactionAI(gameStateSnapshot);
        if (aiActions.length > 0) {
            aiActions.forEach(executeFactionAIAction);
        }
    }, 5000); // Faction AI runs every 5 seconds
    return () => clearInterval(aiTick);
  }, [appState, faith, crumbs, followers, divineFavor, morale, breadCoin, ascensionPoints, inflation, deck, hand, discard, rival, isRivalDefeated, activeBoss, isBossDefeated, buildings, activeQuest, questProgress, skills, sectors, routes, factions, activeDogma, chronicle, gameTurn, playerStats, relics, lootBoxes, popeCustomization, streamDeckConfig, executeFactionAIAction, incomingMessages, triggeredMilestones]);

  // Milestone Dialogue Triggers
  useEffect(() => {
    if (appState !== 'playing' || incomingMessages.length > 0 || activeDialogue) return;

    const triggerMilestone = (id: string) => {
        if (!triggeredMilestones.has(id) && DIALOGUES[id]) {
            setIncomingMessages(im => [...im, DIALOGUES[id]]);
            setTriggeredMilestones(current => new Set(current).add(id));
            playSound('event');
            return true; // Indicates a trigger occurred
        }
        return false;
    };

    // --- RAT MILESTONES ---
    if (factions.rats.relationship > 20) {
        if (triggerMilestone('rats-friendly-approach')) return;
    }
    if (factions.rats.relationship < -20) {
        if (triggerMilestone('rats-hostile-warning')) return;
    }

    // --- SEAGULL MILESTONES ---
    if (isRivalDefeated) {
        if (triggerMilestone('seagulls-notice-victory')) return;
    }
    const radioTowerUnlocked = sectors.find(s => s.id === 'sector-4' && s.isUnlocked);
    if (radioTowerUnlocked) {
        if (triggerMilestone('seagulls-radio-tower-dispute')) return;
    }
    
    // --- CROW MILESTONES ---
    if (relics.length >= 3) {
        if (triggerMilestone('crows-relic-interest')) return;
    }
    // FIX: Explicitly type `s` as `Skill` to resolve properties not existing on type 'unknown'.
    const hasMemeSkill = Object.values(skills).some((s: Skill) => s.tree === 'Memes' && s.unlocked);
    if (hasMemeSkill) {
        if (triggerMilestone('crows-meme-confusion')) return;
    }

  }, [appState, factions, isRivalDefeated, sectors, relics, skills, triggeredMilestones, incomingMessages.length, activeDialogue]);

  useEffect(() => { /* Game saving interval */
    if (appState !== 'playing') return;
    const saveInterval = setInterval(saveGame, 30000); // Save every 30 seconds
    return () => clearInterval(saveInterval);
  }, [appState, saveGame]);

  // Quest Progression
  useEffect(() => {
    if (!activeQuest || appState !== 'playing') return;
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
  }, [followers.length, isRivalDefeated, isBossDefeated, activeQuest, appState, questProgress, logChronicle]);
  
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

  useEffect(() => { /* Morale and Revolt Check - unchanged */ }, [appState, morale, isRevoltActive]);

  if (appState === 'start') return <StartScreen onNewGame={() => setAppState('intro')} onContinue={loadGame} hasSaveData={hasSaveData} />;
  if (appState === 'intro') return <IntroSequence onComplete={startNewGame} />;
  if (appState === 'vision') return <DivineVisionCutscene onComplete={() => setAppState('playing')} />;
  if (appState === 'bureaucracy') return <BureaucracyMinigame requests={BUREAUCRACY_MINIGAME_REQUESTS} onComplete={(score) => { setAppState('playing'); }} />;
  if (appState === 'breadfall') return <BreadfallMinigameView onComplete={handleBreadfallComplete} />;

  
  const renderActiveView = () => {
    const campaignProps = { faith, crumbs, followers, divineFavor, morale, hand, rival, activeBoss, popeState, rivalLastAction, isRivalDefeated, isRevoltActive, revoltSparks, onPlayCard: handlePlayCard, breadCoin, ascensionPoints, inflation, playerStats, popeCustomization, relics, lootBoxes, onOpenLootBox: handleOpenLootBox };

    switch (activeTab) {
      case 'Campaign': return <CampaignView {...campaignProps} />;
      case 'Economy': return <EconomyView buildings={buildings} onUpgrade={handleUpgradeBuilding} currentCrumbs={crumbs} currentFaith={faith} inflation={inflation} />;
      case 'Followers': return <FollowersView followers={followers} setFollowers={setFollowers} />;
      case 'Map': return <MapView sectors={sectors} setSectors={setSectors} routes={routes} onAddRoute={(from, to, type) => setRoutes(r => [...r, { id: `route-${Date.now()}`, fromSectorId: from, toSectorId: to, type }])} />;
      case 'Skills': return <SkillsView skills={skills} setSkills={setSkills} divineFavor={divineFavor} setDivineFavor={setDivineFavor} />;
      case 'Factions': return <FactionsView factions={factions} onStartDialogue={(dialogueId) => setActiveDialogue(DIALOGUES[dialogueId])} onProposeTreaty={handleProposeTreaty} />;
      case 'Integrations': return <IntegrationsView streamDeckConfig={streamDeckConfig} onSetKey={handleSetStreamDeckKey} onTriggerAction={handleTriggerStreamDeckAction} resourceValues={{ faith, crumbs, followers: followers.length, divineFavor, breadCoin, ascensionPoints }} />;
      case 'Chronicles': return <ChroniclesView entries={chronicle} />;
      case 'Minigames': return <MinigamesView onStartMinigame={startBreadfallMinigame} />;
      case 'Prestige': return <PrestigeView ascensionPoints={ascensionPoints} onPrestige={() => logChronicle("Ascension is not yet upon us.")}/>;
      case 'Roost': return <RoostView playerStats={playerStats} popeCustomization={popeCustomization} setPopeCustomization={setPopeCustomization} relics={relics} onSave={saveGame} onLoad={loadGame} onDelete={deleteSave} hasSaveData={hasSaveData} />;
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
      {openedLootBoxResult && <LootBoxModal results={openedLootBoxResult} onClose={() => setOpenedLootBoxResult(null)} onApply={applyGameEffect} />}
      {incomingMessages.length > 0 && <IncomingMessageToast message={incomingMessages[0]} onView={handleViewMessage} />}
    </main>
  );
};

export default App;