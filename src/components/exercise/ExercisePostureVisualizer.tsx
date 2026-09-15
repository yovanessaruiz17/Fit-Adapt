/**
 * FitAdapt - Visualizador Biomecánico de Postura y Adaptaciones Caseras
 * 
 * Resuelve:
 * 1. Muestra diagramas SVG claros de la postura correcta (columna neutra, ángulos de rodilla/codo).
 * 2. Explica paso a paso cómo colocarse y moverse en lenguaje claro sin tecnicismos confusos.
 * 3. Incorpora la pestaña "🏠 ¿Sin pesas en casa?" con sustitutos cotidianos (mochila, botellas, silla)
 *    y la variante 100% peso corporal sin implementos.
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Wind,
  Home,
  Dumbbell,
  HelpCircle,
  Sparkles,
  Info,
  ChevronRight,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { MovementType, BodyArea, ExerciseCategory } from '../../types/exercise';
import { getHomeSubstituteForExercise } from '../../data/homeExerciseSubstitutes';

export interface ExercisePostureVisualizerProps {
  exerciseId: string;
  exerciseName: string;
  category?: ExerciseCategory;
  bodyArea?: BodyArea;
  movementType?: MovementType;
  primaryMuscle?: string;
  instructions?: Array<{ stepNumber?: number; title: string; description: string }>;
  commonMistakes?: string[];
  isAdapted?: boolean;
  requiredEquipment?: any[];
  compact?: boolean;
}

export function ExercisePostureVisualizer({
  exerciseId,
  exerciseName,
  category,
  bodyArea,
  movementType = MovementType.SQUAT,
  primaryMuscle,
  instructions = [],
  commonMistakes = [],
  isAdapted = false,
  requiredEquipment = [],
  compact = false,
}: ExercisePostureVisualizerProps) {
  // Pestaña activa: 'posture' (Postura y técnica) | 'home' (Adaptación casera sin pesas) | 'breathing' (Respiración y errores)
  const [activeTab, setActiveTab] = useState<'posture' | 'home' | 'breathing'>('posture');
  
  // Fase de postura seleccionada: 'setup' (Posición inicial) | 'execution' (Movimiento) | 'lockout' (Regreso)
  const [posturePhase, setPosturePhase] = useState<'setup' | 'execution' | 'lockout'>('execution');

  // Datos de sustituto casero
  const homeSub = getHomeSubstituteForExercise(exerciseId, movementType, requiredEquipment);

  // ¿El ejercicio sugiere o pide pesas/mancuernas/equipamiento?
  const isEquipDependent =
    exerciseName.toLowerCase().includes('mancuerna') ||
    exerciseName.toLowerCase().includes('pesa') ||
    exerciseName.toLowerCase().includes('barra') ||
    exerciseName.toLowerCase().includes('thruster') ||
    exerciseName.toLowerCase().includes('curl') ||
    exerciseName.toLowerCase().includes('banco') ||
    exerciseName.toLowerCase().includes('press') ||
    exerciseName.toLowerCase().includes('farmer');

  // Selector del diagrama SVG según el tipo de movimiento
  const renderPostureSVG = () => {
    switch (movementType) {
      case MovementType.SQUAT:
        return (
          <svg viewBox="0 0 300 200" className="w-full h-44 sm:h-52 select-none" aria-label="Postura de Sentadilla">
            {/* Suelo */}
            <line x1="30" y1="180" x2="270" y2="180" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-600" />
            
            {/* Silueta Sentadilla */}
            <g className="transition-all duration-300">
              {/* Cabeza con mirada al frente */}
              <circle cx="150" cy={posturePhase === 'setup' ? '45' : '75'} r="16" className="fill-teal-600 dark:fill-teal-400" />
              {/* Mirada */}
              <line x1="150" y1={posturePhase === 'setup' ? '45' : '75'} x2="175" y2={posturePhase === 'setup' ? '45' : '75'} stroke="#10b981" strokeWidth="2" strokeDasharray="2 2" />
              
              {/* Torso / Columna Neutra (Línea verde de postura segura) */}
              <line
                x1="150"
                y1={posturePhase === 'setup' ? '61' : '91'}
                x2={posturePhase === 'setup' ? '150' : '135'}
                y2={posturePhase === 'setup' ? '110' : '130'}
                stroke="#10b981"
                strokeWidth="7"
                strokeLinecap="round"
              />
              
              {/* Brazos de contrapeso al frente */}
              <line
                x1="150"
                y1={posturePhase === 'setup' ? '70' : '100'}
                x2="185"
                y2={posturePhase === 'setup' ? '85' : '105'}
                stroke="currentColor"
                strokeWidth="5"
                strokeLinecap="round"
                className="text-zinc-700 dark:text-zinc-300"
              />

              {/* Muslos / Fémur (Ángulo de flexión) */}
              <line
                x1={posturePhase === 'setup' ? '150' : '135'}
                y1={posturePhase === 'setup' ? '110' : '130'}
                x2={posturePhase === 'setup' ? '150' : '170'}
                y2={posturePhase === 'setup' ? '145' : '132'}
                stroke="currentColor"
                strokeWidth="8"
                strokeLinecap="round"
                className="text-teal-700 dark:text-teal-300"
              />

              {/* Pantorrillas / Tibia */}
              <line
                x1={posturePhase === 'setup' ? '150' : '170'}
                y1={posturePhase === 'setup' ? '145' : '132'}
                x2={posturePhase === 'setup' ? '150' : '165'}
                y2="180"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                className="text-zinc-700 dark:text-zinc-300"
              />

              {/* Pie firme en el suelo */}
              <line x1={posturePhase === 'setup' ? '140' : '155'} y1="180" x2={posturePhase === 'setup' ? '165' : '185'} y2="180" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-zinc-900 dark:text-zinc-100" />
            </g>

            {/* Guías visuales de alineación biomecánica */}
            <g className="text-[10px] font-bold">
              <rect x="180" y="35" width="105" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="186" y="51" className="fill-emerald-800 dark:fill-emerald-200">✓ Mirada al frente</text>

              <rect x="10" y="100" width="115" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="16" y="116" className="fill-emerald-800 dark:fill-emerald-200">✓ Espalda 100% recta</text>

              <rect x="180" y="145" width="110" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="186" y="161" className="fill-emerald-800 dark:fill-emerald-200">✓ Rodillas a ~90°</text>
            </g>
          </svg>
        );

      case MovementType.PUSH_HORIZONTAL:
        return (
          <svg viewBox="0 0 300 200" className="w-full h-44 sm:h-52 select-none" aria-label="Postura de Flexiones">
            {/* Suelo */}
            <line x1="20" y1="175" x2="280" y2="175" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-600" />
            
            <g className="transition-all duration-300">
              {/* Pies de apoyo */}
              <circle cx="50" cy="168" r="6" className="fill-zinc-700 dark:fill-zinc-300" />

              {/* Cuerpo completo en tabla recta (Línea de alineación verde) */}
              <line
                x1="50"
                y1="168"
                x2="210"
                y2={posturePhase === 'setup' ? '120' : '155'}
                stroke="#10b981"
                strokeWidth="8"
                strokeLinecap="round"
              />

              {/* Cabeza alineada con columna */}
              <circle
                cx="225"
                cy={posturePhase === 'setup' ? '114' : '150'}
                r="14"
                className="fill-teal-600 dark:fill-teal-400"
              />

              {/* Brazo y codo a 45° */}
              <line
                x1="195"
                y1={posturePhase === 'setup' ? '125' : '156'}
                x2={posturePhase === 'setup' ? '195' : '180'}
                y2={posturePhase === 'setup' ? '150' : '160'}
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className="text-teal-700 dark:text-teal-300"
              />
              <line
                x1={posturePhase === 'setup' ? '195' : '180'}
                y1={posturePhase === 'setup' ? '150' : '160'}
                x2="195"
                y2="175"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                className="text-zinc-800 dark:text-zinc-200"
              />
              {/* Mano plana en suelo */}
              <line x1="188" y1="175" x2="204" y2="175" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-zinc-900 dark:text-zinc-100" />
            </g>

            {/* Etiquetas biomecánicas */}
            <g className="text-[10px] font-bold">
              <rect x="25" y="30" width="135" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="31" y="46" className="fill-emerald-800 dark:fill-emerald-200">✓ Cuerpo recto como tabla</text>

              <rect x="175" y="30" width="115" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="181" y="46" className="fill-emerald-800 dark:fill-emerald-200">✓ Codos a 45° (no a 90°)</text>
            </g>
          </svg>
        );

      case MovementType.HINGE:
        return (
          <svg viewBox="0 0 300 200" className="w-full h-44 sm:h-52 select-none" aria-label="Postura de Peso Muerto / Bisagra">
            {/* Suelo */}
            <line x1="30" y1="180" x2="270" y2="180" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-600" />

            {/* Cabeza */}
            <circle cx={posturePhase === 'setup' ? '170' : '190'} cy={posturePhase === 'setup' ? '50' : '90'} r="15" className="fill-teal-600 dark:fill-teal-400" />

            {/* Columna Neutra / Espalda Recta (Bisagra de Cadera) */}
            <line
              x1={posturePhase === 'setup' ? '168' : '185'}
              y1={posturePhase === 'setup' ? '65' : '102'}
              x2={posturePhase === 'setup' ? '150' : '120'}
              y2={posturePhase === 'setup' ? '115' : '125'}
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
            />

            {/* Piernas con flexión suave de rodilla */}
            <line
              x1={posturePhase === 'setup' ? '150' : '120'}
              y1={posturePhase === 'setup' ? '115' : '125'}
              x2={posturePhase === 'setup' ? '152' : '140'}
              y2="150"
              stroke="currentColor"
              strokeWidth="7"
              strokeLinecap="round"
              className="text-zinc-700 dark:text-zinc-300"
            />
            <line x1={posturePhase === 'setup' ? '152' : '140'} y1="150" x2="148" y2="180" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-zinc-800 dark:text-zinc-200" />

            {/* Brazos verticales sosteniendo el peso cerca de las tibias */}
            <line
              x1={posturePhase === 'setup' ? '165' : '170'}
              y1={posturePhase === 'setup' ? '75' : '108'}
              x2="165"
              y2={posturePhase === 'setup' ? '120' : '160'}
              stroke="#0d9488"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Peso / Botellas / Mochila */}
            <circle cx="165" cy={posturePhase === 'setup' ? '122' : '162'} r="8" className="fill-amber-500 stroke-amber-700 stroke-2" />

            {/* Guías */}
            <g className="text-[10px] font-bold">
              <rect x="15" y="40" width="135" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="21" y="56" className="fill-emerald-800 dark:fill-emerald-200">✓ Cadera empuja atrás</text>

              <rect x="15" y="70" width="135" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="21" y="86" className="fill-emerald-800 dark:fill-emerald-200">✓ Peso pegado a piernas</text>
            </g>
          </svg>
        );

      case MovementType.PUSH_VERTICAL:
        return (
          <svg viewBox="0 0 300 200" className="w-full h-44 sm:h-52 select-none" aria-label="Postura de Press de Hombros">
            {/* Suelo */}
            <line x1="40" y1="180" x2="260" y2="180" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-600" />

            {/* Cabeza */}
            <circle cx="150" cy="70" r="16" className="fill-teal-600 dark:fill-teal-400" />

            {/* Torso vertical alineado (sin arquear lumbares) */}
            <line x1="150" y1="86" x2="150" y2="135" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />

            {/* Piernas estables */}
            <line x1="150" y1="135" x2="138" y2="180" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-zinc-700 dark:text-zinc-300" />
            <line x1="150" y1="135" x2="162" y2="180" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-zinc-700 dark:text-zinc-300" />

            {/* Brazos empujando verticalmente */}
            <line
              x1="150"
              y1="95"
              x2={posturePhase === 'setup' ? '125' : '135'}
              y2={posturePhase === 'setup' ? '90' : '40'}
              stroke="#0d9488"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <line
              x1="150"
              y1="95"
              x2={posturePhase === 'setup' ? '175' : '165'}
              y2={posturePhase === 'setup' ? '90' : '40'}
              stroke="#0d9488"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Pesos en manos */}
            <circle cx={posturePhase === 'setup' ? '125' : '135'} cy={posturePhase === 'setup' ? '86' : '36'} r="8" className="fill-amber-500" />
            <circle cx={posturePhase === 'setup' ? '175' : '165'} cy={posturePhase === 'setup' ? '86' : '36'} r="8" className="fill-amber-500" />

            {/* Guías */}
            <g className="text-[10px] font-bold">
              <rect x="180" y="30" width="110" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="186" y="46" className="fill-emerald-800 dark:fill-emerald-200">✓ Empuje vertical</text>

              <rect x="10" y="100" width="125" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="16" y="116" className="fill-emerald-800 dark:fill-emerald-200">✓ Abdomen apretado</text>
            </g>
          </svg>
        );

      case MovementType.PULL_HORIZONTAL:
      case MovementType.PULL_VERTICAL:
        return (
          <svg viewBox="0 0 300 200" className="w-full h-44 sm:h-52 select-none" aria-label="Postura de Remo">
            {/* Suelo */}
            <line x1="30" y1="180" x2="270" y2="180" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-600" />

            {/* Cabeza */}
            <circle cx="190" cy="85" r="15" className="fill-teal-600 dark:fill-teal-400" />

            {/* Espalda plana inclinada a 45° */}
            <line x1="185" y1="95" x2="135" y2="125" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />

            {/* Piernas */}
            <line x1="135" y1="125" x2="140" y2="180" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-zinc-700 dark:text-zinc-300" />

            {/* Brazo tirando hacia la cadera */}
            <line
              x1="170"
              y1="102"
              x2={posturePhase === 'setup' ? '170' : '150'}
              y2={posturePhase === 'setup' ? '155' : '110'}
              stroke="#0d9488"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <circle cx={posturePhase === 'setup' ? '170' : '150'} cy={posturePhase === 'setup' ? '158' : '112'} r="8" className="fill-amber-500" />

            {/* Guías */}
            <g className="text-[10px] font-bold">
              <rect x="20" y="35" width="135" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="26" y="51" className="fill-emerald-800 dark:fill-emerald-200">✓ Codo viaja a la costilla</text>
              <rect x="20" y="65" width="135" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="26" y="81" className="fill-emerald-800 dark:fill-emerald-200">✓ Espalda neutra 45°</text>
            </g>
          </svg>
        );

      case MovementType.CORE_ANTI_EXTENSION:
      case MovementType.CORE_ANTI_ROTATION:
      case MovementType.CORE_FLEXION:
        return (
          <svg viewBox="0 0 300 200" className="w-full h-44 sm:h-52 select-none" aria-label="Postura de Plancha / Core">
            {/* Suelo */}
            <line x1="20" y1="175" x2="280" y2="175" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-600" />

            {/* Pies */}
            <circle cx="50" cy="170" r="5" className="fill-zinc-700 dark:fill-zinc-300" />

            {/* Línea horizontal perfecta de la plancha */}
            <line x1="50" y1="170" x2="220" y2="150" stroke="#10b981" strokeWidth="9" strokeLinecap="round" />

            {/* Cabeza neutra */}
            <circle cx="235" cy="145" r="14" className="fill-teal-600 dark:fill-teal-400" />

            {/* Antebrazo apoyado en suelo */}
            <line x1="205" y1="152" x2="205" y2="175" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-zinc-800 dark:text-zinc-200" />
            <line x1="205" y1="175" x2="230" y2="175" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-teal-600" />

            {/* Guías */}
            <g className="text-[10px] font-bold">
              <rect x="40" y="45" width="140" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="46" y="61" className="fill-emerald-800 dark:fill-emerald-200">✓ Glúteos y abdomen duros</text>
              <rect x="40" y="75" width="140" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="46" y="91" className="fill-emerald-800 dark:fill-emerald-200">✓ No dejes caer la cadera</text>
            </g>
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 300 200" className="w-full h-44 sm:h-52 select-none" aria-label="Postura atlética guiada">
            <line x1="30" y1="180" x2="270" y2="180" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" className="text-zinc-400 dark:text-zinc-600" />
            <circle cx="150" cy="55" r="16" className="fill-teal-600 dark:fill-teal-400" />
            <line x1="150" y1="71" x2="150" y2="125" stroke="#10b981" strokeWidth="8" strokeLinecap="round" />
            <line x1="150" y1="125" x2="135" y2="180" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-zinc-700 dark:text-zinc-300" />
            <line x1="150" y1="125" x2="165" y2="180" stroke="currentColor" strokeWidth="7" strokeLinecap="round" className="text-zinc-700 dark:text-zinc-300" />
            <line x1="150" y1="85" x2="120" y2="110" stroke="#0d9488" strokeWidth="6" strokeLinecap="round" />
            <line x1="150" y1="85" x2="180" y2="110" stroke="#0d9488" strokeWidth="6" strokeLinecap="round" />
            <g className="text-[10px] font-bold">
              <rect x="20" y="30" width="120" height="24" rx="6" className="fill-emerald-100 dark:fill-emerald-950/80 stroke-emerald-400 stroke-1" />
              <text x="26" y="46" className="fill-emerald-800 dark:fill-emerald-200">✓ Control biomecánico</text>
            </g>
          </svg>
        );
    }
  };

  return (
    <div
      id={`posture-visualizer-${exerciseId}`}
      className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 overflow-hidden shadow-xs"
    >
      {/* Barra de pestañas superiores */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-950/50 p-1.5 sm:p-2 gap-1 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('posture')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'posture'
              ? 'bg-white dark:bg-zinc-800 text-teal-700 dark:text-teal-300 shadow-xs border border-zinc-200/80 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Postura y Técnica</span>
        </button>

        {/* Pestaña adaptaciones caseras sin pesas */}
        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'home'
              ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 shadow-xs border border-amber-300 dark:border-amber-700'
              : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
          }`}
        >
          <Home className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>🏠 ¿Sin Pesas en Casa?</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('breathing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
            activeTab === 'breathing'
              ? 'bg-white dark:bg-zinc-800 text-teal-700 dark:text-teal-300 shadow-xs border border-zinc-200/80 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Wind className="w-3.5 h-3.5 text-sky-500" />
          <span>Respiración & Errores</span>
        </button>
      </div>

      {/* CONTENIDO 1: POSTURA Y TÉCNICA VISUAL */}
      {activeTab === 'posture' && (
        <div className="p-4 sm:p-5 space-y-4 animate-fadeIn">
          {/* Ilustración de Postura con Guías Biomecánicas */}
          <div className="relative rounded-xl bg-gradient-to-b from-teal-500/5 via-zinc-100/50 to-transparent dark:from-teal-950/20 dark:via-zinc-900 dark:to-transparent border border-zinc-200/70 dark:border-zinc-800 p-3 flex flex-col items-center justify-center">
            {/* Diagrama SVG */}
            {renderPostureSVG()}

            {/* Selector de Fase de la Postura */}
            <div className="mt-2 flex items-center justify-center gap-1.5 bg-white/90 dark:bg-zinc-800/90 p-1 rounded-xl border border-zinc-200 dark:border-zinc-700 shadow-xs">
              <button
                type="button"
                onClick={() => setPosturePhase('setup')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  posturePhase === 'setup'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                1. Posición Inicial
              </button>
              <button
                type="button"
                onClick={() => setPosturePhase('execution')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  posturePhase === 'execution'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                2. En Movimiento
              </button>
              <button
                type="button"
                onClick={() => setPosturePhase('lockout')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                  posturePhase === 'lockout'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900'
                }`}
              >
                3. Retorno
              </button>
            </div>
          </div>

          {/* Explicación en Lenguaje Sencillo (Paso a Paso Fácil) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Cómo ejecutarlo paso a paso (Técnica Clara)</span>
            </h4>

            {instructions && instructions.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                {instructions.slice(0, 3).map((inst, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-1"
                  >
                    <span className="w-5 h-5 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-300 font-bold text-[10px] flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <strong className="text-zinc-900 dark:text-zinc-100 block font-semibold text-xs">
                      {inst.title}
                    </strong>
                    <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                      {inst.description}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-600 dark:text-zinc-300">
                Mantén el pecho erguido, contrae el abdomen y realiza el movimiento a velocidad constante sin tirones bruscos.
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTENIDO 2: ADAPTACIÓN CASERA SIN IMPLEMENTOS */}
      {activeTab === 'home' && (
        <div className="p-4 sm:p-5 space-y-4 animate-fadeIn">
          {/* Banner introductorio para casa */}
          <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shrink-0">
              🏠
            </div>
            <div className="space-y-1">
              <h4 className="text-xs sm:text-sm font-black text-amber-950 dark:text-amber-100">
                ¿No tienes pesas o mancuernas en casa? ¡No te preocupes!
              </h4>
              <p className="text-[11px] sm:text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                FitAdapt te da 2 alternativas inmediatas para entrenar hoy con lo que tienes a mano: usando un objeto cotidiano de casa o 100% con tu peso corporal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Opción 1: Objeto de Casa */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/80 dark:bg-zinc-800/50 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-200 font-black text-[10px] uppercase">
                  Opción 1: Objeto Casero
                </span>
              </div>
              <h5 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>🎒</span> {homeSub.householdItem.name}
              </h5>
              <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 leading-relaxed">
                <p>
                  <strong className="text-zinc-800 dark:text-zinc-200">Peso orientativo:</strong>{' '}
                  {homeSub.householdItem.weightGuidance}
                </p>
                <p>
                  <strong className="text-zinc-800 dark:text-zinc-200">Cómo sujetarlo:</strong>{' '}
                  {homeSub.householdItem.instructions}
                </p>
                <p className="text-[11px] text-amber-700 dark:text-amber-300 font-medium">
                  ⚠️ {homeSub.householdItem.safetyTip}
                </p>
              </div>
            </div>

            {/* Opción 2: 100% Peso Corporal (Sin nada) */}
            <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800 bg-teal-50/40 dark:bg-teal-950/30 space-y-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200 font-black text-[10px] uppercase">
                  Opción 2: 100% Peso Corporal
                </span>
              </div>
              <h5 className="font-bold text-sm text-teal-950 dark:text-teal-100 flex items-center gap-1.5">
                <span>🤸</span> {homeSub.zeroEquipmentBodyweight.name}
              </h5>
              <div className="text-xs text-zinc-600 dark:text-zinc-300 space-y-1.5 leading-relaxed">
                <p>
                  <strong className="text-zinc-800 dark:text-zinc-200">Cómo hacerlo:</strong>{' '}
                  {homeSub.zeroEquipmentBodyweight.instructions}
                </p>
                <p>
                  <strong className="text-zinc-800 dark:text-zinc-200">Por qué funciona igual:</strong>{' '}
                  {homeSub.zeroEquipmentBodyweight.biomechanicalWhy}
                </p>
                <p className="text-[11px] text-teal-700 dark:text-teal-300 font-medium">
                  ⏱️ <strong>Ritmo recomendado:</strong> {homeSub.zeroEquipmentBodyweight.tempoTip}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO 3: RESPIRACIÓN Y QUÉ NO HACER */}
      {activeTab === 'breathing' && (
        <div className="p-4 sm:p-5 space-y-4 animate-fadeIn text-xs">
          {/* Respiración */}
          <div className="p-3.5 rounded-xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800 space-y-1.5">
            <div className="flex items-center gap-2 text-sky-800 dark:text-sky-200 font-bold">
              <Wind className="w-4 h-4 text-sky-600 dark:text-sky-400" />
              <span>Regla de Oro de la Respiración</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-700 dark:text-zinc-300 pt-1">
              <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-sky-100 dark:border-sky-900">
                <strong className="text-sky-700 dark:text-sky-300 block">1. Al bajar o preparar (Inhala):</strong>
                <span>Toma aire por la nariz inflando el abdomen para proteger tu columna lumbar.</span>
              </div>
              <div className="p-2 rounded-lg bg-white/80 dark:bg-zinc-800/80 border border-sky-100 dark:border-sky-900">
                <strong className="text-sky-700 dark:text-sky-300 block">2. Al empujar o subir (Exhala):</strong>
                <span>Bota el aire por la boca con fuerza mientras realizas el esfuerzo principal.</span>
              </div>
            </div>
          </div>

          {/* Errores comunes */}
          <div className="space-y-2">
            <span className="font-bold text-zinc-800 dark:text-zinc-200 block uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Errores frecuentes que debes evitar:</span>
            </span>
            <ul className="space-y-1.5 text-zinc-600 dark:text-zinc-400 pl-1">
              {commonMistakes && commonMistakes.length > 0 ? (
                commonMistakes.map((mistake, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>{mistake}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>No arquees la zona lumbar al final del movimiento.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold shrink-0">✕</span>
                    <span>No dejes que las rodillas se junten o colapsen hacia adentro.</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Pie del visualizador con aviso de seguridad */}
      <div className="px-4 py-2 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Postura y adaptación biomecánica FitAdapt</span>
        </span>
        <span className="font-medium text-teal-600 dark:text-teal-400">
          {primaryMuscle || bodyArea || 'Todo el cuerpo'}
        </span>
      </div>
    </div>
  );
}
