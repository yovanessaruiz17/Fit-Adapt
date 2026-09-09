/**
 * FitAdapt - Visualizador del Roadmap de Fases (Fases 1 a 10)
 * FASE 1: Arquitectura y Modelos Base
 */

import { CheckCircle, Circle, ArrowRight, ShieldCheck, Palette, FileText, Cpu, Dumbbell, BarChart3, Bot, Smartphone } from 'lucide-react';

export function PhaseRoadmapViewer() {
  const phases = [
    {
      number: 1,
      title: 'Arquitectura, reglas maestras y estructura base',
      status: 'COMPLETADA',
      icon: ShieldCheck,
      description: 'Definición de entidades (UserProfile, Exercise, etc.), motor de compatibilidad con prioridad de limitaciones y políticas éticas.',
      isCurrent: false,
    },
    {
      number: 2,
      title: 'Sistema visual y UI/UX',
      status: 'COMPLETADA',
      icon: Palette,
      description: 'Diseño del sistema de diseño, paleta, componentes atómicos, estados de carga y navegación adaptativa.',
      isCurrent: false,
    },
    {
      number: 3,
      title: 'Onboarding y perfil fitness',
      status: 'COMPLETADA',
      icon: FileText,
      description: 'Flujo guiado paso a paso para captura de datos antropométricos, objetivos, limitaciones y disponibilidad.',
      isCurrent: false,
    },
    {
      number: 4,
      title: 'Biblioteca estructurada de ejercicios',
      status: 'COMPLETADA',
      icon: Dumbbell,
      description: 'Catálogo de más de 64 ejercicios con biomecánica, variantes de bajo impacto, sin equipamiento y compatibilidad articular.',
      isCurrent: false,
    },
    {
      number: 5,
      title: 'Motor de personalización y compatibilidad',
      status: 'COMPLETADA',
      icon: Cpu,
      description: 'Motor desacoplado y puro con jerarquía de 9 reglas, scoring determinista inquebrantable y resolución de alternativas.',
      isCurrent: false,
    },
    {
      number: 6,
      title: 'Generador de rutinas personalizadas',
      status: 'COMPLETADA',
      icon: Dumbbell,
      description: 'Ensamblado determinista de sesiones (Warm-up, Main, Finisher, Cool-down) con presets de 15 a 60 min, ajustes y 12 tests automatizados.',
      isCurrent: false,
    },
    {
      number: 7,
      title: 'Plan semanal, calendario y entrenamiento activo',
      status: 'COMPLETADA',
      icon: CheckCircle,
      description: 'Planificación semanal determinista, calendario semanal/mensual (UPCOMING, TODAY, COMPLETED, MISSED, REST), modo activo con temporizador, descansos, persistencia y 11 tests.',
      isCurrent: false,
    },
    {
      number: 8,
      title: 'Sistema de progreso personal, métricas y logros',
      status: 'COMPLETADA',
      icon: BarChart3,
      description: 'Dashboard "Mi progreso", KPIs, registro de peso con gráfico neutral, medidas corporales opcionales con toggle, desglose por objetivo/tipo, cálculo de racha, mini-calendario, logros de constancia, exportación/borrado y 11 tests automatizados.',
      isCurrent: true,
    },
    {
      number: 9,
      title: 'Asistente Fitness con IA',
      status: 'SIGUIENTE',
      icon: Bot,
      description: 'Capa asistiva contextual que explica ejercicios y sugiere alternativas sin violar las reglas.',
      isCurrent: false,
    },
    {
      number: 10,
      title: 'PWA, optimización, accesibilidad, seguridad y lanzamiento',
      status: 'PLANIFICADA',
      icon: Smartphone,
      description: 'Service Workers para offline, manifiesto PWA instalable, auditoría WCAG AA y hardening final.',
      isCurrent: false,
    },
  ];

  return (
    <div id="phase-roadmap-viewer" className="bg-white border border-zinc-200 rounded-xl p-5 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Roadmap Integral de Desarrollo por Fases</h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            Evolución progresiva bajo el principio estricto de continuidad: ninguna fase destruye código funcional anterior.
          </p>
        </div>
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          FASE 1 ACTIVA
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
        {phases.map((p) => {
          const IconComponent = p.icon;
          return (
            <div
              key={p.number}
              className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${
                p.status === 'COMPLETADA'
                  ? 'border-emerald-300 bg-emerald-50/40 text-emerald-950'
                  : p.status === 'SIGUIENTE'
                  ? 'border-blue-300 bg-blue-50/40 text-blue-950 ring-1 ring-blue-300'
                  : 'border-zinc-200 bg-zinc-50/60 text-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      p.status === 'COMPLETADA'
                        ? 'bg-emerald-200 text-emerald-900'
                        : p.status === 'SIGUIENTE'
                        ? 'bg-blue-200 text-blue-900'
                        : 'bg-zinc-200 text-zinc-700'
                    }`}
                  >
                    FASE {p.number}
                  </span>
                  <IconComponent
                    className={`w-4 h-4 ${
                      p.status === 'COMPLETADA'
                        ? 'text-emerald-600'
                        : p.status === 'SIGUIENTE'
                        ? 'text-blue-600'
                        : 'text-zinc-400'
                    }`}
                  />
                </div>
                <h3 className="text-xs font-bold text-zinc-900 line-clamp-2 leading-snug mb-1.5">
                  {p.title}
                </h3>
                <p className="text-[11px] text-zinc-600 leading-snug">
                  {p.description}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-zinc-200/60 flex items-center justify-between text-[10px] font-semibold">
                <span
                  className={
                    p.status === 'COMPLETADA'
                      ? 'text-emerald-700'
                      : p.status === 'SIGUIENTE'
                      ? 'text-blue-700'
                      : 'text-zinc-400'
                  }
                >
                  {p.status}
                </span>
                {p.status === 'COMPLETADA' && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                {p.status === 'SIGUIENTE' && <ArrowRight className="w-3.5 h-3.5 text-blue-600" />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
