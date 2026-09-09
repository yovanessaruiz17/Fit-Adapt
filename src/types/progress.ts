/**
 * FitAdapt - Tipos y Modelos de Progreso Personal, Métricas y Logros
 * FASE 8: Sistema de Progreso Personal
 */

import { FitnessGoal } from './user';
import { WorkoutSession } from './workout';

export interface WeightRecord {
  id: string;
  date: string; // YYYY-MM-DD
  weightKg: number;
  note?: string;
  createdAt: string; // ISO
}

export type BodyMetricKey = 'waist' | 'hip' | 'arm' | 'thigh' | 'chest';

export interface BodyMeasurementRecord {
  id: string;
  date: string; // YYYY-MM-DD
  waistCm?: number;
  hipCm?: number;
  armCm?: number;
  thighCm?: number;
  chestCm?: number;
  note?: string;
  createdAt: string; // ISO
}

export interface MeasurementPreferences {
  enabledMetrics: {
    waist: boolean; // Cintura
    hip: boolean;   // Cadera
    arm: boolean;   // Brazo
    thigh: boolean; // Muslo
    chest: boolean; // Pecho
  };
}

export interface StreakCalculation {
  currentStreak: number;
  longestStreak: number;
  activeDaysCount: number;
  lastCompletedDate: string | null;
  definition: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number; // 0 - 100
  currentValue: number;
  targetValue: number;
  unit: string;
  unlockedAt?: string;
  category: 'HABIT' | 'VOLUME' | 'STREAK' | 'WELLNESS';
}

export interface ProgressDashboardData {
  totalWorkoutsCompleted: number;
  totalMinutesTrained: number;
  currentStreak: number;
  longestStreak: number;
  sessionsThisWeek: number;
  sessionsThisMonth: number;
  compliancePercentage: number;
  
  // Desglose de entrenamientos
  workoutsByGoal: Record<string, number>;
  workoutsByType: Record<string, number>;
  workoutsByWeek: Array<{
    weekLabel: string;
    count: number;
    minutes: number;
  }>;
  workoutsByMonth: Array<{
    monthLabel: string;
    count: number;
    minutes: number;
  }>;

  // Calendario de días con estados
  recentDayStatuses: Array<{
    date: string;
    dayLabel: string;
    status: 'COMPLETED' | 'REST' | 'MISSED' | 'PENDING';
    minutes?: number;
    workoutTitle?: string;
  }>;
}
