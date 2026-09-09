import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, CheckCircle2, Smartphone } from 'lucide-react';
import { usePWAInstall } from './usePWAInstall';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const PWAInstallPrompt: React.FC<{ variant?: 'header' | 'card' | 'floating' }> = ({
  variant = 'header',
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  // If already running in standalone PWA, hide install prompt
  if (isInstalled && !justInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => setJustInstalled(false), 4000);
      }
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  // If not installable and not iOS (e.g. standard desktop browser with no prompt fired), do not render
  if (!isInstallable && !isIOS && !justInstalled) {
    return null;
  }

  if (justInstalled) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-medium animate-fadeIn">
        <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span>¡FitAdapt instalada con éxito!</span>
      </div>
    );
  }

  return (
    <>
      {variant === 'header' && (
        <button
          type="button"
          onClick={handleInstallClick}
          aria-label="Instalar FitAdapt como aplicación nativa en tu dispositivo"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 dark:bg-teal-950/60 dark:text-teal-300 dark:hover:bg-teal-900/60 border border-teal-200/80 dark:border-teal-800/80 transition-colors shadow-xs"
        >
          <Download className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Instalar App</span>
          <span className="sm:hidden">Instalar</span>
        </button>
      )}

      {variant === 'card' && (
        <div className="p-4 rounded-xl border border-teal-200 dark:border-teal-800/60 bg-gradient-to-br from-teal-50/70 to-emerald-50/40 dark:from-teal-950/30 dark:to-zinc-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-500 text-white shadow-xs">
              <Smartphone className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Instala FitAdapt en tu pantalla de inicio
              </h4>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Acceso ultra-rápido, pantalla completa y uso 100% offline para entrenar donde quieras.
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleInstallClick}
            className="w-full sm:w-auto shrink-0 text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Instalar ahora
          </Button>
        </div>
      )}

      {/* iOS Installation Instruction Modal */}
      <Modal
        isOpen={showIOSModal}
        onClose={() => setShowIOSModal(false)}
        title="Instalar FitAdapt en iPhone / iPad"
      >
        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
          <p>
            Para disfrutar de FitAdapt en pantalla completa sin las barras del navegador Safari:
          </p>
          <div className="space-y-3 bg-zinc-50 dark:bg-zinc-800/60 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700/80">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 shrink-0 font-bold text-xs">
                1
              </div>
              <p className="text-xs">
                Toca el botón <strong>Compartir</strong> (<Share className="w-3.5 h-3.5 inline mx-1 text-teal-600 dark:text-teal-400" />) en la barra inferior de Safari.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 shrink-0 font-bold text-xs">
                2
              </div>
              <p className="text-xs">
                Desplázate hacia abajo y selecciona <strong>«Añadir a pantalla de inicio»</strong> (<PlusSquare className="w-3.5 h-3.5 inline mx-1 text-teal-600 dark:text-teal-400" />).
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 shrink-0 font-bold text-xs">
                3
              </div>
              <p className="text-xs">
                Toca <strong>«Añadir»</strong> en la esquina superior derecha para confirmar el icono de FitAdapt en tu pantalla principal.
              </p>
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button variant="primary" size="sm" onClick={() => setShowIOSModal(false)}>
              Entendido
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
