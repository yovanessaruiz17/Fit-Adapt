/**
 * FitAdapt - Tipos de Navegación Principal
 * FASE 2: Sistema Visual y UI/UX
 */

export type AppView = 'HOME' | 'PLAN' | 'WORKOUT' | 'PROGRESS' | 'PROFILE' | 'ASSISTANT' | 'ARCH_INSPECTOR' | 'ONBOARDING';

export interface NavItem {
  id: AppView;
  label: string;
  iconName: 'Home' | 'Calendar' | 'Dumbbell' | 'TrendingUp' | 'User' | 'Bot';
}
