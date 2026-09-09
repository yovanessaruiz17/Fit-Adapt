/**
 * FitAdapt - Vista Principal del Asistente (FitAdapt AI)
 * FASE 9: Asistente Contextual FitAdapt AI
 */

import React, { useState } from 'react';
import {
  Bot,
  ShieldCheck,
  Sparkles,
  Lock,
  TestTube,
  Info,
  CheckCircle2,
  Dumbbell,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { UserProfile } from '../types/user';
import { Workout } from '../types/workout';
import { AIActionPayload } from '../core/ai/types';
import { WorkoutAdjuster } from '../core/generator/workoutAdjuster';
import { FitAdaptAIChat } from '../components/ai/FitAdaptAIChat';
import { AIPrivacyModal } from '../components/ai/AIPrivacyModal';
import { AITestSuiteModal } from '../components/ai/AITestSuiteModal';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

export interface AssistantViewProps {
  user: UserProfile;
  workout?: Workout | null;
  activeWorkout?: Workout | null;
  onApplyWorkoutChange?: (newWorkout: Workout) => void;
  onNavigateToWorkout?: () => void;
  onNavigate?: (view: any) => void;
}

export function AssistantView({
  user,
  workout,
  activeWorkout,
  onApplyWorkoutChange,
  onNavigateToWorkout,
  onNavigate,
}: AssistantViewProps) {
  const currentWorkout = workout || activeWorkout;
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);

  const handleActionFromChat = (action: AIActionPayload) => {
    if (!currentWorkout) return;
    let modified = currentWorkout;
    if (action.type === 'CHANGE_DURATION' && action.targetDurationMinutes) {
      modified = WorkoutAdjuster.changeDuration(currentWorkout, action.targetDurationMinutes, user);
    } else if (action.type === 'MAKE_EASIER') {
      modified = WorkoutAdjuster.makeEasier(currentWorkout, user);
    } else if (action.type === 'MAKE_HARDER') {
      modified = WorkoutAdjuster.makeMoreIntense(currentWorkout, user);
    } else if (action.type === 'SUBSTITUTE_EXERCISE' && action.exerciseId) {
      modified = WorkoutAdjuster.substituteExercise(currentWorkout, action.exerciseId, user);
    }
    if (onApplyWorkoutChange) {
      onApplyWorkoutChange(modified);
    }
  };

  const handleGoToWorkout = () => {
    if (onNavigateToWorkout) {
      onNavigateToWorkout();
    } else if (onNavigate) {
      onNavigate('WORKOUT');
    }
  };

  return (
    <div id="assistant-view-container" className="space-y-6 animate-fadeIn max-w-5xl mx-auto">
      {/* Cabecera Informativa de la Fase 9 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-teal-900/10 via-teal-800/5 to-transparent border border-teal-200 dark:border-teal-800/70">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-sm">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                FitAdapt AI
              </h2>
              <Badge variant="teal">FASE 9</Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Asistente de entrenamiento respaldado por el Compatibility Engine y reglas biomecánicas seguras.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="text-xs font-semibold flex items-center gap-1.5"
          >
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            Privacidad
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsTestSuiteOpen(true)}
            className="text-xs font-bold flex items-center gap-1.5 shadow-xs"
          >
            <TestTube className="w-3.5 h-3.5" />
            11 Pruebas AI
          </Button>
        </div>
      </div>

      {/* Grid Principal: Chat Interactivo + Panel de Arquitectura y Contexto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Columna Izquierda / Central: Chat Interactivo */}
        <div className="lg:col-span-8">
          <FitAdaptAIChat
            user={user}
            workout={currentWorkout}
            onApplyWorkoutChange={handleActionFromChat}
          />
        </div>

        {/* Columna Derecha: Panel de Arquitectura y Contexto Activo */}
        <div className="lg:col-span-4 space-y-4">
          {/* Tarjeta de Principio Fundamental */}
          <Card id="card-fundamental-principle" className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-teal-700 dark:text-teal-400">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Principio Fundamental
              </h4>
            </div>

            <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              La IA <strong className="text-zinc-900 dark:text-zinc-100">NO sustituye</strong> al Compatibility Engine ni inventa ejercicios:
            </p>

            {/* Diagrama de Flujo Seguro */}
            <div className="p-3 rounded-2xl bg-zinc-100 dark:bg-zinc-800/70 border border-zinc-200 dark:border-zinc-700/80 text-[11px] font-mono space-y-1 text-zinc-700 dark:text-zinc-300">
              <div className="text-center font-bold text-teal-600 dark:text-teal-400">Usuario</div>
              <div className="text-center text-zinc-400">↓</div>
              <div className="text-center font-semibold">FitAdapt AI Assistant</div>
              <div className="text-center text-zinc-400">↓</div>
              <div className="text-center font-semibold">Contexto Sanitizado</div>
              <div className="text-center text-zinc-400">↓</div>
              <div className="text-center font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 py-1 rounded-lg">
                Compatibility Engine
              </div>
              <div className="text-center text-zinc-400">↓</div>
              <div className="text-center font-bold text-teal-600 dark:text-teal-400">Respuesta Segura</div>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-2 text-[11px] text-amber-900 dark:text-amber-200">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                Cero diagnóstico médico. Ante dolor agudo o síntomas alarmantes, se recomienda evaluación médica presencial.
              </span>
            </div>
          </Card>

          {/* Tarjeta de Contexto de Rutina Vinculada */}
          <Card id="card-active-context" className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                <Dumbbell className="w-4 h-4 text-teal-600" />
                <h4 className="text-xs font-black uppercase tracking-wider">
                  Rutina en Contexto
                </h4>
              </div>
              {currentWorkout && (
                <Badge variant="teal">{currentWorkout.estimatedDurationMinutes} min</Badge>
              )}
            </div>

            {currentWorkout ? (
              <div className="space-y-2 text-xs">
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
                    {currentWorkout.title}
                  </span>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                    {currentWorkout.exercises.length} ejercicios planificados • Nivel {currentWorkout.fitnessLevel}
                  </span>
                </div>

                <div className="flex gap-2">
                  {(onNavigateToWorkout || onNavigate) && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleGoToWorkout}
                      className="w-full text-xs"
                    >
                      Ver Rutina Completa
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                No hay rutina activa cargada. Puedes pedirle al asistente que te prepare o explique un entrenamiento.
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Modales */}
      <AIPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <AITestSuiteModal
        isOpen={isTestSuiteOpen}
        onClose={() => setIsTestSuiteOpen(false)}
      />
    </div>
  );
}
