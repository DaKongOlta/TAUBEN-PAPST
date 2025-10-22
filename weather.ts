import type { WeatherEffectDefinition } from './types';
import { WeatherType } from './types';

export const WEATHER_EVENTS: WeatherEffectDefinition[] = [
    {
        id: 'weather-001',
        name: 'Bread Storm',
        description: 'A miraculous downpour of crumbs! All crumb gains are doubled.',
        art: '🍞🌧️',
        type: WeatherType.BREAD_STORM,
        duration: 120, // 2 minutes
        crumbGainMultiplier: 2,
    },
    {
        id: 'weather-002',
        name: 'Morning Sermon Sunlight',
        description: 'The heavens open, bathing the roost in divine light. Faith generation is tripled!',
        art: '☀️🙏',
        type: WeatherType.MORNING_SUNLIGHT,
        duration: 30,
        faithGainMultiplier: 3,
    },
    {
        id: 'weather-003',
        name: 'Faith Eclipse',
        description: 'A shadow falls upon the flock, stifling belief. Faith generation is halved, and rivals feel emboldened.',
        art: '🌑',
        type: WeatherType.FAITH_ECLIPSE,
        duration: 60,
        faithGainMultiplier: 0.5,
        rivalFaithGainMultiplier: 1.5,
    },
    {
        id: 'weather-004',
        name: 'Dust Devil',
        description: 'A swirling vortex of grit and doubt scours the roost. All crumb gains are reduced by 10% and heresy rises.',
        art: '🌪️',
        type: WeatherType.DUST_DEVIL,
        duration: 60,
        crumbGainMultiplier: 0.9,
        heresyPerSecondAdd: 0.1,
    }
];