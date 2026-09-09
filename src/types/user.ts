/**
 * FitAdapt - Tipos y Modelos del Usuario
 * FASE 1: Arquitectura y Modelos Base
 */

export enum FitnessGoal {
  WEIGHT_LOSS = 'WEIGHT_LOSS',
  TONING = 'TONING',
  CARDIO = 'CARDIO',
  STRENGTH = 'STRENGTH',
  MOBILITY = 'MOBILITY',
}

export enum FitnessLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum BiologicalSex {
  FEMALE = 'FEMALE',
  MALE = 'MALE',
  OTHER_PREFER_NOT_TO_SAY = 'OTHER_PREFER_NOT_TO_SAY',
}

/**
 * Morfología corporal autodeclarada.
 * REGLA ESTRICTA: No se utiliza para diagnósticos médicos ni promesas de quema
 * de grasa localizada. Es una variable secundaria descriptiva de preferencia y ajuste ergonómico.
 */
export enum BodyMorphology {
  RECTANGULAR = 'RECTANGULAR',
  TRIANGULAR = 'TRIANGULAR',
  INVERTED_TRIANGLE = 'INVERTED_TRIANGLE',
  HOURGLASS = 'HOURGLASS',
  OVAL = 'OVAL',
}

export enum TrainingLocation {
  HOME = 'HOME',
  GYM = 'GYM',
}

export enum HomeEquipment {
  NO_EQUIPMENT = 'NO_EQUIPMENT', // Sin equipamiento / Peso corporal
  MAT = 'MAT',                   // Colchoneta / Esterilla
  BANDS = 'BANDS',               // Bandas elásticas
  DUMBBELLS = 'DUMBBELLS',       // Mancuernas
  KETTLEBELL = 'KETTLEBELL',     // Pesa rusa
  BENCH = 'BENCH',               // Banco
  OTHER = 'OTHER',               // Otro
}

export enum GymEquipment {
  DUMBBELLS = 'DUMBBELLS',       // Mancuernas
  BARBELLS = 'BARBELLS',         // Barras y discos
  CABLES_PULLEYS = 'CABLES_PULLEYS', // Poleas
  MACHINES = 'MACHINES',         // Máquinas de palanca/selectorizadas
  TREADMILL = 'TREADMILL',       // Cinta de correr
  STATIONARY_BIKE = 'STATIONARY_BIKE', // Bicicleta estática
  ELLIPTICAL = 'ELLIPTICAL',     // Elíptica
  BENCH = 'BENCH',               // Banco regulable
  OTHER = 'OTHER',               // Otro
}

export type AnyEquipment = HomeEquipment | GymEquipment;

export enum PhysicalLimitationCategory {
  JOINT = 'JOINT',             // Articular (ej. rodillas, hombros)
  SPINE_BACK = 'SPINE_BACK',   // Espalda / Columna (ej. lumbar, cervical)
  CARDIOVASCULAR = 'CARDIOVASCULAR', // Cardiovascular (requiere bajo impacto)
  POSTURAL = 'POSTURAL',       // Postural / Movilidad reducida
  OTHER = 'OTHER',
}

export enum LimitationSeverity {
  MILD_DISCOMFORT = 'MILD_DISCOMFORT',       // Molestia leve / Zona sensible
  MODERATE_LIMITATION = 'MODERATE_LIMITATION', // Limitación funcional moderada
  ACUTE_REQUIRES_CLEARANCE = 'ACUTE_REQUIRES_CLEARANCE', // Dolor agudo / Alerta médica
}

export interface PhysicalLimitation {
  id: string;
  code: string; // ej. 'KNEE_SENSITIVITY', 'LUMBAR_DISCOMFORT', 'SHOULDER_IMPINGEMENT'
  name: string; // ej. 'Molestias en rodillas / Condromalacia'
  category: PhysicalLimitationCategory;
  severity: LimitationSeverity;
  affectedBodyAreas: string[];
  incompatibleMovements?: string[];
  requiresLowImpact?: boolean;
  notes?: string;
}

export interface UserPreferences {
  targetIntensity: 'LOW' | 'MEDIUM' | 'HIGH';
  preferredDurationMinutes: number; // e.g. 20, 30, 45, 60
  daysPerWeek: number; // 1 to 7
  secondaryGoals?: FitnessGoal[];
  warmupPreference?: boolean;
  cooldownPreference?: boolean;
}

export interface MedicalSafetyDeclaration {
  hasAcutePain: boolean;
  hasRecentSurgery: boolean;
  hasCardiovascularCondition: boolean;
  hasProfessionalMedicalClearance: boolean;
  acknowledgedNonMedicalDisclaimer: boolean;
  lastDeclarationDate?: string;
}

export interface UserProfile {
  id: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
  
  // Datos antropométricos autodeclarados
  age?: number;
  sex?: BiologicalSex;
  heightCm?: number;
  weightKg?: number;
  morphology?: BodyMorphology;
  
  // Nivel y Objetivos
  fitnessLevel: FitnessLevel;
  primaryGoal: FitnessGoal;
  secondaryGoals: FitnessGoal[];
  
  // Entorno y disponibilidad
  trainingLocation: TrainingLocation;
  availableEquipment: AnyEquipment[];
  availableTimeMinutes: number;
  daysPerWeek: number;
  
  // Seguridad y limitaciones (Prioridad Máxima del Motor)
  limitations: PhysicalLimitation[];
  preferences: UserPreferences;
  medicalSafety: MedicalSafetyDeclaration;
}
