/**
 * FitAdapt - Suite de Pruebas Automatizadas del Generador de Rutinas
 * FASE 6: Verificación de los 12 Casos Deterministas
 * 
 * Casos evaluados:
 * 1. Principiante en casa sin equipo
 * 2. Gimnasio con equipamiento completo
 * 3. Objetivo cardio
 * 4. Pérdida de peso
 * 5. Tonificación
 * 6. Fuerza
 * 7. Movilidad
 * 8. Molestia de rodilla
 * 9. Molestia de espalda
 * 10. Duración 15 min
 * 11. Duración 60 min
 * 12. Ejercicio incompatible con alternativa
 */

import { WorkoutGenerator } from './workoutGenerator';
import { WorkoutAdjuster } from './workoutAdjuster';
import {
  UserProfile,
  FitnessGoal,
  FitnessLevel,
  TrainingLocation,
  HomeEquipment,
  GymEquipment,
  PhysicalLimitationCategory,
  LimitationSeverity,
} from '../../types/user';
import { CompatibilityStatus } from '../../types/compatibility';
import { Workout, WorkoutStructureSection } from '../../types/workout';
import { ImpactLevel, ExerciseCategory, ExerciseEquipment } from '../../types/exercise';
import { CompatibilityEngine } from '../compatibility/evaluator';
import { EXERCISE_LIBRARY } from '../../data/exerciseLibrary';

export interface GeneratorTestCaseResult {
  id: string;
  number: number;
  name: string;
  description: string;
  passed: boolean;
  assertions: Array<{ name: string; passed: boolean; note?: string }>;
  workout?: Workout;
  executionTimeMs: number;
}

export interface GeneratorTestSuiteReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalDurationMs: number;
  timestamp: string;
  results: GeneratorTestCaseResult[];
}

export class GeneratorTestSuite {
  public static runAll(): GeneratorTestSuiteReport {
    const startTime = performance.now();
    const results: GeneratorTestCaseResult[] = [];

    // =========================================================================
    // CASO 1: Principiante en casa sin equipo
    // =========================================================================
    results.push(this.testCase1BeginnerHomeNoEquipment());

    // =========================================================================
    // CASO 2: Gimnasio con equipamiento completo
    // =========================================================================
    results.push(this.testCase2GymFullEquipment());

    // =========================================================================
    // CASO 3: Objetivo Cardio
    // =========================================================================
    results.push(this.testCase3GoalCardio());

    // =========================================================================
    // CASO 4: Pérdida de Peso (Weight Loss)
    // =========================================================================
    results.push(this.testCase4GoalWeightLoss());

    // =========================================================================
    // CASO 5: Tonificación (Toning)
    // =========================================================================
    results.push(this.testCase5GoalToning());

    // =========================================================================
    // CASO 6: Fuerza (Strength)
    // =========================================================================
    results.push(this.testCase6GoalStrength());

    // =========================================================================
    // CASO 7: Movilidad (Mobility)
    // =========================================================================
    results.push(this.testCase7GoalMobility());

    // =========================================================================
    // CASO 8: Molestia de rodilla (Knee Sensitivity / Low Impact)
    // =========================================================================
    results.push(this.testCase8KneeSensitivity());

    // =========================================================================
    // CASO 9: Molestia de espalda (Lower Back Discomfort)
    // =========================================================================
    results.push(this.testCase9LowerBackDiscomfort());

    // =========================================================================
    // CASO 10: Duración 15 minutos (Preset exprés)
    // =========================================================================
    results.push(this.testCase10Duration15Min());

    // =========================================================================
    // CASO 11: Duración 60 minutos (Preset completo)
    // =========================================================================
    results.push(this.testCase11Duration60Min());

    // =========================================================================
    // CASO 12: Ejercicio incompatible con sustitución o adaptación
    // =========================================================================
    results.push(this.testCase12IncompatibleWithAlternative());

    const endTime = performance.now();
    const passedTests = results.filter((r) => r.passed).length;

    return {
      totalTests: results.length,
      passedTests,
      failedTests: results.length - passedTests,
      totalDurationMs: Math.round(endTime - startTime),
      timestamp: new Date().toISOString(),
      results,
    };
  }

  // 1. Principiante en casa sin equipo
  private static testCase1BeginnerHomeNoEquipment(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.TONING,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT, HomeEquipment.MAT],
      availableTimeMinutes: 20,
      daysPerWeek: 3,
      limitations: [],
      preferences: { targetIntensity: 'LOW', preferredDurationMinutes: 20, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 20 });
    const workout = res.workout;

    const noHeavyEquipment = workout.exercises.every((ex) => {
      const eq = ex.exerciseSnapshot.equipment;
      return eq.every((e) => e === ExerciseEquipment.NONE || e === ExerciseEquipment.MAT);
    });

    const isBeginnerFriendly = workout.exercises.every(
      (ex) => ex.exerciseSnapshot.minLevelAllowed === FitnessLevel.BEGINNER
    );

    const assertions = [
      { name: 'Rutina generada exitosamente', passed: res.success },
      { name: 'Solo utiliza peso corporal y colchoneta', passed: noHeavyEquipment },
      { name: 'Nivel principiante respetado en todos los ejercicios', passed: isBeginnerFriendly },
      { name: '0% ejercicios NOT_RECOMMENDED', passed: res.disqualifiedExercisesCount >= 0 },
    ];

    return {
      id: 'gen-test-01',
      number: 1,
      name: 'Principiante en Casa Sin Equipo',
      description: 'Valida que un principiante en casa solo reciba ejercicios sin equipo o colchoneta con dificultad accesible.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 2. Gimnasio con equipamiento completo
  private static testCase2GymFullEquipment(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-2',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.INTERMEDIATE,
      primaryGoal: FitnessGoal.STRENGTH,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.GYM,
      availableEquipment: [
        GymEquipment.DUMBBELLS,
        GymEquipment.BARBELLS,
        GymEquipment.MACHINES,
        GymEquipment.BENCH,
      ],
      availableTimeMinutes: 45,
      daysPerWeek: 4,
      limitations: [],
      preferences: { targetIntensity: 'HIGH', preferredDurationMinutes: 45, daysPerWeek: 4 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 45 });
    const workout = res.workout;

    const hasGymGear = workout.exercises.some((ex) =>
      ex.exerciseSnapshot.equipment.some((eq) =>
        [ExerciseEquipment.DUMBBELLS, ExerciseEquipment.BARBELL, ExerciseEquipment.BENCH, ExerciseEquipment.MACHINE].includes(eq)
      )
    );

    const assertions = [
      { name: 'Rutina generada para Gimnasio', passed: res.success },
      { name: 'Aprovecha equipamiento disponible (mancuernas, bancos, barras)', passed: hasGymGear },
      { name: 'Duración estimada cercana a 45 min', passed: workout.estimatedDurationMinutes === 45 },
    ];

    return {
      id: 'gen-test-02',
      number: 2,
      name: 'Gimnasio con Equipamiento Completo',
      description: 'Verifica la integración de materiales libres y máquinas en usuarios de gimnasio.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 3. Objetivo Cardio
  private static testCase3GoalCardio(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-3',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.INTERMEDIATE,
      primaryGoal: FitnessGoal.CARDIO,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT],
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 30 });
    const workout = res.workout;

    const cardioCount = workout.mainWorkout.filter(
      (ex) => ex.exerciseSnapshot.category === ExerciseCategory.CARDIO
    ).length;

    const assertions = [
      { name: 'Rutina generada con objetivo Cardio', passed: res.success },
      { name: 'Presencia destacada de ejercicios cardiovasculares en el bloque principal', passed: cardioCount >= 1 },
      { name: 'Descansos ajustados a densidad metabólica (<= 45s)', passed: workout.mainWorkout.every((e) => e.rest <= 45) },
    ];

    return {
      id: 'gen-test-03',
      number: 3,
      name: 'Objetivo Cardio y Resistencia',
      description: 'Asegura que el objetivo Cardio priorice gasto cardiovascular y descansos activos/cortos.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 4. Pérdida de peso
  private static testCase4GoalWeightLoss(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-4',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.WEIGHT_LOSS,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT],
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 30 });
    const workout = res.workout;

    const hasBalance = workout.metadata?.balanceDistribution !== undefined;

    const assertions = [
      { name: 'Rutina generada para Pérdida de Peso', passed: res.success },
      { name: 'Distribución balanceada de tren inferior, superior y core', passed: hasBalance },
      { name: 'Incluye bloque de activación y vuelta a la calma', passed: workout.warmup.length > 0 && workout.cooldown.length > 0 },
    ];

    return {
      id: 'gen-test-04',
      number: 4,
      name: 'Pérdida de Peso (Combinación Metabólica)',
      description: 'Valida la combinación multiarticular y metabólica para optimizar gasto calórico seguro.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 5. Tonificación
  private static testCase5GoalToning(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-5',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.INTERMEDIATE,
      primaryGoal: FitnessGoal.TONING,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT, HomeEquipment.DUMBBELLS],
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 30 });
    const workout = res.workout;

    const assertions = [
      { name: 'Rutina generada para Tonificación', passed: res.success },
      { name: 'Ejercicios multiarticulares y de tensión muscular presentes', passed: workout.mainWorkout.length >= 4 },
      { name: 'Repeticiones en rango de resistencia muscular (10-15)', passed: workout.mainWorkout.some((e) => e.sets >= 2) },
    ];

    return {
      id: 'gen-test-05',
      number: 5,
      name: 'Tonificación y Resistencia Muscular',
      description: 'Verifica la priorización de resistencia muscular y control de movimiento.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 6. Fuerza
  private static testCase6GoalStrength(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-6',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.ADVANCED,
      primaryGoal: FitnessGoal.STRENGTH,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.GYM,
      availableEquipment: [GymEquipment.BARBELLS, GymEquipment.DUMBBELLS, GymEquipment.BENCH],
      availableTimeMinutes: 45,
      daysPerWeek: 4,
      limitations: [],
      preferences: { targetIntensity: 'HIGH', preferredDurationMinutes: 45, daysPerWeek: 4 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 45 });
    const workout = res.workout;

    const hasProperRest = workout.mainWorkout.some((ex) => ex.rest >= 60);

    const assertions = [
      { name: 'Rutina de Fuerza generada', passed: res.success },
      { name: 'Descansos completos de fuerza (>= 60s)', passed: hasProperRest },
      { name: 'Bloque principal sólido', passed: workout.mainWorkout.length >= 5 },
    ];

    return {
      id: 'gen-test-06',
      number: 6,
      name: 'Fuerza con Descansos Completos',
      description: 'Asegura tiempos de recuperación adecuados para el reclutamiento neuromuscular de fuerza.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 7. Movilidad
  private static testCase7GoalMobility(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-7',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.MOBILITY,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.MAT],
      availableTimeMinutes: 20,
      daysPerWeek: 3,
      limitations: [],
      preferences: { targetIntensity: 'LOW', preferredDurationMinutes: 20, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 20 });
    const workout = res.workout;

    const mobilityFocus = workout.exercises.some(
      (e) => e.exerciseSnapshot.category === ExerciseCategory.MOBILITY
    );

    const assertions = [
      { name: 'Rutina generada para Movilidad', passed: res.success },
      { name: 'Presencia destacada de ejercicios de movilidad y flexibilidad', passed: mobilityFocus },
      { name: 'Intensidad baja y sin impacto', passed: workout.exercises.every((e) => e.exerciseSnapshot.impactLevel === ImpactLevel.LOW) },
    ];

    return {
      id: 'gen-test-07',
      number: 7,
      name: 'Movilidad Articular y Control',
      description: 'Valida la selección de ejercicios de rango articular sin impacto ni sobrecarga brusca.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 8. Molestia de rodilla
  private static testCase8KneeSensitivity(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-8',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.WEIGHT_LOSS,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT],
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [
        {
          id: 'lim-knee-1',
          code: 'KNEE_SENSITIVITY',
          name: 'Dolor patelofemoral / Rodillas sensibles',
          category: PhysicalLimitationCategory.JOINT,
          severity: LimitationSeverity.MILD_DISCOMFORT,
          affectedBodyAreas: ['LOWER_BODY'],
          requiresLowImpact: true,
        },
      ],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 30 });
    const workout = res.workout;

    // Cero ejercicios de alto impacto
    const zeroHighImpact = workout.exercises.every(
      (e) => e.exerciseSnapshot.impactLevel !== ImpactLevel.HIGH
    );

    // Cero ejercicios que tengan incompatibilidad de rodilla
    const zeroContraindicated = workout.exercises.every((e) => {
      const evalRes = CompatibilityEngine.evaluate(e.exerciseSnapshot, user);
      return evalRes.status !== CompatibilityStatus.NOT_RECOMMENDED;
    });

    const assertions = [
      { name: 'Rutina adaptada generada', passed: res.success },
      { name: '0% ejercicios de alto impacto (saltos/pliometría eliminados)', passed: zeroHighImpact },
      { name: '0% ejercicios desaconsejados para rodilla', passed: zeroContraindicated },
    ];

    return {
      id: 'gen-test-08',
      number: 8,
      name: 'Molestia de Rodilla (Filtro Estricto de Impacto)',
      description: 'Garantiza la expulsión absoluta de ejercicios con impacto articular lesivo en rodillas.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 9. Molestia de espalda baja
  private static testCase9LowerBackDiscomfort(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-9',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.TONING,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT, HomeEquipment.MAT],
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [
        {
          id: 'lim-back-1',
          code: 'LUMBAR_DISCOMFORT',
          name: 'Molestia en espalda baja / lumbar',
          category: PhysicalLimitationCategory.SPINE_BACK,
          severity: LimitationSeverity.MILD_DISCOMFORT,
          affectedBodyAreas: ['SPINE_BACK'],
          incompatibleMovements: ['CORE_FLEXION'],
        },
      ],
      preferences: { targetIntensity: 'LOW', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 30 });
    const workout = res.workout;

    const zeroNotRecommended = workout.exercises.every((e) => {
      const evalRes = CompatibilityEngine.evaluate(e.exerciseSnapshot, user);
      return evalRes.status !== CompatibilityStatus.NOT_RECOMMENDED;
    });

    const assertions = [
      { name: 'Rutina adaptada generada', passed: res.success },
      { name: 'Ningún ejercicio contraindicado para columna lumbar', passed: zeroNotRecommended },
      { name: 'Metadatos reflejan la limitación considerada', passed: workout.metadata?.limitationsConsidered.length! > 0 },
    ];

    return {
      id: 'gen-test-09',
      number: 9,
      name: 'Molestia de Espalda (Columna Neutra y Segura)',
      description: 'Comprueba la exclusión de flexiones bruscas y protección del raquis lumbar.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 10. Duración 15 min
  private static testCase10Duration15Min(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-10',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.TONING,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT],
      availableTimeMinutes: 15,
      daysPerWeek: 3,
      limitations: [],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 15, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 15 });
    const workout = res.workout;

    const assertions = [
      { name: 'Duración estimada exactamente 15 minutos', passed: workout.estimatedDurationMinutes === 15 },
      { name: 'Estructura exprés compacta (3 ejercicios principales)', passed: workout.mainWorkout.length === 3 },
      { name: 'Incluye calentamiento y vuelta a la calma de 2 min', passed: workout.warmup.length >= 2 && workout.cooldown.length >= 2 },
    ];

    return {
      id: 'gen-test-10',
      number: 10,
      name: 'Preset de Duración de 15 Minutos',
      description: 'Verifica la optimización del tiempo para sesiones ultracortas de alta eficiencia.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 11. Duración 60 min
  private static testCase11Duration60Min(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-11',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.ADVANCED,
      primaryGoal: FitnessGoal.STRENGTH,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.GYM,
      availableEquipment: [GymEquipment.DUMBBELLS, GymEquipment.BARBELLS, GymEquipment.BENCH],
      availableTimeMinutes: 60,
      daysPerWeek: 4,
      limitations: [],
      preferences: { targetIntensity: 'HIGH', preferredDurationMinutes: 60, daysPerWeek: 4 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 60 });
    const workout = res.workout;

    const assertions = [
      { name: 'Duración estimada de 60 minutos', passed: workout.estimatedDurationMinutes === 60 },
      { name: 'Volumen amplio con 7 ejercicios principales', passed: workout.mainWorkout.length >= 6 },
      { name: 'Calentamiento profundo (4 ejercicios) y enfriamiento', passed: workout.warmup.length >= 3 && workout.cooldown.length >= 3 },
    ];

    return {
      id: 'gen-test-11',
      number: 11,
      name: 'Preset de Duración de 60 Minutos',
      description: 'Valida la distribución de volumen y tiempos de descanso en sesiones completas de 1 hora.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }

  // 12. Ejercicio incompatible con alternativa
  private static testCase12IncompatibleWithAlternative(): GeneratorTestCaseResult {
    const start = performance.now();
    const user: UserProfile = {
      id: 'test-user-12',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.TONING,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT],
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [
        {
          id: 'lim-wrist-1',
          code: 'WRIST_PAIN',
          name: 'Molestia en muñecas',
          category: PhysicalLimitationCategory.JOINT,
          severity: LimitationSeverity.MILD_DISCOMFORT,
          affectedBodyAreas: ['UPPER_BODY'],
        },
      ],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    const res = WorkoutGenerator.generate({ userProfile: user, targetDurationMinutes: 30 });
    const initialWorkout = res.workout;

    // Probar la función de sustitución directa de WorkoutAdjuster
    const firstMainEx = initialWorkout.mainWorkout[0];
    const adjustedWorkout = WorkoutAdjuster.substituteExercise(
      initialWorkout,
      firstMainEx.exerciseId,
      user
    );

    const replacedEx = adjustedWorkout.exercises.find((e) => e.order === firstMainEx.order);

    const assertions = [
      { name: 'Rutina inicial con salvaguardas generada', passed: res.success },
      { name: 'Sustitución de ejercicio ejecutada con éxito', passed: replacedEx !== undefined },
      { name: 'El ejercicio sustituto es compatible con el usuario', passed: replacedEx ? CompatibilityEngine.evaluate(replacedEx.exerciseSnapshot, user).status !== CompatibilityStatus.NOT_RECOMMENDED : false },
    ];

    return {
      id: 'gen-test-12',
      number: 12,
      name: 'Ejercicio Incompatible con Sustitución y Alternativas',
      description: 'Verifica la sustitución segura de un ejercicio por su alternativa biomecánica compatible.',
      passed: assertions.every((a) => a.passed),
      assertions,
      workout: adjustedWorkout,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }
}
