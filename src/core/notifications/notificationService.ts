/**
 * FitAdapt Notification Service
 * Responsible for scheduled reminders, streak alerts, and weekly summaries.
 * Complies with strict anti-spam rules, user preferences, and quiet hours.
 */

export interface NotificationPreferences {
  enabled: boolean;
  preferredTime: string; // e.g. "18:00"
  reminderWorkout: boolean;
  reminderStreak: boolean;
  reminderWeekly: boolean;
  quietHours: boolean; // 22:00 to 08:00
  lastNotificationSentAt: string | null;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  enabled: false,
  preferredTime: '18:00',
  reminderWorkout: true,
  reminderStreak: true,
  reminderWeekly: true,
  quietHours: true,
  lastNotificationSentAt: null,
};

const PREFS_KEY = 'fitadapt_notification_prefs_v1';

export class NotificationService {
  public static isSupported(): boolean {
    return typeof window !== 'undefined' && 'Notification' in window;
  }

  public static getPermission(): NotificationPermission {
    if (!this.isSupported()) return 'denied';
    return Notification.permission;
  }

  public static async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) return 'denied';
    try {
      const perm = await Notification.requestPermission();
      if (perm === 'granted') {
        const prefs = this.getPreferences();
        prefs.enabled = true;
        this.savePreferences(prefs);
      }
      return perm;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return 'denied';
    }
  }

  public static getPreferences(): NotificationPreferences {
    try {
      const data = localStorage.getItem(PREFS_KEY);
      if (data) {
        return { ...DEFAULT_NOTIFICATION_PREFERENCES, ...JSON.parse(data) };
      }
    } catch (err) {
      console.error('Error reading notification preferences:', err);
    }
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }

  public static savePreferences(prefs: NotificationPreferences): void {
    try {
      localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
    } catch (err) {
      console.error('Error saving notification preferences:', err);
    }
  }

  /**
   * Safe notification sender checking preferences, quiet hours and frequency caps.
   */
  public static async sendNotification(
    title: string,
    options?: NotificationOptions & { category?: 'workout' | 'streak' | 'weekly' | 'test' }
  ): Promise<boolean> {
    if (!this.isSupported() || Notification.permission !== 'granted') {
      return false;
    }

    const prefs = this.getPreferences();
    if (!prefs.enabled && options?.category !== 'test') {
      return false;
    }

    // Check Quiet Hours (22:00 - 08:00) unless it is a test triggered by user
    if (prefs.quietHours && options?.category !== 'test') {
      const currentHour = new Date().getHours();
      if (currentHour >= 22 || currentHour < 8) {
        return false;
      }
    }

    // Frequency cap: At most 1 automated notification per 8 hours
    if (prefs.lastNotificationSentAt && options?.category !== 'test') {
      const lastSent = new Date(prefs.lastNotificationSentAt).getTime();
      const diffHours = (Date.now() - lastSent) / (1000 * 60 * 60);
      if (diffHours < 8) {
        return false;
      }
    }

    try {
      const notification = new Notification(title, {
        icon: '/pwa-192x192.png',
        badge: '/pwa-192x192.png',
        ...options,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      if (options?.category !== 'test') {
        prefs.lastNotificationSentAt = new Date().toISOString();
        this.savePreferences(prefs);
      }

      return true;
    } catch (err) {
      console.error('Error displaying notification:', err);
      return false;
    }
  }

  public static triggerTestNotification(): Promise<boolean> {
    return this.sendNotification('FitAdapt - Recordatorio de Ejemplo', {
      body: 'Tu sesión personalizada está lista. ¡Prioriza la técnica y cuida tus articulaciones hoy!',
      category: 'test',
    });
  }

  public static triggerStreakReminder(streakDays: number): Promise<boolean> {
    return this.sendNotification('¡Tu racha sigue activa en FitAdapt!', {
      body: `Llevas ${streakDays} días de constancia. Una sesión corta de 15 minutos mantendrá tu impulso intacto.`,
      category: 'streak',
    });
  }

  public static triggerWeeklySummary(workoutsCount: number, minutes: number): Promise<boolean> {
    return this.sendNotification('Resumen semanal FitAdapt', {
      body: `Esta semana completaste ${workoutsCount} sesiones y ${minutes} minutos acumulados. ¡Gran trabajo de constancia!`,
      category: 'weekly',
    });
  }
}
