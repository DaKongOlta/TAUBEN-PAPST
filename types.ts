// types.ts

export enum ResourceType {
  Faith = 'Faith',
  Crumbs = 'Crumbs',
  DivineFavor = 'DivineFavor',
  BreadCoin = 'BreadCoin',
  AscensionPoints = 'AscensionPoints',
}

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  luck: number;
}

export interface PopeCustomization {
  hatColor: string;
}

export interface Relic {
  id: string;
  name: string;
  art: string;
  description: string;
  effect: GameEffect;
}

export interface LootBox {
  id: string;
  name: string;
  art: string;
  description: string;
}

export interface RivalBuff {
  id: string;
  type: string; // e.g. 'HERESY_RATE_MULTIPLIER'
  value: number;
  duration: number; // in game turns
  source: string; // e.g. "Card: Divine Smog"
}

export interface CardCost {
  amount: number;
  resource: ResourceType;
}

export type CardType = 'Miracle' | 'Propaganda' | 'Ritual' | 'Conflict';

export interface GameEffect {
    type: string; // e.g., 'GAIN_FAITH', 'GAIN_XP', 'GAIN_RELIC', 'GAIN_LOOTBOX'
    value: number | string; // Can be a number or an ID (e.g., relicId)
    duration?: number;
}

export interface Card {
  id: string;
  name: string;
  type: CardType;
  art: string;
  description: string;
  cost: CardCost;
  effects: GameEffect[];
}

export interface EventChoice {
  text: string;
  description: string;
  effects: GameEffect[];
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  art: string;
  choices: EventChoice[];
}

export interface RivalSect {
  name: string;
  faith: number;
  heresyPerSecond: number;
  hand: Card[];
  deck: Card[];
  lastActionTimestamp: number;
  buffs: RivalBuff[];
}

export enum WeatherType {
  BREAD_STORM = 'BREAD_STORM',
  MORNING_SUNLIGHT = 'MORNING_SUNLIGHT',
  FAITH_ECLIPSE = 'FAITH_ECLIPSE',
  DUST_DEVIL = 'DUST_DEVIL',
}

export interface WeatherEffectDefinition {
  id: string;
  name: string;
  description: string;
  art: string;
  type: WeatherType;
  duration: number;
  faithGainMultiplier?: number;
  crumbGainMultiplier?: number;
  rivalFaithGainMultiplier?: number;
  heresyPerSecondAdd?: number;
}

export interface ActiveWeatherEvent extends WeatherEffectDefinition {
    // inherits from definition, duration will be the countdown value
}

export enum QuestObjectiveType {
  REACH_FOLLOWERS = 'REACH_FOLLOWERS',
  DEFEAT_RIVAL = 'DEFEAT_RIVAL',
  DEFEAT_BOSS = 'DEFEAT_BOSS',
  PLAY_CARDS = 'PLAY_CARDS',
}

export interface QuestObjective {
  type: QuestObjectiveType;
  description: string;
  targetValue: number;
}

export interface QuestReward {
    divineFavor?: number;
    crumbs?: number;
    faith?: number;
    unlockCardIds?: string[];
}

export interface Quest {
  id: string;
  name: string;
  description: string;
  unlocksAfter: string | undefined;
  objectives: QuestObjective[];
  reward: QuestReward;
}

export type FollowerAnimationState = 'idle' | 'pecking' | 'looking' | 'flapping' | 'chaotic' | 'celebrating';

export interface BureaucracyRequest {
    id: string;
    title: string;
    description: string;
    correctAction: 'approve' | 'deny';
}

export interface Building {
  id: string;
  name: string;
  description: string;
  art: string;
  productionType?: ResourceType; // Made optional for buildings that only provide buffs
  baseProduction?: number; // per second
  baseCost: number;
  costResource: ResourceType;
  costMultiplier: number;
  level: number;
  buff?: {
    type: string; // e.g., 'FAITH_GAIN_MULTIPLIER', 'FOLLOWER_CRUMB_PRODUCTION_MULTIPLIER'
    value: number; // The amount of buff per level, e.g., 0.05 for a 5% boost per level
  };
}

// UI Restructure and Features
export type FollowerPersonality = 'Devout' | 'Lazy' | 'Rebel' | 'Standard';
export interface FollowerEmotions {
    joy: number; // 0-100
    fear: number; // 0-100
}

export interface Follower {
    id: string;
    name: string;
    devotion: number; // 0-100, affects productivity
    chaosIndex: number; // 0-100, high values can lead to negative events
    loyalty: number; // 0-100, low loyalty leads to revolts or leaving
    productivity: number; // base crumb generation multiplier
    animationState: FollowerAnimationState;
    personality: FollowerPersonality;
    emotions: FollowerEmotions;
}

export type SkillTreeType = 'Automation' | 'Propaganda' | 'Combat' | 'Memes';

export interface Skill {
    id: string;
    name:string;
    description: string;
    art: string;
    tree: SkillTreeType;
    cost: number; // in Divine Favor
    unlocked: boolean;
    dependencies: string[]; // IDs of skills required to unlock this one
    cooldown?: number; // in seconds
    lastUsed?: number; // timestamp
    position: { row: number, col: number };
}

export interface MapSector {
    id: string;
    name: string;
    art: string;
    description: string;
    isUnlocked: boolean;
    resources: Partial<Record<ResourceType, number>>; // Base resource value
    rivalPresence: number; // 0-100
    noise: number; // 0-100
    maxInfrastructureSlots: number;
    buildings: string[]; // IDs of buildings in this sector
    position: { x: number, y: number }; // For non-grid layout
    activeEvent?: { id: string, name: string, art: string }; // For seagull swarms, etc.
}

export type ActiveTab = 'Campaign' | 'Economy' | 'Followers' | 'Map' | 'Skills' | 'Integrations' | 'Factions' | 'Chronicles' | 'Minigames' | 'Prestige' | 'Roost';

export type RouteType = 'Pilgrim' | 'Antenna' | 'CrumbTransport';

export interface MapRoute {
    id: string;
    type: RouteType;
    fromSectorId: string;
    toSectorId:string;
}

export interface MapEventDefinition {
    id: string;
    name: string;
    description: string;
    art: string;
    duration: number; // in seconds
    applyEffect: (sectors: MapSector[]) => MapSector[]; // Function to modify sectors
}

// Stream Deck Feature
export type StreamDeckActionType = 'PLAY_CARD' | 'UPGRADE_BUILDING' | 'BASIC_ACTION' | 'SHOW_RESOURCE';

export interface StreamDeckAction {
  type: StreamDeckActionType;
  label: string;
  icon: string; // Emoji
  payload: {
    id?: string; // cardId, buildingId
    resource?: ResourceType | 'Followers';
    actionName?: 'Pray' | 'Scrounge';
  };
}

// New Features

// Factions & Diplomacy
export type FactionId = 'rats' | 'seagulls' | 'crows';
export type DiplomaticStatus = 'Neutral' | 'Rivalry' | 'Alliance';

export interface Treaty {
    id: string;
    name: string;
    description: string;
    effect: GameEffect;
    isActive: boolean;
}

export interface Faction {
    id: FactionId;
    name: string;
    description: string;
    art: string;
    relationship: number; // -100 (War) to 100 (Alliance)
    diplomaticStatus: DiplomaticStatus;
    isHostileByDefault: boolean;
    power: number;
    dialogueId: string;
    treaties: Treaty[];
    allianceBonus?: GameEffect;
}

// Faction AI
export interface FactionAIAction {
    type: 'UPDATE_FACTION_STATUS' | 'ADD_INCOMING_MESSAGE';
    payload: {
        factionId?: FactionId;
        status?: DiplomaticStatus;
        dialogueId?: string;
    };
}

// Dogmas
export interface Dogma {
    id: string;
    name: string;
    description: string;
    art: string;
    effect: GameEffect;
}

// Chronicles
export interface ChronicleEntry {
    id: string;
    turn: number;
    text: string;
}

// Dialogue System
export interface DialogueOption {
    text: string;
    nextId: string | null;
    effects?: GameEffect[];
}

export interface DialogueNode {
    id: string;
    speaker: string;
    art: string;
    text: string;
    options: DialogueOption[];
}

// Boss Fights
export interface Boss extends RivalSect {
    isBoss: true;
    art: string;
    specialAbilities: { 
      id: string;
      name: string; 
      description: string; 
      cooldown: number; // in turns
      lastUsed: number;
    }[];
}

// Breadfall Minigame
export type FallingItemType = 'crumb' | 'golden_crumb' | 'anvil';
export interface FallingItem {
    id: number;
    type: FallingItemType;
    x: number;
    y: number;
    rotation: number;
}


export type AppState = 'start' | 'intro' | 'playing' | 'bureaucracy' | 'vision' | 'breadfall';

export interface GameState {
    faith: number;
    crumbs: number;
    followers: Follower[];
    divineFavor: number;
    morale: number;
    breadCoin: number;
    ascensionPoints: number;
    inflation: number;
    deck: Card[];
    hand: Card[];
    discard: Card[];
    rival: RivalSect;
    isRivalDefeated: boolean;
    activeBoss: Boss | null;
    isBossDefeated: boolean;
    buildings: Building[];
    activeQuestId: string | undefined;
    questProgress: Partial<Record<QuestObjectiveType, number>>;
    skills: Record<string, Skill>;
    sectors: MapSector[];
    routes: MapRoute[];
    factions: Record<string, Faction>;
    activeDogma: Dogma | null;
    chronicle: ChronicleEntry[];
    gameTurn: number;
    playerStats: PlayerStats;
    relics: Relic[];
    lootBoxes: LootBox[];
    popeCustomization: PopeCustomization;
    streamDeckConfig: Array<StreamDeckAction | null>;
    incomingMessages: DialogueNode[];
    triggeredMilestones: string[];
}