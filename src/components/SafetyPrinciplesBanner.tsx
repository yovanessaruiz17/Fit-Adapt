/**
 * FitAdapt - Banner de Principios Éticos y Seguridad Médica
 * FASE 1: Arquitectura y Modelos Base
 */

import { AlertTriangle, ShieldCheck, HeartPulse, Info } from 'lucide-react';
import { MEDICAL_DISCLAIMER_TEXT, RED_FLAG_SYMPTOMS } from '../constants/safety';

export function SafetyPrinciplesBanner() {
  return (
    <section id="safety-principles-section" className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-5 mb-8">
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold text-amber-950">
              Pilares de Seguridad y Responsabilidad Médica (Reglas de Continuidad)
            </h3>
            <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-amber-200/70 text-amber-900">
              Cumplimiento Obligatorio en Todas las Fases
            </span>
          </div>

          <p className="text-sm text-amber-900/90 leading-relaxed">
            {MEDICAL_DISCLAIMER_TEXT.full}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="bg-white/80 p-3 rounded-lg border border-amber-200 text-xs text-amber-950">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1">
                <Info className="w-4 h-4 text-amber-700" />
                Morfología & Grasa Localizada
              </div>
              <p className="text-zinc-600 leading-relaxed">
                {MEDICAL_DISCLAIMER_TEXT.noSpotReductionWarning}
              </p>
            </div>

            <div className="bg-white/80 p-3 rounded-lg border border-amber-200 text-xs text-amber-950">
              <div className="flex items-center gap-1.5 font-semibold text-amber-900 mb-1">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                Criterios de Suspensión Inmediata (Banderas Rojas)
              </div>
              <ul className="list-disc list-inside text-zinc-600 space-y-0.5">
                <li>Dolor agudo o punzante repentino en cualquier articulación.</li>
                <li>Opresión torácica, mareo o dificultad respiratoria desproporcionada.</li>
                <li>Derivación obligatoria a médico o fisioterapeuta colegiado.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
