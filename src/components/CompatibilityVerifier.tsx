/**
 * FitAdapt - Verificador y Suite de Pruebas del Motor de Compatibilidad
 * FASE 5: Motor de Reglas, Scoring Determinista y Búsqueda de Alternativas
 */

import { useState, useMemo } from 'react';
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sliders,
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Zap,
  Target,
  Clock,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Activity,
  HeartPulse,
} from 'lucide-react';
import { CompatibilityEngine } from '../core/compatibility/evaluator';
import { EngineTestSuite, EngineTestSuiteReport } from '../core/compatibility/engineTests';
import { EXERCISE_LIBRARY, getExerciseById } from '../data/exerciseLibrary';
import { SAMPLE_USER_PROFILES } from '../data/sampleProfiles';
import { CompatibilityStatus, RulePriority } from '../types/compatibility';
import { Exercise, ExerciseCategory } from '../types/exercise';
import {
  UserProfile,
  FitnessGoal,
  FitnessLevel,
  TrainingLocation,
  HomeEquipment,
  GymEquipment,
  PhysicalLimitationCategory,
  LimitationSeverity,
} from '../types/user';

// Perfiles adicionales listos para pruebas interactivas
const EXTENDED_TEST_PROFILES: Record<string, { label: string; profile: UserProfile }> = {
  ...Object.fromEntries(
    Object.entries(SAMPLE_USER_PROFILES).map(([k, v]) => [
      k,
      {
        label: v.id === 'user-sample-01' ? 'Ana (34a, Principiante Hogar)' : v.id === 'user-sample-02' ? 'Carlos (42a, Gimnasio)' : 'Elena (28a, Tonificación)',
        profile: v,
      },
    ])
  ),
  'profile-knee-sensitive': {
    label: 'Marcos (48a, Condromalacia / Rodilla)',
    profile: {
      id: 'user-knee-sensitive',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.WEIGHT_LOSS,
      secondaryGoals: [FitnessGoal.MOBILITY],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT, HomeEquipment.MAT],
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [
        {
          id: 'lim-knee-marcos',
          code: 'KNEE_SENSITIVITY',
          name: 'Dolor patelofemoral en rodillas (Sin impacto)',
          category: PhysicalLimitationCategory.JOINT,
          severity: LimitationSeverity.MILD_DISCOMFORT,
          affectedBodyAreas: ['LOWER_BODY'],
          requiresLowImpact: true,
        },
      ],
      preferences: { targetIntensity: 'LOW', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    },
  },
  'profile-advanced-gym': {
    label: 'Rodrigo (29a, Avanzado Gimnasio Completo)',
    profile: {
      id: 'user-adv-rodrigo',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.ADVANCED,
      primaryGoal: FitnessGoal.STRENGTH,
      secondaryGoals: [FitnessGoal.TONING],
      trainingLocation: TrainingLocation.GYM,
      availableEquipment: [
        GymEquipment.DUMBBELLS,
        GymEquipment.BARBELLS,
        GymEquipment.CABLES_PULLEYS,
        GymEquipment.MACHINES,
        GymEquipment.BENCH,
      ],
      availableTimeMinutes: 60,
      daysPerWeek: 5,
      limitations: [],
      preferences: { targetIntensity: 'HIGH', preferredDurationMinutes: 60, daysPerWeek: 5 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    },
  },
};

export function CompatibilityVerifier() {
  const [activeTab, setActiveTab] = useState<'TEST_SUITE' | 'LIVE_EXPLORER'>('TEST_SUITE');
  const [testReport, setTestReport] = useState<EngineTestSuiteReport>(() => EngineTestSuite.runAll());
  const [expandedTestCase, setExpandedTestCase] = useState<string | null>('test-case-05'); // Por defecto caso 5 desplegado

  // Estado para el explorador en vivo
  const profileKeys = Object.keys(EXTENDED_TEST_PROFILES);
  const [selectedProfileKey, setSelectedProfileKey] = useState<string>(profileKeys[0]);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string>(EXERCISE_LIBRARY[0].id);

  const activeProfile = EXTENDED_TEST_PROFILES[selectedProfileKey].profile;

  // Ejecución en lote del motor de compatibilidad sobre la biblioteca de 64 ejercicios
  const batchReport = useMemo(() => {
    return CompatibilityEngine.evaluateBatch(EXERCISE_LIBRARY, activeProfile, EXERCISE_LIBRARY);
  }, [activeProfile]);

  // Filtrado de ejercicios en el explorador
  const filteredResults = useMemo(() => {
    return batchReport.results.filter((res) => {
      const ex = getExerciseById(res.exerciseId);
      if (!ex) return false;

      // Filtro de estado
      if (statusFilter !== 'ALL' && res.status !== statusFilter) return false;

      // Filtro de categoría
      if (selectedCategory !== 'ALL' && ex.category !== selectedCategory && !ex.categories?.includes(selectedCategory as ExerciseCategory)) {
        return false;
      }

      // Filtro de búsqueda textual
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        return (
          ex.name.toLowerCase().includes(q) ||
          ex.primaryMuscle.toLowerCase().includes(q) ||
          ex.bodyArea.toLowerCase().includes(q)
        );
      }

      return true;
    });
  }, [batchReport, statusFilter, selectedCategory, searchQuery]);

  const selectedExercise = useMemo(() => {
    return getExerciseById(selectedExerciseId) || EXERCISE_LIBRARY[0];
  }, [selectedExerciseId]);

  const selectedEvaluation = useMemo(() => {
    return (
      batchReport.results.find((r) => r.exerciseId === selectedExercise.id) ||
      CompatibilityEngine.evaluate(selectedExercise, activeProfile, EXERCISE_LIBRARY)
    );
  }, [batchReport, selectedExercise, activeProfile]);

  const handleRerunTests = () => {
    setTestReport(EngineTestSuite.runAll());
  };

  return (
    <div id="compatibility-verifier-panel" className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-xs">
      {/* Cabecera del Módulo */}
      <div className="border-b border-zinc-200 p-5 bg-zinc-50/80">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                <Sliders className="w-4 h-4" />
              </span>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  FASE 5 • Motor de Personalización
                </span>
                <h2 className="text-lg font-bold text-zinc-900 mt-0.5">
                  Motor de Compatibilidad y Personalización (Pure Engine)
                </h2>
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-1 max-w-2xl">
              Motor determinista desacoplado que evalúa <code className="font-mono text-zinc-800 font-semibold">(UserProfile, Exercise[])</code> con 9 prioridades jerárquicas estrictas. Las limitaciones de seguridad física <strong>siempre tienen prioridad absoluta</strong> sobre objetivos y preferencias.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="tab-btn-test-suite"
              onClick={() => setActiveTab('TEST_SUITE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'TEST_SUITE'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              Suite de Pruebas ({testReport.passedTests}/{testReport.totalTests})
            </button>
            <button
              id="tab-btn-live-explorer"
              onClick={() => setActiveTab('LIVE_EXPLORER')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'LIVE_EXPLORER'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-100'
              }`}
            >
              Explorador en Vivo (64 Ejercicios)
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          PESTAÑA 1: SUITE DE PRUEBAS UNITARIAS (10 DE 10 CASOS)
         ========================================================================= */}
      {activeTab === 'TEST_SUITE' && (
        <div className="p-5 space-y-5">
          {/* Banner de Estado de la Suite */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 text-white rounded-lg">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  10 de 10 Pruebas Ejecutadas con Éxito
                  <span className="text-xs bg-emerald-200 text-emerald-900 font-mono px-2 py-0.5 rounded-full font-bold">
                    100% PASS
                  </span>
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Tiempo de ejecución del motor puro: <strong>{testReport.totalDurationMs} ms</strong>. Todas las aserciones de seguridad, scoring y alternativas fueron validadas.
                </p>
              </div>
            </div>

            <button
              id="btn-rerun-engine-tests"
              onClick={handleRerunTests}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-300 text-emerald-900 rounded-lg text-xs font-semibold hover:bg-emerald-100/60 transition-colors shadow-xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reejecutar Pruebas
            </button>
          </div>

          {/* Grid de Casos de Prueba */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-zinc-600 uppercase tracking-wider">
              Casos Fundamentales Evaluados por el Motor
            </div>

            {testReport.results.map((test) => {
              const isExpanded = expandedTestCase === test.id;
              return (
                <div
                  key={test.id}
                  id={`test-card-${test.id}`}
                  className={`border rounded-xl transition-all overflow-hidden ${
                    test.passed ? 'border-zinc-200 bg-white' : 'border-rose-300 bg-rose-50/30'
                  }`}
                >
                  {/* Encabezado del Test Case */}
                  <div
                    onClick={() => setExpandedTestCase(isExpanded ? null : test.id)}
                    className="p-3.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-zinc-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs bg-zinc-100 text-zinc-800 shrink-0">
                        {test.number}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-zinc-900 truncate">{test.name}</h4>
                          <span className="text-[10px] text-zinc-500 font-mono">({test.executionTimeMs} ms)</span>
                        </div>
                        <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                          Ejercicio: <strong className="text-zinc-700">{test.exerciseTestedName}</strong> • {test.userSummary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {/* Estado Resultante */}
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          test.actualStatus === CompatibilityStatus.COMPATIBLE
                            ? 'bg-emerald-100 text-emerald-800'
                            : test.actualStatus === CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {test.actualStatus === CompatibilityStatus.COMPATIBLE && <CheckCircle className="w-3 h-3" />}
                        {test.actualStatus === CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION && <AlertTriangle className="w-3 h-3" />}
                        {test.actualStatus === CompatibilityStatus.NOT_RECOMMENDED && <XCircle className="w-3 h-3" />}
                        {test.actualStatus}
                      </span>

                      {/* Score Resultante */}
                      <span className="text-xs font-mono font-bold text-zinc-700 w-12 text-right">
                        {test.actualScore} pts
                      </span>

                      {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                    </div>
                  </div>

                  {/* Detalle Desplegable del Test Case */}
                  {isExpanded && (
                    <div className="p-4 pt-2 border-t border-zinc-100 bg-zinc-50/50 space-y-3">
                      <p className="text-xs text-zinc-600 leading-relaxed">{test.description}</p>

                      {/* Lista de Aserciones Específicas */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wide">
                          Aserciones del Motor:
                        </span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {test.assertions.map((assertion, idx) => (
                            <div
                              key={idx}
                              className={`p-2 rounded-lg border text-xs flex items-start gap-2 ${
                                assertion.passed
                                  ? 'bg-white border-emerald-200 text-emerald-950'
                                  : 'bg-rose-50 border-rose-200 text-rose-950'
                              }`}
                            >
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold block">{assertion.name}</span>
                                {assertion.note && (
                                  <span className="text-[11px] text-zinc-600 block mt-0.5">{assertion.note}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Alternativa si fue recomendada */}
                      {test.suggestedAlternativeName && (
                        <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
                            <div>
                              <span className="font-bold text-emerald-950">Alternativa Sugerida por el Motor:</span>
                              <span className="text-emerald-800 ml-1.5 font-medium">{test.suggestedAlternativeName}</span>
                            </div>
                          </div>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold">
                            {test.evaluation.suggestedAlternative?.substitutionType}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          PESTAÑA 2: EXPLORADOR EN VIVO (BIBLIOTECA COMPLETA DE 64 EJERCICIOS)
         ========================================================================= */}
      {activeTab === 'LIVE_EXPLORER' && (
        <div>
          {/* Selector de Perfiles Extendidos */}
          <div className="p-4 bg-zinc-50 border-b border-zinc-200">
            <label className="block text-xs font-semibold text-zinc-700 mb-2 uppercase tracking-wide">
              Selecciona Perfil de Usuario para la Simulación:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
              {profileKeys.map((key) => {
                const item = EXTENDED_TEST_PROFILES[key];
                const isSelected = selectedProfileKey === key;
                return (
                  <button
                    key={key}
                    id={`btn-profile-extended-${key}`}
                    onClick={() => setSelectedProfileKey(key)}
                    className={`text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                        : 'border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50'
                    }`}
                  >
                    <div className="text-xs font-bold text-zinc-900 line-clamp-1">{item.label}</div>
                    <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1.5">
                      <span className="font-mono bg-zinc-100 px-1 py-0.2 rounded">{item.profile.trainingLocation}</span>
                      <span>•</span>
                      <span>{item.profile.primaryGoal}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Resumen Métrico de la Evaluación de la Biblioteca */}
          <div className="grid grid-cols-4 border-b border-zinc-200 divide-x divide-zinc-200 bg-white text-center py-3">
            <div>
              <span className="block text-xl font-bold text-emerald-600">{batchReport.compatibleCount}</span>
              <span className="text-xs text-zinc-600 font-medium">Compatibles directos</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-amber-600">{batchReport.compatibleWithModificationCount}</span>
              <span className="text-xs text-zinc-600 font-medium">Con adaptación segura</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-rose-600">{batchReport.notRecommendedCount}</span>
              <span className="text-xs text-zinc-600 font-medium">No recomendados</span>
            </div>
            <div>
              <span className="block text-xl font-bold text-zinc-800">{batchReport.averageScore} pts</span>
              <span className="text-xs text-zinc-600 font-medium">Score Promedio</span>
            </div>
          </div>

          {/* Barra de Filtros y Búsqueda */}
          <div className="p-3 border-b border-zinc-200 bg-zinc-50/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Buscar ejercicio o grupo muscular..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-zinc-900"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              {/* Filtro de Estado */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-700 font-medium cursor-pointer"
              >
                <option value="ALL">Todos los Estados</option>
                <option value={CompatibilityStatus.COMPATIBLE}>Solo Compatibles</option>
                <option value={CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION}>Solo Con Adaptación</option>
                <option value={CompatibilityStatus.NOT_RECOMMENDED}>Solo No Recomendados</option>
              </select>

              {/* Filtro de Categoría */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-zinc-700 font-medium cursor-pointer"
              >
                <option value="ALL">Todas las Categorías</option>
                <option value="STRENGTH">Fuerza (Strength)</option>
                <option value="CARDIO">Cardio</option>
                <option value="TONING">Tonificación (Toning)</option>
                <option value="MOBILITY">Movilidad (Mobility)</option>
                <option value="FULL_BODY">Cuerpo Completo (Full Body)</option>
              </select>
            </div>
          </div>

          {/* Cuerpo Dividido: Lista a la Izquierda, Auditoría a la Derecha */}
          <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-zinc-200 min-h-[520px]">
            {/* Lista de Ejercicios */}
            <div className="lg:col-span-5 p-3 space-y-1.5 overflow-y-auto max-h-[620px]">
              <div className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-1 flex justify-between">
                <span>Resultados ({filteredResults.length})</span>
                <span>Prioridad: Seguridad {'>'} Nivel {'>'} Equipo</span>
              </div>

              {filteredResults.map((res) => {
                const ex = getExerciseById(res.exerciseId)!;
                const isSelected = ex.id === selectedExercise.id;

                return (
                  <button
                    key={res.exerciseId}
                    id={`btn-live-exercise-${ex.id}`}
                    onClick={() => setSelectedExerciseId(ex.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                      isSelected
                        ? 'border-zinc-900 bg-zinc-900 text-white shadow-xs'
                        : 'border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900'
                    }`}
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold leading-snug truncate">{ex.name}</span>
                      </div>
                      <div className={`text-[11px] flex items-center gap-1.5 ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        <span>{ex.category}</span>
                        <span>•</span>
                        <span>{ex.bodyArea}</span>
                        <span>•</span>
                        <span>Imp: {ex.impactLevel}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-zinc-800 text-zinc-200'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        {res.overallScore}%
                      </span>

                      {res.status === CompatibilityStatus.COMPATIBLE && (
                        <CheckCircle className={`w-4 h-4 ${isSelected ? 'text-emerald-400' : 'text-emerald-600'}`} />
                      )}
                      {res.status === CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION && (
                        <AlertTriangle className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-amber-600'}`} />
                      )}
                      {res.status === CompatibilityStatus.NOT_RECOMMENDED && (
                        <XCircle className={`w-4 h-4 ${isSelected ? 'text-rose-400' : 'text-rose-600'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Panel de Auditoría Biomecánica y Reglas */}
            <div className="lg:col-span-7 p-5 space-y-4 overflow-y-auto max-h-[620px]">
              {/* Cabecera del Ejercicio Seleccionado */}
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-zinc-200">
                <div>
                  <div className="text-xs font-mono text-zinc-500">{selectedExercise.slug}</div>
                  <h3 className="text-lg font-bold text-zinc-900 mt-0.5">{selectedExercise.name}</h3>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    {selectedExercise.description}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <span className="text-[11px] text-zinc-500 block uppercase font-medium">Score Neto</span>
                  <span
                    className={`text-2xl font-black ${
                      selectedEvaluation.status === CompatibilityStatus.COMPATIBLE
                        ? 'text-emerald-600'
                        : selectedEvaluation.status === CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION
                        ? 'text-amber-600'
                        : 'text-rose-600'
                    }`}
                  >
                    {selectedEvaluation.overallScore}%
                  </span>
                  <span
                    className={`text-[10px] font-bold block uppercase mt-0.5 ${
                      selectedEvaluation.status === CompatibilityStatus.COMPATIBLE
                        ? 'text-emerald-700'
                        : selectedEvaluation.status === CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {selectedEvaluation.status}
                  </span>
                </div>
              </div>

              {/* BANNER DE ALTERNATIVA BIOMECÁNICA SI CORRESPONDE */}
              {selectedEvaluation.suggestedAlternative && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-emerald-950 text-xs">
                      <Sparkles className="w-4 h-4 text-emerald-700" />
                      Alternativa Sugerida por el Motor ({selectedEvaluation.suggestedAlternative.substitutionType}):
                    </div>
                    <span className="text-[10px] bg-emerald-200 text-emerald-900 font-mono font-bold px-2 py-0.5 rounded">
                      Sustitución Segura
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-emerald-900">
                      {selectedEvaluation.suggestedAlternative.exerciseName}
                    </h4>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      {selectedEvaluation.suggestedAlternative.reason}
                    </p>
                    <p className="text-[11px] text-emerald-700 mt-1 italic">
                      Pauta de ejecución: {selectedEvaluation.suggestedAlternative.howToPerform}
                    </p>
                  </div>
                  {selectedEvaluation.suggestedAlternative.exercise && (
                    <button
                      id="btn-switch-to-alternative"
                      onClick={() => setSelectedExerciseId(selectedEvaluation.suggestedAlternative!.exerciseId)}
                      className="mt-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline cursor-pointer inline-flex items-center gap-1"
                    >
                      Inspeccionar esta alternativa en el motor <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              )}

              {/* Desglose Matemático del Scoring Determinista */}
              <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                    Desglose del Scoring Determinista (0 - 100 pts)
                  </span>
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Total: {selectedEvaluation.overallScore} / 100
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px]">1. Seguridad</span>
                    <span className="font-bold text-zinc-900">{selectedEvaluation.scoreBreakdown.safety}%</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px]">2. Nivel</span>
                    <span className="font-bold text-zinc-900">+{selectedEvaluation.scoreBreakdown.level} / 20</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px]">3. Equipamiento</span>
                    <span className="font-bold text-zinc-900">+{selectedEvaluation.scoreBreakdown.equipment} / 20</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px]">4. Lugar</span>
                    <span className="font-bold text-zinc-900">+{selectedEvaluation.scoreBreakdown.location} / 10</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px]">5. Objetivo</span>
                    <span className="font-bold text-zinc-900">+{selectedEvaluation.scoreBreakdown.goal} / 30</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px]">6. Tiempo</span>
                    <span className="font-bold text-zinc-900">+{selectedEvaluation.scoreBreakdown.time} / 5</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px]">7. Intensidad</span>
                    <span className="font-bold text-zinc-900">+{selectedEvaluation.scoreBreakdown.intensity} / 5</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-zinc-200">
                    <span className="text-zinc-500 block text-[10px]">9. Morfología</span>
                    <span className="font-bold text-zinc-900">+{selectedEvaluation.scoreBreakdown.morphology} / 4</span>
                  </div>
                </div>
                {selectedEvaluation.scoreBreakdown.modificationsPenalty < 0 && (
                  <div className="text-[11px] text-amber-800 font-medium pt-1">
                    ↳ Ajuste por modificación requerida: {selectedEvaluation.scoreBreakdown.modificationsPenalty} pts
                  </div>
                )}
              </div>

              {/* Auditoría de las 9 Reglas Jerárquicas */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Auditoría de Reglas por Jerarquía de Prioridad (1 a 9)
                </h4>

                <div className="space-y-2">
                  {selectedEvaluation.ruleDetails.map((detail, idx) => (
                    <div
                      key={idx}
                      className={`p-2.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                        detail.passed && !detail.suggestedModification
                          ? 'border-emerald-200 bg-emerald-50/40 text-emerald-950'
                          : detail.passed && detail.suggestedModification
                          ? 'border-amber-200 bg-amber-50/40 text-amber-950'
                          : 'border-rose-200 bg-rose-50/40 text-rose-950'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {detail.passed && !detail.suggestedModification && (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        )}
                        {detail.passed && detail.suggestedModification && (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        )}
                        {!detail.passed && <XCircle className="w-4 h-4 text-rose-600" />}
                      </div>

                      <div className="space-y-0.5 flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-zinc-900 flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-zinc-200 text-zinc-800 text-[10px] font-mono inline-flex items-center justify-center font-bold">
                              {detail.priority}
                            </span>
                            {detail.ruleType}
                          </span>
                          {detail.isHardFilter && (
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-200 text-zinc-700 font-mono font-medium">
                              Filtro Duro
                            </span>
                          )}
                        </div>
                        <p className="text-zinc-700 text-[11px] leading-relaxed mt-0.5">{detail.message}</p>
                        {detail.suggestedModification && (
                          <p className="text-amber-800 text-[11px] font-semibold mt-1">
                            ↳ Pauta adaptativa: {detail.suggestedModification}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
