import type { Quest } from './types';
import { QuestObjectiveType } from './types';

export const QUESTS: Quest[] = [
    {
        id: 'quest-001',
        name: 'The First Sermon',
        description: 'Recruit your first followers to establish your roost.',
        unlocksAfter: undefined,
        objectives: [
            {
                type: QuestObjectiveType.REACH_FOLLOWERS,
                description: 'Reach 5 Followers',
                targetValue: 5,
            }
        ],
        reward: {
            divineFavor: 1,
        }
    },
    {
        id: 'quest-002',
        name: 'Rooftop Revival',
        description: 'Your influence grows, attracting unwanted attention. Fortify your position.',
        unlocksAfter: 'quest-001',
        objectives: [
            {
                type: QuestObjectiveType.REACH_FOLLOWERS,
                description: 'Reach 10 Followers',
                targetValue: 10,
            }
        ],
        reward: {
            divineFavor: 2,
        }
    },
    {
        id: 'quest-003',
        name: 'Bread War I',
        description: 'A rival sect challenges your authority. Defeat their leader to secure your territory.',
        unlocksAfter: 'quest-002',
        objectives: [
            {
                type: QuestObjectiveType.DEFEAT_RIVAL,
                description: 'Defeat the Cult of the Gutter Rat',
                targetValue: 1,
            }
        ],
        reward: {
            divineFavor: 5,
        }
    },
    {
        id: 'quest-004',
        name: 'The Sky Tyrant',
        description: 'The Coastal Seagull Dominion has noticed your rise. Their champion, Gulliver, challenges your rule.',
        unlocksAfter: 'quest-003',
        objectives: [
            {
                type: QuestObjectiveType.DEFEAT_BOSS,
                description: 'Defeat Gulliver, the Seagull Champion',
                targetValue: 1,
            }
        ],
        reward: {
            divineFavor: 10,
        }
    }
];