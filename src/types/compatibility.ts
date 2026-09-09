/**
 * FitAdapt - Motor de Personalización y Compatibilidad (Especificación de Tipos)
 * FASE 5: Motor de Reglas, Scoring y Alternativas
 */

import { Exercise, ExerciseAlternative, ImpactLevel, IntensityLevel, JointLimitationArea } from './exercise';
import { UserProfile, FitnessGoal, FitnessLevel, TrainingLocation, PhysicalLimitation, BodyMorphology } from './user';

/**
 * Estados de clasificación de compatibilidad requeridos
 */
export enum CompatibilityStatus {
  COMPATIBLE = 'COMPATIBLE',
  COMPATIBLE_WITH_MODIFICATION = 'COMPATIBLE_WITH_MODIFICATION',
  NOT_RECOMMENDED = 'NOT_RECOMMENDED',
}

/**
 * Jerarquía estricta de prioridades del motor (1: Máxima -> 9: Secundaria)
 */
export enum RulePriority {
  SAFETY_LIMITATIONS = 1,  // Prioridad 1: Seguridad / Limitaciones físicas (Crítica y no anulable)
  FITNESS_LEVEL = 2,       // Prioridad 2: Nivel técnico del usuario
  EQUIPMENT = 3,           // Prioridad 3: Equipamiento disponible y sustituciones
  LOCATION = 4,            // Prioridad 4: Lugar de entrenamiento (HOME / GYM)
  GOAL_ALIGNMENT = 5,      // Prioridad 5: Objetivo primario y secundarios
  TIME_CONSTRAINTS = 6,    // Prioridad 6: Tiempo y duración
  INTENSITY_FIT = 7,       // Prioridad 7: Intensidad fisiológica
  PREFERENCES = 8,         // Prioridad 8: Preferencias de entrenamiento
  BODY_MORPHOLOGY = 9,     // Prioridad 9: Morfología corporal (Variable secundaria no diagnóstica)
}

/**
 * Tipos de reglas atómicas evaluadas
 */
export enum RuleType {
  LIMITATION_SAFETY = 'LIMITATION_SAFETY',       // Prioridad 1
  IMPACT_SAFETY = 'IMPACT_SAFETY',               // Prioridad 1
  FITNESS_LEVEL = 'FITNESS_LEVEL',               // Prioridad 2
  EQUIPMENT_AVAILABILITY = 'EQUIPMENT_AVAILABILITY', // Prioridad 3
  LOCATION_MATCH = 'LOCATION_MATCH',             // Prioridad 4
  GOAL_ALIGNMENT = 'GOAL_ALIGNMENT',             // Prioridad 5
  TIME_CONSTRAINTS = 'TIME_CONSTRAINTS',         // Prioridad 6
  INTENSITY_FIT = 'INTENSITY_FIT',               // Prioridad 7
  USER_PREFERENCES = 'USER_PREFERENCES',         // Prioridad 8
  BODY_MORPHOLOGY = 'BODY_MORPHOLOGY',           // Prioridad 9
}

/**
 * Detalle atómico de evaluación por regla
 */
export interface RuleEvaluationDetail {
  ruleType: RuleType;
  priority: RulePriority;
  passed: boolean;
  isHardFilter: boolean; // Si es true y falla, descalifica irrevocablemente a NOT_RECOMMENDED
  scoreContribution: number; // Puntos aportados al scoring global
  maxScorePossible: number;
  message: string;
  suggestedModification?: string;
  triggeringLimitation?: PhysicalLimitation;
  affectedJointArea?: JointLimitationArea;
}

/**
 * Desglose transparente del sistema de scoring determinista (0 a 100)
 */
export interface ScoreBreakdown {
  safety: number;         // 100% de cumplimiento o 0 si viola seguridad
  goal: number;           // 0 a 30 puntos
  level: number;          // 0 a 20 puntos
  equipment: number;      // 0 a 20 puntos
  location: number;       // 0 a 10 puntos
  time: number;           // 0 a 5 puntos
  intensity: number;      // 0 a 5 puntos
  preferences: number;    // 0 a 6 puntos
  morphology: number;     // 0 a 4 puntos (ajuste biomecánico sutil, nunca diagnóstico)
  modificationsPenalty: number; // Ej. -10 o -15 cuando requiere sustitución o ajuste
  total: number;          // Total neto de 0 a 100
}

/**
 * Recomendación de alternativa cuando un ejercicio no es apto o requiere modificación
 */
export interface AlternativeRecommendation {
  exerciseId: string;
  exerciseName: string;
  substitutionType: 'LOW_IMPACT' | 'NO_EQUIPMENT' | 'EQUIPMENT_EQUIVALENT' | 'LEVEL_REGRESSION' | 'BIOMECHANICAL_EQUIVALENT';
  reason: string;
  howToPerform: string;
  exercise?: Exercise;
}

/**
 * Resultado completo de la evaluación de compatibilidad de un ejercicio
 */
export interface CompatibilityEvaluationResult {
  exerciseId: string;
  exerciseName: string;
  status: CompatibilityStatus;
  overallScore: number; // 0 a 100
  hardFilterFailed: boolean;
  
  // Explicaciones estructuradas
  reasons: string[];
  safetyNotes: string[];
  modificationNotes: string[];
  ruleDetails: RuleEvaluationDetail[];
  scoreBreakdown: ScoreBreakdown;
  
  // Alternativa recomendada si es NOT_RECOMMENDED o COMPATIBLE_WITH_MODIFICATION
  suggestedAlternative?: AlternativeRecommendation;

  // Formato de adaptación para UI y retrocompatibilidad FASE 1-4
  suggestedAdaptation?: {
    type: 'LOW_IMPACT' | 'NO_EQUIPMENT' | 'ALTERNATIVE_EXERCISE' | 'INTENSITY_REDUCTION';
    title: string;
    description: string;
    alternativeExerciseId?: string;
  };
}

export interface CompatibilityEngineInput {
  exercise: Exercise;
  userProfile: UserProfile;
  exerciseLibrary?: Exercise[];
}

export interface CompatibilityBatchReport {
  evaluatedCount: number;
  compatibleCount: number;
  compatibleWithModificationCount: number;
  notRecommendedCount: number;
  averageScore: number;
  results: CompatibilityEvaluationResult[];
}

