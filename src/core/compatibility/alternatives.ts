/**
 * FitAdapt - Motor de Búsqueda y Resolución de Alternativas
 * FASE 5: Motor de Personalización y Compatibilidad
 * 
 * Reglas de Búsqueda de Alternativas:
 * 1. Buscar alternativa equivalente.
 * 2. Priorizar misma categoría (Cardio, Fuerza, Tonificación, Movilidad, etc.).
 * 3. Priorizar mismo objetivo (Pérdida de peso, Fuerza, etc.).
 * 4. Mantener nivel técnico similar o regresión segura.
 * 5. Respetar 100% las limitaciones articulares del usuario.
 * 6. Respetar 100% el equipamiento disponible.
 * 7. Respetar el lugar de entrenamiento (Home vs Gym).
 */

import { Exercise, ExerciseCategory, ImpactLevel, ExerciseEquipment } from '../../types/exercise';
import { UserProfile, FitnessLevel } from '../../types/user';
import { AlternativeRecommendation, CompatibilityStatus } from '../../types/compatibility';
import {
  evaluateSafetyLimitationRule,
  evaluateEquipmentRule,
  evaluateLocationRule,
  evaluateFitnessLevelRule,
} from './rules';

export class AlternativeFinder {
  /**
   * Encuentra la alternativa biomecánica más adecuada para un ejercicio que no es apto
   * o que requiere modificación para el perfil del usuario.
   */
  public static find(
    exercise: Exercise,
    user: UserProfile,
    library: Exercise[]
  ): AlternativeRecommendation | undefined {
    const userHasLowImpactNeed = user.limitations?.some(
      (l) => l.requiresLowImpact || l.code.includes('KNEE') || l.code.includes('LUMBAR') || l.code.includes('ANKLE')
    );

    // =========================================================================
    // 1. ALTERNATIVAS DIRECTAS DECLARADAS EN LA FICHA BIOMECÁNICA
    // =========================================================================

    // A) Si el motivo es impacto articular y existe lowImpactAlternative explícita
    if (userHasLowImpactNeed && exercise.lowImpactAlternative) {
      if (exercise.lowImpactAlternative.exerciseId) {
        const altEx = library.find((e) => e.id === exercise.lowImpactAlternative?.exerciseId);
        if (altEx && this.isSafeForUser(altEx, user)) {
          return {
            exerciseId: altEx.id,
            exerciseName: altEx.name,
            substitutionType: 'LOW_IMPACT',
            reason: `Sustitución de bajo impacto recomendada para proteger articulaciones sensibles.`,
            howToPerform: exercise.lowImpactAlternative.howToPerform || altEx.description,
            exercise: altEx,
          };
        }
      }

      // Si no tiene id vinculado pero sí nombre y pauta
      return {
        exerciseId: `custom-low-impact-${exercise.id}`,
        exerciseName: exercise.lowImpactAlternative.name,
        substitutionType: 'LOW_IMPACT',
        reason: `Variante guiada de bajo impacto sin fase de vuelo ni rebotes.`,
        howToPerform: exercise.lowImpactAlternative.howToPerform,
      };
    }

    // B) Si el motivo es falta de equipamiento y existe noEquipmentAlternative
    const equipRule = evaluateEquipmentRule(exercise, user);
    if (!equipRule.passed && exercise.noEquipmentAlternative) {
      if (exercise.noEquipmentAlternative.exerciseId) {
        const altEx = library.find((e) => e.id === exercise.noEquipmentAlternative?.exerciseId);
        if (altEx && this.isSafeForUser(altEx, user)) {
          return {
            exerciseId: altEx.id,
            exerciseName: altEx.name,
            substitutionType: 'NO_EQUIPMENT',
            reason: `Alternativa directa con peso corporal disponible en el hogar.`,
            howToPerform: exercise.noEquipmentAlternative.howToPerform || altEx.description,
            exercise: altEx,
          };
        }
      }

      return {
        exerciseId: `custom-no-equip-${exercise.id}`,
        exerciseName: exercise.noEquipmentAlternative.name,
        substitutionType: 'NO_EQUIPMENT',
        reason: `Sustitución con peso corporal que emula el mismo patrón de movimiento.`,
        howToPerform: exercise.noEquipmentAlternative.howToPerform,
      };
    }

    // C) Lista de IDs alternativos vinculados (alternativeExerciseIds)
    if (exercise.alternativeExerciseIds && exercise.alternativeExerciseIds.length > 0) {
      for (const altId of exercise.alternativeExerciseIds) {
        const candidate = library.find((e) => e.id === altId);
        if (candidate && this.isSafeForUser(candidate, user)) {
          return {
            exerciseId: candidate.id,
            exerciseName: candidate.name,
            substitutionType: 'BIOMECHANICAL_EQUIVALENT',
            reason: `Variante anatómica equivalente para la misma cadena muscular (${candidate.bodyArea}).`,
            howToPerform: candidate.description,
            exercise: candidate,
          };
        }
      }
    }

    // =========================================================================
    // 2. BÚSQUEDA COMBINATORIA EN LA BIBLIOTECA COMPLETA (FALLBACK INTELIGENTE)
    // =========================================================================
    const viableCandidates = library.filter((candidate) => {
      // No compararse a sí mismo
      if (candidate.id === exercise.id) return false;

      // 100% seguro para las limitaciones del usuario (Hard rule)
      const safety = evaluateSafetyLimitationRule(candidate, user);
      if (!safety.passed) return false;

      // 100% disponible según equipamiento
      const equip = evaluateEquipmentRule(candidate, user);
      if (!equip.passed) return false;

      // 100% compatible con lugar (Home / Gym)
      const loc = evaluateLocationRule(candidate, user);
      if (!loc.passed) return false;

      // Nivel adecuado
      const level = evaluateFitnessLevelRule(candidate, user);
      if (!level.passed && level.isHardFilter) return false;

      return true;
    });

    if (viableCandidates.length === 0) {
      return undefined;
    }

    // Ponderar y rankear candidatos viables
    const scoredCandidates = viableCandidates.map((candidate) => {
      let score = 0;

      // 1. Misma categoría
      const isSameCategory =
        candidate.category === exercise.category ||
        candidate.categories?.some((c) => exercise.categories?.includes(c));
      if (isSameCategory) score += 40;

      // 2. Misma zona corporal / músculo principal
      if (candidate.bodyArea === exercise.bodyArea) score += 30;
      if (candidate.primaryMuscle === exercise.primaryMuscle) score += 20;

      // 3. Mismo objetivo
      if (candidate.goalCompatibility?.includes(user.primaryGoal)) score += 25;

      // 4. Mismo nivel
      if (candidate.fitnessLevel === exercise.fitnessLevel) score += 15;

      // 5. Preferencia de bajo impacto si el usuario lo requiere
      if (userHasLowImpactNeed && candidate.impactLevel === ImpactLevel.LOW) {
        score += 25;
      }

      return { candidate, score };
    });

    scoredCandidates.sort((a, b) => b.score - a.score);

    const best = scoredCandidates[0].candidate;
    const substitutionType =
      userHasLowImpactNeed && best.impactLevel === ImpactLevel.LOW
        ? 'LOW_IMPACT'
        : !best.equipment.length || best.equipment.includes(ExerciseEquipment.NONE)
        ? 'NO_EQUIPMENT'
        : 'BIOMECHANICAL_EQUIVALENT';

    return {
      exerciseId: best.id,
      exerciseName: best.name,
      substitutionType,
      reason: `Sustituto óptimo encontrado en la biblioteca: Misma zona (${best.bodyArea}), categoría (${best.category}) y totalmente seguro para tu perfil.`,
      howToPerform: best.description,
      exercise: best,
    };
  }

  /**
   * Comprueba si un ejercicio propuesto cumple con seguridad, equipamiento y lugar
   */
  private static isSafeForUser(exercise: Exercise, user: UserProfile): boolean {
    const safety = evaluateSafetyLimitationRule(exercise, user);
    if (!safety.passed) return false;

    const equip = evaluateEquipmentRule(exercise, user);
    if (!equip.passed) return false;

    const loc = evaluateLocationRule(exercise, user);
    if (!loc.passed) return false;

    return true;
  }
}
