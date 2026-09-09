/**
 * FitAdapt - Vista de Progreso Personal (PROGRESS)
 * FASE 8: Sistema de Progreso Personal, Métricas y Logros
 * 
 * Cumple estrictamente con las directivas:
 * - "Mi progreso" dashboard: completados, minutos, racha actual, mejor racha, sesiones semana/mes, % cumplimiento
 * - Registro de peso y evolución mediante gráfico con neutralidad analítica
 * - Medidas corporales opcionales (cintura, cadera, brazo, muslo, pecho) con activación/desactivación
 * - Objetivo actual y progreso sin promesas de resultados
 * - Desglose de entrenamientos (total, semana, mes, objetivo, tipo)
 * - Racha con definición transparente de cumplimiento
 * - Mini-calendario de días completados, descansos, pendientes y omitidos
 * - Gráficos sencillos, responsive y accesibles (0, 1 y múltiples datos)
 * - Sistema de logros saludables
 * - Privacidad (exportar JSON/CSV, editar y borrar)
 * - Suite de 11 tests interactiva
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  TrendingUp,
  Flame,
  Clock,
  Award,
  Heart,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Scale,
  Ruler,
  Sliders,
  Download,
  Plus,
  ShieldCheck,
  Target,
  Sparkles,
  TestTube,
  Info,
} from 'lucide-react';
import { UserProfile, FitnessGoal } from '../types/user';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';

import {
  WeightRecord,
  BodyMeasurementRecord,
  MeasurementPreferences,
  ProgressDashboardData,
  Achievement,
} from '../types/progress';
import { ProgressManager } from '../core/progress/progressManager';

// Componentes de Gráficos y Tablas
import { WeightProgressChart } from '../components/progress/charts/WeightProgressChart';
import { WorkoutActivityChart } from '../components/progress/charts/WorkoutActivityChart';
import { CategoryBreakdownChart } from '../components/progress/charts/CategoryBreakdownChart';

// Modales de Acción
import { AddEditWeightModal } from '../components/progress/AddEditWeightModal';
import { AddEditMeasurementModal } from '../components/progress/AddEditMeasurementModal';
import { MeasurementSettingsModal } from '../components/progress/MeasurementSettingsModal';
import { PrivacyDataModal } from '../components/progress/PrivacyDataModal';
import { Phase8TestSuiteModal } from '../components/progress/Phase8TestSuiteModal';

export interface ProgressViewProps {
  user?: UserProfile;
}

export function ProgressView({ user }: ProgressViewProps) {
  // Parámetros derivados del usuario
  const daysPerWeek = user?.daysPerWeek || 3;
  const primaryGoal = user?.primaryGoal || FitnessGoal.TONING;
  const targetDuration = user?.availableTimeMinutes || 30;

  // Estados de datos de progreso
  const [dashboardData, setDashboardData] = useState<ProgressDashboardData>(() =>
    ProgressManager.getDashboardSummary(daysPerWeek, primaryGoal)
  );

  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>(() =>
    ProgressManager.getWeightRecords()
  );

  const [measurementRecords, setMeasurementRecords] = useState<BodyMeasurementRecord[]>(() =>
    ProgressManager.getMeasurementRecords()
  );

  const [measurementPrefs, setMeasurementPrefs] = useState<MeasurementPreferences>(() =>
    ProgressManager.getMeasurementPreferences()
  );

  // Modales
  const [isAddWeightOpen, setIsAddWeightOpen] = useState(false);
  const [weightToEdit, setWeightToEdit] = useState<WeightRecord | null>(null);

  const [isAddMeasurementOpen, setIsAddMeasurementOpen] = useState(false);
  const [measurementToEdit, setMeasurementToEdit] = useState<BodyMeasurementRecord | null>(null);

  const [isMeasurementSettingsOpen, setIsMeasurementSettingsOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);

  // Pestaña activa para la sección de gráficos
  const [activeChartTab, setActiveChartTab] = useState<'WEIGHT' | 'ACTIVITY' | 'BREAKDOWN'>(
    'WEIGHT'
  );

  // Recargar datos centralizados
  const refreshData = () => {
    setDashboardData(ProgressManager.getDashboardSummary(daysPerWeek, primaryGoal));
    setWeightRecords(ProgressManager.getWeightRecords());
    setMeasurementRecords(ProgressManager.getMeasurementRecords());
    setMeasurementPrefs(ProgressManager.getMeasurementPreferences());
  };

  // Logros calculados
  const achievements = useMemo(
    () => ProgressManager.getAchievements(dashboardData),
    [dashboardData]
  );

  // Handlers para Peso
  const handleSaveWeight = (weightKg: number, date: string, note?: string) => {
    if (weightToEdit) {
      ProgressManager.updateWeightRecord(weightToEdit.id, weightKg, date, note);
    } else {
      ProgressManager.addWeightRecord(weightKg, date, note);
    }
    setWeightToEdit(null);
    refreshData();
  };

  const handleDeleteWeight = (id: string) => {
    ProgressManager.deleteWeightRecord(id);
    setWeightToEdit(null);
    refreshData();
  };

  // Handlers para Medidas
  const handleSaveMeasurement = (record: Omit<BodyMeasurementRecord, 'id' | 'createdAt'>) => {
    if (measurementToEdit) {
      ProgressManager.updateMeasurementRecord(measurementToEdit.id, record);
    } else {
      ProgressManager.addMeasurementRecord(record);
    }
    setMeasurementToEdit(null);
    refreshData();
  };

  const handleDeleteMeasurement = (id: string) => {
    ProgressManager.deleteMeasurementRecord(id);
    setMeasurementToEdit(null);
    refreshData();
  };

  const handleSaveMeasurementPrefs = (prefs: MeasurementPreferences) => {
    ProgressManager.saveMeasurementPreferences(prefs);
    setMeasurementPrefs(prefs);
  };

  return (
    <div id="progress-view-container" className="space-y-6 animate-fadeIn">
      {/* ========================================================================= */}
      {/* CABECERA PRINCIPAL: "MI PROGRESO" */}
      {/* ========================================================================= */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
              FASE 8: Panel Personal
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Evolución a lo largo del tiempo
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            Mi Progreso
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
            Monitorea tu constancia, volumen de entrenamiento y evolución física con métricas transparentes y libres de presiones.
          </p>
        </div>

        {/* Acciones principales de la cabecera */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTestSuiteOpen(true)}
            className="text-xs font-bold text-teal-700 dark:text-teal-300 border-teal-300 dark:border-teal-700 hover:bg-teal-50 dark:hover:bg-teal-950/40"
          >
            <TestTube className="w-3.5 h-3.5 mr-1.5" />
            Suite Tests (11)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsPrivacyModalOpen(true)}
            className="text-xs text-zinc-600 dark:text-zinc-400"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Exportar / Privacidad
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setWeightToEdit(null);
              setIsAddWeightOpen(true);
            }}
            className="text-xs font-bold"
          >
            <Scale className="w-3.5 h-3.5 mr-1.5" />
            Registrar peso
          </Button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* GRID DE KPIs CLAVE DEL DASHBOARD */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Entrenamientos completados */}
        <Card elevation="raised" padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Completados
            </span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {dashboardData.totalWorkoutsCompleted}
          </p>
          <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium block">
            Sesiones totales
          </span>
        </Card>

        {/* Minutos entrenados */}
        <Card elevation="raised" padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-teal-600">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Minutos
            </span>
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {dashboardData.totalMinutesTrained}m
          </p>
          <span className="text-[10px] text-zinc-500 font-medium block">
            Tiempo activo total
          </span>
        </Card>

        {/* Racha actual */}
        <Card elevation="raised" padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-amber-500">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Racha actual
            </span>
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {dashboardData.currentStreak} días
          </p>
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium block">
            Constancia activa
          </span>
        </Card>

        {/* Mejor racha */}
        <Card elevation="raised" padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Mejor racha
            </span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {dashboardData.longestStreak} días
          </p>
          <span className="text-[10px] text-zinc-500 font-medium block">
            Récord personal
          </span>
        </Card>

        {/* Sesiones esta semana / este mes */}
        <Card elevation="raised" padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-sky-600">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Esta semana
            </span>
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {dashboardData.sessionsThisWeek} / {daysPerWeek}
          </p>
          <span className="text-[10px] text-zinc-500 font-medium block">
            {dashboardData.sessionsThisMonth} este mes
          </span>
        </Card>

        {/* Cumplimiento */}
        <Card elevation="raised" padding="sm" className="space-y-1">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
              Cumplimiento
            </span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
            {dashboardData.compliancePercentage}%
          </p>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
            De la meta semanal
          </span>
        </Card>
      </div>

      {/* ========================================================================= */}
      {/* SECCIÓN DE OBJETIVO ACTUAL & PROGRESO (SIN GARANTÍAS DE RESULTADOS) */}
      {/* ========================================================================= */}
      <Card elevation="raised" className="p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                  Objetivo Definido
                </span>
                <Badge variant="teal">{primaryGoal}</Badge>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                Progreso hacia tu meta de {primaryGoal.toLowerCase()}
              </h3>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
              Adherencia Semanal: {dashboardData.compliancePercentage}%
            </span>
            <span className="text-[11px] text-zinc-400 block">
              {dashboardData.sessionsThisWeek} de {daysPerWeek} sesiones completadas esta semana
            </span>
          </div>
        </div>

        <ProgressBar
          value={dashboardData.compliancePercentage}
          color="teal"
          size="md"
          showValueText={false}
        />

        {/* Disclaimer ético: No prometer resultados fijos ni diagnósticos */}
        <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-[11px] text-zinc-500 dark:text-zinc-400 flex items-start gap-2.5">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Compromiso Ético FitAdapt:</strong> El progreso corporal es multifactorial y personal. No garantizamos pérdidas de peso fijas ni plazos predeterminados. Promovemos el autocuidado, la salud articular y la constancia sostenible.
          </p>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* SECCIÓN DE GRÁFICOS SENCILLOS Y RESPONSIVE */}
      {/* ========================================================================= */}
      <Card elevation="raised">
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Evolución Gráfica
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Visualización temporal simple, accesible y responsive.
            </p>
          </div>

          {/* Pestañas de selector de gráfico */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 dark:bg-zinc-800/80">
            <button
              onClick={() => setActiveChartTab('WEIGHT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChartTab === 'WEIGHT'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Peso Corporal
            </button>
            <button
              onClick={() => setActiveChartTab('ACTIVITY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChartTab === 'ACTIVITY'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Volumen & Minutos
            </button>
            <button
              onClick={() => setActiveChartTab('BREAKDOWN')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeChartTab === 'BREAKDOWN'
                  ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
              }`}
            >
              Desglose de Rutinas
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {activeChartTab === 'WEIGHT' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  Historial de Peso ({weightRecords.length} registros)
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setWeightToEdit(null);
                    setIsAddWeightOpen(true);
                  }}
                  className="text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Añadir peso
                </Button>
              </div>

              <WeightProgressChart
                records={weightRecords}
                onAddRecord={() => {
                  setWeightToEdit(null);
                  setIsAddWeightOpen(true);
                }}
                onEditRecord={(rec) => {
                  setWeightToEdit(rec);
                  setIsAddWeightOpen(true);
                }}
              />
            </div>
          )}

          {activeChartTab === 'ACTIVITY' && (
            <WorkoutActivityChart
              weeksData={dashboardData.workoutsByWeek}
              totalMinutes={dashboardData.totalMinutesTrained}
              totalWorkouts={dashboardData.totalWorkoutsCompleted}
            />
          )}

          {activeChartTab === 'BREAKDOWN' && (
            <CategoryBreakdownChart
              workoutsByGoal={dashboardData.workoutsByGoal}
              workoutsByType={dashboardData.workoutsByType}
              totalCompleted={dashboardData.totalWorkoutsCompleted}
            />
          )}
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* SECCIÓN DE MEDIDAS CORPORALES OPCIONALES */}
      {/* ========================================================================= */}
      <Card elevation="raised">
        <div className="p-4 sm:p-5 border-b border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                Medidas Corporales (Opcional)
              </h3>
              <Badge variant="neutral">Personalizable</Badge>
            </div>
            <p className="text-xs text-zinc-500 mt-0.5">
              Activa o desactiva las zonas que deseas seguir (cintura, cadera, brazo, muslo, pecho).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMeasurementSettingsOpen(true)}
              className="text-xs"
            >
              <Sliders className="w-3.5 h-3.5 mr-1.5" />
              Configurar métricas
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                setMeasurementToEdit(null);
                setIsAddMeasurementOpen(true);
              }}
              className="text-xs font-bold"
            >
              <Ruler className="w-3.5 h-3.5 mr-1.5" />
              Nueva medición
            </Button>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {measurementRecords.length === 0 ? (
            <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 text-center space-y-2">
              <Ruler className="w-8 h-8 text-zinc-400 mx-auto" />
              <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                Sin registros de medidas aún
              </h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Llevar medidas perimetrales es totalmente voluntario y ayuda a observar cambios corporales independientemente de la báscula.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMeasurementToEdit(null);
                  setIsAddMeasurementOpen(true);
                }}
                className="mt-2"
              >
                Registrar primeras medidas
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 uppercase font-mono text-[10px]">
                    <th className="py-2.5 px-3">Fecha</th>
                    {measurementPrefs.enabledMetrics.waist && <th className="py-2.5 px-3">Cintura</th>}
                    {measurementPrefs.enabledMetrics.hip && <th className="py-2.5 px-3">Cadera</th>}
                    {measurementPrefs.enabledMetrics.arm && <th className="py-2.5 px-3">Brazo</th>}
                    {measurementPrefs.enabledMetrics.thigh && <th className="py-2.5 px-3">Muslo</th>}
                    {measurementPrefs.enabledMetrics.chest && <th className="py-2.5 px-3">Pecho</th>}
                    <th className="py-2.5 px-3">Nota</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {measurementRecords.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30">
                      <td className="py-3 px-3 font-mono font-bold text-zinc-900 dark:text-zinc-100">
                        {m.date}
                      </td>
                      {measurementPrefs.enabledMetrics.waist && (
                        <td className="py-3 px-3">
                          {m.waistCm ? `${m.waistCm} cm` : '—'}
                        </td>
                      )}
                      {measurementPrefs.enabledMetrics.hip && (
                        <td className="py-3 px-3">
                          {m.hipCm ? `${m.hipCm} cm` : '—'}
                        </td>
                      )}
                      {measurementPrefs.enabledMetrics.arm && (
                        <td className="py-3 px-3">
                          {m.armCm ? `${m.armCm} cm` : '—'}
                        </td>
                      )}
                      {measurementPrefs.enabledMetrics.thigh && (
                        <td className="py-3 px-3">
                          {m.thighCm ? `${m.thighCm} cm` : '—'}
                        </td>
                      )}
                      {measurementPrefs.enabledMetrics.chest && (
                        <td className="py-3 px-3">
                          {m.chestCm ? `${m.chestCm} cm` : '—'}
                        </td>
                      )}
                      <td className="py-3 px-3 text-zinc-500 italic max-w-[120px] truncate">
                        {m.note || '—'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setMeasurementToEdit(m);
                            setIsAddMeasurementOpen(true);
                          }}
                          className="text-teal-600 hover:text-teal-700 dark:text-teal-400 font-bold cursor-pointer"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* MINI-CALENDARIO DE ESTADOS: COMPLETADOS, DESCANSOS, PENDIENTES, OMITIDOS */}
      {/* ========================================================================= */}
      <Card elevation="raised">
        <CardHeader
          title="Semana en Curso y Registro de Estados"
          subtitle="Seguimiento de sesiones activas, días de descanso y continuidad"
          action={<Badge variant="teal">Semana actual</Badge>}
        />

        <div className="pt-3 space-y-4">
          <div className="grid grid-cols-7 gap-2">
            {dashboardData.recentDayStatuses.map((day) => {
              const isCompleted = day.status === 'COMPLETED';
              const isRest = day.status === 'REST';
              const isPending = day.status === 'PENDING';
              const isMissed = day.status === 'MISSED';

              return (
                <div
                  key={day.date}
                  className={`p-2.5 sm:p-3 rounded-xl border text-center transition-all flex flex-col items-center justify-between min-h-[90px] ${
                    isCompleted
                      ? 'bg-teal-50 dark:bg-teal-950/40 border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200'
                      : isRest
                      ? 'bg-zinc-50 dark:bg-zinc-800/40 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400'
                      : isMissed
                      ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                      : 'bg-white dark:bg-zinc-900 border-dashed border-teal-400/80 text-teal-700 dark:text-teal-300'
                  }`}
                >
                  <span className="text-[11px] font-bold block">{day.dayLabel}</span>
                  <span className="text-[10px] font-mono text-zinc-400">{day.date.substring(8)}</span>

                  <div className="my-1">
                    {isCompleted && <CheckCircle2 className="w-4 h-4 text-teal-600 fill-current" />}
                    {isRest && <Heart className="w-4 h-4 text-zinc-400" />}
                    {isPending && <Clock className="w-4 h-4 text-teal-500" />}
                    {isMissed && <AlertTriangle className="w-4 h-4 text-rose-500" />}
                  </div>

                  <span className="text-[9px] uppercase font-bold tracking-wider">
                    {isCompleted
                      ? `${day.minutes || 25}m`
                      : isRest
                      ? 'Descanso'
                      : isMissed
                      ? 'Omitido'
                      : 'Pendiente'}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-zinc-100 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600 inline-block" />
                Completado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 inline-block" />
                Descanso
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Pendiente
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                Omitido
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 italic">
              * Racha actual: {dashboardData.currentStreak} días consecutivos de constancia
            </p>
          </div>
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* SISTEMA DE LOGROS SALUDABLES (ACHIEVEMENTS) */}
      {/* ========================================================================= */}
      <Card elevation="raised">
        <CardHeader
          title="Hitos de Constancia y Salud"
          subtitle="Reconocimientos a hábitos sostenibles sin incentivar conductas extremas"
          action={<Badge variant="teal">{achievements.filter((a) => a.unlocked).length} / {achievements.length} Desbloqueados</Badge>}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-3">
          {achievements.map((ach) => {
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  ach.unlocked
                    ? 'border-teal-300 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/20'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/40 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        ach.unlocked
                          ? 'bg-teal-500 text-white shadow-xs'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                        {ach.title}
                      </h4>
                      <span className="text-[10px] text-zinc-400 font-mono">
                        {ach.unlocked ? `✓ ${ach.unlockedAt || 'Alcanzado'}` : 'En progreso'}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ach.unlocked
                        ? 'bg-teal-100 text-teal-800 dark:bg-teal-900/60 dark:text-teal-200'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                    }`}
                  >
                    {ach.progress}%
                  </span>
                </div>

                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {ach.description}
                </p>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                    <span>Avance</span>
                    <span>
                      {ach.currentValue} / {ach.targetValue} {ach.unit}
                    </span>
                  </div>
                  <ProgressBar
                    value={ach.progress}
                    color={ach.unlocked ? 'teal' : 'amber'}
                    size="sm"
                    showValueText={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* ========================================================================= */}
      {/* MODALES DE ACCIÓN */}
      {/* ========================================================================= */}
      <AddEditWeightModal
        isOpen={isAddWeightOpen}
        onClose={() => {
          setIsAddWeightOpen(false);
          setWeightToEdit(null);
        }}
        recordToEdit={weightToEdit}
        onSave={handleSaveWeight}
        onDelete={handleDeleteWeight}
      />

      <AddEditMeasurementModal
        isOpen={isAddMeasurementOpen}
        onClose={() => {
          setIsAddMeasurementOpen(false);
          setMeasurementToEdit(null);
        }}
        recordToEdit={measurementToEdit}
        preferences={measurementPrefs}
        onSave={handleSaveMeasurement}
        onDelete={handleDeleteMeasurement}
      />

      <MeasurementSettingsModal
        isOpen={isMeasurementSettingsOpen}
        onClose={() => setIsMeasurementSettingsOpen(false)}
        preferences={measurementPrefs}
        onSavePreferences={handleSaveMeasurementPrefs}
      />

      <PrivacyDataModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        onDataCleared={refreshData}
      />

      <Phase8TestSuiteModal
        isOpen={isTestSuiteOpen}
        onClose={() => setIsTestSuiteOpen(false)}
      />
    </div>
  );
}
