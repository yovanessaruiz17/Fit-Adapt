/**
 * FitAdapt - Pantalla y Contador de Descanso Activo
 * FASE 7: Contador de descanso con pausar, saltar descanso, añadir tiempo y vista previa del siguiente ejercicio
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Coffee,
  Play,
  Pause,
  FastForward,
  Plus,
  Dumbbell,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { WorkoutExercise } from '../../types/workout';
import { getExerciseById } from '../../data/exerciseLibrary';

export interface ActiveWorkoutRestOverlayProps {
  restSeconds: number;
  onFinishRest: () => void;
  nextExercise?: WorkoutExercise;
  currentSetIndex: number;
  totalSets: number;
}

export function ActiveWorkoutRestOverlay({
  restSeconds,
  onFinishRest,
  nextExercise,
  currentSetIndex,
  totalSets,
}: ActiveWorkoutRestOverlayProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(restSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setSecondsRemaining(restSeconds);
    setIsPaused(false);
  }, [restSeconds]);

  useEffect(() => {
    if (!isPaused && secondsRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            onFinishRest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, secondsRemaining, onFinishRest]);

  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleAddSeconds = (extra: number) => {
    setSecondsRemaining((prev) => prev + extra);
  };

  const nextExerciseData = nextExercise ? getExerciseById(nextExercise.exerciseId) : undefined;

  return (
    <div
      id="active-rest-overlay"
      className="p-5 sm:p-8 rounded-3xl bg-white dark:bg-zinc-900 border border-teal-200 dark:border-teal-800/80 shadow-md space-y-6 text-center animate-fadeIn"
    >
      <div className="flex items-center justify-center gap-2">
        <Badge variant="teal" icon={<Coffee className="w-3.5 h-3.5" />}>
          Recuperación Muscular y Cardíaca
        </Badge>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          Serie {currentSetIndex} de {totalSets} finalizada
        </span>
      </div>

      {/* Contador Numérico de Descanso Gigante */}
      <div className="space-y-1">
        <span className="text-5xl sm:text-6xl font-black font-mono tracking-tight text-teal-600 dark:text-teal-400">
          {formatTime(secondsRemaining)}
        </span>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          {isPaused ? 'Descanso en pausa' : 'Respira profundo e hidrátate'}
        </p>
      </div>

      {/* Controles Táctiles de Descanso (Grandes, accesibles) */}
      <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
        <Button
          id="btn-rest-pause-toggle"
          variant="outline"
          size="md"
          onClick={handleTogglePause}
          className="min-h-[48px] px-5 text-sm font-bold"
        >
          {isPaused ? (
            <>
              <Play className="w-4 h-4 mr-2 fill-current" />
              Reanudar
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 mr-2 fill-current" />
              Pausar
            </>
          )}
        </Button>

        <Button
          id="btn-rest-add15"
          variant="outline"
          size="md"
          onClick={() => handleAddSeconds(15)}
          className="min-h-[48px] px-4 text-xs font-bold text-zinc-700 dark:text-zinc-300"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          +15s
        </Button>

        <Button
          id="btn-rest-add30"
          variant="outline"
          size="md"
          onClick={() => handleAddSeconds(30)}
          className="min-h-[48px] px-4 text-xs font-bold text-zinc-700 dark:text-zinc-300"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          +30s
        </Button>

        <Button
          id="btn-rest-skip"
          variant="primary"
          size="md"
          onClick={onFinishRest}
          className="min-h-[48px] px-6 text-sm font-bold shadow-sm"
        >
          <FastForward className="w-4 h-4 mr-2 fill-current" />
          Saltar descanso
        </Button>
      </div>

      {/* Vista Previa del Siguiente Ejercicio */}
      {nextExercise && (
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 text-left space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
              <ArrowRight className="w-3.5 h-3.5" /> A continuación
            </span>
            <span>
              {nextExercise.sets} series • {nextExercise.targetReps ? `${nextExercise.targetReps} reps` : `${nextExercise.targetDurationSeconds}s`}
            </span>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
                {nextExercise.exerciseSnapshot?.name || nextExercise.exerciseId}
              </h4>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1">
                {nextExerciseData?.description || 'Prepárate para la siguiente ronda'}
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-white dark:bg-zinc-700 flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-600">
              <Dumbbell className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
