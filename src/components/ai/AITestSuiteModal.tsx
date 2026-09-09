/**
 * FitAdapt AI - Modal de Pruebas Automatizadas de la Fase 9
 * FASE 9: Asistente Contextual FitAdapt AI
 */

import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  RotateCw,
  ShieldCheck,
  Zap,
  ChevronDown,
  ChevronUp,
  Bot,
  AlertTriangle,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { AITestSuite, AITestSuiteReport, AITestCaseResult } from '../../core/ai/aiTests';

export interface AITestSuiteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AITestSuiteModal({ isOpen, onClose }: AITestSuiteModalProps) {
  const [report, setReport] = useState<AITestSuiteReport | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      const res = AITestSuite.runAll();
      setReport(res);
      setIsRunning(false);
    }, 150);
  };

  const getCategoryBadge = (category: AITestCaseResult['category']) => {
    switch (category) {
      case 'SAFETY':
        return <Badge variant="warning">Seguridad Ética</Badge>;
      case 'ALTERNATIVES':
        return <Badge variant="teal">Alternativas</Badge>;
      case 'ADAPTATION':
        return <Badge variant="emerald">Adaptación</Badge>;
      case 'EXPLANATION':
        return <Badge variant="neutral">Explicación</Badge>;
      case 'FALLBACK':
        return <Badge variant="success">Resiliencia</Badge>;
      case 'PRIVACY':
        return <Badge variant="info">Privacidad</Badge>;
      default:
        return <Badge variant="neutral">{category}</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Suite de Verificación FitAdapt AI (11 Pruebas)"
      maxWidth="xl"
    >
      <div id="ai-test-suite-modal" className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/80">
          <div>
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
              <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Verificación Asistiva y Reglas de Compatibilidad
              </h4>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Comprueba los 11 escenarios exigidos: explicaciones, alternativas biomecánicas, cambios de duración/intensidad, rechazo de diagnóstico médico, alerta de dolor agudo, fallback offline y sanitización de privacidad.
            </p>
          </div>

          <Button
            id="btn-run-all-ai-tests"
            variant="primary"
            size="sm"
            onClick={handleRunTests}
            disabled={isRunning}
            className="shrink-0 flex items-center gap-2 font-bold"
          >
            {isRunning ? (
              <>
                <RotateCw className="w-4 h-4 animate-spin" />
                Ejecutando...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                {report ? 'Re-ejecutar Pruebas' : 'Iniciar 11 Pruebas'}
              </>
            )}
          </Button>
        </div>

        {/* Resumen de Métricas */}
        {report && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/60 text-center">
              <span className="text-2xl font-black text-teal-700 dark:text-teal-300">
                {report.passedTests} / {report.totalTests}
              </span>
              <span className="block text-[11px] font-semibold text-teal-900 dark:text-teal-200 uppercase mt-0.5">
                Pruebas Exitosas
              </span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 text-center">
              <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
                {Math.round((report.passedTests / report.totalTests) * 100)}%
              </span>
              <span className="block text-[11px] font-semibold text-emerald-900 dark:text-emerald-200 uppercase mt-0.5">
                Tasa de Aprobación
              </span>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/60 text-center">
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-100">
                {report.executionTimeMs} ms
              </span>
              <span className="block text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase mt-0.5">
                Tiempo de Ejecución
              </span>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-center">
              <span className="text-2xl font-black text-amber-700 dark:text-amber-300">
                {report.failedTests}
              </span>
              <span className="block text-[11px] font-semibold text-amber-900 dark:text-amber-200 uppercase mt-0.5">
                Fallos Detectados
              </span>
            </div>
          </div>
        )}

        {/* Listado Detallado de Pruebas */}
        {report ? (
          <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
            {report.results.map((t) => {
              const isExpanded = expandedTestId === t.id;
              return (
                <div
                  key={t.id}
                  id={`ai-test-row-${t.id}`}
                  className={`p-3.5 rounded-xl border transition-all ${
                    t.passed
                      ? 'bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700'
                  }`}
                >
                  <div
                    className="flex items-center justify-between cursor-pointer select-none"
                    onClick={() => setExpandedTestId(isExpanded ? null : t.id)}
                  >
                    <div className="flex items-center gap-2.5">
                      {t.passed ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-zinc-900 dark:text-zinc-100">
                            {t.name}
                          </span>
                          {getCategoryBadge(t.category)}
                        </div>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                          {t.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] font-mono text-zinc-400">
                        {t.durationMs} ms
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800 text-xs space-y-2 animate-fadeIn">
                      <div>
                        <span className="font-bold text-zinc-700 dark:text-zinc-300 block text-[11px] uppercase">
                          Resultado de Verificación:
                        </span>
                        <p className="text-zinc-800 dark:text-zinc-200 mt-0.5 bg-white dark:bg-zinc-950 p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 font-mono text-[11px]">
                          {t.actualSummary}
                        </p>
                      </div>

                      {t.details && (
                        <div>
                          <span className="font-bold text-zinc-700 dark:text-zinc-300 block text-[11px] uppercase">
                            Carga Útil / Datos del Motor:
                          </span>
                          <pre className="mt-1 p-2 rounded-lg bg-zinc-900 text-zinc-100 text-[10px] overflow-x-auto max-h-36 font-mono">
                            {JSON.stringify(t.details, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40">
            <ShieldCheck className="w-10 h-10 text-teal-500 mx-auto mb-2 opacity-80" />
            <h5 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
              Pruebas de Validación de FitAdapt AI
            </h5>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 max-w-md mx-auto">
              Haz clic en "Iniciar 11 Pruebas" para verificar en tiempo real que el asistente respeta las reglas de seguridad, ejecuta las herramientas internas y se apoya en el Compatibility Engine.
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}
