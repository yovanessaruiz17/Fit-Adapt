/**
 * FitAdapt - Paso 4: Nivel de Entrenamiento
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { FitnessLevel } from '../../types/user';
import { FITNESS_LEVELS_METADATA } from '../../constants/fitness';
import { Shield, Award, Zap, Check } from 'lucide-react';

interface Step4LevelProps {
  selectedLevel: FitnessLevel | '';
  onSelectLevel: (level: FitnessLevel) => void;
}

export function Step4Level({ selectedLevel, onSelectLevel }: Step4LevelProps) {
  const levels = [
    {
      id: FitnessLevel.BEGINNER,
      icon: <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
      tag: 'Recomendado si retomas tras un tiempo',
    },
    {
      id: FitnessLevel.INTERMEDIATE,
      icon: <Award className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
      tag: 'Entrenas de forma regular (6+ meses)',
    },
    {
      id: FitnessLevel.ADVANCED,
      icon: <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
      tag: 'Experiencia consolidada (2+ años)',
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Nos ayuda a definir el tiempo de descanso entre series, la complejidad de los movimientos y el volumen total de fatiga.
      </p>

      <div className="space-y-3">
        {levels.map((lvl) => {
          const meta = FITNESS_LEVELS_METADATA[lvl.id];
          const isSelected = selectedLevel === lvl.id;

          return (
            <div
              key={lvl.id}
              onClick={() => onSelectLevel(lvl.id)}
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
                  {lvl.icon}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
                      {meta.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-900/60 px-2 py-0.5 rounded-full">
                      {lvl.tag}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {meta.description}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-zinc-400 font-mono pt-1">
                    <span>⏱️ Descanso sugerido: {meta.recommendedRestSeconds}s</span>
                    <span>📅 Máximo sugerido: {meta.maxRecommendedWeeklyDays} días/sem</span>
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
