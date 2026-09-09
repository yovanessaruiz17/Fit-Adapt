/**
 * FitAdapt - Orquestador Principal del Asistente de Onboarding
 * FASE 3: Flujo de Onboarding y Configuración Inicial
 */

import React, { useState, useEffect } from 'react';
import { OnboardingLayout } from './OnboardingLayout';
import { Step1Welcome } from './Step1Welcome';
import { Step2BasicInfo } from './Step2BasicInfo';
import { Step3Goal } from './Step3Goal';
import { Step4Level } from './Step4Level';
import { Step5Location } from './Step5Location';
import { Step6Equipment } from './Step6Equipment';
import { Step7Availability } from './Step7Availability';
import { Step8Morphology } from './Step8Morphology';
import { Step9Limitations } from './Step9Limitations';
import { Step10Summary } from './Step10Summary';

import {
  OnboardingData,
  OnboardingStepNumber,
  BodyJointArea,
} from '../../types/onboarding';
import {
  UserProfile,
  FitnessGoal,
  FitnessLevel,
  TrainingLocation,
  AnyEquipment,
  LimitationSeverity,
  HomeEquipment,
  GymEquipment,
} from '../../types/user';
import {
  INITIAL_ONBOARDING_DATA,
  saveOnboardingDraft,
  loadOnboardingDraft,
  clearOnboardingDraft,
  saveUserProfileToStorage,
  convertOnboardingDataToProfile,
  validateOnboardingStep,
} from '../../utils/onboardingUtils';

import { LegalModal } from '../legal/LegalModal';

export interface OnboardingWizardProps {
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
  initialProfile?: UserProfile;
  isFirstTime?: boolean;
}

export function OnboardingWizard({
  onComplete,
  onCancel,
  initialProfile,
  isFirstTime = false,
}: OnboardingWizardProps) {
  // Cargar estado inicial desde borrador si existe, o prellenar con initialProfile
  const [currentStep, setCurrentStep] = useState<OnboardingStepNumber>(1);
  const [showLegalInOnboarding, setShowLegalInOnboarding] = useState(false);
  const [data, setData] = useState<OnboardingData>(() => {
    const saved = loadOnboardingDraft();
    if (saved) {
      return saved.data;
    }
    if (initialProfile && !isFirstTime) {
      return {
        ...INITIAL_ONBOARDING_DATA,
        hasAcceptedPrivacyPolicy: true,
        hasAcceptedHealthDataProcessing: true,
        hasAcceptedTerms: true,
        name: initialProfile.name || '',
        age: initialProfile.age || '',
        sex: initialProfile.sex || '',
        heightCm: initialProfile.heightCm || '',
        weightKg: initialProfile.weightKg || '',
        primaryGoal: initialProfile.primaryGoal || '',
        fitnessLevel: initialProfile.fitnessLevel || '',
        trainingLocation: initialProfile.trainingLocation || TrainingLocation.HOME,
        availableEquipment: initialProfile.availableEquipment || [],
        daysPerWeek: initialProfile.daysPerWeek || 3,
        durationMinutes: (initialProfile.availableTimeMinutes as any) || 30,
        preferredIntensity: initialProfile.preferences?.targetIntensity || 'MEDIUM',
        morphology: initialProfile.morphology || 'NONE',
        hasNoLimitations: initialProfile.limitations.length === 0,
        limitations: initialProfile.limitations.map((lim) => ({
          area: (lim.code.includes('KNEE')
            ? 'KNEE'
            : lim.code.includes('LUMBAR')
            ? 'LOWER_BACK'
            : lim.code.includes('SHOULDER')
            ? 'SHOULDER'
            : lim.code.includes('WRIST')
            ? 'WRIST'
            : 'OTHER') as BodyJointArea,
          severity: lim.severity,
          customDescription: lim.name,
        })),
        medicalClearanceAcknowledged: initialProfile.medicalSafety?.hasProfessionalMedicalClearance || false,
      };
    }
    return INITIAL_ONBOARDING_DATA;
  });

  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restaurar paso inicial si había un borrador guardado
  useEffect(() => {
    const saved = loadOnboardingDraft();
    if (saved && saved.currentStep) {
      setCurrentStep(saved.currentStep);
    }
  }, []);

  // Guardar en borrador cada vez que cambien los datos o el paso
  useEffect(() => {
    saveOnboardingDraft(data, currentStep);
  }, [data, currentStep]);

  // Manejador para avanzar de paso con validación estricta
  const handleNext = () => {
    setErrorMessage(undefined);
    const validation = validateOnboardingStep(currentStep, data);

    if (!validation.isValid) {
      setErrorMessage(validation.error);
      return;
    }

    if (currentStep < 10) {
      const nextStep = (currentStep + 1) as OnboardingStepNumber;
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Paso 10 final: Crear perfil estructurado
      setIsSubmitting(true);
      try {
        const newProfile = convertOnboardingDataToProfile(data);
        saveUserProfileToStorage(newProfile);
        clearOnboardingDraft();
        onComplete(newProfile);
      } catch (err) {
        console.error('Error al generar perfil:', err);
        setErrorMessage('Ocurrió un error al guardar tu perfil. Inténtalo de nuevo.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Manejador para retroceder de paso sin perder ningún dato
  const handlePrev = () => {
    setErrorMessage(undefined);
    if (currentStep > 1) {
      const prevStep = (currentStep - 1) as OnboardingStepNumber;
      setCurrentStep(prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Metadatos de cada paso
  const stepsMetadata: Record<
    OnboardingStepNumber,
    { title: string; subtitle: string }
  > = {
    1: {
      title: 'Bienvenido y Protección de Datos Personales',
      subtitle: 'Acepta las políticas de privacidad y autoriza el tratamiento de datos antes de ingresar tu información.',
    },
    2: {
      title: 'Información Básica',
      subtitle: 'Datos antropométricos generales para calibrar palancas y cargas de esfuerzo relativo.',
    },
    3: {
      title: 'Objetivo Principal',
      subtitle: 'Selecciona la meta motriz primordial que guiará la estructura de tus sesiones.',
    },
    4: {
      title: 'Nivel de Experiencia',
      subtitle: 'Tu historial nos permite regular la complejidad técnica y los tiempos de recuperación.',
    },
    5: {
      title: 'Lugar de Entrenamiento',
      subtitle: '¿Dónde realizarás habitualmente tus sesiones de entrenamiento?',
    },
    6: {
      title: 'Equipamiento Disponible',
      subtitle: 'Indica los elementos a los que tienes acceso en tu entorno seleccionado.',
    },
    7: {
      title: 'Disponibilidad Semanal',
      subtitle: 'Define cuántos días y cuánto tiempo real puedes dedicar a cada sesión.',
    },
    8: {
      title: 'Morfología Corporal',
      subtitle: 'Referencia visual secundaria y opcional para ajustes posturales y biomecánicos.',
    },
    9: {
      title: 'Limitaciones o Molestias Físicas',
      subtitle: 'Protegemos tus articulaciones filtrando ejercicios y aplicando variantes de bajo impacto.',
    },
    10: {
      title: 'Resumen y Confirmación',
      subtitle: 'Revisa tu perfil estructurado antes de iniciar tu experiencia en FitAdapt.',
    },
  };

  // Actualizadores específicos
  const handleUpdateBasicInfo = (fields: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...fields }));
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleSelectGoal = (goal: FitnessGoal) => {
    setData((prev) => ({ ...prev, primaryGoal: goal }));
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleSelectLevel = (level: FitnessLevel) => {
    setData((prev) => ({ ...prev, fitnessLevel: level }));
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleSelectLocation = (loc: TrainingLocation) => {
    // Si cambia de lugar, restablecer equipamiento coherente por defecto
    const defaultEquip =
      loc === TrainingLocation.HOME
        ? [HomeEquipment.NO_EQUIPMENT]
        : [GymEquipment.DUMBBELLS, GymEquipment.BENCH];
    setData((prev) => ({
      ...prev,
      trainingLocation: loc,
      availableEquipment: defaultEquip,
    }));
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleToggleEquipment = (id: AnyEquipment) => {
    setData((prev) => {
      const exists = prev.availableEquipment.includes(id);
      let updated: AnyEquipment[];
      if (exists) {
        updated = prev.availableEquipment.filter((item) => item !== id);
      } else {
        updated = [...prev.availableEquipment, id];
      }
      return { ...prev, availableEquipment: updated };
    });
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleSetEquipment = (list: AnyEquipment[]) => {
    setData((prev) => ({ ...prev, availableEquipment: list }));
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleUpdateAvailability = (fields: {
    daysPerWeek?: number;
    durationMinutes?: any;
    preferredIntensity?: any;
  }) => {
    setData((prev) => ({ ...prev, ...fields }));
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleSelectMorphology = (morph: any) => {
    setData((prev) => ({ ...prev, morphology: morph }));
    if (errorMessage) setErrorMessage(undefined);
  };

  // Limitaciones
  const handleToggleNoLimitations = () => {
    setData((prev) => ({
      ...prev,
      hasNoLimitations: true,
      limitations: [],
    }));
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleToggleJointArea = (area: BodyJointArea) => {
    setData((prev) => {
      const exists = prev.limitations.some((l) => l.area === area);
      let updated = [...prev.limitations];
      if (exists) {
        updated = updated.filter((l) => l.area !== area);
      } else {
        updated.push({
          area,
          severity: LimitationSeverity.MILD_DISCOMFORT,
        });
      }
      return {
        ...prev,
        hasNoLimitations: updated.length === 0,
        limitations: updated,
      };
    });
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleChangeSeverity = (area: BodyJointArea, severity: LimitationSeverity) => {
    setData((prev) => ({
      ...prev,
      limitations: prev.limitations.map((l) =>
        l.area === area ? { ...l, severity } : l
      ),
    }));
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleChangeCustomDescription = (desc: string) => {
    setData((prev) => ({
      ...prev,
      limitations: prev.limitations.map((l) =>
        l.area === 'OTHER' ? { ...l, customDescription: desc } : l
      ),
    }));
    if (errorMessage) setErrorMessage(undefined);
  };

  const handleToggleMedicalClearance = (checked: boolean) => {
    setData((prev) => ({ ...prev, medicalClearanceAcknowledged: checked }));
    if (errorMessage) setErrorMessage(undefined);
  };

  const currentMeta = stepsMetadata[currentStep];

  const isStep1Blocked =
    currentStep === 1 &&
    (!data.hasAcceptedPrivacyPolicy ||
      !data.hasAcceptedHealthDataProcessing ||
      !data.hasAcceptedTerms);

  return (
    <>
      <OnboardingLayout
        currentStep={currentStep}
        totalSteps={10}
        stepTitle={currentMeta.title}
        stepSubtitle={currentMeta.subtitle}
        errorMessage={errorMessage}
        onNext={handleNext}
        onPrev={handlePrev}
        onCancel={onCancel}
        isNextDisabled={isStep1Blocked}
        isSubmitting={isSubmitting}
        nextButtonLabel={
          currentStep === 1
            ? 'Aceptar y Continuar a Información Básica'
            : currentStep === 10
            ? 'Finalizar y Comenzar'
            : 'Continuar'
        }
      >
        {currentStep === 1 && (
          <Step1Welcome
            data={data}
            onChange={(updates) => {
              setData((prev) => ({ ...prev, ...updates }));
              if (errorMessage) setErrorMessage(undefined);
            }}
            onOpenLegalModal={() => setShowLegalInOnboarding(true)}
            onStart={handleNext}
          />
        )}

      {currentStep === 2 && (
        <Step2BasicInfo
          name={data.name}
          age={data.age}
          sex={data.sex}
          heightCm={data.heightCm}
          weightKg={data.weightKg}
          onChange={handleUpdateBasicInfo}
        />
      )}

      {currentStep === 3 && (
        <Step3Goal
          selectedGoal={data.primaryGoal}
          onSelectGoal={handleSelectGoal}
        />
      )}

      {currentStep === 4 && (
        <Step4Level
          selectedLevel={data.fitnessLevel}
          onSelectLevel={handleSelectLevel}
        />
      )}

      {currentStep === 5 && (
        <Step5Location
          selectedLocation={data.trainingLocation}
          onSelectLocation={handleSelectLocation}
        />
      )}

      {currentStep === 6 && (
        <Step6Equipment
          location={data.trainingLocation}
          selectedEquipment={data.availableEquipment}
          onToggleEquipment={handleToggleEquipment}
          onSetEquipment={handleSetEquipment}
        />
      )}

      {currentStep === 7 && (
        <Step7Availability
          daysPerWeek={data.daysPerWeek}
          durationMinutes={data.durationMinutes}
          preferredIntensity={data.preferredIntensity}
          onChange={handleUpdateAvailability}
        />
      )}

      {currentStep === 8 && (
        <Step8Morphology
          selectedMorphology={data.morphology}
          onSelectMorphology={handleSelectMorphology}
        />
      )}

      {currentStep === 9 && (
        <Step9Limitations
          hasNoLimitations={data.hasNoLimitations}
          limitations={data.limitations}
          onToggleNoLimitations={handleToggleNoLimitations}
          onToggleArea={handleToggleJointArea}
          onChangeSeverity={handleChangeSeverity}
          onChangeCustomDescription={handleChangeCustomDescription}
        />
      )}

      {currentStep === 10 && (
        <Step10Summary
          data={data}
          onToggleMedicalClearance={handleToggleMedicalClearance}
        />
      )}
    </OnboardingLayout>

    {showLegalInOnboarding && (
      <LegalModal
        isOpen={showLegalInOnboarding}
        onClose={() => setShowLegalInOnboarding(false)}
        defaultTab="privacy"
      />
    )}
  </>
);
}
