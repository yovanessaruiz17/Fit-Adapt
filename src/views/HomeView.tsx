/**
 * FitAdapt - Vista Principal (HOME)
 * FASE 2: Sistema Visual y UI/UX
 * 
 * Estructura:
 * - Saludo personalizado y contexto
 * - Entrenamiento del día adaptado
 * - Racha y progreso semanal
 * - Próximo entrenamiento programado
 * - Recomendaciones de bienestar
 */

import React from 'react';
import {
  Play,
  Flame,
  Clock,
  Dumbbell,
  ShieldCheck,
  Calendar,
  Sparkles,
  HeartPulse,
  ArrowRight,
  TrendingUp,
  Info,
  Bot,
} from 'lucide-react';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { AppView } from '../types/navigation';
import { UserProfile } from '../types/user';

export interface HomeViewProps {
  user: UserProfile;
  onNavigate: (view: AppView) => void;
  onStartWorkout: () => void;
}

export function HomeView({ user, onNavigate, onStartWorkout }: HomeViewProps) {
  const hasKneeLimitation = user?.limitations?.some(
    (l) => l.code === 'KNEE_SENSITIVITY' || l.requiresLowImpact
  ) ?? false;

  const displayName = user?.name ? user.name.split(' ')[0] : 'Ana';

  return (
    <div id="home-view-container" className="space-y-6 animate-fadeIn">
      {/* Saludo Personalizado y Contexto */}
      <section className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 tracking-wider uppercase">
              Plan Personalizado Activo
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-teal-500" />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Semana 1 de 4</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight mt-1">
            Hola, {displayName} 👋
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1">
            Hoy toca sesión de tonificación adaptada a tu entorno en casa.
          </p>
        </div>

        {/* Chip de Racha Activa */}
        <div className="flex items-center gap-2.5 p-2.5 px-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/60 shrink-0">
          <div className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-600 dark:text-amber-400">
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="block text-xs font-bold text-amber-950 dark:text-amber-200">
              Racha de 4 días
            </span>
            <span className="block text-[11px] text-amber-700 dark:text-amber-400">
              ¡Constancia excelente!
            </span>
          </div>
        </div>
      </section>

      {/* Hero Card: Entrenamiento del Día */}
      <section id="todays-workout-hero">
        <Card
          elevation="raised"
          className="relative overflow-hidden border-2 border-teal-500/30 dark:border-teal-500/40 bg-gradient-to-br from-teal-900 via-teal-950 to-zinc-950 text-white p-6 sm:p-8"
        >
          {/* Fondo abstracto tecnológico sutil */}
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-400/20 text-teal-200 border border-teal-300/30">
                  SESIÓN DEL DÍA
                </span>
                {hasKneeLimitation && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-400/20 text-emerald-200 border border-emerald-300/30 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Protección Articular Activa
                  </span>
                )}
              </div>

              <span className="text-xs text-teal-200/80 font-mono">
                {user.availableTimeMinutes} min estimados
              </span>
            </div>

            <div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Tren Inferior & Core Sin Impacto
              </h3>
              <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-xl leading-relaxed">
                Circuito estructurado con sentadilla isométrica en pared, puente de glúteos y plancha en antebrazos. Cero saltos para proteger tus articulaciones.
              </p>
            </div>

            {/* Parámetros de la sesión */}
            <div className="grid grid-cols-3 gap-3 pt-2 max-w-md text-xs">
              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <span className="text-teal-200/70 block text-[10px]">Ejercicios</span>
                <span className="font-bold text-white text-sm">4 bloques</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <span className="text-teal-200/70 block text-[10px]">Equipamiento</span>
                <span className="font-bold text-white text-sm">Esterilla / Autocarga</span>
              </div>
              <div className="bg-white/10 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                <span className="text-teal-200/70 block text-[10px]">Intensidad</span>
                <span className="font-bold text-white text-sm">Moderada</span>
              </div>
            </div>

            {/* Botón de Inicio con CTA claro */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="primary"
                size="lg"
                onClick={onStartWorkout}
                leftIcon={<Play className="w-4 h-4 fill-current" />}
                className="bg-teal-400 hover:bg-teal-300 text-teal-950 font-bold shadow-md shadow-teal-950/40"
              >
                Comenzar Entrenamiento
              </Button>
              <Button
                variant="ghost"
                size="md"
                onClick={() => onNavigate('PLAN')}
                className="text-teal-100 hover:text-white hover:bg-white/10"
              >
                Ver Desglose de Series
              </Button>
            </div>
          </div>
        </Card>
      </section>

      {/* Acceso Directo: Pregúntale a FitAdapt AI (FASE 9) */}
      <section
        id="section-home-ai-assistant"
        className="p-5 rounded-3xl bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border border-teal-200 dark:border-teal-800/80 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-teal-500 text-zinc-950 flex items-center justify-center font-bold shadow-xs shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-zinc-900 dark:text-zinc-50">
                  Pregúntale a FitAdapt AI
                </h3>
                <Badge variant="teal">FASE 9</Badge>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 max-w-xl">
                ¿Dudas sobre la técnica de un ejercicio, necesitas una alternativa biomecánicamente segura o quieres adaptar el tiempo de hoy?
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="md"
            onClick={() => onNavigate('ASSISTANT')}
            className="shrink-0 font-bold flex items-center gap-2 shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            Abrir FitAdapt AI
          </Button>
        </div>

        {/* Sugerencias Rápidas Requeridas */}
        <div className="mt-4 pt-3 border-t border-teal-200/60 dark:border-teal-800/60 flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Consultas sugeridas:
          </span>
          {[
            'Explícame mi rutina',
            '¿Cómo hago este ejercicio?',
            'Busca una alternativa',
            'Haz mi rutina más corta',
            '¿Cómo voy esta semana?',
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => onNavigate('ASSISTANT')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-teal-200 dark:border-teal-800/80 text-zinc-700 dark:text-zinc-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </section>

      {/* Grid: Progreso Semanal + Próxima Sesión */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cumplimiento Semanal */}
        <Card elevation="raised" className="flex flex-col justify-between">
          <CardHeader
            title="Progreso de la Semana"
            subtitle="Meta semanal: 3 sesiones de ejercicio adaptado"
            action={
              <button
                onClick={() => onNavigate('PROGRESS')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-0.5"
              >
                Detalles <ArrowRight className="w-3 h-3" />
              </button>
            }
          />

          <div className="space-y-4">
            <ProgressBar value={66} label="2 de 3 sesiones completadas" color="teal" size="md" />

            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
                <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Tiempo acumulado</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">55 minutos</span>
              </div>
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200/80 dark:border-zinc-700/80">
                <span className="text-zinc-500 dark:text-zinc-400 block text-[10px]">Molestias reportadas</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">0 alertas</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Próximo Entrenamiento */}
        <Card elevation="raised" className="flex flex-col justify-between">
          <CardHeader
            title="Próxima Sesión"
            subtitle="Programada para pasado mañana (Viernes)"
            action={
              <Badge variant="neutral">
                <Calendar className="w-3 h-3 mr-1" />
                Viernes
              </Badge>
            }
          />

          <div className="space-y-2">
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Movilidad Articular & Cadena Posterior
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Enfocado en descompresión lumbar, flexibilidad de isquiotibiales y fortalecimiento de glúteos con puente supino.
            </p>

            <div className="flex items-center gap-3 pt-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-600" />
                20 min
              </span>
              <span className="flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5" />
                3 ejercicios suaves
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex justify-end">
            <Button variant="outline" size="sm" onClick={() => onNavigate('PLAN')}>
              Ver Calendario Semanal
            </Button>
          </div>
        </Card>
      </section>

      {/* Banner de Recomendación y Bienestar */}
      <section className="p-4 rounded-2xl bg-teal-50/60 dark:bg-teal-950/20 border border-teal-200/80 dark:border-teal-900/60 flex items-start gap-3">
        <div className="p-2 rounded-xl bg-teal-100 dark:bg-teal-900/50 text-teal-700 dark:text-teal-300 shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-teal-950 dark:text-teal-200">
            Consejo Adaptativo de Hoy
          </h4>
          <p className="text-xs text-teal-800 dark:text-teal-300/90 leading-relaxed">
            Recuerda que ante cualquier molestia aguda en rodillas durante la sentadilla isométrica, basta con elevar la cadera 10 centímetros para reducir la presión en la rótula. Tu salud articular siempre es la prioridad.
          </p>
        </div>
      </section>
    </div>
  );
}
