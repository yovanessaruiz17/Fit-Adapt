/**
 * FitAdapt - Paso 9: Limitaciones y Molestias Físicas
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { BodyJointArea, UserSelectedLimitation } from '../../types/onboarding';
import { LimitationSeverity } from '../../types/user';
import { ShieldAlert, AlertTriangle, Check, Info } from 'lucide-react';
import { Input } from '../ui/Input';

interface Step9LimitationsProps {
  hasNoLimitations: boolean;
  limitations: UserSelectedLimitation[];
  onToggleNoLimitations: () => void;
  onToggleArea: (area: BodyJointArea) => void;
  onChangeSeverity: (area: BodyJointArea, severity: LimitationSeverity) => void;
  onChangeCustomDescription: (description: string) => void;
}

export function Step9Limitations({
  hasNoLimitations,
  limitations,
  onToggleNoLimitations,
  onToggleArea,
  onChangeSeverity,
  onChangeCustomDescription,
}: Step9LimitationsProps) {
  const jointAreas: { id: BodyJointArea; label: string; icon: string }[] = [
    { id: 'KNEE', label: 'Rodilla', icon: '🦵' },
    { id: 'ANKLE', label: 'Tobillo', icon: '🦶' },
    { id: 'HIP', label: 'Cadera', icon: '🦴' },
    { id: 'LOWER_BACK', label: 'Espalda baja (Lumbar)', icon: '🔙' },
    { id: 'UPPER_BACK', label: 'Espalda alta (Dorsal / Escápulas)', icon: '👕' },
    { id: 'SHOULDER', label: 'Hombro', icon: '💪' },
    { id: 'ELBOW', label: 'Codo', icon: '🦾' },
    { id: 'WRIST', label: 'Muñeca', icon: '✋' },
    { id: 'NECK', label: 'Cuello / Cervical', icon: '🧣' },
    { id: 'OTHER', label: 'Otra zona', icon: '➕' },
  ];

  const severities: { id: LimitationSeverity; label: string; tag: string }[] = [
    { id: LimitationSeverity.MILD_DISCOMFORT, label: 'Leve', tag: 'Molestia ocasional o rigidez' },
    { id: LimitationSeverity.MODERATE_LIMITATION, label: 'Moderada', tag: 'Dificultad con cargas o saltos' },
    { id: LimitationSeverity.ACUTE_REQUIRES_CLEARANCE, label: 'Fuerte', tag: 'Dolor agudo o lesión previa' },
  ];

  // Comprobar si hay dolor fuerte en alguna zona seleccionada
  const hasSevereDiscomfort = limitations.some(
    (l) => l.severity === LimitationSeverity.ACUTE_REQUIRES_CLEARANCE
  );

  const otherLimitation = limitations.find((l) => l.area === 'OTHER');

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner de no diagnóstico */}
      <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-850 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
          <strong className="font-bold">Prioridad biomecánica:</strong> FitAdapt no diagnostica patologías. Empleamos esta información para activar automáticamente sustituciones de bajo impacto y excluir movimientos mecánicamente desaconsejados.
        </p>
      </div>

      {/* Opción 1: Ninguna limitación */}
      <div
        onClick={onToggleNoLimitations}
        className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
          hasNoLimitations
            ? 'border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/40 ring-2 ring-emerald-600/30 font-bold'
            : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">✅</span>
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Ninguna limitación o molestia articular
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-normal">
              Me siento libre de dolor y puedo realizar cualquier patrón de movimiento con técnica adecuada.
            </p>
          </div>
        </div>

        <div
          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${
            hasNoLimitations
              ? 'border-emerald-600 bg-emerald-600 text-white'
              : 'border-zinc-300 dark:border-zinc-700'
          }`}
        >
          {hasNoLimitations && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </div>
      </div>

      {/* Opción 2: Zonas con molestias */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
            O selecciona las zonas que requieran protección:
          </label>
          {!hasNoLimitations && limitations.length > 0 && (
            <span className="text-xs font-bold text-teal-700 dark:text-teal-300">
              {limitations.length} {limitations.length === 1 ? 'zona marcada' : 'zonas marcadas'}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {jointAreas.map((zone) => {
            const activeLimit = limitations.find((l) => l.area === zone.id);
            const isSelected = !!activeLimit && !hasNoLimitations;

            return (
              <div
                key={zone.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/30'
                    : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300'
                }`}
              >
                <div
                  onClick={() => onToggleArea(zone.id)}
                  className="flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{zone.icon}</span>
                    <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {zone.label}
                    </span>
                  </div>

                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-zinc-300 dark:border-zinc-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Si está seleccionada, permitir indicar grado de severidad */}
                {isSelected && activeLimit && (
                  <div className="mt-3 pt-3 border-t border-teal-200/80 dark:border-teal-900/60 space-y-2 animate-fadeIn">
                    <span className="text-[11px] font-bold text-zinc-600 dark:text-zinc-400 block uppercase">
                      Intensidad de la molestia:
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {severities.map((sev) => {
                        const isSevActive = activeLimit.severity === sev.id;
                        const isAcute = sev.id === LimitationSeverity.ACUTE_REQUIRES_CLEARANCE;

                        return (
                          <button
                            key={sev.id}
                            type="button"
                            onClick={() => onChangeSeverity(zone.id, sev.id)}
                            className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer text-center ${
                              isSevActive
                                ? isAcute
                                  ? 'bg-rose-600 text-white shadow-xs'
                                  : 'bg-teal-600 text-white shadow-xs'
                                : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                            }`}
                          >
                            {sev.label}
                          </button>
                        );
                      })}
                    </div>

                    {zone.id === 'OTHER' && (
                      <div className="pt-2">
                        <Input
                          id="custom-limitation-input"
                          type="text"
                          placeholder="Describe brevemente la molestia (ej. fascitis plantar)"
                          value={otherLimitation?.customDescription || ''}
                          onChange={(e) => onChangeCustomDescription(e.target.value)}
                          className="text-xs"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Alerta Médica si se detecta dolor fuerte */}
      {hasSevereDiscomfort && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-3 animate-fadeIn">
          <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-black text-sm">
              Aviso Importante de Seguridad Médica
            </h4>
            <p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
              Has indicado <strong>dolor fuerte o limitación aguda</strong> en una o más articulaciones. FitAdapt filtrará automáticamente cualquier ejercicio que impacte esas zonas, pero te recomendamos encarecidamente <strong>consultar a un médico o fisioterapeuta</strong> antes de comenzar. Si durante cualquier sesión sientes dolor agudo o punzante, debes detenerte de inmediato.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
