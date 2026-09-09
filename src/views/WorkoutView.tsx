/**
 * FitAdapt - Vista de "Tu Rutina" Personalizada (WORKOUT)
 * FASE 6: Generador de Rutinas Personalizadas y Catálogo
 * 
 * Flujo:
 * UserProfile → Compatibility Engine → Compatible Exercise Pool → Workout Generator → Workout
 * 
 * Características:
 * - Vista principal "Tu rutina" con visualización completa de la sesión
 * - Secciones: Calentamiento, Entrenamiento Principal, Finisher opcional, Vuelta a la Calma
 * - Cada ejercicio muestra: nombre, instrucciones, series/reps/duración, descanso, equipo, nivel, alternativa
 * - Botones principales: "Comenzar entrenamiento", "Regenerar", "Ajustar rutina"
 * - Acciones directas de sustitución individual de ejercicios
 * - Suite de 12 pruebas de validación automatizada
 * - Pestaña secundaria para explorar la biblioteca completa (preservando funcionalidad previa)
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Play,
  RotateCw,
  SlidersHorizontal,
  ShieldCheck,
  ShieldAlert,
  Dumbbell,
  Clock,
  Flame,
  Target,
  Sparkles,
  BookOpen,
  Calendar,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  TestTube,
  Bot,
} from 'lucide-react';
import { UserProfile, FitnessGoal, FitnessLevel } from '../types/user';
import { Workout, WorkoutStructureSection } from '../types/workout';
import { WorkoutGenerator, WorkoutAdjuster } from '../core/generator';
import { WorkoutExerciseRow } from '../components/workout/WorkoutExerciseRow';
import { WorkoutAdjustModal } from '../components/workout/WorkoutAdjustModal';
import { StartWorkoutReadinessModal } from '../components/workout/StartWorkoutReadinessModal';
import { WorkoutTestSuiteModal } from '../components/workout/WorkoutTestSuiteModal';
import { ActiveWorkoutModal } from '../components/active/ActiveWorkoutModal';
import { ExerciseLibraryExplorer } from '../components/ExerciseLibraryExplorer';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export interface WorkoutViewProps {
  user: UserProfile;
  activeWorkout?: Workout | null;
  onWorkoutChange?: (w: Workout) => void;
  onConsultAI?: () => void;
}

export function WorkoutView({
  user,
  activeWorkout,
  onWorkoutChange,
  onConsultAI,
}: WorkoutViewProps) {
  // Pestaña activa: 'ROUTINE' (Tu Rutina) o 'CATALOG' (Explorador de Biblioteca)
  const [activeTab, setActiveTab] = useState<'ROUTINE' | 'CATALOG'>('ROUTINE');

  // Semilla determinista para regeneración variada
  const [generationSeed, setGenerationSeed] = useState<number>(1);

  // Modales
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);
  const [isLiveWorkoutActive, setIsLiveWorkoutActive] = useState(false);

  // Mensaje de notificación temporal de ajuste
  const [adjustmentNotice, setAdjustmentNotice] = useState<string | null>(null);

  // Generación inicial y reactiva frente a cambios del perfil
  const [workout, setWorkout] = useState<Workout>(() => {
    if (activeWorkout) return activeWorkout;
    const result = WorkoutGenerator.generate({
      userProfile: user,
      seed: 1,
    });
    return result.workout;
  });

  // Sincronizar si cambia activeWorkout desde fuera
  useEffect(() => {
    if (activeWorkout && activeWorkout.id !== workout.id) {
      setWorkout(activeWorkout);
    }
  }, [activeWorkout]);

  const updateWorkout = (newWorkout: Workout) => {
    setWorkout(newWorkout);
    onWorkoutChange?.(newWorkout);
  };

  // Si cambia el perfil o la semilla, re-generar respetando parámetros
  useEffect(() => {
    const result = WorkoutGenerator.generate({
      userProfile: user,
      seed: generationSeed,
      targetDurationMinutes: workout?.estimatedDurationMinutes,
      targetGoal: workout?.goal,
    });
    setWorkout(result.workout);
  }, [user, generationSeed]);

  const showNotification = (msg: string) => {
    setAdjustmentNotice(msg);
    setTimeout(() => setAdjustmentNotice(null), 4000);
  };

  // =========================================================================
  // ACCIONES DEL USUARIO
  // =========================================================================

  // Regenerar rutina (Genera otra rutina con alternativas compatibles)
  const handleRegenerate = () => {
    const nextSeed = generationSeed + 1;
    setGenerationSeed(nextSeed);
    const result = WorkoutGenerator.generate({
      userProfile: user,
      seed: nextSeed,
      targetDurationMinutes: workout.estimatedDurationMinutes,
      targetGoal: workout.goal,
    });
    setWorkout(result.workout);
    showNotification('Nueva rutina generada con combinaciones biomecánicas alternativas.');
  };

  // Hacerla más fácil
  const handleMakeEasier = () => {
    const updated = WorkoutAdjuster.makeEasier(workout, user);
    setWorkout(updated);
    showNotification('Rutina ajustada: volumen reducido, pausas incrementadas y variantes suaves aplicadas.');
  };

  // Hacerla más intensa
  const handleMakeMoreIntense = () => {
    const updated = WorkoutAdjuster.makeMoreIntense(workout, user);
    setWorkout(updated);
    showNotification('Rutina ajustada: mayor densidad de trabajo y series dentro de márgenes seguros.');
  };

  // Cambiar duración preset (15, 20, 30, 45, 60 min)
  const handleChangeDuration = (minutes: 15 | 20 | 30 | 45 | 60) => {
    const updated = WorkoutAdjuster.changeDuration(workout, minutes, user);
    setWorkout(updated);
    showNotification(`Duración ajustada a ${minutes} minutos. Bloques y volumen recalculados.`);
  };

  // Cambiar objetivo
  const handleChangeGoal = (goal: FitnessGoal) => {
    const result = WorkoutGenerator.generate({
      userProfile: user,
      targetGoal: goal,
      targetDurationMinutes: workout.estimatedDurationMinutes,
      seed: generationSeed,
    });
    setWorkout(result.workout);
    showNotification(`Objetivo cambiado a ${goal}. Ejercicios rebalanceados.`);
  };

  // Sustituir ejercicio individual por alternativa
  const handleSubstituteExercise = (exerciseId: string) => {
    const updated = WorkoutAdjuster.substituteExercise(workout, exerciseId, user);
    setWorkout(updated);
    showNotification('Ejercicio sustituido exitosamente por su alternativa biomecánica compatible.');
  };

  return (
    <div id="workout-view-container" className="space-y-6 animate-fadeIn pb-12">
      {/* Selector de Pestaña Superior */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="teal" icon={<ShieldCheck className="w-3 h-3" />}>
              FASE 6: Generador Determinista Activo
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              0% Ejercicios Not Recommended
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            {activeTab === 'ROUTINE' ? 'Tu Rutina Personalizada' : 'Biblioteca de Ejercicios'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {activeTab === 'ROUTINE'
              ? 'Ensamblada con lógica determinista basada en tu perfil, limitaciones articulares y equipamiento.'
              : 'Explora y audita el catálogo biomecánico completo con sus reglas de compatibilidad.'}
          </p>
        </div>

        {/* Botones de navegación entre Rutina y Catálogo */}
        <div className="flex items-center gap-2">
          <div className="p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl flex items-center border border-zinc-200/60 dark:border-zinc-700/60">
            <button
              id="tab-btn-routine"
              onClick={() => setActiveTab('ROUTINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'ROUTINE'
                  ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Tu Rutina
            </button>
            <button
              id="tab-btn-catalog"
              onClick={() => setActiveTab('CATALOG')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'CATALOG'
                  ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              Catálogo ({activeTab === 'CATALOG' ? 'Activo' : 'Explorar'})
            </button>
          </div>

          <Button
            id="btn-open-test-suite"
            variant="ghost"
            size="sm"
            onClick={() => setIsTestSuiteOpen(true)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-teal-600 border border-zinc-200 dark:border-zinc-800"
            title="Ejecutar suite de 12 pruebas de la Fase 6"
          >
            <TestTube className="w-4 h-4 mr-1.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Suite Tests</span> (12)
          </Button>
        </div>
      </div>

      {/* Banner de notificación de ajuste */}
      {adjustmentNotice && (
        <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 text-xs sm:text-sm text-teal-900 dark:text-teal-200 flex items-center justify-between gap-3 animate-fadeIn shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{adjustmentNotice}</span>
          </div>
          <button
            onClick={() => setAdjustmentNotice(null)}
            className="text-teal-700 dark:text-teal-300 font-bold hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {/* RENDERIZADO: PESTAÑA CATÁLOGO */}
      {activeTab === 'CATALOG' && (
        <div className="space-y-6">
          <ExerciseLibraryExplorer userProfile={user} />
        </div>
      )}

      {/* RENDERIZADO: PESTAÑA TU RUTINA */}
      {activeTab === 'ROUTINE' && (
        <div className="space-y-6">
          {/* Card Hero de la Rutina Generada */}
          <div className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 shadow-xs relative overflow-hidden">
            <div className="relative z-10 space-y-4">
              {/* Badges de Metadatos */}
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="teal" icon={<Target className="w-3 h-3" />}>
                  {workout.goal}
                </Badge>
                <Badge variant="neutral" icon={<Clock className="w-3 h-3" />}>
                  {workout.estimatedDurationMinutes} minutos
                </Badge>
                <Badge variant="neutral">Nivel: {workout.fitnessLevel}</Badge>
                <Badge variant="neutral">
                  Lugar: {workout.location === 'HOME' ? 'Casa' : 'Gimnasio'}
                </Badge>
                {workout.metadata?.hasModifications && (
                  <Badge variant="warning" icon={<ShieldAlert className="w-3 h-3" />}>
                    Adaptaciones Articulares Incluidas
                  </Badge>
                )}
              </div>

              {/* Título y Descripción */}
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                  {workout.title}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-3xl leading-relaxed">
                  {workout.description}
                </p>
              </div>

              {/* Resumen numérico rápido */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 pt-1">
                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                    Ejercicios Totales
                  </span>
                  <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {workout.exercises.length}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                    Calentamiento
                  </span>
                  <p className="text-xl font-black text-teal-600 dark:text-teal-400 mt-0.5">
                    {workout.warmup.length} ejercicios
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                    Bloque Principal
                  </span>
                  <p className="text-xl font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                    {workout.mainWorkout.length} ejercicios
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/60">
                  <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400 block">
                    Vuelta a la Calma
                  </span>
                  <p className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {workout.cooldown.length} ejercicios
                  </p>
                </div>
              </div>

              {/* Barra de Distribución Biomecánica */}
              {workout.metadata?.balanceDistribution && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-600 dark:text-zinc-400">
                    <span>Equilibrio Muscular de la Sesión:</span>
                    <span>
                      Tren Inferior {workout.metadata.balanceDistribution.lowerBody}% • Superior {workout.metadata.balanceDistribution.upperBody}% • Core {workout.metadata.balanceDistribution.core}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden flex">
                    <div
                      style={{ width: `${workout.metadata.balanceDistribution.lowerBody}%` }}
                      className="bg-teal-500 h-full"
                      title={`Tren Inferior: ${workout.metadata.balanceDistribution.lowerBody}%`}
                    />
                    <div
                      style={{ width: `${workout.metadata.balanceDistribution.upperBody}%` }}
                      className="bg-sky-500 h-full"
                      title={`Tren Superior: ${workout.metadata.balanceDistribution.upperBody}%`}
                    />
                    <div
                      style={{ width: `${workout.metadata.balanceDistribution.core}%` }}
                      className="bg-amber-500 h-full"
                      title={`Core: ${workout.metadata.balanceDistribution.core}%`}
                    />
                    <div
                      style={{ width: `${workout.metadata.balanceDistribution.cardio}%` }}
                      className="bg-rose-500 h-full"
                      title={`Cardio: ${workout.metadata.balanceDistribution.cardio}%`}
                    />
                    <div
                      style={{ width: `${workout.metadata.balanceDistribution.mobility}%` }}
                      className="bg-emerald-500 h-full"
                      title={`Movilidad: ${workout.metadata.balanceDistribution.mobility}%`}
                    />
                  </div>
                </div>
              )}

              {/* Botones de Acción Principales */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
                <Button
                  id="btn-start-workout-main"
                  variant="primary"
                  size="md"
                  onClick={() => setIsStartModalOpen(true)}
                  className="shadow-sm"
                >
                  <Play className="w-4 h-4 mr-2 fill-current" />
                  Comenzar entrenamiento
                </Button>

                <Button
                  id="btn-regenerate-workout"
                  variant="outline"
                  size="md"
                  onClick={handleRegenerate}
                >
                  <RotateCw className="w-4 h-4 mr-2" />
                  Regenerar
                </Button>

                <Button
                  id="btn-open-adjust-modal"
                  variant="outline"
                  size="md"
                  onClick={() => setIsAdjustModalOpen(true)}
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Ajustar rutina
                </Button>

                {onConsultAI && (
                  <Button
                    id="btn-consult-ai-workout"
                    variant="outline"
                    size="md"
                    onClick={onConsultAI}
                    className="border-teal-300 dark:border-teal-800 bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20 font-bold"
                  >
                    <Bot className="w-4 h-4 mr-2 text-teal-600 dark:text-teal-400" />
                    Consultar FitAdapt AI
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECCIÓN 1: CALENTAMIENTO (WARM-UP)                                         */}
          {/* ========================================================================= */}
          <div id="section-warmup" className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block" />
                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                  1. Calentamiento & Activación Articular
                </h3>
              </div>
              <Badge variant="teal">{workout.warmup.length} ejercicios</Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Movilidad dinámica, lubricación articular y activación neuromuscular sin fatiga.
            </p>

            <div className="space-y-3">
              {workout.warmup.map((ex) => (
                <WorkoutExerciseRow
                  key={ex.exerciseId}
                  item={ex}
                  onSubstitute={handleSubstituteExercise}
                />
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECCIÓN 2: ENTRENAMIENTO PRINCIPAL (MAIN WORKOUT)                         */}
          {/* ========================================================================= */}
          <div id="section-main-workout" className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 inline-block" />
                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                  2. Entrenamiento Principal ({workout.goal})
                </h3>
              </div>
              <Badge variant="neutral">{workout.mainWorkout.length} ejercicios</Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Bloque central estructurado según tu objetivo con descansos y dosificación controlada.
            </p>

            <div className="space-y-3">
              {workout.mainWorkout.map((ex) => (
                <WorkoutExerciseRow
                  key={ex.exerciseId}
                  item={ex}
                  onSubstitute={handleSubstituteExercise}
                />
              ))}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECCIÓN 3: FINISHER (OPCIONAL)                                            */}
          {/* ========================================================================= */}
          {workout.finisher && workout.finisher.length > 0 && (
            <div id="section-finisher" className="space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                    3. Finisher Metabólico (Opcional)
                  </h3>
                </div>
                <Badge variant="warning">Densidad Alta</Badge>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Pico final de esfuerzo metabólico o estabilidad del core antes de la vuelta a la calma.
              </p>

              <div className="space-y-3">
                {workout.finisher.map((ex) => (
                  <WorkoutExerciseRow
                    key={ex.exerciseId}
                    item={ex}
                    onSubstitute={handleSubstituteExercise}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* SECCIÓN 4: VUELTA A LA CALMA (COOL-DOWN)                                  */}
          {/* ========================================================================= */}
          <div id="section-cooldown" className="space-y-3 pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                <h3 className="text-base sm:text-lg font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                  {workout.finisher && workout.finisher.length > 0 ? '4.' : '3.'} Vuelta a la Calma & Descompresión
                </h3>
              </div>
              <Badge variant="emerald">{workout.cooldown.length} ejercicios</Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Disminución paulatina de frecuencia cardíaca, relajación miofascial y descompresión espinal.
            </p>

            <div className="space-y-3">
              {workout.cooldown.map((ex) => (
                <WorkoutExerciseRow
                  key={ex.exerciseId}
                  item={ex}
                  onSubstitute={handleSubstituteExercise}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODALES */}
      <WorkoutAdjustModal
        isOpen={isAdjustModalOpen}
        onClose={() => setIsAdjustModalOpen(false)}
        workout={workout}
        onMakeEasier={handleMakeEasier}
        onMakeMoreIntense={handleMakeMoreIntense}
        onChangeDuration={handleChangeDuration}
        onChangeGoal={handleChangeGoal}
      />

      <StartWorkoutReadinessModal
        isOpen={isStartModalOpen}
        onClose={() => setIsStartModalOpen(false)}
        workout={workout}
        onConfirmStart={() => setIsLiveWorkoutActive(true)}
      />

      <ActiveWorkoutModal
        isOpen={isLiveWorkoutActive}
        onClose={() => setIsLiveWorkoutActive(false)}
        workout={workout}
        user={user}
      />

      <WorkoutTestSuiteModal
        isOpen={isTestSuiteOpen}
        onClose={() => setIsTestSuiteOpen(false)}
      />
    </div>
  );
}
