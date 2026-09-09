/**
 * FitAdapt - Presupuesto de Tiempo y Distribución de Sesión
 * FASE 6: Generador de Rutinas Personalizadas
 * 
 * Gestiona los presets oficiales: 15, 20, 30, 45, 60 minutos
 * y calcula de manera determinista los bloques de calentamiento, entrenamiento principal,
 * finisher opcional y vuelta a la calma según objetivo, nivel e intensidad.
 */

import { FitnessGoal, FitnessLevel } from '../../types/user';

export type WorkoutDurationPreset = 15 | 20 | 30 | 45 | 60;

export interface TimeBudgetBreakdown {
  totalTargetMinutes: number;
  warmupMinutes: number;
  mainWorkoutMinutes: number;
  finisherMinutes: number;
  cooldownMinutes: number;
  
  // Conteo de ejercicios recomendado
  warmupExerciseCount: number;
  mainExerciseCount: number;
  finisherExerciseCount: number;
  cooldownExerciseCount: number;
  
  // Parámetros por ejercicio según nivel/objetivo
  defaultSets: number;
  defaultReps: number | { min: number; max: number };
  defaultWorkSeconds: number;
  defaultRestSeconds: number;
}

export class TimeBudgetCalculator {
  /**
   * Calcula la distribución de tiempo matemática para una duración dada
   */
  public static calculate(
    durationMinutes: number,
    goal: FitnessGoal,
    level: FitnessLevel,
    intensity: 'LOW' | 'MEDIUM' | 'HIGH' = 'MEDIUM',
    allowFinisher: boolean = true
  ): TimeBudgetBreakdown {
    // Normalizar a los presets admitidos
    const validPresets: WorkoutDurationPreset[] = [15, 20, 30, 45, 60];
    const closestPreset = validPresets.reduce((prev, curr) =>
      Math.abs(curr - durationMinutes) < Math.abs(prev - durationMinutes) ? curr : prev
    );

    switch (closestPreset) {
      case 15:
        return this.budget15Minutes(goal, level, intensity);
      case 20:
        return this.budget20Minutes(goal, level, intensity);
      case 30:
        return this.budget30Minutes(goal, level, intensity, allowFinisher);
      case 45:
        return this.budget45Minutes(goal, level, intensity, allowFinisher);
      case 60:
      default:
        return this.budget60Minutes(goal, level, intensity, allowFinisher);
    }
  }

  private static budget15Minutes(
    goal: FitnessGoal,
    level: FitnessLevel,
    intensity: 'LOW' | 'MEDIUM' | 'HIGH'
  ): TimeBudgetBreakdown {
    // 15 min: Sesión exprés de alta eficiencia
    // Calentamiento dinámico rápido (2 min) + Principal (11 min) + Enfriamiento (2 min)
    const isBeginner = level === FitnessLevel.BEGINNER;
    const defaultSets = isBeginner ? 2 : 2;
    const defaultRestSeconds = isBeginner ? 40 : intensity === 'HIGH' ? 25 : 30;

    return {
      totalTargetMinutes: 15,
      warmupMinutes: 2,
      mainWorkoutMinutes: 11,
      finisherMinutes: 0,
      cooldownMinutes: 2,
      warmupExerciseCount: 2,
      mainExerciseCount: 3,
      finisherExerciseCount: 0,
      cooldownExerciseCount: 2,
      defaultSets,
      defaultReps: isBeginner ? { min: 8, max: 10 } : { min: 10, max: 12 },
      defaultWorkSeconds: 35,
      defaultRestSeconds,
    };
  }

  private static budget20Minutes(
    goal: FitnessGoal,
    level: FitnessLevel,
    intensity: 'LOW' | 'MEDIUM' | 'HIGH'
  ): TimeBudgetBreakdown {
    const isBeginner = level === FitnessLevel.BEGINNER;
    const defaultSets = isBeginner ? 2 : 3;
    const defaultRestSeconds = isBeginner ? 45 : intensity === 'HIGH' ? 30 : 35;

    return {
      totalTargetMinutes: 20,
      warmupMinutes: 3,
      mainWorkoutMinutes: 14,
      finisherMinutes: 0,
      cooldownMinutes: 3,
      warmupExerciseCount: 2,
      mainExerciseCount: 4,
      finisherExerciseCount: 0,
      cooldownExerciseCount: 2,
      defaultSets,
      defaultReps: isBeginner ? { min: 8, max: 12 } : { min: 10, max: 15 },
      defaultWorkSeconds: 40,
      defaultRestSeconds,
    };
  }

  private static budget30Minutes(
    goal: FitnessGoal,
    level: FitnessLevel,
    intensity: 'LOW' | 'MEDIUM' | 'HIGH',
    allowFinisher: boolean
  ): TimeBudgetBreakdown {
    const isBeginner = level === FitnessLevel.BEGINNER;
    const includeFinisher = allowFinisher && !isBeginner && (goal === FitnessGoal.WEIGHT_LOSS || goal === FitnessGoal.CARDIO);
    const defaultSets = isBeginner ? 2 : 3;
    const defaultRestSeconds = goal === FitnessGoal.STRENGTH ? 60 : isBeginner ? 45 : 35;

    return {
      totalTargetMinutes: 30,
      warmupMinutes: 4,
      mainWorkoutMinutes: includeFinisher ? 20 : 22,
      finisherMinutes: includeFinisher ? 2 : 0,
      cooldownMinutes: 4,
      warmupExerciseCount: 3,
      mainExerciseCount: 5,
      finisherExerciseCount: includeFinisher ? 1 : 0,
      cooldownExerciseCount: 2,
      defaultSets,
      defaultReps: goal === FitnessGoal.STRENGTH ? { min: 8, max: 10 } : { min: 10, max: 15 },
      defaultWorkSeconds: 40,
      defaultRestSeconds,
    };
  }

  private static budget45Minutes(
    goal: FitnessGoal,
    level: FitnessLevel,
    intensity: 'LOW' | 'MEDIUM' | 'HIGH',
    allowFinisher: boolean
  ): TimeBudgetBreakdown {
    const isBeginner = level === FitnessLevel.BEGINNER;
    const includeFinisher = allowFinisher && level !== FitnessLevel.BEGINNER;
    const defaultSets = isBeginner ? 3 : 3;
    const defaultRestSeconds = goal === FitnessGoal.STRENGTH ? 75 : isBeginner ? 50 : 40;

    return {
      totalTargetMinutes: 45,
      warmupMinutes: 5,
      mainWorkoutMinutes: includeFinisher ? 32 : 35,
      finisherMinutes: includeFinisher ? 3 : 0,
      cooldownMinutes: 5,
      warmupExerciseCount: 3,
      mainExerciseCount: 6,
      finisherExerciseCount: includeFinisher ? 1 : 0,
      cooldownExerciseCount: 3,
      defaultSets,
      defaultReps: goal === FitnessGoal.STRENGTH ? { min: 6, max: 10 } : { min: 10, max: 15 },
      defaultWorkSeconds: 45,
      defaultRestSeconds,
    };
  }

  private static budget60Minutes(
    goal: FitnessGoal,
    level: FitnessLevel,
    intensity: 'LOW' | 'MEDIUM' | 'HIGH',
    allowFinisher: boolean
  ): TimeBudgetBreakdown {
    const isBeginner = level === FitnessLevel.BEGINNER;
    const includeFinisher = allowFinisher && level === FitnessLevel.ADVANCED;
    const defaultSets = isBeginner ? 3 : 4;
    const defaultRestSeconds = goal === FitnessGoal.STRENGTH ? 90 : isBeginner ? 60 : 45;

    return {
      totalTargetMinutes: 60,
      warmupMinutes: 6,
      mainWorkoutMinutes: includeFinisher ? 45 : 48,
      finisherMinutes: includeFinisher ? 4 : 0,
      cooldownMinutes: 6,
      warmupExerciseCount: 4,
      mainExerciseCount: 7,
      finisherExerciseCount: includeFinisher ? 1 : 0,
      cooldownExerciseCount: 3,
      defaultSets,
      defaultReps: goal === FitnessGoal.STRENGTH ? { min: 6, max: 8 } : { min: 12, max: 15 },
      defaultWorkSeconds: 50,
      defaultRestSeconds,
    };
  }
}
