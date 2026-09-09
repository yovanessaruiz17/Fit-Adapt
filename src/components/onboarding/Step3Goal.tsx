/**
 * FitAdapt - Paso 3: Objetivo Principal
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { FitnessGoal } from '../../types/user';
import { FITNESS_GOALS_METADATA } from '../../constants/fitness';
import { TrendingDown, Sparkles, Activity, Dumbbell, Move, Check } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Step3GoalProps {
  selectedGoal: FitnessGoal | '';
  onSelectGoal: (goal: FitnessGoal) => void;
}

export function Step3Goal({ selectedGoal, onSelectGoal }: Step3GoalProps) {
  const goalIcons: Record<FitnessGoal, React.ReactNode> = {
    [FitnessGoal.WEIGHT_LOSS]: <TrendingDown className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    [FitnessGoal.TONING]: <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    [FitnessGoal.CARDIO]: <Activity className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
    [FitnessGoal.STRENGTH]: <Dumbbell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    [FitnessGoal.MOBILITY]: <Move className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
  };

  const goals = [
    FitnessGoal.WEIGHT_LOSS,
    FitnessGoal.TONING,
    FitnessGoal.CARDIO,
    FitnessGoal.STRENGTH,
    FitnessGoal.MOBILITY,
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Elige el foco primordial sobre el que se estructurará la periodización y selección de ejercicios.
      </p>

      <div className="grid grid-cols-1 gap-3">
        {goals.map((goalKey) => {
          const meta = FITNESS_GOALS_METADATA[goalKey];
          const isSelected = selectedGoal === goalKey;

          return (
            <div
              key={goalKey}
              onClick={() => onSelectGoal(goalKey)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                isSelected
                  ? 'border-teal-600 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-2 ring-teal-600/30'
                  : 'border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                  }`}
                >
                  {goalIcons[goalKey]}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {meta.name}
                    </h3>
                    <Badge variant={meta.recommendedIntensity === 'HIGH' ? 'purple' : 'teal'} size="sm">
                      Intensidad {meta.recommendedIntensity}
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xl">
                    {meta.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {meta.focusAreas.map((area) => (
                      <span
                        key={area}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-colors ${
                  isSelected
                    ? 'border-teal-600 bg-teal-600 text-white'
                    : 'border-zinc-300 dark:border-zinc-700'
                }`}
              >
                {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
