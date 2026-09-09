/**
 * FitAdapt - Modal de Confirmación
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { AlertCircle } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'wellness';
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  variant = 'primary',
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="sm"
      footer={
        <>
          <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3.5 py-1">
        <div
          className={`p-2.5 rounded-xl shrink-0 ${
            variant === 'danger'
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
              : 'bg-teal-100 text-teal-700 dark:bg-teal-950 dark:text-teal-400'
          }`}
        >
          <AlertCircle className="w-5 h-5" />
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          {message}
        </p>
      </div>
    </Modal>
  );
}
