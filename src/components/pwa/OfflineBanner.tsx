import React, { useState } from 'react';
import { WifiOff, X, Database, Info } from 'lucide-react';
import { useOnlineStatus } from './useOnlineStatus';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [isDismissed, setIsDismissed] = useState(false);

  // If online or manually dismissed for this session, don't show
  if (isOnline || isDismissed) {
    return null;
  }

  return (
    <aside
      role="status"
      aria-live="polite"
      id="fitadapt-offline-banner"
      className="bg-amber-600 text-white px-4 py-2 text-xs sm:text-sm font-medium transition-all shadow-md flex items-center justify-between z-40 sticky top-0"
    >
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <WifiOff className="w-4 h-4 shrink-0 text-amber-200 animate-pulse" aria-hidden="true" />
          <span>
            <strong>Modo sin conexión activo:</strong> Tus rutinas, ejercicios, historial y perfil están seguros y disponibles en local.
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="hidden md:inline-flex items-center gap-1 text-xs bg-amber-700/60 px-2 py-0.5 rounded text-amber-100">
            <Database className="w-3 h-3" aria-hidden="true" /> Almacenamiento local listo
          </span>
          <button
            type="button"
            onClick={() => setIsDismissed(true)}
            aria-label="Cerrar aviso de modo sin conexión"
            className="p-1 text-amber-200 hover:text-white rounded hover:bg-amber-700 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
