/**
 * FitAdapt - Vista de Perfil y Configuración de Preferencias (PROFILE)
 * FASE 2 & FASE 3: Sistema Visual, Perfil Estructurado y Configuración
 */

import React, { useState } from 'react';
import {
  User,
  Sliders,
  ShieldAlert,
  AlertTriangle,
  Dumbbell,
  MapPin,
  Clock,
  Sparkles,
  RefreshCw,
  HeartPulse,
  Home,
  Building2,
  Calendar,
  Gauge,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  UserProfile,
  FitnessGoal,
  FitnessLevel,
  BiologicalSex,
  BodyMorphology,
  TrainingLocation,
  HomeEquipment,
  GymEquipment,
  AnyEquipment,
  PhysicalLimitation,
  LimitationSeverity,
  PhysicalLimitationCategory,
} from '../types/user';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { GoalCard } from '../components/cards/GoalCard';
import { EquipmentCard } from '../components/cards/EquipmentCard';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import {
  HOME_EQUIPMENT_OPTIONS,
  GYM_EQUIPMENT_OPTIONS,
  FITNESS_LEVELS_METADATA,
  BODY_MORPHOLOGY_METADATA,
} from '../constants/fitness';
import { MEDICAL_DISCLAIMER_TEXT } from '../constants/safety';
import { SAMPLE_PROFILES } from '../data/sampleProfiles';

export interface ProfileViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onOpenArchInspector: () => void;
  onOpenOnboarding?: () => void;
}

type ProfileTab = 'DETAILS' | 'GOALS' | 'LOCATION_EQUIPMENT' | 'AVAILABILITY' | 'LIMITATIONS' | 'SAFETY';

export function ProfileView({
  user,
  onUpdateUser,
  onOpenArchInspector,
  onOpenOnboarding,
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>('DETAILS');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Handlers para actualizar datos
  const handleGoalChange = (newGoal: FitnessGoal) => {
    onUpdateUser({ ...user, primaryGoal: newGoal, updatedAt: new Date().toISOString() });
  };

  const handleLevelChange = (newLevel: FitnessLevel) => {
    onUpdateUser({ ...user, fitnessLevel: newLevel, updatedAt: new Date().toISOString() });
  };

  const handleLocationChange = (newLocation: TrainingLocation) => {
    const defaultEquip =
      newLocation === TrainingLocation.HOME
        ? [HomeEquipment.NO_EQUIPMENT]
        : [GymEquipment.DUMBBELLS, GymEquipment.BENCH];
    onUpdateUser({
      ...user,
      trainingLocation: newLocation,
      availableEquipment: defaultEquip,
      updatedAt: new Date().toISOString(),
    });
  };

  const handleEquipmentToggle = (id: AnyEquipment) => {
    const exists = user.availableEquipment.includes(id);
    let updated: AnyEquipment[];
    if (exists) {
      updated = user.availableEquipment.filter((eq) => eq !== id);
      if (updated.length === 0) {
        updated = [user.trainingLocation === TrainingLocation.HOME ? HomeEquipment.NO_EQUIPMENT : GymEquipment.DUMBBELLS];
      }
    } else {
      updated = [...user.availableEquipment, id];
    }
    onUpdateUser({ ...user, availableEquipment: updated, updatedAt: new Date().toISOString() });
  };

  const handleDaysPerWeekChange = (days: number) => {
    onUpdateUser({
      ...user,
      daysPerWeek: days,
      preferences: { ...user.preferences, daysPerWeek: days },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDurationChange = (minutes: number) => {
    onUpdateUser({
      ...user,
      availableTimeMinutes: minutes,
      preferences: { ...user.preferences, preferredDurationMinutes: minutes },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleIntensityChange = (intensity: 'LOW' | 'MEDIUM' | 'HIGH') => {
    onUpdateUser({
      ...user,
      preferences: { ...user.preferences, targetIntensity: intensity },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleMorphologyChange = (morphology?: BodyMorphology) => {
    onUpdateUser({ ...user, morphology, updatedAt: new Date().toISOString() });
  };

  const handleRemoveLimitation = (limitationId: string) => {
    const updated = user.limitations.filter((l) => l.id !== limitationId);
    onUpdateUser({ ...user, limitations: updated, updatedAt: new Date().toISOString() });
  };

  const handleAddQuickLimitation = (code: string, name: string, category: PhysicalLimitationCategory, reqLowImpact = true) => {
    if (user.limitations.some((l) => l.code === code)) return;
    const newLim: PhysicalLimitation = {
      id: `lim-${Date.now()}`,
      code,
      name,
      category,
      severity: LimitationSeverity.MILD_DISCOMFORT,
      affectedBodyAreas: ['GENERAL'],
      incompatibleMovements: [],
      requiresLowImpact: reqLowImpact,
      notes: 'Añadida manualmente desde la configuración del perfil.',
    };
    onUpdateUser({ ...user, limitations: [...user.limitations, newLim], updatedAt: new Date().toISOString() });
  };

  const displayName = user?.name || 'Ana Gómez';
  const initialLetter = displayName.charAt(0);

  const isHome = user?.trainingLocation === TrainingLocation.HOME;
  const currentEquipmentOptions = isHome ? HOME_EQUIPMENT_OPTIONS : GYM_EQUIPMENT_OPTIONS;

  const hasSeverePain = user?.limitations?.some(
    (l) => l.severity === LimitationSeverity.ACUTE_REQUIRES_CLEARANCE
  );

  return (
    <div id="profile-view-container" className="space-y-6 animate-fadeIn">
      {/* Selector de perfil demo */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-zinc-100 dark:bg-zinc-850 rounded-xl text-xs">
        <span className="font-semibold text-zinc-600 dark:text-zinc-300">
          Perfiles de Prueba Rápidos:
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          {SAMPLE_PROFILES.map((p) => {
            const isSelected = p.id === user.id;
            return (
              <button
                key={p.id}
                onClick={() => onUpdateUser(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                }`}
              >
                {p.name?.split(' ')[0]} {p.limitations.length > 0 ? `(${p.limitations[0].code.includes('KNEE') ? 'Rodilla' : 'Lumbar'})` : '(Sin limitaciones)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cabecera del Perfil */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white font-black text-2xl flex items-center justify-center shadow-xs">
            {initialLetter}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-zinc-900 dark:text-zinc-100">
                {displayName}
              </h2>
              <Badge variant="teal">Perfil Activo</Badge>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              {user.age || 30} años · {user.trainingLocation === TrainingLocation.HOME ? 'Casa' : 'Gimnasio'} · {user.daysPerWeek} días/sem · {user.availableTimeMinutes} min/día
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenOnboarding && (
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenOnboarding}
              leftIcon={<Sparkles className="w-4 h-4" />}
            >
              Asistente Onboarding (10 Pasos)
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenArchInspector}
            leftIcon={<Sliders className="w-4 h-4 text-teal-600" />}
          >
            Consola Arquitectura
          </Button>
        </div>
      </div>

      {/* Tabs de navegación interna del perfil */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-850 rounded-xl overflow-x-auto">
        {[
          { id: 'DETAILS', label: 'Datos Físicos' },
          { id: 'GOALS', label: 'Objetivos y Nivel' },
          { id: 'LOCATION_EQUIPMENT', label: 'Lugar y Equipamiento' },
          { id: 'AVAILABILITY', label: 'Disponibilidad' },
          { id: 'LIMITATIONS', label: 'Limitaciones y Molestias' },
          { id: 'SAFETY', label: 'Salud y Ética' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ProfileTab)}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer min-h-[40px] ${
              activeTab === tab.id
                ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Datos Físicos */}
      {activeTab === 'DETAILS' && (
        <div className="space-y-4">
          <Card elevation="raised">
            <CardHeader
              title="Parámetros Físicos y Antropométricos"
              subtitle="Datos declarados para cálculo de volumen y palancas mecánicas (no diagnósticos)"
            />

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Edad</span>
                <span className="text-base font-black text-zinc-900 dark:text-zinc-100">{user.age || 30} años</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Altura</span>
                <span className="text-base font-black text-zinc-900 dark:text-zinc-100">{user.heightCm || 170} cm</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Peso</span>
                <span className="text-base font-black text-zinc-900 dark:text-zinc-100">{user.weightKg || 70} kg</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
                <span className="text-[10px] text-zinc-500 uppercase font-semibold block">Sexo de Referencia</span>
                <span className="text-base font-black text-zinc-900 dark:text-zinc-100">
                  {user.sex === BiologicalSex.FEMALE ? 'Femenino' : user.sex === BiologicalSex.MALE ? 'Masculino' : 'No especificado'}
                </span>
              </div>
            </div>

            {/* Morfología opcional */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider block">
                Morfología Corporal Opcional:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                <button
                  onClick={() => handleMorphologyChange(undefined)}
                  className={`p-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                    !user.morphology
                      ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 ring-1 ring-teal-600'
                      : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600'
                  }`}
                >
                  Omitir
                </button>
                {Object.values(BodyMorphology).map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMorphologyChange(m)}
                    className={`p-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                      user.morphology === m
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 ring-1 ring-teal-600'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600'
                    }`}
                  >
                    {BODY_MORPHOLOGY_METADATA[m]?.name || m}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 italic pt-1">
                * Referencia secundaria no diagnóstica. FitAdapt rechaza promesas de reducción localizada de grasa.
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* Tab 2: Objetivos y Nivel */}
      {activeTab === 'GOALS' && (
        <div className="space-y-4">
          <Card elevation="raised">
            <CardHeader
              title="Objetivo Principal"
              subtitle="Define las variables motrices primordiales de la periodización"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
              {Object.values(FitnessGoal).map((g) => (
                <GoalCard
                  key={g}
                  goal={g}
                  isSelected={user.primaryGoal === g}
                  onSelect={handleGoalChange}
                />
              ))}
            </div>
          </Card>

          <Card elevation="raised">
            <CardHeader
              title="Nivel de Experiencia"
              subtitle="Modula el volumen de trabajo y el tiempo de recuperación entre series"
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              {Object.values(FitnessLevel).map((lvl) => {
                const meta = FITNESS_LEVELS_METADATA[lvl];
                const isSelected = user.fitnessLevel === lvl;
                return (
                  <div
                    key={lvl}
                    onClick={() => handleLevelChange(lvl)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-600'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{meta.name}</span>
                      {isSelected && <Check className="w-4 h-4 text-teal-600" />}
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{meta.description}</p>
                    <span className="text-[10px] font-mono text-zinc-400 block mt-2">
                      Descanso sugerido: {meta.recommendedRestSeconds}s
                    </span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 3: Lugar y Equipamiento */}
      {activeTab === 'LOCATION_EQUIPMENT' && (
        <div className="space-y-4">
          <Card elevation="raised">
            <CardHeader
              title="Lugar de Entrenamiento"
              subtitle="Selecciona tu entorno habitual para ajustar el catálogo de equipamiento"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div
                onClick={() => handleLocationChange(TrainingLocation.HOME)}
                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between ${
                  isHome
                    ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-600'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-teal-600" />
                  <div>
                    <span className="font-bold text-sm block">Casa</span>
                    <span className="text-xs text-zinc-500">Peso corporal, mancuernas compactas, esterillas</span>
                  </div>
                </div>
                {isHome && <Check className="w-4 h-4 text-teal-600" />}
              </div>

              <div
                onClick={() => handleLocationChange(TrainingLocation.GYM)}
                className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between ${
                  !isHome
                    ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-600'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                  <div>
                    <span className="font-bold text-sm block">Gimnasio</span>
                    <span className="text-xs text-zinc-500">Barras, discos, máquinas guiadas y poleas</span>
                  </div>
                </div>
                {!isHome && <Check className="w-4 h-4 text-teal-600" />}
              </div>
            </div>
          </Card>

          <Card elevation="raised">
            <CardHeader
              title={`Equipamiento Disponible (${isHome ? 'Casa' : 'Gimnasio'})`}
              subtitle="Marca los elementos accesibles para filtrar automáticamente los ejercicios"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
              {currentEquipmentOptions.map((eq) => (
                <EquipmentCard
                  key={eq.id}
                  id={eq.id}
                  label={eq.label}
                  isSelected={user.availableEquipment.includes(eq.id)}
                  onToggle={handleEquipmentToggle}
                />
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab 4: Disponibilidad */}
      {activeTab === 'AVAILABILITY' && (
        <Card elevation="raised">
          <CardHeader
            title="Disponibilidad y Preferencias de Sesión"
            subtitle="Regula el volumen semanal sin generar fatiga excesiva ni sobreentrenamiento"
          />

          <div className="space-y-6 pt-2">
            {/* Días por semana */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Días por semana
                </span>
                <span className="text-xs font-bold text-teal-600 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
                  {user.daysPerWeek} días seleccionados
                </span>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleDaysPerWeekChange(num)}
                    className={`py-2.5 rounded-xl border text-center font-bold text-sm transition-all ${
                      user.daysPerWeek === num
                        ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Duración por sesión */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                Duración aproximada por sesión
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[15, 20, 30, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    onClick={() => handleDurationChange(mins)}
                    className={`py-2.5 px-3 rounded-xl border text-center font-bold text-xs transition-all ${
                      user.availableTimeMinutes === mins
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 ring-1 ring-teal-600'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Intensidad preferida */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                <Gauge className="w-4 h-4 text-teal-600" />
                Intensidad preferida
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'LOW', label: 'Suave / Bajo Impacto' },
                  { id: 'MEDIUM', label: 'Equilibrada' },
                  { id: 'HIGH', label: 'Exigente' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleIntensityChange(item.id as any)}
                    className={`py-2 px-3 rounded-xl border text-center text-xs font-semibold transition-all ${
                      user.preferences?.targetIntensity === item.id
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 ring-1 ring-teal-600'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Tab 5: Limitaciones y Molestias */}
      {activeTab === 'LIMITATIONS' && (
        <div className="space-y-4">
          <Card elevation="raised">
            <CardHeader
              title="Limitaciones Físicas y Zonas Sensibles"
              subtitle="Criterios prioritarios aplicados por el motor de compatibilidad biomecánica"
            />

            {user.limitations.length === 0 ? (
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
                <span>Sin limitaciones declaradas. Tus articulaciones se encuentran libres de dolor.</span>
                <Badge variant="teal">Articulaciones Sanas</Badge>
              </div>
            ) : (
              <div className="space-y-2.5">
                {user.limitations.map((lim) => (
                  <div
                    key={lim.id}
                    className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/40 dark:bg-amber-950/20 flex items-start justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                            {lim.name}
                          </span>
                          <Badge variant={lim.severity === 'ACUTE_REQUIRES_CLEARANCE' ? 'danger' : 'warning'} size="sm">
                            {lim.severity === 'ACUTE_REQUIRES_CLEARANCE' ? 'Fuerte' : lim.severity === 'MODERATE_LIMITATION' ? 'Moderada' : 'Leve'}
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                          {lim.notes || 'Limitación biomecánica activa.'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveLimitation(lim.id)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-600 transition-colors"
                      title="Eliminar limitación"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Accesos rápidos para agregar molestias frecuentes */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider block">
                Agregar zona sensible rápidamente:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { code: 'KNEE_SENSITIVITY', name: 'Rodilla sensible / Condromalacia', cat: PhysicalLimitationCategory.JOINT },
                  { code: 'LUMBAR_DISCOMFORT', name: 'Sobrecarga Lumbar', cat: PhysicalLimitationCategory.SPINE_BACK },
                  { code: 'SHOULDER_IMPINGEMENT', name: 'Molestias en Hombro', cat: PhysicalLimitationCategory.JOINT },
                  { code: 'WRIST_DISCOMFORT', name: 'Molestias en Muñecas', cat: PhysicalLimitationCategory.JOINT },
                  { code: 'ANKLE_DISCOMFORT', name: 'Tobillo sensible', cat: PhysicalLimitationCategory.JOINT },
                ].map((item) => (
                  <button
                    key={item.code}
                    onClick={() => handleAddQuickLimitation(item.code, item.name, item.cat)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3 h-3 text-teal-600" />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {hasSeverePain && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Aviso de seguridad médica:</strong> Has indicado dolor fuerte en una o más articulaciones. Te aconsejamos consultar con un médico antes de continuar y detenerte de inmediato ante dolor agudo.
                </span>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Tab 6: Salud y Ética */}
      {activeTab === 'SAFETY' && (
        <div className="space-y-4">
          <Card elevation="raised" className="border-l-4 border-l-teal-600">
            <CardHeader
              title="Principios Éticos de FitAdapt"
              subtitle="Compromisos estrictos de seguridad médica y honestidad científica"
            />
            <div className="space-y-2 text-xs text-zinc-600 dark:text-zinc-300">
              <p>
                <strong>1. Sin reducción localizada de grasa:</strong> Ningún ejercicio quema grasa de forma localizada; el déficit calórico y el entrenamiento estructurado son los mecanismos fisiológicos reales.
              </p>
              <p>
                <strong>2. Prioridad de la articulación:</strong> Ante la menor duda o código de incompatibilidad, el ejercicio se sustituye por su versión de bajo impacto o se desaconseja.
              </p>
              <p>
                <strong>3. Suspensión inmediata ante dolor:</strong> Si sientes dolor agudo o punzante, suspende el ejercicio de inmediato y consulta con un profesional de la salud.
              </p>
            </div>
          </Card>

          <div className="p-4 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-xs text-zinc-500 leading-relaxed">
            {MEDICAL_DISCLAIMER_TEXT.full}
          </div>
        </div>
      )}
    </div>
  );
}
