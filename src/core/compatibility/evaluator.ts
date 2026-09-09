/**
 * FitAdapt - Motor Central de Personalización y Compatibilidad (Pure Engine)
 * FASE 5: Motor Desacoplado de la Interfaz
 * 
 * Recibe: UserProfile y Exercise[]
 * Devuelve: Clasificación estricta (COMPATIBLE, COMPATIBLE_WITH_MODIFICATION, NOT_RECOMMENDED),
 * puntuación determinista (0-100), desglose de reglas y alternativas calculadas.
 * 
 * Totalmente puro y testeable sin dependencias de React ni del DOM.
 */

import { Exercise } from '../../types/exercise';
import { UserProfile } from '../../types/user';
import {
  CompatibilityStatus,
  CompatibilityEvaluationResult,
  CompatibilityBatchReport,
  RuleEvaluationDetail,
  AlternativeRecommendation,
} from '../../types/compatibility';
import {
  evaluateSafetyLimitationRule,
  evaluateFitnessLevelRule,
  evaluateEquipmentRule,
  evaluateLocationRule,
  evaluateGoalAlignmentRule,
  evaluateTimeConstraintsRule,
  evaluateIntensityRule,
  evaluatePreferencesRule,
  evaluateMorphologyRule,
} from './rules';
import { ScoringEngine } from './scoring';
import { AlternativeFinder } from './alternatives';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';

export class CompatibilityEngine {
  /**
   * Evalúa un ejercicio individual frente al perfil de usuario con las 9 prioridades de reglas.
   * Las limitaciones físicas tienen prioridad absoluta e inquebrantable sobre cualquier objetivo.
   */
  public static evaluate(
    exercise: Exercise,
    user: UserProfile,
    library: Exercise[] = EXERCISE_LIBRARY
  ): CompatibilityEvaluationResult {
    const ruleDetails: RuleEvaluationDetail[] = [];
    const reasons: string[] = [];
    const safetyNotes: string[] = [];
    const modificationNotes: string[] = [];

    // =========================================================================
    // EJECUCIÓN SECUENCIAL ESTRICTA POR PRIORIDADES (1 a 9)
    // =========================================================================

    // Prioridad 1: Seguridad y Limitaciones Físicas (Crítica)
    const safetyEval = evaluateSafetyLimitationRule(exercise, user);
    ruleDetails.push(safetyEval);
    if (!safetyEval.passed) {
      safetyNotes.push(safetyEval.message);
    }

    // Prioridad 2: Nivel Técnico
    const levelEval = evaluateFitnessLevelRule(exercise, user);
    ruleDetails.push(levelEval);

    // Prioridad 3: Equipamiento Disponible y Sustituciones
    const equipmentEval = evaluateEquipmentRule(exercise, user);
    ruleDetails.push(equipmentEval);

    // Prioridad 4: Lugar de Entrenamiento (HOME / GYM)
    const locationEval = evaluateLocationRule(exercise, user);
    ruleDetails.push(locationEval);

    // Prioridad 5: Alineación con Objetivos (Ponderación específica)
    const goalEval = evaluateGoalAlignmentRule(exercise, user);
    ruleDetails.push(goalEval);

    // Prioridad 6: Tiempo y Duración
    const timeEval = evaluateTimeConstraintsRule(exercise, user);
    ruleDetails.push(timeEval);

    // Prioridad 7: Intensidad Fisiológica
    const intensityEval = evaluateIntensityRule(exercise, user);
    ruleDetails.push(intensityEval);

    // Prioridad 8: Preferencias del Usuario
    const preferencesEval = evaluatePreferencesRule(exercise, user);
    ruleDetails.push(preferencesEval);

    // Prioridad 9: Morfología Corporal (Variable secundaria no diagnóstica)
    const morphologyEval = evaluateMorphologyRule(exercise, user);
    ruleDetails.push(morphologyEval);

    // =========================================================================
    // DETERMINACIÓN DE FALLO DE FILTRO DURO O REQUISITO DE MODIFICACIÓN
    // =========================================================================
    const failedHardFilters = ruleDetails.filter((r) => !r.passed && r.isHardFilter);
    const rulesWithModifications = ruleDetails.filter((r) => r.suggestedModification !== undefined);

    const hardFilterFailed = failedHardFilters.length > 0;
    const hasModifications = !hardFilterFailed && rulesWithModifications.length > 0;

    // Calcular el score estructurado mediante el motor de puntuación
    const { overallScore, scoreBreakdown, status } = ScoringEngine.calculate(
      ruleDetails,
      hardFilterFailed,
      hasModifications
    );

    // Construir explicaciones y notas
    if (hardFilterFailed) {
      failedHardFilters.forEach((f) => reasons.push(f.message));
    } else if (hasModifications) {
      rulesWithModifications.forEach((m) => {
        reasons.push(m.message);
        if (m.suggestedModification) {
          modificationNotes.push(m.suggestedModification);
        }
      });
    } else {
      reasons.push('Totalmente compatible con objetivos, nivel, equipamiento y sin conflicto articular.');
    }

    // =========================================================================
    // BÚSQUEDA Y PROPUESTA DE ALTERNATIVAS
    // =========================================================================
    let suggestedAlternative: AlternativeRecommendation | undefined;
    let suggestedAdaptation: CompatibilityEvaluationResult['suggestedAdaptation'];

    if (status !== CompatibilityStatus.COMPATIBLE) {
      suggestedAlternative = AlternativeFinder.find(exercise, user, library);

      if (suggestedAlternative) {
        suggestedAdaptation = {
          type:
            suggestedAlternative.substitutionType === 'LOW_IMPACT'
              ? 'LOW_IMPACT'
              : suggestedAlternative.substitutionType === 'NO_EQUIPMENT'
              ? 'NO_EQUIPMENT'
              : 'ALTERNATIVE_EXERCISE',
          title: suggestedAlternative.exerciseName,
          description: suggestedAlternative.howToPerform,
          alternativeExerciseId: suggestedAlternative.exerciseId,
        };
      } else if (modificationNotes.length > 0) {
        suggestedAdaptation = {
          type: 'INTENSITY_REDUCTION',
          title: 'Modificación biomecánica',
          description: modificationNotes[0],
        };
      }
    }

    return {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      status,
      overallScore,
      hardFilterFailed,
      reasons,
      safetyNotes,
      modificationNotes,
      ruleDetails,
      scoreBreakdown,
      suggestedAlternative,
      suggestedAdaptation,
    };
  }

  /**
   * Evalúa una colección completa de ejercicios frente a un perfil de usuario
   */
  public static evaluateBatch(
    exercises: Exercise[],
    user: UserProfile,
    library: Exercise[] = exercises
  ): CompatibilityBatchReport {
    const results = exercises.map((ex) => this.evaluate(ex, user, library));

    const compatibleCount = results.filter((r) => r.status === CompatibilityStatus.COMPATIBLE).length;
    const compatibleWithModificationCount = results.filter(
      (r) => r.status === CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION
    ).length;
    const notRecommendedCount = results.filter(
      (r) => r.status === CompatibilityStatus.NOT_RECOMMENDED
    ).length;

    const totalScoreSum = results.reduce((acc, curr) => acc + curr.overallScore, 0);
    const averageScore = exercises.length > 0 ? Math.round(totalScoreSum / exercises.length) : 0;

    return {
      evaluatedCount: exercises.length,
      compatibleCount,
      compatibleWithModificationCount,
      notRecommendedCount,
      averageScore,
      results,
    };
  }

  /**
   * Filtra y devuelve únicamente los ejercicios aptos para entrenar (COMPATIBLE o COMPATIBLE_WITH_MODIFICATION)
   */
  public static getCompatibleExercises(
    exercises: Exercise[],
    user: UserProfile,
    options: { includeModifications?: boolean; minScore?: number; library?: Exercise[] } = {}
  ): Exercise[] {
    const { includeModifications = true, minScore = 50, library = exercises } = options;
    const batch = this.evaluateBatch(exercises, user, library);

    return batch.results
      .filter((res) => {
        if (res.status === CompatibilityStatus.NOT_RECOMMENDED) return false;
        if (!includeModifications && res.status === CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION) return false;
        if (res.overallScore < minScore) return false;
        return true;
      })
      .map((res) => exercises.find((ex) => ex.id === res.exerciseId)!)
      .filter(Boolean);
  }

  /**
   * Ordena ejercicios compatibles por afinidad con el objetivo del usuario
   */
  public static rankExercisesForGoal(
    exercises: Exercise[],
    user: UserProfile,
    library: Exercise[] = exercises
  ): Array<{ exercise: Exercise; evaluation: CompatibilityEvaluationResult }> {
    const batch = this.evaluateBatch(exercises, user, library);

    return batch.results
      .filter((r) => r.status !== CompatibilityStatus.NOT_RECOMMENDED)
      .map((evalResult) => ({
        exercise: exercises.find((e) => e.id === evalResult.exerciseId)!,
        evaluation: evalResult,
      }))
      .filter((item) => item.exercise !== undefined)
      .sort((a, b) => b.evaluation.overallScore - a.evaluation.overallScore);
  }

  /**
   * Acceso directo a la búsqueda de alternativas
   */
  public static findBestAlternative(
    exercise: Exercise,
    user: UserProfile,
    library: Exercise[] = EXERCISE_LIBRARY
  ): AlternativeRecommendation | undefined {
    return AlternativeFinder.find(exercise, user, library);
  }
}
