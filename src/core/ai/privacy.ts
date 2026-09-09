/**
 * FitAdapt AI - Módulo de Privacidad y Sanitización de Contexto
 * FASE 9: Asistente Contextual FitAdapt AI
 * 
 * Principio:
 * Separar datos necesarios de datos sensibles innecesarios.
 * No enviar nombres completos, correos, fotos, pesos o medidas corporales a la IA.
 * Respetar las preferencias configuradas por el usuario.
 */

import { UserProfile } from '../../types/user';
import { Workout } from '../../types/workout';
import { AIPrivacySettings, SanitizedAIContext, DEFAULT_AI_PRIVACY_SETTINGS } from './types';
import { ProgressManager } from '../progress/progressManager';

const AI_PRIVACY_KEY = 'fitadapt_ai_privacy_settings_v1';

export class AIPrivacyManager {
  /**
   * Carga las preferencias de privacidad del usuario desde almacenamiento local
   */
  public static getSettings(): AIPrivacySettings {
    try {
      const stored = localStorage.getItem(AI_PRIVACY_KEY);
      if (stored) {
        return { ...DEFAULT_AI_PRIVACY_SETTINGS, ...JSON.parse(stored) };
      }
    } catch {
      // Ignorar fallos de acceso local
    }
    return { ...DEFAULT_AI_PRIVACY_SETTINGS };
  }

  /**
   * Guarda las preferencias de privacidad del usuario
   */
  public static saveSettings(settings: AIPrivacySettings): void {
    try {
      localStorage.setItem(AI_PRIVACY_KEY, JSON.stringify(settings));
    } catch {
      // Ignorar fallos
    }
  }

  /**
   * Construye un contexto sanitizado y seguro para el asistente de IA
   * excluyendo información personal identificable (PII) y respetando las banderas activas.
   */
  public static buildSanitizedContext(
    user: UserProfile,
    workout?: Workout | null,
    settings?: AIPrivacySettings
  ): SanitizedAIContext {
    const privacy = settings || this.getSettings();
    const context: SanitizedAIContext = {};

    // 1. Perfil seguro (sólo objetivos, nivel y limitaciones articulares despersonalizadas)
    if (privacy.shareGoalsAndLevel || privacy.shareEquipmentAndLocation || privacy.shareLimitations) {
      context.user = {};

      if (privacy.shareGoalsAndLevel) {
        context.user.primaryGoal = user.primaryGoal;
        context.user.fitnessLevel = user.fitnessLevel;
      }

      if (privacy.shareEquipmentAndLocation) {
        context.user.trainingLocation = user.trainingLocation;
        context.user.availableEquipment = user.availableEquipment || [];
      }

      if (privacy.shareLimitations) {
        context.user.declaredLimitations = (user.limitations || []).map(
          (l) => `${l.name || l.category} (${l.code})${l.requiresLowImpact ? ' [Requiere bajo impacto]' : ''}`
        );
      }
    }

    // 2. Rutina actual (sólo estructura técnica, sin datos de ubicación o historial privado)
    if (privacy.shareCurrentWorkout && workout) {
      context.currentWorkout = {
        id: workout.id,
        title: workout.title,
        estimatedDurationMinutes: workout.estimatedDurationMinutes,
        goal: workout.goal,
        fitnessLevel: workout.fitnessLevel,
        exerciseCount: workout.exercises.length,
        exercises: workout.exercises.map((e) => ({
          exerciseId: e.exerciseId,
          name: e.exerciseSnapshot.name,
          section: e.section,
          sets: e.sets,
          repsOrDuration: e.reps ? `${e.reps} reps` : `${e.duration || 30}s`,
          bodyArea: e.exerciseSnapshot.bodyArea,
          category: e.exerciseSnapshot.category,
          equipment: e.exerciseSnapshot.equipment,
        })),
      };
    }

    // 3. Resumen básico de constancia (sin datos de peso ni medidas corporales privadas)
    if (privacy.shareProgressStats) {
      try {
        const stats = ProgressManager.getDashboardSummary(user.daysPerWeek || 3, user.primaryGoal);
        context.progressSummary = {
          completedWorkouts: stats.totalWorkoutsCompleted,
          totalMinutes: stats.totalMinutesTrained,
          currentStreakDays: stats.currentStreak,
          weeklySessions: stats.sessionsThisWeek,
        };
      } catch {
        // En caso de que no haya datos aún
      }
    }

    return context;
  }
}
