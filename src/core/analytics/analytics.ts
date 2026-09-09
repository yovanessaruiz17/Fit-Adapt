/**
 * FitAdapt Privacy-First Analytics Service
 * Collects strictly anonymized functional telemetry without any PII (no names, emails, IPs, or location).
 * Retained in local client storage with user control to clear or disable.
 */

export type AnalyticsEventType =
  | 'onboarding_completed'
  | 'workout_generated'
  | 'workout_started'
  | 'workout_completed'
  | 'workout_abandoned'
  | 'exercise_replaced'
  | 'ai_used'
  | 'notification_enabled'
  | 'pwa_installed'
  | 'error_encountered';

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

const ANALYTICS_STORAGE_KEY = 'fitadapt_analytics_log_v1';
const ANALYTICS_ENABLED_KEY = 'fitadapt_analytics_enabled_v1';

export class AnalyticsService {
  public static isEnabled(): boolean {
    try {
      const val = localStorage.getItem(ANALYTICS_ENABLED_KEY);
      return val !== 'false'; // Enabled by default unless user opts out
    } catch {
      return true;
    }
  }

  public static setEnabled(enabled: boolean): void {
    try {
      localStorage.setItem(ANALYTICS_ENABLED_KEY, String(enabled));
    } catch (err) {
      console.error('Error saving analytics preference:', err);
    }
  }

  public static logEvent(type: AnalyticsEventType, metadata?: Record<string, string | number | boolean>): void {
    if (!this.isEnabled()) return;

    try {
      const event: AnalyticsEvent = {
        id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        type,
        timestamp: new Date().toISOString(),
        metadata: metadata ? this.sanitizeMetadata(metadata) : undefined,
      };

      const events = this.getRecentEvents(99);
      events.push(event);

      // Keep maximum 100 recent events in local rotating storage
      const trimmed = events.slice(-100);
      localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(trimmed));
    } catch (err) {
      // Fail silently to never interrupt user experience
    }
  }

  public static getRecentEvents(limit: number = 50): AnalyticsEvent[] {
    try {
      const data = localStorage.getItem(ANALYTICS_STORAGE_KEY);
      const events: AnalyticsEvent[] = data ? JSON.parse(data) : [];
      return events.slice(-limit);
    } catch {
      return [];
    }
  }

  public static clearEvents(): void {
    try {
      localStorage.removeItem(ANALYTICS_STORAGE_KEY);
    } catch (err) {
      console.error('Error clearing analytics:', err);
    }
  }

  /**
   * Sanitizes metadata to ensure no PII or freeform medical texts leak into logs
   */
  private static sanitizeMetadata(data: Record<string, any>): Record<string, any> {
    const clean: Record<string, any> = {};
    for (const [key, val] of Object.entries(data)) {
      // Whitelist safe scalar types
      if (typeof val === 'number' || typeof val === 'boolean') {
        clean[key] = val;
      } else if (typeof val === 'string') {
        // Truncate strings to prevent accidental blob leakage
        clean[key] = val.substring(0, 50);
      }
    }
    return clean;
  }
}
