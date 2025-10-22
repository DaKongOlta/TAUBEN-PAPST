// constants.ts
import type { Card, RivalSect, BureaucracyRequest, Building, Follower } from './types';
import { ResourceType } from './types';

// Gameplay constants
export const STARTING_FAITH = 10;
export const STARTING_CRUMBS = 25; // Increased starting crumbs for tycoon mode
export const STARTING_FOLLOWERS = 1;
export const STARTING_MORALE = 75;
export const STARTING_DIVINE_FAVOR = 0;
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
    effects: [{ type: 'GAIN_MORALE', value: 10 }],
  },
  'card-002': {
    id: 'card-002',
    name: 'Scrounge for Crumbs',
    type: 'Ritual',
    art: '🧐',
    description: 'Command your followers to search for sustenance.',
    cost: { amount: 0, resource: ResourceType.Crumbs },
    effects: [{ type: 'GAIN_CRUMBS', value: 10 }],
  },
  'card-003': {
    id: 'card-003',
    name: 'Inspiring Sermon',
    type: 'Propaganda',
    art: '🗣️',
    description: 'Recruit a new follower with a powerful speech.',
    cost: { amount: 10, resource: ResourceType.Faith },
    effects: [{ type: 'GAIN_FOLLOWERS', value: 1 }],
  },
  'card-004': {
    id: 'card-004',
    name: 'Righteous Peck',
    type: 'Conflict',
    art: '💥',
    description: 'Inflict a small amount of holy damage to the rival sect.',
    cost: { amount: 15, resource: ResourceType.Faith },
    effects: [{ type: 'DAMAGE_RIVAL', value: 10 }],
  },
};

export const initialDeck: Card[] = [
  ALL_CARDS['card-001'],
  ALL_CARDS['card-001'],
  ALL_CARDS['card-002'],
  ALL_CARDS['card-002'],
  ALL_CARDS['card-003'],
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
        description: 'A holy silo that passively generates crumbs from blessed atmospheric dust.',
        art: '🍞🏢',
        productionType: ResourceType.Crumbs,
        baseProduction: 0.5,
        baseCost: 25,
        costResource: ResourceType.Crumbs,
        costMultiplier: 1.15,
    },
    {
        id: 'bld-faith-spire',
        name: 'Faith Spire',
        description: 'A towering antenna that broadcasts your divine cooing, inspiring faith across the city.',
        art: '🙏📡',
        productionType: ResourceType.Faith,
        baseProduction: 0.2,
        baseCost: 50,
        costResource: ResourceType.Crumbs,
        costMultiplier: 1.2,
    },
];

// New Follower Management
const PIGEON_NAMES = ['Pecky', 'Coo-lin', 'Wingston', 'Bread-ley', 'Skybert', 'Ruffles', 'Pidge', 'Featherick'];
export const createInitialFollower = (): Follower => {
    const name = PIGEON_NAMES[Math.floor(Math.random() * PIGEON_NAMES.length)];
    return {
        id: `follower-${Date.now()}-${Math.random()}`,
        name: `${name} #${Math.floor(Math.random() * 100)}`,
        devotion: 50 + Math.floor(Math.random() * 20),
        chaosIndex: 10 + Math.floor(Math.random() * 10),
        loyalty: 60 + Math.floor(Math.random() * 20),
        productivity: 1.0,
        animationState: 'idle',
    };
};
