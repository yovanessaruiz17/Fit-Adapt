/**
 * FitAdapt - Constantes Maestras del Dominio Fitness
 * FASE 1: Arquitectura y Modelos Base
 */

import {
  FitnessGoal,
  FitnessLevel,
  BodyMorphology,
  TrainingLocation,
  HomeEquipment,
  GymEquipment,
  PhysicalLimitationCategory,
  LimitationSeverity,
  PhysicalLimitation,
} from '../types/user';

export const FITNESS_GOALS_METADATA: Record<
  FitnessGoal,
  {
    name: string;
    description: string;
    focusAreas: string[];
    recommendedIntensity: 'LOW' | 'MEDIUM' | 'HIGH';
  }
> = {
  [FitnessGoal.WEIGHT_LOSS]: {
    name: 'Pérdida de peso',
    description: 'Enfoque en gasto calórico saludable, preservación de masa muscular y acondicionamiento general.',
    focusAreas: ['Acondicionamiento metabólico', 'Circuitos globales', 'Intervalos controlados'],
    recommendedIntensity: 'MEDIUM',
  },
  [FitnessGoal.TONING]: {
    name: 'Tonificación',
    description: 'Mejora de la densidad muscular, resistencia a la fuerza y postura corporal equilibrada.',
    focusAreas: ['Resistencia muscular', 'Control excéntrico', 'Ejercicios multiarticulares'],
    recommendedIntensity: 'MEDIUM',
  },
  [FitnessGoal.CARDIO]: {
    name: 'Cardio',
    description: 'Desarrollo de capacidad aeróbica, salud cardiovascular y resistencia sostenida.',
    focusAreas: ['Capacidad aeróbica', 'Eficiencia cardiovascular', 'Ritmo constante'],
    recommendedIntensity: 'MEDIUM',
  },
  [FitnessGoal.STRENGTH]: {
    name: 'Fuerza',
    description: 'Incremento progresivo de la fuerza máxima y potencia funcional con sobrecarga controlada.',
    focusAreas: ['Sobrecarga progresiva', 'Patrones básicos de movimiento', 'Tensión mecánica'],
    recommendedIntensity: 'HIGH',
  },
  [FitnessGoal.MOBILITY]: {
    name: 'Movilidad/flexibilidad',
    description: 'Amplitud de movimiento articular, descompresión, equilibrio muscular y prevención.',
    focusAreas: ['Rango de movimiento articular', 'Control motor', 'Flexibilidad activa'],
    recommendedIntensity: 'LOW',
  },
};

export const FITNESS_LEVELS_METADATA: Record<
  FitnessLevel,
  {
    name: string;
    description: string;
    recommendedRestSeconds: number;
    maxRecommendedWeeklyDays: number;
  }
> = {
  [FitnessLevel.BEGINNER]: {
    name: 'Principiante',
    description: 'Aprendizaje técnico de patrones básicos, adaptación neuromuscular y construcción de base sin fatiga extrema.',
    recommendedRestSeconds: 90,
    maxRecommendedWeeklyDays: 3,
  },
  [FitnessLevel.INTERMEDIATE]: {
    name: 'Intermedio',
    description: 'Experiencia previa constante (6+ meses). Capacidad para tolerar mayor volumen e intensidad controlada.',
    recommendedRestSeconds: 60,
    maxRecommendedWeeklyDays: 4,
  },
  [FitnessLevel.ADVANCED]: {
    name: 'Avanzado',
    description: 'Experiencia consolidada (2+ años). Alta tolerancia al esfuerzo y conocimiento exhaustivo de la técnica.',
    recommendedRestSeconds: 45,
    maxRecommendedWeeklyDays: 5,
  },
};

export const BODY_MORPHOLOGY_METADATA: Record<
  BodyMorphology,
  {
    name: string;
    disclaimer: string;
    ergonomicFocus: string;
  }
> = {
  [BodyMorphology.RECTANGULAR]: {
    name: 'Rectangular',
    disclaimer: 'Variable descriptiva no diagnóstica. La forma corporal no determina tus límites de salud.',
    ergonomicFocus: 'Balance integral de fuerza en tren superior y cadenas cruzadas para alineación postural.',
  },
  [BodyMorphology.TRIANGULAR]: {
    name: 'Triangular',
    disclaimer: 'Variable descriptiva no diagnóstica. No existe la reducción localizada de grasa.',
    ergonomicFocus: 'Equilibrio postural promoviendo apertura torácica y fortalecimiento de cintura escapular.',
  },
  [BodyMorphology.INVERTED_TRIANGLE]: {
    name: 'Triángulo invertido',
    disclaimer: 'Variable descriptiva no diagnóstica. No existe la reducción localizada de grasa.',
    ergonomicFocus: 'Estabilidad de cadera, fuerza en cadena posterior y soporte en miembros inferiores.',
  },
  [BodyMorphology.HOURGLASS]: {
    name: 'Reloj de arena',
    disclaimer: 'Variable descriptiva no diagnóstica. No existe la reducción localizada de grasa.',
    ergonomicFocus: 'Distribución uniforme de volumen y estabilidad de la musculatura profunda del core.',
  },
  [BodyMorphology.OVAL]: {
    name: 'Ovalada',
    disclaimer: 'Variable descriptiva no diagnóstica. El foco es la salud metabólica y el movimiento sin impacto articular excesivo.',
    ergonomicFocus: 'Protección articular, progresión en ejercicios de bajo impacto y soporte lumbar.',
  },
};

export const HOME_EQUIPMENT_OPTIONS: { id: HomeEquipment; label: string; icon: string }[] = [
  { id: HomeEquipment.NO_EQUIPMENT, label: 'Sin equipamiento (Peso corporal)', icon: 'User' },
  { id: HomeEquipment.MAT, label: 'Colchoneta / Esterilla', icon: 'Layers' },
  { id: HomeEquipment.BANDS, label: 'Bandas elásticas', icon: 'Activity' },
  { id: HomeEquipment.DUMBBELLS, label: 'Mancuernas', icon: 'Dumbbell' },
  { id: HomeEquipment.KETTLEBELL, label: 'Kettlebell (Pesa rusa)', icon: 'Flame' },
  { id: HomeEquipment.BENCH, label: 'Banco o silla firme', icon: 'Armchair' },
  { id: HomeEquipment.OTHER, label: 'Otro accesorio', icon: 'PlusCircle' },
];

export const GYM_EQUIPMENT_OPTIONS: { id: GymEquipment; label: string; icon: string }[] = [
  { id: GymEquipment.DUMBBELLS, label: 'Mancuernas', icon: 'Dumbbell' },
  { id: GymEquipment.BARBELLS, label: 'Barras y discos', icon: 'Minus' },
  { id: GymEquipment.CABLES_PULLEYS, label: 'Poleas y cables', icon: 'GitCommit' },
  { id: GymEquipment.MACHINES, label: 'Máquinas de fuerza', icon: 'Cpu' },
  { id: GymEquipment.TREADMILL, label: 'Caminadora', icon: 'Zap' },
  { id: GymEquipment.STATIONARY_BIKE, label: 'Bicicleta estática', icon: 'CircleDot' },
  { id: GymEquipment.ELLIPTICAL, label: 'Elíptica', icon: 'Repeat' },
  { id: GymEquipment.BENCH, label: 'Banco regulable', icon: 'Sliders' },
  { id: GymEquipment.OTHER, label: 'Otro equipamiento', icon: 'PlusCircle' },
];

/**
 * Catálogo maestro inicial de limitaciones físicas estándar
 * Utilizado por el motor de compatibilidad para evaluar incompatibilidades biomecánicas.
 */
export const STANDARD_PHYSICAL_LIMITATIONS: PhysicalLimitation[] = [
  {
    id: 'lim-1',
    code: 'KNEE_SENSITIVITY',
    name: 'Molestias en rodillas / Sensibilidad rotuliana',
    category: PhysicalLimitationCategory.JOINT,
    severity: LimitationSeverity.MILD_DISCOMFORT,
    affectedBodyAreas: ['LOWER_BODY'],
    incompatibleMovements: ['SQUAT_DEEP', 'HIGH_IMPACT_JUMP', 'JUMP_LUNGE'],
    requiresLowImpact: true,
    notes: 'Priorizar ángulo de rodilla no mayor a 90°, bisagras de cadera y bajo impacto.',
  },
  {
    id: 'lim-2',
    code: 'LUMBAR_DISCOMFORT',
    name: 'Molestias lumbares / Sobrecarga de espalda baja',
    category: PhysicalLimitationCategory.SPINE_BACK,
    severity: LimitationSeverity.MILD_DISCOMFORT,
    affectedBodyAreas: ['CORE', 'LOWER_BODY'],
    incompatibleMovements: ['HEAVY_DEADLIFT', 'STANDING_OVERHEAD_PRESS', 'HYPEREXTENSION'],
    requiresLowImpact: true,
    notes: 'Evitar cargas axiales pesadas y flexión de columna bajo carga sin soporte.',
  },
  {
    id: 'lim-3',
    code: 'SHOULDER_IMPINGEMENT',
    name: 'Molestias en hombros / Inestabilidad escapular',
    category: PhysicalLimitationCategory.JOINT,
    severity: LimitationSeverity.MILD_DISCOMFORT,
    affectedBodyAreas: ['UPPER_BODY'],
    incompatibleMovements: ['OVERHEAD_PRESS_FULL', 'BEHIND_NECK_PULL', 'DEEP_DIP'],
    requiresLowImpact: false,
    notes: 'Evitar abducción superior a 90° bajo fatiga o cargas verticales forzadas.',
  },
  {
    id: 'lim-4',
    code: 'WRIST_DISCOMFORT',
    name: 'Molestias en muñecas / Dolor al apoyar las manos en suelo',
    category: PhysicalLimitationCategory.JOINT,
    severity: LimitationSeverity.MILD_DISCOMFORT,
    affectedBodyAreas: ['UPPER_BODY'],
    incompatibleMovements: ['STANDARD_FLOOR_PUSHDOWN', 'HANDSTAND', 'BURPEES_FLOOR'],
    requiresLowImpact: false,
    notes: 'Sustituir por apoyo sobre puños neutros, mancuernas o antebrazos.',
  },
  {
    id: 'lim-5',
    code: 'CARDIO_LOW_IMPACT_ONLY',
    name: 'Requerimiento estricto de bajo impacto articular',
    category: PhysicalLimitationCategory.CARDIOVASCULAR,
    severity: LimitationSeverity.MODERATE_LIMITATION,
    affectedBodyAreas: ['FULL_BODY'],
    incompatibleMovements: ['BURPEES', 'JUMPING_JACKS', 'BOX_JUMP', 'TUCK_JUMP'],
    requiresLowImpact: true,
    notes: 'Sustituir todo salto por paso continuo, step-touch o pedaleo suave.',
  },
];
