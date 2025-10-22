import React, { useState } from 'react';
import type { Skill, SkillTreeType } from '../types';
import { playSound } from '../audioManager';
import { DivineFavorIcon } from '../components/icons';

interface SkillsViewProps {
  skills: Record<string, Skill>;
  setSkills: React.Dispatch<React.SetStateAction<Record<string, Skill>>>;
  divineFavor: number;
  setDivineFavor: React.Dispatch<React.SetStateAction<number>>;
}

const skillTrees: SkillTreeType[] = ['Automation', 'Propaganda', 'Combat', 'Memes'];

const SkillNode: React.FC<{ skill: Skill, onUnlock: (skill: Skill) => void, canUnlock: boolean }> = ({ skill, onUnlock, canUnlock }) => {
    const isAffordable = canUnlock; // Simplified for now
    
    let buttonClass = 'bg-stone-700 text-stone-400 cursor-not-allowed';
    if (skill.unlocked) {
        buttonClass = 'bg-amber-500/80 text-white border-amber-300';
    } else if (isAffordable) {
        buttonClass = 'bg-green-600/80 hover:bg-green-500/80 text-white cursor-pointer';
    }

    return (
        <div className="skill-node text-center p-2 rounded-lg border-2 border-stone-700 flex flex-col items-center justify-center" style={{ gridRow: skill.position.row, gridColumn: skill.position.col }}>
            <div className="text-3xl mb-1">{skill.art}</div>
            <h4 className="font-bold text-sm font-silkscreen">{skill.name}</h4>
            <p className="text-xs text-stone-400 flex-grow mb-2">{skill.description}</p>
            <button
                onClick={() => onUnlock(skill)}
                disabled={skill.unlocked || !isAffordable}
                className={`w-full p-1 rounded text-xs font-bold transition-colors ${buttonClass}`}
            >
                {skill.unlocked ? 'Unlocked' : `Unlock (${skill.cost})`}
            </button>
        </div>
    );
};

export const SkillsView: React.FC<SkillsViewProps> = ({ skills, setSkills, divineFavor, setDivineFavor }) => {
    const [activeTree, setActiveTree] = useState<SkillTreeType>('Automation');

    const handleUnlockSkill = (skillToUnlock: Skill) => {
        if (skillToUnlock.unlocked || divineFavor < skillToUnlock.cost) {
            playSound('error');
            return;
        }

        const dependenciesMet = skillToUnlock.dependencies.every(depId => skills[depId]?.unlocked);
        if (!dependenciesMet) {
             playSound('error');
            return;
        }

        playSound('upgrade');
        setDivineFavor(df => df - skillToUnlock.cost);
        setSkills(currentSkills => ({
            ...currentSkills,
            [skillToUnlock.id]: { ...skillToUnlock, unlocked: true }
        }));
    };

    // FIX: Cast Object.values to Skill[] to fix type inference issues, resolving multiple errors.
    const visibleSkills = (Object.values(skills) as Skill[]).filter(s => s.tree === activeTree);
    
    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="text-4xl font-silkscreen text-amber-300 mb-2">Skill Trees</h2>
                    <p className="text-stone-400">Use Divine Favor to unlock powerful new abilities for your cult.</p>
                </div>
                <div className="flex items-center gap-2 text-2xl font-bold p-2 bg-stone-800/50 rounded-lg">
                    <DivineFavorIcon className="w-8 h-8 text-yellow-300" />
                    <span>{divineFavor}</span>
                </div>
            </div>
            
            <div className="flex gap-2 mb-4 border-b-2 border-stone-700">
                {skillTrees.map(tree => (
                    <button 
                        key={tree} 
                        onClick={() => setActiveTree(tree)}
                        className={`py-2 px-4 font-bold ${activeTree === tree ? 'border-b-2 border-amber-400 text-amber-300' : 'text-stone-400 hover:text-white'}`}
                    >
                        {tree}
                    </button>
                ))}
            </div>

            <div className="flex-grow bg-stone-900/50 p-4 rounded-lg relative">
                 <div className="skill-tree-grid">
                    {visibleSkills.map(skill => (
                        <SkillNode 
                            key={skill.id} 
                            skill={skill} 
                            onUnlock={handleUnlockSkill}
                            canUnlock={divineFavor >= skill.cost && skill.dependencies.every(depId => skills[depId]?.unlocked)}
                        />
                    ))}
                 </div>
            </div>
        </div>
    );
};
