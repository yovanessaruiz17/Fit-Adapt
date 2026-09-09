/**
 * FitAdapt - Sistema de Puntuación (Scoring Engine)
 * FASE 5: Motor de Personalización y Compatibilidad
 * 
 * Reglas Fundamentales del Scoring:
 * 1. Determinista y transparente (desglose exacto de 0 a 100 puntos).
 * 2. REGLA INQUEBRANTABLE: Las limitaciones de seguridad NUNCA pueden ser
 *    anuladas por una puntuación positiva. Un ejercicio descalificado por
 *    seguridad recibe un score total de 0 y estado NOT_RECOMMENDED.
 * 3. Los ejercicios que requieren modificaciones adaptativas reciben una
 *    penalización de fricción controlada (-15 puntos) y un tope máximo de 78 pts,
 *    asegurando que los ejercicios 100% compatibles sin fricción lideren el ranking.
 */

import {
  RuleEvaluationDetail,
  RuleType,
  ScoreBreakdown,
  CompatibilityStatus,
} from '../../types/compatibility';

export class ScoringEngine {
  /**
   * Calcula el desglose estructurado y la puntuación final de un ejercicio evaluado
   */
  public static calculate(
    ruleDetails: RuleEvaluationDetail[],
    hardFilterFailed: boolean,
    hasModifications: boolean
  ): { overallScore: number; scoreBreakdown: ScoreBreakdown; status: CompatibilityStatus } {
    // 1. Desglose inicial
    let safety = 100;
    let goal = 0;
    let level = 0;
    let equipment = 0;
    let location = 0;
    let time = 0;
    let intensity = 0;
    let preferences = 0;
    let morphology = 0;

    ruleDetails.forEach((rule) => {
      switch (rule.ruleType) {
        case RuleType.LIMITATION_SAFETY:
        case RuleType.IMPACT_SAFETY:
          if (!rule.passed) safety = 0;
          break;
        case RuleType.GOAL_ALIGNMENT:
          goal = rule.scoreContribution;
          break;
        case RuleType.FITNESS_LEVEL:
          level = rule.scoreContribution;
          break;
        case RuleType.EQUIPMENT_AVAILABILITY:
          equipment = rule.scoreContribution;
          break;
        case RuleType.LOCATION_MATCH:
          location = rule.scoreContribution;
          break;
        case RuleType.TIME_CONSTRAINTS:
          time = rule.scoreContribution;
          break;
        case RuleType.INTENSITY_FIT:
          intensity = rule.scoreContribution;
          break;
        case RuleType.USER_PREFERENCES:
          preferences = rule.scoreContribution;
          break;
        case RuleType.BODY_MORPHOLOGY:
          morphology = rule.scoreContribution;
          break;
      }
    });

    // 2. REGLA ESTRICTA DE SEGURIDAD:
    // Si falló algún filtro duro (especialmente de seguridad / limitaciones)
    if (hardFilterFailed || safety === 0) {
      const breakdown: ScoreBreakdown = {
        safety: 0,
        goal,
        level,
        equipment,
        location,
        time,
        intensity,
        preferences,
        morphology,
        modificationsPenalty: 0,
        total: 0,
      };

      return {
        overallScore: 0,
        scoreBreakdown: breakdown,
        status: CompatibilityStatus.NOT_RECOMMENDED,
      };
    }

    // 3. Caso Adaptable / Con Modificación
    if (hasModifications) {
      const modificationsPenalty = -15;
      const rawSum = goal + level + equipment + location + time + intensity + preferences + morphology;
      const netTotal = Math.max(40, Math.min(78, rawSum + modificationsPenalty));

      const breakdown: ScoreBreakdown = {
        safety: 100,
        goal,
        level,
        equipment,
        location,
        time,
        intensity,
        preferences,
        morphology,
        modificationsPenalty,
        total: netTotal,
      };

      return {
        overallScore: netTotal,
        scoreBreakdown: breakdown,
        status: CompatibilityStatus.COMPATIBLE_WITH_MODIFICATION,
      };
    }

    // 4. Caso Totalmente Compatible
    const rawSum = goal + level + equipment + location + time + intensity + preferences + morphology;
    // La suma teórica máxima es 30 + 20 + 20 + 10 + 5 + 5 + 6 + 4 = 100 puntos
    const finalTotal = Math.max(70, Math.min(100, rawSum));

    const breakdown: ScoreBreakdown = {
      safety: 100,
      goal,
      level,
      equipment,
      location,
      time,
      intensity,
      preferences,
      morphology,
      modificationsPenalty: 0,
      total: finalTotal,
    };

    return {
      overallScore: finalTotal,
      scoreBreakdown: breakdown,
      status: CompatibilityStatus.COMPATIBLE,
    };
  }
}
