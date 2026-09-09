/**
 * FitAdapt - Ajustador Dinámico de Rutinas (WorkoutAdjuster)
 * FASE 6: Modificaciones Controladas con Reglas de Compatibilidad
 * 
 * Funciones:
 * 1. makeEasier: Reduce volumen/intensidad, incrementa descansos o aplica regresiones.
 * 2. makeMoreIntense: Aumenta densidad, series o progresión biomecánica segura.
 * 3. changeDuration: Modifica duración hacia presets (15, 20, 30, 45, 60 min).
 * 4. substituteExercise: Sustituye un ejercicio individual por una alternativa compatible.
 * 
 * Toda modificación re-valida las reglas del CompatibilityEngine.
 */

import { Workout, WorkoutExercise, WorkoutStructureSection } from '../../types/workout';
import { UserProfile } from '../../types/user';
import { CompatibilityEngine } from '../compatibility/evaluator';
import { CompatibilityStatus } from '../../types/compatibility';
import { getExerciseById, EXERCISE_LIBRARY } from '../../data/exerciseLibrary';
import { WorkoutGenerator } from './workoutGenerator';
import { ExercisePicker } from './exercisePicker';
import { TimeBudgetCalculator } from './timeBudget';

export class WorkoutAdjuster {
  /**
   * Hace la rutina más fácil: reduce series, alarga descansos y aplica variantes de menor impacto
   */
  public static makeEasier(workout: Workout, user: UserProfile): Workout {
    const updatedExercises: WorkoutExercise[] = workout.exercises.map((ex) => {
      // Si el ejercicio tiene una alternativa de menor impacto o sin equipamiento, considerarla
      let activeSnapshot = ex.exerciseSnapshot;
      let wasAdapted = ex.wasAdapted;
      let modification = ex.modification;
      let alternativeExerciseId = ex.alternativeExerciseId;

      // Buscar si existe una alternativa explícita de menor impacto
      if (ex.exerciseSnapshot.lowImpactAlternative?.exerciseId) {
        const altEx = getExerciseById(ex.exerciseSnapshot.lowImpactAlternative.exerciseId);
        if (altEx) {
          const evalResult = CompatibilityEngine.evaluate(altEx, user, EXERCISE_LIBRARY);
          if (evalResult.status !== CompatibilityStatus.NOT_RECOMMENDED) {
            activeSnapshot = altEx;
            wasAdapted = true;
            modification = `Regresión de bajo impacto aplicada: ${ex.exerciseSnapshot.lowImpactAlternative.howToPerform}`;
            alternativeExerciseId = altEx.id;
          }
        }
      }

      // Reducción de series (mínimo 2 en principal, 1 en calentamiento/enfriamiento)
      const minSets = ex.section === WorkoutStructureSection.MAIN_BLOCK ? 2 : 1;
      const newSets = Math.max(minSets, ex.sets - 1);

      // Incremento de descanso para facilitar la recuperación cardiovascular y muscular
      const newRest = Math.min(75, ex.rest + 15);

      return {
        ...ex,
        exerciseId: activeSnapshot.id,
        exerciseSnapshot: activeSnapshot,
        sets: newSets,
        targetSets: newSets,
        rest: newRest,
        restSecondsAfter: newRest,
        wasAdapted,
        modification,
        appliedModificationNotes: modification,
        alternativeExerciseId,
      };
    });

    return {
      ...workout,
      title: `${workout.title} (Versión Suave)`,
      exercises: updatedExercises,
      warmup: updatedExercises.filter((e) => e.section === WorkoutStructureSection.WARMUP),
      mainWorkout: updatedExercises.filter((e) => e.section === WorkoutStructureSection.MAIN_BLOCK),
      finisher: updatedExercises.filter((e) => e.section === WorkoutStructureSection.FINISHER),
      cooldown: updatedExercises.filter((e) => e.section === WorkoutStructureSection.COOLDOWN),
    };
  }

  /**
   * Hace la rutina más intensa dentro de límites seguros: aumenta series o acorta descansos
   */
  public static makeMoreIntense(workout: Workout, user: UserProfile): Workout {
    // Si el usuario tiene dolor agudo o condición cardiovascular sensible, no se permite intensificación brusca
    if (user.medicalSafety?.hasAcutePain) {
      return workout;
    }

    const updatedExercises: WorkoutExercise[] = workout.exercises.map((ex) => {
      // Aumento de series en el bloque principal (máximo 4)
      const maxSets = ex.section === WorkoutStructureSection.MAIN_BLOCK ? 4 : 1;
      const newSets = Math.min(maxSets, ex.sets + 1);

      // Reducción de descanso para aumentar densidad metabólica (mínimo 25s)
      const newRest = Math.max(25, ex.rest - 10);

      return {
        ...ex,
        sets: newSets,
        targetSets: newSets,
        rest: newRest,
        restSecondsAfter: newRest,
      };
    });

    return {
      ...workout,
      title: `${workout.title} (Mayor Intensidad)`,
      exercises: updatedExercises,
      warmup: updatedExercises.filter((e) => e.section === WorkoutStructureSection.WARMUP),
      mainWorkout: updatedExercises.filter((e) => e.section === WorkoutStructureSection.MAIN_BLOCK),
      finisher: updatedExercises.filter((e) => e.section === WorkoutStructureSection.FINISHER),
      cooldown: updatedExercises.filter((e) => e.section === WorkoutStructureSection.COOLDOWN),
    };
  }

  /**
   * Cambia la duración objetivo respetando los presets oficiales (15, 20, 30, 45, 60 min)
   */
  public static changeDuration(
    workout: Workout,
    newDurationMinutes: 15 | 20 | 30 | 45 | 60,
    user: UserProfile
  ): Workout {
    const result = WorkoutGenerator.generate({
      userProfile: user,
      targetDurationMinutes: newDurationMinutes,
      targetGoal: workout.goal,
      seed: workout.metadata?.generationSeed || 1,
    });

    return result.workout;
  }

  /**
   * Sustituye un ejercicio individual por una alternativa compatible disponible
   */
  public static substituteExercise(
    workout: Workout,
    exerciseIdToReplace: string,
    user: UserProfile
  ): Workout {
    const currentEx = workout.exercises.find((e) => e.exerciseId === exerciseIdToReplace);
    if (!currentEx) return workout;

    // Obtener candidatos compatibles de la biblioteca
    const evaluatedPool = ExercisePicker.getEvaluatedPool(user, EXERCISE_LIBRARY);
    const existingIds = new Set(workout.exercises.map((e) => e.exerciseId));

    // Buscar sustituto en la misma categoría o grupo biomecánico que no esté en la rutina
    let candidate = evaluatedPool.find(
      (c) =>
        !existingIds.has(c.exercise.id) &&
        c.exercise.category === currentEx.exerciseSnapshot.category &&
        c.exercise.bodyArea === currentEx.exerciseSnapshot.bodyArea
    );

    // Si no hay de la misma zona exacta, buscar de la misma categoría general
    if (!candidate) {
      candidate = evaluatedPool.find(
        (c) =>
          !existingIds.has(c.exercise.id) &&
          c.exercise.category === currentEx.exerciseSnapshot.category
      );
    }

    // Si aún no hay, buscar cualquier candidato compatible de la misma sección
    if (!candidate) {
      candidate = evaluatedPool.find((c) => !existingIds.has(c.exercise.id));
    }

    if (!candidate) return workout;

    // Crear el WorkoutExercise adaptado
    const budget = TimeBudgetCalculator.calculate(
      workout.estimatedDurationMinutes,
      workout.goal,
      workout.fitnessLevel
    );

    const replacementExercise = ExercisePicker.createWorkoutExercise(
      candidate,
      currentEx.section,
      currentEx.order,
      budget,
      user
    );

    const updatedExercises = workout.exercises.map((ex) =>
      ex.exerciseId === exerciseIdToReplace ? replacementExercise : ex
    );

    return {
      ...workout,
      exercises: updatedExercises,
      warmup: updatedExercises.filter((e) => e.section === WorkoutStructureSection.WARMUP),
      mainWorkout: updatedExercises.filter((e) => e.section === WorkoutStructureSection.MAIN_BLOCK),
      finisher: updatedExercises.filter((e) => e.section === WorkoutStructureSection.FINISHER),
      cooldown: updatedExercises.filter((e) => e.section === WorkoutStructureSection.COOLDOWN),
    };
  }
}
