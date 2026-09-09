/**
 * FitAdapt - Paso 2: Información Básica
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { BiologicalSex } from '../../types/user';
import { Input } from '../ui/Input';
import { Info, User, Calendar, Ruler, Weight } from 'lucide-react';

interface Step2BasicInfoProps {
  name: string;
  age: number | '';
  sex: BiologicalSex | '';
  heightCm: number | '';
  weightKg: number | '';
  onChange: (fields: {
    name?: string;
    age?: number | '';
    sex?: BiologicalSex | '';
    heightCm?: number | '';
    weightKg?: number | '';
  }) => void;
}

export function Step2BasicInfo({
  name,
  age,
  sex,
  heightCm,
  weightKg,
  onChange,
}: Step2BasicInfoProps) {
  // Cálculo orientativo y neutro de IMC
  const bmi =
    typeof heightCm === 'number' && typeof weightKg === 'number' && heightCm > 0
      ? (weightKg / Math.pow(heightCm / 100, 2)).toFixed(1)
      : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Aviso de no diagnóstico */}
      <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-850 flex items-start gap-3">
        <Info className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <p className="text-xs text-teal-900 dark:text-teal-200 leading-relaxed">
          <strong className="font-bold">Uso estrictamente funcional:</strong> Estos datos se emplean únicamente para calcular la palanca mecánica, la estimación del esfuerzo relativo y la selección adecuada de variantes de ejercicios. No realizamos diagnósticos médicos.
        </p>
      </div>

      <div className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            Nombre o Apodo <span className="text-rose-500">*</span>
          </label>
          <Input
            id="onboarding-name-input"
            type="text"
            placeholder="Ej. Ana, Carlos, María"
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
            leftIcon={<User className="w-4 h-4 text-zinc-400" />}
            required
          />
        </div>

        {/* Edad y Sexo */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Edad (años) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="onboarding-age-input"
              type="number"
              min={14}
              max={105}
              placeholder="Ej. 32"
              value={age === '' ? '' : age}
              onChange={(e) => {
                const val = e.target.value;
                onChange({ age: val === '' ? '' : Number(val) });
              }}
              leftIcon={<Calendar className="w-4 h-4 text-zinc-400" />}
              helperText="Rango válido: 14 a 105 años"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Sexo Biológico / Referencia <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: BiologicalSex.FEMALE, label: 'Femenino' },
                { id: BiologicalSex.MALE, label: 'Masculino' },
                { id: BiologicalSex.OTHER_PREFER_NOT_TO_SAY, label: 'Otro / Prefiero no decir' },
              ].map((opt) => {
                const isSelected = sex === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => onChange({ sex: opt.id })}
                    className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer text-center ${
                      isSelected
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-200 ring-1 ring-teal-600'
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Altura y Peso */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Altura (cm) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="onboarding-height-input"
              type="number"
              min={120}
              max={240}
              placeholder="Ej. 168"
              value={heightCm === '' ? '' : heightCm}
              onChange={(e) => {
                const val = e.target.value;
                onChange({ heightCm: val === '' ? '' : Number(val) });
              }}
              leftIcon={<Ruler className="w-4 h-4 text-zinc-400" />}
              helperText="Rango válido: 120 a 240 cm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
              Peso (kg) <span className="text-rose-500">*</span>
            </label>
            <Input
              id="onboarding-weight-input"
              type="number"
              min={35}
              max={260}
              placeholder="Ej. 68"
              value={weightKg === '' ? '' : weightKg}
              onChange={(e) => {
                const val = e.target.value;
                onChange({ weightKg: val === '' ? '' : Number(val) });
              }}
              leftIcon={<Weight className="w-4 h-4 text-zinc-400" />}
              helperText="Rango válido: 35 a 260 kg"
              required
            />
          </div>
        </div>
      </div>

      {/* Indicador orientativo */}
      {bmi && (
        <div className="p-3 rounded-xl bg-zinc-100 dark:bg-zinc-850/80 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs">
          <span className="text-zinc-500 dark:text-zinc-400">
            Índice de masa corporal orientativo (IMC):
          </span>
          <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">
            {bmi} kg/m²
          </span>
        </div>
      )}
    </div>
  );
}
