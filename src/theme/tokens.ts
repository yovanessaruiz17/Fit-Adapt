/**
 * FitAdapt - Design Tokens Centralizados
 * FASE 2: Sistema Visual y UI/UX
 * 
 * Estilo: FITNESS + WELLNESS + TECNOLOGÍA
 * Paleta refinada con base esmeralda/teal (vitalidad), pizarra neutra (tecnología limpia)
 * y acentos suaves accesibles (WCAG AA).
 */

export const tokens = {
  colors: {
    // Marca y Vitalidad (Teal & Emerald)
    brand: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488', // Primario
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },
    // Bienestar / Wellness (Cálido suave & Salvia)
    wellness: {
      light: '#ecfdf5',
      DEFAULT: '#10b981',
      dark: '#047857',
    },
    // Tecnología y Sinergia (Índigo suave para acentos cognitivos)
    tech: {
      50: '#eef2ff',
      100: '#e0e7ff',
      500: '#6366f1',
      600: '#4f46e5',
    },
    // Estados Semánticos
    feedback: {
      success: {
        bg: '#ecfdf5',
        text: '#065f46',
        border: '#a7f3d0',
        icon: '#10b981',
      },
      warning: {
        bg: '#fffbeb',
        text: '#92400e',
        border: '#fde68a',
        icon: '#f59e0b',
      },
      danger: {
        bg: '#fef2f2',
        text: '#991b1b',
        border: '#fecaca',
        icon: '#ef4444',
      },
      info: {
        bg: '#f0f9ff',
        text: '#075985',
        border: '#bae6fd',
        icon: '#0284c7',
      },
    },
    // Superficies Light & Dark
    surfaces: {
      light: {
        canvas: '#f8fafc',
        card: '#ffffff',
        subtle: '#f1f5f9',
        border: '#e2e8f0',
        borderHover: '#cbd5e1',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        textMuted: '#94a3b8',
      },
      dark: {
        canvas: '#090d16',
        card: '#111827',
        subtle: '#1e293b',
        border: '#273549',
        borderHover: '#374761',
        textPrimary: '#f8fafc',
        textSecondary: '#cbd5e1',
        textMuted: '#64748b',
      },
    },
  },

  typography: {
    fontFamily: {
      sans: 'var(--font-sans)',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.01em' }],
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0' }],
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.015em' }],
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.025em' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.035em' }],
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  radii: {
    none: '0',
    sm: '0.375rem', // 6px
    md: '0.5rem',   // 8px
    lg: '0.75rem',  // 12px
    xl: '1rem',     // 16px
    '2xl': '1.25rem', // 20px
    full: '9999px',
  },

  spacing: {
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
  },

  shadows: {
    subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
    cardHover: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
    modal: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    smooth: '350ms cubic-bezier(0.16, 1, 0.3, 1)',
  },

  touchTarget: {
    minHeight: '44px',
    minWidth: '44px',
  },

  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export type ThemeMode = 'light' | 'dark';
