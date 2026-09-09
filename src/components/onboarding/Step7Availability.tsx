/**
 * FitAdapt - Paso 7: Disponibilidad y Preferencias de Tiempo
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { WorkoutDurationOption, PreferredIntensityOption } from '../../types/onboarding';
import { Calendar, Clock, Gauge, Check } from 'lucide-react';

interface Step7AvailabilityProps {
  daysPerWeek: number;
  durationMinutes: WorkoutDurationOption;
  preferredIntensity: PreferredIntensityOption;
  onChange: (fields: {
    daysPerWeek?: number;
    durationMinutes?: WorkoutDurationOption;
    preferredIntensity?: PreferredIntensityOption;
  }) => void;
}

export function Step7Availability({
  daysPerWeek,
  durationMinutes,
  preferredIntensity,
  onChange,
}: Step7AvailabilityProps) {
  const durationOptions: WorkoutDurationOption[] = [15, 20, 30, 45, 60];

  const intensities: { id: PreferredIntensityOption; name: string; desc: string; tag: string }[] = [
    {
      id: 'LOW',
      name: 'Suave / Moderada',
      desc: 'Énfasis en técnica, respiración, movilidad y recuperación activa. Ideal para articulaciones sensibles.',
      tag: 'Bajo impacto',
    },
    {
      id: 'MEDIUM',
      name: 'Equilibrada',
      desc: 'El balance óptimo entre estímulo neuromuscular y fatiga controlada. Sostenible a largo plazo.',
      tag: 'Estándar recomendado',
    },
    {
      id: 'HIGH',
      name: 'Exigente',
      desc: 'Mayor densidad de series, descansos reducidos y esfuerzo sostenido para usuarios experimentados.',
      tag: 'Mayor demanda metabólica',
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Días por semana */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Días de entrenamiento por semana</span>
          </label>
          <span className="text-xs font-bold text-teal-700 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-full">
            {daysPerWeek} {daysPerWeek === 1 ? 'día' : 'días'} / semana
          </span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => {
            const isSelected = daysPerWeek === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onChange({ daysPerWeek: num })}
                className={`py-3 rounded-xl text-center border font-bold text-sm transition-all cursor-pointer ${
                  isSelected
                    ? 'border-teal-600 bg-teal-600 text-white shadow-xs'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-zinc-400 dark:text-zinc-500">
          * 3 a 4 días suelen ser la frecuencia ideal para permitir la recuperación de tejidos y articulaciones.
        </p>
      </div>

      {/* 2. Duración aproximada */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-teal-600" />
          <span>Duración aproximada por sesión</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {durationOptions.map((mins) => {
            const isSelected = durationMinutes === mins;
            return (
              <button
                key={mins}
                type="button"
                onClick={() => onChange({ durationMinutes: mins })}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1 ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 ring-2 ring-teal-600/30 font-bold'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <span className="text-lg font-black">{mins}</span>
                <span className="text-[11px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400">minutos</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Intensidad preferida */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
          <Gauge className="w-4 h-4 text-teal-600" />
          <span>Intensidad de esfuerzo preferida</span>
        </label>

        <div className="grid grid-cols-1 gap-2.5">
          {intensities.map((item) => {
            const isSelected = preferredIntensity === item.id;
            return (
              <div
                key={item.id}
                onClick={() => onChange({ preferredIntensity: item.id })}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-900 dark:text-teal-100 ring-1 ring-teal-600'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{item.name}</span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {item.tag}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'border-teal-600 bg-teal-600 text-white'
                      : 'border-zinc-300 dark:border-zinc-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
