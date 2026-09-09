/**
 * FitAdapt - Tipos y Modelos de Ejercicio
 * FASE 1: Arquitectura y Modelos Base
 */

import { FitnessGoal, FitnessLevel, TrainingLocation, AnyEquipment } from './user';

export enum ExerciseCategory {
  // Categorías FASE 4
  CARDIO = 'CARDIO',
  STRENGTH = 'STRENGTH',
  TONING = 'TONING',
  MOBILITY = 'MOBILITY',
  FULL_BODY = 'FULL_BODY',
  LOW_IMPACT = 'LOW_IMPACT',

  // Alias para retrocompatibilidad con FASE 1-3
  MOBILITY_ACTIVATION = 'MOBILITY',
  STRENGTH_RESISTANCE = 'STRENGTH',
  CARDIOVASCULAR = 'CARDIO',
  CORE_STABILITY = 'TONING',
  STRETCH_COOLDOWN = 'MOBILITY',
}

export enum MovementType {
  SQUAT = 'SQUAT',             // Dominante de rodilla / Sentadilla
  HINGE = 'HINGE',             // Dominante de cadera / Bisagra
  LUNGE = 'LUNGE',             // Unilateral / Zancada
  PUSH_HORIZONTAL = 'PUSH_HORIZONTAL', // Empuje horizontal (ej. flexión)
  PUSH_VERTICAL = 'PUSH_VERTICAL',     // Empuje vertical (ej. press hombros)
  PULL_HORIZONTAL = 'PULL_HORIZONTAL', // Tracción horizontal (ej. remo)
  PULL_VERTICAL = 'PULL_VERTICAL',     // Tracción vertical (ej. jalón o dominada)
  CORE_ANTI_EXTENSION = 'CORE_ANTI_EXTENSION', // Plancha
  CORE_ANTI_ROTATION = 'CORE_ANTI_ROTATION',   // Press Pallof
  CORE_FLEXION = 'CORE_FLEXION',               // Crunch controlado
  LOCOMOTION_CARDIO = 'LOCOMOTION_CARDIO',     // Carrera, jumping jacks, pasos
  MOBILITY_DYNAMIC = 'MOBILITY_DYNAMIC',       // Movilidad articular
}

export enum BodyArea {
  // Zonas FASE 4
  FULL_BODY = 'Full body',
  LEGS = 'Legs',
  GLUTES = 'Glutes',
  CORE = 'Core',
  CHEST = 'Chest',
  BACK = 'Back',
  SHOULDERS = 'Shoulders',
  ARMS = 'Arms',
  MOBILITY = 'Mobility',

  // Retrocompatibilidad FASE 1
  UPPER_BODY = 'UPPER_BODY',
  LOWER_BODY = 'LOWER_BODY',
}

/**
 * Equipamiento estandarizado FASE 4
 */
export enum ExerciseEquipment {
  NONE = 'None',
  MAT = 'Mat',
  RESISTANCE_BAND = 'Resistance band',
  DUMBBELLS = 'Dumbbells',
  KETTLEBELL = 'Kettlebell',
  BENCH = 'Bench',
  BARBELL = 'Barbell',
  CABLE = 'Cable',
  MACHINE = 'Machine',
  TREADMILL = 'Treadmill',
  BIKE = 'Bike',
  ELLIPTICAL = 'Elliptical',
}

/**
 * Articulaciones y Zonas de Limitación FASE 4
 */
export enum JointLimitationArea {
  KNEE = 'Knee',
  ANKLE = 'Ankle',
  HIP = 'Hip',
  LOWER_BACK = 'LowerBack',
  UPPER_BACK = 'UpperBack',
  SHOULDER = 'Shoulder',
  ELBOW = 'Elbow',
  WRIST = 'Wrist',
  NECK = 'Neck',
}

export type JointLimitationStatus = 'COMPATIBLE' | 'REQUIRES_MODIFICATION' | 'NOT_RECOMMENDED';

export interface JointLimitationEffect {
  status: JointLimitationStatus;
  notes?: string;
  modificationGuidance?: string;
}

export type ExerciseLimitationMap = Record<JointLimitationArea, JointLimitationEffect>;

export enum MuscleGroup {
  // Tren inferior
  QUADRICEPS = 'QUADRICEPS',
  HAMSTRINGS = 'HAMSTRINGS',
  GLUTES = 'GLUTES',
  CALVES = 'CALVES',
  ADDUCTORS_ABDUCTORS = 'ADDUCTORS_ABDUCTORS',

  // Tren superior
  CHEST = 'CHEST',
  LATS_UPPER_BACK = 'LATS_UPPER_BACK',
  SHOULDERS_DELTOIDS = 'SHOULDERS_DELTOIDS',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  TRAPEZIUS_RHOMBOIDS = 'TRAPEZIUS_RHOMBOIDS',

  // Zona media
  RECTUS_ABDOMINIS = 'RECTUS_ABDOMINIS',
  OBLIQUES = 'OBLIQUES',
  TRANSVERSE_ABDOMINIS = 'TRANSVERSE_ABDOMINIS',
  LOWER_BACK_ERECTORS = 'LOWER_BACK_ERECTORS',

  // General
  CARDIOVASCULAR_SYSTEM = 'CARDIOVASCULAR_SYSTEM',
}

export enum ImpactLevel {
  LOW = 'LOW',       // Cero o mínimo impacto en articulaciones (sin saltos)
  MEDIUM = 'MEDIUM', // Impacto controlado (apoyo alternado suave)
  HIGH = 'HIGH',     // Alto impacto (saltos, rebotes, desaceleraciones bruscas)
}

export enum IntensityLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface ExerciseInstructionStep {
  stepNumber: number;
  title: string;
  description: string;
  keyCues?: string[]; // Pautas clave (ej. "Mantén el pecho erguido")
}

export interface ExerciseModificationSpec {
  exerciseId?: string; // ID de un ejercicio alternativo si existe
  title: string;
  description: string;
  howToPerform: string;
}

export interface ExerciseAlternative {
  exerciseId?: string; // ID que apunta al ejercicio sustituto en la biblioteca
  name: string;
  description: string;
  howToPerform: string;
}

export interface Exercise {
  id: string;
  name: string;
  slug: string;
  description: string;
  
  // Categorización y objetivos (FASE 4: permite pertenecer a múltiples categorías)
  category: ExerciseCategory;
  categories: ExerciseCategory[];
  goalCompatibility: FitnessGoal[];
  primaryGoal: FitnessGoal;
  secondaryGoals: FitnessGoal[];
  fitnessLevel: FitnessLevel;
  targetLevel: FitnessLevel;
  minLevelAllowed: FitnessLevel;
  
  // Biomecánica y zonas corporales
  movementType: MovementType;
  bodyArea: BodyArea;
  primaryMuscle: MuscleGroup | string;
  secondaryMuscles: (MuscleGroup | string)[];
  
  // Entorno y equipamiento
  equipment: ExerciseEquipment[];
  requiredEquipment: AnyEquipment[];
  location: TrainingLocation[];
  compatibleLocations: TrainingLocation[];
  
  // Parámetros fisiológicos y de carga
  impactLevel: ImpactLevel;
  impact: ImpactLevel; // Alias retrocompatibilidad
  intensity: IntensityLevel;
  defaultDuration: number; // Duración recomendada en segundos
  defaultDurationSeconds?: number;
  defaultReps: number | { min: number; max: number };
  defaultSets: number;
  defaultRest: number; // Descanso recomendado en segundos
  defaultRestSeconds: number;
  
  // Guía técnica y educativa
  instructions: ExerciseInstructionStep[];
  commonMistakes: string[];
  
  // Seguridad y limitaciones (Prioridad del Motor)
  contraindications: string[];
  incompatibleLimitations: string[]; // Nombres amigables / descriptivos
  incompatibleLimitationCodes: string[]; // Códigos de máquina ej. ['KNEE_SENSITIVITY']
  warningNotes?: string;
  limitationProfile: ExerciseLimitationMap;
  
  // Variaciones adaptativas y alternativas estructuradas FASE 4
  alternativeExerciseIds: string[];
  lowImpactAlternative?: ExerciseAlternative;
  lowImpactVersion?: ExerciseModificationSpec;
  noEquipmentAlternative?: ExerciseAlternative;
  noEquipmentVersion?: ExerciseModificationSpec;
}
