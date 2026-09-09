/**
 * FitAdapt - Componente de Cabecera y Estado de Fase
 * FASE 1: Arquitectura y Modelos Base
 */

import { ShieldCheck, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

interface ArchitectureHeaderProps {
  currentPhase: number;
  totalPhases: number;
}

export function ArchitectureHeader({ currentPhase, totalPhases }: ArchitectureHeaderProps) {
  return (
    <header id="fitadapt-header" className="border-b border-zinc-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                FASE 1 COMPLETADA
              </span>
              <span className="text-xs font-medium text-zinc-500">
                Fase {currentPhase} de {totalPhases}
              </span>
            </div>
            <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              FitAdapt <span className="text-emerald-600 font-medium">| Arquitectura & Motor Base</span>
            </h1>
            <p className="mt-1 text-sm text-zinc-600 max-w-3xl">
              Plataforma de entrenamiento adaptativo impulsada por un motor determinista de reglas biomecánicas y seguridad médica, independiente de alucinaciones de IA.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
              <Layers className="w-4 h-4 text-zinc-500" />
              <div>
                <p className="font-semibold text-zinc-800">Principio Clave</p>
                <p className="text-zinc-500">Seguridad &gt; Preferencias</p>
              </div>
            </div>
            <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <div>
                <p className="font-semibold text-zinc-800">No Diagnóstico</p>
                <p className="text-zinc-500">Ética médica estricta</p>
              </div>
            </div>
          </div>
        </div>

        {/* Barra de progreso de fases */}
        <div className="mt-6 pt-4 border-t border-zinc-100">
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5">
            <span className="font-medium text-zinc-700">Fase 1: Arquitectura, reglas maestras y modelos de datos</span>
            <span className="font-semibold text-emerald-600">10% Completado del Roadmap</span>
          </div>
          <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentPhase / totalPhases) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
