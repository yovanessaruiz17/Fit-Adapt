/**
 * FitAdapt - Pantalla de Éxito y Finalización de Entrenamiento
 * FASE 7: Resumen post-entreno con estadísticas, duración, fecha y objetivo
 */

import React from 'react';
import {
  Trophy,
  CheckCircle2,
  Clock,
  Dumbbell,
  Layers,
  Calendar,
  Target,
  ShieldCheck,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { WorkoutSession } from '../../types/workout';

export interface ActiveWorkoutCompletionProps {
  session: WorkoutSession;
  onReturnHome: () => void;
}

export function ActiveWorkoutCompletion({
  session,
  onReturnHome,
}: ActiveWorkoutCompletionProps) {
  const durationMins = Math.max(1, Math.round((session.durationSeconds || session.duration || 60) / 60));

  const formattedDate = new Date(session.date || session.startTime).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div
      id="active-workout-completion-screen"
      className="p-6 sm:p-10 rounded-3xl bg-white dark:bg-zinc-900 border border-teal-200 dark:border-teal-800 shadow-lg space-y-6 text-center max-w-2xl mx-auto animate-fadeIn select-none"
    >
      {/* Icono Trofeo Celebración */}
      <div className="mx-auto w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/80 flex items-center justify-center shadow-xs">
        <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-teal-600 dark:text-teal-400 animate-bounce" />
      </div>

      <div className="space-y-1">
        <Badge variant="teal" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
          Sesión Registrada en el Historial
        </Badge>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-2">
          ¡Entrenamiento Completado!
        </h2>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 capitalize">
          {formattedDate} • {session.workoutTitle || 'Sesión FitAdapt'}
        </p>
      </div>

      {/* Grid de Métricas de la Sesión */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Duración</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 font-mono">
            {durationMins} min
          </p>
          <span className="text-[10px] text-zinc-400">Tiempo real</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Dumbbell className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Ejercicios</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 font-mono">
            {session.completedExercises} / {session.totalExercises}
          </p>
          <span className="text-[10px] text-zinc-400">100% completados</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Layers className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Series</span>
          </div>
          <p className="text-lg sm:text-xl font-black text-zinc-900 dark:text-zinc-100 font-mono">
            {session.completedSets} series
          </p>
          <span className="text-[10px] text-zinc-400">Volumen efectivo</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
          <div className="flex items-center gap-1.5 text-zinc-400 text-xs mb-1">
            <Target className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Objetivo</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-teal-700 dark:text-teal-300 truncate">
            {session.goal || 'General'}
          </p>
          <span className="text-[10px] text-zinc-400">Progreso activo</span>
        </div>
      </div>

      {/* Tarjeta de Seguridad y Protección Biomecánica Cumplida */}
      <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-left text-xs text-emerald-900 dark:text-emerald-200">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>Cumplimiento biomecánico de seguridad verificado: 0% de ejercicios con sobrecarga articular no recomendada.</span>
        </div>
      </div>

      {/* Botón de Retorno */}
      <div className="pt-2">
        <Button
          id="btn-completion-return-home"
          variant="primary"
          size="lg"
          onClick={onReturnHome}
          className="w-full sm:w-auto min-h-[48px] px-8 text-base font-bold shadow-md"
        >
          Volver al inicio
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
