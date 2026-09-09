/**
 * FitAdapt AI - Modal de Control de Privacidad y Datos Sanitizados
 * FASE 9: Asistente Contextual FitAdapt AI
 */

import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AIPrivacySettings } from '../../core/ai/types';
import { AIPrivacyManager } from '../../core/ai/privacy';

export interface AIPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export function AIPrivacyModal({ isOpen, onClose, onSaved }: AIPrivacyModalProps) {
  const [settings, setSettings] = useState<AIPrivacySettings>(() => AIPrivacyManager.getSettings());
  const [savedNotice, setSavedNotice] = useState(false);

  const handleToggle = (key: keyof AIPrivacySettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    AIPrivacyManager.saveSettings(updated);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
    onSaved?.();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacidad y Control de Contexto (IA)"
      description="Decide qué información anónima y técnica se comparte con FitAdapt AI"
      maxWidth="md"
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          Listo
        </Button>
      }
    >
      <div id="ai-privacy-modal" className="space-y-4 py-1 text-xs">
        {/* Banner Ético de Protección */}
        <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-teal-950 dark:text-teal-200 block text-xs">
              Privacidad y Separación de Datos Sensibles
            </span>
            <p className="text-teal-800 dark:text-teal-300/90 mt-0.5 leading-relaxed">
              FitAdapt nunca envía nombres completos, correos electrónicos, datos biométricos privados (como registros de peso o medidas corporales) ni ubicaciones GPS a los modelos de IA.
            </p>
          </div>
        </div>

        {savedNotice && (
          <div className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium text-xs">Preferencias de privacidad actualizadas.</span>
          </div>
        )}

        <div className="space-y-3">
          <span className="font-bold text-zinc-700 dark:text-zinc-300 block uppercase tracking-wider text-[11px]">
            Permisos de Contexto Compartido
          </span>

          {/* Opción 1: Objetivos y Nivel */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                Objetivo Fitness y Nivel
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-0.5">
                Permite a la IA adaptar el tono y la exigencia biomecánica sugerida.
              </p>
            </div>
            <button
              onClick={() => handleToggle('shareGoalsAndLevel')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                settings.shareGoalsAndLevel
                  ? 'bg-teal-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {settings.shareGoalsAndLevel ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {settings.shareGoalsAndLevel ? 'Compartido' : 'Oculto'}
            </button>
          </div>

          {/* Opción 2: Equipamiento y Lugar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                Lugar y Equipamiento Disponible
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-0.5">
                Garantiza que las alternativas sugeridas coincidan con lo que tienes en casa o gimnasio.
              </p>
            </div>
            <button
              onClick={() => handleToggle('shareEquipmentAndLocation')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                settings.shareEquipmentAndLocation
                  ? 'bg-teal-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {settings.shareEquipmentAndLocation ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {settings.shareEquipmentAndLocation ? 'Compartido' : 'Oculto'}
            </button>
          </div>

          {/* Opción 3: Limitaciones Articulares */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                Limitaciones Articulares Declaradas
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-0.5">
                Imprescindible para que el Compatibility Engine filtre impactos y zonas sensibles.
              </p>
            </div>
            <button
              onClick={() => handleToggle('shareLimitations')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                settings.shareLimitations
                  ? 'bg-teal-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {settings.shareLimitations ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {settings.shareLimitations ? 'Compartido' : 'Oculto'}
            </button>
          </div>

          {/* Opción 4: Rutina Actual */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                Estructura de la Rutina Activa
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-0.5">
                Permite responder preguntas específicas como "¿Por qué tengo este ejercicio hoy?".
              </p>
            </div>
            <button
              onClick={() => handleToggle('shareCurrentWorkout')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                settings.shareCurrentWorkout
                  ? 'bg-teal-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {settings.shareCurrentWorkout ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {settings.shareCurrentWorkout ? 'Compartido' : 'Oculto'}
            </button>
          </div>

          {/* Opción 5: Resumen de Constancia */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="font-semibold text-zinc-900 dark:text-zinc-100 block">
                Métricas de Constancia (Racha y Sesiones)
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 text-[11px] mt-0.5">
                Solo envía el total de sesiones y racha para felicitaciones y feedback de constancia.
              </p>
            </div>
            <button
              onClick={() => handleToggle('shareProgressStats')}
              className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                settings.shareProgressStats
                  ? 'bg-teal-600 text-white'
                  : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              {settings.shareProgressStats ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              {settings.shareProgressStats ? 'Compartido' : 'Oculto'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
