/**
 * FitAdapt - Planificador Semanal y Calendario de Entrenamientos
 * FASE 7: Plan Semanal Inteligente y Calendario de Sesiones
 * 
 * Reglas:
 * 1. Planifica de forma determinista usando los datos del UserProfile:
 *    - Días disponibles (daysPerWeek)
 *    - Objetivo (primaryGoal)
 *    - Nivel (fitnessLevel)
 *    - Duración disponible (availableTimeMinutes)
 *    - Limitaciones articulares
 *    - Lugar y equipamiento
 * 2. Distribución equilibrada con días de descanso (REST).
 * 3. Evita programar innecesariamente sesiones intensas consecutivas.
 * 4. Asigna estados de calendario: UPCOMING, TODAY, COMPLETED, MISSED, REST.
 */

import { UserProfile, FitnessGoal, FitnessLevel } from '../../types/user';
import {
  Workout,
  WorkoutPlan,
  WorkoutPlanDay,
  WorkoutPlanStatus,
  CalendarDayStatus,
  WorkoutSession,
} from '../../types/workout';
import { WorkoutGenerator } from '../generator/workoutGenerator';

export class WeeklyPlanner {
  /**
   * Determina los días de entrenamiento activos (1 = Lunes, 7 = Domingo)
   * garantizando que los descansos estén bien distribuidos.
   */
  public static getOptimalActiveDays(daysPerWeek: number): number[] {
    const clamped = Math.max(1, Math.min(7, Math.round(daysPerWeek || 3)));

    switch (clamped) {
      case 1:
        return [3]; // Miércoles
      case 2:
        return [2, 5]; // Martes, Viernes
      case 3:
        return [1, 3, 5]; // Lunes, Miércoles, Viernes (clásico no consecutivo)
      case 4:
        return [1, 2, 4, 6]; // Lunes, Martes, Jueves, Sábado (máximo 2 seguidos)
      case 5:
        return [1, 2, 3, 5, 6]; // Lunes, Martes, Miércoles, Viernes, Sábado
      case 6:
        return [1, 2, 3, 4, 5, 6]; // Lunes a Sábado, Domingo descanso
      case 7:
        return [1, 2, 3, 4, 5, 6, 7];
      default:
        return [1, 3, 5];
    }
  }

  /**
   * Obtiene los enfoques recomendados por día según el objetivo y el número de sesión.
   * Evita sobrecarga de los mismos grupos musculares o impacto continuo.
   */
  public static getSessionFocus(
    goal: FitnessGoal,
    sessionIndex: number,
    totalSessions: number
  ): { title: string; focusArea: string; goalOverride?: FitnessGoal } {
    switch (goal) {
      case FitnessGoal.STRENGTH:
      case FitnessGoal.TONING: {
        const focuses = [
          { title: 'Tren Inferior + Core', focusArea: 'Piernas, Glúteos y Abdomen' },
          { title: 'Torso & Estabilidad', focusArea: 'Espalda, Pectoral y Hombros' },
          { title: 'Full Body Funcional', focusArea: 'Cuerpo Completo & Cadenas Cruzadas' },
          { title: 'Pierna & Glúteo Enfoque', focusArea: 'Cadena Posterior y Cuádriceps' },
          { title: 'Torso & Brazos', focusArea: 'Tracción, Empuje y Core' },
          { title: 'Metabólico & Resistencia', focusArea: 'Acondicionamiento y Fuerza' },
        ];
        return focuses[sessionIndex % focuses.length];
      }

      case FitnessGoal.WEIGHT_LOSS:
      case FitnessGoal.CARDIO: {
        const focuses = [
          { title: 'Full Body Metabólico', focusArea: 'Cuerpo Completo y Alta Densidad' },
          { title: 'Cardio & Resistencia Core', focusArea: 'Sistema Cardiovascular y Zona Media', goalOverride: FitnessGoal.CARDIO },
          { title: 'Fuerza-Resistencia Muscular', focusArea: 'Fuerza Muscular y Quema Calórica', goalOverride: FitnessGoal.TONING },
          { title: 'Intervalos Aeróbicos', focusArea: 'Resistencia Aeróbica y Movilidad', goalOverride: FitnessGoal.CARDIO },
          { title: 'Circuito Quema-Grasas', focusArea: 'Cuerpo Completo Dinámico' },
          { title: 'Cardio & Movilidad Activa', focusArea: 'Flujo Aeróbico sin Impacto', goalOverride: FitnessGoal.MOBILITY },
        ];
        return focuses[sessionIndex % focuses.length];
      }

      case FitnessGoal.MOBILITY:
      default: {
        const focuses = [
          { title: 'Movilidad Cadera & Tobillos', focusArea: 'Amplitud Articular Tren Inferior' },
          { title: 'Descompresión & Torso', focusArea: 'Columna, Hombros y Caja Torácica' },
          { title: 'Full Body Flow Articular', focusArea: 'Control Motor Integral y Estabilidad' },
          { title: 'Cadena Posterior & Lumbar', focusArea: 'Isquios, Glúteos y Fascia Lumbar' },
          { title: 'Postura & Cuello/Hombros', focusArea: 'Cintura Escapular y Trapecios' },
          { title: 'Equilibrio & Movilidad Dinámica', focusArea: 'Estabilidad y Rango de Movimiento' },
        ];
        return focuses[sessionIndex % focuses.length];
      }
    }
  }

  /**
   * Genera las fechas de la semana actual (de Lunes a Domingo) en formato YYYY-MM-DD.
   */
  public static getCurrentWeekDates(referenceDate: Date = new Date()): {
    dayOfWeek: number; // 1 = Lunes, 7 = Domingo
    dateString: string;
    isToday: boolean;
    isPast: boolean;
    isFuture: boolean;
  }[] {
    const curr = new Date(referenceDate);
    // Día actual (0 = Dom, 1 = Lun, ..., 6 = Sáb)
    const currentDayOfWeek = curr.getDay() === 0 ? 7 : curr.getDay();
    const monday = new Date(curr);
    monday.setDate(curr.getDate() - (currentDayOfWeek - 1));
    monday.setHours(0, 0, 0, 0);

    const todayStr = referenceDate.toISOString().split('T')[0];

    const week = [];
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + i);
      const dateString = dayDate.toISOString().split('T')[0];

      week.push({
        dayOfWeek: i + 1,
        dateString,
        isToday: dateString === todayStr,
        isPast: dateString < todayStr,
        isFuture: dateString > todayStr,
      });
    }

    return week;
  }

  /**
   * Genera el Plan Semanal completo estructurado.
   */
  public static generateWeeklyPlan(
    userProfile: UserProfile,
    completedSessions: WorkoutSession[] = [],
    referenceDate: Date = new Date()
  ): WorkoutPlan {
    const daysPerWeek = userProfile.daysPerWeek || 3;
    const activeDays = this.getOptimalActiveDays(daysPerWeek);
    const weekDates = this.getCurrentWeekDates(referenceDate);

    let sessionCounter = 0;

    const weeklySchedule: WorkoutPlanDay[] = weekDates.map((dayInfo) => {
      const isActiveDay = activeDays.includes(dayInfo.dayOfWeek);

      // Comprobar si ya existe una sesión completada o abandonada para esta fecha
      const sessionForDay = completedSessions.find(
        (s) => s.date === dayInfo.dateString || s.startTime?.startsWith(dayInfo.dateString)
      );

      let status: CalendarDayStatus = 'UPCOMING';
      if (!isActiveDay) {
        status = 'REST';
      } else if (sessionForDay) {
        status = sessionForDay.status === 'COMPLETED' ? 'COMPLETED' : 'MISSED';
      } else if (dayInfo.isToday) {
        status = 'TODAY';
      } else if (dayInfo.isPast) {
        status = 'MISSED';
      } else {
        status = 'UPCOMING';
      }

      if (!isActiveDay) {
        return {
          dayOfWeek: dayInfo.dayOfWeek,
          date: dayInfo.dateString,
          isRestDay: true,
          status,
          focusArea: 'Descanso activo / Recuperación articular',
          durationMinutes: 0,
        };
      }

      // Generar sesión de entrenamiento con seed determinista y foco variado
      const focus = this.getSessionFocus(userProfile.primaryGoal, sessionCounter, activeDays.length);
      sessionCounter++;

      const targetGoal = focus.goalOverride || userProfile.primaryGoal;

      const generated = WorkoutGenerator.generate({
        userProfile,
        targetGoal,
        targetDurationMinutes: userProfile.availableTimeMinutes || 30,
        seed: `week-day-${dayInfo.dayOfWeek}-${targetGoal}-${userProfile.fitnessLevel}`,
      });

      // Personalizar el título con el foco
      const workout: Workout = {
        ...generated.workout,
        title: `${focus.title} (${generated.workout.estimatedDurationMinutes} min)`,
        description: `Sesión estructurada de ${focus.focusArea} adaptada a tu nivel ${userProfile.fitnessLevel}.`,
      };

      return {
        dayOfWeek: dayInfo.dayOfWeek,
        date: dayInfo.dateString,
        isRestDay: false,
        status,
        focusArea: focus.focusArea,
        durationMinutes: workout.estimatedDurationMinutes,
        goal: workout.goal,
        workout,
      };
    });

    return {
      id: `plan-${userProfile.id || 'default'}-${weekDates[0].dateString}`,
      userId: userProfile.id || 'default-user',
      createdAt: new Date().toISOString(),
      status: WorkoutPlanStatus.ACTIVE,
      title: `Plan Semanal FitAdapt - ${userProfile.primaryGoal}`,
      primaryGoal: userProfile.primaryGoal,
      level: userProfile.fitnessLevel,
      totalWeeks: 4,
      currentWeekNumber: 1,
      weeklySchedule,
      notes: 'Planificación determinista adaptada con periodización y salvaguardas articulares.',
    };
  }

  /**
   * Genera el calendario mensual completo (días del mes con sus estados y entrenamientos).
   */
  public static generateMonthCalendar(
    userProfile: UserProfile,
    year: number,
    month: number, // 0-11 (JavaScript standard)
    completedSessions: WorkoutSession[] = [],
    referenceDate: Date = new Date()
  ): Array<{
    date: string; // YYYY-MM-DD
    dayNumber: number;
    dayOfWeek: number; // 1 = Lunes, 7 = Domingo
    isCurrentMonth: boolean;
    isToday: boolean;
    isPast: boolean;
    isFuture: boolean;
    status: CalendarDayStatus;
    workoutTitle?: string;
    durationMinutes?: number;
    goal?: FitnessGoal;
    isRestDay: boolean;
  }> {
    const todayStr = referenceDate.toISOString().split('T')[0];
    const activeDays = this.getOptimalActiveDays(userProfile.daysPerWeek || 3);

    // Primer día del mes
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Determinar día de la semana del primer día (1 = Lun, 7 = Dom)
    let startDayOfWeek = firstDay.getDay() === 0 ? 7 : firstDay.getDay();

    const result = [];

    // Rellenar días del mes anterior para completar la primera fila semanal
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i > 0; i--) {
      const prevDate = new Date(year, month - 1, prevMonthLastDay - i + 1);
      const dateString = prevDate.toISOString().split('T')[0];
      const dow = prevDate.getDay() === 0 ? 7 : prevDate.getDay();
      result.push({
        date: dateString,
        dayNumber: prevMonthLastDay - i + 1,
        dayOfWeek: dow,
        isCurrentMonth: false,
        isToday: dateString === todayStr,
        isPast: dateString < todayStr,
        isFuture: dateString > todayStr,
        status: 'REST' as CalendarDayStatus,
        isRestDay: true,
      });
    }

    // Días del mes actual
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const currDate = new Date(year, month, d);
      const dateString = currDate.toISOString().split('T')[0];
      const dow = currDate.getDay() === 0 ? 7 : currDate.getDay();
      const isActiveDay = activeDays.includes(dow);

      const sessionForDay = completedSessions.find(
        (s) => s.date === dateString || s.startTime?.startsWith(dateString)
      );

      let status: CalendarDayStatus = 'UPCOMING';
      if (!isActiveDay) {
        status = 'REST';
      } else if (sessionForDay) {
        status = sessionForDay.status === 'COMPLETED' ? 'COMPLETED' : 'MISSED';
      } else if (dateString === todayStr) {
        status = 'TODAY';
      } else if (dateString < todayStr) {
        status = 'MISSED';
      } else {
        status = 'UPCOMING';
      }

      result.push({
        date: dateString,
        dayNumber: d,
        dayOfWeek: dow,
        isCurrentMonth: true,
        isToday: dateString === todayStr,
        isPast: dateString < todayStr,
        isFuture: dateString > todayStr,
        status,
        isRestDay: !isActiveDay,
        workoutTitle: isActiveDay ? `Entrenamiento ${userProfile.primaryGoal}` : undefined,
        durationMinutes: isActiveDay ? userProfile.availableTimeMinutes || 30 : 0,
        goal: isActiveDay ? userProfile.primaryGoal : undefined,
      });
    }

    // Rellenar días del mes siguiente para cerrar la última fila
    const remainingDays = 7 - (result.length % 7);
    if (remainingDays < 7) {
      for (let nextDay = 1; nextDay <= remainingDays; nextDay++) {
        const nextDate = new Date(year, month + 1, nextDay);
        const dateString = nextDate.toISOString().split('T')[0];
        const dow = nextDate.getDay() === 0 ? 7 : nextDate.getDay();
        result.push({
          date: dateString,
          dayNumber: nextDay,
          dayOfWeek: dow,
          isCurrentMonth: false,
          isToday: dateString === todayStr,
          isPast: dateString < todayStr,
          isFuture: dateString > todayStr,
          status: 'REST' as CalendarDayStatus,
          isRestDay: true,
        });
      }
    }

    return result;
  }
}
