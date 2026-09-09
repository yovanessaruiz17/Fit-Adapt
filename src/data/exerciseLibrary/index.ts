/**
 * FitAdapt - Índice y Motor de la Biblioteca de Ejercicios
 * FASE 4: Biblioteca de Ejercicios Estructurada
 * 
 * Agrega, valida, cataloga y expone utilidades de búsqueda, filtrado
 * y cálculo de alternativas para su consumo por el motor de compatibilidad
 * y el futuro generador de rutinas (FASE 5).
 */

import { Exercise, ExerciseCategory, BodyArea, ExerciseEquipment, ImpactLevel, JointLimitationArea, JointLimitationEffect } from '../../types/exercise';
import { FitnessLevel, FitnessGoal, TrainingLocation } from '../../types/user';
import { CARDIO_EXERCISES } from './cardioExercises';
import { STRENGTH_EXERCISES } from './strengthExercises';
import { TONING_EXERCISES } from './toningExercises';
import { MOBILITY_EXERCISES } from './mobilityExercises';
import { FULL_BODY_EXERCISES } from './fullBodyExercises';

// Unificación y deduplicación de ejercicios
const rawCollection: Exercise[] = [
  ...CARDIO_EXERCISES,
  ...STRENGTH_EXERCISES,
  ...TONING_EXERCISES,
  ...MOBILITY_EXERCISES,
  ...FULL_BODY_EXERCISES,
];

// Mapa indexado por ID para acceso O(1)
const exerciseMap = new Map<string, Exercise>();
rawCollection.forEach((ex) => {
  if (!exerciseMap.has(ex.id)) {
    exerciseMap.set(ex.id, ex);
  }
});

/**
 * Biblioteca completa y estructurada de FitAdapt (FASE 4)
 */
export const EXERCISE_LIBRARY: Exercise[] = Array.from(exerciseMap.values());

/**
 * Conteo y estadísticas oficiales de la biblioteca para verificación
 */
export const LIBRARY_METRICS = {
  totalExercises: EXERCISE_LIBRARY.length,
  countsByCategory: {
    [ExerciseCategory.CARDIO]: EXERCISE_LIBRARY.filter((e) =>
      e.categories.includes(ExerciseCategory.CARDIO) || e.category === ExerciseCategory.CARDIO
    ).length,
    [ExerciseCategory.STRENGTH]: EXERCISE_LIBRARY.filter((e) =>
      e.categories.includes(ExerciseCategory.STRENGTH) || e.category === ExerciseCategory.STRENGTH
    ).length,
    [ExerciseCategory.TONING]: EXERCISE_LIBRARY.filter((e) =>
      e.categories.includes(ExerciseCategory.TONING) || e.category === ExerciseCategory.TONING
    ).length,
    [ExerciseCategory.MOBILITY]: EXERCISE_LIBRARY.filter((e) =>
      e.categories.includes(ExerciseCategory.MOBILITY) || e.category === ExerciseCategory.MOBILITY
    ).length,
    [ExerciseCategory.FULL_BODY]: EXERCISE_LIBRARY.filter((e) =>
      e.categories.includes(ExerciseCategory.FULL_BODY) || e.category === ExerciseCategory.FULL_BODY
    ).length,
    [ExerciseCategory.LOW_IMPACT]: EXERCISE_LIBRARY.filter((e) =>
      e.categories.includes(ExerciseCategory.LOW_IMPACT) ||
      e.category === ExerciseCategory.LOW_IMPACT ||
      e.impactLevel === ImpactLevel.LOW
    ).length,
  },
  countsByLevel: {
    [FitnessLevel.BEGINNER]: EXERCISE_LIBRARY.filter((e) => e.fitnessLevel === FitnessLevel.BEGINNER).length,
    [FitnessLevel.INTERMEDIATE]: EXERCISE_LIBRARY.filter((e) => e.fitnessLevel === FitnessLevel.INTERMEDIATE).length,
    [FitnessLevel.ADVANCED]: EXERCISE_LIBRARY.filter((e) => e.fitnessLevel === FitnessLevel.ADVANCED).length,
  },
  countsByImpact: {
    [ImpactLevel.LOW]: EXERCISE_LIBRARY.filter((e) => e.impactLevel === ImpactLevel.LOW).length,
    [ImpactLevel.MEDIUM]: EXERCISE_LIBRARY.filter((e) => e.impactLevel === ImpactLevel.MEDIUM).length,
    [ImpactLevel.HIGH]: EXERCISE_LIBRARY.filter((e) => e.impactLevel === ImpactLevel.HIGH).length,
  },
};

/**
 * Obtiene un ejercicio por su ID único
 */
export function getExerciseById(id: string): Exercise | undefined {
  return exerciseMap.get(id);
}

/**
 * Filtra ejercicios por categoría (considerando pertenencia múltiple)
 */
export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return EXERCISE_LIBRARY.filter(
    (ex) => ex.category === category || ex.categories.includes(category)
  );
}

/**
 * Filtra ejercicios por zona corporal
 */
export function getExercisesByBodyArea(area: BodyArea): Exercise[] {
  return EXERCISE_LIBRARY.filter((ex) => ex.bodyArea === area);
}

/**
 * Filtra ejercicios por equipamiento requerido
 */
export function getExercisesByEquipment(equipment: ExerciseEquipment): Exercise[] {
  return EXERCISE_LIBRARY.filter((ex) => ex.equipment.includes(equipment));
}

/**
 * Filtra ejercicios por nivel técnico
 */
export function getExercisesByLevel(level: FitnessLevel): Exercise[] {
  return EXERCISE_LIBRARY.filter((ex) => ex.fitnessLevel === level);
}

/**
 * Filtra ejercicios por nivel de impacto articular
 */
export function getExercisesByImpact(impact: ImpactLevel): Exercise[] {
  return EXERCISE_LIBRARY.filter((ex) => ex.impactLevel === impact);
}

/**
 * Evalúa el impacto y compatibilidad articular de un ejercicio frente a una articulación
 */
export function getJointLimitationEffect(
  exercise: Exercise,
  joint: JointLimitationArea
): JointLimitationEffect {
  if (exercise.limitationProfile && exercise.limitationProfile[joint]) {
    return exercise.limitationProfile[joint];
  }
  return { status: 'COMPATIBLE', notes: 'Sin incompatibilidad registrada.' };
}

/**
 * Encuentra un sustituto o alternativa estructurada para un ejercicio dado.
 * Preparado para el motor de sustitución automática de FASE 5.
 */
export function findAlternativeForExercise(
  exercise: Exercise,
  preference: 'LOW_IMPACT' | 'NO_EQUIPMENT' | 'DIRECT_SUBSTITUTE'
): {
  exercise?: Exercise;
  customAlternativeTitle?: string;
  howToPerform?: string;
  source: 'library_reference' | 'embedded_spec' | 'none';
} {
  // 1. Alternativa de Bajo Impacto
  if (preference === 'LOW_IMPACT' && exercise.lowImpactAlternative) {
    if (exercise.lowImpactAlternative.exerciseId) {
      const target = getExerciseById(exercise.lowImpactAlternative.exerciseId);
      if (target) {
        return {
          exercise: target,
          customAlternativeTitle: exercise.lowImpactAlternative.name,
          howToPerform: exercise.lowImpactAlternative.howToPerform,
          source: 'library_reference',
        };
      }
    }
    return {
      customAlternativeTitle: exercise.lowImpactAlternative.name,
      howToPerform: exercise.lowImpactAlternative.howToPerform,
      source: 'embedded_spec',
    };
  }

  // 2. Alternativa Sin Equipamiento (Peso Corporal)
  if (preference === 'NO_EQUIPMENT' && exercise.noEquipmentAlternative) {
    if (exercise.noEquipmentAlternative.exerciseId) {
      const target = getExerciseById(exercise.noEquipmentAlternative.exerciseId);
      if (target) {
        return {
          exercise: target,
          customAlternativeTitle: exercise.noEquipmentAlternative.name,
          howToPerform: exercise.noEquipmentAlternative.howToPerform,
          source: 'library_reference',
        };
      }
    }
    return {
      customAlternativeTitle: exercise.noEquipmentAlternative.name,
      howToPerform: exercise.noEquipmentAlternative.howToPerform,
      source: 'embedded_spec',
    };
  }

  // 3. Primer sustituto directo en la lista de alternativas
  if (exercise.alternativeExerciseIds && exercise.alternativeExerciseIds.length > 0) {
    for (const altId of exercise.alternativeExerciseIds) {
      const altEx = getExerciseById(altId);
      if (altEx) {
        return {
          exercise: altEx,
          customAlternativeTitle: altEx.name,
          howToPerform: altEx.description,
          source: 'library_reference',
        };
      }
    }
  }

  return { source: 'none' };
}

/**
 * Consulta avanzada para el generador de rutinas y motor de compatibilidad (FASE 5)
 */
export interface ExerciseFilterCriteria {
  categories?: ExerciseCategory[];
  goals?: FitnessGoal[];
  levels?: FitnessLevel[];
  bodyAreas?: BodyArea[];
  equipmentAllowed?: ExerciseEquipment[];
  maxImpact?: ImpactLevel;
  location?: TrainingLocation;
  sensitiveJoints?: JointLimitationArea[];
}

export function filterExerciseLibrary(criteria: ExerciseFilterCriteria): Exercise[] {
  return EXERCISE_LIBRARY.filter((ex) => {
    // Categoría
    if (criteria.categories && criteria.categories.length > 0) {
      const matchesCategory = criteria.categories.some(
        (cat) => ex.category === cat || ex.categories.includes(cat)
      );
      if (!matchesCategory) return false;
    }

    // Objetivo
    if (criteria.goals && criteria.goals.length > 0) {
      const matchesGoal = criteria.goals.some((g) => ex.goalCompatibility.includes(g));
      if (!matchesGoal) return false;
    }

    // Nivel
    if (criteria.levels && criteria.levels.length > 0) {
      if (!criteria.levels.includes(ex.fitnessLevel)) return false;
    }

    // Zona corporal
    if (criteria.bodyAreas && criteria.bodyAreas.length > 0) {
      if (!criteria.bodyAreas.includes(ex.bodyArea)) return false;
    }

    // Equipamiento permitido
    if (criteria.equipmentAllowed && criteria.equipmentAllowed.length > 0) {
      const hasAllRequired = ex.equipment.every(
        (eq) => eq === ExerciseEquipment.NONE || criteria.equipmentAllowed?.includes(eq)
      );
      if (!hasAllRequired) return false;
    }

    // Impacto máximo permitido
    if (criteria.maxImpact) {
      if (criteria.maxImpact === ImpactLevel.LOW && ex.impactLevel !== ImpactLevel.LOW) {
        return false;
      }
      if (
        criteria.maxImpact === ImpactLevel.MEDIUM &&
        ex.impactLevel === ImpactLevel.HIGH
      ) {
        return false;
      }
    }

    // Ubicación
    if (criteria.location) {
      if (!ex.location.includes(criteria.location)) return false;
    }

    // Articulaciones sensibles (descarta las marcadas como NOT_RECOMMENDED)
    if (criteria.sensitiveJoints && criteria.sensitiveJoints.length > 0) {
      for (const joint of criteria.sensitiveJoints) {
        const effect = getJointLimitationEffect(ex, joint);
        if (effect.status === 'NOT_RECOMMENDED') {
          return false;
        }
      }
    }

    return true;
  });
}
