/**
 * FitAdapt - Vista de Plan Semanal y Calendario (PLAN)
 * FASE 7: Planificación Semanal Determinista, Calendario (Semana y Mes)
 * y Lanzamiento de Entrenamiento Activo
 */

import React, { useState, useEffect } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Clock,
  Dumbbell,
  ShieldCheck,
  Play,
  BookOpen,
  Calendar,
  Layers,
  TestTube,
  Sparkles,
  Flame,
  Coffee,
} from 'lucide-react';
import { UserProfile } from '../types/user';
import { Workout, WorkoutPlan, WorkoutSession } from '../types/workout';
import { WeeklyPlanner } from '../core/planner/weeklyPlanner';
import { SessionStorageManager } from '../core/session/sessionStorage';
import { WeeklyCalendarView } from '../components/plan/WeeklyCalendarView';
import { MonthlyCalendarView } from '../components/plan/MonthlyCalendarView';
import { ExerciseLibraryExplorer } from '../components/ExerciseLibraryExplorer';
import { ActiveWorkoutModal } from '../components/active/ActiveWorkoutModal';
import { Phase7TestSuiteModal } from '../components/active/Phase7TestSuiteModal';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';

export interface PlanViewProps {
  user: UserProfile;
  onStartWorkout?: (workout?: Workout) => void;
}

export function PlanView({ user, onStartWorkout }: PlanViewProps) {
  const [activeTab, setActiveTab] = useState<'WEEK' | 'MONTH' | 'LIBRARY'>('WEEK');

  // Historial de sesiones guardadas
  const [completedSessions, setCompletedSessions] = useState<WorkoutSession[]>(() =>
    SessionStorageManager.getHistory()
  );

  // Plan semanal generado reactivamente
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan>(() =>
    WeeklyPlanner.generateWeeklyPlan(user, SessionStorageManager.getHistory())
  );

  // Sesión seleccionada para vista rápida o inicio
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);

  // Estado del entrenamiento activo
  const [isLiveWorkoutOpen, setIsLiveWorkoutOpen] = useState(false);
  const [activeWorkoutToRun, setActiveWorkoutToRun] = useState<Workout | null>(null);

  // Modal de Suite de Tests Fase 7
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);

  // Recalcular plan cuando cambie el usuario o el historial
  useEffect(() => {
    const history = SessionStorageManager.getHistory();
    setCompletedSessions(history);
    setWorkoutPlan(WeeklyPlanner.generateWeeklyPlan(user, history));
  }, [user]);

  const handleStartActive = (workout: Workout) => {
    setActiveWorkoutToRun(workout);
    setIsLiveWorkoutOpen(true);
    if (onStartWorkout) onStartWorkout(workout);
  };

  const handleCloseActive = () => {
    setIsLiveWorkoutOpen(false);
    setActiveWorkoutToRun(null);
    // Recargar historial y calendario
    const history = SessionStorageManager.getHistory();
    setCompletedSessions(history);
    setWorkoutPlan(WeeklyPlanner.generateWeeklyPlan(user, history));
  };

  const activeDaysCount = workoutPlan.weeklySchedule.filter((d) => !d.isRestDay).length;
  const restDaysCount = 7 - activeDaysCount;

  return (
    <div id="plan-view-container" className="space-y-6 animate-fadeIn pb-12">
      {/* Cabecera de la vista */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-zinc-200/80 dark:border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="teal">
              FASE 7: Planificación & Calendario
            </Badge>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {activeDaysCount} días activos • {restDaysCount} días descanso
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            {activeTab === 'WEEK'
              ? 'Plan Semanal de Entrenamiento'
              : activeTab === 'MONTH'
              ? 'Calendario Mensual'
              : 'Biblioteca de Ejercicios'}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            {activeTab === 'WEEK'
              ? 'Distribución equilibrada y no lesiva, programada según tu objetivo de ' + user.primaryGoal + ' y nivel ' + user.fitnessLevel + '.'
              : activeTab === 'MONTH'
              ? 'Historial y previsión mensual de sesiones (UPCOMING, TODAY, COMPLETED, MISSED, REST).'
              : 'Catálogo biomecánico completo de ejercicios con reglas de compatibilidad.'}
          </p>
        </div>

        {/* Selector de Pestaña y Botón de Suite de Pruebas */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/60">
            <button
              id="tab-btn-week"
              onClick={() => setActiveTab('WEEK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'WEEK'
                  ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Semana</span>
            </button>
            <button
              id="tab-btn-month"
              onClick={() => setActiveTab('MONTH')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'MONTH'
                  ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Mes</span>
            </button>
            <button
              id="tab-btn-library"
              onClick={() => setActiveTab('LIBRARY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'LIBRARY'
                  ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Biblioteca</span>
            </button>
          </div>

          <Button
            id="btn-open-phase7-tests"
            variant="ghost"
            size="sm"
            onClick={() => setIsTestSuiteOpen(true)}
            className="text-zinc-600 dark:text-zinc-400 hover:text-teal-600 border border-zinc-200 dark:border-zinc-800"
            title="Ejecutar suite de 11 pruebas de la Fase 7"
          >
            <TestTube className="w-4 h-4 mr-1.5 text-teal-600 dark:text-teal-400" />
            <span className="hidden sm:inline">Suite Tests</span> (11)
          </Button>
        </div>
      </div>

      {/* PESTAÑA: SEMANA */}
      {activeTab === 'WEEK' && (
        <div className="space-y-6">
          <WeeklyCalendarView
            schedule={workoutPlan.weeklySchedule}
            onSelectWorkout={(w) => setSelectedWorkout(w)}
            onStartActiveWorkout={handleStartActive}
          />

          {/* Modal / Card de Vista Rápida si se selecciona una rutina */}
          {selectedWorkout && (
            <Card elevation="raised" className="p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-3">
                <div>
                  <Badge variant="teal">{selectedWorkout.goal}</Badge>
                  <h3 className="text-lg font-black text-zinc-900 dark:text-zinc-100 mt-1">
                    {selectedWorkout.title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {selectedWorkout.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedWorkout(null)}
                  >
                    Cerrar
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleStartActive(selectedWorkout)}
                  >
                    <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                    Iniciar entrenamiento
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                  <strong className="text-zinc-800 dark:text-zinc-200 block mb-1">
                    1. Calentamiento ({selectedWorkout.warmup.length} ejercicios):
                  </strong>
                  <ul className="space-y-0.5 text-zinc-500 dark:text-zinc-400">
                    {selectedWorkout.warmup.map((ex, i) => (
                      <li key={i} className="truncate">• {ex.exerciseSnapshot?.name || ex.exerciseId}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                  <strong className="text-zinc-800 dark:text-zinc-200 block mb-1">
                    2. Principal ({selectedWorkout.mainWorkout.length} ejercicios):
                  </strong>
                  <ul className="space-y-0.5 text-zinc-500 dark:text-zinc-400">
                    {selectedWorkout.mainWorkout.map((ex, i) => (
                      <li key={i} className="truncate">• {ex.exerciseSnapshot?.name || ex.exerciseId}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60">
                  <strong className="text-zinc-800 dark:text-zinc-200 block mb-1">
                    3. Vuelta a la Calma ({selectedWorkout.cooldown.length} ejercicios):
                  </strong>
                  <ul className="space-y-0.5 text-zinc-500 dark:text-zinc-400">
                    {selectedWorkout.cooldown.map((ex, i) => (
                      <li key={i} className="truncate">• {ex.exerciseSnapshot?.name || ex.exerciseId}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}

      {/* PESTAÑA: MES */}
      {activeTab === 'MONTH' && (
        <MonthlyCalendarView
          user={user}
          completedSessions={completedSessions}
          onStartActiveWorkout={handleStartActive}
        />
      )}

      {/* PESTAÑA: BIBLIOTECA */}
      {activeTab === 'LIBRARY' && (
        <ExerciseLibraryExplorer />
      )}

      {/* MODAL DE ENTRENAMIENTO ACTIVO */}
      {isLiveWorkoutOpen && activeWorkoutToRun && (
        <ActiveWorkoutModal
          isOpen={isLiveWorkoutOpen}
          onClose={handleCloseActive}
          workout={activeWorkoutToRun}
          user={user}
        />
      )}

      {/* MODAL DE TESTS FASE 7 */}
      <Phase7TestSuiteModal
        isOpen={isTestSuiteOpen}
        onClose={() => setIsTestSuiteOpen(false)}
      />
    </div>
  );
}
