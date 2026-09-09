/**
 * FitAdapt - Paso 10: Resumen y Confirmación Final
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { OnboardingData } from '../../types/onboarding';
import { FITNESS_GOALS_METADATA, FITNESS_LEVELS_METADATA, BODY_MORPHOLOGY_METADATA } from '../../constants/fitness';
import { TrainingLocation } from '../../types/user';
import { CheckCircle2, ShieldCheck, User, Target, Dumbbell, Calendar, HeartPulse, Sparkles } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface Step10SummaryProps {
  data: OnboardingData;
  onToggleMedicalClearance: (checked: boolean) => void;
}

export function Step10Summary({ data, onToggleMedicalClearance }: Step10SummaryProps) {
  const goalMeta = data.primaryGoal ? FITNESS_GOALS_METADATA[data.primaryGoal] : null;
  const levelMeta = data.fitnessLevel ? FITNESS_LEVELS_METADATA[data.fitnessLevel] : null;
  const morphMeta = data.morphology !== 'NONE' ? BODY_MORPHOLOGY_METADATA[data.morphology] : null;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-850 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
        <div>
          <h3 className="text-sm font-bold text-teal-950 dark:text-teal-100">
            ¡Perfil configurado con éxito!
          </h3>
          <p className="text-xs text-teal-900/90 dark:text-teal-300 leading-relaxed mt-0.5">
            Revisa a continuación el resumen estructurado de tus preferencias. Este modelo alimentará directamente las reglas deterministas de seguridad y adaptación biomecánica.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tarjeta 1: Información Básica */}
        <Card elevation="raised" className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <User className="w-4 h-4 text-teal-600" />
            <span>Datos del Atleta</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Nombre:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{data.name}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Edad:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{data.age} años</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Sexo biológico / ref:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {data.sex === 'FEMALE' ? 'Femenino' : data.sex === 'MALE' ? 'Masculino' : 'No especificado'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Altura y Peso:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {data.heightCm} cm · {data.weightKg} kg
              </span>
            </div>
          </div>
        </Card>

        {/* Tarjeta 2: Foco & Nivel */}
        <Card elevation="raised" className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <Target className="w-4 h-4 text-teal-600" />
            <span>Objetivo y Nivel</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Objetivo principal:</span>
              <span className="font-bold text-teal-600 dark:text-teal-400">
                {goalMeta?.name || 'No definido'}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Nivel de entrenamiento:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {levelMeta?.name || 'No definido'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Morfología opcional:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {morphMeta ? morphMeta.name : 'Omitida (Sin sesgo)'}
              </span>
            </div>
          </div>
        </Card>

        {/* Tarjeta 3: Entorno y Disponibilidad */}
        <Card elevation="raised" className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <Calendar className="w-4 h-4 text-teal-600" />
            <span>Entorno y Tiempo</span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Lugar de entrenamiento:</span>
              <Badge variant="teal">
                {data.trainingLocation === TrainingLocation.HOME ? 'Casa' : 'Gimnasio'}
              </Badge>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Frecuencia semanal:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{data.daysPerWeek} días / semana</span>
            </div>
            <div className="flex justify-between py-1 border-b border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Duración por sesión:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{data.durationMinutes} minutos</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-zinc-500">Intensidad preferida:</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">
                {data.preferredIntensity === 'LOW' ? 'Suave (Bajo impacto)' : data.preferredIntensity === 'MEDIUM' ? 'Equilibrada' : 'Exigente'}
              </span>
            </div>
          </div>
        </Card>

        {/* Tarjeta 4: Seguridad & Limitaciones */}
        <Card elevation="raised" className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-wider">
            <HeartPulse className="w-4 h-4 text-teal-600" />
            <span>Seguridad y Limitaciones</span>
          </div>

          <div className="space-y-2 text-xs">
            {data.hasNoLimitations || data.limitations.length === 0 ? (
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Sin limitaciones articulares declaradas.</span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <span className="text-zinc-500 block">Zonas protegidas activamente:</span>
                <div className="flex flex-wrap gap-1.5">
                  {data.limitations.map((lim) => (
                    <span
                      key={lim.area}
                      className="px-2 py-1 rounded-md text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200"
                    >
                      {lim.area} ({lim.severity === 'ACUTE_REQUIRES_CLEARANCE' ? 'Fuerte' : lim.severity === 'MODERATE_LIMITATION' ? 'Moderada' : 'Leve'})
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-2 text-zinc-500 text-[11px] leading-relaxed">
              Equipamiento registrado: <strong className="text-zinc-800 dark:text-zinc-200">{data.availableEquipment.length} elementos</strong>
            </div>
          </div>
        </Card>
      </div>

      {/* Declaración de responsabilidad médica y ética */}
      <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-850/80 border border-zinc-200 dark:border-zinc-800 space-y-3">
        <div className="flex items-start gap-3">
          <input
            id="medical-clearance-checkbox"
            type="checkbox"
            checked={data.medicalClearanceAcknowledged}
            onChange={(e) => onToggleMedicalClearance(e.target.checked)}
            className="w-5 h-5 mt-0.5 rounded text-teal-600 focus:ring-teal-500 border-zinc-300 dark:border-zinc-700 cursor-pointer"
          />
          <label htmlFor="medical-clearance-checkbox" className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed cursor-pointer select-none">
            <strong className="text-zinc-900 dark:text-zinc-100 block font-bold mb-0.5">
              Confirmación de Responsabilidad y Seguridad Física *
            </strong>
            Confirmo que comprendo que FitAdapt es una herramienta de acondicionamiento físico orientativa y no diagnóstica. Me comprometo a respetar mis límites articulares, detenerme ante cualquier dolor agudo y consultar a un profesional médico o fisioterapeuta en caso de requerir prescripción clínica.
          </label>
        </div>
      </div>
    </div>
  );
}
