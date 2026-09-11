import { Component, ErrorInfo, ReactNode } from 'react';
import { Home, RotateCcw } from 'lucide-react';

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
          <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 text-center gap-0">
            <div className="relative">
              <h1 className="text-[100px] md:text-[150px] font-extrabold leading-none text-gradient-brand select-none">
                500
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              系统开小差了 💥
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
              这个页面遇到了意外问题。你可以刷新页面重试，或回到主页继续浏览。
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <button type="button" onClick={() => window.location.reload()} className="btn-primary">
                <RotateCcw className="h-4 w-4 mr-2" /> 刷新重试
              </button>
              <a
                href="#/"
                className="btn-outline text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
              >
                <Home className="h-4 w-4 mr-2" /> 返回主页
              </a>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
