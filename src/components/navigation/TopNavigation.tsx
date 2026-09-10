/**
 * FitAdapt - Barra de Navegación Superior Responsive
 * FASE 2 y FASE 10: Sistema Visual, UI/UX, Accesibilidad y Adaptabilidad Móvil
 */

import React, { useState } from 'react';
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
  Menu,
  X,
  FileText,
  Lock,
} from 'lucide-react';
import { AppView } from '../../types/navigation';
import { useTheme } from '../../context/ThemeContext';
import { PWAInstallPrompt } from '../pwa/PWAInstallPrompt';

export interface TopNavigationProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
  userName?: string;
  onOpenLegal?: () => void;
}

export function TopNavigation({
  activeView,
  onViewChange,
  userName = 'Ana',
  onOpenLegal,
}: TopNavigationProps) {
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'HOME', label: 'Inicio', icon: <Home className="w-4 h-4" /> },
    { id: 'PLAN', label: 'Mi Plan', icon: <Calendar className="w-4 h-4" /> },
    { id: 'WORKOUT', label: 'Ejercicios', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'PROGRESS', label: 'Progreso', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'PROFILE', label: 'Perfil', icon: <User className="w-4 h-4" /> },
  ];

  const handleNavigate = (view: AppView) => {
    onViewChange(view);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="top-navigation-bar"
      className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md transition-colors"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* Logo y Marca Adaptativa */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => handleNavigate('HOME')}
              className="flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer focus-visible:outline-none"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-teal-700 to-emerald-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Activity className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-black tracking-tight text-zinc-900 dark:text-zinc-50 leading-none block">
                  Fit<span className="text-teal-600 dark:text-teal-400">Adapt</span>
                </span>
                <span className="hidden sm:block text-[10px] font-medium text-zinc-400 tracking-wider uppercase">
                  Wellness & Tech
                </span>
              </div>
            </button>

            {/* Badge de Fase (visible solo en pantallas grandes para no estorbar en móviles/tablets) */}
            <span className="hidden xl:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
              FASE 10: PWA & PRODUCCIÓN
            </span>
          </div>

          {/* Enlaces de Navegación para Desktop (Oculto en móvil y tablet pequeña) */}
          <nav
            aria-label="Navegación principal de escritorio"
            className="hidden lg:flex items-center gap-1 bg-zinc-100/70 dark:bg-zinc-800/60 p-1 rounded-xl"
          >
            {navLinks.map((item) => {
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-desktop-${item.id.toLowerCase()}`}
                  onClick={() => handleNavigate(item.id)}
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

          {/* Herramientas de la Barra Superior */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Botón PWA Install Prompt */}
            <PWAInstallPrompt variant="header" />

            {/* Botón FitAdapt AI (Texto visible en tablet/desktop, icono compacto en móvil) */}
            <button
              id="btn-open-assistant"
              onClick={() => handleNavigate('ASSISTANT')}
              title="Abrir Asistente FitAdapt AI"
              className={`flex items-center justify-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer min-h-[38px] ${
                activeView === 'ASSISTANT'
                  ? 'border-teal-500 bg-teal-500 text-zinc-950 shadow-xs'
                  : 'border-teal-300/80 dark:border-teal-800/80 bg-teal-500/10 text-teal-700 dark:text-teal-300 hover:bg-teal-500/20'
              }`}
            >
              <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
              <span className="hidden sm:inline">FitAdapt AI</span>
            </button>

            {/* Botón Onboarding (Visible en desktop lg+) */}
            <button
              id="btn-open-onboarding"
              onClick={() => handleNavigate('ONBOARDING')}
              title="Abrir Asistente de Configuración Inicial (10 Pasos)"
              className={`hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[38px] ${
                activeView === 'ONBOARDING'
                  ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                  : 'border-teal-200/80 dark:border-teal-850 bg-teal-50/50 dark:bg-teal-950/30 text-teal-700 dark:text-teal-300 hover:bg-teal-100/70'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span className="hidden xl:inline">Onboarding</span>
            </button>

            {/* Botón Consola Fase 1 (Visible en desktop lg+) */}
            <button
              id="btn-toggle-arch-inspector"
              onClick={() =>
                handleNavigate(activeView === 'ARCH_INSPECTOR' ? 'HOME' : 'ARCH_INSPECTOR')
              }
              title="Consola de Arquitectura (Fase 1)"
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer min-h-[38px] ${
                activeView === 'ARCH_INSPECTOR'
                  ? 'border-emerald-600 bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden xl:inline">
                {activeView === 'ARCH_INSPECTOR' ? 'Ver UI App' : 'Consola'}
              </span>
            </button>

            {/* Alternador Modo Claro / Oscuro */}
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

            {/* Avatar del Usuario */}
            <button
              id="btn-user-profile-header"
              onClick={() => handleNavigate('PROFILE')}
              className="flex items-center gap-2 pl-1.5 sm:pl-2 pr-2 sm:pr-2.5 py-1 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer min-h-[38px]"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {userName.charAt(0)}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-zinc-700 dark:text-zinc-300 max-w-[80px] truncate">
                {userName}
              </span>
            </button>

            {/* Botón Menú Móvil / Hamburguesa (solo pantallas < lg) */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de opciones'}
              className="lg:hidden p-2 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer min-h-[38px] min-w-[38px] flex items-center justify-center"
            >
              {mobileMenuOpen ? (
                <X className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              ) : (
                <Menu className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil / Tablet (< lg) */}
      {mobileMenuOpen && (
        <div
          id="mobile-navigation-drawer"
          className="lg:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl px-4 py-4 space-y-3 shadow-lg animate-fadeIn"
        >
          {/* Enlaces de Vistas Rápidas */}
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            {navLinks.map((link) => {
              const isActive = activeView === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer text-left ${
                    isActive
                      ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  <span className={isActive ? 'text-teal-600 dark:text-teal-400' : 'text-zinc-400'}>
                    {link.icon}
                  </span>
                  <span>{link.label}</span>
                </button>
              );
            })}
          </div>

          {/* Acciones Especiales */}
          <div className="space-y-1.5">
            <button
              onClick={() => handleNavigate('ONBOARDING')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-teal-800 dark:text-teal-200 bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>Reconfigurar Onboarding (10 Pasos)</span>
              </div>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase">Ajustar</span>
            </button>

            <button
              onClick={() => handleNavigate('ARCH_INSPECTOR')}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-zinc-500" />
                <span>Consola de Arquitectura (Fase 1)</span>
              </div>
              <span className="text-[10px] text-zinc-400 uppercase">Dev</span>
            </button>

            {onOpenLegal && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLegal();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Políticas de Privacidad y Marco Legal</span>
                </div>
                <Lock className="w-3.5 h-3.5 text-zinc-400" />
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-zinc-200/60 dark:border-zinc-800/60 flex flex-col gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <div className="flex items-center justify-between">
              <span>FitAdapt · Versión 1.0.0 PWA</span>
              <span className="font-mono text-teal-600 dark:text-teal-400 font-semibold">Local-First</span>
            </div>
            <div>
              <span>Autoría y derechos: </span>
              <a
                href="https://yordevctg17.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-0.5"
              >
                Yordev
              </a>
              <span> - Yorleidys Ruiz</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
