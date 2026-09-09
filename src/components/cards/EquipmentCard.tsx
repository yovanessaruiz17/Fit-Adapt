/**
 * FitAdapt - Card de Equipamiento y Limitación Física
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import { Check, AlertTriangle, Dumbbell, ShieldAlert } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { PhysicalLimitation } from '../../types/user';

export function EquipmentCard({
  id,
  label,
  isSelected,
  onToggle,
  icon,
}: {
  key?: React.Key;
  id: string;
  label: string;
  isSelected: boolean;
  onToggle: (id: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <Card
      interactive
      padding="sm"
      onClick={() => onToggle(id)}
      className={`flex items-center justify-between gap-3 transition-all cursor-pointer ${
        isSelected
          ? 'border-teal-600 bg-teal-50/40 dark:border-teal-500 dark:bg-teal-950/20 ring-1 ring-teal-600 dark:ring-teal-500'
          : 'hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 shrink-0">
          {icon || <Dumbbell className="w-4 h-4 text-teal-600" />}
        </div>
        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
          {label}
        </span>
      </div>

      <div
        className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center transition-all ${
          isSelected
            ? 'bg-teal-600 border-teal-600 text-white'
            : 'border-zinc-300 dark:border-zinc-700'
        }`}
      >
        {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
      </div>
    </Card>
  );
}

export function LimitationCard({
  limitation,
  isSelected,
  onToggle,
}: {
  limitation: PhysicalLimitation;
  isSelected: boolean;
  onToggle: (limitation: PhysicalLimitation) => void;
}) {
  return (
    <Card
      interactive
      onClick={() => onToggle(limitation)}
      className={`transition-all cursor-pointer ${
        isSelected
          ? 'border-amber-600 bg-amber-50/40 dark:border-amber-500 dark:bg-amber-950/20 ring-1 ring-amber-600 dark:ring-amber-500'
          : 'hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
            {limitation.name}
          </h4>
        </div>

        <div
          className={`w-4 h-4 rounded-md border shrink-0 flex items-center justify-center transition-all mt-1 ${
            isSelected
              ? 'bg-amber-600 border-amber-600 text-white'
              : 'border-zinc-300 dark:border-zinc-700'
          }`}
        >
          {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
        </div>
      </div>

      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
        {limitation.notes}
      </p>

      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
        <Badge variant="neutral" size="sm">
          Zona: {limitation.affectedBodyAreas.join(', ')}
        </Badge>
        {limitation.requiresLowImpact && (
          <Badge variant="warning" size="sm">
            Requiere Bajo Impacto
          </Badge>
        )}
      </div>
    </Card>
  );
}
