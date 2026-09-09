/**
 * FitAdapt AI - Interfaz de Chat Moderna
 * FASE 9: Asistente Contextual FitAdapt AI
 * 
 * Características:
 * - Historial conversacional con burbujas de usuario y asistente
 * - Indicador de estado (Conectado / Motor Local Resiliente)
 * - Tarjetas interactivas de acción con botón "Aplicar cambio a mi rutina"
 * - Sugerencias rápidas ("Explícame mi rutina", "¿Cómo hago este ejercicio?", "Busca una alternativa", "Haz mi rutina más corta", "¿Cómo voy esta semana?")
 * - Alertas diferenciadas para advertencias de seguridad médica
 * - Estados de carga reactiva, manejo de errores y botón de reintento
 * - Acceso a modal de Privacidad y modal de Pruebas Automatizadas
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCw,
  AlertCircle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Lock,
  TestTube,
  ArrowRight,
  Clock,
  Sliders,
  Dumbbell,
  X,
  Minimize2,
  Maximize2,
} from 'lucide-react';
import { UserProfile } from '../../types/user';
import { Workout } from '../../types/workout';
import { AIChatMessage, AIActionPayload } from '../../core/ai/types';
import { FitAdaptAIService } from '../../core/ai/aiService';
import { AIPrivacyModal } from './AIPrivacyModal';
import { AITestSuiteModal } from './AITestSuiteModal';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export interface FitAdaptAIChatProps {
  user: UserProfile;
  workout?: Workout | null;
  onApplyWorkoutChange?: (action: AIActionPayload) => void;
  onClose?: () => void;
  isFloatingDrawer?: boolean;
}

export function FitAdaptAIChat({
  user,
  workout,
  onApplyWorkoutChange,
  onClose,
  isFloatingDrawer = false,
}: FitAdaptAIChatProps) {
  const [messages, setMessages] = useState<AIChatMessage[]>(() => FitAdaptAIService.loadHistory());
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState<string | null>(null);
  const [appliedActions, setAppliedActions] = useState<Set<string>>(new Set());

  // Modales
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTestSuiteOpen, setIsTestSuiteOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    FitAdaptAIService.saveHistory(messages);
  }, [messages]);

  // Sugerencias rápidas requeridas
  const QUICK_SUGGESTIONS = [
    'Explícame mi rutina',
    '¿Cómo hago este ejercicio?',
    'Busca una alternativa',
    'Haz mi rutina más corta',
    '¿Cómo voy esta semana?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMessage: AIChatMessage = {
      id: `user-msg-${Date.now()}`,
      role: 'user',
      content: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setLastFailedQuery(null);

    try {
      const response = await FitAdaptAIService.sendMessage(
        query,
        user,
        workout,
        [...messages, userMessage]
      );
      setMessages((prev) => [...prev, response]);
    } catch (err: any) {
      setLastFailedQuery(query);
      const errorMessage: AIChatMessage = {
        id: `err-msg-${Date.now()}`,
        role: 'assistant',
        content:
          'Ha ocurrido una dificultad al procesar tu mensaje. Puedes presionar "Reintentar" o reformular tu pregunta.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isFallback: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedQuery) {
      handleSendMessage(lastFailedQuery);
    }
  };

  const handleClearChat = () => {
    FitAdaptAIService.clearHistory();
    setMessages([
      {
        id: `welcome-new-${Date.now()}`,
        role: 'assistant',
        content:
          'Conversación restablecida. Soy **FitAdapt AI**, listo para responder dudas de técnica, alternativas articulares, modificaciones de tiempo o interpretación de progreso.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleExecuteAction = (action: AIActionPayload, messageId: string) => {
    if (onApplyWorkoutChange) {
      onApplyWorkoutChange(action);
      setAppliedActions((prev) => new Set(prev).add(messageId));
    }
  };

  return (
    <div
      id="fitadapt-ai-chat-card"
      className={`flex flex-col bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden ${
        isFloatingDrawer
          ? 'fixed bottom-4 right-4 z-50 w-[95vw] sm:w-[460px] h-[640px] max-h-[85vh] rounded-3xl'
          : 'w-full h-[680px] rounded-3xl'
      }`}
    >
      {/* Cabecera del Asistente */}
      <div className="px-4 py-3.5 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900/80 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center font-bold shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-zinc-900 dark:text-zinc-100">
                FitAdapt AI
              </h3>
              <Badge variant="teal">Capa Asistiva</Badge>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Conectado • Respaldo por Compatibility Engine
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Botón de Pruebas Automatizadas */}
          <button
            onClick={() => setIsTestSuiteOpen(true)}
            title="Suite de Verificación (11 Pruebas)"
            className="p-2 rounded-xl text-zinc-500 hover:text-teal-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <TestTube className="w-4 h-4" />
          </button>

          {/* Botón de Privacidad */}
          <button
            onClick={() => setIsPrivacyModalOpen(true)}
            title="Configurar Privacidad de Contexto"
            className="p-2 rounded-xl text-zinc-500 hover:text-teal-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Botón de Limpiar Conversación */}
          <button
            onClick={handleClearChat}
            title="Limpiar chat"
            className="p-2 rounded-xl text-zinc-500 hover:text-rose-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          {/* Botón de Cerrar si está en modo drawer */}
          {onClose && (
            <button
              onClick={onClose}
              title="Cerrar chat"
              className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Sugerencias Rápidas Requeridas */}
      <div className="px-3 py-2 bg-zinc-100/70 dark:bg-zinc-800/40 border-b border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 pl-1 shrink-0">
          Sugerencias:
        </span>
        {QUICK_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSendMessage(suggestion)}
            disabled={isLoading}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:border-teal-500 hover:text-teal-600 dark:hover:text-teal-400 text-xs font-medium whitespace-nowrap transition-colors shadow-2xs shrink-0"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {/* Lista de Mensajes */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const isMedical = msg.isMedicalWarning;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              {!isUser && (
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs ${
                    isMedical
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                      : 'bg-teal-500 text-zinc-950 shadow-xs'
                  }`}
                >
                  {isMedical ? <ShieldAlert className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                  isUser
                    ? 'bg-teal-600 text-white rounded-tr-xs font-medium shadow-xs'
                    : isMedical
                    ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200 rounded-tl-xs'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-tl-xs border border-zinc-200/70 dark:border-zinc-700/60'
                }`}
              >
                {/* Texto del mensaje formateado */}
                <div className="whitespace-pre-line space-y-1">
                  {msg.content}
                </div>

                {/* Tarjeta de Acción Estructurada (si aplica) */}
                {msg.actionPayload && msg.actionPayload.type !== 'NONE' && msg.actionPayload.type !== 'MEDICAL_DISCLAIMER' && (
                  <div className="mt-3 pt-3 border-t border-zinc-200/80 dark:border-zinc-700/80 space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-teal-700 dark:text-teal-300">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Acción Sugerida por FitAdapt AI</span>
                    </div>

                    {msg.actionPayload.alternative && (
                      <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-teal-200 dark:border-teal-800/80 space-y-1 text-[11px]">
                        <div className="flex items-center justify-between font-bold text-zinc-900 dark:text-zinc-100">
                          <span>{msg.actionPayload.alternative.exerciseName}</span>
                          <Badge variant="teal">Sustituto Válido</Badge>
                        </div>
                        <p className="text-zinc-500 dark:text-zinc-400">
                          {msg.actionPayload.alternative.reason}
                        </p>
                      </div>
                    )}

                    {onApplyWorkoutChange && (
                      <Button
                        variant="primary"
                        size="sm"
                        disabled={appliedActions.has(msg.id)}
                        onClick={() => handleExecuteAction(msg.actionPayload!, msg.id)}
                        className="w-full text-xs font-bold justify-center py-1.5 shadow-xs"
                      >
                        {appliedActions.has(msg.id) ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 mr-1.5" />
                            Cambio aplicado a tu rutina
                          </>
                        ) : (
                          <>
                            Aplicar cambio a mi rutina
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                )}

                <span
                  className={`block text-[10px] mt-1.5 ${
                    isUser ? 'text-teal-100' : 'text-zinc-400'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {/* Indicador de Carga */}
        {isLoading && (
          <div className="flex gap-3 justify-start animate-fadeIn">
            <div className="w-8 h-8 rounded-xl bg-teal-500 text-zinc-950 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs shadow-xs">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-xs p-3.5 text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-2 border border-zinc-200/70 dark:border-zinc-700/60">
              <RotateCw className="w-3.5 h-3.5 animate-spin text-teal-600" />
              <span>FitAdapt AI está consultando el Compatibility Engine...</span>
            </div>
          </div>
        )}

        {/* Botón de Reintentar en caso de fallo */}
        {lastFailedQuery && !isLoading && (
          <div className="flex justify-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="text-xs text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" />
              Reintentar última consulta
            </Button>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Barra Inferior de Entrada */}
      <div className="p-3 border-t border-zinc-200/80 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-900 shrink-0">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Pregúntale a FitAdapt AI (ej. 'Busca alternativa', 'Técnica')..."
            disabled={isLoading}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 text-xs focus:outline-hidden focus:border-teal-500 transition-colors"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputText.trim() || isLoading}
            className="h-9 px-3.5 font-bold shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-[10px] text-zinc-400 text-center mt-2">
          FitAdapt AI no diagnostica ni reemplaza a profesionales de la salud. Respaldada por Compatibility Engine.
        </p>
      </div>

      {/* Modales Complementarios */}
      <AIPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      <AITestSuiteModal
        isOpen={isTestSuiteOpen}
        onClose={() => setIsTestSuiteOpen(false)}
      />
    </div>
  );
}
