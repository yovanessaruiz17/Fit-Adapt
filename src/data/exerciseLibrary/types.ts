/**
 * FitAdapt - Tipos y Creadores de la Biblioteca de Ejercicios
 * FASE 4: Biblioteca de Ejercicios Estructurada
 */

import {
  Exercise,
  ExerciseCategory,
  MovementType,
  BodyArea,
  MuscleGroup,
  ImpactLevel,
  IntensityLevel,
  ExerciseEquipment,
  JointLimitationArea,
  JointLimitationStatus,
  ExerciseLimitationMap,
  ExerciseInstructionStep,
  ExerciseAlternative,
} from '../../types/exercise';
import { FitnessGoal, FitnessLevel, TrainingLocation, HomeEquipment, GymEquipment, AnyEquipment } from '../../types/user';

/**
 * Generador de mapa de compatibilidad articular
 * Por defecto todas las articulaciones son COMPATIBLE, permitiendo
 * sobreescribir únicamente las que requieran modificación o desaconsejo.
 */
export function createLimitationProfile(
  overrides?: Partial<
    Record<
      JointLimitationArea,
      { status: JointLimitationStatus; notes?: string; modificationGuidance?: string }
    >
  >
): ExerciseLimitationMap {
  const base: ExerciseLimitationMap = {
    [JointLimitationArea.KNEE]: { status: 'COMPATIBLE', notes: 'Sin estrés lesivo significativo en rodillas.' },
    [JointLimitationArea.ANKLE]: { status: 'COMPATIBLE', notes: 'Rango de dorsiflexión y carga tolerables.' },
    [JointLimitationArea.HIP]: { status: 'COMPATIBLE', notes: 'Flexo-extensión biomecánicamente segura.' },
    [JointLimitationArea.LOWER_BACK]: { status: 'COMPATIBLE', notes: 'Posición neutra de la columna lumbar.' },
    [JointLimitationArea.UPPER_BACK]: { status: 'COMPATIBLE', notes: 'Sin compresión ni hiperextensión dorsal.' },
    [JointLimitationArea.SHOULDER]: { status: 'COMPATIBLE', notes: 'Plano escapular respetado.' },
    [JointLimitationArea.ELBOW]: { status: 'COMPATIBLE', notes: 'Sin hiperextensión ni sobrecarga en tendón de tríceps/bíceps.' },
    [JointLimitationArea.WRIST]: { status: 'COMPATIBLE', notes: 'Muñeca alineada o sin carga de compresión.' },
    [JointLimitationArea.NECK]: { status: 'COMPATIBLE', notes: 'Columna cervical en prolongación neutra.' },
  };

  return { ...base, ...overrides };
}

/**
 * Helper para construir un ejercicio completo garantizando que tanto
 * las propiedades de FASE 4 como las de retrocompatibilidad con FASE 1-3
 * estén siempre sincronizadas.
 */
export function buildExercise(params: {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ExerciseCategory;
  categories: ExerciseCategory[];
  goalCompatibility: FitnessGoal[];
  fitnessLevel: FitnessLevel;
  primaryMuscle: MuscleGroup | string;
  secondaryMuscles: (MuscleGroup | string)[];
  movementType: MovementType;
  bodyArea: BodyArea;
  equipment: ExerciseEquipment[];
  location: TrainingLocation[];
  impactLevel: ImpactLevel;
  intensity: IntensityLevel;
  defaultDuration: number;
  defaultReps: number | { min: number; max: number };
  defaultSets: number;
  defaultRest: number;
  instructions: ExerciseInstructionStep[];
  commonMistakes: string[];
  contraindications: string[];
  incompatibleLimitations: string[];
  incompatibleLimitationCodes: string[];
  alternativeExerciseIds: string[];
  lowImpactAlternative?: ExerciseAlternative;
  noEquipmentAlternative?: ExerciseAlternative;
  limitationProfile: ExerciseLimitationMap;
}): Exercise {
  // Mapeo automático de equipamiento FASE 4 a AnyEquipment FASE 1
  const mappedRequiredEquipment: AnyEquipment[] = params.equipment.map((eq) => {
    switch (eq) {
      case ExerciseEquipment.NONE:
        return HomeEquipment.NO_EQUIPMENT;
      case ExerciseEquipment.MAT:
        return HomeEquipment.MAT;
      case ExerciseEquipment.RESISTANCE_BAND:
        return HomeEquipment.BANDS;
      case ExerciseEquipment.DUMBBELLS:
        return HomeEquipment.DUMBBELLS;
      case ExerciseEquipment.KETTLEBELL:
        return HomeEquipment.KETTLEBELL;
      case ExerciseEquipment.BENCH:
        return HomeEquipment.BENCH;
      case ExerciseEquipment.BARBELL:
        return GymEquipment.BARBELLS;
      case ExerciseEquipment.CABLE:
        return GymEquipment.CABLES_PULLEYS;
      case ExerciseEquipment.MACHINE:
        return GymEquipment.MACHINES;
      case ExerciseEquipment.TREADMILL:
        return GymEquipment.TREADMILL;
      case ExerciseEquipment.BIKE:
        return GymEquipment.STATIONARY_BIKE;
      case ExerciseEquipment.ELLIPTICAL:
        return GymEquipment.ELLIPTICAL;
      default:
        return HomeEquipment.NO_EQUIPMENT;
    }
  });

  return {
    ...params,
    primaryGoal: params.goalCompatibility[0] || FitnessGoal.TONING,
    secondaryGoals: params.goalCompatibility.slice(1),
    targetLevel: params.fitnessLevel,
    minLevelAllowed: params.fitnessLevel === FitnessLevel.ADVANCED ? FitnessLevel.INTERMEDIATE : FitnessLevel.BEGINNER,
    requiredEquipment: mappedRequiredEquipment,
    compatibleLocations: params.location,
    impact: params.impactLevel,
    defaultDurationSeconds: params.defaultDuration,
    defaultRestSeconds: params.defaultRest,
    lowImpactVersion: params.lowImpactAlternative
      ? {
          exerciseId: params.lowImpactAlternative.exerciseId,
          title: params.lowImpactAlternative.name,
          description: params.lowImpactAlternative.description,
          howToPerform: params.lowImpactAlternative.howToPerform,
        }
      : undefined,
    noEquipmentVersion: params.noEquipmentAlternative
      ? {
          exerciseId: params.noEquipmentAlternative.exerciseId,
          title: params.noEquipmentAlternative.name,
          description: params.noEquipmentAlternative.description,
          howToPerform: params.noEquipmentAlternative.howToPerform,
        }
      : undefined,
  };
}
