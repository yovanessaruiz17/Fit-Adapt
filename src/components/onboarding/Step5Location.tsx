/**
 * FitAdapt - Paso 5: Lugar de Entrenamiento
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { TrainingLocation } from '../../types/user';
import { Home, Building2, Check } from 'lucide-react';

interface Step5LocationProps {
  selectedLocation: TrainingLocation;
  onSelectLocation: (location: TrainingLocation) => void;
}

export function Step5Location({ selectedLocation, onSelectLocation }: Step5LocationProps) {
  const locations = [
    {
      id: TrainingLocation.HOME,
      name: 'Entrenar en Casa',
      icon: <Home className="w-6 h-6 text-teal-600 dark:text-teal-400" />,
      tag: 'Flexible y sin desplazamientos',
      description: 'Ideal si entrenas con tu propio peso corporal, colchoneta, bandas elásticas o mancuernas compactas.',
      features: [
        'Rutinas optimizadas para espacios reducidos',
        'Bajo nivel de ruido / impacto en suelo',
        'Opciones con o sin accesorios',
      ],
    },
    {
      id: TrainingLocation.GYM,
      name: 'Entrenar en Gimnasio',
      icon: <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      tag: 'Acceso a variedad de cargas',
      description: 'Aprovecha barras, poleas, máquinas selectorizadas de palanca y zona de peso libre.',
      features: [
        'Selección amplia de equipamiento comercial',
        'Sobrecarga progresiva milimétrica',
        'Alternativas guiadas en máquinas para estabilidad',
      ],
    },
  ];

  return (
    <div className="space-y-4 animate-fadeIn">
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        El lugar que elijas determinará automáticamente el catálogo de equipamiento que configuraremos en el siguiente paso.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {locations.map((loc) => {
          const isSelected = selectedLocation === loc.id;

          return (
            <div
              key={loc.id}
              onClick={() => onSelectLocation(loc.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'border-teal-600 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-2 ring-teal-600/30 shadow-xs'
                  : 'border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      isSelected
                        ? 'bg-teal-600 text-white'
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300'
                    }`}
                  >
                    {loc.icon}
                  </div>

                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'border-teal-600 bg-teal-600 text-white'
                        : 'border-zinc-300 dark:border-zinc-700'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {loc.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-teal-700 dark:text-teal-300 block mt-0.5">
                    {loc.tag}
                  </span>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {loc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800 space-y-1.5">
                  {loc.features.map((feat) => (
                    <div key={feat} className="flex items-center gap-1.5 text-xs text-zinc-600 dark:text-zinc-400">
                      <span className="text-teal-600 dark:text-teal-400 text-xs font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
