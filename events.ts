import type { GameEvent } from './types';

export const GAME_EVENTS: GameEvent[] = [
  {
    id: 'event-001',
    title: 'A Question of Faith',
    description: 'A young fledgling approaches you, its eyes full of doubt. "Oh, great Pope," it coos, "how do we know the Great Crumb in the Sky is real?"',
    art: '🤔',
    choices: [
      {
        text: '"Recite the sacred texts!"',
        description: 'A display of unwavering conviction. (Gain 20 Faith)',
        effects: [{ type: 'GAIN_FAITH', value: 20 }],
      },
      {
        text: '"Show them a shiny object."',
        description: 'Distraction is a powerful tool. (Lose 5 Faith, Gain 1 Follower)',
        effects: [{ type: 'GAIN_FAITH', value: -5 }, { type: 'GAIN_FOLLOWERS', value: 1 }],
      },
    ],
  },
  {
    id: 'event-002',
    title: 'The Stray Crumb',
    description: 'A massive, uneaten piece of bread is spotted on the sidewalk below. It is dangerously close to the territory of the Gutter Rats.',
    art: '🥖',
    choices: [
      {
        text: 'Organize a holy crusade.',
        description: 'A risky but potentially rewarding venture. (50% chance to gain 50 Crumbs, 50% chance to lose 1 Follower)',
        effects: [{ type: 'CRUMB_CRUSADE', value: 0 }], // Special effect handled in game logic
      },
      {
        text: 'Declare it a holy relic.',
        description: 'It is too sacred to be touched. (Gain 10 Faith)',
        effects: [{ type: 'GAIN_FAITH', value: 10 }],
      },
    ],
  },
];
