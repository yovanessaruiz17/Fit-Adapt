/**
 * FitAdapt - Barra de Navegación Superior Responsive
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import {
  Activity,
  Sun,
  Moon,
  ShieldCheck,
  Home,
  Calendar,
  Dumbbell,
  TrendingUp,
  User,
  Sliders,
  Sparkles,
  Bot,
} from 'lucide-react';
import { AppView } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../ui/Button';

export interface TopNavigationProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  userName?: string;
}

export function TopNavigation({
  activeView,
  onViewChange,
  userName = 'Ana',
}: TopNavigationProps) {
  const { isDark, toggleTheme } = useTheme();

  const navLinks: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'HOME', label: 'Inicio', icon: <Home className="w-4 h-4" /> },
    { id: 'PLAN', label: 'Mi Plan', icon: <Calendar className="w-4 h-4" /> },
    { id: 'WORKOUT', label: 'Ejercicios', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'PROGRESS', label: 'Progreso', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'PROFILE', label: 'Perfil', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <header
      id="top-navigation-bar"
      className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Marca */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onViewChange('HOME')}
              className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <Activity className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none block">
                  Fit<span className="text-teal-600 dark:text-teal-400">Adapt</span>
                </span>
                <span className="text-[10px] font-medium text-zinc-400 tracking-wider uppercase block">
                  Wellness & Tech
                </span>
              </div>
            </button>

            {/* Selector de fase informativa */}
            <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              FASE 9: FITADAPT AI
            </span>
          </div>

          {/* Enlaces de Navegación para Desktop */}
          <nav
            aria-label="Navegación principal de escritorio"
            className="hidden md:flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/60 p-1 rounded-xl"
          >
            {navLinks.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-desktop-${item.id.toLowerCase()}`}
                  onClick={() => onViewChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer select-none ${
                    isActive
                      ? 'bg-white dark:bg-zinc-900 text-teal-700 dark:text-teal-300 shadow-xs'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Herramientas derechas: Toggle Dark Mode + Botón Inspector Fase 1 + Perfil */}
          <div className="flex items-center gap-2">
            {/* Botón FitAdapt AI (Fase 9) */}
            <button
              id="btn-open-assistant"
              onClick={() => onViewChange('ASSISTANT')}
              title="Abrir Asistente Contextual FitAdapt AI"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[38px] ${
                activeView === 'ASSISTANT'
                  ? 'border-teal-500 bg-teal-500 text-zinc-950 shadow-xs'
                  : 'border-teal-300 dark:border-teal-800 bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20'
              }`}
            >
              <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>FitAdapt AI</span>
            </button>

            {/* Botón Asistente Onboarding (Fase 3) */}
            <button
              id="btn-open-onboarding"
              onClick={() => onViewChange('ONBOARDING')}
              title="Abrir Asistente de Configuración Inicial (10 Pasos)"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[38px] ${
                activeView === 'ONBOARDING'
                  ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                  : 'border-teal-200/80 dark:border-teal-850 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden md:inline">Onboarding</span>
            </button>

            {/* Botón de inspección de arquitectura (Consola Fase 1) */}
            <button
              id="btn-toggle-arch-inspector"
              onClick={() =>
                onViewChange(activeView === 'ARCH_INSPECTOR' ? 'HOME' : 'ARCH_INSPECTOR')
              }
              title="Alternar entre interfaz de usuario y consola arquitectónica"
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[38px] ${
                activeView === 'ARCH_INSPECTOR'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden lg:inline">
                {activeView === 'ARCH_INSPECTOR' ? 'Ver UI App' : 'Consola Fase 1'}
              </span>
            </button>

            {/* Alternador Light / Dark Mode */}
            <button
              id="btn-toggle-theme"
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-zinc-700" />
              )}
            </button>

            {/* Avatar / Chip del Usuario */}
            <button
              onClick={() => onViewChange('PROFILE')}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer min-h-[38px]"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {userName.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                {userName}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
