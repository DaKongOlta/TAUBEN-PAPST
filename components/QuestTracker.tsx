import React from 'react';
import type { Quest, QuestObjective } from '../types';
import { QuestObjectiveType } from '../types';

interface QuestTrackerProps {
  activeQuest: Quest | undefined;
  progressValues: Partial<Record<QuestObjectiveType, number>>;
}

export const QuestTracker: React.FC<QuestTrackerProps> = ({ activeQuest, progressValues }) => {
  if (!activeQuest) {
    return (
        <div className="absolute top-4 right-4 bg-stone-900/70 backdrop-blur-sm p-4 rounded-lg border-2 border-amber-300/50 w-72 text-sm z-20">
            <h3 className="text-lg font-silkscreen text-amber-300 mb-2">Quests Complete</h3>
            <p className="text-stone-400 italic">You have achieved all that is currently prophesied. More to come...</p>
        </div>
    );
  }

  const getObjectiveProgressText = (objective: QuestObjective) => {
      const current = progressValues[objective.type] ?? 0;
      // For DEFEAT_RIVAL, it will always show 0 until complete from game logic.
      return `(${Math.min(current, objective.targetValue)}/${objective.targetValue})`;
  };

  return (
    <div className="absolute top-4 right-4 bg-stone-900/70 backdrop-blur-sm p-4 rounded-lg border-2 border-amber-300/50 w-72 text-sm z-20">
      <h3 className="text-lg font-silkscreen text-amber-300 mb-2">Current Quest</h3>
      <h4 className="font-bold text-amber-100">{activeQuest.name}</h4>
      <p className="text-stone-400 italic mb-3">{activeQuest.description}</p>
      <ul className="space-y-1">
        {activeQuest.objectives.map((obj, index) => (
          <li key={index} className="text-stone-200">
            - {obj.description} <span className="font-bold text-amber-300">{getObjectiveProgressText(obj)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};