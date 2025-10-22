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
    type: string; // e.g., 'GAIN_FAITH', 'GAIN_FOLLOWERS', 'DAMAGE_RIVAL'
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

// New Types for UI Restructure and Features

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
    isExplored: boolean;
    resources: Partial<Record<ResourceType, number>>;
    rivalPresence: number; // 0-100
}

export type ActiveTab = 'Campaign' | 'Economy' | 'Followers' | 'Map' | 'Skills' | 'Endgame' | 'Analytics';
