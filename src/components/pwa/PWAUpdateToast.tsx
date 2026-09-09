import React, { useEffect, useState } from 'react';
import { RefreshCw, X, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

export const PWAUpdateToast: React.FC = () => {
  const [needRefresh, setNeedRefresh] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Listen for waiting service worker
    navigator.serviceWorker.getRegistration().then((reg) => {
      if (!reg) return;
      setRegistration(reg);

      // If waiting worker exists on load
      if (reg.waiting) {
        setNeedRefresh(true);
      }

      reg.addEventListener('updatefound', () => {
        const newWorker = reg.installing;
        if (!newWorker) return;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            setNeedRefresh(true);
          }
        });
      });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  const handleUpdate = () => {
    if (registration?.waiting) {
      registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    } else {
      window.location.reload();
    }
  };

  if (!needRefresh) return null;

  return (
    <div
      role="alert"
      className="fixed bottom-20 md:bottom-6 right-4 z-50 max-w-sm w-[calc(100%-2rem)] p-4 rounded-xl bg-zinc-900 dark:bg-zinc-800 text-white shadow-2xl border border-teal-500/50 flex flex-col gap-3 animate-slideUp"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-teal-400 shrink-0" />
          <h4 className="text-sm font-semibold text-zinc-100">Nueva versión disponible</h4>
        </div>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="text-zinc-400 hover:text-white transition"
          aria-label="Cerrar notificación de actualización"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-zinc-300">
        Se ha descargado una actualización con mejoras de rendimiento y adaptaciones. Actualiza para aplicarla al instante.
      </p>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="px-3 py-1 text-xs text-zinc-400 hover:text-zinc-200"
        >
          Más tarde
        </button>
        <Button variant="primary" size="sm" onClick={handleUpdate} className="text-xs">
          <RefreshCw className="w-3 h-3 mr-1" />
          Actualizar ahora
        </Button>
      </div>
    </div>
  );
};
