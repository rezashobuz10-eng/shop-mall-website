import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public props: Props;
  public state: State = {
    hasError: false
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
    try {
      fetch('/api/client-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fallbackTitle: this.props.fallbackTitle,
          errorMessage: error?.message || String(error),
          errorStack: error?.stack,
          componentStack: errorInfo?.componentStack,
          url: typeof window !== 'undefined' ? window.location.href : ''
        })
      }).catch(() => {});
    } catch (_) {}
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-8 text-center shadow-lg">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">
              {this.props.fallbackTitle || 'Something went wrong. Please refresh the page.'}
            </h2>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              We encountered an issue loading this section. Please try refreshing or return to the shop homepage.
            </p>
            {this.state.error && (
              <div className="mb-6 p-3 bg-rose-50/70 border border-rose-200 rounded-xl text-left text-[11px] font-mono text-rose-800 break-words">
                <span className="font-bold">Error: </span>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Refresh Page
              </button>
              <a
                href="/"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                Back to Home
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
