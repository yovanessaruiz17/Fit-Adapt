/**
 * FitAdapt - Modal de Pruebas Automatizadas FASE 8
 * Sistema de Progreso Personal, Métricas y Logros
 */

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { ProgressTestSuite, ProgressTestSuiteReport } from '../../core/progress/progressTests';
import { CheckCircle2, XCircle, Play, RotateCw, TestTube, Sparkles } from 'lucide-react';

export interface Phase8TestSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Phase8TestSuiteModal({ isOpen, onClose }: Phase8TestSuiteModalProps) {
  const [report, setReport] = useState<ProgressTestSuiteReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = ProgressTestSuite.runAll();
      setReport(res);
      setIsRunning(false);
    }, 150);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Suite de Validación: FASE 8 (Progreso y Métricas)"
      maxWidth="xl"
    >
      <div className="space-y-4 text-xs">
        {/* Encabezado descriptivo */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                11 Pruebas Críticas de la FASE 8
              </span>
              <Badge variant="teal">FASE 8</Badge>
            </div>
            <p className="text-zinc-500 text-[11px] mt-0.5">
              Verifica registro de peso, edición/borrado, cálculo de racha, gráficos (0/1/N datos), medidas y logros.
            </p>
          </div>

          <Button
            variant="primary"
            size="sm"
            onClick={handleRunTests}
            disabled={isRunning}
            className="shrink-0 font-bold"
          >
            {isRunning ? (
              <>
                <RotateCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Ejecutando...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Ejecutar suite (11)
              </>
            )}
          </Button>
        </div>

        {/* Resumen del reporte si ya se ejecutó */}
        {report && (
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 animate-fadeIn ${
              report.failedTests === 0
                ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                : 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {report.failedTests === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              )}
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {report.failedTests === 0
                    ? 'Todos los tests superados con éxito'
                    : `${report.failedTests} pruebas fallaron`}
                </span>
                <span className="text-[11px] text-zinc-500 block">
                  {report.passedTests} de {report.totalTests} pasados en {report.executionTimeMs} ms
                </span>
              </div>
            </div>

            <span className="text-xs font-mono font-bold px-2 py-1 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              {report.passedTests}/{report.totalTests} PASSED
            </span>
          </div>
        )}

        {/* Lista de resultados de cada test */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {report ? (
            report.results.map((test) => (
              <div
                key={test.id}
                className="p-3 rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {test.passed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                    )}
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {test.name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-400">({test.id})</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      test.passed
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {test.passed ? 'PASSED' : 'FAILED'}
                  </span>
                </div>

                <p className="text-zinc-500 text-[11px] pl-6">{test.description}</p>

                <div className="text-[11px] font-mono pl-6 text-zinc-700 dark:text-zinc-300 pt-0.5">
                  &gt; {test.details}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-zinc-400">
              <TestTube className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>Pulsa "Ejecutar suite" para validar los 11 escenarios de progreso.</p>
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
