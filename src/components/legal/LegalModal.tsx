import React, { useState } from 'react';
import { ShieldCheck, FileText, AlertTriangle, Trash2, Download, CheckCircle2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'terms' | 'privacy' | 'health' | 'data';
  onResetAllData?: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'health',
  onResetAllData,
}) => {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy' | 'health' | 'data'>(defaultTab);
  const [confirmReset, setConfirmReset] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleExportData = () => {
    try {
      const allData: Record<string, any> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('fitadapt_')) {
          try {
            allData[key] = JSON.parse(localStorage.getItem(key) || 'null');
          } catch {
            allData[key] = localStorage.getItem(key);
          }
        }
      }
      const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fitadapt_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Error exporting data:', err);
    }
  };

  const handleWipeData = () => {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('fitadapt_')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
      if (onResetAllData) {
        onResetAllData();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Error wiping data:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transparencia, Privacidad y Salud">
      <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
        {/* Sub-navigation tabs */}
        <div className="flex border-b border-zinc-200 dark:border-zinc-700 overflow-x-auto gap-1 pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('health')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'health'
                ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Descargo de Salud
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('privacy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'privacy'
                ? 'bg-teal-100 text-teal-900 dark:bg-teal-950/60 dark:text-teal-200'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            Privacidad
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terms')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'terms'
                ? 'bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Términos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('data')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg shrink-0 flex items-center gap-1.5 transition ${
              activeTab === 'data'
                ? 'bg-red-100 text-red-900 dark:bg-red-950/60 dark:text-red-200'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Trash2 className="w-3.5 h-3.5 text-red-500" />
            Control de Datos
          </button>
        </div>

        {/* Tab 1: Health Disclaimer */}
        {activeTab === 'health' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <span className="font-bold text-amber-900 dark:text-amber-200 block">
                  Aviso Médico y Responsabilidad Biomecánica
                </span>
                <p className="text-amber-800/90 dark:text-amber-300/90">
                  FitAdapt es una aplicación de acondicionamiento físico adaptativo con fines informativos y de bienestar. No constituye prescripción médica, kinesiológica ni reemplazo de un facultativo de la salud.
                </p>
              </div>
            </div>
            <ul className="text-xs space-y-2 list-disc pl-4 text-zinc-600 dark:text-zinc-300">
              <li>
                <strong>Evaluación previa:</strong> Antes de comenzar cualquier programa físico intenso, consulte a su médico, especialmente ante patologías cardíacas, metabólicas o lesiones crónicas.
              </li>
              <li>
                <strong>Regla del no dolor agudo:</strong> Si siente dolor punzante, mareo, opresión torácica o falta de aire inusual durante un ejercicio, deténgase inmediatamente.
              </li>
              <li>
                <strong>Filtros biomecánicos:</strong> Los filtros de impacto y limitaciones son recomendaciones preventivas basadas en reglas estándar de entrenamiento, pero no garantizan la ausencia de molestias individuales.
              </li>
            </ul>
          </div>
        )}

        {/* Tab 2: Privacy Policy */}
        {activeTab === 'privacy' && (
          <div className="space-y-3 animate-fadeIn text-xs">
            <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80">
              <span className="font-bold text-teal-900 dark:text-teal-200 block mb-1">
                Arquitectura Local-First: Tus datos nunca se venden
              </span>
              <p className="text-teal-800/90 dark:text-teal-300/90">
                FitAdapt almacena tu perfil, tus registros de entrenamiento y tus preferencias en el almacenamiento local de tu propio navegador (localStorage/IndexedDB).
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">¿Qué datos guardamos?</h5>
              <p className="text-zinc-600 dark:text-zinc-400">
                • Respuestas de tu perfil: objetivo, nivel, ubicación y limitaciones articularias seleccionadas.<br />
                • Historial de sesiones completadas (duración, RPE, fecha).<br />
                • Ajustes de tema visual y notificaciones.
              </p>
            </div>
            <div className="space-y-2">
              <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">Inteligencia Artificial y Privacidad</h5>
              <p className="text-zinc-600 dark:text-zinc-400">
                Al usar FitAdapt AI, únicamente se transmiten variables funcionales sanitizadas (nivel, tipo de ejercicio y contexto biomecánico). Nunca se envían nombres personales ni identificadores privados.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Terms of Use */}
        {activeTab === 'terms' && (
          <div className="space-y-3 animate-fadeIn text-xs text-zinc-600 dark:text-zinc-300">
            <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">1. Licencia de Uso Personal</h5>
            <p>
              FitAdapt concede una licencia personal, no exclusiva y gratuita para tu autocuidado físico mediante la Progressive Web App.
            </p>
            <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">2. Seguridad en el Entrenamiento</h5>
            <p>
              El usuario es el único responsable de contar con un espacio seguro, ventilado y libre de obstáculos para realizar los ejercicios sugeridos.
            </p>
            <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">3. Disponibilidad</h5>
            <p>
              Como PWA, las funciones esenciales continúan operando sin conexión a internet. Los servicios externos de IA dependen de conectividad activa.
            </p>
          </div>
        )}

        {/* Tab 4: Data Management & Right to be Forgotten */}
        {activeTab === 'data' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-zinc-600 dark:text-zinc-300">
              Tienes control absoluto sobre la información generada en FitAdapt. Puedes descargar una copia de seguridad o borrar todos los datos permanentemente.
            </p>

            <div className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                  Exportar todos tus datos (JSON)
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Descarga tus rutinas, perfil e historial de progreso en un archivo.
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportData} className="text-xs shrink-0">
                <Download className="w-3.5 h-3.5 mr-1" />
                {exportSuccess ? '¡Descargado!' : 'Exportar JSON'}
              </Button>
            </div>

            <div className="p-3.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 space-y-3">
              <div>
                <span className="text-xs font-bold text-red-900 dark:text-red-200 block">
                  Borrado total de datos (Derecho al olvido)
                </span>
                <span className="text-[11px] text-red-700 dark:text-red-300">
                  Elimina permanentemente todo tu historial, perfil local y preferencias de tu navegador.
                </span>
              </div>

              {!confirmReset ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setConfirmReset(true)}
                  className="text-xs text-red-600 border-red-300 hover:bg-red-100 dark:border-red-800 dark:hover:bg-red-950/60"
                >
                  <Trash2 className="w-3.5 h-3.5 mr-1" />
                  Borrar todos mis datos
                </Button>
              ) : (
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-950/80 border border-red-300 dark:border-red-800 space-y-2">
                  <span className="text-xs font-semibold text-red-900 dark:text-red-100 block">
                    ¿Estás completamente seguro? Esta acción es irreversible.
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={handleWipeData}
                      className="bg-red-600 hover:bg-red-700 text-white text-xs"
                    >
                      Sí, borrar definitivamente
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setConfirmReset(false)}
                      className="text-xs"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700 flex justify-end">
          <Button variant="primary" size="sm" onClick={onClose} className="text-xs">
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
