/**
 * FitAdapt - Modelos de Capa Asistiva de Inteligencia Artificial
 * FASE 1: Arquitectura y Modelos Base
 * 
 * REGLA ARQUITECTÓNICA:
 * La IA opera exclusivamente como capa asistiva / explicativa.
 * NUNCA inventa ejercicios fuera del catálogo estructurado
 * NUNCA ignora restricciones o contraindicaciones médicas o de compatibilidad.
 */

export enum AIInteractionType {
  EXERCISE_EXPLANATION = 'EXERCISE_EXPLANATION',     // Explicación biomecánica amigable
  MODIFICATION_SUGGESTION = 'MODIFICATION_SUGGESTION', // Sugerencia de ajuste asistido
  WORKOUT_SUMMARY = 'WORKOUT_SUMMARY',               // Resumen motivador del entrenamiento
  QUESTION_ANSWERING = 'QUESTION_ANSWERING',         // Dudas de técnica o descanso
}

export enum AISafetyClassification {
  SAFE_COMPLIANT = 'SAFE_COMPLIANT',                 // Dentro del dominio seguro
  SAFETY_DISCLAIMER_ATTACHED = 'SAFETY_DISCLAIMER_ATTACHED', // Incluye recordatorio preventivo
  REFUSED_MEDICAL_QUESTION = 'REFUSED_MEDICAL_QUESTION', // Pregunta médica bloqueada/derivada
}

export interface AIContextConstraint {
  allowedExerciseIds: string[];
  incompatibleLimitationCodes: string[];
  userFitnessLevel: string;
  userGoal: string;
}

export interface AIInteraction {
  id: string;
  userId: string;
  timestamp: string;
  interactionType: AIInteractionType;
  prompt: string;
  response: string;
  
  // Límites y validación de seguridad
  safetyClassification: AISafetyClassification;
  referencedExerciseIds?: string[];
  enforcedConstraints?: AIContextConstraint;
  
  // Control de calidad: verificación de que no violó ninguna regla
  passedSafetyAudit: boolean;
}
