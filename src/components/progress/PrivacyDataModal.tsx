/**
 * FitAdapt - Modal de Privacidad, Exportación y Gestión de Datos
 * FASE 8: Sistema de Progreso Personal
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Download, Trash2, ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from 'lucide-react';
import { ProgressManager } from '../../core/progress/progressManager';

export interface PrivacyDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataCleared: () => void;
}

export function PrivacyDataModal({
  isOpen,
  onClose,
  onDataCleared,
}: PrivacyDataModalProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadJSON = () => {
    const jsonStr = ProgressManager.exportAllDataJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitadapt_progreso_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Archivo JSON descargado');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleDownloadCSV = () => {
    const csvStr = ProgressManager.exportWeightCSV();
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fitadapt_pesos_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadSuccess('Archivo CSV descargado');
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  const handleClearAll = () => {
    ProgressManager.clearAllProgressData();
    onDataCleared();
    setConfirmClear(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacidad y Gestión de Datos"
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {/* Declaración de Privacidad */}
        <div className="p-3.5 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h5 className="font-bold text-teal-950 dark:text-teal-200">
              Tus datos te pertenecen por completo
            </h5>
            <p className="text-teal-800 dark:text-teal-300 leading-relaxed">
              En FitAdapt, todos tus registros de peso, medidas corporales y entrenamientos se almacenan de forma local en tu navegador. No realizamos predicciones médicas, promesas de pérdida de peso ni compartimos tu evolución con terceros.
            </p>
          </div>
        </div>

        {downloadSuccess && (
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">{downloadSuccess}</span>
          </div>
        )}

        {/* Sección: Exportar Datos */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
          <h5 className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider text-[11px]">
            Exportar tu Historial
          </h5>
          <p className="text-zinc-500 dark:text-zinc-400">
            Descarga una copia de seguridad íntegra de tus entrenamientos, peso y medidas en formatos abiertos.
          </p>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="outline" size="sm" onClick={handleDownloadJSON}>
              <Download className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Exportar Todo (JSON)
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownloadCSV}>
              <FileText className="w-3.5 h-3.5 mr-1 text-teal-600" />
              Exportar Peso (CSV)
            </Button>
          </div>
        </div>

        {/* Sección: Borrado de Datos */}
        <div className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/60 space-y-2.5">
          <h5 className="font-bold text-rose-900 dark:text-rose-300 uppercase tracking-wider text-[11px]">
            Zona de Eliminación de Datos
          </h5>
          <p className="text-zinc-600 dark:text-zinc-400">
            Puedes restablecer tu historial y borrar todos los registros de progreso acumulados si deseas comenzar de cero.
          </p>

          {!confirmClear ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setConfirmClear(true)}
              className="text-rose-600 border-rose-200 hover:bg-rose-100 dark:hover:bg-rose-950/50"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Borrar todos mis datos de progreso
            </Button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-100 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-800 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 text-rose-900 dark:text-rose-200 font-bold">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>¿Estás completamente seguro?</span>
              </div>
              <p className="text-rose-800 dark:text-rose-300 text-[11px]">
                Esta acción eliminará de forma irreversible tu historial de peso, medidas y sesiones de entrenamiento.
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmClear(false)}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleClearAll}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-bold"
                >
                  Confirmar y eliminar
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
