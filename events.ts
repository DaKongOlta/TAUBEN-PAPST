import type { GameEvent } from './types';
import { EffectType } from './types';

export const GAME_EVENTS: GameEvent[] = [
    {
        id: 'event-001',
        title: 'A Half-Eaten Pretzel',
        description: 'A human child has dropped a magnificent, barely-touched salty pretzel. It is a gift from the heavens!',
        art: '🥨',
        choices: [
            {
                text: 'Claim it for the flock!',
                effects: [{ type: EffectType.ADD_CRUMBS, value: 100 }],
                description: 'You gain 100 Crumbs.',
            },
            {
                text: 'Perform a ritual of thanks.',
                effects: [{ type: EffectType.ADD_FAITH, value: 50 }],
                description: 'You gain 50 Faith.',
            },
        ],
    },
    {
        id: 'event-002',
        title: 'The Rogue Rat Prophet',
        description: 'A charismatic rat preaches a gospel of cheese and sewer treasures on your turf, drawing curious glances from your flock.',
        art: '🐀',
        choices: [
            {
                text: 'Drive the heretic out!',
                effects: [
                    { type: EffectType.ADD_FOLLOWERS, value: -1 },
                    { type: EffectType.ADD_FAITH, value: 20 }
                ],
                description: 'Lose 1 Follower, but gain 20 Faith from the show of force.',
            },
            {
                text: 'Attempt to convert them.',
                effects: [{ type: EffectType.ADD_FAITH, value: 75 }],
                description: 'A lengthy debate inspires your flock. You gain 75 Faith.',
            },
        ],
    },
    {
        id: 'event-003',
        title: 'A Sudden Downpour',
        description: 'The sky darkens and opens up. The humans scatter, leaving behind a bounty of soggy but edible treasures.',
        art: '🌧️',
        choices: [
            {
                text: 'Scavenge for soggy bread.',
                effects: [{ type: EffectType.ADD_CRUMBS, value: 75 }],
                description: 'You gain 75 Crumbs.',
            },
            {
                text: 'Huddle for warmth and unity.',
                effects: [{ type: EffectType.ADD_FOLLOWERS, value: 2 }],
                description: 'Two stray pigeons join your flock for shelter. You gain 2 Followers.',
            },
        ],
    },
    {
        id: 'event-minigame-bureaucracy',
        title: 'The Winged Bureaucracy',
        description: 'A summons arrives from the administrative branch of the faith. Your divine judgment is required for several pressing paperwork matters.',
        art: '📜',
        minigame: 'bureaucracy',
    }
];