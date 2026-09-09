/**
 * FitAdapt AI - Filtro y Guardián Ético de Seguridad Médica
 * FASE 9: Asistente Contextual FitAdapt AI
 * 
 * Reglas de Interceptación:
 * 1. Preguntas de diagnóstico ("¿qué lesión tengo?", "¿tengo rotura/tendinitis/hernia?", "¿por qué me duele?")
 * 2. Dolores agudos, punzantes, síntomas alarmantes o cirugías recientes
 * 3. Prohibición de emitir juicios médicos o tratamientos clínicos
 */

export interface MedicalSafetyCheckResult {
  isMedicalQuery: boolean;
  isAcutePainAlert: boolean;
  refusalMessage?: string;
  professionalReferralMessage?: string;
}

export class MedicalSafetyFilter {
  // Palabras o patrones de solicitud de diagnóstico clínico
  private static readonly DIAGNOSTIC_PATTERNS = [
    /qué lesión tengo/i,
    /que lesion tengo/i,
    /diagnostica/i,
    /diagnosticame/i,
    /diagnostícame/i,
    /tengo tendinitis/i,
    /tengo rotura/i,
    /tengo hernia/i,
    /tengo fascitis/i,
    /estoy lesionad/i,
    /por qu[ée] me duele tanto/i,
    /qu[ée] enfermedad tengo/i,
    /puedo tomar ibuprofeno/i,
    /qu[ée] medicamento/i,
  ];

  // Palabras o patrones de dolor agudo, síntomas alarmantes o cirugía
  private static readonly ACUTE_PAIN_PATTERNS = [
    /dolor agudo/i,
    /dolor punzante/i,
    /dolor intenso/i,
    /dolor insoportable/i,
    /se me durmió el brazo/i,
    /se me durmio/i,
    /adormecimiento/i,
    /me mare[ée]/i,
    /mareos/i,
    /opresi[oó]n en el pecho/i,
    /dolor de pecho/i,
    /cirug[ií]a reciente/i,
    /reci[eé]n operad/i,
    /hinchaz[oó]n repentina/i,
    /crujido con dolor fuerte/i,
  ];

  /**
   * Evalúa el texto del usuario antes o en paralelo a la IA
   */
  public static evaluate(query: string): MedicalSafetyCheckResult {
    const text = query.trim();

    // 1. Detección de dolor agudo o alarma física
    const isAcute = this.ACUTE_PAIN_PATTERNS.some((p) => p.test(text));
    if (isAcute) {
      return {
        isMedicalQuery: true,
        isAcutePainAlert: true,
        refusalMessage:
          '⚠️ Alerta de Seguridad Física: FitAdapt es una plataforma de acondicionamiento físico y no cuenta con capacidad médica para evaluar síntomas agudos.',
        professionalReferralMessage:
          'Por favor, suspende de inmediato la actividad física y no intentes forzar la articulación o zona afectada. Te recomendamos acudir a un centro médico, médico traumatólogo o fisioterapeuta colegiado para una valoración presencial profesional adecuada.',
      };
    }

    // 2. Detección de solicitud de diagnóstico médico
    const isDiagnostic = this.DIAGNOSTIC_PATTERNS.some((p) => p.test(text));
    if (isDiagnostic) {
      return {
        isMedicalQuery: true,
        isAcutePainAlert: false,
        refusalMessage:
          'ℹ️ FitAdapt no puede diagnosticar lesiones ni patologías médicas.',
        professionalReferralMessage:
          'Como asistente de entrenamiento, puedo sugerirte ejercicios de menor impacto o adaptar la rutina a limitaciones previamente diagnosticadas, pero determinar qué lesión o afección tienes requiere una exploración clínica profesional. Si sientes dolor o molestia persistente, por favor consulta con un médico o fisioterapeuta.',
      };
    }

    return {
      isMedicalQuery: false,
      isAcutePainAlert: false,
    };
  }
}
