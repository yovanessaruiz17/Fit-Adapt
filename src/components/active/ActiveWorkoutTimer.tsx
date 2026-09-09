/**
 * FitAdapt - Temporizador para Ejercicios Basados en Tiempo
 * FASE 7: Iniciar, Pausar, Continuar, Reiniciar
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ActiveWorkoutTimerProps {
  targetSeconds: number; // Duración objetivo (ej. 30s)
  onComplete: () => void;
  autoStart?: boolean;
}

export function ActiveWorkoutTimer({
  targetSeconds,
  onComplete,
  autoStart = false,
}: ActiveWorkoutTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(targetSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(autoStart);
  const [hasFinished, setHasFinished] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Reiniciar temporizador si cambia el objetivo de ejercicio
  useEffect(() => {
    setSecondsRemaining(targetSeconds);
    setIsRunning(autoStart);
    setHasFinished(false);
  }, [targetSeconds, autoStart]);

  // Ciclo del temporizador
  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      timerRef.current = window.setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setHasFinished(true);
            onComplete();
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
  }, [isRunning, secondsRemaining, onComplete]);

  // Formato mm:ss
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Porcentaje de progreso
  const progressPercent = Math.min(
    100,
    Math.max(0, ((targetSeconds - secondsRemaining) / (targetSeconds || 1)) * 100)
  );

  const handleStart = () => {
    setIsRunning(true);
    setHasFinished(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsRemaining(targetSeconds);
    setHasFinished(false);
  };

  const handleAddSeconds = (extra: number) => {
    setSecondsRemaining((prev) => prev + extra);
    setHasFinished(false);
  };

  return (
    <div
      id="exercise-active-timer-widget"
      className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 select-none"
    >
      {/* Reloj y Anillo de Progreso */}
      <div className="relative flex items-center justify-center w-36 h-36 sm:w-44 sm:h-44">
        {/* Anillo de fondo */}
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            className="stroke-zinc-200 dark:stroke-zinc-800"
            strokeWidth="8"
            fill="transparent"
          />
          <circle
            cx="50%"
            cy="50%"
            r="42%"
            className={`transition-all duration-300 ${
              hasFinished
                ? 'stroke-emerald-500'
                : isRunning
                ? 'stroke-teal-600 dark:stroke-teal-400'
                : 'stroke-amber-500'
            }`}
            strokeWidth="8"
            strokeDasharray="264"
            strokeDashoffset={264 - (264 * progressPercent) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Tiempo Numérico Central */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
            {formatTime(secondsRemaining)}
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mt-0.5">
            {hasFinished ? '¡Tiempo Cumplido!' : isRunning ? 'En Ejecución' : 'Pausado'}
          </span>
        </div>
      </div>

      {/* Controles Táctiles Grandes Accesibles (mínimo 44px) */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 w-full">
        {!isRunning ? (
          <Button
            id="btn-timer-start"
            variant="primary"
            size="md"
            onClick={handleStart}
            className="min-h-[48px] px-5 sm:px-6 text-sm font-bold shadow-sm"
          >
            <Play className="w-4 h-4 mr-2 fill-current" />
            {secondsRemaining < targetSeconds && secondsRemaining > 0 ? 'Continuar' : 'Iniciar'}
          </Button>
        ) : (
          <Button
            id="btn-timer-pause"
            variant="outline"
            size="md"
            onClick={handlePause}
            className="min-h-[48px] px-5 sm:px-6 text-sm font-bold border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 hover:bg-amber-100"
          >
            <Pause className="w-4 h-4 mr-2 fill-current" />
            Pausar
          </Button>
        )}

        <Button
          id="btn-timer-reset"
          variant="outline"
          size="md"
          onClick={handleReset}
          className="min-h-[48px] px-4 text-sm font-medium"
          title="Reiniciar temporizador"
        >
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Reiniciar
        </Button>

        <Button
          id="btn-timer-add10"
          variant="ghost"
          size="md"
          onClick={() => handleAddSeconds(10)}
          className="min-h-[48px] px-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-teal-600 border border-zinc-200 dark:border-zinc-800"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          +10s
        </Button>
      </div>
    </div>
  );
}
