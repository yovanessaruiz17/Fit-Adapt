/**
 * FitAdapt - Modal para Registrar o Editar Medidas Corporales
 * FASE 8: Sistema de Progreso Personal
 */

import React, { useState, useEffect } from 'react';
import { BodyMeasurementRecord, MeasurementPreferences } from '../../types/progress';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Trash2 } from 'lucide-react';

export interface AddEditMeasurementModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit?: BodyMeasurementRecord | null;
  preferences: MeasurementPreferences;
  onSave: (record: Omit<BodyMeasurementRecord, 'id' | 'createdAt'>) => void;
  onDelete?: (id: string) => void;
}

export function AddEditMeasurementModal({
  isOpen,
  onClose,
  recordToEdit,
  preferences,
  onSave,
  onDelete,
}: AddEditMeasurementModalProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [waistCm, setWaistCm] = useState<number | undefined>();
  const [hipCm, setHipCm] = useState<number | undefined>();
  const [armCm, setArmCm] = useState<number | undefined>();
  const [thighCm, setThighCm] = useState<number | undefined>();
  const [chestCm, setChestCm] = useState<number | undefined>();
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    if (recordToEdit) {
      setDate(recordToEdit.date);
      setWaistCm(recordToEdit.waistCm);
      setHipCm(recordToEdit.hipCm);
      setArmCm(recordToEdit.armCm);
      setThighCm(recordToEdit.thighCm);
      setChestCm(recordToEdit.chestCm);
      setNote(recordToEdit.note || '');
    } else {
      setDate(new Date().toISOString().split('T')[0]);
      setWaistCm(undefined);
      setHipCm(undefined);
      setArmCm(undefined);
      setThighCm(undefined);
      setChestCm(undefined);
      setNote('');
    }
  }, [recordToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      date,
      waistCm: waistCm ? Number(waistCm) : undefined,
      hipCm: hipCm ? Number(hipCm) : undefined,
      armCm: armCm ? Number(armCm) : undefined,
      thighCm: thighCm ? Number(thighCm) : undefined,
      chestCm: chestCm ? Number(chestCm) : undefined,
      note: note.trim() || undefined,
    });
    onClose();
  };

  const { enabledMetrics } = preferences;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={recordToEdit ? 'Modificar Medidas' : 'Nuevo Registro de Medidas'}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Fecha
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {enabledMetrics.waist && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Cintura (cm)
              </label>
              <input
                type="number"
                step="0.5"
                min="30"
                max="200"
                value={waistCm || ''}
                onChange={(e) => setWaistCm(parseFloat(e.target.value) || undefined)}
                placeholder="ej. 75"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs"
              />
            </div>
          )}

          {enabledMetrics.hip && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Cadera (cm)
              </label>
              <input
                type="number"
                step="0.5"
                min="40"
                max="220"
                value={hipCm || ''}
                onChange={(e) => setHipCm(parseFloat(e.target.value) || undefined)}
                placeholder="ej. 98"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs"
              />
            </div>
          )}

          {enabledMetrics.arm && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Brazo (cm)
              </label>
              <input
                type="number"
                step="0.5"
                min="15"
                max="70"
                value={armCm || ''}
                onChange={(e) => setArmCm(parseFloat(e.target.value) || undefined)}
                placeholder="ej. 28"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs"
              />
            </div>
          )}

          {enabledMetrics.thigh && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Muslo (cm)
              </label>
              <input
                type="number"
                step="0.5"
                min="25"
                max="120"
                value={thighCm || ''}
                onChange={(e) => setThighCm(parseFloat(e.target.value) || undefined)}
                placeholder="ej. 55"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs"
              />
            </div>
          )}

          {enabledMetrics.chest && (
            <div>
              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                Pecho (cm)
              </label>
              <input
                type="number"
                step="0.5"
                min="40"
                max="200"
                value={chestCm || ''}
                onChange={(e) => setChestCm(parseFloat(e.target.value) || undefined)}
                placeholder="ej. 88"
                className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1">
            Nota (opcional)
          </label>
          <input
            type="text"
            maxLength={60}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="ej. Medición mensual"
            className="w-full px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 text-xs"
          />
        </div>

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
              className="text-rose-600 border-rose-200 hover:bg-rose-50"
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
              Guardar medidas
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
