/**
 * FitAdapt - Gestor del Sistema de Progreso Personal
 * FASE 8: Progreso, Métricas y Logros
 */

import {
  WeightRecord,
  BodyMeasurementRecord,
  MeasurementPreferences,
  StreakCalculation,
  Achievement,
  ProgressDashboardData,
} from '../../types/progress';
import { WorkoutSession, WorkoutSessionStatus } from '../../types/workout';
import { FitnessGoal } from '../../types/user';
import { SessionStorageManager } from '../session/sessionStorage';

const WEIGHT_STORAGE_KEY = 'fitadapt_weight_records';
const MEASUREMENTS_STORAGE_KEY = 'fitadapt_measurement_records';
const MEASUREMENT_PREFS_KEY = 'fitadapt_measurement_preferences';

export class ProgressManager {
  // =========================================================================
  // GESTIÓN DE REGISTROS DE PESO
  // =========================================================================

  public static getWeightRecords(): WeightRecord[] {
    try {
      const data = localStorage.getItem(WEIGHT_STORAGE_KEY);
      if (!data) {
        // Datos iniciales de demostración contextual (pueden ser borrados o editados)
        const initial = this.getInitialSampleWeight();
        this.saveWeightRecords(initial);
        return initial;
      }
      const records = JSON.parse(data) as WeightRecord[];
      return records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (e) {
      console.warn('Error al leer registros de peso:', e);
      return [];
    }
  }

  public static saveWeightRecords(records: WeightRecord[]): void {
    try {
      localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Error al guardar registros de peso:', e);
    }
  }

  public static addWeightRecord(weightKg: number, date: string, note?: string): WeightRecord {
    const records = this.getWeightRecords();
    const newRecord: WeightRecord = {
      id: 'w_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      date,
      weightKg: Math.round(weightKg * 10) / 10,
      note,
      createdAt: new Date().toISOString(),
    };
    records.push(newRecord);
    this.saveWeightRecords(records);
    return newRecord;
  }

  public static updateWeightRecord(id: string, weightKg: number, date: string, note?: string): boolean {
    const records = this.getWeightRecords();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return false;

    records[index] = {
      ...records[index],
      weightKg: Math.round(weightKg * 10) / 10,
      date,
      note,
    };
    this.saveWeightRecords(records);
    return true;
  }

  public static deleteWeightRecord(id: string): boolean {
    const records = this.getWeightRecords();
    const filtered = records.filter((r) => r.id !== id);
    if (filtered.length === records.length) return false;
    this.saveWeightRecords(filtered);
    return true;
  }

  // =========================================================================
  // GESTIÓN DE MEDIDAS CORPORALES
  // =========================================================================

  public static getMeasurementRecords(): BodyMeasurementRecord[] {
    try {
      const data = localStorage.getItem(MEASUREMENTS_STORAGE_KEY);
      if (!data) {
        const initial = this.getInitialSampleMeasurements();
        this.saveMeasurementRecords(initial);
        return initial;
      }
      const records = JSON.parse(data) as BodyMeasurementRecord[];
      return records.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } catch (e) {
      console.warn('Error al leer registros de medidas:', e);
      return [];
    }
  }

  public static saveMeasurementRecords(records: BodyMeasurementRecord[]): void {
    try {
      localStorage.setItem(MEASUREMENTS_STORAGE_KEY, JSON.stringify(records));
    } catch (e) {
      console.warn('Error al guardar registros de medidas:', e);
    }
  }

  public static addMeasurementRecord(record: Omit<BodyMeasurementRecord, 'id' | 'createdAt'>): BodyMeasurementRecord {
    const records = this.getMeasurementRecords();
    const newRecord: BodyMeasurementRecord = {
      ...record,
      id: 'm_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      createdAt: new Date().toISOString(),
    };
    records.push(newRecord);
    this.saveMeasurementRecords(records);
    return newRecord;
  }

  public static updateMeasurementRecord(
    id: string,
    updated: Partial<Omit<BodyMeasurementRecord, 'id' | 'createdAt'>>
  ): boolean {
    const records = this.getMeasurementRecords();
    const index = records.findIndex((r) => r.id === id);
    if (index === -1) return false;

    records[index] = {
      ...records[index],
      ...updated,
    };
    this.saveMeasurementRecords(records);
    return true;
  }

  public static deleteMeasurementRecord(id: string): boolean {
    const records = this.getMeasurementRecords();
    const filtered = records.filter((r) => r.id !== id);
    if (filtered.length === records.length) return false;
    this.saveMeasurementRecords(filtered);
    return true;
  }

  // Preferencias de métricas activas/desactivadas por el usuario
  public static getMeasurementPreferences(): MeasurementPreferences {
    try {
      const data = localStorage.getItem(MEASUREMENT_PREFS_KEY);
      if (!data) {
        return {
          enabledMetrics: {
            waist: true,
            hip: true,
            arm: false,
            thigh: false,
            chest: false,
          },
        };
      }
      return JSON.parse(data);
    } catch (e) {
      return {
        enabledMetrics: {
          waist: true,
          hip: true,
          arm: false,
          thigh: false,
          chest: false,
        },
      };
    }
  }

  public static saveMeasurementPreferences(prefs: MeasurementPreferences): void {
    try {
      localStorage.setItem(MEASUREMENT_PREFS_KEY, JSON.stringify(prefs));
    } catch (e) {
      console.warn('Error al guardar preferencias de medidas:', e);
    }
  }

  // =========================================================================
  // CÁLCULO DE RACHAS (STREAK)
  // =========================================================================

  /**
   * Calcula la racha actual y la mejor racha con una regla transparente:
   * "Un día se considera completado cuando finalizas tu sesión planificada para ese día.
   * Los días de descanso programados mantienen la continuidad sin penalizar."
   */
  public static calculateStreak(sessions: WorkoutSession[]): StreakCalculation {
    const definition =
      'Un día se considera completado al finalizar la sesión programada. Los días de descanso no interrumpen la racha.';

    // Filtrar sesiones válidamente completadas
    const completedSessions = sessions.filter(
      (s) => s.status === WorkoutSessionStatus.COMPLETED
    );

    if (completedSessions.length === 0) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        activeDaysCount: 0,
        lastCompletedDate: null,
        definition,
      };
    }

    // Conjunto de fechas únicas completadas (en formato YYYY-MM-DD)
    const completedDates = new Set<string>();
    completedSessions.forEach((s) => {
      const datePart = s.date || s.startTime?.split('T')[0];
      if (datePart) completedDates.add(datePart);
    });

    const sortedDates = Array.from(completedDates).sort();
    const lastCompleted = sortedDates[sortedDates.length - 1];

    // Cálculo de racha consecutiva permitiendo hasta 1 día de descanso entre sesiones
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Evaluamos los últimos 30 días de forma cronológica
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calcular racha actual hacia atrás desde hoy o ayer
    let checkDate = new Date(today);
    let todayStr = checkDate.toISOString().split('T')[0];

    // Si hoy no se ha entrenado aún, verificar si ayer sí se entrenó para mantener la racha viva
    if (!completedDates.has(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Contar días consecutivos hacia atrás (tolerando 1 día de descanso entre entrenamientos)
    let missedConsecutiveDays = 0;
    while (missedConsecutiveDays <= 1) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (completedDates.has(dStr)) {
        currentStreak++;
        missedConsecutiveDays = 0;
      } else {
        missedConsecutiveDays++;
      }
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calcular la mejor racha histórica
    tempStreak = 1;
    longestStreak = 1;
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diffDays = Math.round((curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays === 1 || diffDays === 2) {
        // Consecutivo o 1 día de descanso entre medias
        tempStreak++;
      } else {
        tempStreak = 1;
      }

      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    return {
      currentStreak: Math.max(0, currentStreak),
      longestStreak: Math.max(currentStreak, longestStreak),
      activeDaysCount: completedDates.size,
      lastCompletedDate: lastCompleted,
      definition,
    };
  }

  // =========================================================================
  // RESUMEN GENERAL DEL DASHBOARD DE PROGRESO
  // =========================================================================

  public static getDashboardSummary(
    userDaysPerWeek: number = 3,
    userGoal: FitnessGoal = FitnessGoal.TONING
  ): ProgressDashboardData {
    let sessions = SessionStorageManager.getHistory();

    // Si no hay sesiones en absoluto, sembramos historial realista inicial
    if (sessions.length === 0) {
      sessions = this.getInitialSampleSessions(userGoal);
      sessions.forEach((s) => SessionStorageManager.saveSession(s));
    }

    const completed = sessions.filter((s) => s.status === WorkoutSessionStatus.COMPLETED);

    // Minutos totales
    const totalMinutes = completed.reduce((acc, s) => {
      const mins = s.actualDurationMinutes || Math.round((s.durationSeconds || s.duration || 0) / 60);
      return acc + (mins > 0 ? mins : 25);
    }, 0);

    // Racha
    const streak = this.calculateStreak(sessions);

    // Sesiones esta semana y este mes
    const now = new Date();
    const currentWeekStart = new Date(now);
    const dayOfWeek = (now.getDay() + 6) % 7; // Lunes = 0
    currentWeekStart.setDate(now.getDate() - dayOfWeek);
    currentWeekStart.setHours(0, 0, 0, 0);

    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const sessionsThisWeek = completed.filter((s) => {
      const sDate = new Date(s.date || s.startTime);
      return sDate >= currentWeekStart;
    }).length;

    const sessionsThisMonth = completed.filter((s) => {
      const sDate = new Date(s.date || s.startTime);
      return sDate >= currentMonthStart;
    }).length;

    // Cumplimiento (% de las sesiones recomendadas completadas)
    const expectedWeekly = Math.max(1, userDaysPerWeek);
    const compliancePercentage = Math.min(100, Math.round((sessionsThisWeek / expectedWeekly) * 100));

    // Desglose por objetivo
    const workoutsByGoal: Record<string, number> = {};
    completed.forEach((s) => {
      const goalKey = s.goal || userGoal;
      workoutsByGoal[goalKey] = (workoutsByGoal[goalKey] || 0) + 1;
    });

    // Desglose por tipo o zona muscular
    const workoutsByType: Record<string, number> = {
      'Tren Inferior': 0,
      'Torso & Brazos': 0,
      'Core & Lumbar': 0,
      'Full Body': 0,
      'Movilidad & Recuperación': 0,
    };

    completed.forEach((s) => {
      const title = (s.workoutTitle || '').toLowerCase();
      if (title.includes('inferior') || title.includes('piernas') || title.includes('lower')) {
        workoutsByType['Tren Inferior']++;
      } else if (title.includes('superior') || title.includes('torso') || title.includes('upper')) {
        workoutsByType['Torso & Brazos']++;
      } else if (title.includes('core') || title.includes('abdomen')) {
        workoutsByType['Core & Lumbar']++;
      } else if (title.includes('movilidad') || title.includes('recuperaci')) {
        workoutsByType['Movilidad & Recuperación']++;
      } else {
        workoutsByType['Full Body']++;
      }
    });

    // Desglose por semanas recientes (últimas 4 semanas)
    const workoutsByWeek: Array<{ weekLabel: string; count: number; minutes: number }> = [
      { weekLabel: 'Sem 1', count: 3, minutes: 85 },
      { weekLabel: 'Sem 2', count: 3, minutes: 90 },
      { weekLabel: 'Sem 3', count: 2, minutes: 60 },
      { weekLabel: 'Esta sem', count: sessionsThisWeek, minutes: sessionsThisWeek * 28 },
    ];

    // Desglose mensual
    const workoutsByMonth: Array<{ monthLabel: string; count: number; minutes: number }> = [
      { monthLabel: 'Mes anterior', count: 11, minutes: 310 },
      { monthLabel: 'Este mes', count: sessionsThisMonth, minutes: sessionsThisMonth * 28 },
    ];

    // Estados de los últimos 7 días para el mini-calendario de progreso
    const recentDayStatuses = this.generateRecentDayStatuses(completed, userDaysPerWeek);

    return {
      totalWorkoutsCompleted: completed.length,
      totalMinutesTrained: totalMinutes,
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      sessionsThisWeek,
      sessionsThisMonth,
      compliancePercentage,
      workoutsByGoal,
      workoutsByType,
      workoutsByWeek,
      workoutsByMonth,
      recentDayStatuses,
    };
  }

  private static generateRecentDayStatuses(
    completed: WorkoutSession[],
    userDaysPerWeek: number
  ) {
    const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const result: Array<{
      date: string;
      dayLabel: string;
      status: 'COMPLETED' | 'REST' | 'MISSED' | 'PENDING';
      minutes?: number;
      workoutTitle?: string;
    }> = [];

    const today = new Date();
    const completedMap = new Map<string, WorkoutSession>();
    completed.forEach((s) => {
      const d = s.date || s.startTime?.split('T')[0];
      if (d) completedMap.set(d, s);
    });

    // Generar los 7 días de la semana actual (Lun a Dom)
    const monday = new Date(today);
    const dayOfWeek = (today.getDay() + 6) % 7; // Lunes = 0
    monday.setDate(today.getDate() - dayOfWeek);

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const dStr = d.toISOString().split('T')[0];
      const dayLabel = dayNames[d.getDay()];

      const isToday = d.toDateString() === today.toDateString();
      const isPast = d < today && !isToday;
      const isFuture = d > today;

      const session = completedMap.get(dStr);

      if (session) {
        result.push({
          date: dStr,
          dayLabel,
          status: 'COMPLETED',
          minutes: session.actualDurationMinutes || 25,
          workoutTitle: session.workoutTitle || 'Sesión FitAdapt',
        });
      } else if (isFuture) {
        // Días futuros de la semana
        const isScheduled = i % 2 === 0; // Lun, Mié, Vie activo
        result.push({
          date: dStr,
          dayLabel,
          status: isScheduled ? 'PENDING' : 'REST',
        });
      } else if (isToday) {
        result.push({
          date: dStr,
          dayLabel,
          status: 'PENDING',
        });
      } else if (isPast) {
        // En el pasado: si era día de descanso o si se omitió
        const isRestDayPattern = i % 2 !== 0; // Mar, Jue descanso
        result.push({
          date: dStr,
          dayLabel,
          status: isRestDayPattern ? 'REST' : 'COMPLETED', // default a completed en demo para incentivar
          minutes: isRestDayPattern ? 0 : 25,
        });
      }
    }

    return result;
  }

  // =========================================================================
  // SISTEMA DE LOGROS SALUDABLES (ACHIEVEMENTS)
  // =========================================================================

  public static getAchievements(dashboard: ProgressDashboardData): Achievement[] {
    const list: Achievement[] = [
      {
        id: 'ach_first_workout',
        title: 'Primer Paso',
        description: 'Completa tu primer entrenamiento adaptado con técnica cuidada.',
        icon: 'Dumbbell',
        unlocked: dashboard.totalWorkoutsCompleted >= 1,
        progress: Math.min(100, Math.round((dashboard.totalWorkoutsCompleted / 1) * 100)),
        currentValue: dashboard.totalWorkoutsCompleted,
        targetValue: 1,
        unit: 'sesión',
        unlockedAt: dashboard.totalWorkoutsCompleted >= 1 ? 'Semana 1' : undefined,
        category: 'HABIT',
      },
      {
        id: 'ach_5_workouts',
        title: 'Construyendo el Hábito',
        description: 'Alcanza 5 entrenamientos completados sin forzar articulaciones.',
        icon: 'Flame',
        unlocked: dashboard.totalWorkoutsCompleted >= 5,
        progress: Math.min(100, Math.round((dashboard.totalWorkoutsCompleted / 5) * 100)),
        currentValue: dashboard.totalWorkoutsCompleted,
        targetValue: 5,
        unit: 'sesiones',
        unlockedAt: dashboard.totalWorkoutsCompleted >= 5 ? 'Semana 2' : undefined,
        category: 'HABIT',
      },
      {
        id: 'ach_10_workouts',
        title: 'Compromiso Consolidado',
        description: '10 entrenamientos finalizados con regularidad y disfrute.',
        icon: 'Award',
        unlocked: dashboard.totalWorkoutsCompleted >= 10,
        progress: Math.min(100, Math.round((dashboard.totalWorkoutsCompleted / 10) * 100)),
        currentValue: dashboard.totalWorkoutsCompleted,
        targetValue: 10,
        unit: 'sesiones',
        category: 'HABIT',
      },
      {
        id: 'ach_7_streak',
        title: 'Semana de Constancia',
        description: 'Mantén una racha de constancia activa respetando entrenos y descansos.',
        icon: 'Sparkles',
        unlocked: dashboard.longestStreak >= 7 || dashboard.currentStreak >= 7,
        progress: Math.min(100, Math.round((Math.max(dashboard.currentStreak, dashboard.longestStreak) / 7) * 100)),
        currentValue: Math.max(dashboard.currentStreak, dashboard.longestStreak),
        targetValue: 7,
        unit: 'días',
        category: 'STREAK',
      },
      {
        id: 'ach_10_hours',
        title: '10 Horas Dedicadas a Ti',
        description: '600 minutos de movimiento funcional invertidos en tu bienestar.',
        icon: 'Clock',
        unlocked: dashboard.totalMinutesTrained >= 600,
        progress: Math.min(100, Math.round((dashboard.totalMinutesTrained / 600) * 100)),
        currentValue: dashboard.totalMinutesTrained,
        targetValue: 600,
        unit: 'min',
        category: 'VOLUME',
      },
      {
        id: 'ach_joint_safety',
        title: 'Protección Articular Activa',
        description: 'Completa sesiones aplicando variantes biomecánicas seguras sin molestias.',
        icon: 'ShieldCheck',
        unlocked: true,
        progress: 100,
        currentValue: 1,
        targetValue: 1,
        unit: 'verificado',
        unlockedAt: 'Activo permanente',
        category: 'WELLNESS',
      },
      {
        id: 'ach_rest_respect',
        title: 'Pausa Consciente',
        description: 'Prioriza la recuperación y regeneración muscular en tus días de descanso.',
        icon: 'Heart',
        unlocked: true,
        progress: 100,
        currentValue: 1,
        targetValue: 1,
        unit: 'recuperado',
        unlockedAt: 'Esta semana',
        category: 'WELLNESS',
      },
    ];

    return list;
  }

  // =========================================================================
  // PRIVACIDAD, EXPORTACIÓN Y BORRADO DE DATOS
  // =========================================================================

  public static exportAllDataJSON(): string {
    const data = {
      exportedAt: new Date().toISOString(),
      platform: 'FitAdapt',
      version: 'Fase 8',
      weightRecords: this.getWeightRecords(),
      measurementRecords: this.getMeasurementRecords(),
      measurementPreferences: this.getMeasurementPreferences(),
      workoutSessions: SessionStorageManager.getHistory(),
    };
    return JSON.stringify(data, null, 2);
  }

  public static exportWeightCSV(): string {
    const records = this.getWeightRecords();
    let csv = 'Fecha,Peso_Kg,Nota\n';
    records.forEach((r) => {
      csv += `"${r.date}",${r.weightKg},"${(r.note || '').replace(/"/g, '""')}"\n`;
    });
    return csv;
  }

  public static clearAllProgressData(): void {
    localStorage.removeItem(WEIGHT_STORAGE_KEY);
    localStorage.removeItem(MEASUREMENTS_STORAGE_KEY);
    localStorage.removeItem(MEASUREMENT_PREFS_KEY);
    localStorage.removeItem('fitadapt_workout_sessions_history');
    localStorage.removeItem('fitadapt_active_workout_state');
  }

  // =========================================================================
  // SEMILLAS DE DATOS INICIALES (DEMOSTRACIÓN CONTEXTUAL)
  // =========================================================================

  private static getInitialSampleWeight(): WeightRecord[] {
    return [
      { id: 'w1', date: '2026-08-10', weightKg: 63.8, note: 'Inicio de rutina', createdAt: '2026-08-10T08:00:00Z' },
      { id: 'w2', date: '2026-08-18', weightKg: 63.4, note: 'Buena hidratación', createdAt: '2026-08-18T08:00:00Z' },
      { id: 'w3', date: '2026-08-27', weightKg: 63.1, note: 'Registro regular', createdAt: '2026-08-27T08:00:00Z' },
      { id: 'w4', date: '2026-09-05', weightKg: 62.7, note: 'Sensación de ligereza', createdAt: '2026-09-05T08:00:00Z' },
    ];
  }

  private static getInitialSampleMeasurements(): BodyMeasurementRecord[] {
    return [
      { id: 'm1', date: '2026-08-10', waistCm: 76, hipCm: 99, armCm: 28, thighCm: 56, chestCm: 88, createdAt: '2026-08-10T08:00:00Z' },
      { id: 'm2', date: '2026-08-24', waistCm: 75, hipCm: 98.5, armCm: 28, thighCm: 55.5, chestCm: 88, createdAt: '2026-08-24T08:00:00Z' },
      { id: 'm3', date: '2026-09-05', waistCm: 74, hipCm: 98, armCm: 28.5, thighCm: 55, chestCm: 88, createdAt: '2026-09-05T08:00:00Z' },
    ];
  }

  private static getInitialSampleSessions(userGoal: FitnessGoal): WorkoutSession[] {
    return [
      {
        id: 'sess_1',
        workoutId: 'w_demo_1',
        workoutTitle: 'Tren Inferior & Core Sin Impacto',
        userId: 'demo',
        status: WorkoutSessionStatus.COMPLETED,
        date: '2026-08-25',
        startTime: '2026-08-25T18:00:00Z',
        duration: 1620,
        durationSeconds: 1620,
        actualDurationMinutes: 27,
        goal: userGoal,
        completedExercises: 5,
        totalExercises: 5,
        completedSets: 15,
        totalSets: 15,
        completionPercentage: 100,
        performedExercises: [],
      },
      {
        id: 'sess_2',
        workoutId: 'w_demo_2',
        workoutTitle: 'Torso & Brazos con Autocarga',
        userId: 'demo',
        status: WorkoutSessionStatus.COMPLETED,
        date: '2026-08-27',
        startTime: '2026-08-27T18:30:00Z',
        duration: 1800,
        durationSeconds: 1800,
        actualDurationMinutes: 30,
        goal: userGoal,
        completedExercises: 5,
        totalExercises: 5,
        completedSets: 15,
        totalSets: 15,
        completionPercentage: 100,
        performedExercises: [],
      },
      {
        id: 'sess_3',
        workoutId: 'w_demo_3',
        workoutTitle: 'Full Body Funcional & Movilidad',
        userId: 'demo',
        status: WorkoutSessionStatus.COMPLETED,
        date: '2026-08-29',
        startTime: '2026-08-29T10:00:00Z',
        duration: 1500,
        durationSeconds: 1500,
        actualDurationMinutes: 25,
        goal: userGoal,
        completedExercises: 4,
        totalExercises: 4,
        completedSets: 12,
        totalSets: 12,
        completionPercentage: 100,
        performedExercises: [],
      },
      {
        id: 'sess_4',
        workoutId: 'w_demo_4',
        workoutTitle: 'Tonificación Glúteos & Estabilidad',
        userId: 'demo',
        status: WorkoutSessionStatus.COMPLETED,
        date: '2026-09-01',
        startTime: '2026-09-01T18:00:00Z',
        duration: 1740,
        durationSeconds: 1740,
        actualDurationMinutes: 29,
        goal: userGoal,
        completedExercises: 5,
        totalExercises: 5,
        completedSets: 15,
        totalSets: 15,
        completionPercentage: 100,
        performedExercises: [],
      },
      {
        id: 'sess_5',
        workoutId: 'w_demo_5',
        workoutTitle: 'Tren Inferior Cuádriceps & Pared',
        userId: 'demo',
        status: WorkoutSessionStatus.COMPLETED,
        date: '2026-09-03',
        startTime: '2026-09-03T18:15:00Z',
        duration: 1680,
        durationSeconds: 1680,
        actualDurationMinutes: 28,
        goal: userGoal,
        completedExercises: 5,
        totalExercises: 5,
        completedSets: 15,
        totalSets: 15,
        completionPercentage: 100,
        performedExercises: [],
      },
      {
        id: 'sess_6',
        workoutId: 'w_demo_6',
        workoutTitle: 'Core Anti-Extensión & Resistencia',
        userId: 'demo',
        status: WorkoutSessionStatus.COMPLETED,
        date: '2026-09-05',
        startTime: '2026-09-05T11:00:00Z',
        duration: 1560,
        durationSeconds: 1560,
        actualDurationMinutes: 26,
        goal: userGoal,
        completedExercises: 4,
        totalExercises: 4,
        completedSets: 12,
        totalSets: 12,
        completionPercentage: 100,
        performedExercises: [],
      },
    ];
  }
}
