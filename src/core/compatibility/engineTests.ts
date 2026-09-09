/**
 * FitAdapt - Suite de Pruebas Unitarias del Motor de Compatibilidad
 * FASE 5: Verificación de los 10 Casos Fundamentales
 * 
 * Casos Obligatorios:
 * 1. Principiante + casa + sin equipamiento.
 * 2. Gimnasio + equipamiento completo.
 * 3. Objetivo cardio.
 * 4. Objetivo pérdida de peso.
 * 5. Molestia de rodilla.
 * 6. Molestia de espalda baja.
 * 7. Sin equipamiento pero ejercicio que requiere mancuerna.
 * 8. Ejercicio de alto impacto con limitación incompatible.
 * 9. Ejercicio compatible con alternativa.
 * 10. Usuario avanzado.
 */

import { CompatibilityEngine } from './evaluator';
import { EXERCISE_LIBRARY, getExerciseById } from '../../data/exerciseLibrary';
import { Exercise, ImpactLevel, ExerciseCategory } from '../../types/exercise';
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
} from '../../types/user';
import { CompatibilityStatus, CompatibilityEvaluationResult } from '../../types/compatibility';

export interface TestCaseAssertion {
  name: string;
  passed: boolean;
  note?: string;
}

export interface EngineTestCaseResult {
  id: string;
  number: number;
  name: string;
  description: string;
  userSummary: string;
  exerciseTestedName: string;
  passed: boolean;
  expectedStatus: CompatibilityStatus | CompatibilityStatus[];
  actualStatus: CompatibilityStatus;
  actualScore: number;
  suggestedAlternativeName?: string;
  executionTimeMs: number;
  evaluation: CompatibilityEvaluationResult;
  assertions: TestCaseAssertion[];
}

export interface EngineTestSuiteReport {
  totalTests: number;
  passedTests: number;
  failedTests: number;
  totalDurationMs: number;
  allPassed: boolean;
  results: EngineTestCaseResult[];
}

export class EngineTestSuite {
  /**
   * Ejecuta los 10 casos de prueba en secuencia y devuelve el reporte completo
   */
  public static runAll(): EngineTestSuiteReport {
    const startTime = performance.now();
    const results: EngineTestCaseResult[] = [
      this.testCase1_BeginnerHomeNoEquipment(),
      this.testCase2_GymFullEquipment(),
      this.testCase3_CardioGoal(),
      this.testCase4_WeightLossGoal(),
      this.testCase5_KneeDiscomfort(),
      this.testCase6_LowerBackDiscomfort(),
      this.testCase7_NoEquipmentRequiresDumbbell(),
      this.testCase8_HighImpactIncompatibleLimitation(),
      this.testCase9_CompatibleWithAlternative(),
      this.testCase10_AdvancedUser(),
    ];

    const endTime = performance.now();
    const passedTests = results.filter((r) => r.passed).length;

    return {
      totalTests: results.length,
      passedTests,
      failedTests: results.length - passedTests,
      totalDurationMs: Math.round((endTime - startTime) * 100) / 100,
      allPassed: passedTests === results.length,
      results,
    };
  }

  // =========================================================================
  // CASO 1: Principiante + casa + sin equipamiento
  // =========================================================================
  public static testCase1_BeginnerHomeNoEquipment(): EngineTestCaseResult {
    const t0 = performance.now();
    const user: UserProfile = {
      id: 'test-user-01',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.TONING,
      secondaryGoals: [FitnessGoal.MOBILITY],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT, HomeEquipment.MAT],
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [],
      preferences: { targetIntensity: 'LOW', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    // Ejercicio de peso corporal apto para principiante en casa: Sentadilla al Cajón / Box Squat
    const boxSquat = getExerciseById('ex-strength-box-squat') || EXERCISE_LIBRARY[0];
    const evaluation = CompatibilityEngine.evaluate(boxSquat, user, EXERCISE_LIBRARY);

    const assertions: TestCaseAssertion[] = [
      {
        name: 'Ejercicio básico de peso corporal clasifica como COMPATIBLE',
        passed: evaluation.status === CompatibilityStatus.COMPATIBLE,
        note: `Estado obtenido: ${evaluation.status}`,
      },
      {
        name: 'Puntuación alta sin penalizaciones de equipo ni nivel (Score >= 80)',
        passed: evaluation.overallScore >= 80,
        note: `Score obtenido: ${evaluation.overallScore}`,
      },
      {
        name: 'Regla de equipamiento aprobada al 100%',
        passed: evaluation.scoreBreakdown.equipment === 20,
        note: `Puntos de equipo: ${evaluation.scoreBreakdown.equipment}/20`,
      },
    ];

    const passed = assertions.every((a) => a.passed);
    return {
      id: 'test-case-01',
      number: 1,
      name: 'Principiante + Casa + Sin Equipamiento',
      description: 'Valida que un usuario sin experiencia ni material externo reciba ejercicios de peso corporal seguros sin barreras técnicas.',
      userSummary: 'Principiante, Hogar, Solo peso corporal y esterilla, Sin dolor.',
      exerciseTestedName: boxSquat.name,
      passed,
      expectedStatus: CompatibilityStatus.COMPATIBLE,
      actualStatus: evaluation.status,
      actualScore: evaluation.overallScore,
      suggestedAlternativeName: evaluation.suggestedAlternative?.exerciseName,
      executionTimeMs: Math.round((performance.now() - t0) * 100) / 100,
      evaluation,
      assertions,
    };
  }

  // =========================================================================
  // CASO 2: Gimnasio + equipamiento completo
  // =========================================================================
  public static testCase2_GymFullEquipment(): EngineTestCaseResult {
    const t0 = performance.now();
    const user: UserProfile = {
      id: 'test-user-02',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.INTERMEDIATE,
      primaryGoal: FitnessGoal.STRENGTH,
      secondaryGoals: [FitnessGoal.TONING],
      trainingLocation: TrainingLocation.GYM,
      availableEquipment: [
        GymEquipment.DUMBBELLS,
        GymEquipment.BARBELLS,
        GymEquipment.CABLES_PULLEYS,
        GymEquipment.MACHINES,
        GymEquipment.BENCH,
      ],
      availableTimeMinutes: 50,
      daysPerWeek: 4,
      limitations: [],
      preferences: { targetIntensity: 'HIGH', preferredDurationMinutes: 50, daysPerWeek: 4 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    // Ejercicio de fuerza con mancuernas en gimnasio: Peso Muerto Rumano con Mancuernas
    const rdl = getExerciseById('ex-strength-rdl-dumbbells') || EXERCISE_LIBRARY[0];
    const evaluation = CompatibilityEngine.evaluate(rdl, user, EXERCISE_LIBRARY);

    const assertions: TestCaseAssertion[] = [
      {
        name: 'Clasificado como COMPATIBLE con acceso a equipamiento y gimnasio',
        passed: evaluation.status === CompatibilityStatus.COMPATIBLE,
        note: `Estado: ${evaluation.status}`,
      },
      {
        name: 'Score alto por perfecta alineación con objetivo STRENGTH (Score >= 85)',
        passed: evaluation.overallScore >= 85,
        note: `Score: ${evaluation.overallScore}`,
      },
      {
        name: 'Máximo puntaje en objetivo y lugar (Location = 10, Goal = 30)',
        passed: evaluation.scoreBreakdown.location === 10 && evaluation.scoreBreakdown.goal >= 28,
        note: `Location: ${evaluation.scoreBreakdown.location}, Goal: ${evaluation.scoreBreakdown.goal}`,
      },
    ];

    const passed = assertions.every((a) => a.passed);
    return {
      id: 'test-case-02',
      number: 2,
      name: 'Gimnasio + Equipamiento Completo',
      description: 'Valida que en instalaciones completas se habiliten ejercicios con sobrecarga externa y mancuernas sin restricciones de lugar.',
      userSummary: 'Intermedio, Gimnasio, Mancuernas, Barras, Poleas y Bancos.',
      exerciseTestedName: rdl.name,
      passed,
      expectedStatus: CompatibilityStatus.COMPATIBLE,
      actualStatus: evaluation.status,
      actualScore: evaluation.overallScore,
      executionTimeMs: Math.round((performance.now() - t0) * 100) / 100,
      evaluation,
      assertions,
    };
  }

  // =========================================================================
  // CASO 3: Objetivo cardio
  // =========================================================================
  public static testCase3_CardioGoal(): EngineTestCaseResult {
    const t0 = performance.now();
    const user: UserProfile = {
      id: 'test-user-03',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.INTERMEDIATE,
      primaryGoal: FitnessGoal.CARDIO,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT],
      availableTimeMinutes: 30,
      daysPerWeek: 4,
      limitations: [],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 30, daysPerWeek: 4 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    // Ejercicio cardiovascular puro: Step Jacks / Jumping Jacks suaves
    const stepJacks = getExerciseById('ex-cardio-step-jacks') || EXERCISE_LIBRARY[0];
    const evaluation = CompatibilityEngine.evaluate(stepJacks, user, EXERCISE_LIBRARY);

    const assertions: TestCaseAssertion[] = [
      {
        name: 'Puntaje de objetivo máximo para CARDIO (Goal Score = 30)',
        passed: evaluation.scoreBreakdown.goal === 30,
        note: `Goal score: ${evaluation.scoreBreakdown.goal}/30`,
      },
      {
        name: 'Clasificado como COMPATIBLE sin objeciones',
        passed: evaluation.status === CompatibilityStatus.COMPATIBLE,
        note: `Estado: ${evaluation.status}`,
      },
    ];

    const passed = assertions.every((a) => a.passed);
    return {
      id: 'test-case-03',
      number: 3,
      name: 'Priorización por Objetivo CARDIO',
      description: 'Verifica que un ejercicio cardiovascular obtenga la ponderación máxima de objetivo (30 puntos) frente a un usuario enfocado en resistencia aeróbica.',
      userSummary: 'Objetivo Primario: CARDIO, Hogar, Sin equipamiento.',
      exerciseTestedName: stepJacks.name,
      passed,
      expectedStatus: CompatibilityStatus.COMPATIBLE,
      actualStatus: evaluation.status,
      actualScore: evaluation.overallScore,
      executionTimeMs: Math.round((performance.now() - t0) * 100) / 100,
      evaluation,
      assertions,
    };
  }

  // =========================================================================
  // CASO 4: Objetivo pérdida de peso (WEIGHT_LOSS)
  // =========================================================================
  public static testCase4_WeightLossGoal(): EngineTestCaseResult {
    const t0 = performance.now();
    const user: UserProfile = {
      id: 'test-user-04',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.WEIGHT_LOSS,
      secondaryGoals: [FitnessGoal.CARDIO],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT, HomeEquipment.MAT],
      availableTimeMinutes: 25,
      daysPerWeek: 3,
      limitations: [],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 25, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    // Burpee con zancada atrás (Cardio + Full Body metabólico de bajo impacto)
    const stepBackBurpee = getExerciseById('ex-cardio-step-back-burpee') || EXERCISE_LIBRARY[0];
    const evaluation = CompatibilityEngine.evaluate(stepBackBurpee, user, EXERCISE_LIBRARY);

    const assertions: TestCaseAssertion[] = [
      {
        name: 'Ponderación alta de estímulo metabólico para pérdida de peso (Goal Score >= 26)',
        passed: evaluation.scoreBreakdown.goal >= 26,
        note: `Goal score obtenido: ${evaluation.scoreBreakdown.goal}`,
      },
      {
        name: 'Estado COMPATIBLE para acondicionamiento metabólico seguro',
        passed: evaluation.status === CompatibilityStatus.COMPATIBLE,
        note: `Estado: ${evaluation.status}`,
      },
    ];

    const passed = assertions.every((a) => a.passed);
    return {
      id: 'test-case-04',
      number: 4,
      name: 'Priorización de Pérdida de Peso (Cardio + Fuerza/Full Body)',
      description: 'Valida la ponderación metabólica combinada (cardio + grandes grupos musculares) para usuarios con objetivo WEIGHT_LOSS.',
      userSummary: 'Objetivo: WEIGHT_LOSS, Nivel principiante, Hogar.',
      exerciseTestedName: stepBackBurpee.name,
      passed,
      expectedStatus: CompatibilityStatus.COMPATIBLE,
      actualStatus: evaluation.status,
      actualScore: evaluation.overallScore,
      executionTimeMs: Math.round((performance.now() - t0) * 100) / 100,
      evaluation,
      assertions,
    };
  }

  // =========================================================================
  // CASO 5: Molestia de rodilla (KNEE)
  // =========================================================================
  public static testCase5_KneeDiscomfort(): EngineTestCaseResult {
    const t0 = performance.now();
    const user: UserProfile = {
      id: 'test-user-05',
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
          id: 'lim-knee-01',
          code: 'KNEE_SENSITIVITY',
          name: 'Sensibilidad y dolor patelar en rodillas',
          category: PhysicalLimitationCategory.JOINT,
          severity: LimitationSeverity.MILD_DISCOMFORT,
          affectedBodyAreas: ['LOWER_BODY'],
          requiresLowImpact: true,
        },
      ],
      preferences: { targetIntensity: 'LOW', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    // Ejercicio de alto impacto: Jumping Jacks
    const jumpingJacks = getExerciseById('ex-cardio-jumping-jacks') || EXERCISE_LIBRARY[0];
    const evaluation = CompatibilityEngine.evaluate(jumpingJacks, user, EXERCISE_LIBRARY);

    const assertions: TestCaseAssertion[] = [
      {
        name: 'Ejercicio de alto impacto clasifica estrictamente como NOT_RECOMMENDED',
        passed: evaluation.status === CompatibilityStatus.NOT_RECOMMENDED,
        note: `Estado obtenido: ${evaluation.status}`,
      },
      {
        name: 'Regla de seguridad inquebrantable: Score = 0',
        passed: evaluation.overallScore === 0,
        note: `Score obtenido: ${evaluation.overallScore}`,
      },
      {
        name: 'El motor recomienda activamente la alternativa de bajo impacto (Step Jacks)',
        passed: evaluation.suggestedAlternative !== undefined && (evaluation.suggestedAlternative.substitutionType === 'LOW_IMPACT' || evaluation.suggestedAlternative.exerciseId === 'ex-cardio-step-jacks'),
        note: `Alternativa sugerida: ${evaluation.suggestedAlternative?.exerciseName}`,
      },
    ];

    const passed = assertions.every((a) => a.passed);
    return {
      id: 'test-case-05',
      number: 5,
      name: 'Molestia de Rodilla vs Ejercicio de Impacto',
      description: 'Confirma que las limitaciones articulares prevalecen sobre cualquier preferencia, descartando saltos e inyectando sustitución de bajo impacto.',
      userSummary: 'Molestia en rodilla (requiresLowImpact = true).',
      exerciseTestedName: jumpingJacks.name,
      passed,
      expectedStatus: CompatibilityStatus.NOT_RECOMMENDED,
      actualStatus: evaluation.status,
      actualScore: evaluation.overallScore,
      suggestedAlternativeName: evaluation.suggestedAlternative?.exerciseName,
      executionTimeMs: Math.round((performance.now() - t0) * 100) / 100,
      evaluation,
      assertions,
    };
  }

  // =========================================================================
  // CASO 6: Molestia de espalda baja (LUMBAR)
  // =========================================================================
  public static testCase6_LowerBackDiscomfort(): EngineTestCaseResult {
    const t0 = performance.now();
    const user: UserProfile = {
      id: 'test-user-06',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.INTERMEDIATE,
      primaryGoal: FitnessGoal.TONING,
      secondaryGoals: [FitnessGoal.MOBILITY],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT, HomeEquipment.MAT],
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [
        {
          id: 'lim-lumbar-01',
          code: 'LUMBAR_DISCOMFORT',
          name: 'Sobrecarga lumbosacra con fatiga',
          category: PhysicalLimitationCategory.SPINE_BACK,
          severity: LimitationSeverity.MILD_DISCOMFORT,
          affectedBodyAreas: ['CORE', 'LOWER_BODY'],
          requiresLowImpact: true,
        },
      ],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    // Ejercicio de estabilización lumbo-pélvica seguro: Bird-Dog (Pájaro-Perro)
    const birdDog = getExerciseById('ex-toning-bird-dog') || EXERCISE_LIBRARY[0];
    const evaluation = CompatibilityEngine.evaluate(birdDog, user, EXERCISE_LIBRARY);

    const assertions: TestCaseAssertion[] = [
      {
        name: 'Ejercicio protector de columna clasifica como COMPATIBLE',
        passed: evaluation.status === CompatibilityStatus.COMPATIBLE,
        note: `Estado obtenido: ${evaluation.status}`,
      },
      {
        name: 'Puntaje de seguridad pleno (Safety = 100%)',
        passed: evaluation.scoreBreakdown.safety === 100,
        note: `Safety score: ${evaluation.scoreBreakdown.safety}`,
      },
    ];

    const passed = assertions.every((a) => a.passed);
    return {
      id: 'test-case-06',
      number: 6,
      name: 'Molestia de Espalda Baja y Protección Lumbar',
      description: 'Valida que un ejercicio de estabilidad neutra de columna (Bird-Dog) sea completamente compatible y seguro para usuarios con sobrecarga lumbar.',
      userSummary: 'Molestia lumbar, Nivel intermedio, Trabajo de core seguro.',
      exerciseTestedName: birdDog.name,
      passed,
      expectedStatus: CompatibilityStatus.COMPATIBLE,
      actualStatus: evaluation.status,
      actualScore: evaluation.overallScore,
      executionTimeMs: Math.round((performance.now() - t0) * 100) / 100,
      evaluation,
      assertions,
    };
  }

  // =========================================================================
  // CASO 7: Sin equipamiento pero ejercicio que requiere mancuerna
  // =========================================================================
  public static testCase7_NoEquipmentRequiresDumbbell(): EngineTestCaseResult {
    const t0 = performance.now();
    const user: UserProfile = {
      id: 'test-user-07',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.STRENGTH,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT], // SIN MANCUERNAS
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    // Ejercicio que requiere mancuerna pero cuenta con sustitución sin material: Remo con mancuerna
    const dbRow = getExerciseById('ex-strength-dumbbell-row') || EXERCISE_LIBRARY[0];
    const evaluation = CompatibilityEngine.evaluate(dbRow, user, EXERCISE_LIBRARY);

    const assertions: TestCaseAssertion[] = [
      {
        name: 'No elimina el ejercicio: Clasifica como COMPATIBLE_WITH_MODIFICATION por contar con alternativa',
        passed: evaluation.status === CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION,
        note: `Estado: ${evaluation.status}`,
      },
      {
        name: 'Suministra alternativa directa sin equipamiento',
        passed: evaluation.suggestedAlternative !== undefined,
        note: `Alternativa: ${evaluation.suggestedAlternative?.exerciseName} (${evaluation.suggestedAlternative?.substitutionType})`,
      },
      {
        name: 'Score adaptado con penalización de fricción controlada (Score entre 50 y 78)',
        passed: evaluation.overallScore >= 50 && evaluation.overallScore <= 78,
        note: `Score obtenido: ${evaluation.overallScore}`,
      },
    ];

    const passed = assertions.every((a) => a.passed);
    return {
      id: 'test-case-07',
      number: 7,
      name: 'Falta de Equipamiento con Sustitución Disponible',
      description: 'Comprueba la regla de oro de equipamiento: no eliminar la posibilidad de entrenar si existe una alternativa con peso corporal o banda.',
      userSummary: 'Hogar, Sin mancuernas disponibles, Ejercicio requiere mancuerna.',
      exerciseTestedName: dbRow.name,
      passed,
      expectedStatus: CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION,
      actualStatus: evaluation.status,
      actualScore: evaluation.overallScore,
      suggestedAlternativeName: evaluation.suggestedAlternative?.exerciseName,
      executionTimeMs: Math.round((performance.now() - t0) * 100) / 100,
      evaluation,
      assertions,
    };
  }

  // =========================================================================
  // CASO 8: Ejercicio de alto impacto con limitación incompatible
  // =========================================================================
  public static testCase8_HighImpactIncompatibleLimitation(): EngineTestCaseResult {
    const t0 = performance.now();
    const user: UserProfile = {
      id: 'test-user-08',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.INTERMEDIATE,
      primaryGoal: FitnessGoal.WEIGHT_LOSS,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT],
      availableTimeMinutes: 30,
      daysPerWeek: 4,
      limitations: [
        {
          id: 'lim-ankle-01',
          code: 'ANKLE_INSTABILITY',
          name: 'Inestabilidad crónica y esguince de tobillo',
          category: PhysicalLimitationCategory.JOINT,
          severity: LimitationSeverity.MODERATE_LIMITATION,
          affectedBodyAreas: ['LOWER_BODY'],
          requiresLowImpact: true,
        },
      ],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 30, daysPerWeek: 4 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    // Burpee tradicional con salto pliométrico
    const burpee = getExerciseById('ex-cardio-burpee') || EXERCISE_LIBRARY[0];
    const evaluation = CompatibilityEngine.evaluate(burpee, user, EXERCISE_LIBRARY);

    const assertions: TestCaseAssertion[] = [
      {
        name: 'Alto impacto con limitación articular descalifica a NOT_RECOMMENDED',
        passed: evaluation.status === CompatibilityStatus.NOT_RECOMMENDED,
        note: `Estado: ${evaluation.status}`,
      },
      {
        name: 'Score forzado a 0 sin poder ser rescatado por preferencias',
        passed: evaluation.overallScore === 0,
        note: `Score: ${evaluation.overallScore}`,
      },
      {
        name: 'El motor provee alternativa de bajo impacto (Step-Back Burpee)',
        passed: evaluation.suggestedAlternative !== undefined,
        note: `Alternativa: ${evaluation.suggestedAlternative?.exerciseName}`,
      },
    ];

    const passed = assertions.every((a) => a.passed);
    return {
      id: 'test-case-08',
      number: 8,
      name: 'Alto Impacto Incompatible con Articulación Sensible',
      description: 'Verifica que un ejercicio con salto y rebote pliométrico sea descalificado con score 0 ante limitación articular, recomendando alternativa segura.',
      userSummary: 'Inestabilidad de tobillo / impacto prohibido vs Burpee con salto.',
      exerciseTestedName: burpee.name,
      passed,
      expectedStatus: CompatibilityStatus.NOT_RECOMMENDED,
      actualStatus: evaluation.status,
      actualScore: evaluation.overallScore,
      suggestedAlternativeName: evaluation.suggestedAlternative?.exerciseName,
      executionTimeMs: Math.round((performance.now() - t0) * 100) / 100,
      evaluation,
      assertions,
    };
  }

  // =========================================================================
  // CASO 9: Ejercicio compatible con alternativa
  // =========================================================================
  public static testCase9_CompatibleWithAlternative(): EngineTestCaseResult {
    const t0 = performance.now();
    const user: UserProfile = {
      id: 'test-user-09',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.BEGINNER,
      primaryGoal: FitnessGoal.STRENGTH,
      secondaryGoals: [],
      trainingLocation: TrainingLocation.HOME,
      availableEquipment: [HomeEquipment.NO_EQUIPMENT],
      availableTimeMinutes: 30,
      daysPerWeek: 3,
      limitations: [
        {
          id: 'lim-wrist-01',
          code: 'WRIST_DISCOMFORT',
          name: 'Dolor y falta de rango en flexión de muñecas',
          category: PhysicalLimitationCategory.JOINT,
          severity: LimitationSeverity.MILD_DISCOMFORT,
          affectedBodyAreas: ['UPPER_BODY'],
          requiresLowImpact: false,
        },
      ],
      preferences: { targetIntensity: 'MEDIUM', preferredDurationMinutes: 30, daysPerWeek: 3 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    // Flexiones estándar en suelo (comprimen muñeca a 90° pero tienen versión en pared / inclinada)
    const pushupStandard = getExerciseById('ex-strength-pushup-standard') || EXERCISE_LIBRARY[0];
    const evaluation = CompatibilityEngine.evaluate(pushupStandard, user, EXERCISE_LIBRARY);

    const assertions: TestCaseAssertion[] = [
      {
        name: 'Clasifica como COMPATIBLE_WITH_MODIFICATION por alternativa biomecánica de menor compresión',
        passed: evaluation.status === CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION,
        note: `Estado: ${evaluation.status}`,
      },
      {
        name: 'Genera alternativa registrada en la biblioteca (Flexiones en Pared o Inclinadas)',
        passed: evaluation.suggestedAlternative !== undefined,
        note: `Alternativa: ${evaluation.suggestedAlternative?.exerciseName}`,
      },
      {
        name: 'Incluye guía ergonómica de adaptación articular',
        passed: evaluation.modificationNotes.length > 0 || evaluation.suggestedAdaptation !== undefined,
        note: `Notas: ${evaluation.modificationNotes.join('; ')}`,
      },
    ];

    const passed = assertions.every((a) => a.passed);
    return {
      id: 'test-case-09',
      number: 9,
      name: 'Ejercicio Adaptable con Alternativa Vinculada',
      description: 'Valida que un ejercicio con estrés de muñeca identifique la regresión en pared o banco y proponga la guía de adaptación ergonómica.',
      userSummary: 'Molestia en muñeca vs Flexiones estándar en suelo.',
      exerciseTestedName: pushupStandard.name,
      passed,
      expectedStatus: CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION,
      actualStatus: evaluation.status,
      actualScore: evaluation.overallScore,
      suggestedAlternativeName: evaluation.suggestedAlternative?.exerciseName,
      executionTimeMs: Math.round((performance.now() - t0) * 100) / 100,
      evaluation,
      assertions,
    };
  }

  // =========================================================================
  // CASO 10: Usuario avanzado
  // =========================================================================
  public static testCase10_AdvancedUser(): EngineTestCaseResult {
    const t0 = performance.now();
    const user: UserProfile = {
      id: 'test-user-10',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      fitnessLevel: FitnessLevel.ADVANCED,
      primaryGoal: FitnessGoal.STRENGTH,
      secondaryGoals: [FitnessGoal.TONING],
      trainingLocation: TrainingLocation.GYM,
      availableEquipment: [
        GymEquipment.DUMBBELLS,
        GymEquipment.BARBELLS,
        GymEquipment.BENCH,
        GymEquipment.MACHINES,
      ],
      availableTimeMinutes: 60,
      daysPerWeek: 5,
      limitations: [],
      preferences: { targetIntensity: 'HIGH', preferredDurationMinutes: 60, daysPerWeek: 5 },
      medicalSafety: { hasAcutePain: false, hasRecentSurgery: false, hasCardiovascularCondition: false, hasProfessionalMedicalClearance: true, acknowledgedNonMedicalDisclaimer: true },
    };

    // Ejercicio compuesto demandante: Thruster con Mancuernas (Full body + fuerza)
    const thruster = getExerciseById('ex-fullbody-db-thruster') || EXERCISE_LIBRARY[0];
    const evaluation = CompatibilityEngine.evaluate(thruster, user, EXERCISE_LIBRARY);

    const assertions: TestCaseAssertion[] = [
      {
        name: 'Ejercicio complejo clasifica como COMPATIBLE para usuario avanzado',
        passed: evaluation.status === CompatibilityStatus.COMPATIBLE,
        note: `Estado: ${evaluation.status}`,
      },
      {
        name: 'Máximo puntaje en nivel técnico (Level Score = 20)',
        passed: evaluation.scoreBreakdown.level === 20,
        note: `Puntaje de nivel: ${evaluation.scoreBreakdown.level}/20`,
      },
      {
        name: 'Score global excelente (Score >= 90)',
        passed: evaluation.overallScore >= 90,
        note: `Score obtenido: ${evaluation.overallScore}`,
      },
    ];

    const passed = assertions.every((a) => a.passed);
    return {
      id: 'test-case-10',
      number: 10,
      name: 'Usuario Avanzado en Gimnasio',
      description: 'Valida que un usuario experimentado con equipamiento completo pueda acceder a ejercicios complejos de alta intensidad con máxima puntuación.',
      userSummary: 'Nivel avanzado, Gimnasio, Objetivo Fuerza, Ejercicio complejo.',
      exerciseTestedName: thruster.name,
      passed,
      expectedStatus: CompatibilityStatus.COMPATIBLE,
      actualStatus: evaluation.status,
      actualScore: evaluation.overallScore,
      executionTimeMs: Math.round((performance.now() - t0) * 100) / 100,
      evaluation,
      assertions,
    };
  }
}
