/**
 * FitAdapt - Tipos y Estructuras del Onboarding
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import {
  FitnessGoal,
  FitnessLevel,
  BiologicalSex,
  BodyMorphology,
  TrainingLocation,
  HomeEquipment,
  GymEquipment,
  AnyEquipment,
  LimitationSeverity,
} from './user';

export type OnboardingStepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type BodyJointArea =
  | 'NONE'
  | 'KNEE'
  | 'ANKLE'
  | 'HIP'
  | 'LOWER_BACK'
  | 'UPPER_BACK'
  | 'SHOULDER'
  | 'ELBOW'
  | 'WRIST'
  | 'NECK'
  | 'OTHER';

export interface UserSelectedLimitation {
  area: BodyJointArea;
  severity: LimitationSeverity;
  customDescription?: string;
}

export type WorkoutDurationOption = 15 | 20 | 30 | 45 | 60;
export type PreferredIntensityOption = 'LOW' | 'MEDIUM' | 'HIGH';

export interface OnboardingData {
  // Paso 1: Bienvenida (consentimiento inicial)
  hasAcceptedTerms: boolean;

  // Paso 2: Información básica
  name: string;
  age: number | '';
  sex: BiologicalSex | '';
  heightCm: number | '';
  weightKg: number | '';

  // Paso 3: Objetivo principal
  primaryGoal: FitnessGoal | '';

  // Paso 4: Nivel
  fitnessLevel: FitnessLevel | '';

  // Paso 5: Lugar
  trainingLocation: TrainingLocation;

  // Paso 6: Equipamiento disponible
  availableEquipment: AnyEquipment[];

  // Paso 7: Disponibilidad
  daysPerWeek: number;
  durationMinutes: WorkoutDurationOption;
  preferredIntensity: PreferredIntensityOption;

  // Paso 8: Morfología opcional
  morphology: BodyMorphology | 'NONE';

  // Paso 9: Limitaciones / molestias
  hasNoLimitations: boolean;
  limitations: UserSelectedLimitation[];

  // Paso 10: Resumen & Confirmación
  medicalClearanceAcknowledged: boolean;
}

export interface OnboardingStepInfo {
  step: OnboardingStepNumber;
  title: string;
  subtitle: string;
  description?: string;
}
