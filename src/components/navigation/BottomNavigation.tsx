/**
 * FitAdapt - Barra de Navegación Inferior Móvil (Mobile-First)
 * FASE 2: Sistema Visual y UI/UX
 */

import React from 'react';
import { Home, Calendar, Dumbbell, TrendingUp, User, Bot } from 'lucide-react';
import { motion } from 'motion/react';
import { AppView } from '../../types/navigation';

export interface BottomNavigationProps {
  activeView: AppView;
  onViewChange: (view: AppView) => void;
}

export function BottomNavigation({ activeView, onViewChange }: BottomNavigationProps) {
  const tabs: { id: AppView; label: string; icon: React.ReactNode }[] = [
    { id: 'HOME', label: 'Inicio', icon: <Home className="w-5 h-5" /> },
    { id: 'PLAN', label: 'Plan', icon: <Calendar className="w-5 h-5" /> },
    { id: 'WORKOUT', label: 'Entrenar', icon: <Dumbbell className="w-5 h-5" /> },
    { id: 'ASSISTANT', label: 'AI', icon: <Bot className="w-5 h-5" /> },
    { id: 'PROGRESS', label: 'Progreso', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'PROFILE', label: 'Perfil', icon: <User className="w-5 h-5" /> },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      aria-label="Navegación inferior móvil"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-200/80 dark:border-zinc-800 pb-[env(safe-area-inset-bottom)] transition-colors"
    >
      <div className="grid grid-cols-6 h-16 max-w-md mx-auto">
        {tabs.map((tab) => {
          const isActive = activeView === tab.id;

          return (
            <button
              key={tab.id}
              id={`tab-btn-${tab.id.toLowerCase()}`}
              onClick={() => onViewChange(tab.id)}
              className="relative flex flex-col items-center justify-center min-h-[44px] cursor-pointer select-none group text-zinc-500 dark:text-zinc-400 focus-visible:outline-none"
            >
              {/* Indicador activo sutil */}
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute top-1.5 w-8 h-1 rounded-full bg-teal-600 dark:bg-teal-400"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              <div
                className={`transition-all duration-150 mt-1 ${
                  isActive
                    ? 'text-teal-600 dark:text-teal-400 scale-110'
                    : 'group-hover:text-zinc-700 dark:group-hover:text-zinc-200'
                }`}
              >
                {tab.icon}
              </div>

              <span
                className={`text-[10px] font-semibold mt-0.5 tracking-tight transition-colors ${
                  isActive
                    ? 'text-teal-700 dark:text-teal-300'
                    : 'text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
