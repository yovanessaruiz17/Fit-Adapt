/**
 * FitAdapt AI - Comandos y Herramientas Estructuradas
 * FASE 9: Asistente Contextual FitAdapt AI
 * 
 * Implementa las 7 acciones internas conectadas a los módulos reales de FitAdapt:
 * 1. get_current_workout: Recupera la rutina activa.
 * 2. get_user_profile: Recupera el perfil seguro sanitizado.
 * 3. find_alternative_exercise: Búsqueda y validación estricta de alternativas mediante Compatibility Engine.
 * 4. modify_workout_duration: Ajusta la duración de la rutina mediante WorkoutAdjuster / Generator.
 * 5. adjust_workout_intensity: Modifica la intensidad (más fácil / más intensa) con WorkoutAdjuster.
 * 6. explain_exercise: Desglosa técnica, fases, errores comunes y precauciones articulares.
 * 7. get_progress_summary: Calcula adherencia, constancia y racha con ProgressStorageManager.
 */

import { UserProfile } from '../../types/user';
import { Workout } from '../../types/workout';
import { Exercise } from '../../types/exercise';
import { EXERCISE_LIBRARY, getExerciseById } from '../../data/exerciseLibrary';
import { AlternativeFinder } from '../compatibility/alternatives';
import { CompatibilityEngine } from '../compatibility/evaluator';
import { WorkoutAdjuster } from '../generator/workoutAdjuster';
import { ProgressStorageManager } from '../progress/progressStorage';
import { StructuredToolName, StructuredToolResult, AIActionPayload } from './types';

export class AIToolsExecutor {
  /**
   * 1. get_current_workout: Devuelve información estructurada de la rutina actual
   */
  public static getCurrentWorkout(workout?: Workout | null): StructuredToolResult {
    if (!workout) {
      return {
        tool: 'get_current_workout',
        success: false,
        data: null,
        message: 'No hay ninguna rutina activa cargada en este momento.',
      };
    }

    return {
      tool: 'get_current_workout',
      success: true,
      data: {
        id: workout.id,
        title: workout.title,
        estimatedDurationMinutes: workout.estimatedDurationMinutes,
        goal: workout.goal,
        fitnessLevel: workout.fitnessLevel,
        exercises: workout.exercises.map((e) => ({
          id: e.exerciseId,
          name: e.exerciseSnapshot.name,
          section: e.section,
          sets: e.sets,
          repsOrDuration: e.repsOrDuration,
          rest: `${e.rest}s`,
          targetMuscle: e.exerciseSnapshot.primaryMuscle,
        })),
      },
      message: `Rutina actual: "${workout.title}" (${workout.estimatedDurationMinutes} min, ${workout.exercises.length} ejercicios).`,
    };
  }

  /**
   * 2. get_user_profile: Devuelve el perfil seguro del usuario
   */
  public static getUserProfile(user: UserProfile): StructuredToolResult {
    return {
      tool: 'get_user_profile',
      success: true,
      data: {
        primaryGoal: user.primaryGoal,
        fitnessLevel: user.fitnessLevel,
        location: user.location,
        equipment: user.availableEquipment || [],
        limitations: (user.limitations || []).map((l) => ({
          area: l.area,
          code: l.code,
          requiresLowImpact: l.requiresLowImpact,
        })),
      },
      message: `Perfil: Nivel ${user.fitnessLevel}, Objetivo: ${user.primaryGoal}, Ubicación: ${user.location}.`,
    };
  }

  /**
   * 3. find_alternative_exercise:
   * AI -> identifica ejercicio -> busca alternativas -> Compatibility Engine -> devuelve opción válida.
   * La IA nunca inventa un ejercicio; se verifica con el motor.
   */
  public static findAlternativeExercise(
    exerciseNameOrId: string,
    user: UserProfile,
    workout?: Workout | null
  ): StructuredToolResult {
    const query = exerciseNameOrId.trim().toLowerCase();

    // 1. Buscar el ejercicio en la rutina activa o en la biblioteca completa
    let matchedExercise: Exercise | undefined;

    if (workout) {
      const inWorkout = workout.exercises.find(
        (e) =>
          e.exerciseId.toLowerCase() === query ||
          e.exerciseSnapshot.name.toLowerCase().includes(query)
      );
      if (inWorkout) {
        matchedExercise = inWorkout.exerciseSnapshot;
      }
    }

    if (!matchedExercise) {
      matchedExercise = getExerciseById(query) || EXERCISE_LIBRARY.find(
        (e) =>
          e.id.toLowerCase() === query ||
          e.name.toLowerCase().includes(query)
      );
    }

    // Si el ejercicio no existe en la biblioteca de FitAdapt
    if (!matchedExercise) {
      return {
        tool: 'find_alternative_exercise',
        success: false,
        data: null,
        message: `No se encontró el ejercicio "${exerciseNameOrId}" en la biblioteca oficial de FitAdapt. Verifica el nombre exacto.`,
        actionPayload: {
          type: 'NONE',
          reason: 'Ejercicio inexistente en la biblioteca.',
        },
      };
    }

    // 2. Ejecutar búsqueda a través del AlternativeFinder + CompatibilityEngine
    const alternative = AlternativeFinder.find(matchedExercise, user, EXERCISE_LIBRARY);

    if (!alternative) {
      return {
        tool: 'find_alternative_exercise',
        success: false,
        data: { originalExercise: matchedExercise.name },
        message: `Actualmente no hay un sustituto directo que cumpla simultáneamente con todas tus restricciones de equipamiento y articulaciones para ${matchedExercise.name}.`,
      };
    }

    // 3. Verificación de seguridad adicional con CompatibilityEngine si la alternativa tiene ficha
    if (alternative.exercise) {
      const evalResult = CompatibilityEngine.evaluate(alternative.exercise, user, EXERCISE_LIBRARY);
      if (evalResult.score < 50) {
        return {
          tool: 'find_alternative_exercise',
          success: false,
          data: null,
          message: `Se encontró una alternativa pero el Compatibility Engine determinó que su compatibilidad (${evalResult.score}%) no es segura para tu perfil.`,
        };
      }
    }

    const actionPayload: AIActionPayload = {
      type: 'SUBSTITUTE_EXERCISE',
      exerciseId: matchedExercise.id,
      exerciseName: matchedExercise.name,
      alternative,
      reason: alternative.reason,
    };

    return {
      tool: 'find_alternative_exercise',
      success: true,
      data: {
        original: matchedExercise.name,
        alternativeName: alternative.exerciseName,
        type: alternative.substitutionType,
        reason: alternative.reason,
        howToPerform: alternative.howToPerform,
        exerciseId: alternative.exerciseId,
      },
      actionPayload,
      message: `Alternativa segura verificada por Compatibility Engine: "${alternative.exerciseName}". Motivo: ${alternative.reason}`,
    };
  }

  /**
   * 4. modify_workout_duration: Ajusta la duración de la rutina respetando presets oficiales
   */
  public static modifyWorkoutDuration(
    targetMinutes: 15 | 20 | 30 | 45 | 60,
    workout: Workout,
    user: UserProfile
  ): StructuredToolResult {
    const allowed: Array<15 | 20 | 30 | 45 | 60> = [15, 20, 30, 45, 60];
    const duration = allowed.includes(targetMinutes) ? targetMinutes : 20;

    const modifiedWorkout = WorkoutAdjuster.changeDuration(workout, duration, user);

    const actionPayload: AIActionPayload = {
      type: 'CHANGE_DURATION',
      targetDurationMinutes: duration,
      reason: `Rutina readaptada a ${duration} minutos mediante el Workout Generator.`,
    };

    return {
      tool: 'modify_workout_duration',
      success: true,
      data: {
        newDurationMinutes: duration,
        previousDuration: workout.estimatedDurationMinutes,
        modifiedWorkout,
      },
      actionPayload,
      message: `Duración de la rutina ajustada a ${duration} minutos (${modifiedWorkout.exercises.length} ejercicios planificados).`,
    };
  }

  /**
   * 5. adjust_workout_intensity: Modifica la dificultad mediante las reglas de WorkoutAdjuster
   */
  public static adjustWorkoutIntensity(
    direction: 'EASIER' | 'HARDER',
    workout: Workout,
    user: UserProfile
  ): StructuredToolResult {
    let modifiedWorkout: Workout;
    let actionType: AIActionType;
    let desc: string;

    if (direction === 'EASIER') {
      modifiedWorkout = WorkoutAdjuster.makeEasier(workout, user);
      actionType = 'MAKE_EASIER';
      desc = 'Se redujeron series en bloques principales y se ampliaron los descansos (+15s) para facilitar la recuperación.';
    } else {
      modifiedWorkout = WorkoutAdjuster.makeMoreIntense(workout, user);
      actionType = 'MAKE_HARDER';
      desc = 'Se incrementaron series en ejercicios principales y se densificaron los descansos dentro de límites seguros.';
    }

    const actionPayload: AIActionPayload = {
      type: actionType,
      reason: desc,
    };

    return {
      tool: 'adjust_workout_intensity',
      success: true,
      data: {
        direction,
        description: desc,
        modifiedWorkout,
      },
      actionPayload,
      message: desc,
    };
  }

  /**
   * 6. explain_exercise: Desglosa instrucciones posturales, fases y seguridad
   */
  public static explainExercise(exerciseNameOrId: string): StructuredToolResult {
    const query = exerciseNameOrId.trim().toLowerCase();
    const exercise =
      getExerciseById(query) ||
      EXERCISE_LIBRARY.find(
        (e) => e.id.toLowerCase() === query || e.name.toLowerCase().includes(query)
      );

    if (!exercise) {
      return {
        tool: 'explain_exercise',
        success: false,
        data: null,
        message: `El ejercicio "${exerciseNameOrId}" no existe en la biblioteca de FitAdapt.`,
      };
    }

    const details = {
      name: exercise.name,
      bodyArea: exercise.bodyArea,
      primaryMuscle: exercise.primaryMuscle,
      category: exercise.category,
      impactLevel: exercise.impactLevel,
      description: exercise.description,
      instructions: exercise.instructions || [
        '1. Posición inicial con postura alineada y abdomen activo.',
        '2. Ejecuta el movimiento controlando la fase excéntrica.',
        '3. Exhala en el punto de mayor esfuerzo.',
        '4. Mantén articulaciones estables sin bloquear bruscamente.',
      ],
      safetyNotes: exercise.safetyNotes || 'Prioriza siempre la técnica sobre la velocidad o la carga.',
      lowImpactAlternative: exercise.lowImpactAlternative?.name,
    };

    return {
      tool: 'explain_exercise',
      success: true,
      data: details,
      actionPayload: {
        type: 'EXPLAIN_EXERCISE',
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        explanation: exercise.description,
      },
      message: `Técnica de ${exercise.name}: ${exercise.description}`,
    };
  }

  /**
   * 7. get_progress_summary: Resume constancia, racha y volumen
   */
  public static getProgressSummary(): StructuredToolResult {
    const stats = ProgressStorageManager.getStats();
    return {
      tool: 'get_progress_summary',
      success: true,
      data: {
        totalWorkoutsCompleted: stats.totalWorkoutsCompleted,
        totalMinutesTrained: stats.totalMinutesTrained,
        currentStreakDays: stats.currentStreakDays,
        bestStreakDays: stats.bestStreakDays,
        sessionsThisWeek: stats.sessionsThisWeek,
        weeklyGoalTarget: stats.weeklyGoalTarget,
      },
      message: `Progreso: ${stats.totalWorkoutsCompleted} sesiones completadas, ${stats.totalMinutesTrained} minutos acumulados, racha actual de ${stats.currentStreakDays} días.`,
    };
  }
}
