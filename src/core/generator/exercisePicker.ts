/**
 * FitAdapt - Selector y Balanceador Biomecánico de Ejercicios
 * FASE 6: Generador de Rutinas Personalizadas
 * 
 * Filtra la biblioteca mediante el CompatibilityEngine, rechaza estrictamente NOT_RECOMMENDED,
 * clasifica candidatos por bloques funcionales (calentamiento, principal, finisher, vuelta a la calma)
 * y asegura equilibrio anatómico (tren inferior, superior, core, cardio) con variedad determinista.
 */

import { Exercise, ExerciseCategory, BodyArea, MovementType, ImpactLevel } from '../../types/exercise';
import { UserProfile, FitnessGoal, FitnessLevel } from '../../types/user';
import { CompatibilityEngine } from '../compatibility/evaluator';
import { CompatibilityStatus, CompatibilityEvaluationResult } from '../../types/compatibility';
import { WorkoutExercise, WorkoutStructureSection, WorkoutMuscleBalance } from '../../types/workout';
import { EXERCISE_LIBRARY, getExerciseById } from '../../data/exerciseLibrary';
import { TimeBudgetBreakdown } from './timeBudget';

export interface EvaluatedCandidate {
  exercise: Exercise;
  evaluation: CompatibilityEvaluationResult;
}

export class ExercisePicker {
  /**
   * Genera el conjunto de candidatos válidos evaluados por el motor de compatibilidad
   */
  public static getEvaluatedPool(
    user: UserProfile,
    library: Exercise[] = EXERCISE_LIBRARY
  ): EvaluatedCandidate[] {
    const batch = CompatibilityEngine.evaluateBatch(library, user, library);

    return batch.results
      .filter((res) => res.status !== CompatibilityStatus.NOT_RECOMMENDED)
      .map((res) => ({
        exercise: library.find((e) => e.id === res.exerciseId)!,
        evaluation: res,
      }))
      .filter((item) => item.exercise !== undefined);
  }

  /**
   * Función de aleatoriedad determinista con semilla para variedad reproducible
   */
  private static getSeededRandom(seed: number | string, salt: number): number {
    const str = `${seed}_${salt}`;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(Math.sin(hash) * 10000) % 1;
  }

  /**
   * Ordena un array con semilla determinista sin mutar el original
   */
  private static shuffleWithSeed<T>(array: T[], seed: number | string, salt: number = 1): T[] {
    const cloned = [...array];
    for (let i = cloned.length - 1; i > 0; i--) {
      const j = Math.floor(this.getSeededRandom(seed, salt + i) * (i + 1));
      [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned;
  }

  /**
   * Convierte un ejercicio seleccionado en un WorkoutExercise con parámetros de carga
   */
  public static createWorkoutExercise(
    candidate: EvaluatedCandidate,
    section: WorkoutStructureSection,
    order: number,
    budget: TimeBudgetBreakdown,
    user: UserProfile
  ): WorkoutExercise {
    const { exercise, evaluation } = candidate;
    const isWarmup = section === WorkoutStructureSection.WARMUP;
    const isCooldown = section === WorkoutStructureSection.COOLDOWN;
    const isFinisher = section === WorkoutStructureSection.FINISHER;

    // Determinación de series y repeticiones/duración
    let sets = budget.defaultSets;
    let durationSeconds: number | undefined;
    let reps: number | { min: number; max: number } | string | undefined = budget.defaultReps;
    let restSeconds = budget.defaultRestSeconds;

    if (isWarmup) {
      sets = 1;
      durationSeconds = 40;
      reps = '10-12 mov';
      restSeconds = 15;
    } else if (isCooldown) {
      sets = 1;
      durationSeconds = 45;
      reps = 'Mantenimiento';
      restSeconds = 15;
    } else if (isFinisher) {
      sets = 2;
      durationSeconds = 30;
      reps = 'Al fallo técnico';
      restSeconds = 20;
    } else {
      // Ajustes específicos para el bloque principal según tipo de ejercicio
      if (exercise.category === ExerciseCategory.CARDIO || exercise.movementType === MovementType.LOCOMOTION_CARDIO) {
        durationSeconds = budget.defaultWorkSeconds;
        reps = `${budget.defaultWorkSeconds}s continuo`;
      } else if (exercise.category === ExerciseCategory.MOBILITY) {
        reps = '8-10 controlados';
        durationSeconds = 45;
      }
    }

    const wasAdapted = evaluation.status === CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION;
    const modification = wasAdapted
      ? (evaluation.modificationNotes?.length > 0
          ? evaluation.modificationNotes.join('. ')
          : evaluation.suggestedAdaptation?.description || 'Modificación técnica de seguridad')
      : undefined;
    const alternativeExerciseId = evaluation.suggestedAlternative?.exerciseId;

    return {
      exerciseId: exercise.id,
      order,
      orderIndex: order,
      sets,
      targetSets: sets,
      reps,
      targetReps: typeof reps === 'object' && 'min' in reps ? reps : undefined,
      duration: durationSeconds,
      targetDurationSeconds: durationSeconds,
      rest: restSeconds,
      restSecondsAfter: restSeconds,
      intensity: user.preferences?.targetIntensity || 'MEDIUM',
      notes: exercise.description,
      modification,
      appliedModificationNotes: modification,
      alternativeExerciseId,
      exerciseSnapshot: exercise,
      section,
      wasAdapted,
      adaptationReason: modification,
    };
  }

  /**
   * Selecciona los ejercicios de calentamiento (Warm-up)
   */
  public static pickWarmupExercises(
    pool: EvaluatedCandidate[],
    count: number,
    seed: number | string,
    user: UserProfile,
    budget: TimeBudgetBreakdown
  ): WorkoutExercise[] {
    // Buscar ejercicios de movilidad y activación articular con bajo impacto
    const warmupPool = pool.filter((c) => {
      const ex = c.exercise;
      return (
        ex.category === ExerciseCategory.MOBILITY ||
        ex.movementType === MovementType.MOBILITY_DYNAMIC ||
        ex.bodyArea === BodyArea.MOBILITY ||
        (ex.impactLevel === ImpactLevel.LOW && ex.fitnessLevel === FitnessLevel.BEGINNER)
      );
    });

    const candidates = warmupPool.length >= count ? warmupPool : pool;
    const shuffled = this.shuffleWithSeed(candidates, seed, 101);
    const selected = shuffled.slice(0, count);

    return selected.map((c, idx) =>
      this.createWorkoutExercise(c, WorkoutStructureSection.WARMUP, idx + 1, budget, user)
    );
  }

  /**
   * Selecciona los ejercicios de vuelta a la calma (Cool-down)
   */
  public static pickCooldownExercises(
    pool: EvaluatedCandidate[],
    count: number,
    seed: number | string,
    user: UserProfile,
    budget: TimeBudgetBreakdown,
    usedIds: Set<string>,
    startOrder: number
  ): WorkoutExercise[] {
    const cooldownPool = pool.filter((c) => {
      const ex = c.exercise;
      return (
        !usedIds.has(ex.id) &&
        (ex.category === ExerciseCategory.MOBILITY ||
          ex.movementType === MovementType.MOBILITY_DYNAMIC ||
          ex.primaryMuscle.includes('LOWER_BACK') ||
          ex.name.toLowerCase().includes('estiramiento') ||
          ex.name.toLowerCase().includes('cat-cow') ||
          ex.name.toLowerCase().includes('child') ||
          ex.name.toLowerCase().includes('respiración') ||
          ex.impactLevel === ImpactLevel.LOW)
      );
    });

    const candidates = cooldownPool.length >= count ? cooldownPool : pool.filter((c) => !usedIds.has(c.exercise.id));
    const shuffled = this.shuffleWithSeed(candidates, seed, 202);
    const selected = shuffled.slice(0, count);

    return selected.map((c, idx) => {
      usedIds.add(c.exercise.id);
      return this.createWorkoutExercise(
        c,
        WorkoutStructureSection.COOLDOWN,
        startOrder + idx,
        budget,
        user
      );
    });
  }

  /**
   * Selecciona el bloque de entrenamiento principal equilibrando según el objetivo
   */
  public static pickMainWorkoutExercises(
    pool: EvaluatedCandidate[],
    count: number,
    goal: FitnessGoal,
    seed: number | string,
    user: UserProfile,
    budget: TimeBudgetBreakdown,
    usedIds: Set<string>,
    startOrder: number
  ): { exercises: WorkoutExercise[]; balance: WorkoutMuscleBalance } {
    // Filtrar candidatos disponibles no utilizados en el calentamiento
    const available = pool.filter((c) => !usedIds.has(c.exercise.id));

    // Dividir candidatos por grupos funcionales para garantizar equilibrio
    const lowerBodyPool = available.filter((c) =>
      [BodyArea.LEGS, BodyArea.GLUTES, BodyArea.LOWER_BODY].includes(c.exercise.bodyArea)
    );
    const upperBodyPool = available.filter((c) =>
      [BodyArea.CHEST, BodyArea.BACK, BodyArea.SHOULDERS, BodyArea.ARMS, BodyArea.UPPER_BODY].includes(c.exercise.bodyArea)
    );
    const corePool = available.filter((c) =>
      c.exercise.bodyArea === BodyArea.CORE ||
      [MovementType.CORE_ANTI_EXTENSION, MovementType.CORE_ANTI_ROTATION, MovementType.CORE_FLEXION].includes(c.exercise.movementType)
    );
    const cardioPool = available.filter((c) =>
      c.exercise.category === ExerciseCategory.CARDIO ||
      c.exercise.movementType === MovementType.LOCOMOTION_CARDIO
    );
    const mobilityPool = available.filter((c) =>
      c.exercise.category === ExerciseCategory.MOBILITY ||
      c.exercise.movementType === MovementType.MOBILITY_DYNAMIC
    );

    const selectedCandidates: EvaluatedCandidate[] = [];

    // Helper determinista para seleccionar de un subpool
    const pickFromPool = (subPool: EvaluatedCandidate[], salt: number) => {
      const candidates = subPool.filter(
        (c) => !usedIds.has(c.exercise.id) && !selectedCandidates.some((sc) => sc.exercise.id === c.exercise.id)
      );
      if (candidates.length === 0) return;
      const shuffled = this.shuffleWithSeed(candidates, seed, salt);
      // Tomar el que tenga mejor afinidad de puntuación combinada con el shuffle
      const pick = shuffled[0];
      selectedCandidates.push(pick);
    };

    // =========================================================================
    // ESTRATEGIA DE REPARTO SEGÚN OBJETIVO PRINCIPAL
    // =========================================================================
    if (goal === FitnessGoal.WEIGHT_LOSS) {
      // WEIGHT_LOSS: Combinación balanceada de cardio + fuerza/full body + core
      pickFromPool(lowerBodyPool, 301);
      pickFromPool(upperBodyPool, 302);
      pickFromPool(cardioPool.length > 0 ? cardioPool : lowerBodyPool, 303);
      pickFromPool(corePool, 304);
      if (count >= 5) pickFromPool(lowerBodyPool, 305);
      if (count >= 6) pickFromPool(upperBodyPool, 306);
      if (count >= 7) pickFromPool(cardioPool, 307);
    } else if (goal === FitnessGoal.TONING) {
      // TONING: Resistencia muscular, multiarticulares y core
      pickFromPool(lowerBodyPool, 401);
      pickFromPool(upperBodyPool, 402);
      pickFromPool(corePool, 403);
      pickFromPool(lowerBodyPool, 404);
      if (count >= 5) pickFromPool(upperBodyPool, 405);
      if (count >= 6) pickFromPool(corePool, 406);
      if (count >= 7) pickFromPool(cardioPool, 407);
    } else if (goal === FitnessGoal.CARDIO) {
      // CARDIO: Prioridad máxima a sistemas cardiovasculares y locomoción
      pickFromPool(cardioPool.length > 0 ? cardioPool : lowerBodyPool, 501);
      pickFromPool(cardioPool.length > 1 ? cardioPool : upperBodyPool, 502);
      pickFromPool(corePool, 503);
      pickFromPool(cardioPool.length > 2 ? cardioPool : lowerBodyPool, 504);
      if (count >= 5) pickFromPool(upperBodyPool, 505);
      if (count >= 6) pickFromPool(cardioPool, 506);
      if (count >= 7) pickFromPool(corePool, 507);
    } else if (goal === FitnessGoal.STRENGTH) {
      // STRENGTH: Prioridad a ejercicios de fuerza multiarticular (tren superior + inferior)
      pickFromPool(lowerBodyPool, 601);
      pickFromPool(upperBodyPool, 602);
      pickFromPool(lowerBodyPool, 603);
      pickFromPool(upperBodyPool, 604);
      if (count >= 5) pickFromPool(corePool, 605);
      if (count >= 6) pickFromPool(upperBodyPool, 606);
      if (count >= 7) pickFromPool(lowerBodyPool, 607);
    } else {
      // MOBILITY: Control postural, movilidad y cadenas completas
      pickFromPool(mobilityPool.length > 0 ? mobilityPool : corePool, 701);
      pickFromPool(lowerBodyPool, 702);
      pickFromPool(mobilityPool.length > 1 ? mobilityPool : upperBodyPool, 703);
      pickFromPool(corePool, 704);
      if (count >= 5) pickFromPool(mobilityPool, 705);
      if (count >= 6) pickFromPool(upperBodyPool, 706);
      if (count >= 7) pickFromPool(lowerBodyPool, 707);
    }

    // Rellenar si faltan ejercicios hasta alcanzar el count deseado
    while (selectedCandidates.length < count) {
      const remaining = available.filter(
        (c) => !usedIds.has(c.exercise.id) && !selectedCandidates.some((sc) => sc.exercise.id === c.exercise.id)
      );
      if (remaining.length === 0) break;
      const shuffled = this.shuffleWithSeed(remaining, seed, 800 + selectedCandidates.length);
      selectedCandidates.push(shuffled[0]);
    }

    // Registrar IDs usados
    selectedCandidates.forEach((c) => usedIds.add(c.exercise.id));

    // Mapear a WorkoutExercise
    const exercises = selectedCandidates.map((c, idx) =>
      this.createWorkoutExercise(
        c,
        WorkoutStructureSection.MAIN_BLOCK,
        startOrder + idx,
        budget,
        user
      )
    );

    // Calcular distribución de balance muscular
    let lowerCount = 0;
    let upperCount = 0;
    let coreCount = 0;
    let cardioCount = 0;
    let mobCount = 0;

    selectedCandidates.forEach((c) => {
      const area = c.exercise.bodyArea;
      const cat = c.exercise.category;
      if ([BodyArea.LEGS, BodyArea.GLUTES, BodyArea.LOWER_BODY].includes(area)) lowerCount++;
      else if ([BodyArea.CHEST, BodyArea.BACK, BodyArea.SHOULDERS, BodyArea.ARMS, BodyArea.UPPER_BODY].includes(area)) upperCount++;
      else if (area === BodyArea.CORE) coreCount++;
      else if (cat === ExerciseCategory.CARDIO) cardioCount++;
      else mobCount++;
    });

    const total = selectedCandidates.length || 1;
    const balance: WorkoutMuscleBalance = {
      lowerBody: Math.round((lowerCount / total) * 100),
      upperBody: Math.round((upperCount / total) * 100),
      core: Math.round((coreCount / total) * 100),
      cardio: Math.round((cardioCount / total) * 100),
      mobility: Math.round((mobCount / total) * 100),
    };

    return { exercises, balance };
  }

  /**
   * Selecciona el finisher opcional si corresponde
   */
  public static pickFinisherExercise(
    pool: EvaluatedCandidate[],
    seed: number | string,
    user: UserProfile,
    budget: TimeBudgetBreakdown,
    usedIds: Set<string>,
    order: number
  ): WorkoutExercise | undefined {
    if (budget.finisherExerciseCount === 0) return undefined;

    const finisherCandidates = pool.filter((c) => {
      const ex = c.exercise;
      return (
        !usedIds.has(ex.id) &&
        (ex.category === ExerciseCategory.CARDIO ||
          ex.movementType === MovementType.CORE_ANTI_EXTENSION ||
          ex.movementType === MovementType.LOCOMOTION_CARDIO)
      );
    });

    if (finisherCandidates.length === 0) return undefined;

    const shuffled = this.shuffleWithSeed(finisherCandidates, seed, 909);
    const pick = shuffled[0];
    usedIds.add(pick.exercise.id);

    return this.createWorkoutExercise(
      pick,
      WorkoutStructureSection.FINISHER,
      order,
      budget,
      user
    );
  }
}
