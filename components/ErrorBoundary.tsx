
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorId: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    // Generate a unique error ID for support
    const errorId = Math.random().toString(36).substr(2, 9).toUpperCase();
    return { hasError: true, error, errorId };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error with component context
    console.group(`[Error Boundary] Incident in: ${this.props.name || 'Anonymous Component'}`);
    console.error("Error:", error);
    console.error("Component Stack:", errorInfo.componentStack);
    console.groupEnd();
    
    // In production, you would send this to Sentry/LogRocket here
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorId: '' });
  };

  private handleGoHome = () => {
    // Simple state-safe navigation back to home if possible, or reload
    window.location.href = '/';
  };

  private handleReportError = () => {
    // Placeholder for future error reporting service
    alert(`Error ${this.state.errorId} has been queued for review by the engineering team.`);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-[#fafafa] min-h-[500px] border border-gray-100 rounded-3xl m-4 shadow-sm">
          <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl shadow-sm border border-red-100">
              <span className="text-red-500 opacity-80 select-none">✦</span>
            </div>
            
            <div className="space-y-4">
              <h2 className="font-serif text-3xl tracking-tight text-gray-900 leading-tight">Intelligence Interrupted</h2>
              <p className="text-[14px] text-gray-400 font-serif italic leading-relaxed">
                An unexpected interruption occurred within the <span className="text-gray-900 font-medium not-italic">{this.props.name || 'workspace'}</span>. Our agents are recalibrating to restore operational continuity.
              </p>
            </div>

            <div className="pt-6 flex flex-col space-y-3">
              <button 
                onClick={this.handleReset}
                className="w-full py-3.5 bg-black text-white rounded-xl text-[12px] font-bold uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg active:scale-95"
              >
                Retry Operation
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={this.handleGoHome}
                  className="py-3 text-[11px] font-bold uppercase tracking-widest border border-gray-200 rounded-xl text-gray-500 hover:text-black hover:border-black transition-all"
                >
                  Return to Dashboard
                </button>
                <button 
                  onClick={this.handleReportError}
                  className="py-3 text-[11px] font-bold uppercase tracking-widest border border-gray-200 rounded-xl text-gray-500 hover:text-black hover:border-black transition-all"
                >
                  Report Incident
                </button>
              </div>
            </div>

            <div className="pt-8 border-t border-gray-100">
              <div className="flex flex-col items-center space-y-2">
                <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">Incident Reference</span>
                <code className="text-[11px] px-3 py-1 bg-gray-50 text-gray-400 rounded-full font-mono border border-gray-100">
                  {this.state.errorId}
                </code>
              </div>
            </div>
            
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-8 p-4 bg-gray-900 rounded-xl text-left overflow-auto max-h-40 shadow-inner">
                <p className="text-[10px] text-emerald-400 font-bold mb-2 uppercase tracking-tighter">Debug Trace:</p>
                <code className="text-[10px] text-gray-400 font-mono break-words leading-relaxed">
                  {this.state.error?.stack}
                </code>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
