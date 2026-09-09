import React, { useState, useEffect } from 'react';
import { Bell, BellOff, Clock, Shield, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { NotificationService, NotificationPreferences } from '../../core/notifications/notificationService';
import { AnalyticsService } from '../../core/analytics/analytics';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [prefs, setPrefs] = useState<NotificationPreferences>(NotificationService.getPreferences());
  const [permission, setPermission] = useState<NotificationPermission>(NotificationService.getPermission());
  const [testSent, setTestSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setPrefs(NotificationService.getPreferences());
      setPermission(NotificationService.getPermission());
      setTestSent(false);
      setErrorMsg(null);
    }
  }, [isOpen]);

  const handleRequestPermission = async () => {
    const result = await NotificationService.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      const updated = { ...prefs, enabled: true };
      setPrefs(updated);
      NotificationService.savePreferences(updated);
      AnalyticsService.logEvent('notification_enabled', { mode: 'granted' });
    } else if (result === 'denied') {
      setErrorMsg('Las notificaciones están bloqueadas en los ajustes de tu navegador. Debes habilitarlas en el icono de candado de la barra de direcciones.');
    }
  };

  const handleToggleEnabled = (enabled: boolean) => {
    if (enabled && permission !== 'granted') {
      handleRequestPermission();
      return;
    }
    const updated = { ...prefs, enabled };
    setPrefs(updated);
    NotificationService.savePreferences(updated);
  };

  const handleUpdate = <K extends keyof NotificationPreferences>(key: K, value: NotificationPreferences[K]) => {
    const updated = { ...prefs, [key]: value };
    setPrefs(updated);
    NotificationService.savePreferences(updated);
  };

  const handleSendTest = async () => {
    if (permission !== 'granted') {
      await handleRequestPermission();
      return;
    }
    const success = await NotificationService.triggerTestNotification();
    if (success) {
      setTestSent(true);
      setTimeout(() => setTestSent(false), 4000);
    } else {
      setErrorMsg('No se pudo enviar la notificación. Verifica permisos del sistema operativo.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Preferencias de Notificaciones">
      <div className="space-y-5 text-sm text-zinc-700 dark:text-zinc-300">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/80">
          <Bell className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-semibold text-teal-900 dark:text-teal-200 block">
              Notificaciones no invasivas y 100% respetuosas
            </span>
            <p className="text-teal-800/80 dark:text-teal-300/80">
              FitAdapt nunca enviará spam ni publicidad. Solo alertas directas para recordarte tu momento de movimiento y proteger tu racha.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Master Toggle */}
        <div className="flex items-center justify-between p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/60">
          <div>
            <span className="font-bold text-zinc-900 dark:text-zinc-100 block">
              Activar Notificaciones
            </span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {permission === 'granted'
                ? prefs.enabled
                  ? 'Recordatorios activos'
                  : 'Desactivadas por el usuario'
                : 'Requiere permiso del navegador'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleToggleEnabled(!prefs.enabled)}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              prefs.enabled && permission === 'granted'
                ? 'bg-teal-600 justify-end'
                : 'bg-zinc-300 dark:bg-zinc-600 justify-start'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition-transform" />
          </button>
        </div>

        {prefs.enabled && permission === 'granted' && (
          <div className="space-y-3.5 border-t border-zinc-200 dark:border-zinc-700 pt-4">
            <div className="flex items-center justify-between">
              <label htmlFor="preferred-time-input" className="text-xs font-semibold flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                Hora preferida de entrenamiento:
              </label>
              <input
                id="preferred-time-input"
                type="time"
                value={prefs.preferredTime}
                onChange={(e) => handleUpdate('preferredTime', e.target.value)}
                className="px-2.5 py-1 text-xs rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 font-mono text-zinc-800 dark:text-zinc-200"
              />
            </div>

            <div className="space-y-2 pt-2">
              <Checkbox
                id="remind-workout"
                checked={prefs.reminderWorkout}
                onChange={(e) => handleUpdate('reminderWorkout', e.target.checked)}
                label="Recordatorio de sesión del día"
                description="Te avisa cuando toca entrenar según tu plan semanal"
              />
              <Checkbox
                id="remind-streak"
                checked={prefs.reminderStreak}
                onChange={(e) => handleUpdate('reminderStreak', e.target.checked)}
                label="Aviso de racha de constancia"
                description="Notificación para evitar perder tu continuidad de hábitos"
              />
              <Checkbox
                id="remind-weekly"
                checked={prefs.reminderWeekly}
                onChange={(e) => handleUpdate('reminderWeekly', e.target.checked)}
                label="Resumen de progreso semanal"
                description="Un balance de tus sesiones completadas y minutos acumulados"
              />
              <Checkbox
                id="quiet-hours"
                checked={prefs.quietHours}
                onChange={(e) => handleUpdate('quietHours', e.target.checked)}
                label="Modo silencioso nocturno (22:00 a 08:00)"
                description="No emitir ningún aviso durante horas de descanso"
              />
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSendTest}
            className="w-full sm:w-auto text-xs"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1 text-teal-600" />
            {testSent ? '¡Notificación enviada!' : 'Probar Notificación'}
          </Button>

          <Button variant="primary" size="sm" onClick={onClose} className="w-full sm:w-auto text-xs">
            Guardar y Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};
