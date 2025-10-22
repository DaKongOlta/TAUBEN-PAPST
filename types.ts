import React from 'react';

export enum CardType {
  Miracle = 'Miracle',
  Propaganda = 'Propaganda',
  Ritual = 'Ritual',
  Conflict = 'Conflict',
}

export enum ResourceType {
  Faith = 'Faith',
  Crumbs = 'Crumbs',
  Followers = 'Followers',
  Heresy = 'Heresy',
}

export interface CardCost {
  resource: ResourceType;
  amount: number;
}

export enum EffectType {
  // Player Resource Gain
  ADD_FAITH = 'ADD_FAITH',
  ADD_CRUMBS = 'ADD_CRUMBS',
  ADD_FOLLOWERS = 'ADD_FOLLOWERS',

  // Player Rate Boost
  BOOST_FPC = 'BOOST_FPC', // Faith per click (not used)
  BOOST_CPS = 'BOOST_CPS', // Crumbs per second
  BOOST_FPS = 'BOOST_FPS', // Faith per second

  // Player Temporary Boost
  TEMP_FPS_ADD = 'TEMP_FPS_ADD',

  // Player Deck Manipulation
  DRAW_CARDS = 'DRAW_CARDS',

  // Player vs Rival
  ATTACK_RIVAL = 'ATTACK_RIVAL',
  REDUCE_HERESY = 'REDUCE_HERESY',
  
  // Rival vs Player
  STEAL_FOLLOWERS = 'STEAL_FOLLOWERS',
  ADD_HERESY_FLAT = 'ADD_HERESY_FLAT',
  BOOST_HERESY_PER_SECOND = 'BOOST_HERESY_PER_SECOND',
  ATTACK_PLAYER_FAITH = 'ATTACK_PLAYER_FAITH',
  STEAL_CRUMBS = 'STEAL_CRUMbs',

  // Relic/Meta Effects
  STARTING_CRUMBS = 'STARTING_CRUMBS',
  BASE_FPS_ADD = 'BASE_FPS_ADD',
  CRUMB_GAIN_MULTIPLIER = 'CRUMB_GAIN_MULTIPLIER',
  REDUCE_MORALE_DECAY = 'REDUCE_MORALE_DECAY', // New relic effect
}

export interface CardEffect {
  type: EffectType;
  value: number;
  duration?: number; // for temporary effects
}

export interface Card {
  id: string;
  name: string;
  description: string;
  type: CardType;
  cost: CardCost;
  effect: CardEffect;
  art: string; // Emoji or simple character
}

export interface Relic {
  id: string;
  name:string;
  description: string;
  art: string;
  effect: {
    type: EffectType;
    value: number;
  }
}

export interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  costResource: ResourceType;
  effect: {
    type: 'ADD_FPS' | 'ADD_CPC' | 'ADD_FOLLOWERS';
    value: number;
  };
  owned: number;
}

export interface MetaUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  maxLevel: number;
  level: number;
  effect: (level: number) => string;
}

// For temporary boosts
export interface TemporaryEffect {
  id: string;
  description: string;
  type: EffectType.TEMP_FPS_ADD;
  value: number;
  duration: number;
  sourceName: string;
}


// For events
export interface EventChoice {
    text: string;
    effects: {
        type: EffectType;
        value: number;
    }[];
    description: string; // "You gain 50 crumbs"
}

export interface GameEvent {
    id: string;
    title: string;
    description: string;
    art: string;
    choices?: EventChoice[];
    minigame?: 'bureaucracy';
}

// For Rivals
export interface RivalSect {
    id: string;
    name: string;
    art: string;
    faith: number;
    deck: Card[];
    hand: Card[];
    discard: Card[];
    heresyPerSecond: number; // Base rate, can be modified by cards
}

// For Weather
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
    duration: number; // total duration
    crumbGainMultiplier?: number;
    faithGainMultiplier?: number;
    rivalFaithGainMultiplier?: number;
    heresyPerSecondAdd?: number;
}

export interface ActiveWeatherEvent {
    id: string; // from the definition
    type: WeatherType;
    name: string;
    description: string;
    art: string;
    duration: number; // remaining duration
    initialDuration: number; // for UI
}

// For Quests
export enum QuestObjectiveType {
    REACH_FOLLOWERS = 'REACH_FOLLOWERS',
    DEFEAT_RIVAL = 'DEFEAT_RIVAL',
}

export interface QuestObjective {
    type: QuestObjectiveType;
    description: string;
    targetValue: number;
}

export interface Quest {
    id: string;
    name: string;
    description: string;
    objectives: QuestObjective[];
    unlocksAfter?: string; // ID of the prerequisite quest
    reward: {
        divineFavor?: number;
        relicId?: string;
    };
}

// For Flock AI
export type FollowerAnimationState = 'idle' | 'pecking' | 'looking' | 'flapping';

export interface Follower {
    id: string;
    x: number;
    y: number;
    targetX: number;
    targetY: number;
    animationDelay: string;
    animationState: FollowerAnimationState;
    animationEndTimestamp?: number;
}

// For Bureaucracy Minigame
export interface BureaucracyRequest {
    id: string;
    title: string;
    description: string;
    correctAction: 'approve' | 'deny';
}