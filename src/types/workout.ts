/**
 * FitAdapt - Modelos de Entrenamiento, Rutinas y Sesiones
 * FASE 1: Arquitectura y Modelos Base
 */

import { FitnessGoal, FitnessLevel, TrainingLocation, UserProfile } from './user';
import { Exercise } from './exercise';

export enum WorkoutStructureSection {
  WARMUP = 'WARMUP',
  MAIN_BLOCK = 'MAIN_BLOCK',
  FINISHER = 'FINISHER',
  COOLDOWN = 'COOLDOWN',
}

export interface WorkoutExercise {
  exerciseId: string;
  order: number;
  orderIndex: number; // Alias para compatibilidad con FASE 1
  sets: number;
  targetSets: number; // Alias para compatibilidad
  reps?: number | { min: number; max: number } | string;
  targetReps?: number | { min: number; max: number }; // Alias
  duration?: number; // Duración objetivo en segundos
  targetDurationSeconds?: number; // Alias
  rest: number; // Descanso tras el ejercicio en segundos
  restSecondsAfter: number; // Alias
  intensity?: 'LOW' | 'MEDIUM' | 'HIGH';
  notes?: string;
  modification?: string; // Pauta biomecánica aplicada si fue adaptado
  appliedModificationNotes?: string; // Alias
  alternativeExerciseId?: string; // ID de ejercicio alternativo recomendado

  // Metadatos biomecánicos
  exerciseSnapshot: Exercise; // Snapshot inmutable del ejercicio
  section: WorkoutStructureSection;
  wasAdapted: boolean;
  adaptationReason?: string;
  originalExerciseId?: string;
}

export interface WorkoutMuscleBalance {
  lowerBody: number; // Porcentaje o conteo de ejercicios
  upperBody: number;
  core: number;
  cardio: number;
  mobility: number;
}

export interface WorkoutMetadata {
  generatedAt: string;
  primaryGoal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  durationMinutes: number;
  location: TrainingLocation;
  equipmentUsed: string[];
  limitationsConsidered: string[];
  totalExercisesCount: number;
  warmupExercisesCount: number;
  mainWorkoutExercisesCount: number;
  cooldownExercisesCount: number;
  finisherExercisesCount: number;
  hasModifications: boolean;
  intensity: 'LOW' | 'MEDIUM' | 'HIGH';
  generationSeed: number | string;
  balanceDistribution: WorkoutMuscleBalance;
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  goal: FitnessGoal;
  fitnessLevel: FitnessLevel;
  location: TrainingLocation;
  estimatedDurationMinutes: number;
  exercises: WorkoutExercise[];
  tags: string[];
  metadata?: WorkoutMetadata;
  
  // Secciones segmentadas para renderizado y acceso directo
  warmup: WorkoutExercise[];
  mainWorkout: WorkoutExercise[];
  finisher?: WorkoutExercise[];
  cooldown: WorkoutExercise[];
}

export interface WorkoutGenerationRequest {
  userProfile: UserProfile;
  targetDurationMinutes?: number; // 15 | 20 | 30 | 45 | 60
  targetIntensity?: 'LOW' | 'MEDIUM' | 'HIGH';
  targetGoal?: FitnessGoal;
  allowFinisher?: boolean;
  seed?: number | string;
  excludedExerciseIds?: string[];
  lockedExerciseIds?: string[];
}

export interface WorkoutGenerationResult {
  success: boolean;
  workout: Workout;
  metadata: WorkoutMetadata;
  warnings: string[];
  appliedModifications: Array<{
    exerciseId: string;
    exerciseName: string;
    modificationNotes: string;
  }>;
  candidatePoolSize: number;
  disqualifiedExercisesCount: number;
  executionTimeMs: number;
}

export enum WorkoutPlanStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export type CalendarDayStatus = 'UPCOMING' | 'TODAY' | 'COMPLETED' | 'MISSED' | 'REST';

export interface WorkoutPlanDay {
  dayOfWeek: number; // 1 (Lunes) a 7 (Domingo)
  isRestDay: boolean;
  focusArea?: string; // ej. 'Tren Inferior + Core', 'Full Body Suave'
  workout?: Workout;
  date?: string; // YYYY-MM-DD
  status?: CalendarDayStatus;
  durationMinutes?: number;
  goal?: FitnessGoal;
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  createdAt: string;
  status: WorkoutPlanStatus;
  title: string;
  primaryGoal: FitnessGoal;
  level: FitnessLevel;
  totalWeeks: number;
  currentWeekNumber: number;
  weeklySchedule: WorkoutPlanDay[];
  notes?: string;
}

export enum WorkoutSessionStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export interface PerformedSetRecord {
  setNumber: number;
  repsCompleted?: number;
  weightUsedKg?: number;
  durationSeconds?: number;
  perceivedEffortRPE?: number; // Escala RPE 1-10
  discomfortReported?: boolean;
}

export interface PerformedExerciseRecord {
  exerciseId: string;
  exerciseName: string;
  completedSets: PerformedSetRecord[];
  skipped: boolean;
  skipReason?: string;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  workoutPlanId?: string;
  workoutId: string;
  workoutTitle?: string;
  userId: string;
  status: WorkoutSessionStatus;
  
  date: string; // YYYY-MM-DD
  startTime: string; // ISO
  endTime?: string; // ISO
  startedAt?: string; // Retrocompatibilidad
  finishedAt?: string; // Retrocompatibilidad
  
  duration: number; // En segundos
  durationSeconds: number; // En segundos
  actualDurationMinutes?: number; // En minutos
  
  goal?: FitnessGoal;
  completedExercises: number;
  totalExercises: number;
  completedSets: number;
  totalSets: number;
  completionPercentage: number; // 0 - 100
  
  performedExercises: PerformedExerciseRecord[];
  
  // Feedback subjetivo post-entreno
  overallSessionRPE?: number; // 1-10
  userSatisfactionRating?: number; // 1-5
  notes?: string;
  reportedDiscomforts?: string[];
}

export interface ActiveWorkoutState {
  sessionId: string;
  workout: Workout;
  currentExerciseIndex: number;
  currentSetIndex: number;
  isResting: boolean;
  restSecondsRemaining: number;
  elapsedSeconds: number;
  isPaused: boolean;
  isTimerRunning: boolean;
  exerciseTimerSeconds: number;
  completedSetsCount: number;
  completedExercisesCount: number;
  performedExercises: PerformedExerciseRecord[];
  lastSavedTimestamp: number;
}

