/**
 * FitAdapt - Layout General del Asistente de Onboarding
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, X } from 'lucide-react';
import { OnboardingStepNumber } from '../../types/onboarding';
import { Button } from '../ui/Button';

interface OnboardingLayoutProps {
  currentStep: OnboardingStepNumber;
  totalSteps?: number;
  stepTitle: string;
  stepSubtitle: string;
  children: React.ReactNode;
  errorMessage?: string;
  onNext: () => void;
  onPrev: () => void;
  onCancel?: () => void;
  isNextDisabled?: boolean;
  isSubmitting?: boolean;
  nextButtonLabel?: string;
}

export function OnboardingLayout({
  currentStep,
  totalSteps = 10,
  stepTitle,
  stepSubtitle,
  children,
  errorMessage,
  onNext,
  onPrev,
  onCancel,
  isNextDisabled = false,
  isSubmitting = false,
  nextButtonLabel,
}: OnboardingLayoutProps) {
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Barra superior de progreso */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white font-black text-sm shadow-xs">
              FA
            </div>
            <div>
              <span className="text-xs font-black tracking-tight text-zinc-900 dark:text-zinc-100 block">
                FitAdapt
              </span>
              <span className="text-[11px] font-medium text-teal-600 dark:text-teal-400 block">
                Configuración Inicial
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                Paso {currentStep} de {totalSteps}
              </span>
              <span className="text-[11px] text-zinc-400 dark:text-zinc-500 block font-mono">
                {progressPercent}% completado
              </span>
            </div>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                title="Salir del asistente"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Barra de progreso fluida */}
        <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Contenido Central */}
      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Cabecera del paso actual */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/80 dark:border-teal-800">
                Paso {currentStep}
              </span>
              <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono">
                {currentStep === 10 ? 'Final' : 'Progresivo'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-zinc-50 tracking-tight">
              {stepTitle}
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              {stepSubtitle}
            </p>
          </div>

          {/* Cuerpo del paso */}
          <div className="pt-2">
            {children}
          </div>
        </div>

        {/* Zona de error y navegación inferior */}
        <div className="pt-8 mt-auto space-y-3">
          {errorMessage && (
            <div
              role="alert"
              className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2 animate-fadeIn"
            >
              <span className="font-bold text-sm leading-none shrink-0 mt-0.5">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-800">
            {currentStep > 1 ? (
              <Button
                type="button"
                variant="outline"
                onClick={onPrev}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                disabled={isSubmitting}
              >
                Atrás
              </Button>
            ) : (
              <div className="text-xs text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Enfoque ético y no diagnóstico</span>
              </div>
            )}

            <Button
              type="button"
              variant="primary"
              onClick={onNext}
              disabled={isNextDisabled}
              isLoading={isSubmitting}
              rightIcon={currentStep < totalSteps ? <ArrowRight className="w-4 h-4" /> : undefined}
            >
              {nextButtonLabel || (currentStep === totalSteps ? 'Finalizar y Comenzar' : 'Continuar')}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
