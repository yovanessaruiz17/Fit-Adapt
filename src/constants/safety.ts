/**
 * FitAdapt - Políticas de Seguridad, Ética y Responsabilidad Médica
 * FASE 1: Arquitectura y Modelos Base
 */

export const MEDICAL_DISCLAIMER_TEXT = {
  short: 'FitAdapt no proporciona diagnósticos médicos ni sustituye la prescripción de un profesional de la salud.',
  full: `FitAdapt es una plataforma tecnológica para la planificación personalizada de actividad física basada en tus preferencias y limitaciones declaradas. No constituye un dispositivo médico, no diagnostica lesiones o patologías, ni afirma curar afecciones físicas. Si experimentas dolor agudo, has tenido una cirugía reciente o presentas síntomas persistentes, debes suspender la actividad y consultar con un médico colegiado o fisioterapeuta antes de comenzar cualquier programa de ejercicios.`,
  noSpotReductionWarning: `La evidencia científica demuestra que no es posible perder grasa de forma localizada mediante ejercicios específicos en una zona corporal determinada. Los planes promueven un balance calórico y una composición corporal saludable integral.`,
};

export const RED_FLAG_SYMPTOMS = [
  'Dolor agudo punzante o repentino durante cualquier movimiento',
  'Mareos, vértigos, visión borrosa o pérdida de conocimiento',
  'Opresión, tirantez o dolor torácico irradiado',
  'Dificultad respiratoria desproporcionada',
  'Inflamación severa, calor localizado o entumecimiento en extremidades',
  'Cirugía reciente o lesión traumatológica no dada de alta médica',
];

export const SAFETY_AUDIT_RULES = {
  PRIORITIZE_LIMITATIONS: true, // Las limitaciones declaradas siempre anulan cualquier objetivo de rendimiento
  AUTO_CONVERT_HIGH_IMPACT_ON_JOINT_LIMITATIONS: true,
  STRICT_EXERCISE_CATALOG_ONLY: true, // La IA y el motor no pueden crear ejercicios al vuelo
};
