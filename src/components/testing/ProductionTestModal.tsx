import React, { useState } from 'react';
import { CheckCircle2, XCircle, Play, ShieldAlert, Sparkles, Award, RefreshCw, FileText } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProductionTestSuite, TestSuiteSummary } from '../../core/testing/productionTestSuite';

interface ProductionTestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProductionTestModal: React.FC<ProductionTestModalProps> = ({ isOpen, onClose }) => {
  const [running, setRunning] = useState(false);
  const [summary, setSummary] = useState<TestSuiteSummary | null>(null);

  const runTests = async () => {
    setRunning(true);
    try {
      const res = await ProductionTestSuite.runAll();
      setSummary(res);
    } catch (err) {
      console.error('Error running test suite:', err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Auditoría de Producción (FASE 10)">
      <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
        <div className="p-3.5 rounded-xl bg-gradient-to-r from-teal-50 to-emerald-50 dark:from-teal-950/40 dark:to-zinc-900 border border-teal-200 dark:border-teal-800/80 flex items-start gap-3">
          <Award className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-teal-900 dark:text-teal-100 block">
              Suite Integral de Validación Pre-Lanzamiento
            </span>
            <p className="text-teal-800/80 dark:text-teal-300/80">
              Evalúa 15 dimensiones críticas: Onboarding, Biomecánica, Generador, PWA, Offline Sync, Notificaciones, Privacidad, Edge Cases y Accesibilidad WCAG.
            </p>
          </div>
        </div>

        {!summary && !running && (
          <div className="py-8 text-center space-y-3">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Presiona el botón para ejecutar la verificación completa en vivo sobre los módulos activos de FitAdapt.
            </p>
            <Button variant="primary" onClick={runTests} className="text-xs">
              <Play className="w-3.5 h-3.5 mr-1.5" />
              Ejecutar 15 Pruebas de Producción
            </Button>
          </div>
        )}

        {running && (
          <div className="py-8 text-center space-y-3 animate-pulse">
            <RefreshCw className="w-6 h-6 mx-auto text-teal-500 animate-spin" />
            <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-300">
              Ejecutando pruebas biomecánicas, validación PWA y comprobación de límites...
            </p>
          </div>
        )}

        {summary && !running && (
          <div className="space-y-3 animate-fadeIn">
            <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-center">
              <div>
                <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 block">
                  {summary.passed}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Aprobadas</span>
              </div>
              <div>
                <span className="text-lg font-bold text-red-600 dark:text-red-400 block">
                  {summary.failed}
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Fallidas</span>
              </div>
              <div>
                <span className="text-lg font-bold text-zinc-800 dark:text-zinc-200 block">
                  {summary.durationMs}ms
                </span>
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Duración</span>
              </div>
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1 divide-y divide-zinc-100 dark:divide-zinc-800">
              {summary.results.map((r) => (
                <div key={r.id} className="pt-2 first:pt-0 flex items-start justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2">
                    {r.status === 'passed' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100">{r.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 font-mono">
                          {r.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">{r.details}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0 font-mono">{r.durationMs}ms</span>
                </div>
              ))}
            </div>

            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={runTests} className="text-xs">
                <RefreshCw className="w-3 h-3 mr-1" /> Re-ejecutar
              </Button>
              <Button variant="primary" size="sm" onClick={onClose} className="text-xs">
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
