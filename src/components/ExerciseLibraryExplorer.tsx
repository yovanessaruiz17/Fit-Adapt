/**
 * FitAdapt - Explorador Interactivo de la Biblioteca de Ejercicios
 * FASE 4: Biblioteca de Ejercicios Estructurada
 * 
 * Permite explorar, filtrar por categorías, nivel, zona corporal, equipamiento
 * e impacto articular sobre los 64+ ejercicios estructurados, con visor de fichas
 * técnicas biomecánicas y relaciones de alternativas.
 */

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Dumbbell,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Clock,
  Layers,
  Sparkles,
  ChevronRight,
  Info,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  Exercise,
  ExerciseCategory,
  BodyArea,
  ExerciseEquipment,
  ImpactLevel,
  JointLimitationArea,
} from '../types/exercise';
import { FitnessLevel } from '../types/user';
import {
  EXERCISE_LIBRARY,
  LIBRARY_METRICS,
  getJointLimitationEffect,
  findAlternativeForExercise,
} from '../data/exerciseLibrary';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';

export function ExerciseLibraryExplorer() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedBodyArea, setSelectedBodyArea] = useState<string>('ALL');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('ALL');
  const [selectedJointFilter, setSelectedJointFilter] = useState<JointLimitationArea | 'ALL'>('ALL');
  const [inspectingExercise, setInspectingExercise] = useState<Exercise | null>(null);

  // Categorías de filtro
  const categoriesList = [
    { key: 'ALL', label: 'Todos', count: LIBRARY_METRICS.totalExercises },
    { key: ExerciseCategory.CARDIO, label: 'Cardio', count: LIBRARY_METRICS.countsByCategory[ExerciseCategory.CARDIO] },
    { key: ExerciseCategory.STRENGTH, label: 'Fuerza', count: LIBRARY_METRICS.countsByCategory[ExerciseCategory.STRENGTH] },
    { key: ExerciseCategory.TONING, label: 'Tonificación', count: LIBRARY_METRICS.countsByCategory[ExerciseCategory.TONING] },
    { key: ExerciseCategory.MOBILITY, label: 'Movilidad', count: LIBRARY_METRICS.countsByCategory[ExerciseCategory.MOBILITY] },
    { key: ExerciseCategory.FULL_BODY, label: 'Full Body', count: LIBRARY_METRICS.countsByCategory[ExerciseCategory.FULL_BODY] },
    { key: ExerciseCategory.LOW_IMPACT, label: 'Bajo Impacto', count: LIBRARY_METRICS.countsByCategory[ExerciseCategory.LOW_IMPACT] },
  ];

  // Filtrado reactivo
  const filteredExercises = useMemo(() => {
    return EXERCISE_LIBRARY.filter((ex) => {
      // Búsqueda de texto
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = ex.name.toLowerCase().includes(query);
        const matchesDesc = ex.description.toLowerCase().includes(query);
        const matchesMuscle =
          ex.primaryMuscle.toLowerCase().includes(query) ||
          ex.secondaryMuscles.some((m) => m.toLowerCase().includes(query));
        if (!matchesName && !matchesDesc && !matchesMuscle) return false;
      }

      // Categoría
      if (selectedCategory !== 'ALL') {
        const matchesCat =
          ex.category === selectedCategory ||
          ex.categories.includes(selectedCategory as ExerciseCategory) ||
          (selectedCategory === ExerciseCategory.LOW_IMPACT && ex.impactLevel === ImpactLevel.LOW);
        if (!matchesCat) return false;
      }

      // Nivel
      if (selectedLevel !== 'ALL' && ex.fitnessLevel !== selectedLevel) {
        return false;
      }

      // Zona corporal
      if (selectedBodyArea !== 'ALL' && ex.bodyArea !== selectedBodyArea) {
        return false;
      }

      // Equipamiento
      if (selectedEquipment !== 'ALL') {
        const hasEq = ex.equipment.includes(selectedEquipment as ExerciseEquipment);
        if (!hasEq) return false;
      }

      // Articulación
      if (selectedJointFilter !== 'ALL') {
        const effect = getJointLimitationEffect(ex, selectedJointFilter);
        // Mostrar compatibles o con modificación
        if (effect.status === 'NOT_RECOMMENDED') return false;
      }

      return true;
    });
  }, [
    searchTerm,
    selectedCategory,
    selectedLevel,
    selectedBodyArea,
    selectedEquipment,
    selectedJointFilter,
  ]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('ALL');
    setSelectedLevel('ALL');
    setSelectedBodyArea('ALL');
    setSelectedEquipment('ALL');
    setSelectedJointFilter('ALL');
  };

  return (
    <div id="exercise-library-explorer" className="space-y-6">
      {/* Encabezado y Métricas */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-300">
                <Dumbbell className="w-5 h-5" />
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
                Biblioteca Estructurada de Ejercicios (FASE 4)
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1 max-w-2xl">
              Catálogo estandarizado sin texto libre de IA. Cada ficha integra biomecánica precisa,
              matrices de compatibilidad articular y rutas de adaptación directa.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-800/60 p-2.5 rounded-xl border border-zinc-200/80 dark:border-zinc-700/60 text-xs">
            <div className="text-center px-3 border-r border-zinc-200 dark:border-zinc-700">
              <div className="text-lg font-black text-zinc-900 dark:text-zinc-100 font-mono">
                {LIBRARY_METRICS.totalExercises}
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Total</div>
            </div>
            <div className="text-center px-3 border-r border-zinc-200 dark:border-zinc-700">
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {LIBRARY_METRICS.countsByImpact[ImpactLevel.LOW]}
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Bajo Impacto</div>
            </div>
            <div className="text-center px-3">
              <div className="text-lg font-black text-teal-600 dark:text-teal-400 font-mono">
                6
              </div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Categorías</div>
            </div>
          </div>
        </div>

        {/* Barra de Filtros Rápidos por Categoría */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-5 pt-4 border-t border-zinc-100 dark:border-zinc-800 scrollbar-none">
          {categoriesList.map((cat) => {
            const isActive = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isActive
                      ? 'bg-white/20 text-white dark:bg-black/20 dark:text-zinc-900'
                      : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Controles de Búsqueda y Filtros Detallados */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Buscador */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por ejercicio o músculo (ej. sentadilla, glúteo, zancada)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
          />
        </div>

        {/* Nivel */}
        <div className="md:col-span-2">
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">Nivel: Todos</option>
            <option value={FitnessLevel.BEGINNER}>Principiante</option>
            <option value={FitnessLevel.INTERMEDIATE}>Intermedio</option>
            <option value={FitnessLevel.ADVANCED}>Avanzado</option>
          </select>
        </div>

        {/* Zona Corporal */}
        <div className="md:col-span-2">
          <select
            value={selectedBodyArea}
            onChange={(e) => setSelectedBodyArea(e.target.value)}
            className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">Zona: Todas</option>
            <option value={BodyArea.FULL_BODY}>Full body</option>
            <option value={BodyArea.LEGS}>Piernas</option>
            <option value={BodyArea.GLUTES}>Glúteos</option>
            <option value={BodyArea.CORE}>Core</option>
            <option value={BodyArea.CHEST}>Pectoral</option>
            <option value={BodyArea.BACK}>Espalda</option>
            <option value={BodyArea.SHOULDERS}>Hombros</option>
            <option value={BodyArea.ARMS}>Brazos</option>
            <option value={BodyArea.MOBILITY}>Movilidad</option>
          </select>
        </div>

        {/* Limitación Articular Compatible */}
        <div className="md:col-span-2">
          <select
            value={selectedJointFilter}
            onChange={(e) => setSelectedJointFilter(e.target.value as any)}
            className="w-full py-2.5 px-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="ALL">Articulación: Todas</option>
            <option value={JointLimitationArea.KNEE}>Apto Rodilla</option>
            <option value={JointLimitationArea.LOWER_BACK}>Apto Lumbar</option>
            <option value={JointLimitationArea.SHOULDER}>Apto Hombro</option>
            <option value={JointLimitationArea.NECK}>Apto Cuello</option>
            <option value={JointLimitationArea.WRIST}>Apto Muñeca</option>
            <option value={JointLimitationArea.ANKLE}>Apto Tobillo</option>
          </select>
        </div>

        {/* Reset */}
        <div className="md:col-span-1 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleResetFilters}
            className="text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            title="Restablecer filtros"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Resultados y Contador */}
      <div className="flex items-center justify-between text-xs text-zinc-500 px-1">
        <span>
          Mostrando <strong className="text-zinc-900 dark:text-zinc-100">{filteredExercises.length}</strong> de{' '}
          {EXERCISE_LIBRARY.length} ejercicios catalogados
        </span>
        {selectedCategory !== 'ALL' && (
          <span className="text-teal-600 dark:text-teal-400 font-medium">
            Filtro activo: {categoriesList.find((c) => c.key === selectedCategory)?.label}
          </span>
        )}
      </div>

      {/* Grilla de Ejercicios */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExercises.map((exercise) => {
          const isLowImpact = exercise.impactLevel === ImpactLevel.LOW;
          return (
            <div
              key={exercise.id}
              onClick={() => setInspectingExercise(exercise)}
              className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-4 sm:p-5 hover:border-teal-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Badges superiores */}
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Badge variant={isLowImpact ? 'emerald' : 'neutral'} size="sm">
                      {isLowImpact ? 'Bajo Impacto' : `Impacto ${exercise.impactLevel}`}
                    </Badge>
                    <Badge variant="teal" size="sm">
                      {exercise.category}
                    </Badge>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-zinc-400 dark:text-zinc-500">
                    {exercise.fitnessLevel}
                  </span>
                </div>

                {/* Nombre y descripción */}
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors line-clamp-1">
                  {exercise.name}
                </h3>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {exercise.description}
                </p>

                {/* Etiquetas de músculos */}
                <div className="flex flex-wrap gap-1 mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 text-[11px]">
                  <span className="text-zinc-500">Principal:</span>
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                    {exercise.primaryMuscle}
                  </span>
                </div>
              </div>

              {/* Pie de tarjeta */}
              <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    {exercise.defaultDuration
                      ? `${exercise.defaultDuration}s`
                      : typeof exercise.defaultReps === 'object'
                      ? `${exercise.defaultReps.min}-${exercise.defaultReps.max}r`
                      : `${exercise.defaultReps}r`}
                  </span>
                  <span>•</span>
                  <span>{exercise.equipment[0]}</span>
                </div>

                <span className="text-teal-600 dark:text-teal-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center">
                  Ver ficha <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filteredExercises.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-zinc-900 border border-dashed border-zinc-300 dark:border-zinc-800 rounded-2xl">
          <Info className="w-8 h-8 text-zinc-400 mx-auto mb-2" />
          <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
            No se encontraron ejercicios con los filtros seleccionados
          </h4>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Prueba a restablecer los filtros para explorar todo el catálogo de FASE 4.
          </p>
          <Button variant="outline" size="sm" onClick={handleResetFilters} className="mt-4">
            Restablecer Filtros
          </Button>
        </div>
      )}

      {/* Modal / Ficha Técnica Biomecánica del Ejercicio */}
      {inspectingExercise && (
        <Modal
          isOpen={true}
          onClose={() => setInspectingExercise(null)}
          title={inspectingExercise.name}
          description={`Ficha Biomecánica • Categoría: ${inspectingExercise.category}`}
          maxWidth="lg"
        >
          <div className="space-y-6">
            {/* Resumen Superior */}
            <div className="bg-zinc-50 dark:bg-zinc-850 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800">
              <p className="text-xs sm:text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {inspectingExercise.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
                <Badge variant="teal">{inspectingExercise.category}</Badge>
                <Badge variant={inspectingExercise.impactLevel === ImpactLevel.LOW ? 'emerald' : 'neutral'}>
                  Impacto {inspectingExercise.impactLevel}
                </Badge>
                <Badge variant="neutral">Nivel {inspectingExercise.fitnessLevel}</Badge>
                <Badge variant="neutral">Zona: {inspectingExercise.bodyArea}</Badge>
                <Badge variant="neutral">Equipo: {inspectingExercise.equipment.join(', ')}</Badge>
              </div>
            </div>

            {/* Parámetros de Dosificación */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Dosificación y Estructura por Defecto
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-zinc-400 text-[10px] uppercase font-semibold">Series</div>
                  <div className="text-base font-black text-zinc-900 dark:text-zinc-100 font-mono mt-0.5">
                    {inspectingExercise.defaultSets}
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-zinc-400 text-[10px] uppercase font-semibold">
                    {inspectingExercise.defaultDuration ? 'Duración' : 'Repeticiones'}
                  </div>
                  <div className="text-base font-black text-zinc-900 dark:text-zinc-100 font-mono mt-0.5">
                    {inspectingExercise.defaultDuration
                      ? `${inspectingExercise.defaultDuration}s`
                      : typeof inspectingExercise.defaultReps === 'object'
                      ? `${inspectingExercise.defaultReps.min}-${inspectingExercise.defaultReps.max}`
                      : `${inspectingExercise.defaultReps}`}
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-zinc-400 text-[10px] uppercase font-semibold">Descanso</div>
                  <div className="text-base font-black text-zinc-900 dark:text-zinc-100 font-mono mt-0.5">
                    {inspectingExercise.defaultRest}s
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-850 rounded-xl border border-zinc-200 dark:border-zinc-800">
                  <div className="text-zinc-400 text-[10px] uppercase font-semibold">Intensidad</div>
                  <div className="text-base font-black text-zinc-900 dark:text-zinc-100 font-mono mt-0.5">
                    {inspectingExercise.intensity}
                  </div>
                </div>
              </div>
            </div>

            {/* Instrucciones de Ejecución Paso a Paso */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Instrucciones Técnicas de Ejecución
              </h4>
              <div className="space-y-2">
                {inspectingExercise.instructions.map((inst) => (
                  <div
                    key={inst.stepNumber}
                    className="p-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-start gap-3 text-xs"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {inst.stepNumber}
                    </span>
                    <div>
                      <strong className="text-zinc-900 dark:text-zinc-100 block font-semibold">
                        {inst.title}
                      </strong>
                      <span className="text-zinc-600 dark:text-zinc-400">{inst.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Errores Comunes y Contraindicaciones */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900 dark:text-amber-200 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  Errores Frecuentes
                </div>
                <ul className="space-y-1 list-disc list-inside text-amber-800/90 dark:text-amber-300">
                  {inspectingExercise.commonMistakes.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-rose-900 dark:text-rose-200 mb-1.5">
                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                  Contraindicaciones Médicas
                </div>
                <ul className="space-y-1 list-disc list-inside text-rose-800/90 dark:text-rose-300">
                  {inspectingExercise.contraindications.length > 0 ? (
                    inspectingExercise.contraindications.map((contra, i) => (
                      <li key={i}>{contra}</li>
                    ))
                  ) : (
                    <li className="list-none">Sin contraindicaciones agudas conocidas en ejecución correcta.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Perfil de Limitaciones Articulares (Rodilla, Espalda baja, Hombro, Cuello, Muñeca, Tobillo) */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                Compatibilidad Articular Registrada
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
                {Object.values(JointLimitationArea).map((joint) => {
                  const effect = getJointLimitationEffect(inspectingExercise, joint);
                  const isCompatible = effect.status === 'COMPATIBLE';
                  const isMod = effect.status === 'REQUIRES_MODIFICATION';
                  const isNotRec = effect.status === 'NOT_RECOMMENDED';

                  return (
                    <div
                      key={joint}
                      className={`p-2.5 rounded-xl border flex flex-col justify-between ${
                        isCompatible
                          ? 'border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/40 dark:bg-emerald-950/20'
                          : isMod
                          ? 'border-amber-200 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20'
                          : 'border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span className="text-zinc-800 dark:text-zinc-200 capitalize">
                          {joint.replace('_', ' ').toLowerCase()}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                            isCompatible
                              ? 'bg-emerald-200 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200'
                              : isMod
                              ? 'bg-amber-200 dark:bg-amber-900 text-amber-800 dark:text-amber-200'
                              : 'bg-rose-200 dark:bg-rose-900 text-rose-800 dark:text-rose-200'
                          }`}
                        >
                          {isCompatible ? 'Compatible' : isMod ? 'Modificar' : 'No recomendado'}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 leading-snug">
                        {effect.notes}
                      </p>
                      {effect.modificationGuidance && (
                        <p className="text-[10px] font-medium text-amber-800 dark:text-amber-300 mt-1 italic">
                          Adaptación: {effect.modificationGuidance}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Alternativas y Rutas de Adaptación Directa */}
            {(inspectingExercise.lowImpactAlternative || inspectingExercise.noEquipmentAlternative) && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Rutas de Adaptación Directa (FASE 5 Ready)
                </h4>
                <div className="space-y-2 text-xs">
                  {inspectingExercise.lowImpactAlternative && (
                    <div className="p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/10 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-emerald-900 dark:text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Sustituto de Bajo Impacto: {inspectingExercise.lowImpactAlternative.name}
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                          {inspectingExercise.lowImpactAlternative.description}
                        </p>
                        <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1 italic">
                          Cómo realizar: {inspectingExercise.lowImpactAlternative.howToPerform}
                        </p>
                      </div>
                    </div>
                  )}

                  {inspectingExercise.noEquipmentAlternative && (
                    <div className="p-3 rounded-xl border border-teal-200 dark:border-teal-900/40 bg-teal-50/30 dark:bg-teal-950/10 flex items-start justify-between gap-3">
                      <div>
                        <div className="font-bold text-teal-900 dark:text-teal-300 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
                          Alternativa Sin Equipamiento: {inspectingExercise.noEquipmentAlternative.name}
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-400 mt-0.5">
                          {inspectingExercise.noEquipmentAlternative.description}
                        </p>
                        <p className="text-[11px] text-teal-700 dark:text-teal-400 mt-1 italic">
                          Cómo realizar: {inspectingExercise.noEquipmentAlternative.howToPerform}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Aviso ético y médico */}
            <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-[11px] text-zinc-500 leading-relaxed border border-zinc-200 dark:border-zinc-700/60">
              <strong className="text-zinc-700 dark:text-zinc-300 block mb-0.5">
                Declaración de Seguridad Biomecánica FitAdapt
              </strong>
              Las indicaciones y clasificaciones responden a principios conservadores de cinética articular y no sustituyen una prescripción médica o diagnóstico clínico presencial.
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
