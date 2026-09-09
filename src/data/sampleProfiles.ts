/**
 * FitAdapt - Perfiles de Prueba de Usuario
 * FASE 1: Arquitectura y Modelos Base
 */

import {
  UserProfile,
  FitnessGoal,
  FitnessLevel,
  TrainingLocation,
  HomeEquipment,
  GymEquipment,
  BodyMorphology,
  BiologicalSex,
  PhysicalLimitationCategory,
  LimitationSeverity,
} from '../types/user';

export const SAMPLE_USER_PROFILES: Record<string, UserProfile> = {
  profileKneeSensitivity: {
    id: 'user-sample-01',
    name: 'Ana Gómez',
    createdAt: '2026-09-01T10:00:00Z',
    updatedAt: '2026-09-01T10:00:00Z',
    
    age: 34,
    sex: BiologicalSex.FEMALE,
    heightCm: 165,
    weightKg: 64,
    morphology: BodyMorphology.HOURGLASS,
    
    fitnessLevel: FitnessLevel.BEGINNER,
    primaryGoal: FitnessGoal.TONING,
    secondaryGoals: [FitnessGoal.WEIGHT_LOSS],
    
    trainingLocation: TrainingLocation.HOME,
    availableEquipment: [HomeEquipment.NO_EQUIPMENT, HomeEquipment.MAT],
    availableTimeMinutes: 30,
    daysPerWeek: 3,
    
    limitations: [
      {
        id: 'lim-knee-01',
        code: 'KNEE_SENSITIVITY',
        name: 'Sensibilidad y molestia en rodillas al saltar o impacto',
        category: PhysicalLimitationCategory.JOINT,
        severity: LimitationSeverity.MILD_DISCOMFORT,
        affectedBodyAreas: ['LOWER_BODY'],
        requiresLowImpact: true,
      },
    ],
    
    preferences: {
      targetIntensity: 'LOW',
      preferredDurationMinutes: 30,
      daysPerWeek: 3,
      warmupPreference: true,
      cooldownPreference: true,
    },
    
    medicalSafety: {
      hasAcutePain: false,
      hasRecentSurgery: false,
      hasCardiovascularCondition: false,
      hasProfessionalMedicalClearance: true,
      acknowledgedNonMedicalDisclaimer: true,
    },
  },

  profileGymLumbar: {
    id: 'user-sample-02',
    name: 'Carlos Mendoza',
    createdAt: '2026-09-02T11:30:00Z',
    updatedAt: '2026-09-02T11:30:00Z',
    
    age: 42,
    sex: BiologicalSex.MALE,
    heightCm: 178,
    weightKg: 82,
    morphology: BodyMorphology.RECTANGULAR,
    
    fitnessLevel: FitnessLevel.INTERMEDIATE,
    primaryGoal: FitnessGoal.STRENGTH,
    secondaryGoals: [FitnessGoal.TONING],
    
    trainingLocation: TrainingLocation.GYM,
    availableEquipment: [
      GymEquipment.DUMBBELLS,
      GymEquipment.BARBELLS,
      GymEquipment.BENCH,
      GymEquipment.MACHINES,
      GymEquipment.CABLES_PULLEYS,
    ],
    availableTimeMinutes: 45,
    daysPerWeek: 4,
    
    limitations: [
      {
        id: 'lim-lumbar-02',
        code: 'LUMBAR_DISCOMFORT',
        name: 'Sobrecarga en zona lumbar con fatiga o rebote',
        category: PhysicalLimitationCategory.SPINE_BACK,
        severity: LimitationSeverity.MILD_DISCOMFORT,
        affectedBodyAreas: ['CORE', 'LOWER_BODY'],
        requiresLowImpact: true,
      },
    ],
    
    preferences: {
      targetIntensity: 'MEDIUM',
      preferredDurationMinutes: 45,
      daysPerWeek: 4,
    },
    
    medicalSafety: {
      hasAcutePain: false,
      hasRecentSurgery: false,
      hasCardiovascularCondition: false,
      hasProfessionalMedicalClearance: true,
      acknowledgedNonMedicalDisclaimer: true,
    },
  },

  profileBeginnerNoLimitations: {
    id: 'user-sample-03',
    name: 'Lucía Torres',
    createdAt: '2026-09-03T15:00:00Z',
    updatedAt: '2026-09-03T15:00:00Z',
    
    age: 28,
    sex: BiologicalSex.FEMALE,
    heightCm: 170,
    weightKg: 68,
    morphology: BodyMorphology.TRIANGULAR,
    
    fitnessLevel: FitnessLevel.BEGINNER,
    primaryGoal: FitnessGoal.WEIGHT_LOSS,
    secondaryGoals: [FitnessGoal.CARDIO],
    
    trainingLocation: TrainingLocation.HOME,
    availableEquipment: [HomeEquipment.NO_EQUIPMENT, HomeEquipment.MAT, HomeEquipment.BANDS],
    availableTimeMinutes: 25,
    daysPerWeek: 3,
    
    limitations: [],
    
    preferences: {
      targetIntensity: 'MEDIUM',
      preferredDurationMinutes: 25,
      daysPerWeek: 3,
    },
    
    medicalSafety: {
      hasAcutePain: false,
      hasRecentSurgery: false,
      hasCardiovascularCondition: false,
      hasProfessionalMedicalClearance: true,
      acknowledgedNonMedicalDisclaimer: true,
    },
  },
};

export const SAMPLE_PROFILES: UserProfile[] = Object.values(SAMPLE_USER_PROFILES);

