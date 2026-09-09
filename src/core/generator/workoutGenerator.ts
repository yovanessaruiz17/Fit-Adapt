/**
 * FitAdapt - Generador Central de Rutinas Personalizadas (WorkoutGenerator)
 * FASE 6: Ensamblado Determinista con Reglas y Motor de Compatibilidad
 * 
 * Flujo:
 * UserProfile → Compatibility Engine → Compatible Exercise Pool → Workout Generator → Workout
 * 
 * Garantiza:
 * 1. 0% de ejercicios NOT_RECOMMENDED
 * 2. Ejercicios con modificación acompañados de su instrucción biomecánica
 * 3. Respeto estricto del tiempo mediante presets (15, 20, 30, 45, 60 min)
 * 4. Calentamiento con movilidad y vuelta a la calma de descompresión
 * 5. Determinismo y variedad reproducible con seed
 */

import {
  Workout,
  WorkoutExercise,
  WorkoutGenerationRequest,
  WorkoutGenerationResult,
  WorkoutMetadata,
  WorkoutStructureSection,
} from '../../types/workout';
import { UserProfile, FitnessGoal, FitnessLevel, TrainingLocation } from '../../types/user';
import { ExercisePicker } from './exercisePicker';
import { TimeBudgetCalculator } from './timeBudget';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { CompatibilityEngine } from '../compatibility/evaluator';

export class WorkoutGenerator {
  /**
   * Genera una rutina personalizada completa respetando todas las restricciones biomecánicas
   */
  public static generate(request: WorkoutGenerationRequest): WorkoutGenerationResult {
    const startTime = performance.now();
    const { userProfile } = request;

    // Normalización de entradas
    const goal: FitnessGoal = request.targetGoal || userProfile.primaryGoal || FitnessGoal.TONING;
    const level: FitnessLevel = userProfile.fitnessLevel || FitnessLevel.BEGINNER;
    const durationMinutes = request.targetDurationMinutes || userProfile.availableTimeMinutes || userProfile.preferences?.preferredDurationMinutes || 30;
    const intensity: 'LOW' | 'MEDIUM' | 'HIGH' = request.targetIntensity || userProfile.preferences?.targetIntensity || 'MEDIUM';
    const allowFinisher = request.allowFinisher ?? true;
    const seed = request.seed !== undefined ? request.seed : 1;

    // 1. Calcular presupuesto de tiempo y volumen
    const budget = TimeBudgetCalculator.calculate(
      durationMinutes,
      goal,
      level,
      intensity,
      allowFinisher
    );

    // 2. Ejecutar Compatibility Engine sobre toda la biblioteca
    const batchReport = CompatibilityEngine.evaluateBatch(EXERCISE_LIBRARY, userProfile, EXERCISE_LIBRARY);
    const candidatePool = ExercisePicker.getEvaluatedPool(userProfile, EXERCISE_LIBRARY);

    // Si hay exclusiones solicitadas (ej. para regenerar sin repetir)
    const effectivePool = request.excludedExerciseIds && request.excludedExerciseIds.length > 0
      ? candidatePool.filter((c) => !request.excludedExerciseIds!.includes(c.exercise.id))
      : candidatePool;

    // Si la exclusión dejó sin suficientes candidatos, usar el pool completo compatible
    const finalPool = effectivePool.length >= 6 ? effectivePool : candidatePool;

    const usedIds = new Set<string>();
    const warnings: string[] = [];

    if (finalPool.length < 6) {
      warnings.push(
        'El catálogo disponible con tus limitaciones actuales es reducido. Se maximizó la reutilización segura.'
      );
    }

    // 3. Seleccionar bloque de Calentamiento (Warm-up)
    const warmup = ExercisePicker.pickWarmupExercises(
      finalPool,
      budget.warmupExerciseCount,
      seed,
      userProfile,
      budget
    );
    warmup.forEach((w) => usedIds.add(w.exerciseId));

    // 4. Seleccionar bloque de Entrenamiento Principal (Main Workout)
    const mainResult = ExercisePicker.pickMainWorkoutExercises(
      finalPool,
      budget.mainExerciseCount,
      goal,
      seed,
      userProfile,
      budget,
      usedIds,
      warmup.length + 1
    );
    const mainWorkout = mainResult.exercises;

    // 5. Seleccionar Finisher opcional (si corresponde a nivel y duración)
    const finisherOrder = warmup.length + mainWorkout.length + 1;
    const finisherExercise = ExercisePicker.pickFinisherExercise(
      finalPool,
      seed,
      userProfile,
      budget,
      usedIds,
      finisherOrder
    );
    const finisher: WorkoutExercise[] = finisherExercise ? [finisherExercise] : [];

    // 6. Seleccionar bloque de Vuelta a la Calma (Cool-down)
    const cooldownStartOrder = warmup.length + mainWorkout.length + finisher.length + 1;
    const cooldown = ExercisePicker.pickCooldownExercises(
      finalPool,
      budget.cooldownExerciseCount,
      seed,
      userProfile,
      budget,
      usedIds,
      cooldownStartOrder
    );

    // Unificar todos los ejercicios con numeración correlativa estricta
    const allExercises: WorkoutExercise[] = [
      ...warmup,
      ...mainWorkout,
      ...finisher,
      ...cooldown,
    ].map((ex, index) => ({
      ...ex,
      order: index + 1,
      orderIndex: index + 1,
    }));

    // Detectar modificaciones aplicadas
    const appliedModifications: Array<{
      exerciseId: string;
      exerciseName: string;
      modificationNotes: string;
    }> = [];

    allExercises.forEach((ex) => {
      if (ex.wasAdapted && ex.modification) {
        appliedModifications.push({
          exerciseId: ex.exerciseId,
          exerciseName: ex.exerciseSnapshot.name,
          modificationNotes: ex.modification,
        });
      }
    });

    // Detectar equipos involucrados
    const equipmentUsedSet = new Set<string>();
    allExercises.forEach((ex) => {
      ex.exerciseSnapshot.equipment?.forEach((eq) => equipmentUsedSet.add(eq));
    });

    // 7. Metadatos de la Rutina
    const metadata: WorkoutMetadata = {
      generatedAt: new Date().toISOString(),
      primaryGoal: goal,
      fitnessLevel: level,
      durationMinutes: budget.totalTargetMinutes,
      location: userProfile.trainingLocation || TrainingLocation.HOME,
      equipmentUsed: Array.from(equipmentUsedSet),
      limitationsConsidered: userProfile.limitations?.map((l) => l.name) || [],
      totalExercisesCount: allExercises.length,
      warmupExercisesCount: warmup.length,
      mainWorkoutExercisesCount: mainWorkout.length,
      cooldownExercisesCount: cooldown.length,
      finisherExercisesCount: finisher.length,
      hasModifications: appliedModifications.length > 0,
      intensity,
      generationSeed: seed,
      balanceDistribution: mainResult.balance,
    };

    // 8. Título descriptivo y amigable
    const title = this.generateWorkoutTitle(goal, level, budget.totalTargetMinutes, userProfile.trainingLocation);
    const description = this.generateWorkoutDescription(goal, level, metadata, appliedModifications.length > 0);

    const workout: Workout = {
      id: `workout-${Date.now()}-${seed}`,
      title,
      description,
      goal,
      fitnessLevel: level,
      location: userProfile.trainingLocation || TrainingLocation.HOME,
      estimatedDurationMinutes: budget.totalTargetMinutes,
      exercises: allExercises,
      tags: [
        goal,
        level,
        `${budget.totalTargetMinutes} min`,
        userProfile.trainingLocation,
        appliedModifications.length > 0 ? 'ADAPTADO' : 'ESTÁNDAR',
      ],
      metadata,
      warmup,
      mainWorkout,
      finisher: finisher.length > 0 ? finisher : undefined,
      cooldown,
    };

    const endTime = performance.now();

    return {
      success: true,
      workout,
      metadata,
      warnings,
      appliedModifications,
      candidatePoolSize: finalPool.length,
      disqualifiedExercisesCount: batchReport.notRecommendedCount,
      executionTimeMs: Math.round(endTime - startTime),
    };
  }

  private static generateWorkoutTitle(
    goal: FitnessGoal,
    level: FitnessLevel,
    duration: number,
    location: TrainingLocation
  ): string {
    const goalNames: Record<FitnessGoal, string> = {
      [FitnessGoal.WEIGHT_LOSS]: 'Pérdida de Grasa & Full Body',
      [FitnessGoal.TONING]: 'Tonificación & Definición',
      [FitnessGoal.CARDIO]: 'Cardio & Resistencia Metabólica',
      [FitnessGoal.STRENGTH]: 'Fuerza & Control Funcional',
      [FitnessGoal.MOBILITY]: 'Movilidad Articular & Estabilidad',
    };

    const locationName = location === TrainingLocation.HOME ? 'Casa' : 'Gimnasio';
    return `${goalNames[goal]} (${duration} min • ${locationName})`;
  }

  private static generateWorkoutDescription(
    goal: FitnessGoal,
    level: FitnessLevel,
    metadata: WorkoutMetadata,
    hasModifications: boolean
  ): string {
    const safetyText = hasModifications
      ? 'Rutina biomecánicamente adaptada: incluye pautas de protección para tus articulaciones sensibles.'
      : 'Rutina optimizada con 100% de compatibilidad según tu nivel y equipamiento.';

    return `Sesión estructurada de ${metadata.totalExercisesCount} ejercicios: activación previa (${metadata.warmupExercisesCount}), bloque principal equilibrado (${metadata.mainWorkoutExercisesCount}) y vuelta a la calma (${metadata.cooldownExercisesCount}). ${safetyText}`;
  }
}
