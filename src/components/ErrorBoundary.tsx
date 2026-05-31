import { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
              页面崩溃了 💥
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-md">
              抱歉，这个副本意外终止。可以刷新页面重试，或返回主城继续探索。
            </p>
            <a href="#/" className="btn-primary">
              返回主城
            </a>
            {this.state.error && (
              <pre className="mt-6 text-xs text-slate-400 max-w-2xl overflow-auto">
                {this.state.error.message}
              </pre>
            )}
          </div>
        )
      );
    }

    return this.props.children;
  }
}
