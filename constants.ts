// constants.ts
import type { Card, RivalSect, BureaucracyRequest, Building, Follower, FollowerPersonality } from './types';
import { ResourceType } from './types';

// Gameplay constants
export const STARTING_FAITH = 10;
export const STARTING_CRUMBS = 25; // Increased starting crumbs for tycoon mode
export const STARTING_FOLLOWERS = 1;
export const STARTING_MORALE = 75;
export const STARTING_DIVINE_FAVOR = 0;
export const STARTING_BREAD_COIN = 0;
export const STARTING_ASCENSION_POINTS = 0;
export const BASE_FAITH_PER_SECOND = 0.5;
export const BASE_CRUMBS_PER_FOLLOWER = 0.1;

export const MAX_HAND_SIZE = 5;

// Cards
export const ALL_CARDS: { [id: string]: Card } = {
  'card-001': {
    id: 'card-001',
    name: 'Minor Blessing',
    type: 'Miracle',
    art: '✨',
    description: 'A small blessing to bolster the flock.',
    cost: { amount: 5, resource: ResourceType.Faith },
    effects: [{ type: 'GAIN_MORALE', value: 10 }, { type: 'GAIN_XP', value: 5 }],
  },
  'card-002': {
    id: 'card-002',
    name: 'Scrounge for Crumbs',
    type: 'Ritual',
    art: '🧐',
    description: 'Command your followers to search for sustenance.',
    cost: { amount: 0, resource: ResourceType.Crumbs },
    effects: [{ type: 'GAIN_CRUMBS', value: 10 }, { type: 'GAIN_XP', value: 2 }],
  },
  'card-003': {
    id: 'card-003',
    name: 'Inspiring Sermon',
    type: 'Propaganda',
    art: '🗣️',
    description: 'Recruit a new follower with a powerful speech.',
    cost: { amount: 10, resource: ResourceType.Faith },
    effects: [{ type: 'GAIN_FOLLOWERS', value: 1 }, { type: 'GAIN_XP', value: 10 }],
  },
  'card-004': {
    id: 'card-004',
    name: 'Righteous Peck',
    type: 'Conflict',
    art: '💥',
    description: 'Inflict a small amount of holy damage to the rival sect.',
    cost: { amount: 15, resource: ResourceType.Faith },
    effects: [{ type: 'DAMAGE_RIVAL', value: 10 }, { type: 'GAIN_XP', value: 8 }],
  },
  'card-005': {
    id: 'card-005',
    name: 'Holy Smokescreen',
    type: 'Ritual',
    art: '🌫️',
    description: 'Obscure the rival\'s vision, reducing their Heresy generation for 20 turns.',
    cost: { amount: 25, resource: ResourceType.Faith },
    effects: [{ type: 'RIVAL_HERESY_RATE_MULTIPLIER', value: 0.5, duration: 20 }, { type: 'GAIN_XP', value: 15 }]
  },
  'card-006': {
    id: 'card-006',
    name: 'Lucky Peck',
    type: 'Conflict',
    art: '🍀',
    description: 'A peck guided by fate. Deals 5 base damage + your total Luck.',
    cost: { amount: 10, resource: ResourceType.Faith },
    effects: [{ type: 'LUCKY_DAMAGE_RIVAL', value: 5 }, { type: 'GAIN_XP', value: 10 }],
  },
  'card-007': {
    id: 'card-007',
    name: 'Mysterious Egg',
    type: 'Miracle',
    art: '🥚',
    description: 'A strange, shimmering egg appears. What could be inside?',
    cost: { amount: 20, resource: ResourceType.Crumbs },
    effects: [{ type: 'GAIN_LOOTBOX', value: 'coocoo_crate' }, { type: 'GAIN_XP', value: 20 }],
  },
  'card-008': {
    id: 'card-008',
    name: 'Recruiter\'s Rally',
    type: 'Propaganda',
    art: '📣',
    description: 'Your reputation precedes you. Gain 1 follower for every 2 levels you have.',
    cost: { amount: 50, resource: ResourceType.Faith },
    effects: [{ type: 'GAIN_FOLLOWERS_BY_LEVEL', value: 0.5 }, { type: 'GAIN_XP', value: 25 }],
  },
  'card-009': {
    id: 'card-009',
    name: 'Pious Peck',
    type: 'Conflict',
    art: '🙏💥',
    description: 'Deals 8 damage, plus 2 extra damage for each Devout follower in your flock.',
    cost: { amount: 20, resource: ResourceType.Faith },
    effects: [{ type: 'PIOUS_PECK_DAMAGE', value: 8 }],
  },
  'card-010': {
    id: 'card-010',
    name: 'Featherduster\'s Fury',
    type: 'Conflict',
    art: '💨',
    description: 'A whirlwind of feathers! Deals damage equal to the number of followers you have.',
    cost: { amount: 30, resource: ResourceType.Faith },
    effects: [{ type: 'SWARM_DAMAGE', value: 1 }],
  },
  'card-011': {
    id: 'card-011',
    name: 'Bureaucratic Blessing',
    type: 'Ritual',
    art: '📜✨',
    description: 'Harness the power of paperwork. Gain Faith equal to 5x your total building levels.',
    cost: { amount: 15, resource: ResourceType.Crumbs },
    effects: [{ type: 'FAITH_FROM_BUILDINGS', value: 5 }],
  },
  'card-012': {
    id: 'card-012',
    name: 'Holy Rave',
    type: 'Miracle',
    art: '🎶🕺',
    description: 'All followers become 50% more productive for 30 seconds.',
    cost: { amount: 40, resource: ResourceType.Faith },
    effects: [{ type: 'PRODUCTIVITY_BURST', value: 1.5, duration: 30 }],
  },
  'card-013': {
    id: 'card-013',
    name: 'Meme Warfare',
    type: 'Ritual',
    art: '😂🔥',
    description: 'Confuse the rival sect with bizarre propaganda, reducing their Heresy generation by 75% for 15 turns.',
    cost: { amount: 35, resource: ResourceType.Faith },
    effects: [{ type: 'RIVAL_HERESY_RATE_MULTIPLIER', value: 0.25, duration: 15 }],
  },
};

export const initialDeck: Card[] = [
  ALL_CARDS['card-001'],
  ALL_CARDS['card-001'],
  ALL_CARDS['card-002'],
  ALL_CARDS['card-002'],
  ALL_CARDS['card-003'],
  ALL_CARDS['card-007'], // Start with a loot box card
  ALL_CARDS['card-009'],
  ALL_CARDS['card-011'],
];

// Rivals
export const RIVAL_SECTS: RivalSect[] = [
    {
        name: 'The Cult of the Gutter Rat',
        faith: 50,
        heresyPerSecond: 0.2,
        hand: [],
        deck: initialDeck.slice(0, 3), // Simplified
        lastActionTimestamp: 0,
        buffs: [],
    }
];
export const RIVAL_ACTION_INTERVAL = 5000; // ms

// Minigame
export const BUREAUCRACY_MINIGAME_REQUESTS: BureaucracyRequest[] = [
    { id: 'b01', title: 'Form 7-B: Request for Additional Perch Space', description: 'The Southern Flock requires more room for their afternoon nap. All paperwork appears to be in order.', correctAction: 'approve' },
    { id: 'b02', title: 'Declaration of Heretical Droppings', description: 'Witnesses report strange patterns on the town square statue. This is clearly a sign of dissent.', correctAction: 'deny' },
    { id: 'b03', title: 'Petition for Shiny Trinket Acquisition', description: 'A small, metallic object has been spotted on a balcony. It must be acquired for the glory of the Pope.', correctAction: 'approve' },
    { id: 'b04', title: 'Permit to Coo Before Sunrise', description: 'The Dawn Chorus Choir wishes to begin their sermons 15 minutes earlier. This violates the Great Sleep Accord.', correctAction: 'deny' },
    { id: 'b05', title: 'Application for Forbidden Crumb', description: 'A follower wishes to consume a "sourdough" crumb, a known agent of chaos and indigestion.', correctAction: 'deny' },
    { id: 'b06', title: 'Nest Renovation Grant', description: 'A family of pigeons requests funding to add more twigs to their nest. The grant is within budget.', correctAction: 'approve' },
];

// Tycoon Buildings
export const TYCOON_BUILDINGS: Omit<Building, 'level'>[] = [
    {
        id: 'bld-crumb-silo',
        name: 'Crumb Silo',
        description: 'Passively generates crumbs and improves follower scrounging efficiency.',
        art: '🍞🏢',
        productionType: ResourceType.Crumbs,
        baseProduction: 0.5,
        baseCost: 25,
        costResource: ResourceType.Crumbs,
        costMultiplier: 1.15,
        buff: {
            type: 'FOLLOWER_CRUMB_PRODUCTION_MULTIPLIER',
            value: 0.02, // 2% boost to follower crumb production per level
        }
    },
    {
        id: 'bld-faith-spire',
        name: 'Faith Spire',
        description: 'Broadcasts divine cooing, inspiring the city and boosting all faith generation.',
        art: '🙏📡',
        productionType: ResourceType.Faith,
        baseProduction: 0.2,
        baseCost: 50,
        costResource: ResourceType.Crumbs,
        costMultiplier: 1.2,
        buff: {
            type: 'FAITH_GAIN_MULTIPLIER',
            value: 0.05, // 5% boost to all faith generation per level
        }
    },
    {
        id: 'bld-bread-coin-mint',
        name: 'Bread Coin Mint',
        description: 'A bizarre contraption that converts crumbs into highly volatile "Bread Coins".',
        art: '🪙🏭',
        productionType: ResourceType.BreadCoin,
        baseProduction: 0.01,
        baseCost: 100,
        costResource: ResourceType.Crumbs,
        costMultiplier: 1.5,
    },
    {
        id: 'bld-dj-temple',
        name: 'DJ Temple',
        description: 'Pumps out holy dub-faith bass, keeping the flock happy and motivated.',
        art: '🎶🎧',
        baseCost: 150,
        costResource: ResourceType.Crumbs,
        costMultiplier: 1.8,
        buff: {
            type: 'GLOBAL_MORALE_BOOST',
            value: 1, // +1 max morale per level
        }
    }
];

// New Follower Management
const PIGEON_NAMES = ['Pecky', 'Coo-lin', 'Wingston', 'Bread-ley', 'Skybert', 'Ruffles', 'Pidge', 'Featherick', 'Sir Cooington', 'Wing Commander', 'Breadna', 'Quilliam'];
const PERSONALITIES: FollowerPersonality[] = ['Devout', 'Lazy', 'Rebel', 'Standard'];

export const createInitialFollower = (): Follower => {
    const name = PIGEON_NAMES[Math.floor(Math.random() * PIGEON_NAMES.length)];
    const personality = PERSONALITIES[Math.floor(Math.random() * PERSONALITIES.length)];
    
    let baseStats = {
        devotion: 50 + Math.floor(Math.random() * 20),
        chaosIndex: 10 + Math.floor(Math.random() * 10),
        loyalty: 60 + Math.floor(Math.random() * 20),
        productivity: 1.0,
    };

    switch (personality) {
        case 'Devout':
            baseStats.devotion += 20;
            baseStats.loyalty += 10;
            baseStats.productivity = 1.05;
            break;
        case 'Lazy':
            baseStats.productivity = 0.8;
            baseStats.devotion -= 10;
            break;
        case 'Rebel':
            baseStats.loyalty -= 20;
            baseStats.productivity = 1.1;
            baseStats.chaosIndex += 15;
            break;
    }

    return {
        id: `follower-${Date.now()}-${Math.random()}`,
        name: `${name} #${Math.floor(Math.random() * 100)}`,
        devotion: Math.max(0, Math.min(100, baseStats.devotion)),
        chaosIndex: Math.max(0, Math.min(100, baseStats.chaosIndex)),
        loyalty: Math.max(0, Math.min(100, baseStats.loyalty)),
        productivity: baseStats.productivity,
        animationState: 'idle',
        personality: personality,
        emotions: { joy: 50, fear: 10 },
    };
};