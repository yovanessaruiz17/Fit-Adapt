/**
 * FitAdapt - Modal de la Suite de Pruebas FASE 7
 * 
 * Permite ejecutar y auditar en vivo los 11 escenarios de entrenamiento activo y calendario.
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCw,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  ActiveWorkoutTestSuite,
  ActiveWorkoutTestSuiteReport,
  ActiveWorkoutTestCaseResult,
} from '../../core/active/activeWorkoutTests';

export interface Phase7TestSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Phase7TestSuiteModal({ isOpen, onClose }: Phase7TestSuiteModalProps) {
  const [report, setReport] = useState<ActiveWorkoutTestSuiteReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const result = ActiveWorkoutTestSuite.runAll();
      setReport(result);
      setIsRunning(false);
    }, 150);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Suite de Verificación FASE 7 (11 Escenarios)"
      maxWidth="xl"
    >
      <div id="phase7-test-suite-modal" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
          <div>
            <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Validación de Entrenamiento Activo y Calendario
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Ejecuta los 11 escenarios: inicio, temporizador, pausas, series, saltos, abandono, finalización, recuperación local y cambio de día.
            </p>
          </div>

          <Button
            id="btn-run-phase7-tests"
            variant="primary"
            size="sm"
            onClick={handleRunTests}
            disabled={isRunning}
            className="shrink-0"
          >
            {isRunning ? (
              <>
                <RotateCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Ejecutando...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                Ejecutar 11 Tests
              </>
            )}
          </Button>
        </div>

        {report && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">
                  Total Tests
                </span>
                <p className="text-lg font-black text-zinc-900 dark:text-zinc-100 mt-0.5">
                  {report.totalTests}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-center">
                <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                  Aprobados
                </span>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {report.passedTests}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">
                  Fallidos
                </span>
                <p className={`text-lg font-black mt-0.5 ${report.failedTests === 0 ? 'text-zinc-500' : 'text-rose-600'}`}>
                  {report.failedTests}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-center">
                <span className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">
                  Tiempo Total
                </span>
                <p className="text-lg font-black text-teal-600 dark:text-teal-400 mt-0.5">
                  {report.totalDurationMs} ms
                </p>
              </div>
            </div>

            <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
              {report.results.map((t) => {
                const isExpanded = expandedTestId === t.id;
                return (
                  <div
                    key={t.id}
                    className={`rounded-xl border transition-all text-xs ${
                      t.passed
                        ? 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
                        : 'border-rose-300 dark:border-rose-800 bg-rose-50/40 dark:bg-rose-950/20'
                    }`}
                  >
                    <div
                      onClick={() => setExpandedTestId(isExpanded ? null : t.id)}
                      className="p-3 flex items-center justify-between gap-2 cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-2.5">
                        {t.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                        )}
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">
                          {t.number}. {t.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-400">{t.executionTimeMs} ms</span>
                        <Badge variant={t.passed ? 'emerald' : 'danger'}>
                          {t.passed ? 'PASSED' : 'FAILED'}
                        </Badge>
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-3.5 pb-3 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 space-y-2 animate-fadeIn">
                        <p className="text-zinc-500 dark:text-zinc-400 text-[11px]">
                          {t.description}
                        </p>
                        <div className="space-y-1">
                          <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                            Aserciones:
                          </span>
                          <ul className="space-y-1">
                            {t.assertions.map((a, i) => (
                              <li key={i} className="flex items-center gap-2">
                                {a.passed ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                                ) : (
                                  <XCircle className="w-3 h-3 text-rose-500 shrink-0" />
                                )}
                                <span className={a.passed ? 'text-zinc-700 dark:text-zinc-300' : 'text-rose-700 font-semibold'}>
                                  {a.name}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {!report && (
          <div className="py-8 text-center text-zinc-500 dark:text-zinc-400 text-xs">
            Haz clic en <strong>"Ejecutar 11 Tests"</strong> para validar en tiempo real los flujos de entrenamiento activo, persistencia y calendario.
          </div>
        )}

        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
