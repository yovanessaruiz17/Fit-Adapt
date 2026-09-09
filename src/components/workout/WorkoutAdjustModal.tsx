/**
 * FitAdapt - Modal para Ajustar Rutina
 * FASE 6: Ajustes Dinámicos Biomecánicos
 * 
 * Permite al usuario:
 * - Hacerla más fácil (reduce series, alarga descansos, regresiones suaves)
 * - Hacerla más intensa (aumenta densidad o series de forma segura)
 * - Cambiar duración (presets: 15, 20, 30, 45, 60 min)
 * - Cambiar objetivo principal
 */

import React from 'react';
import {
  SlidersHorizontal,
  Flame,
  Feather,
  Clock,
  Target,
  CheckCircle2,
  X,
  ShieldCheck,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { FitnessGoal, FitnessLevel } from '../../types/user';
import { Workout } from '../../types/workout';

export interface WorkoutAdjustModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: Workout;
  onMakeEasier: () => void;
  onMakeMoreIntense: () => void;
  onChangeDuration: (minutes: 15 | 20 | 30 | 45 | 60) => void;
  onChangeGoal: (goal: FitnessGoal) => void;
}

export function WorkoutAdjustModal({
  isOpen,
  onClose,
  workout,
  onMakeEasier,
  onMakeMoreIntense,
  onChangeDuration,
  onChangeGoal,
}: WorkoutAdjustModalProps) {
  const currentDuration = workout.estimatedDurationMinutes;
  const currentGoal = workout.goal;

  const durationPresets: Array<15 | 20 | 30 | 45 | 60> = [15, 20, 30, 45, 60];

  const goals: Array<{ id: FitnessGoal; label: string; desc: string }> = [
    { id: FitnessGoal.WEIGHT_LOSS, label: 'Pérdida de Grasa', desc: 'Cardio + Full Body metabólico' },
    { id: FitnessGoal.TONING, label: 'Tonificación', desc: 'Resistencia muscular y firmeza' },
    { id: FitnessGoal.CARDIO, label: 'Cardio', desc: 'Resistencia aeróbica y energía' },
    { id: FitnessGoal.STRENGTH, label: 'Fuerza', desc: 'Tensión muscular y descansos largos' },
    { id: FitnessGoal.MOBILITY, label: 'Movilidad', desc: 'Control corporal y amplitud articular' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Ajustar Rutina Personalizada"
      maxWidth="lg"
    >
      <div id="workout-adjust-modal-content" className="space-y-6">
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Personaliza los parámetros de tu entrenamiento. Cualquier modificación volverá a pasar automáticamente por las salvaguardas del Compatibility Engine.
        </p>

        {/* Sección: Intensidad y Nivel de Esfuerzo */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
            Nivel de Esfuerzo Inmediato
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              id="btn-adjust-easier"
              onClick={() => {
                onMakeEasier();
                onClose();
              }}
              className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-teal-500 dark:hover:border-teal-400 hover:bg-teal-50/40 dark:hover:bg-teal-950/20 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <Feather className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Hacerla más suave / fácil
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Reduce el volumen de series, incrementa los tiempos de descanso y prioriza variantes de bajo estrés articular.
              </p>
            </button>

            <button
              id="btn-adjust-harder"
              onClick={() => {
                onMakeMoreIntense();
                onClose();
              }}
              className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 dark:hover:border-amber-400 hover:bg-amber-50/40 dark:hover:bg-amber-950/20 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <Flame className="w-4 h-4 text-amber-500" />
                <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                  Hacerla más intensa
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                Aumenta la densidad metabólica, acorta intervalos de pausa y suma series dentro de márgenes biomecánicamente seguros.
              </p>
            </button>
          </div>
        </div>

        {/* Sección: Presets de Duración */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
            Duración de la Sesión (Presets Oficiales)
          </label>
          <div className="grid grid-cols-5 gap-2">
            {durationPresets.map((dur) => {
              const isSelected = currentDuration === dur;
              return (
                <button
                  key={dur}
                  id={`btn-preset-${dur}`}
                  onClick={() => {
                    onChangeDuration(dur);
                    onClose();
                  }}
                  className={`py-2.5 px-2 rounded-xl text-center border font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                      : 'bg-zinc-100 dark:bg-zinc-800/60 border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span>{dur} min</span>
                    <span className="text-[10px] font-normal opacity-80 mt-0.5 hidden sm:inline">
                      {dur <= 20 ? 'Exprés' : dur <= 45 ? 'Estándar' : 'Completa'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sección: Cambio de Objetivo */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
            Reorientar Objetivo de Entrenamiento
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {goals.map((g) => {
              const isSelected = currentGoal === g.id;
              return (
                <button
                  key={g.id}
                  id={`btn-goal-${g.id}`}
                  onClick={() => {
                    onChangeGoal(g.id);
                    onClose();
                  }}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-teal-600 bg-teal-50/60 dark:bg-teal-950/40 text-teal-900 dark:text-teal-100 ring-1 ring-teal-500'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs sm:text-sm">{g.label}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{g.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pie de modal */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
