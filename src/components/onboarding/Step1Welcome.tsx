/**
 * FitAdapt - Paso 1: Bienvenida
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { ShieldCheck, HeartPulse, Sliders, CheckCircle2, Clock } from 'lucide-react';
import { Card } from '../ui/Card';

interface Step1WelcomeProps {
  onStart: () => void;
}

export function Step1Welcome({ onStart }: Step1WelcomeProps) {
  return (
    <div className="space-y-6">
      {/* Tarjeta Hero de Bienvenida */}
      <Card elevation="raised" className="p-6 sm:p-8 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border-teal-200/80 dark:border-teal-850">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
              <Clock className="w-3.5 h-3.5" />
              <span>Configuración rápida · ~2 minutos</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              Bienvenido a tu entrenamiento adaptativo inteligente
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              FitAdapt combina biomecánica funcional, salud articular y tecnología para crear una rutina que se ajuste a ti, y no al revés.
            </p>
          </div>
        </div>
      </Card>

      {/* 3 Pilares del Enfoque FitAdapt */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
          Nuestros Principios Fundamentales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Prioridad Articular
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Si tienes sensibilidad en rodillas, hombros o zona lumbar, los ejercicios se adaptan de inmediato a bajo impacto.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Cero Falsas Promesas
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Rechazamos dietas milagro y la quema localizada de grasa. Entrenamos por salud, densidad muscular y longevidad.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              100% Personalizado
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              En los siguientes 9 pasos definiremos tu objetivo, nivel, equipamiento y disponibilidad real semanal.
            </p>
          </div>
        </div>
      </div>

      {/* Nota de no diagnóstico */}
      <div className="p-3.5 rounded-xl bg-zinc-100 dark:bg-zinc-850/70 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
        <span className="font-semibold text-zinc-700 dark:text-zinc-300">Aviso informativo:</span> FitAdapt no es un dispositivo médico ni un sustituto de diagnóstico clínico. Si sufres patologías complejas o dolor agudo, consulta a un profesional sanitario.
      </div>
    </div>
  );
}
