/**
 * FitAdapt - Almacenamiento Local de Sesiones e Historial
 * FASE 7: Persistencia y Recuperación de Sesión Activa
 */

import { WorkoutSession, ActiveWorkoutState } from '../../types/workout';

const SESSIONS_HISTORY_KEY = 'fitadapt_workout_sessions_history';
const ACTIVE_SESSION_KEY = 'fitadapt_active_workout_state';

export class SessionStorageManager {
  /**
   * Obtiene el historial de sesiones completadas o abandonadas.
   */
  public static getHistory(): WorkoutSession[] {
    try {
      const data = localStorage.getItem(SESSIONS_HISTORY_KEY);
      if (!data) return [];
      return JSON.parse(data) as WorkoutSession[];
    } catch (e) {
      console.warn('Error al leer historial de sesiones:', e);
      return [];
    }
  }

  /**
   * Guarda una nueva sesión (completada o abandonada) en el historial.
   */
  public static saveSession(session: WorkoutSession): void {
    try {
      const history = this.getHistory();
      // Si ya existe por ID, actualizarla; si no, agregarla al principio
      const index = history.findIndex((s) => s.id === session.id);
      if (index >= 0) {
        history[index] = session;
      } else {
        history.unshift(session);
      }
      localStorage.setItem(SESSIONS_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('Error al guardar sesión en historial:', e);
    }
  }

  /**
   * Guarda el estado de la sesión activa en tiempo real.
   */
  public static saveActiveState(state: ActiveWorkoutState): void {
    try {
      localStorage.setItem(ACTIVE_SESSION_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Error al persistir estado activo:', e);
    }
  }

  /**
   * Obtiene el estado de la sesión activa en curso (si existe).
   */
  public static getActiveState(): ActiveWorkoutState | null {
    try {
      const data = localStorage.getItem(ACTIVE_SESSION_KEY);
      if (!data) return null;
      const parsed = JSON.parse(data) as ActiveWorkoutState;
      // Validar que no tenga más de 24 horas de antigüedad
      if (Date.now() - (parsed.lastSavedTimestamp || 0) > 24 * 60 * 60 * 1000) {
        this.clearActiveState();
        return null;
      }
      return parsed;
    } catch (e) {
      console.warn('Error al recuperar sesión activa:', e);
      return null;
    }
  }

  /**
   * Limpia el estado de la sesión activa al finalizar o cancelar.
   */
  public static clearActiveState(): void {
    try {
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch (e) {
      console.warn('Error al limpiar sesión activa:', e);
    }
  }
}
