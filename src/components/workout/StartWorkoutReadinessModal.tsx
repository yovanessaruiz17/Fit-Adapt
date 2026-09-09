/**
 * FitAdapt - Modal de Preparación y Comienzo de Entrenamiento
 * FASE 6: Tu Rutina Personalizada
 * 
 * Muestra el checklist biomecánico antes de iniciar la sesión física:
 * - Resumen de duración, ejercicios y equipamiento
 * - Recordatorio de técnica segura y aviso no-médico
 * - Nota de preparación para FASE 7 (Modo Activo)
 */

import React from 'react';
import {
  Play,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Dumbbell,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Workout } from '../../types/workout';

export interface StartWorkoutReadinessModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: Workout;
  onConfirmStart?: () => void;
}

export function StartWorkoutReadinessModal({
  isOpen,
  onClose,
  workout,
  onConfirmStart,
}: StartWorkoutReadinessModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Comenzar Entrenamiento"
      maxWidth="md"
    >
      <div id="start-workout-readiness-modal" className="space-y-5">
        {/* Cabecera del modal */}
        <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60">
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="teal">Sesión Lista</Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {workout.estimatedDurationMinutes} minutos
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
            {workout.title}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-300 mt-1">
            Tu rutina ha sido verificada con 100% de cumplimiento frente a tus limitaciones articulares.
          </p>
        </div>

        {/* Checklist de Preparación */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            Checklist de Seguridad Pre-Entreno
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Espacio y Equipamiento:
                </strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">
                  {workout.metadata?.equipmentUsed && workout.metadata.equipmentUsed.length > 0
                    ? `Prepara: ${workout.metadata.equipmentUsed.join(', ')}.`
                    : 'Espacio libre despejado y agua a mano.'}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
              <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Fase de Calentamiento Inicial:
                </strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">
                  Comienza siempre por los {workout.warmup.length} ejercicios de activación para preparar tendones y líquido sinovial.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-zinc-800 dark:text-zinc-200">
                  Criterio de Cese de Esfuerzo:
                </strong>{' '}
                <span className="text-zinc-600 dark:text-zinc-400">
                  Si sientes dolor articular punzante, detén el ejercicio inmediatamente y utiliza la opción de sustitución.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nota informativa activa FASE 7 */}
        <div className="p-3 rounded-xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200/60 dark:border-teal-800/40 text-[11px] text-teal-800 dark:text-teal-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
          <span>
            <strong>FASE 7 Activa:</strong> La sesión se iniciará en modo guiado a pantalla completa con temporizadores y descansos.
          </span>
        </div>

        {/* Botones de acción */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} className="w-full sm:w-auto">
            Volver a la rutina
          </Button>
          <Button
            id="btn-confirm-start-workout"
            variant="primary"
            size="sm"
            onClick={() => {
              onClose();
              if (onConfirmStart) onConfirmStart();
            }}
            className="w-full sm:w-auto font-bold"
          >
            <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
            ¡Comenzar entrenamiento guiado!
          </Button>
        </div>
      </div>
    </Modal>
  );
}
