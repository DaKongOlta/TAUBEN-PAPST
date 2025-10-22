import type { Card, Relic, Upgrade, MetaUpgrade, RivalSect, BureaucracyRequest } from './types';
import { CardType, ResourceType, EffectType } from './types';

export const MAX_HAND_SIZE = 5;
export const FOLLOWER_FAITH_PER_SECOND = 0.1;

export const INITIAL_CARDS: Card[] = [
  {
    id: 'card-001',
    name: 'The First Peck',
    description: "In the beginning, there was only hunger. Then came the First Crumb, a revelation pecked from the sacred concrete. This single act sparked the flame of Faith, proving that even the smallest morsel holds the promise of a divine feast. It is the foundational miracle upon which all pigeon-kind builds its church.",
    type: CardType.Miracle,
    cost: { resource: ResourceType.Crumbs, amount: 0 },
    effect: { type: EffectType.ADD_FAITH, value: 10 },
    art: '🍞',
  },
  {
    id: 'card-002',
    name: 'Coo of Persuasion',
    description: "A single, resonant 'coo' that vibrates with holy truth. It is not a sound of aggression, but of profound understanding. Pigeons who hear it pause their frantic pecking, their heads tilting not in confusion, but in dawning belief. This simple note carries the weight of prophecy, turning skeptics into believers.",
    type: CardType.Propaganda,
    cost: { resource: ResourceType.Crumbs, amount: 5 },
    effect: { type: EffectType.ADD_FAITH, value: 25 },
    art: '🎶',
  },
  {
    id: 'card-003',
    name: 'Ritual of the Fountain',
    description: "The public fountain is the pigeon's baptismal font. In this ritual, the flock gathers to cleanse their feathers in its blessed waters. Their synchronized splashing and joyous coos are a public testament to their purity and devotion, creating an inspiring spectacle that bolsters the Faith of all who witness it for a time.",
    type: CardType.Ritual,
    cost: { resource: ResourceType.Faith, amount: 20 },
    effect: { type: EffectType.TEMP_FPS_ADD, value: 5, duration: 30 },
    art: '⛲',
  },
  {
    id: 'card-004',
    name: 'Miracle of the Dropped Fry',
    description: "A sign of favor from the Giant Sky-Feeders! A human, in a moment of divine carelessness, drops a perfectly salted, golden fry. This greasy manna from heaven is both a feast and a holy relic, a tangible sign that the flock is walking the righteous path and will be provided for. It is a bounty of the most sacred kind.",
    type: CardType.Miracle,
    cost: { resource: ResourceType.Faith, amount: 10 },
    effect: { type: EffectType.ADD_CRUMBS, value: 25 },
    art: '🍟',
  },
  {
    id: 'card-005',
    name: 'Coo of Gathering',
    description: "This is not a gentle coo, but a powerful call that echoes from the highest statues and rooftops. It is a summons to the lost, the lonely, and the hungry. A stray pigeon, hearing this call, recognizes the sound of community and purpose, and is compelled to seek out the source and join the one true flock.",
    type: CardType.Propaganda,
    cost: { resource: ResourceType.Crumbs, amount: 20 },
    effect: { type: EffectType.ADD_FOLLOWERS, value: 1 },
    art: '📣',
  },
  {
    id: 'card-006',
    name: 'Synchronized Head-Bobbing',
    description: "A mesmerizing, silent sermon. As one, the flock begins a rhythmic, hypnotic head-bob. This display of perfect unity demonstrates their shared consciousness and devotion to the Papst. Such profound focus clears the mind, allowing for new revelations and divine strategies to emerge from the collective unconscious.",
    type: CardType.Ritual,
    cost: { resource: ResourceType.Faith, amount: 50 },
    effect: { type: EffectType.DRAW_CARDS, value: 2 },
    art: '🐦🐦',
  },
  {
    id: 'card-007',
    name: 'Seagull Inquisition',
    description: "The gulls are brutes, but their aggressive squawks can be turned to a holy purpose. This is a direct, faith-shattering challenge, a verbal assault that points out the flaws and absurdities in a rival's doctrine. The sheer audacity of the cry plants seeds of doubt, weakening the foundations of heretical beliefs.",
    type: CardType.Conflict,
    cost: { resource: ResourceType.Faith, amount: 30 },
    effect: { type: EffectType.ATTACK_RIVAL, value: 25 },
    art: '⚔️',
  },
  {
    id: 'card-008',
    name: 'Sermon of Unity',
    description: "When whispers of doubt begin to spread, the Papst delivers a powerful sermon, reminding the flock of the core truths of the Crumb. This rallying cry, represented by the unassailable shield of true belief, mends the cracks in their devotion and casts out the shadows of heresy, purifying the collective spirit of the community.",
    type: CardType.Conflict,
    cost: { resource: ResourceType.Faith, amount: 25 },
    effect: { type: EffectType.REDUCE_HERESY, value: 15 },
    art: '🛡️',
  },
  {
    id: 'card-009',
    name: 'Crusader',
    description: "A holy warrior, armed with a sharpened beak and unwavering devotion. This zealous follower embarks on a righteous crusade to smite heretics and reclaim lost territory in the name of the Crumb. Their battle coo is a terrifying anthem of faith.",
    type: CardType.Conflict,
    cost: { resource: ResourceType.Faith, amount: 30 },
    effect: { type: EffectType.ATTACK_RIVAL, value: 25 },
    art: '🗡️',
  },
];

export const RELICS: Relic[] = [
    {
        id: 'relic-001',
        name: 'The Uncrushable Crumb',
        description: 'Start each run with 100 extra Crumbs.',
        art: '💎🍞',
        effect: { type: EffectType.STARTING_CRUMBS, value: 100 }
    },
    {
        id: 'relic-002',
        name: 'Feather of St. Pigeon',
        description: 'Start each run with +1 Faith per second.',
        art: '🕊️',
        effect: { type: EffectType.BASE_FPS_ADD, value: 1 }
    },
    {
        id: 'relic-003',
        name: 'The Holy Baguette',
        description: 'All crumb gains are increased by 10%.',
        art: '🥖',
        effect: { type: EffectType.CRUMB_GAIN_MULTIPLIER, value: 0.1 }
    },
    {
        id: 'relic-b-001',
        name: 'The Holy Rubber Stamp',
        description: 'Sermons are 20% more effective at raising Flock Morale.',
        art: '✔️',
        effect: { type: EffectType.REDUCE_MORALE_DECAY, value: 0.2 } // Note: Not a real effect type yet
    },
    {
        id: 'relic-b-002',
        name: 'Feather Quill of St. Scrivener',
        description: 'Start each run with 3 random cards already drawn.',
        art: '✒️',
        effect: { type: EffectType.DRAW_CARDS, value: 3 } // Note: special case handling needed
    },
];


export const UPGRADES: Upgrade[] = [
    {
        id: 'up-001',
        name: 'Fledgling Preacher',
        description: 'Attract +1 Follower.',
        cost: 25,
        costResource: ResourceType.Faith,
        effect: { type: 'ADD_FOLLOWERS', value: 1},
        owned: 0,
    },
    {
        id: 'up-002',
        name: 'Crumb Scouter',
        description: '+1 Crumb per peck.',
        cost: 10,
        costResource: ResourceType.Crumbs,
        effect: { type: 'ADD_CPC', value: 1},
        owned: 0,
    },
    {
        id: 'up-003',
        name: 'Rooftop Pulpit',
        description: 'Construct a grand pulpit. Attract +5 Followers.',
        cost: 150,
        costResource: ResourceType.Faith,
        effect: { type: 'ADD_FOLLOWERS', value: 5},
        owned: 0,
    },
    {
        id: 'up-004',
        name: 'Crumb Cartographer',
        description: '+5 Crumbs per peck.',
        cost: 100,
        costResource: ResourceType.Crumbs,
        effect: { type: 'ADD_CPC', value: 5},
        owned: 0,
    }
];

export const META_UPGRADES: MetaUpgrade[] = [
    {
        id: 'meta-001',
        name: 'Divine Memory',
        description: 'Start each Great Migration with more Faith.',
        cost: 1,
        maxLevel: 10,
        level: 0,
        effect: (level) => `Start with ${level * 50} Faith.`
    },
    {
        id: 'meta-002',
        name: 'Holy Hoarder',
        description: 'Start each Great Migration with more Crumbs.',
        cost: 1,
        maxLevel: 10,
        level: 0,
        effect: (level) => `Start with ${level * 25} Crumbs.`
    },
    {
        id: 'meta-003',
        name: 'Persistent Piety',
        description: 'Begin with a permanent Faith/sec bonus.',
        cost: 5,
        maxLevel: 5,
        level: 0,
        effect: (level) => `+${level * 0.5} base Faith/sec.`
    }
];

export const RIVAL_CARDS: Record<string, Card[]> = {
    'rival-001': [ // The Gutter Gospel
        { id: 'rc-001', name: 'Sewer Sermon', description: 'Adds 10 Heresy.', type: CardType.Propaganda, cost: { resource: ResourceType.Faith, amount: 10 }, effect: { type: EffectType.ADD_HERESY_FLAT, value: 10 }, art: '📜' },
        { id: 'rc-002', name: 'Crumb Pilfering', description: 'Steal 50 Crumbs.', type: CardType.Conflict, cost: { resource: ResourceType.Faith, amount: 15 }, effect: { type: EffectType.STEAL_CRUMBS, value: 50 }, art: '💰' },
        { id: 'rc-003', name: 'Swarm Tactics', description: 'Steal 2 Followers.', type: CardType.Conflict, cost: { resource: ResourceType.Faith, amount: 25 }, effect: { type: EffectType.STEAL_FOLLOWERS, value: 2 }, art: '🐀🐀' },
    ],
    'rival-002': [ // The Church of the Shiny Thing
        { id: 'rc-004', name: 'Mesmerizing Trinket', description: 'Adds 5 Heresy.', type: CardType.Ritual, cost: { resource: ResourceType.Faith, amount: 10 }, effect: { type: EffectType.ADD_HERESY_FLAT, value: 5 }, art: '✨' },
        { id: 'rc-005', name: 'Peck Order Challenge', description: 'Reduce player Faith by 50.', type: CardType.Conflict, cost: { resource: ResourceType.Faith, amount: 30 }, effect: { type: EffectType.ATTACK_PLAYER_FAITH, value: 50 }, art: '💥' },
        { id: 'rc-006', name: 'Lure of the Bauble', description: 'Steal 3 Followers.', type: CardType.Propaganda, cost: { resource: ResourceType.Faith, amount: 40 }, effect: { type: EffectType.STEAL_FOLLOWERS, value: 3 }, art: '💎' },
    ],
    'rival-003': [ // The Sparrow Syndicate
        { id: 'rc-007', name: 'Aggressive Chirping', description: 'Increase Heresy/sec by 0.2.', type: CardType.Propaganda, cost: { resource: ResourceType.Faith, amount: 20 }, effect: { type: EffectType.BOOST_HERESY_PER_SECOND, value: 0.2 }, art: '🗣️' },
        { id: 'rc-008', name: 'Mobbing', description: 'Steal 1 Follower.', type: CardType.Conflict, cost: { resource: ResourceType.Faith, amount: 15 }, effect: { type: EffectType.STEAL_FOLLOWERS, value: 1 }, art: '🐦🐦' },
        { id: 'rc-009', name: 'Rooftop Raid', description: 'Steal 30 Crumbs.', type: CardType.Conflict, cost: { resource: ResourceType.Faith, amount: 10 }, effect: { type: EffectType.STEAL_CRUMBS, value: 30 }, art: '🏚️' },
    ]
};

export const RIVAL_SECTS_DATA: Omit<RivalSect, 'faith' | 'deck' | 'hand' | 'discard' | 'heresyPerSecond'>[] = [
    {
        id: 'rival-001',
        name: 'The Gutter Gospel',
        art: '🐀'
    },
    {
        id: 'rival-002',
        name: 'The Church of the Shiny Thing',
        art: '💎'
    },
    {
        id: 'rival-003',
        name: 'The Sparrow Syndicate',
        art: '🐦'
    }
];

export const BUREAUCRACY_REQUESTS: BureaucracyRequest[] = [
    { id: 'br-001', title: 'Form 7B: Relic Tax Exemption', description: 'Applicant claims their "Shiny Bottlecap" is a holy relic and should be exempt from the communal crumb tithe. It is slightly shinier than average.', correctAction: 'deny' },
    { id: 'br-002', title: 'Miracle Recalculation Form', description: 'Follower #287 claims the "Miracle of the Dropped Fry" yielded 15% less sustenance than prophesied and requests a crumb rebate.', correctAction: 'deny' },
    { id: 'br-003', title: 'Official Heretic Designation Request', description: 'A zealous follower requests that "Gary the Seagull" be officially designated a heretic for stealing a piece of toast.', correctAction: 'approve' },
    { id: 'br-004', title: 'Request for Additional Cooing', description: 'A nest on the west rooftop complains that sermons are not loud enough and requests additional morning coos.', correctAction: 'approve' },
    { id: 'br-005', title: 'Nest Expansion Permit (Zone C)', description: 'Applicant requests permission to build a nest extension using "forbidden materials" (chewing gum and cigarette butts).', correctAction: 'deny' },
    { id: 'br-006', title: 'Petition to Reclassify "Squirrels"', description: 'A petition to reclassify squirrels as "Furry, Land-Bound Heretics" instead of "Annoying Distractions".', correctAction: 'approve' },
];