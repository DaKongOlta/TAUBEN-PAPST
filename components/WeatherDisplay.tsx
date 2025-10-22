import React from 'react';
import type { ActiveWeatherEvent } from '../types';
import { WEATHER_EVENTS } from '../weather';

interface WeatherDisplayProps {
  weather: ActiveWeatherEvent;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather }) => {
  const definition = WEATHER_EVENTS.find(w => w.id === weather.id);
  const initialDuration = definition ? definition.duration : weather.duration;
  
  return (
    <div className="fixed top-40 lg:top-28 left-1/2 -translate-x-1/2 z-30 bg-stone-900/70 backdrop-blur-sm p-3 rounded-lg border-2 border-cyan-300/50 text-center animate-fade-in-down shadow-lg shadow-cyan-500/10">
      <div className="flex items-center gap-4">
        <div className="text-4xl">{weather.art}</div>
        <div>
          <h3 className="text-lg font-silkscreen text-cyan-200">{weather.name}</h3>
          <p className="text-sm text-stone-300 max-w-xs">{weather.description}</p>
          <div className="mt-1 bg-black/30 rounded-full h-2 w-full overflow-hidden border border-white/20">
             <div className="bg-cyan-400 h-full transition-all duration-100 ease-linear" style={{ width: `${(weather.duration / initialDuration) * 100}%` }} />
          </div>
          <p className="font-bold text-sm text-white mt-1">Time remaining: {Math.ceil(weather.duration)}s</p>
        </div>
      </div>
    </div>
  );
};
