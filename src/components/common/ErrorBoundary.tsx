import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Home, Shield } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('FitAdapt Uncaught Error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetCache = () => {
    try {
      // Clear app state while preserving user profile if possible
      sessionStorage.clear();
      window.location.href = '/';
    } catch {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
                Algo no salió como esperábamos
              </h2>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                FitAdapt ha protegido tus datos locales de entrenamiento para evitar pérdidas. Puedes reiniciar de forma segura.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-left text-xs space-y-1">
              <span className="font-semibold text-zinc-700 dark:text-zinc-300 block">
                Detalle amigable:
              </span>
              <p className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px] truncate">
                {this.state.error?.message || 'Error de renderizado en componente de interfaz.'}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <Button
                variant="primary"
                onClick={this.handleReload}
                className="w-full text-xs"
              >
                <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
                Recargar FitAdapt
              </Button>
              <Button
                variant="outline"
                onClick={this.handleResetCache}
                className="w-full text-xs"
              >
                <Home className="w-3.5 h-3.5 mr-1.5" />
                Ir a Inicio
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
