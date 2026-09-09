/**
 * FitAdapt - Vista Mensual del Calendario de Entrenamientos
 * FASE 7: Cuadrícula mensual con estados UPCOMING, TODAY, COMPLETED, MISSED, REST
 */

import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Coffee,
  Play,
  Flame,
  Target,
} from 'lucide-react';
import { UserProfile } from '../../types/user';
import { CalendarDayStatus, WorkoutSession, Workout } from '../../types/workout';
import { WeeklyPlanner } from '../../core/planner/weeklyPlanner';
import { WorkoutGenerator } from '../../core/generator/workoutGenerator';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface MonthlyCalendarViewProps {
  user: UserProfile;
  completedSessions: WorkoutSession[];
  onStartActiveWorkout: (workout: Workout) => void;
}

const dayHeaderLabels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

export function MonthlyCalendarView({
  user,
  completedSessions,
  onStartActiveWorkout,
}: MonthlyCalendarViewProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthDays = WeeklyPlanner.generateMonthCalendar(
    user,
    year,
    month,
    completedSessions,
    new Date()
  );

  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    () => new Date().toISOString().split('T')[0]
  );

  const monthName = currentDate.toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const selectedDayData = monthDays.find((d) => d.date === selectedDateStr);

  const getStatusIcon = (status: CalendarDayStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />;
      case 'TODAY':
        return <Flame className="w-3 h-3 text-teal-500 fill-current shrink-0" />;
      case 'MISSED':
        return <AlertCircle className="w-3 h-3 text-amber-500 shrink-0" />;
      case 'REST':
        return <Coffee className="w-3 h-3 text-zinc-400 shrink-0" />;
      case 'UPCOMING':
      default:
        return <Clock className="w-3 h-3 text-zinc-400 shrink-0" />;
    }
  };

  return (
    <div id="monthly-calendar-view" className="space-y-4 animate-fadeIn">
      {/* Cabecera del Mes y Navegación */}
      <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80">
        <h3 className="font-black text-sm sm:text-base text-zinc-900 dark:text-zinc-100 capitalize">
          {monthName}
        </h3>

        <div className="flex items-center gap-1">
          <Button
            id="btn-calendar-prev-month"
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            className="p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            id="btn-calendar-today"
            variant="outline"
            size="sm"
            onClick={() => {
              const now = new Date();
              setCurrentDate(now);
              setSelectedDateStr(now.toISOString().split('T')[0]);
            }}
            className="text-xs font-semibold px-2.5"
          >
            Hoy
          </Button>
          <Button
            id="btn-calendar-next-month"
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            className="p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Cuadrícula Calendario */}
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-zinc-900 shadow-xs">
        {/* Días de la semana */}
        <div className="grid grid-cols-7 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 text-center text-xs font-bold text-zinc-500 dark:text-zinc-400 py-2">
          {dayHeaderLabels.map((lbl) => (
            <div key={lbl}>{lbl}</div>
          ))}
        </div>

        {/* Días del Mes */}
        <div className="grid grid-cols-7 divide-x divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
          {monthDays.map((d, i) => {
            const isSelected = d.date === selectedDateStr;
            return (
              <div
                key={i}
                onClick={() => setSelectedDateStr(d.date)}
                className={`min-h-[58px] sm:min-h-[68px] p-1.5 sm:p-2 cursor-pointer transition-all flex flex-col justify-between ${
                  !d.isCurrentMonth
                    ? 'opacity-30 bg-zinc-50/50 dark:bg-zinc-950/20'
                    : isSelected
                    ? 'bg-teal-50 dark:bg-teal-950/40 ring-2 ring-teal-500 ring-inset'
                    : d.isToday
                    ? 'bg-teal-50/40 dark:bg-teal-950/20 font-bold'
                    : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-semibold text-[11px] sm:text-xs ${
                      d.isToday ? 'text-teal-600 dark:text-teal-400 font-black' : 'text-zinc-700 dark:text-zinc-300'
                    }`}
                  >
                    {d.dayNumber}
                  </span>
                  {getStatusIcon(d.status)}
                </div>

                {/* Badge o indicador de actividad */}
                <div className="truncate text-[10px]">
                  {d.isRestDay ? (
                    <span className="text-zinc-400 hidden sm:inline">Descanso</span>
                  ) : (
                    <span
                      className={`truncate font-medium block ${
                        d.status === 'COMPLETED'
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-teal-600 dark:text-teal-400'
                      }`}
                    >
                      {d.durationMinutes} min
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tarjeta de Detalle del Día Seleccionado */}
      {selectedDayData && (
        <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/80 dark:border-zinc-700/80 space-y-3 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                  Detalle del Día
                </span>
                <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {selectedDayData.date}
                </span>
              </div>
              <h4 className="text-base font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                {selectedDayData.isRestDay
                  ? 'Día de Recuperación y Descanso'
                  : selectedDayData.workoutTitle || `Entrenamiento ${selectedDayData.goal}`}
              </h4>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant={
                  selectedDayData.status === 'COMPLETED'
                    ? 'emerald'
                    : selectedDayData.status === 'TODAY'
                    ? 'teal'
                    : selectedDayData.status === 'MISSED'
                    ? 'warning'
                    : 'neutral'
                }
              >
                {selectedDayData.status}
              </Badge>

              {!selectedDayData.isRestDay && (
                <Button
                  id="btn-month-start-session"
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    const workout = WorkoutGenerator.generate({
                      userProfile: user,
                      targetGoal: selectedDayData.goal || user.primaryGoal,
                      targetDurationMinutes: selectedDayData.durationMinutes || 30,
                      seed: `month-${selectedDayData.date}`,
                    }).workout;
                    onStartActiveWorkout(workout);
                  }}
                  className="font-bold text-xs"
                >
                  <Play className="w-3.5 h-3.5 mr-1 fill-current" />
                  Iniciar esta sesión
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
