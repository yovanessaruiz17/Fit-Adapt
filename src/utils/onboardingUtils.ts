/**
 * FitAdapt - Utilidades y Mapeo del Onboarding
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import {
  OnboardingData,
  OnboardingStepNumber,
  BodyJointArea,
  UserSelectedLimitation,
} from '../types/onboarding';
import {
  UserProfile,
  FitnessGoal,
  FitnessLevel,
  BiologicalSex,
  BodyMorphology,
  TrainingLocation,
  HomeEquipment,
  GymEquipment,
  PhysicalLimitation,
  PhysicalLimitationCategory,
  LimitationSeverity,
} from '../types/user';

export const ONBOARDING_DRAFT_STORAGE_KEY = 'fitadapt_onboarding_draft';
export const USER_PROFILE_STORAGE_KEY = 'fitadapt_user_profile';

export const INITIAL_ONBOARDING_DATA: OnboardingData = {
  hasAcceptedTerms: true,
  name: '',
  age: '',
  sex: '',
  heightCm: '',
  weightKg: '',
  primaryGoal: '',
  fitnessLevel: '',
  trainingLocation: TrainingLocation.HOME,
  availableEquipment: [HomeEquipment.NO_EQUIPMENT],
  daysPerWeek: 3,
  durationMinutes: 30,
  preferredIntensity: 'MEDIUM',
  morphology: 'NONE',
  hasNoLimitations: true,
  limitations: [],
  medicalClearanceAcknowledged: false,
};

/**
 * Guarda el progreso del onboarding en localStorage
 */
export function saveOnboardingDraft(data: OnboardingData, currentStep: OnboardingStepNumber): void {
  try {
    const payload = JSON.stringify({ data, currentStep, savedAt: new Date().toISOString() });
    localStorage.setItem(ONBOARDING_DRAFT_STORAGE_KEY, payload);
  } catch (err) {
    console.warn('No se pudo guardar el borrador de onboarding en localStorage:', err);
  }
}

/**
 * Carga el progreso guardado de onboarding
 */
export function loadOnboardingDraft(): { data: OnboardingData; currentStep: OnboardingStepNumber } | null {
  try {
    const raw = localStorage.getItem(ONBOARDING_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.data && typeof parsed.currentStep === 'number') {
      return {
        data: { ...INITIAL_ONBOARDING_DATA, ...parsed.data },
        currentStep: parsed.currentStep as OnboardingStepNumber,
      };
    }
  } catch (err) {
    console.warn('Error al leer borrador de onboarding:', err);
  }
  return null;
}

/**
 * Limpia el borrador del onboarding tras completarlo
 */
export function clearOnboardingDraft(): void {
  try {
    localStorage.removeItem(ONBOARDING_DRAFT_STORAGE_KEY);
  } catch (err) {
    console.warn('Error al limpiar borrador:', err);
  }
}

/**
 * Guarda el perfil final en localStorage
 */
export function saveUserProfileToStorage(profile: UserProfile): void {
  try {
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
  } catch (err) {
    console.warn('Error al guardar perfil en almacenamiento local:', err);
  }
}

/**
 * Carga el perfil desde localStorage si existe
 */
export function loadUserProfileFromStorage(): UserProfile | null {
  try {
    const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UserProfile;
  } catch (err) {
    console.warn('Error al cargar perfil guardado:', err);
  }
  return null;
}

/**
 * Mapeo de áreas articulares a limitaciones físicas estructuradas
 */
export function mapJointAreaToLimitation(
  selected: UserSelectedLimitation,
  index: number
): PhysicalLimitation {
  const codeMap: Record<BodyJointArea, { code: string; name: string; category: PhysicalLimitationCategory; area: string; requiresLowImpact: boolean; incompatible: string[] }> = {
    NONE: {
      code: 'NO_LIMITATION',
      name: 'Sin limitaciones declaradas',
      category: PhysicalLimitationCategory.OTHER,
      area: 'GENERAL',
      requiresLowImpact: false,
      incompatible: [],
    },
    KNEE: {
      code: 'KNEE_SENSITIVITY',
      name: 'Molestias en Rodilla',
      category: PhysicalLimitationCategory.JOINT,
      area: 'LOWER_BODY',
      requiresLowImpact: true,
      incompatible: ['SQUAT_DEEP', 'HIGH_IMPACT_JUMP', 'JUMP_LUNGE'],
    },
    ANKLE: {
      code: 'ANKLE_DISCOMFORT',
      name: 'Molestias en Tobillo',
      category: PhysicalLimitationCategory.JOINT,
      area: 'LOWER_BODY',
      requiresLowImpact: true,
      incompatible: ['HIGH_IMPACT_JUMP', 'BOX_JUMP'],
    },
    HIP: {
      code: 'HIP_DISCOMFORT',
      name: 'Molestias en Cadera',
      category: PhysicalLimitationCategory.JOINT,
      area: 'LOWER_BODY',
      requiresLowImpact: true,
      incompatible: ['DEEP_SUMO_SQUAT', 'AGGRESSIVE_HIP_FLEXION'],
    },
    LOWER_BACK: {
      code: 'LUMBAR_DISCOMFORT',
      name: 'Molestias en Espalda Baja (Lumbar)',
      category: PhysicalLimitationCategory.SPINE_BACK,
      area: 'CORE',
      requiresLowImpact: true,
      incompatible: ['HEAVY_DEADLIFT', 'STANDING_OVERHEAD_PRESS', 'HYPEREXTENSION'],
    },
    UPPER_BACK: {
      code: 'UPPER_BACK_DISCOMFORT',
      name: 'Molestias en Espalda Alta (Dorsal / Escapular)',
      category: PhysicalLimitationCategory.SPINE_BACK,
      area: 'UPPER_BODY',
      requiresLowImpact: false,
      incompatible: ['BEHIND_NECK_PULL', 'ROUNDED_HEAVY_ROW'],
    },
    SHOULDER: {
      code: 'SHOULDER_IMPINGEMENT',
      name: 'Molestias en Hombro',
      category: PhysicalLimitationCategory.JOINT,
      area: 'UPPER_BODY',
      requiresLowImpact: false,
      incompatible: ['OVERHEAD_PRESS_FULL', 'BEHIND_NECK_PULL', 'DEEP_DIP'],
    },
    ELBOW: {
      code: 'ELBOW_DISCOMFORT',
      name: 'Molestias en Codo',
      category: PhysicalLimitationCategory.JOINT,
      area: 'UPPER_BODY',
      requiresLowImpact: false,
      incompatible: ['HEAVY_TRICEPS_OVERHEAD', 'SKULL_CRUSHER'],
    },
    WRIST: {
      code: 'WRIST_DISCOMFORT',
      name: 'Molestias en Muñeca',
      category: PhysicalLimitationCategory.JOINT,
      area: 'UPPER_BODY',
      requiresLowImpact: false,
      incompatible: ['STANDARD_FLOOR_PUSHDOWN', 'HANDSTAND', 'BURPEES_FLOOR'],
    },
    NECK: {
      code: 'NECK_DISCOMFORT',
      name: 'Molestias en Cuello / Cervical',
      category: PhysicalLimitationCategory.SPINE_BACK,
      area: 'UPPER_BODY',
      requiresLowImpact: true,
      incompatible: ['BEHIND_NECK_EXERCISES', 'CERVICAL_CRUNCH_PULL'],
    },
    OTHER: {
      code: 'OTHER_DISCOMFORT',
      name: selected.customDescription ? `Otra: ${selected.customDescription}` : 'Otra molestia corporal',
      category: PhysicalLimitationCategory.OTHER,
      area: 'GENERAL',
      requiresLowImpact: selected.severity === LimitationSeverity.ACUTE_REQUIRES_CLEARANCE,
      incompatible: [],
    },
  };

  const meta = codeMap[selected.area];
  return {
    id: `lim-user-${index + 1}`,
    code: meta.code,
    name: meta.name,
    category: meta.category,
    severity: selected.severity,
    affectedBodyAreas: [meta.area],
    incompatibleMovements: meta.incompatible,
    requiresLowImpact: meta.requiresLowImpact || selected.severity === LimitationSeverity.ACUTE_REQUIRES_CLEARANCE,
    notes: selected.customDescription || `Registrado durante el onboarding inicial. Severidad: ${selected.severity}`,
  };
}

/**
 * Convierte el estado final del Onboarding en un UserProfile completo y tipado
 */
export function convertOnboardingDataToProfile(data: OnboardingData): UserProfile {
  const hasSeverePain = data.limitations.some(
    (l) => l.severity === LimitationSeverity.ACUTE_REQUIRES_CLEARANCE
  );

  const mappedLimitations: PhysicalLimitation[] = data.hasNoLimitations
    ? []
    : data.limitations.map((lim, idx) => mapJointAreaToLimitation(lim, idx));

  const parsedGoal = (data.primaryGoal || FitnessGoal.TONING) as FitnessGoal;
  const parsedLevel = (data.fitnessLevel || FitnessLevel.BEGINNER) as FitnessLevel;

  const now = new Date().toISOString();

  return {
    id: `user-${Date.now()}`,
    name: data.name.trim() || 'Atleta FitAdapt',
    createdAt: now,
    updatedAt: now,

    age: typeof data.age === 'number' ? data.age : 30,
    sex: data.sex ? (data.sex as BiologicalSex) : BiologicalSex.OTHER_PREFER_NOT_TO_SAY,
    heightCm: typeof data.heightCm === 'number' ? data.heightCm : 170,
    weightKg: typeof data.weightKg === 'number' ? data.weightKg : 70,
    morphology: data.morphology !== 'NONE' ? (data.morphology as BodyMorphology) : undefined,

    fitnessLevel: parsedLevel,
    primaryGoal: parsedGoal,
    secondaryGoals: [],

    trainingLocation: data.trainingLocation,
    availableEquipment: data.availableEquipment.length > 0
      ? data.availableEquipment
      : [data.trainingLocation === TrainingLocation.HOME ? HomeEquipment.NO_EQUIPMENT : GymEquipment.DUMBBELLS],
    availableTimeMinutes: data.durationMinutes,
    daysPerWeek: data.daysPerWeek,

    limitations: mappedLimitations,
    preferences: {
      targetIntensity: data.preferredIntensity,
      preferredDurationMinutes: data.durationMinutes,
      daysPerWeek: data.daysPerWeek,
      warmupPreference: true,
      cooldownPreference: true,
    },
    medicalSafety: {
      hasAcutePain: hasSeverePain,
      hasRecentSurgery: false,
      hasCardiovascularCondition: false,
      hasProfessionalMedicalClearance: data.medicalClearanceAcknowledged,
      acknowledgedNonMedicalDisclaimer: true,
      lastDeclarationDate: now,
    },
  };
}

/**
 * Validador por cada paso para no permitir avanzar si faltan datos
 */
export function validateOnboardingStep(
  step: OnboardingStepNumber,
  data: OnboardingData
): { isValid: boolean; error?: string } {
  switch (step) {
    case 1:
      // Bienvenida: siempre válido para comenzar
      return { isValid: true };

    case 2: {
      // Información básica
      if (!data.name.trim()) {
        return { isValid: false, error: 'Por favor indica tu nombre o cómo prefieres que te llamemos.' };
      }
      if (data.name.trim().length < 2) {
        return { isValid: false, error: 'El nombre debe tener al menos 2 caracteres.' };
      }
      if (typeof data.age !== 'number' || isNaN(data.age)) {
        return { isValid: false, error: 'Por favor ingresa tu edad.' };
      }
      if (data.age < 14 || data.age > 105) {
        return { isValid: false, error: 'La edad debe estar comprendida en un rango razonable (entre 14 y 105 años).' };
      }
      if (!data.sex) {
        return { isValid: false, error: 'Por favor selecciona una opción de sexo biológico o referencia.' };
      }
      if (typeof data.heightCm !== 'number' || isNaN(data.heightCm)) {
        return { isValid: false, error: 'Por favor ingresa tu altura en centímetros.' };
      }
      if (data.heightCm < 120 || data.heightCm > 240) {
        return { isValid: false, error: 'La altura debe estar entre 120 cm y 240 cm.' };
      }
      if (typeof data.weightKg !== 'number' || isNaN(data.weightKg)) {
        return { isValid: false, error: 'Por favor ingresa tu peso en kilogramos.' };
      }
      if (data.weightKg < 35 || data.weightKg > 260) {
        return { isValid: false, error: 'El peso debe estar entre 35 kg y 260 kg.' };
      }
      return { isValid: true };
    }

    case 3:
      // Objetivo principal
      if (!data.primaryGoal) {
        return { isValid: false, error: 'Por favor selecciona tu objetivo principal.' };
      }
      return { isValid: true };

    case 4:
      // Nivel
      if (!data.fitnessLevel) {
        return { isValid: false, error: 'Por favor selecciona tu nivel actual de entrenamiento.' };
      }
      return { isValid: true };

    case 5:
      // Lugar de entrenamiento
      if (!data.trainingLocation) {
        return { isValid: false, error: 'Por favor selecciona si entrenarás en Casa o en Gimnasio.' };
      }
      return { isValid: true };

    case 6:
      // Equipamiento
      if (!data.availableEquipment || data.availableEquipment.length === 0) {
        return { isValid: false, error: 'Selecciona al menos una opción de equipamiento (o "Sin equipamiento").' };
      }
      return { isValid: true };

    case 7:
      // Disponibilidad
      if (!data.daysPerWeek || data.daysPerWeek < 1 || data.daysPerWeek > 7) {
        return { isValid: false, error: 'Selecciona entre 1 y 7 días por semana.' };
      }
      if (!data.durationMinutes) {
        return { isValid: false, error: 'Selecciona la duración estimada de cada sesión.' };
      }
      if (!data.preferredIntensity) {
        return { isValid: false, error: 'Selecciona tu intensidad de trabajo preferida.' };
      }
      return { isValid: true };

    case 8:
      // Morfología: 100% opcional
      return { isValid: true };

    case 9: {
      // Limitaciones
      if (data.hasNoLimitations) {
        return { isValid: true };
      }
      if (data.limitations.length === 0) {
        return {
          isValid: false,
          error: 'Has desmarcado "Ninguna". Selecciona al menos una zona con molestia o vuelve a marcar "Ninguna".',
        };
      }
      // Validar si seleccionó "OTHER" y no escribió nada
      const otherLim = data.limitations.find((l) => l.area === 'OTHER');
      if (otherLim && (!otherLim.customDescription || !otherLim.customDescription.trim())) {
        return { isValid: false, error: 'Por favor describe brevemente la molestia en la opción "Otra".' };
      }
      return { isValid: true };
    }

    case 10:
      // Resumen & Confirmación
      if (!data.medicalClearanceAcknowledged) {
        return {
          isValid: false,
          error: 'Debes confirmar que comprendes el enfoque no médico de FitAdapt y tu compromiso de seguridad física.',
        };
      }
      return { isValid: true };

    default:
      return { isValid: true };
  }
}
