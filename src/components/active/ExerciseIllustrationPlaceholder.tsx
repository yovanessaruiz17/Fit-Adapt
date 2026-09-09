/**
 * FitAdapt - Placeholder Visual y Demostración Biomecánica
 * FASE 7: Experiencia de Entrenamiento Activo
 * 
 * Diseñado con alto contraste, visualización anatómica y preparado
 * para integración futura de video / animación 3D.
 */

import React from 'react';
import { Activity, Dumbbell, ShieldCheck, Flame, Sparkles } from 'lucide-react';
import { BodyArea, MovementType, ExerciseCategory } from '../../types/exercise';

export interface ExerciseIllustrationPlaceholderProps {
  exerciseName: string;
  category: ExerciseCategory;
  bodyArea?: BodyArea;
  movementType?: MovementType;
  primaryMuscle?: string;
  isAdapted?: boolean;
}

export function ExerciseIllustrationPlaceholder({
  exerciseName,
  category,
  bodyArea,
  primaryMuscle,
  isAdapted,
}: ExerciseIllustrationPlaceholderProps) {
  // Paleta de color y acento según zona corporal o categoría
  const getAreaColor = () => {
    switch (bodyArea) {
      case BodyArea.LOWER_BODY:
      case BodyArea.LEGS:
      case BodyArea.GLUTES:
        return 'from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-600 dark:text-teal-400';
      case BodyArea.UPPER_BODY:
      case BodyArea.CHEST:
      case BodyArea.BACK:
      case BodyArea.SHOULDERS:
      case BodyArea.ARMS:
        return 'from-sky-500/20 to-indigo-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400';
      case BodyArea.CORE:
        return 'from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400';
      default:
        return 'from-teal-500/20 to-zinc-500/10 border-zinc-500/30 text-teal-600 dark:text-teal-400';
    }
  };

  return (
    <div
      id="exercise-demonstration-box"
      className={`w-full rounded-2xl border bg-gradient-to-b p-5 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[190px] sm:min-h-[220px] transition-all select-none ${getAreaColor()}`}
    >
      {/* Indicador de foco muscular */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm border border-zinc-200/80 dark:border-zinc-800 text-[11px] font-bold text-zinc-700 dark:text-zinc-300">
        <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-pulse" />
        <span>Foco: {primaryMuscle || bodyArea || 'Full Body'}</span>
      </div>

      {isAdapted && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/80 border border-amber-300 dark:border-amber-700/80 text-[11px] font-bold text-amber-800 dark:text-amber-300">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Variante Adaptada</span>
        </div>
      )}

      {/* Silueta / Iconografía Dinámica */}
      <div className="flex flex-col items-center justify-center my-auto text-center space-y-2.5">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/90 dark:bg-zinc-800/90 shadow-sm flex items-center justify-center border border-white/50 dark:border-zinc-700/50">
          <Dumbbell className="w-8 h-8 sm:w-10 sm:h-10 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h4 className="font-black text-sm sm:text-base text-zinc-900 dark:text-zinc-100 tracking-tight">
            {exerciseName}
          </h4>
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
            Demostración técnica guiada • {category}
          </span>
        </div>
      </div>

      {/* Pie sutil del placeholder */}
      <div className="w-full flex items-center justify-between text-[10px] text-zinc-500 dark:text-zinc-400 pt-2 border-t border-zinc-200/40 dark:border-zinc-800/40">
        <span>Patrón biomecánico protegido</span>
        <span>Demostración visual v1.0</span>
      </div>
    </div>
  );
}
