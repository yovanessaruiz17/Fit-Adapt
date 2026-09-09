/**
 * FitAdapt - Card de Ejercicio con Metadatos e Impacto
 * FASE 2: Sistema Visual y UI/UX
 */

import React, { useState } from 'react';
import { Dumbbell, Clock, Flame, ShieldAlert, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Exercise, ImpactLevel } from '../../types/exercise';
import { CompatibilityStatus } from '../../types/compatibility';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

export interface ExerciseCardProps {
  key?: React.Key;
  exercise: Exercise;
  compatibilityStatus?: CompatibilityStatus;
  adaptationReason?: string;
  onSelect?: (exercise: Exercise) => void;
}

export function ExerciseCard({
  exercise,
  compatibilityStatus,
  adaptationReason,
  onSelect,
}: ExerciseCardProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Insignia de Impacto Articular
  const impactConfig = {
    [ImpactLevel.LOW]: { label: 'Bajo Impacto', variant: 'emerald' as const },
    [ImpactLevel.MEDIUM]: { label: 'Impacto Medio', variant: 'warning' as const },
    [ImpactLevel.HIGH]: { label: 'Alto Impacto', variant: 'danger' as const },
  };

  // Insignia de Compatibilidad
  const compatConfig = {
    [CompatibilityStatus.COMPATIBLE]: { label: 'Compatible', variant: 'success' as const },
    [CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION]: {
      label: 'Adaptable',
      variant: 'warning' as const,
    },
    [CompatibilityStatus.NOT_RECOMMENDED]: {
      label: 'No Recomendado',
      variant: 'danger' as const,
    },
  };

  return (
    <>
      <Card
        interactive
        onClick={() => setShowDetailModal(true)}
        className="group flex flex-col justify-between"
      >
        <div className="space-y-2.5">
          {/* Header de Badges */}
          <div className="flex items-center justify-between gap-2">
            <Badge variant={impactConfig[exercise.impact].variant}>
              {impactConfig[exercise.impact].label}
            </Badge>

            {compatibilityStatus && (
              <Badge variant={compatConfig[compatibilityStatus].variant}>
                {compatConfig[compatibilityStatus].label}
              </Badge>
            )}
          </div>

          {/* Título y Descripción */}
          <div>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-snug">
              {exercise.name}
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
              {exercise.description}
            </p>
          </div>

          {/* Si hubo adaptación sugerida */}
          {adaptationReason && (
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-[11px] text-amber-800 dark:text-amber-300">
              <span className="font-semibold">Adaptación:</span> {adaptationReason}
            </div>
          )}
        </div>

        {/* Metadatos Biomecánicos */}
        <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              {exercise.primaryMuscle}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {exercise.defaultRestSeconds}s rest
            </span>
          </div>

          <span className="text-teal-600 dark:text-teal-400 font-medium flex items-center gap-0.5 text-xs group-hover:translate-x-0.5 transition-transform">
            Detalles
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </Card>

      {/* Modal de Detalle Biomecánico del Ejercicio */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={exercise.name}
        description={exercise.description}
        maxWidth="lg"
        footer={
          <Button variant="primary" size="sm" onClick={() => setShowDetailModal(false)}>
            Entendido
          </Button>
        }
      >
        <div className="space-y-4">
          {/* Ficha rápida */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Patrón Motor</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{exercise.movementType}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Impacto Articular</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{exercise.impact}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Nivel Mínimo</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{exercise.minLevelAllowed}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
              <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Descanso</span>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100">{exercise.defaultRestSeconds}s</span>
            </div>
          </div>

          {/* Instrucciones Técnicas */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-2">
              Instrucciones de Ejecución
            </h5>
            <div className="space-y-2">
              {exercise.instructions.map((step) => (
                <div key={step.stepNumber} className="flex items-start gap-2.5 text-xs">
                  <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 font-bold shrink-0 flex items-center justify-center text-[11px] mt-0.5">
                    {step.stepNumber}
                  </span>
                  <div>
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{step.title}: </span>
                    <span className="text-zinc-600 dark:text-zinc-400">{step.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Errores Comunes */}
          {exercise.commonMistakes.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/60 text-xs">
              <h5 className="font-bold text-amber-900 dark:text-amber-300 mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Errores Frecuentes a Evitar
              </h5>
              <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-200/90">
                {exercise.commonMistakes.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Versión de Bajo Impacto si existe */}
          {exercise.lowImpactVersion && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 text-xs">
              <h5 className="font-bold text-emerald-900 dark:text-emerald-300 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Variante Adaptada de Bajo Impacto: {exercise.lowImpactVersion.title}
              </h5>
              <p className="text-emerald-800 dark:text-emerald-200/90 leading-relaxed">
                {exercise.lowImpactVersion.howToPerform}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
