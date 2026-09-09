/**
 * FitAdapt - Card de Selección de Objetivo Fitness
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import { Check, Flame, Dumbbell, HeartPulse, Sparkles, Activity } from 'lucide-react';
import { FitnessGoal } from '../../types/user';
import { FITNESS_GOALS_METADATA } from '../../constants/fitness';
import { Card } from '../ui/Card';

export interface GoalCardProps {
  key?: React.Key;
  goal: FitnessGoal;
  isSelected: boolean;
  onSelect: (goal: FitnessGoal) => void;
}

export function GoalCard({ goal, isSelected, onSelect }: GoalCardProps) {
  const meta = FITNESS_GOALS_METADATA[goal];

  const goalIcons: Record<FitnessGoal, React.ReactNode> = {
    [FitnessGoal.WEIGHT_LOSS]: <Flame className="w-5 h-5 text-amber-500" />,
    [FitnessGoal.TONING]: <Sparkles className="w-5 h-5 text-teal-500" />,
    [FitnessGoal.CARDIO]: <HeartPulse className="w-5 h-5 text-rose-500" />,
    [FitnessGoal.STRENGTH]: <Dumbbell className="w-5 h-5 text-blue-500" />,
    [FitnessGoal.MOBILITY]: <Activity className="w-5 h-5 text-emerald-500" />,
  };

  return (
    <Card
      interactive
      onClick={() => onSelect(goal)}
      className={`relative transition-all cursor-pointer ${
        isSelected
          ? 'border-teal-600 bg-teal-50/40 dark:border-teal-500 dark:bg-teal-950/20 ring-2 ring-teal-600 dark:ring-teal-500'
          : 'hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 shrink-0">
          {goalIcons[goal]}
        </div>

        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
            isSelected
              ? 'bg-teal-600 border-teal-600 text-white'
              : 'border-zinc-300 dark:border-zinc-700'
          }`}
        >
          {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
        </div>
      </div>

      <div className="mt-3">
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
          {meta.name}
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
          {meta.description}
        </p>

        <div className="flex flex-wrap gap-1 mt-3">
          {meta.focusAreas.map((f) => (
            <span
              key={f}
              className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}
