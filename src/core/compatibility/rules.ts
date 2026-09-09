/**
 * FitAdapt - Reglas Atómicas del Motor de Personalización y Compatibilidad
 * FASE 5: Motor de Reglas Jerárquico y Determinista
 * 
 * Jerarquía estricta de prioridades:
 * 1. Seguridad / Limitaciones físicas (Crítica - NUNCA anulable por scoring)
 * 2. Nivel técnico del usuario
 * 3. Equipamiento disponible y sustituciones
 * 4. Lugar de entrenamiento (HOME / GYM)
 * 5. Objetivo principal y secundarios
 * 6. Tiempo y duración disponible
 * 7. Intensidad fisiológica
 * 8. Preferencias del usuario
 * 9. Morfología corporal (Variable secundaria, nunca diagnóstica)
 */

import {
  Exercise,
  ImpactLevel,
  IntensityLevel,
  ExerciseCategory,
  ExerciseEquipment,
  JointLimitationArea,
  JointLimitationStatus,
} from '../../types/exercise';
import {
  UserProfile,
  FitnessLevel,
  FitnessGoal,
  TrainingLocation,
  HomeEquipment,
  GymEquipment,
  BodyMorphology,
  PhysicalLimitation,
  LimitationSeverity,
} from '../../types/user';
import {
  RuleType,
  RulePriority,
  RuleEvaluationDetail,
  CompatibilityStatus,
} from '../../types/compatibility';

// Mapeo auxiliar de códigos de limitación o áreas afectadas a JointLimitationArea
function mapLimitationToJoint(limitation: PhysicalLimitation): JointLimitationArea | null {
  const code = limitation.code?.toUpperCase() || '';
  const name = limitation.name?.toLowerCase() || '';
  const areas = (limitation.affectedBodyAreas || []).map((a) => a.toLowerCase());

  if (code.includes('KNEE') || name.includes('rodill') || areas.some((a) => a.includes('rodill') || a.includes('knee'))) {
    return JointLimitationArea.KNEE;
  }
  if (code.includes('LUMBAR') || code.includes('BACK') || code.includes('SPINE') || name.includes('lumbar') || name.includes('espalda') || areas.some((a) => a.includes('lumbar') || a.includes('back'))) {
    return JointLimitationArea.LOWER_BACK;
  }
  if (code.includes('SHOULDER') || name.includes('hombro') || areas.some((a) => a.includes('hombro') || a.includes('shoulder'))) {
    return JointLimitationArea.SHOULDER;
  }
  if (code.includes('WRIST') || name.includes('muñeca') || areas.some((a) => a.includes('muñeca') || a.includes('wrist'))) {
    return JointLimitationArea.WRIST;
  }
  if (code.includes('ANKLE') || name.includes('tobillo') || areas.some((a) => a.includes('tobillo') || a.includes('ankle'))) {
    return JointLimitationArea.ANKLE;
  }
  if (code.includes('NECK') || code.includes('CERVICAL') || name.includes('cuello') || name.includes('cervical')) {
    return JointLimitationArea.NECK;
  }
  if (code.includes('HIP') || name.includes('cadera')) {
    return JointLimitationArea.HIP;
  }
  return null;
}

/**
 * ============================================================================
 * PRIORIDAD 1: SEGURIDAD Y LIMITACIONES FÍSICAS (CRÍTICA Y NO ANULABLE)
 * ============================================================================
 * Las limitaciones físicas siempre tienen prioridad sobre objetivos y preferencias.
 * Un ejercicio marcado como NOT_RECOMMENDED por seguridad no puede recuperar compatibilidad.
 */
export function evaluateSafetyLimitationRule(
  exercise: Exercise,
  user: UserProfile
): RuleEvaluationDetail {
  // 1. Declaración médica de alerta aguda
  if (user.medicalSafety?.hasAcutePain && !user.medicalSafety.hasProfessionalMedicalClearance) {
    return {
      ruleType: RuleType.LIMITATION_SAFETY,
      priority: RulePriority.SAFETY_LIMITATIONS,
      passed: false,
      isHardFilter: true,
      scoreContribution: 0,
      maxScorePossible: 100,
      message: 'Detención preventiva por seguridad: se declaró dolor agudo sin autorización médica profesional.',
    };
  }

  // Sin limitaciones declaradas: seguro
  if (!user.limitations || user.limitations.length === 0) {
    return {
      ruleType: RuleType.LIMITATION_SAFETY,
      priority: RulePriority.SAFETY_LIMITATIONS,
      passed: true,
      isHardFilter: true,
      scoreContribution: 100,
      maxScorePossible: 100,
      message: 'Sin limitaciones físicas reportadas. Seguro para ejecución estándar.',
    };
  }

  // 2. Evaluar cada limitación del usuario
  for (const limitation of user.limitations) {
    const jointArea = mapLimitationToJoint(limitation);

    // A) Incompatibilidad directa por código en el ejercicio
    const matchesCodeDirectly =
      exercise.incompatibleLimitationCodes?.includes(limitation.code) ||
      exercise.incompatibleLimitations?.some(
        (inc) => inc.toLowerCase().includes(limitation.name.toLowerCase()) || limitation.name.toLowerCase().includes(inc.toLowerCase())
      );

    // B) Evaluación del perfil articular del ejercicio (limitationProfile)
    let jointStatus: JointLimitationStatus = 'COMPATIBLE';
    let jointNotes: string | undefined;
    let modificationGuidance: string | undefined;

    if (jointArea && exercise.limitationProfile && exercise.limitationProfile[jointArea]) {
      const effect = exercise.limitationProfile[jointArea];
      jointStatus = effect.status;
      jointNotes = effect.notes;
      modificationGuidance = effect.modificationGuidance;
    }

    // C) Regla estricta de Alto Impacto:
    // Si la limitación requiere bajo impacto (ej. rodilla, tobillo, lumbar) y el ejercicio es HIGH IMPACT
    const requiresLowImpact = limitation.requiresLowImpact || jointArea === JointLimitationArea.KNEE || jointArea === JointLimitationArea.ANKLE;
    const isHighImpact = exercise.impactLevel === ImpactLevel.HIGH || exercise.impact === ImpactLevel.HIGH;

    if (requiresLowImpact && isHighImpact) {
      return {
        ruleType: RuleType.IMPACT_SAFETY,
        priority: RulePriority.SAFETY_LIMITATIONS,
        passed: false,
        isHardFilter: true,
        scoreContribution: 0,
        maxScorePossible: 100,
        message: `Ejercicio descalificado por seguridad: Ejercicio de alto impacto incompatible con la condición de ${limitation.name}.`,
        suggestedModification: exercise.lowImpactAlternative
          ? `Alternativa de bajo impacto recomendada: ${exercise.lowImpactAlternative.name}. ${exercise.lowImpactAlternative.howToPerform}`
          : exercise.lowImpactVersion?.howToPerform,
        triggeringLimitation: limitation,
        affectedJointArea: jointArea || undefined,
      };
    }

    // D) Si el perfil articular o código directo marca NOT_RECOMMENDED
    if (jointStatus === 'NOT_RECOMMENDED' || (matchesCodeDirectly && !exercise.lowImpactVersion && !exercise.lowImpactAlternative)) {
      return {
        ruleType: RuleType.LIMITATION_SAFETY,
        priority: RulePriority.SAFETY_LIMITATIONS,
        passed: false,
        isHardFilter: true,
        scoreContribution: 0,
        maxScorePossible: 100,
        message: `No recomendado para ${limitation.name}: ${jointNotes || 'Estrés biomecánico incompatible en la articulación sensible.'}`,
        suggestedModification: exercise.lowImpactAlternative
          ? `Sustituir por: ${exercise.lowImpactAlternative.name}`
          : undefined,
        triggeringLimitation: limitation,
        affectedJointArea: jointArea || undefined,
      };
    }

    // E) Si requiere modificación o adaptación biomecánica
    if (jointStatus === 'REQUIRES_MODIFICATION' || (matchesCodeDirectly && (exercise.lowImpactVersion || exercise.lowImpactAlternative))) {
      const guidance = modificationGuidance || exercise.lowImpactVersion?.howToPerform || exercise.lowImpactAlternative?.howToPerform || 'Limitar rango de movimiento y evitar rebote.';
      return {
        ruleType: RuleType.LIMITATION_SAFETY,
        priority: RulePriority.SAFETY_LIMITATIONS,
        passed: true,
        isHardFilter: false,
        scoreContribution: 75,
        maxScorePossible: 100,
        message: `Compatible con modificación ergonómica para ${limitation.name}: ${jointNotes || 'Adaptación articular requerida.'}`,
        suggestedModification: guidance,
        triggeringLimitation: limitation,
        affectedJointArea: jointArea || undefined,
      };
    }
  }

  // Si pasó todas las comprobaciones articulares
  return {
    ruleType: RuleType.LIMITATION_SAFETY,
    priority: RulePriority.SAFETY_LIMITATIONS,
    passed: true,
    isHardFilter: true,
    scoreContribution: 100,
    maxScorePossible: 100,
    message: 'Seguro: No genera estrés articular incompatible con las limitaciones reportadas.',
  };
}

/**
 * ============================================================================
 * PRIORIDAD 2: NIVEL TÉCNICO Y EXPERIENCIA
 * ============================================================================
 * BEGINNER: Evitar ejercicios innecesariamente complejos.
 * INTERMEDIATE: Mayor variedad.
 * ADVANCED: Permitir mayor complejidad y demandas neuromusculares.
 */
export function evaluateFitnessLevelRule(
  exercise: Exercise,
  user: UserProfile
): RuleEvaluationDetail {
  const levelRanks: Record<FitnessLevel, number> = {
    [FitnessLevel.BEGINNER]: 1,
    [FitnessLevel.INTERMEDIATE]: 2,
    [FitnessLevel.ADVANCED]: 3,
  };

  const userRank = levelRanks[user.fitnessLevel] || 1;
  const minRequiredRank = levelRanks[exercise.minLevelAllowed || exercise.fitnessLevel] || 1;
  const targetRank = levelRanks[exercise.targetLevel || exercise.fitnessLevel] || 1;

  // Si el usuario no cumple el nivel mínimo requerido (ej. principiante frente a ejercicio avanzado)
  if (userRank < minRequiredRank) {
    return {
      ruleType: RuleType.FITNESS_LEVEL,
      priority: RulePriority.FITNESS_LEVEL,
      passed: false,
      isHardFilter: true,
      scoreContribution: 0,
      maxScorePossible: 20,
      message: `Nivel técnico insuficiente: Requiere nivel mínimo ${exercise.minLevelAllowed || exercise.fitnessLevel} (usuario: ${user.fitnessLevel}). Complejidad no recomendada en esta etapa.`,
    };
  }

  // Si el usuario es principiante y el ejercicio tiene objetivo intermedio pero mínimo permitido principiante
  if (userRank < targetRank) {
    return {
      ruleType: RuleType.FITNESS_LEVEL,
      priority: RulePriority.FITNESS_LEVEL,
      passed: true,
      isHardFilter: false,
      scoreContribution: 14,
      maxScorePossible: 20,
      message: `Desafiante para nivel ${user.fitnessLevel}. Realizable con ritmo pausado y supervisión técnica.`,
      suggestedModification: 'Reducir número de repeticiones o series para priorizar la calidad técnica del movimiento.',
    };
  }

  // Coincidencia exacta o usuario más avanzado que el ejercicio
  const bonusAdvanced = userRank === 3 && targetRank === 3 ? 20 : 18;
  return {
    ruleType: RuleType.FITNESS_LEVEL,
    priority: RulePriority.FITNESS_LEVEL,
    passed: true,
    isHardFilter: false,
    scoreContribution: bonusAdvanced,
    maxScorePossible: 20,
    message: `Perfectamente adaptado para el nivel ${user.fitnessLevel}.`,
  };
}

/**
 * ============================================================================
 * PRIORIDAD 3: EQUIPAMIENTO DISPONIBLE Y SUSTITUCIONES
 * ============================================================================
 * Si un ejercicio requiere equipamiento no disponible:
 * Buscar alternativa compatible. No eliminar automáticamente la posibilidad
 * de entrenar si existe una sustitución adecuada de peso corporal o bandas.
 */
export function evaluateEquipmentRule(
  exercise: Exercise,
  user: UserProfile
): RuleEvaluationDetail {
  const userEquip = (user.availableEquipment || []).map((e) => e.toString().toUpperCase());

  // Si el ejercicio no requiere equipo (peso corporal puro)
  const isNoEquipment =
    exercise.equipment?.includes(ExerciseEquipment.NONE) ||
    exercise.requiredEquipment?.length === 0 ||
    exercise.requiredEquipment?.some((e) => e.toString().toUpperCase().includes('NO_EQUIPMENT') || e.toString().toUpperCase().includes('NONE'));

  if (isNoEquipment) {
    return {
      ruleType: RuleType.EQUIPMENT_AVAILABILITY,
      priority: RulePriority.EQUIPMENT,
      passed: true,
      isHardFilter: true,
      scoreContribution: 20,
      maxScorePossible: 20,
      message: 'No requiere equipamiento externo (peso corporal disponible siempre).',
    };
  }

  // Comprobar si el usuario posee el equipamiento requerido
  const hasEquipment = exercise.requiredEquipment.every((req) => {
    const reqStr = req.toString().toUpperCase();
    return userEquip.includes(reqStr) || userEquip.some((ue) => ue.includes(reqStr) || reqStr.includes(ue));
  });

  if (hasEquipment) {
    return {
      ruleType: RuleType.EQUIPMENT_AVAILABILITY,
      priority: RulePriority.EQUIPMENT,
      passed: true,
      isHardFilter: true,
      scoreContribution: 20,
      maxScorePossible: 20,
      message: 'Equipamiento necesario 100% disponible en el entorno del usuario.',
    };
  }

  // Si NO tiene el equipamiento, comprobar si cuenta con alternativa sin equipamiento
  if (exercise.noEquipmentAlternative || exercise.noEquipmentVersion) {
    const altName = exercise.noEquipmentAlternative?.name || exercise.noEquipmentVersion?.title || 'Variante con peso corporal';
    const altDesc = exercise.noEquipmentAlternative?.howToPerform || exercise.noEquipmentVersion?.howToPerform || 'Sustitución por patrón motor sin carga externa.';

    return {
      ruleType: RuleType.EQUIPMENT_AVAILABILITY,
      priority: RulePriority.EQUIPMENT,
      passed: true,
      isHardFilter: false,
      scoreContribution: 14,
      maxScorePossible: 20,
      message: `Falta equipamiento (${exercise.requiredEquipment.join(', ')}), pero cuenta con alternativa directa sin equipamiento: "${altName}".`,
      suggestedModification: altDesc,
    };
  }

  // Si no tiene alternativa sin equipamiento, descalifica
  return {
    ruleType: RuleType.EQUIPMENT_AVAILABILITY,
    priority: RulePriority.EQUIPMENT,
    passed: false,
    isHardFilter: true,
    scoreContribution: 0,
    maxScorePossible: 20,
    message: `Equipamiento no disponible: requiere ${exercise.requiredEquipment.join(', ')} y no posee versión de peso corporal.`,
  };
}

/**
 * ============================================================================
 * PRIORIDAD 4: LUGAR DE ENTRENAMIENTO (HOME / GYM)
 * ============================================================================
 * HOME: No seleccionar ejercicios exclusivos de gimnasio.
 * GYM: Permitir ejercicios de gimnasio y ejercicios sin equipamiento.
 */
export function evaluateLocationRule(
  exercise: Exercise,
  user: UserProfile
): RuleEvaluationDetail {
  const userLoc = user.trainingLocation;
  const compatibleLocations = exercise.compatibleLocations || exercise.location || [TrainingLocation.HOME, TrainingLocation.GYM];

  // Si el usuario entrena en GYM, tiene acceso tanto a ejercicios de gimnasio como de suelo / peso corporal
  if (userLoc === TrainingLocation.GYM) {
    return {
      ruleType: RuleType.LOCATION_MATCH,
      priority: RulePriority.LOCATION,
      passed: true,
      isHardFilter: true,
      scoreContribution: 10,
      maxScorePossible: 10,
      message: 'Totalmente compatible con instalaciones de gimnasio.',
    };
  }

  // Si entrena en HOME:
  const isCompatibleWithHome = compatibleLocations.includes(TrainingLocation.HOME);

  if (isCompatibleWithHome) {
    return {
      ruleType: RuleType.LOCATION_MATCH,
      priority: RulePriority.LOCATION,
      passed: true,
      isHardFilter: true,
      scoreContribution: 10,
      maxScorePossible: 10,
      message: 'Compatible con entrenamiento en casa (espacio doméstico seguro).',
    };
  }

  return {
    ruleType: RuleType.LOCATION_MATCH,
    priority: RulePriority.LOCATION,
    passed: false,
    isHardFilter: true,
    scoreContribution: 0,
    maxScorePossible: 10,
    message: 'Incompatible con entorno doméstico: Ejercicio exclusivo de instalaciones de gimnasio.',
  };
}

/**
 * ============================================================================
 * PRIORIDAD 5: OBJETIVO DEL USUARIO
 * ============================================================================
 * Ponderar ejercicios según objetivo:
 * WEIGHT_LOSS: Priorizar combinaciones de cardio + fuerza + full body.
 * TONING: Priorizar fuerza / resistencia muscular.
 * CARDIO: Priorizar ejercicios cardiovasculares.
 * STRENGTH: Priorizar ejercicios de fuerza y progresión de carga.
 * MOBILITY: Priorizar movilidad, alineación y control corporal.
 */
export function evaluateGoalAlignmentRule(
  exercise: Exercise,
  user: UserProfile
): RuleEvaluationDetail {
  const userGoal = user.primaryGoal;
  const exerciseCategories = exercise.categories || [exercise.category];
  const exerciseGoals = exercise.goalCompatibility || [exercise.primaryGoal];

  let score = 15; // Base neutra de complementariedad
  let message = 'Ejercicio complementario de acondicionamiento general.';

  switch (userGoal) {
    case FitnessGoal.WEIGHT_LOSS:
      // Priorizar combinaciones de cardio + fuerza + full body
      const isCardio = exerciseCategories.includes(ExerciseCategory.CARDIO);
      const isFullBody = exerciseCategories.includes(ExerciseCategory.FULL_BODY) || exercise.bodyArea?.toString().toUpperCase() === 'FULL BODY';
      const isStrength = exerciseCategories.includes(ExerciseCategory.STRENGTH);

      if ((isCardio && isStrength) || (isFullBody && isCardio) || exerciseGoals.includes(FitnessGoal.WEIGHT_LOSS)) {
        score = 30;
        message = 'Alineación óptima para pérdida de peso: estímulo metabólico compuesto (cardio + fuerza/full body).';
      } else if (isCardio || isFullBody || isStrength) {
        score = 26;
        message = 'Alta contribución al gasto calórico y preservación muscular para pérdida de peso.';
      }
      break;

    case FitnessGoal.TONING:
      // Priorizar fuerza y resistencia muscular
      const isToningCategory = exerciseCategories.includes(ExerciseCategory.TONING);
      const isResistance = exerciseCategories.includes(ExerciseCategory.STRENGTH);
      if (isToningCategory || exerciseGoals.includes(FitnessGoal.TONING)) {
        score = 30;
        message = 'Alineación directa con tonificación: tensión muscular sostenida y control motor.';
      } else if (isResistance) {
        score = 26;
        message = 'Excelente estímulo de hipertrofia y densidad muscular para tonificación.';
      }
      break;

    case FitnessGoal.CARDIO:
      // Priorizar cardiovascular
      if (exerciseCategories.includes(ExerciseCategory.CARDIO) || exerciseGoals.includes(FitnessGoal.CARDIO)) {
        score = 30;
        message = 'Alineación cardiovascular directa: trabajo aeróbico continuo o fraccionado.';
      } else if (exerciseCategories.includes(ExerciseCategory.FULL_BODY)) {
        score = 22;
        message = 'Estímulo cardiovascular periférico por activación de grandes masas musculares.';
      }
      break;

    case FitnessGoal.STRENGTH:
      // Priorizar fuerza
      if (exerciseCategories.includes(ExerciseCategory.STRENGTH) || exerciseGoals.includes(FitnessGoal.STRENGTH)) {
        score = 30;
        message = 'Alineación de fuerza directa: patrón motor compuesto con sobrecarga mecánica.';
      } else if (exerciseCategories.includes(ExerciseCategory.TONING)) {
        score = 22;
        message = 'Soporte accesorio y resistencia muscular para el desarrollo de fuerza.';
      }
      break;

    case FitnessGoal.MOBILITY:
      // Priorizar movilidad y control articular
      if (exerciseCategories.includes(ExerciseCategory.MOBILITY) || exerciseGoals.includes(FitnessGoal.MOBILITY)) {
        score = 30;
        message = 'Alineación de movilidad directa: descompresión articular y rango de movimiento dinámico.';
      } else {
        score = 15;
        message = 'Ejercicio secundario dentro de un programa centrado en movilidad.';
      }
      break;
  }

  // Bonus secundario si coincide con secondaryGoals del usuario
  if (user.secondaryGoals?.some((sg) => exerciseGoals.includes(sg))) {
    score = Math.min(30, score + 3);
  }

  return {
    ruleType: RuleType.GOAL_ALIGNMENT,
    priority: RulePriority.GOAL_ALIGNMENT,
    passed: true,
    isHardFilter: false,
    scoreContribution: score,
    maxScorePossible: 30,
    message,
  };
}

/**
 * ============================================================================
 * PRIORIDAD 6: TIEMPO Y DURACIÓN DISPONIBLE
 * ============================================================================
 */
export function evaluateTimeConstraintsRule(
  exercise: Exercise,
  user: UserProfile
): RuleEvaluationDetail {
  const availableMinutes = user.availableTimeMinutes || 30;
  const exerciseDurationSec = exercise.defaultDuration || exercise.defaultDurationSeconds || (exercise.defaultSets * 45 + exercise.defaultRest * exercise.defaultSets) || 120;
  const exerciseDurationMin = exerciseDurationSec / 60;

  // Si la sesión del usuario es muy corta (ej. <= 20 min)
  if (availableMinutes <= 20 && exerciseDurationMin > 5) {
    return {
      ruleType: RuleType.TIME_CONSTRAINTS,
      priority: RulePriority.TIME_CONSTRAINTS,
      passed: true,
      isHardFilter: false,
      scoreContribution: 3,
      maxScorePossible: 5,
      message: 'Ejercicio algo extenso para sesiones exprés de 20 minutos; se sugiere ajustar a menos series.',
      suggestedModification: 'Reducir a 2 series para respetar la ventana de tiempo disponible.',
    };
  }

  return {
    ruleType: RuleType.TIME_CONSTRAINTS,
    priority: RulePriority.TIME_CONSTRAINTS,
    passed: true,
    isHardFilter: false,
    scoreContribution: 5,
    maxScorePossible: 5,
    message: `Duración adecuada para la disponibilidad de ${availableMinutes} min.`,
  };
}

/**
 * ============================================================================
 * PRIORIDAD 7: INTENSIDAD FISIOLÓGICA
 * ============================================================================
 */
export function evaluateIntensityRule(
  exercise: Exercise,
  user: UserProfile
): RuleEvaluationDetail {
  const targetIntensity = user.preferences?.targetIntensity || 'MEDIUM';
  const exerciseIntensity = exercise.intensity || IntensityLevel.MEDIUM;

  if (targetIntensity === 'LOW' && exerciseIntensity === IntensityLevel.HIGH) {
    return {
      ruleType: RuleType.INTENSITY_FIT,
      priority: RulePriority.INTENSITY_FIT,
      passed: true,
      isHardFilter: false,
      scoreContribution: 2,
      maxScorePossible: 5,
      message: 'Intensidad alta para la preferencia actual de baja exigencia. Requiere moderación de ritmo.',
      suggestedModification: 'Aumentar descansos y moderar el tempo excéntrico.',
    };
  }

  return {
    ruleType: RuleType.INTENSITY_FIT,
    priority: RulePriority.INTENSITY_FIT,
    passed: true,
    isHardFilter: false,
    scoreContribution: 5,
    maxScorePossible: 5,
    message: `Intensidad ${exerciseIntensity} alineada con la capacidad y preferencia.`,
  };
}

/**
 * ============================================================================
 * PRIORIDAD 8: PREFERENCIAS DEL USUARIO
 * ============================================================================
 */
export function evaluatePreferencesRule(
  exercise: Exercise,
  user: UserProfile
): RuleEvaluationDetail {
  let score = 5;

  // Preferencia de calentamiento / vuelta a la calma
  if (user.preferences?.warmupPreference && exercise.categories?.includes(ExerciseCategory.MOBILITY)) {
    score = 6;
  }

  return {
    ruleType: RuleType.USER_PREFERENCES,
    priority: RulePriority.PREFERENCES,
    passed: true,
    isHardFilter: false,
    scoreContribution: score,
    maxScorePossible: 6,
    message: 'Consistente con las preferencias semanales y cadencia del usuario.',
  };
}

/**
 * ============================================================================
 * PRIORIDAD 9: MORFOLOGÍA CORPORAL (VARIABLE SECUNDARIA NO DIAGNÓSTICA)
 * ============================================================================
 * REGLA ESTRICTA DE SEGURIDAD Y ÉTICA:
 * Nunca debe utilizarse para:
 * - Diagnosticar
 * - Determinar estado de salud
 * - Prometer pérdida localizada de grasa
 * Solo modula de forma sutil y opcional prioridades de equilibrio postural.
 */
export function evaluateMorphologyRule(
  exercise: Exercise,
  user: UserProfile
): RuleEvaluationDetail {
  const morphology = user.morphology;

  if (!morphology) {
    return {
      ruleType: RuleType.BODY_MORPHOLOGY,
      priority: RulePriority.BODY_MORPHOLOGY,
      passed: true,
      isHardFilter: false,
      scoreContribution: 3,
      maxScorePossible: 4,
      message: 'Morfología neutra no especificada. Enfoque anatómico estándar.',
    };
  }

  let adjustmentMessage = 'Ajuste biomecánico general para ergonomía articular.';
  let bonus = 3;

  switch (morphology) {
    case BodyMorphology.RECTANGULAR:
      // Soporte en estabilidad de la faja lumbo-abdominal
      if (exercise.bodyArea?.toString().toUpperCase() === 'CORE' || exercise.category === ExerciseCategory.TONING) {
        bonus = 4;
        adjustmentMessage = 'Ajuste postural complementario: Favorece activación de musculatura estabilizadora profunda.';
      }
      break;

    case BodyMorphology.TRIANGULAR:
      // Soporte en equilibrio escapular y tren superior
      if (exercise.bodyArea?.toString().toUpperCase() === 'UPPER_BODY' || exercise.bodyArea?.toString().toUpperCase() === 'BACK') {
        bonus = 4;
        adjustmentMessage = 'Ajuste postural complementario: Fortalecimiento de cadena escapular para balance biomecánico.';
      }
      break;

    case BodyMorphology.INVERTED_TRIANGLE:
      // Soporte en estabilidad pélvica y cadena inferior
      if (exercise.bodyArea?.toString().toUpperCase() === 'LOWER_BODY' || exercise.bodyArea?.toString().toUpperCase() === 'GLUTES') {
        bonus = 4;
        adjustmentMessage = 'Ajuste postural complementario: Favorece anclaje pélvico y estabilidad de tren inferior.';
      }
      break;

    case BodyMorphology.HOURGLASS:
      bonus = 4;
      adjustmentMessage = 'Ajuste postural complementario: Movimiento multiplanar armónico de cadenas cruzadas.';
      break;

    case BodyMorphology.OVAL:
      // Preferencia por descompresión articular y confort diafragmático
      if (exercise.impactLevel === ImpactLevel.LOW) {
        bonus = 4;
        adjustmentMessage = 'Ajuste ergonómico complementario: Movimiento fluido con mínima carga axial articular.';
      }
      break;
  }

  return {
    ruleType: RuleType.BODY_MORPHOLOGY,
    priority: RulePriority.BODY_MORPHOLOGY,
    passed: true,
    isHardFilter: false,
    scoreContribution: bonus,
    maxScorePossible: 4,
    message: `${adjustmentMessage} (Ajuste ergonómico secundario no diagnóstico).`,
  };
}
