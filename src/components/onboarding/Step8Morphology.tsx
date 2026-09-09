/**
 * FitAdapt - Paso 8: Morfología Corporal (Opcional)
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { BodyMorphology } from '../../types/user';
import { BODY_MORPHOLOGY_METADATA } from '../../constants/fitness';
import { Info, Check, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface Step8MorphologyProps {
  selectedMorphology: BodyMorphology | 'NONE';
  onSelectMorphology: (morphology: BodyMorphology | 'NONE') => void;
}

export function Step8Morphology({
  selectedMorphology,
  onSelectMorphology,
}: Step8MorphologyProps) {
  const morphologyList = [
    {
      id: BodyMorphology.RECTANGULAR,
      icon: '▬',
      subtitle: 'Silueta equilibrada con ancho similar en hombros y caderas.',
    },
    {
      id: BodyMorphology.TRIANGULAR,
      icon: '▲',
      subtitle: 'Mayor anchura relativa en caderas con hombros más estrechos.',
    },
    {
      id: BodyMorphology.INVERTED_TRIANGLE,
      icon: '▼',
      subtitle: 'Cintura escapular y hombros más anchos que la pelvis.',
    },
    {
      id: BodyMorphology.HOURGLASS,
      icon: '⧖',
      subtitle: 'Hombros y caderas alineados con cintura más definida.',
    },
    {
      id: BodyMorphology.OVAL,
      icon: '●',
      subtitle: 'Distribución suave en zona central con extremidades proporcionadas.',
    },
  ];

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Explicación obligatoria y ética */}
      <div className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-850 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-xs text-teal-950 dark:text-teal-200 block">
            Referencia Secundaria 100% Opcional
          </span>
          <p className="text-xs text-teal-900/90 dark:text-teal-300 leading-relaxed">
            Esta información no se utiliza para diagnósticos estéticos ni promesas de quema de grasa localizada (la reducción de grasa no se puede dirigir a zonas específicas). Sirve únicamente como referencia ergonómica y postural secundaria.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
          Selecciona una silueta de referencia (o puedes omitirla):
        </span>
        <Button
          type="button"
          variant={selectedMorphology === 'NONE' ? 'primary' : 'ghost'}
          size="sm"
          onClick={() => onSelectMorphology('NONE')}
        >
          {selectedMorphology === 'NONE' ? '✓ Omitido / No especificado' : 'Omitir este paso'}
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {morphologyList.map((item) => {
          const meta = BODY_MORPHOLOGY_METADATA[item.id];
          const isSelected = selectedMorphology === item.id;

          return (
            <div
              key={item.id}
              onClick={() => onSelectMorphology(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-3 ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-600'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-mono text-sm text-teal-600 dark:text-teal-400">
                    {item.icon}
                  </span>
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {meta.name}
                  </h4>
                </div>

                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {item.subtitle}
                </p>

                <div className="text-[11px] text-teal-800 dark:text-teal-300 bg-teal-100/60 dark:bg-teal-900/40 p-2 rounded-lg mt-1">
                  <strong>Enfoque funcional:</strong> {meta.ergonomicFocus}
                </div>
              </div>

              <div
                className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 transition-colors ${
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
  );
}
