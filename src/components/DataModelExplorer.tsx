/**
 * FitAdapt - Explorador de Entidades y Modelos de Datos Conceptuales
 * FASE 1: Arquitectura y Modelos Base
 */

import { useState } from 'react';
import { Database, FileCode, CheckSquare, Layers, UserCheck } from 'lucide-react';
import {
  FITNESS_GOALS_METADATA,
  FITNESS_LEVELS_METADATA,
  BODY_MORPHOLOGY_METADATA,
  HOME_EQUIPMENT_OPTIONS,
  GYM_EQUIPMENT_OPTIONS,
  STANDARD_PHYSICAL_LIMITATIONS,
} from '../constants/fitness';
import { FitnessGoal, FitnessLevel, BodyMorphology } from '../types/user';

export function DataModelExplorer() {
  const [activeTab, setActiveTab] = useState<'entities' | 'enums' | 'limitations'>('entities');

  const entities = [
    {
      name: 'UserProfile',
      path: '/src/types/user.ts',
      description: 'Datos antropométricos declarados, nivel, objetivos primarios/secundarios, equipamiento disponible, limitaciones físicas y auditoría médica.',
      keyFields: ['id', 'fitnessLevel', 'primaryGoal', 'trainingLocation', 'availableEquipment', 'limitations', 'medicalSafety'],
    },
    {
      name: 'Exercise',
      path: '/src/types/exercise.ts',
      description: 'Ficha biomecánica maestra que almacena las 24 propiedades de ejecución, impacto, contraindicaciones e incompatibilidades físicas.',
      keyFields: ['id', 'movementType', 'primaryMuscle', 'impact', 'intensity', 'incompatibleLimitationCodes', 'lowImpactVersion', 'noEquipmentVersion'],
    },
    {
      name: 'Workout & WorkoutExercise',
      path: '/src/types/workout.ts',
      description: 'Estructuración de sesiones en bloques (calentamiento, bloque principal, enfriamiento) con snapshot inmutable del ejercicio.',
      keyFields: ['id', 'goal', 'estimatedDurationMinutes', 'exercises', 'wasAdapted', 'adaptationReason'],
    },
    {
      name: 'WorkoutPlan & WorkoutSession',
      path: '/src/types/workout.ts',
      description: 'Periodización multianual/semanal y seguimiento en vivo de series realizadas, RPE (esfuerzo percibido) y reporte de molestias.',
      keyFields: ['status', 'weeklySchedule', 'completedSets', 'overallSessionRPE', 'reportedDiscomforts'],
    },
    {
      name: 'ProgressRecord',
      path: '/src/types/progress.ts',
      description: 'Registro histórico de adherencia, volumen y alertas en caso de registrar molestias físicas repetitivas.',
      keyFields: ['recordedAt', 'metricType', 'numericValue', 'isDiscomfortAlert'],
    },
    {
      name: 'AIInteraction',
      path: '/src/types/ai.ts',
      description: 'Auditoría y restricciones para la capa asistiva: jamás inventa ejercicios y nunca ignora restricciones médicas declaradas.',
      keyFields: ['interactionType', 'safetyClassification', 'enforcedConstraints', 'passedSafetyAudit'],
    },
  ];

  return (
    <div id="data-model-explorer" className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-md bg-blue-100 text-blue-800">
              <Database className="w-4 h-4" />
            </span>
            <h2 className="text-lg font-bold text-zinc-900">
              Modelos de Datos y Entidades Base (FASE 1)
            </h2>
          </div>
          <p className="text-xs text-zinc-600 mt-1">
            Estructuras tipadas en TypeScript puro que garantizan coherencia para las Fases 2 a 10.
          </p>
        </div>

        {/* Selector de Pestañas */}
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-lg text-xs font-semibold">
          <button
            onClick={() => setActiveTab('entities')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'entities' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Entidades (14)
          </button>
          <button
            onClick={() => setActiveTab('enums')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'enums' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Objetivos & Entorno
          </button>
          <button
            onClick={() => setActiveTab('limitations')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              activeTab === 'limitations' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Limitaciones Físicas
          </button>
        </div>
      </div>

      {/* Contenido según pestaña activa */}
      <div className="pt-4">
        {activeTab === 'entities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {entities.map((ent) => (
              <div key={ent.name} className="p-3.5 rounded-lg border border-zinc-200 bg-zinc-50/50 hover:bg-zinc-50 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                      <FileCode className="w-3.5 h-3.5 text-blue-600" />
                      {ent.name}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">{ent.path.replace('/src/', '')}</span>
                  </div>
                  <p className="text-xs text-zinc-600 leading-relaxed mb-3">
                    {ent.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-zinc-200/80">
                  <span className="text-[10px] text-zinc-500 font-medium block mb-1">Campos representativos:</span>
                  <div className="flex flex-wrap gap-1">
                    {ent.keyFields.map((f) => (
                      <span key={f} className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700 font-mono">
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'enums' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide mb-2">
                Objetivos Principales Definidos (FitnessGoal)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 text-xs">
                {Object.keys(FITNESS_GOALS_METADATA).map((goalKey) => {
                  const g = FITNESS_GOALS_METADATA[goalKey as FitnessGoal];
                  return (
                    <div key={goalKey} className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                      <span className="font-bold text-zinc-900 block">{g.name}</span>
                      <span className="text-[10px] text-zinc-500 font-mono block mt-0.5">{goalKey}</span>
                      <p className="text-zinc-600 text-[11px] mt-1.5 leading-snug">{g.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide mb-2">
                Morfologías Corporales Autodeclaradas (No Diagnósticas)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
                {Object.keys(BODY_MORPHOLOGY_METADATA).map((morphKey) => {
                  const m = BODY_MORPHOLOGY_METADATA[morphKey as BodyMorphology];
                  return (
                    <div key={morphKey} className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                      <span className="font-bold text-zinc-900 block">{m.name}</span>
                      <p className="text-zinc-600 text-[11px] mt-1 leading-snug">{m.ergonomicFocus}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-zinc-200">
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide mb-2">
                Equipamiento Home vs Gym Catalogado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50">
                  <span className="font-bold text-zinc-900 block mb-1">Entorno HOME ({HOME_EQUIPMENT_OPTIONS.length} opciones)</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {HOME_EQUIPMENT_OPTIONS.map((e) => (
                      <span key={e.id} className="px-2 py-1 rounded bg-white border border-zinc-200 text-zinc-700 text-[11px]">
                        {e.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200 bg-zinc-50">
                  <span className="font-bold text-zinc-900 block mb-1">Entorno GYM ({GYM_EQUIPMENT_OPTIONS.length} opciones)</span>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {GYM_EQUIPMENT_OPTIONS.map((e) => (
                      <span key={e.id} className="px-2 py-1 rounded bg-white border border-zinc-200 text-zinc-700 text-[11px]">
                        {e.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'limitations' && (
          <div>
            <div className="text-xs text-zinc-600 mb-3">
              Catálogo de limitaciones biomecánicas que activan la regla de máxima prioridad en el motor:
            </div>
            <div className="space-y-2">
              {STANDARD_PHYSICAL_LIMITATIONS.map((lim) => (
                <div key={lim.id} className="p-3 rounded-lg border border-zinc-200 bg-zinc-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-zinc-900">{lim.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 font-mono">
                        {lim.code}
                      </span>
                    </div>
                    <p className="text-zinc-600 mt-1">{lim.notes}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 text-[11px]">
                    <span className="px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700 font-medium">
                      Zona: {lim.affectedBodyAreas.join(', ')}
                    </span>
                    {lim.requiresLowImpact && (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                        Requiere Bajo Impacto
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
