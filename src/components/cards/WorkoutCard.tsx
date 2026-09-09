/**
 * FitAdapt - Card de Rutina / Sesión de Entrenamiento
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import { Play, Clock, Flame, Dumbbell, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { FitnessGoal, FitnessLevel } from '../../types/user';

export interface WorkoutCardProps {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH';
  goal: FitnessGoal;
  level: FitnessLevel;
  exerciseCount: number;
  adaptedForLimitations?: boolean;
  onStart?: () => void;
}

export function WorkoutCard({
  title,
  description,
  durationMinutes,
  intensity,
  goal,
  level,
  exerciseCount,
  adaptedForLimitations = false,
  onStart,
}: WorkoutCardProps) {
  const intensityColor = {
    LOW: 'emerald' as const,
    MEDIUM: 'warning' as const,
    HIGH: 'danger' as const,
  };

  return (
    <Card elevation="raised" className="flex flex-col justify-between group">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-1.5">
            <Badge variant={intensityColor[intensity]}>
              Intensidad {intensity}
            </Badge>
            <Badge variant="neutral">{level}</Badge>
          </div>

          {adaptedForLimitations && (
            <Badge variant="teal" icon={<ShieldCheck className="w-3 h-3" />}>
              Adaptado
            </Badge>
          )}
        </div>

        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
          {title}
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed line-clamp-2">
          {description}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-teal-600" />
            {durationMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <Dumbbell className="w-3.5 h-3.5" />
            {exerciseCount} ejercicios
          </span>
        </div>

        <Button
          size="sm"
          variant="primary"
          onClick={onStart}
          leftIcon={<Play className="w-3.5 h-3.5 fill-current" />}
        >
          Iniciar
        </Button>
      </div>
    </Card>
  );
}
