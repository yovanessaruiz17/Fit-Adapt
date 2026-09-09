/**
 * FitAdapt AI - Servicio de Comunicación y Orquestación
 * FASE 9: Asistente Contextual FitAdapt AI
 * 
 * Flujo:
 * 1. Sanitiza el contexto del usuario y rutina activa según las directivas de privacidad.
 * 2. Verifica filtros éticos y de seguridad médica.
 * 3. Consulta el endpoint del servidor (/api/ai/chat) conectado a Gemini 3.8 Flash.
 * 4. Si el servidor no está disponible o falla, activa el FallbackAssistant local sin interrupciones.
 */

import { UserProfile } from '../../types/user';
import { Workout } from '../../types/workout';
import { AIChatMessage, AIPrivacySettings } from './types';
import { AIPrivacyManager } from './privacy';
import { FallbackAssistant } from './fallbackAssistant';
import { MedicalSafetyFilter } from './safetyFilter';

const CHAT_STORAGE_KEY = 'fitadapt_ai_chat_history_v1';

export class FitAdaptAIService {
  /**
   * Carga el historial previo de mensajes guardado localmente
   */
  public static loadHistory(): AIChatMessage[] {
    try {
      const stored = localStorage.getItem(CHAT_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // Ignorar fallos de parseo
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content:
          '¡Hola! Soy **FitAdapt AI**, tu asistente de entrenamiento. Puedo explicarte la técnica de tus ejercicios, buscar alternativas compatibles con tus articulaciones, adaptar la duración o intensidad de tu rutina y ayudarte a interpretar tu progreso. ¿En qué te gustaría enfocarte hoy?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  }

  /**
   * Guarda el historial de mensajes
   */
  public static saveHistory(messages: AIChatMessage[]): void {
    try {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      // Ignorar
    }
  }

  /**
   * Limpia el historial de la conversación
   */
  public static clearHistory(): void {
    try {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    } catch {
      // Ignorar
    }
  }

  /**
   * Envía un mensaje a FitAdapt AI y obtiene una respuesta segura
   */
  public static async sendMessage(
    query: string,
    user: UserProfile,
    workout?: Workout | null,
    history: AIChatMessage[] = []
  ): Promise<AIChatMessage> {
    const trimmed = query.trim();
    if (!trimmed) {
      throw new Error('La consulta no puede estar vacía.');
    }

    // 1. Comprobación de seguridad médica prioritaria (inmediata en cliente)
    const medicalCheck = MedicalSafetyFilter.evaluate(trimmed);
    if (medicalCheck.isMedicalQuery) {
      return {
        id: `ai-msg-${Date.now()}`,
        role: 'assistant',
        content: `${medicalCheck.refusalMessage}\n\n${medicalCheck.professionalReferralMessage}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMedicalWarning: true,
        actionPayload: {
          type: 'MEDICAL_DISCLAIMER',
          reason: 'Consulta médica o dolor agudo detectado. Se rechaza diagnóstico y se sugiere evaluación profesional.',
        },
      };
    }

    // 2. Construcción de contexto sanitizado respetando la configuración de privacidad
    const sanitizedContext = AIPrivacyManager.buildSanitizedContext(user, workout);

    try {
      // Intentar llamada al backend Express con timeout de 8 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: trimmed,
          context: sanitizedContext,
          history: history.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        if (data && data.content) {
          return {
            id: `ai-msg-${Date.now()}`,
            role: 'assistant',
            content: data.content,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            actionPayload: data.actionPayload,
            isFallback: data.isFallback || false,
            sourceTool: data.sourceTool,
          };
        }
      }
    } catch {
      // Si el servidor falla, hay timeout o la red no responde: activar fallback local
    }

    // 3. Fallback determinista local seguro respaldado por el Compatibility Engine
    return FallbackAssistant.processQuery(trimmed, user, workout);
  }
}
