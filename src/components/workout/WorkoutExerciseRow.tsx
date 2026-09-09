/**
 * FitAdapt - Fila / Ficha de Ejercicio en la Rutina
 * FASE 6: Tu Rutina Personalizada
 * 
 * Muestra:
 * - Nombre y categoría
 * - Instrucciones biomecánicas paso a paso
 * - Series, repeticiones o duración
 * - Descanso entre series
 * - Equipamiento requerido
 * - Nivel técnico
 * - Adaptación o modificación activa (si corresponde)
 * - Ejercicio alternativo sugerido
 * - Acción rápida de sustitución
 */

import React, { useState } from 'react';
import {
  Clock,
  RotateCcw,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Dumbbell,
  ArrowRightLeft,
  Sparkles,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { WorkoutExercise, WorkoutStructureSection } from '../../types/workout';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { getExerciseById } from '../../data/exerciseLibrary';

export interface WorkoutExerciseRowProps {
  key?: React.Key;
  item: WorkoutExercise;
  onSubstitute?: (exerciseId: string) => void;
}

export function WorkoutExerciseRow({ item, onSubstitute }: WorkoutExerciseRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const exercise = item.exerciseSnapshot;

  const sectionBadges: Record<WorkoutStructureSection, { label: string; variant: 'teal' | 'emerald' | 'warning' | 'neutral' }> = {
    [WorkoutStructureSection.WARMUP]: { label: 'Calentamiento', variant: 'teal' },
    [WorkoutStructureSection.MAIN_BLOCK]: { label: 'Principal', variant: 'neutral' },
    [WorkoutStructureSection.FINISHER]: { label: 'Finisher', variant: 'warning' },
    [WorkoutStructureSection.COOLDOWN]: { label: 'Vuelta a la calma', variant: 'emerald' },
  };

  const alternativeEx = item.alternativeExerciseId ? getExerciseById(item.alternativeExerciseId) : null;

  return (
    <div
      id={`workout-exercise-row-${item.exerciseId}`}
      className={`rounded-2xl border transition-all duration-200 ${
        item.wasAdapted
          ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200/80 dark:border-amber-800/60'
          : 'bg-white dark:bg-zinc-900 border-zinc-200/80 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Orden + Nombre + Categoría */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-black text-sm flex items-center justify-center shrink-0 border border-zinc-200 dark:border-zinc-700">
              {item.order}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant={sectionBadges[item.section].variant}>
                  {sectionBadges[item.section].label}
                </Badge>
                <Badge variant="neutral">{exercise.fitnessLevel}</Badge>
                {item.wasAdapted && (
                  <Badge variant="warning" icon={<ShieldAlert className="w-3 h-3" />}>
                    Modificación activa
                  </Badge>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                {exercise.name}
              </h3>
            </div>
          </div>

          {/* Dosis de entrenamiento (Series x Reps / Tiempo + Descanso) */}
          <div className="flex flex-wrap items-center gap-2 sm:self-center shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-xs font-semibold text-zinc-800 dark:text-zinc-200 border border-zinc-200/60 dark:border-zinc-700/60">
              <RotateCcw className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>
                {item.sets} {item.sets === 1 ? 'serie' : 'series'} ×{' '}
                {typeof item.reps === 'object' && 'min' in item.reps
                  ? `${item.reps.min}-${item.reps.max} reps`
                  : item.duration
                  ? `${item.duration}s`
                  : item.reps || '10-12 reps'}
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-xs font-semibold text-zinc-700 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{item.rest}s descanso</span>
            </div>

            {/* Botón desplegar detalles */}
            <Button
              id={`btn-expand-exercise-${item.exerciseId}`}
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-zinc-600 dark:text-zinc-400 min-h-[36px]"
              aria-label={isExpanded ? 'Ocultar detalles' : 'Ver instrucciones'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Pauta de modificación de seguridad si fue adaptado */}
        {item.wasAdapted && item.modification && (
          <div className="mt-3 p-3 rounded-xl bg-amber-100/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-semibold">Adaptación biomecánica: </strong>
              <span>{item.modification}</span>
            </div>
          </div>
        )}

        {/* Detalles expandidos */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-zinc-200/80 dark:border-zinc-800 space-y-4 animate-fadeIn text-xs sm:text-sm">
            {/* Descripción general */}
            <p className="text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {exercise.description}
            </p>

            {/* Equipamiento */}
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-zinc-500" />
              <span className="font-semibold text-zinc-700 dark:text-zinc-300">Equipamiento: </span>
              <span className="text-zinc-600 dark:text-zinc-400">
                {exercise.equipment && exercise.equipment.length > 0
                  ? exercise.equipment.join(', ')
                  : 'Ninguno (Peso corporal)'}
              </span>
            </div>

            {/* Instrucciones paso a paso */}
            {exercise.instructions && exercise.instructions.length > 0 && (
              <div className="space-y-1.5">
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                  Instrucciones técnicas de ejecución:
                </span>
                <ol className="list-decimal list-inside space-y-1 text-zinc-600 dark:text-zinc-400 pl-1">
                  {exercise.instructions.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      <strong className="font-semibold text-zinc-800 dark:text-zinc-200">{step.title}:</strong> {step.description}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Errores comunes a evitar */}
            {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
              <div className="p-3 rounded-xl bg-zinc-100/80 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 block">
                  Errores comunes a evitar:
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-zinc-600 dark:text-zinc-400">
                  {exercise.commonMistakes.map((mistake, idx) => (
                    <li key={idx}>{mistake}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Barra de alternativa y sustitución */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2">
              {alternativeEx ? (
                <div className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>
                    Alternativa biomecánica directa: <strong className="text-zinc-800 dark:text-zinc-200">{alternativeEx.name}</strong>
                  </span>
                </div>
              ) : (
                <div className="text-xs text-zinc-500 dark:text-zinc-400">
                  Ejercicio optimizado de acuerdo a tus limitaciones articulares.
                </div>
              )}

              {onSubstitute && (
                <Button
                  id={`btn-substitute-${item.exerciseId}`}
                  variant="outline"
                  size="sm"
                  onClick={() => onSubstitute(item.exerciseId)}
                  className="shrink-0 text-xs min-h-[36px]"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
                  Sustituir por alternativa
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
