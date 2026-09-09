/**
 * FitAdapt - Modal para Registrar o Editar Peso
 * FASE 8: Sistema de Progreso Personal
 */

import React, { useState, useEffect } from 'react';
import { WeightRecord } from '../../types/progress';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Scale, Trash2, Calendar, FileText } from 'lucide-react';

export interface AddEditWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: WeightRecord | null;
  onSave: (weightKg: number, date: string, note?: string) => void;
  onDelete?: (id: string) => void;
}

export function AddEditWeightModal({
  isOpen,
  onClose,
  recordToEdit,
  onSave,
  onDelete,
}: AddEditWeightModalProps) {
  const [weightKg, setWeightKg] = useState<number>(63.0);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (recordToEdit) {
      setWeightKg(recordToEdit.weightKg);
      setDate(recordToEdit.date);
      setNote(recordToEdit.note || '');
    } else {
      setWeightKg(63.0);
      setDate(new Date().toISOString().split('T')[0]);
      setNote('');
    }
  }, [recordToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weightKg <= 20 || weightKg >= 300) return;
    onSave(weightKg, date, note.trim() || undefined);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recordToEdit ? 'Modificar Registro de Peso' : 'Nuevo Registro de Peso'}
      maxWidth="md"
    >
      <form id="weight-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Input Peso */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            Peso Corporal (kg)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.1"
              min="25"
              max="250"
              required
              value={weightKg || ''}
              onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
              className="w-full px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 font-bold text-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500"
              placeholder="62.5"
            />
            <span className="absolute right-4 top-3 text-xs font-bold text-zinc-400">kg</span>
          </div>
        </div>

        {/* Input Fecha */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            Fecha de medición
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Nota opcional */}
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5">
            Nota o contexto (opcional)
          </label>
          <input
            type="text"
            maxLength={60}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ej. En ayunas, descanso reparador..."
            className="w-full px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Botones de acción */}
        <div className="pt-2 flex items-center justify-between gap-2">
          {recordToEdit && onDelete ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                onDelete(recordToEdit.id);
                onClose();
              }}
              className="text-rose-600 border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/30"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Eliminar
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">
              Guardar registro
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
