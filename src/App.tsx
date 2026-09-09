/**
 * FitAdapt - Aplicación Principal
 * FASE 2: Sistema Visual y UI/UX
 * 
 * Integra:
 * - ThemeProvider (Light / Dark mode reactivo)
 * - TopNavigation (Desktop & Header)
 * - BottomNavigation (Mobile First)
 * - 5 Vistas Principales: HOME, PLAN, WORKOUT, PROGRESS, PROFILE
 * - Consola Arquitectónica de FASE 1 preservada íntegramente en modo ARCH_INSPECTOR
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { TopNavigation } from './components/navigation/TopNavigation';
import { BottomNavigation } from './components/navigation/BottomNavigation';
import { HomeView } from './views/HomeView';
import { PlanView } from './views/PlanView';
import { WorkoutView } from './views/WorkoutView';
import { ProgressView } from './views/ProgressView';
import { ProfileView } from './views/ProfileView';
import { AssistantView } from './views/AssistantView';
import { AppView } from './types/navigation';
import { SAMPLE_USER_PROFILES, SAMPLE_PROFILES } from './data/sampleProfiles';
import { UserProfile } from './types/user';
import { Workout, ActiveWorkoutState } from './types/workout';
import { WorkoutGenerator } from './core/generator/workoutGenerator';
import { SessionStorageManager } from './core/session/sessionStorage';
import { ActiveWorkoutModal } from './components/active/ActiveWorkoutModal';
import { Modal } from './components/ui/Modal';
import { Button } from './components/ui/Button';
import { Play, Sparkles, ShieldCheck, HeartPulse, ShieldAlert } from 'lucide-react';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { OfflineBanner } from './components/pwa/OfflineBanner';
import { PWAUpdateToast } from './components/pwa/PWAUpdateToast';
import { LegalModal } from './components/legal/LegalModal';
import { SyncManager } from './core/sync/syncManager';
import { AnalyticsService } from './core/analytics/analytics';

// Onboarding FASE 3 y FASE 10
import { OnboardingWizard } from './components/onboarding/OnboardingWizard';
import {
  loadUserProfileFromStorage,
  saveUserProfileToStorage,
  hasUserCompletedOnboarding,
  markOnboardingCompleted,
} from './utils/onboardingUtils';

// Componentes de la Consola de Arquitectura (FASE 1)
import { ArchitectureHeader } from './components/ArchitectureHeader';
import { SafetyPrinciplesBanner } from './components/SafetyPrinciplesBanner';
import { ExerciseLibraryExplorer } from './components/ExerciseLibraryExplorer';
import { CompatibilityVerifier } from './components/CompatibilityVerifier';
import { DataModelExplorer } from './components/DataModelExplorer';
import { PhaseRoadmapViewer } from './components/PhaseRoadmapViewer';

function FitAdaptApp() {
  // Comprobar si el usuario ya ha completado el onboarding inicial
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(() => {
    return hasUserCompletedOnboarding();
  });

  // Estado de navegación activa: si es su primera vez, entra obligatoriamente a ONBOARDING
  const [activeView, setActiveView] = useState<AppView>(() => {
    const isCompleted = hasUserCompletedOnboarding();
    return isCompleted ? 'HOME' : 'ONBOARDING';
  });

  // Estado del perfil activo (cargado desde localStorage si existe, o perfil de muestra si ya completó)
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = loadUserProfileFromStorage();
    if (saved) return saved;
    return SAMPLE_USER_PROFILES.profileKneeSensitivity || SAMPLE_PROFILES[0];
  });

  // Guardar perfil cuando se actualiza y recalcular rutina reactivamente
  const handleUpdateUser = (updated: UserProfile) => {
    setCurrentUser(updated);
    saveUserProfileToStorage(updated);
    try {
      const generated = WorkoutGenerator.generate({
        userProfile: updated,
        seed: Date.now(),
      }).workout;
      setActiveWorkout(generated);
    } catch (e) {
      console.warn('Error al recalcular rutina adaptada:', e);
    }
  };

  // Rutina activa gestionada reactivamente (permite aplicar ajustes y alternativas desde FitAdapt AI)
  const [activeWorkout, setActiveWorkout] = useState<Workout>(() => {
    return WorkoutGenerator.generate({
      userProfile: currentUser,
      seed: 1,
    }).workout;
  });

  // Modal para acción de "Comenzar Entrenamiento"
  const [showWorkoutModal, setShowWorkoutModal] = useState(false);

  // Estado recuperable de sesión activa si se cerró la aplicación accidentalmente (FASE 7)
  const [recoveredActiveState, setRecoveredActiveState] = useState<ActiveWorkoutState | null>(() => {
    return SessionStorageManager.getActiveState();
  });
  const [isRecoveryActiveModalOpen, setIsRecoveryActiveModalOpen] = useState(false);
  const [showLegalModal, setShowLegalModal] = useState(false);

  // Inicializar sincronizador de fondo para modo offline (FASE 10)
  React.useEffect(() => {
    SyncManager.init();
  }, []);

  // Si está en Onboarding, renderizar experiencia guiada inmersiva
  if (activeView === 'ONBOARDING') {
    return (
      <OnboardingWizard
        initialProfile={hasCompletedOnboarding ? currentUser : undefined}
        isFirstTime={!hasCompletedOnboarding}
        onComplete={(newProfile) => {
          handleUpdateUser(newProfile);
          markOnboardingCompleted();
          setHasCompletedOnboarding(true);
          AnalyticsService.logEvent('onboarding_completed', { goal: newProfile.primaryGoal });
          setActiveView('HOME');
        }}
        onCancel={hasCompletedOnboarding ? () => setActiveView('HOME') : undefined}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors">
      {/* Barra de Navegación Superior Responsive */}
      <TopNavigation
        activeView={activeView}
        onViewChange={setActiveView}
        userName={currentUser?.name || 'Ana'}
        onOpenLegal={() => setShowLegalModal(true)}
      />

      {/* Contenido Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 mb-16 md:mb-0">
        {/* Banner de Estado de Conectividad Offline / Online (FASE 10) */}
        <OfflineBanner />

        {/* Notificación de Actualización PWA Disponible */}
        <PWAUpdateToast />

        {/* Banner de Recuperación de Sesión Activa Accidentalmente Interrumpida (FASE 7) */}
        {recoveredActiveState && (
          <div
            id="recovered-session-banner"
            className="mb-6 p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/50 border border-teal-300 dark:border-teal-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500 text-zinc-950 flex items-center justify-center shrink-0 font-bold shadow-xs">
                <Play className="w-5 h-5 fill-current" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-teal-800 dark:text-teal-300">
                    Sesión Recuperada en Curso
                  </span>
                  <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 truncate max-w-[200px] sm:max-w-xs">
                    • {recoveredActiveState.workout?.title || 'Rutina FitAdapt'}
                  </span>
                </div>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Tiempo acumulado: {Math.max(1, Math.round(recoveredActiveState.elapsedSeconds / 60))} min • Serie {recoveredActiveState.currentSetIndex} del ejercicio {recoveredActiveState.currentExerciseIndex + 1}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  SessionStorageManager.clearActiveState();
                  setRecoveredActiveState(null);
                }}
                className="text-xs text-zinc-500 hover:text-rose-600"
              >
                Descartar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsRecoveryActiveModalOpen(true)}
                className="text-xs font-bold shadow-sm"
              >
                Reanudar sesión
              </Button>
            </div>
          </div>
        )}

        {/* Modal para reanudar sesión recuperada */}
        {isRecoveryActiveModalOpen && recoveredActiveState && (
          <ActiveWorkoutModal
            isOpen={isRecoveryActiveModalOpen}
            onClose={() => {
              setIsRecoveryActiveModalOpen(false);
              setRecoveredActiveState(null);
            }}
            workout={recoveredActiveState.workout}
            user={currentUser}
            initialStateToResume={recoveredActiveState}
          />
        )}

        {/* Renderizado Condicional de Vistas */}
        {activeView === 'HOME' && (
          <HomeView
            user={currentUser}
            onNavigate={setActiveView}
            onStartWorkout={() => setActiveView('WORKOUT')}
          />
        )}

        {activeView === 'PLAN' && (
          <PlanView
            user={currentUser}
            onStartWorkout={() => setActiveView('WORKOUT')}
          />
        )}

        {activeView === 'WORKOUT' && (
          <WorkoutView
            user={currentUser}
            activeWorkout={activeWorkout}
            onWorkoutChange={setActiveWorkout}
            onConsultAI={() => setActiveView('ASSISTANT')}
          />
        )}

        {activeView === 'ASSISTANT' && (
          <AssistantView
            user={currentUser}
            activeWorkout={activeWorkout}
            onApplyWorkoutChange={(newWorkout) => {
              setActiveWorkout(newWorkout);
            }}
            onNavigate={setActiveView}
          />
        )}

        {activeView === 'PROGRESS' && <ProgressView user={currentUser} />}

        {activeView === 'PROFILE' && (
          <ProfileView
            user={currentUser}
            onUpdateUser={handleUpdateUser}
            onOpenArchInspector={() => setActiveView('ARCH_INSPECTOR')}
            onOpenOnboarding={() => setActiveView('ONBOARDING')}
          />
        )}

        {/* Consola de Arquitectura Fase 1 (Preservación estricta de continuidad) */}
        {activeView === 'ARCH_INSPECTOR' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wide">
                  Herramienta de Auditoría y Verificación
                </span>
                <h2 className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                  Consola de Arquitectura (Fase 1)
                </h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Inspección técnica del motor de compatibilidad determinista y modelos base.
                </p>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => setActiveView('HOME')}
              >
                Volver a la App UI
              </Button>
            </div>

            <ArchitectureHeader currentPhase={6} totalPhases={10} />
            <SafetyPrinciplesBanner />
            <ExerciseLibraryExplorer />
            <CompatibilityVerifier />
            <DataModelExplorer />
            <PhaseRoadmapViewer />
          </div>
        )}
      </main>

      {/* Navegación Inferior Móvil (Mobile-First) */}
      <BottomNavigation activeView={activeView} onViewChange={setActiveView} />

      {/* Modal Informativo al Iniciar Entrenamiento */}
      <Modal
        isOpen={showWorkoutModal}
        onClose={() => setShowWorkoutModal(false)}
        title="Sesión del Día: Tren Inferior & Core"
        description="Adaptada específicamente para protección articular en rodillas"
        footer={
          <Button variant="primary" size="sm" onClick={() => setShowWorkoutModal(false)}>
            Entendido
          </Button>
        }
      >
        <div className="space-y-4 py-1 text-xs">
          <div className="p-3.5 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/80 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-950 dark:text-teal-200 block text-xs">
                Modificaciones Activas por Limitación en Rodilla
              </span>
              <p className="text-teal-800 dark:text-teal-300/90 mt-0.5 leading-relaxed">
                Se han sustituido automáticamente las sentadillas con salto y zancadas profundas por sentadillas isométricas apoyadas en pared y puentes de glúteo supino.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-bold text-zinc-700 dark:text-zinc-300 block uppercase tracking-wider text-[11px]">
              Estructura de la Rutina
            </span>
            <div className="space-y-1.5 text-zinc-600 dark:text-zinc-300">
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex justify-between">
                <span>1. Movilidad de cadera y tobillos</span>
                <span className="font-mono text-zinc-400">5 min</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex justify-between">
                <span>2. Sentadilla isométrica en pared (3x30s)</span>
                <span className="font-mono text-zinc-400">5 min</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex justify-between">
                <span>3. Puente de glúteos supino (3x12 reps)</span>
                <span className="font-mono text-zinc-400">5 min</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex justify-between">
                <span>4. Plancha en antebrazos (3x30s)</span>
                <span className="font-mono text-zinc-400">5 min</span>
              </div>
              <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex justify-between">
                <span>5. Vuelta a la calma y descompresión</span>
                <span className="font-mono text-zinc-400">5 min</span>
              </div>
            </div>
          </div>

          <p className="text-zinc-400 italic text-[11px] pt-1">
            * El temporizador y registro en vivo de series activas se implementarán en la fase de entrenamiento activo.
          </p>
        </div>
      </Modal>

      {/* Footer Sutil */}
      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-900 py-4 text-xs text-zinc-500 dark:text-zinc-400 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span>FitAdapt &copy; {new Date().getFullYear()} — Fitness, Wellness & Biomecánica</span>
            <span>•</span>
            <button
              onClick={() => setShowLegalModal(true)}
              className="hover:text-teal-600 dark:hover:text-teal-400 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Aviso Médico, Privacidad y Términos
            </button>
          </div>
          <span className="text-[11px] font-mono text-teal-600 dark:text-teal-400 font-bold">
            FASE 10: PWA & PRODUCCIÓN LISTO
          </span>
        </div>
      </footer>

      {/* Modal Legal, Privacidad y Salud */}
      <LegalModal
        isOpen={showLegalModal}
        onClose={() => setShowLegalModal(false)}
        onResetAllData={() => window.location.reload()}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <FitAdaptApp />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
