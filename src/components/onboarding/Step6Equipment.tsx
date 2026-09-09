/**
 * FitAdapt - Paso 6: Equipamiento Disponible
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React from 'react';
import { TrainingLocation, AnyEquipment, HomeEquipment, GymEquipment } from '../../types/user';
import { HOME_EQUIPMENT_OPTIONS, GYM_EQUIPMENT_OPTIONS } from '../../constants/fitness';
import { Check, Dumbbell, Layers, Activity, Flame, Armchair, PlusCircle, Minus, GitCommit, Cpu, Zap, CircleDot, Repeat, Sliders } from 'lucide-react';
import { Button } from '../ui/Button';

interface Step6EquipmentProps {
  location: TrainingLocation;
  selectedEquipment: AnyEquipment[];
  onToggleEquipment: (id: AnyEquipment) => void;
  onSetEquipment: (list: AnyEquipment[]) => void;
}

export function Step6Equipment({
  location,
  selectedEquipment,
  onToggleEquipment,
  onSetEquipment,
}: Step6EquipmentProps) {
  const isHome = location === TrainingLocation.HOME;
  const options = isHome ? HOME_EQUIPMENT_OPTIONS : GYM_EQUIPMENT_OPTIONS;

  const renderIcon = (iconName: string) => {
    const props = { className: 'w-5 h-5 text-teal-600 dark:text-teal-400' };
    switch (iconName) {
      case 'Dumbbell': return <Dumbbell {...props} />;
      case 'Layers': return <Layers {...props} />;
      case 'Activity': return <Activity {...props} />;
      case 'Flame': return <Flame {...props} />;
      case 'Armchair': return <Armchair {...props} />;
      case 'Minus': return <Minus {...props} />;
      case 'GitCommit': return <GitCommit {...props} />;
      case 'Cpu': return <Cpu {...props} />;
      case 'Zap': return <Zap {...props} />;
      case 'CircleDot': return <CircleDot {...props} />;
      case 'Repeat': return <Repeat {...props} />;
      case 'Sliders': return <Sliders {...props} />;
      default: return <PlusCircle {...props} />;
    }
  };

  const handleSelectAll = () => {
    const allIds = options.map((o) => o.id);
    onSetEquipment(allIds);
  };

  const handleSelectBodyweightOnly = () => {
    if (isHome) {
      onSetEquipment([HomeEquipment.NO_EQUIPMENT]);
    } else {
      onSetEquipment([GymEquipment.DUMBBELLS]);
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Equipamiento para: <strong className="text-teal-700 dark:text-teal-300 font-bold">{isHome ? 'Casa' : 'Gimnasio'}</strong>. Marca todo lo que tengas accesible:
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <Button type="button" variant="ghost" size="sm" onClick={handleSelectBodyweightOnly}>
            {isHome ? 'Solo peso corporal' : 'Básico'}
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
            Marcar todo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selectedEquipment.includes(opt.id);

          return (
            <div
              key={opt.id}
              onClick={() => onToggleEquipment(opt.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-teal-600 dark:border-teal-500 bg-teal-50/70 dark:bg-teal-950/40 ring-1 ring-teal-600'
                  : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-teal-100 dark:bg-teal-900/60' : 'bg-zinc-100 dark:bg-zinc-800'
                  }`}
                >
                  {renderIcon(opt.icon)}
                </div>
                <span className="text-xs sm:text-sm font-semibold text-zinc-800 dark:text-zinc-200">
                  {opt.label}
                </span>
              </div>

              <div
                className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
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

      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 pt-1 italic">
        * Si en el futuro adquieres más material o cambias de gimnasio, podrás actualizar esta lista al instante en tu Perfil.
      </p>
    </div>
  );
}
