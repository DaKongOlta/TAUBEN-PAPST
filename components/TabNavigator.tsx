import React from 'react';
import type { ActiveTab } from '../types';
// FIX: Import missing DivineFavorIcon
import { CampaignIcon, TycoonIcon, PigeonIcon, MapIcon, SkillsIcon, AnalyticsIcon, DivineFavorIcon } from './icons';

interface TabNavigatorProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const TABS: { id: ActiveTab, label: string, icon: React.FC<{className?: string}> }[] = [
    { id: 'Campaign', label: 'Campaign', icon: CampaignIcon },
    { id: 'Economy', label: 'Economy', icon: TycoonIcon },
    { id: 'Followers', label: 'Followers', icon: PigeonIcon },
    { id: 'Map', label: 'Map', icon: MapIcon },
    { id: 'Skills', label: 'Skills', icon: SkillsIcon },
    { id: 'Endgame', label: 'Endgame', icon: DivineFavorIcon },
    { id: 'Analytics', label: 'Analytics', icon: AnalyticsIcon },
];

export const TabNavigator: React.FC<TabNavigatorProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="flex items-center justify-center p-1 bg-stone-950/50 border-b-2 border-stone-700 z-30 gap-2">
      {TABS.map(tab => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors duration-200 w-24 h-16 ${isActive ? 'bg-amber-500/20 text-amber-300' : 'text-stone-400 hover:bg-stone-700/50 hover:text-white'}`}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon className="w-6 h-6 mb-1"/>
            <span className="text-xs font-bold">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
