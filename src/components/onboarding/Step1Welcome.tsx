/**
 * FitAdapt - Paso 1: Bienvenida y Consentimiento de Protección de Datos Personales
 * FASE 3 y FASE 10: Cumplimiento de Privacidad, Local-First y Políticas de Datos
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  HeartPulse,
  Lock,
  FileText,
  CheckCircle2,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sliders,
  HardDrive,
} from 'lucide-react';
import { Card } from '../ui/Card';
import { Checkbox } from '../ui/Checkbox';
import { Button } from '../ui/Button';
import { OnboardingData } from '../../types/onboarding';

interface Step1WelcomeProps {
  data: OnboardingData;
  onChange: (updates: Partial<OnboardingData>) => void;
  onOpenLegalModal?: () => void;
  onStart: () => void;
}

export function Step1Welcome({
  data,
  onChange,
  onOpenLegalModal,
  onStart,
}: Step1WelcomeProps) {
  const [showFullPolicy, setShowFullPolicy] = useState(false);

  const allAccepted =
    data.hasAcceptedPrivacyPolicy &&
    data.hasAcceptedHealthDataProcessing &&
    data.hasAcceptedTerms;

  const handleAcceptAll = () => {
    onChange({
      hasAcceptedPrivacyPolicy: true,
      hasAcceptedHealthDataProcessing: true,
      hasAcceptedTerms: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Tarjeta Hero de Bienvenida */}
      <Card
        elevation="raised"
        className="p-6 sm:p-8 bg-gradient-to-br from-teal-500/10 via-emerald-500/5 to-transparent border-teal-200/80 dark:border-teal-850"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 dark:bg-teal-500 text-white flex items-center justify-center shrink-0 shadow-sm">
            <HeartPulse className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 dark:bg-teal-900/60 text-teal-800 dark:text-teal-200">
              <Clock className="w-3.5 h-3.5" />
              <span>Configuración inicial · ~2 minutos</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              Bienvenido a tu entrenamiento adaptativo inteligente
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
              FitAdapt personaliza tus rutinas mediante reglas biomecánicas deterministas,
              respetando tu nivel, tiempo, equipamiento y salud articular.
            </p>
          </div>
        </div>
      </Card>

      {/* Compromiso Local-First y de Privacidad */}
      <div className="p-4 rounded-2xl bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/90 dark:border-teal-800 flex items-start gap-3">
        <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-0.5">
          <HardDrive className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-teal-950 dark:text-teal-100">
            Soberanía de Datos y Almacenamiento Local (Local-First)
          </h3>
          <p className="text-xs text-teal-800/90 dark:text-teal-300 leading-relaxed">
            Tu información personal y de salud reside <strong>exclusivamente en la memoria local de tu dispositivo</strong> (<code className="px-1 py-0.2 bg-teal-100 dark:bg-teal-900 rounded font-mono text-[11px]">localStorage</code>). No comercializamos, no transferimos a terceros ni compartimos tus datos con anunciantes.
          </p>
        </div>
      </div>

      {/* Módulo de Política de Protección de Datos Personales */}
      <Card elevation="flat" className="p-5 sm:p-6 border-zinc-200/90 dark:border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              Política de Tratamiento y Protección de Datos Personales
            </h3>
          </div>
          <button
            type="button"
            onClick={() => setShowFullPolicy(!showFullPolicy)}
            className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
          >
            {showFullPolicy ? (
              <>
                <span>Ocultar detalles</span>
                <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>Ver detalles normativos</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
          Antes de ingresar tus datos personales en el asistente de configuración, es indispensable
          que conozcas qué información solicitaremos, para qué fines será tratada y cómo garantizamos
          el control absoluto sobre tu privacidad.
        </p>

        {/* Resumen esquemático de tratamiento */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 block">
              1. Datos Antropométricos
            </span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Nombre/alias, edad, sexo de referencia, peso y estatura para estimar palancas biomecánicas y gasto calórico.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 block">
              2. Salud y Articulaciones
            </span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Sensibilidades articulares (rodillas, hombros, lumbares) para suprimir ejercicios de alto impacto lesivo.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200/60 dark:border-zinc-700/60 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-400 block">
              3. Derechos y Borrado
            </span>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Posibilidad de descargar tus datos en formato JSON o eliminarlos por completo de tu navegador en cualquier momento.
            </p>
          </div>
        </div>

        {/* Sección desplegable con cláusulas completas */}
        {showFullPolicy && (
          <div className="pt-3 border-t border-zinc-200/80 dark:border-zinc-800 space-y-3 text-xs text-zinc-600 dark:text-zinc-300">
            <div className="p-3.5 rounded-xl bg-zinc-100/70 dark:bg-zinc-850/60 space-y-2">
              <h4 className="font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-teal-600" />
                <span>Bases del Tratamiento y Privacidad por Diseño</span>
              </h4>
              <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-zinc-500 dark:text-zinc-400 leading-relaxed">
                <li><strong>Finalidad Exclusiva:</strong> Generación y adaptación de rutinas deportivas personalizadas en base a algoritmos de compatibilidad biomecánica.</li>
                <li><strong>No Diagnóstico Clínico:</strong> FitAdapt no evalúa ni prescribe patologías médicas. En caso de dolor agudo o patología preexistente, debes contar con aprobación médica.</li>
                <li><strong>Sin Telemetría Invasiva:</strong> La analítica integrada opera en modo local para rendimiento funcional de la PWA, sin identificadores biométricos únicos vinculables a terceros.</li>
                <li><strong>Retención y Eliminación:</strong> Los datos se conservan únicamente mientras no borres la memoria de la aplicación o pulses "Eliminar todos los datos" en los ajustes.</li>
              </ul>
            </div>

            {onOpenLegalModal && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={onOpenLegalModal}
                  className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  <span>Ver Términos y Marco Legal Completo de FitAdapt</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Casillas de Verificación de Consentimiento Obligatorio */}
        <div className="pt-4 border-t border-zinc-200/80 dark:border-zinc-800 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h4 className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
              Consentimientos Requeridos para Continuar
            </h4>
            {!allAccepted && (
              <button
                type="button"
                onClick={handleAcceptAll}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 cursor-pointer underline"
              >
                Aceptar todas las políticas
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            <Checkbox
              id="consent-privacy-policy"
              checked={data.hasAcceptedPrivacyPolicy}
              onChange={(e) =>
                onChange({ hasAcceptedPrivacyPolicy: e.target.checked })
              }
              label={
                <span className="font-semibold text-xs sm:text-sm">
                  Acepto la Política de Protección de Datos Personales
                </span>
              }
              description="Autorizo a FitAdapt a almacenar localmente en este dispositivo mis datos antropométricos y preferencias de entrenamiento."
            />

            <Checkbox
              id="consent-health-data"
              checked={data.hasAcceptedHealthDataProcessing}
              onChange={(e) =>
                onChange({ hasAcceptedHealthDataProcessing: e.target.checked })
              }
              label={
                <span className="font-semibold text-xs sm:text-sm">
                  Autorizo el tratamiento de mis datos de salud física y articular
                </span>
              }
              description="Permito el análisis de sensibilidades motrices y molestias para que el motor biomecánico filtre ejercicios de impacto y asigne alternativas seguras."
            />

            <Checkbox
              id="consent-terms-medical"
              checked={data.hasAcceptedTerms}
              onChange={(e) =>
                onChange({ hasAcceptedTerms: e.target.checked })
              }
              label={
                <span className="font-semibold text-xs sm:text-sm">
                  Acepto los Términos de Uso y el alcance informativo no clínico
                </span>
              }
              description="Entiendo que FitAdapt es un orientador de entrenamiento físico funcional y no sustituye la consulta o prescripción médica profesional."
            />
          </div>
        </div>
      </Card>

      {/* Botón de acción rápida si todo está listo */}
      {allAccepted ? (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Políticas y consentimientos aceptados correctamente. Ya puedes ingresar tus datos.</span>
          </div>
          <Button
            type="button"
            variant="primary"
            size="sm"
            onClick={onStart}
            className="shrink-0"
          >
            Comenzar Onboarding
          </Button>
        </div>
      ) : (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <span className="text-base leading-none">⚠️</span>
          <span>
            Debes marcar las 3 casillas de consentimiento para habilitar el ingreso de datos en el Paso 2.
          </span>
        </div>
      )}
    </div>
  );
}
