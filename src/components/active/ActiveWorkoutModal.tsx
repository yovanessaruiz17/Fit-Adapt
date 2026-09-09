/**
 * FitAdapt - Experiencia de Entrenamiento Activo
 * FASE 7: Flujo en tiempo real con temporizador, descansos, registro de series,
 * progreso porcentual, pausa, abandono, persistencia y finalización.
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Pause,
  Play,
  CheckCircle2,
  FastForward,
  RotateCcw,
  Clock,
  Layers,
  AlertTriangle,
  ChevronRight,
  ShieldCheck,
  Flame,
  Activity,
  ArrowLeft,
  Square,
  HelpCircle,
} from 'lucide-react';
import {
  Workout,
  WorkoutExercise,
  WorkoutSession,
  WorkoutSessionStatus,
  PerformedExerciseRecord,
  PerformedSetRecord,
  ActiveWorkoutState,
} from '../../types/workout';
import { UserProfile } from '../../types/user';
import { getExerciseById } from '../../data/exerciseLibrary';
import { SessionStorageManager } from '../../core/session/sessionStorage';
import { ExerciseIllustrationPlaceholder } from './ExerciseIllustrationPlaceholder';
import { ActiveWorkoutTimer } from './ActiveWorkoutTimer';
import { ActiveWorkoutRestOverlay } from './ActiveWorkoutRestOverlay';
import { ActiveWorkoutCompletion } from './ActiveWorkoutCompletion';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface ActiveWorkoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  workout: Workout;
  user: UserProfile;
  initialStateToResume?: ActiveWorkoutState | null;
}

export function ActiveWorkoutModal({
  isOpen,
  onClose,
  workout,
  user,
  initialStateToResume,
}: ActiveWorkoutModalProps) {
  if (!isOpen) return null;

  // Estado del flujo
  const [sessionId] = useState<string>(
    () => initialStateToResume?.sessionId || `session-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
  );
  const [startTime] = useState<string>(() => new Date().toISOString());

  // Índices de navegación de ejercicios y series
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(
    initialStateToResume?.currentExerciseIndex || 0
  );
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(
    initialStateToResume?.currentSetIndex || 1
  );

  // Estados de descanso y pausa
  const [isResting, setIsResting] = useState<boolean>(
    initialStateToResume?.isResting || false
  );
  const [isPausedModalOpen, setIsPausedModalOpen] = useState<boolean>(false);
  const [isWorkoutFinished, setIsWorkoutFinished] = useState<boolean>(false);
  const [finalSessionData, setFinalSessionData] = useState<WorkoutSession | null>(null);

  // Contador global de tiempo transcurrido (en segundos)
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    initialStateToResume?.elapsedSeconds || 0
  );

  // Registro de ejercicios y series completadas
  const [performedExercises, setPerformedExercises] = useState<PerformedExerciseRecord[]>(
    () =>
      initialStateToResume?.performedExercises ||
      workout.exercises.map((ex) => ({
        exerciseId: ex.exerciseId,
        exerciseName: ex.exerciseSnapshot?.name || ex.exerciseId,
        completedSets: [],
        skipped: false,
      }))
  );

  // Total de series del entrenamiento
  const totalSetsInWorkout = workout.exercises.reduce((acc, ex) => acc + (ex.sets || 3), 0);

  // Series completadas en total
  const completedSetsCount = performedExercises.reduce(
    (acc, ex) => acc + (ex.completedSets ? ex.completedSets.length : 0),
    0
  );

  // Ejercicios completados (donde se hicieron todas las series o se saltó)
  const completedExercisesCount = performedExercises.filter(
    (pe, idx) => pe.completedSets.length >= (workout.exercises[idx]?.sets || 3) || pe.skipped
  ).length;

  // Cronómetro global en segundo plano
  useEffect(() => {
    let interval: number | null = null;
    if (!isPausedModalOpen && !isWorkoutFinished) {
      interval = window.setInterval(() => {
        setElapsedSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPausedModalOpen, isWorkoutFinished]);

  // Persistencia reactiva en localStorage
  useEffect(() => {
    if (!isWorkoutFinished) {
      const stateToPersist: ActiveWorkoutState = {
        sessionId,
        workout,
        currentExerciseIndex,
        currentSetIndex,
        isResting,
        restSecondsRemaining: 30,
        elapsedSeconds,
        isPaused: isPausedModalOpen,
        isTimerRunning: false,
        exerciseTimerSeconds: 30,
        completedSetsCount,
        completedExercisesCount,
        performedExercises,
        lastSavedTimestamp: Date.now(),
      };
      SessionStorageManager.saveActiveState(stateToPersist);
    }
  }, [
    sessionId,
    workout,
    currentExerciseIndex,
    currentSetIndex,
    isResting,
    elapsedSeconds,
    isPausedModalOpen,
    completedSetsCount,
    completedExercisesCount,
    performedExercises,
    isWorkoutFinished,
  ]);

  // Ejercicio actual
  const currentItem = workout.exercises[currentExerciseIndex] || workout.exercises[0];
  const currentExerciseData = getExerciseById(currentItem?.exerciseId);
  const totalSetsForCurrent = currentItem?.sets || 3;
  const isTimeBased = !!currentItem?.targetDurationSeconds && currentItem.targetDurationSeconds > 0;

  // Siguiente ejercicio para preview
  const nextItem = workout.exercises[currentExerciseIndex + 1];

  // Cálculo de Porcentaje de Progreso
  const progressPercent = Math.min(
    100,
    Math.round((completedSetsCount / (totalSetsInWorkout || 1)) * 100)
  );

  // Estimación de tiempo restante (minutos)
  const estimatedRemainingMinutes = Math.max(
    1,
    Math.round((workout.estimatedDurationMinutes * (100 - progressPercent)) / 100)
  );

  // Formato mm:ss para el tiempo transcurrido
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // =========================================================================
  // ACCIONES DEL ENTRENAMIENTO
  // =========================================================================

  // Completar serie actual
  const handleCompleteSet = () => {
    const targetRepsVal =
      typeof currentItem.targetReps === 'number'
        ? currentItem.targetReps
        : typeof currentItem.reps === 'number'
        ? currentItem.reps
        : 12;

    const newRecord: PerformedSetRecord = {
      setNumber: currentSetIndex,
      repsCompleted: targetRepsVal,
      durationSeconds: currentItem.targetDurationSeconds,
      perceivedEffortRPE: 7,
    };

    const updatedPerformed = [...performedExercises];
    if (updatedPerformed[currentExerciseIndex]) {
      updatedPerformed[currentExerciseIndex].completedSets.push(newRecord);
      setPerformedExercises(updatedPerformed);
    }

    // ¿Quedan más series de este ejercicio?
    if (currentSetIndex < totalSetsForCurrent) {
      setCurrentSetIndex((prev) => prev + 1);
      setIsResting(true);
    } else {
      // Ejercicio completado: pasar al siguiente
      if (currentExerciseIndex < workout.exercises.length - 1) {
        setCurrentExerciseIndex((prev) => prev + 1);
        setCurrentSetIndex(1);
        setIsResting(true);
      } else {
        // ¡Último ejercicio y última serie completada!
        finishWorkout(true);
      }
    }
  };

  // Terminar período de descanso
  const handleFinishRest = () => {
    setIsResting(false);
  };

  // Saltar ejercicio actual
  const handleSkipExercise = () => {
    const updated = [...performedExercises];
    if (updated[currentExerciseIndex]) {
      updated[currentExerciseIndex].skipped = true;
      updated[currentExerciseIndex].skipReason = 'Saltado por el usuario';
      setPerformedExercises(updated);
    }

    if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1);
      setCurrentSetIndex(1);
      setIsResting(false);
    } else {
      finishWorkout(true);
    }
  };

  // Finalizar entrenamiento (Completado o Abandonado)
  const finishWorkout = (completed: boolean) => {
    const endTime = new Date().toISOString();
    const finalSets = completedSetsCount + (completed && !isWorkoutFinished ? 1 : 0);
    const completionPct = completed
      ? 100
      : Math.round((completedSetsCount / (totalSetsInWorkout || 1)) * 100);

    const sessionRecord: WorkoutSession = {
      id: sessionId,
      workoutId: workout.id,
      workoutTitle: workout.title,
      userId: user.id || 'default-user',
      status: completed ? WorkoutSessionStatus.COMPLETED : WorkoutSessionStatus.ABANDONED,
      date: new Date().toISOString().split('T')[0],
      startTime,
      endTime,
      startedAt: startTime,
      finishedAt: endTime,
      duration: elapsedSeconds,
      durationSeconds: elapsedSeconds,
      actualDurationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
      goal: workout.goal,
      completedExercises: completedExercisesCount,
      totalExercises: workout.exercises.length,
      completedSets: finalSets,
      totalSets: totalSetsInWorkout,
      completionPercentage: completionPct,
      performedExercises,
    };

    // Guardar en almacenamiento persistente
    SessionStorageManager.saveSession(sessionRecord);
    SessionStorageManager.clearActiveState();

    setFinalSessionData(sessionRecord);
    setIsWorkoutFinished(true);
  };

  // Abandonar sesión en curso
  const handleAbandonWorkout = () => {
    setIsPausedModalOpen(false);
    finishWorkout(false);
    onClose();
  };

  // Si ya terminó, mostrar la pantalla de éxito
  if (isWorkoutFinished && finalSessionData) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
        <ActiveWorkoutCompletion
          session={finalSessionData}
          onReturnHome={() => {
            setIsWorkoutFinished(false);
            onClose();
          }}
        />
      </div>
    );
  }

  return (
    <div
      id="active-workout-fullscreen-container"
      className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-md flex flex-col justify-between overflow-y-auto select-none"
    >
      {/* ========================================================================= */}
      {/* 1. BARRA SUPERIOR DE ESTADO Y PROGRESO                                     */}
      {/* ========================================================================= */}
      <header className="w-full max-w-4xl mx-auto px-4 py-3 sm:py-4 bg-zinc-900/90 border-b border-zinc-800 flex items-center justify-between gap-3 sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            id="btn-active-workout-pause"
            variant="outline"
            size="sm"
            onClick={() => setIsPausedModalOpen(true)}
            className="min-h-[44px] min-w-[44px] px-3 font-bold border-zinc-700 text-zinc-200 bg-zinc-800 hover:bg-zinc-700"
            title="Pausar entrenamiento"
          >
            <Pause className="w-4 h-4 mr-1.5 fill-current" />
            Pausa
          </Button>

          <div>
            <h3 className="text-xs sm:text-sm font-black text-zinc-100 tracking-tight truncate max-w-[180px] sm:max-w-md">
              {workout.title}
            </h3>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-teal-400" />
                {formatTime(elapsedSeconds)}
              </span>
              <span>•</span>
              <span>~{estimatedRemainingMinutes} min restantes</span>
            </div>
          </div>
        </div>

        {/* Indicador de Progreso Porcentual */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-bold text-zinc-300">
              {progressPercent}% completado
            </span>
            <div className="text-[10px] text-zinc-400">
              Ej. {currentExerciseIndex + 1} de {workout.exercises.length}
            </div>
          </div>
          <div className="w-12 sm:w-20 bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-700">
            <div
              style={{ width: `${progressPercent}%` }}
              className="bg-teal-500 h-full transition-all duration-300"
            />
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. CUERPO PRINCIPAL ENFOCADO                                              */}
      {/* ========================================================================= */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 space-y-4">
        {/* MODO DESCANSO INTER-SERIES */}
        {isResting ? (
          <ActiveWorkoutRestOverlay
            restSeconds={currentItem.rest || currentItem.restSecondsAfter || 45}
            onFinishRest={handleFinishRest}
            nextExercise={
              currentSetIndex <= totalSetsForCurrent ? currentItem : nextItem
            }
            currentSetIndex={currentSetIndex - 1}
            totalSets={totalSetsForCurrent}
          />
        ) : (
          /* MODO EJECUCIÓN ACTIVA DEL EJERCICIO */
          <div className="space-y-4 animate-fadeIn">
            {/* Cabecera del Ejercicio Actual */}
            <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="teal">
                    Ejercicio {currentExerciseIndex + 1} de {workout.exercises.length}
                  </Badge>
                  <span className="text-xs text-zinc-400">
                    Sección {currentExerciseIndex < workout.warmup.length ? 'Calentamiento' : currentExerciseIndex >= workout.exercises.length - workout.cooldown.length ? 'Enfriamiento' : 'Principal'}
                  </span>
                </div>

                {/* Indicador de Serie Actual con Pills */}
                <div className="flex items-center gap-1.5 bg-zinc-800/80 px-2.5 py-1 rounded-full border border-zinc-700">
                  <Layers className="w-3.5 h-3.5 text-teal-400 mr-1" />
                  <span className="text-xs font-black text-zinc-200">
                    Serie {currentSetIndex} / {totalSetsForCurrent}
                  </span>
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black text-zinc-50 tracking-tight">
                  {currentItem.exerciseSnapshot?.name || currentItem.exerciseId}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  {currentExerciseData?.description || 'Ejecuta el movimiento con técnica controlada.'}
                </p>
              </div>

              {/* Adaptación Biomecánica si aplica */}
              {currentItem.wasAdapted && currentItem.modification && (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-semibold text-amber-300">
                      Adaptación Articular:
                    </strong>{' '}
                    <span>{currentItem.modification}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Demostración / Placeholder Visual */}
            <ExerciseIllustrationPlaceholder
              exerciseName={currentItem.exerciseSnapshot?.name || currentItem.exerciseId}
              category={currentExerciseData?.category || 'FUERZA_GENERAL' as any}
              bodyArea={currentExerciseData?.bodyArea}
              movementType={currentExerciseData?.movementType}
              primaryMuscle={currentExerciseData?.primaryMuscle as string}
              isAdapted={currentItem.wasAdapted}
            />

            {/* Dosificación: Temporizador o Repeticiones */}
            {isTimeBased ? (
              <ActiveWorkoutTimer
                targetSeconds={currentItem.targetDurationSeconds || 30}
                onComplete={handleCompleteSet}
                autoStart={false}
              />
            ) : (
              <div className="p-4 sm:p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-center space-y-2">
                <span className="text-xs uppercase font-bold text-zinc-400 tracking-wider">
                  Objetivo de Repeticiones
                </span>
                <div className="text-4xl sm:text-5xl font-black text-teal-400 font-mono">
                  {currentItem.targetReps || 12}
                </div>
                <p className="text-xs text-zinc-400">
                  Rango objetivo para la serie {currentSetIndex} de {totalSetsForCurrent}
                </p>
              </div>
            )}

            {/* Instrucciones Técnicas y Pautas */}
            {currentExerciseData?.instructions && currentExerciseData.instructions.length > 0 && (
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
                <span className="font-bold text-zinc-300 block uppercase tracking-wider text-[10px]">
                  Pautas Técnicas de Ejecución:
                </span>
                <ul className="space-y-1.5 text-zinc-400 pl-1">
                  {currentExerciseData.instructions.map((inst, i) => (
                    <li key={i} className="leading-relaxed">
                      <strong className="text-zinc-200">{inst.title}:</strong> {inst.description}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. BARRA INFERIOR DE ACCIÓN TÁCTIL (Grandes, mínimo 48px)                  */}
      {/* ========================================================================= */}
      <footer className="w-full max-w-3xl mx-auto px-4 py-3 sm:py-4 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between gap-3 sticky bottom-0 z-20 backdrop-blur-md">
        <Button
          id="btn-active-skip-exercise"
          variant="outline"
          size="md"
          onClick={handleSkipExercise}
          className="min-h-[48px] px-4 text-xs font-semibold text-zinc-400 border-zinc-700 bg-zinc-800/60 hover:bg-zinc-800"
          title="Saltar este ejercicio"
        >
          <FastForward className="w-4 h-4 mr-1.5" />
          Saltar
        </Button>

        {!isResting && (
          <Button
            id="btn-active-complete-set"
            variant="primary"
            size="lg"
            onClick={handleCompleteSet}
            className="flex-1 min-h-[52px] text-base font-black shadow-lg bg-teal-500 hover:bg-teal-400 text-zinc-950"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Completar Serie ({currentSetIndex}/{totalSetsForCurrent})
          </Button>
        )}
      </footer>

      {/* ========================================================================= */}
      {/* MODAL DE PAUSA Y CONFIRMACIÓN DE ABANDONO                                  */}
      {/* ========================================================================= */}
      {isPausedModalOpen && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md p-6 rounded-3xl bg-zinc-900 border border-zinc-700 text-center space-y-5 shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-950/60 border border-amber-700/80 flex items-center justify-center mx-auto text-amber-400">
              <Pause className="w-6 h-6 fill-current" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-zinc-100">
                Entrenamiento en Pausa
              </h3>
              <p className="text-xs text-zinc-400">
                Tiempo acumulado: <strong className="text-zinc-200">{formatTime(elapsedSeconds)}</strong> • Progreso: <strong className="text-teal-400">{progressPercent}%</strong>
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <Button
                id="btn-pause-resume"
                variant="primary"
                size="lg"
                onClick={() => setIsPausedModalOpen(false)}
                className="w-full min-h-[48px] text-sm font-bold shadow-sm"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Continuar entrenamiento
              </Button>

              <Button
                id="btn-pause-abandon"
                variant="outline"
                size="md"
                onClick={handleAbandonWorkout}
                className="w-full min-h-[44px] text-xs font-semibold text-rose-400 border-rose-800/80 hover:bg-rose-950/40"
              >
                <Square className="w-3.5 h-3.5 mr-1.5" />
                Abandonar sesión (Guardar progreso actual)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
