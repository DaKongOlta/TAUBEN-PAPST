// types.ts

export enum ResourceType {
  Faith = 'Faith',
  Crumbs = 'Crumbs',
  DivineFavor = 'DivineFavor',
}

export interface CardCost {
  amount: number;
  resource: ResourceType;
}

export type CardType = 'Miracle' | 'Propaganda' | 'Ritual' | 'Conflict';

export interface GameEffect {
    type: string; // e.g., 'GAIN_FAITH', 'GAIN_FOLLOWERS', 'DAMAGE_RIVAL', 'CRUMB_GAIN_MULTIPLIER', 'IMPROVE_RAT_RELATIONS'
    value: number;
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

export type FollowerAnimationState = 'idle' | 'pecking' | 'looking' | 'flapping' | 'chaotic';

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
  productionType: ResourceType;
  baseProduction: number; // per second
  baseCost: number;
  costResource: ResourceType;
  costMultiplier: number;
  level: number;
}

// UI Restructure and Features

export interface Follower {
    id: string;
    name: string;
    devotion: number; // 0-100, affects productivity
    chaosIndex: number; // 0-100, high values can lead to negative events
    loyalty: number; // 0-100, low loyalty leads to revolts or leaving
    productivity: number; // base crumb generation multiplier
    animationState: FollowerAnimationState;
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

export type ActiveTab = 'Campaign' | 'Economy' | 'Followers' | 'Map' | 'Skills' | 'Integrations' | 'Factions' | 'Chronicles';

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

export interface Faction {
    id: FactionId;
    name: string;
    description: string;
    art: string;
    relationship: number; // -100 (War) to 100 (Alliance)
    isHostileByDefault: boolean;
    power: number;
    dialogueId: string;
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
