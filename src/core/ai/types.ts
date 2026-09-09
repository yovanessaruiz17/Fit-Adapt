/**
 * FitAdapt AI - Tipos y Definiciones del Asistente
 * FASE 9: Asistente Contextual FitAdapt AI
 */

import { UserProfile, FitnessGoal, FitnessLevel, TrainingLocation } from '../../types/user';
import { Workout, WorkoutExercise } from '../../types/workout';
import { Exercise } from '../../types/exercise';
import { AlternativeRecommendation } from '../../types/compatibility';

export type AIMessageRole = 'user' | 'assistant' | 'system';

export type AIActionType =
  | 'EXPLAIN_EXERCISE'
  | 'SUBSTITUTE_EXERCISE'
  | 'CHANGE_DURATION'
  | 'MAKE_EASIER'
  | 'MAKE_HARDER'
  | 'MEDICAL_DISCLAIMER'
  | 'NONE';

export interface AIActionPayload {
  type: AIActionType;
  exerciseId?: string;
  exerciseName?: string;
  alternative?: AlternativeRecommendation;
  targetDurationMinutes?: 15 | 20 | 30 | 45 | 60;
  explanation?: string;
  reason?: string;
}

export interface AIChatMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  timestamp: string;
  actionPayload?: AIActionPayload;
  isFallback?: boolean;
  isMedicalWarning?: boolean;
  sourceTool?: string;
}

export interface AIPrivacySettings {
  shareGoalsAndLevel: boolean;
  shareEquipmentAndLocation: boolean;
  shareLimitations: boolean;
  shareCurrentWorkout: boolean;
  shareProgressStats: boolean;
}

export const DEFAULT_AI_PRIVACY_SETTINGS: AIPrivacySettings = {
  shareGoalsAndLevel: true,
  shareEquipmentAndLocation: true,
  shareLimitations: true,
  shareCurrentWorkout: true,
  shareProgressStats: true,
};

export interface SanitizedAIContext {
  // Datos sanitizados (sin información personal sensible como nombres reales, correos, etc.)
  user?: {
    primaryGoal?: FitnessGoal;
    fitnessLevel?: FitnessLevel;
    trainingLocation?: TrainingLocation;
    availableEquipment?: string[];
    declaredLimitations?: string[];
  };
  currentWorkout?: {
    id: string;
    title: string;
    estimatedDurationMinutes: number;
    goal: string;
    fitnessLevel: string;
    exerciseCount: number;
    exercises: Array<{
      exerciseId: string;
      name: string;
      section: string;
      sets: number;
      repsOrDuration: string;
      bodyArea: string;
      category: string;
      equipment: string[];
    }>;
  };
  progressSummary?: {
    completedWorkouts: number;
    totalMinutes: number;
    currentStreakDays: number;
    weeklySessions: number;
  };
}

export type StructuredToolName =
  | 'get_current_workout'
  | 'get_user_profile'
  | 'find_alternative_exercise'
  | 'modify_workout_duration'
  | 'adjust_workout_intensity'
  | 'explain_exercise'
  | 'get_progress_summary';

export interface StructuredToolResult {
  tool: StructuredToolName;
  success: boolean;
  data: any;
  message?: string;
  actionPayload?: AIActionPayload;
}
