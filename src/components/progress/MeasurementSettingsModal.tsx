/**
 * FitAdapt - Configuración de Medidas Corporales Opcionales
 * FASE 8: Sistema de Progreso Personal
 * 
 * Permite al usuario activar/desactivar las métricas de contorno que desea monitorear
 * (cintura, cadera, brazo, muslo, pecho) respetando su comodidad personal y privacidad.
 */

import React, { useState } from 'react';
import { MeasurementPreferences } from '../../types/progress';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Sliders, Check } from 'lucide-react';

export interface MeasurementSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: MeasurementPreferences;
  onSavePreferences: (prefs: MeasurementPreferences) => void;
}

export function MeasurementSettingsModal({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}: MeasurementSettingsModalProps) {
  const [metrics, setMetrics] = useState(preferences.enabledMetrics);

  const toggle = (key: keyof typeof metrics) => {
    setMetrics((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = () => {
    onSavePreferences({ enabledMetrics: metrics });
    onClose();
  };

  const metricLabels = [
    { key: 'waist', label: 'Cintura', desc: 'Contorno a la altura del ombligo' },
    { key: 'hip', label: 'Cadera', desc: 'Parte más ancha de los glúteos' },
    { key: 'arm', label: 'Brazo', desc: 'Contorno de bíceps relajado' },
    { key: 'thigh', label: 'Muslo', desc: 'Parte media del muslo / cuádriceps' },
    { key: 'chest', label: 'Pecho / Torso', desc: 'Contorno bajo las axilas' },
  ] as const;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurar Métricas de Medidas"
      maxWidth="md"
    >
      <div className="space-y-4">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Activa únicamente las medidas corporales que te interese registrar. Puedes cambiarlas o desactivarlas en cualquier momento.
        </p>

        <div className="space-y-2">
          {metricLabels.map((item) => {
            const isChecked = metrics[item.key];
            return (
              <label
                key={item.key}
                className="flex items-center justify-between p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100/60 dark:hover:bg-zinc-800/60 cursor-pointer transition-colors"
              >
                <div>
                  <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200 block">
                    {item.label}
                  </span>
                  <span className="text-[11px] text-zinc-500">
                    {item.desc}
                  </span>
                </div>

                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggle(item.key)}
                  className="w-4 h-4 rounded text-teal-600 focus:ring-teal-500 border-zinc-300"
                />
              </label>
            );
          })}
        </div>

        <div className="pt-2 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} className="font-bold">
            Guardar preferencias
          </Button>
        </div>
      </div>
    </Modal>
  );
}
