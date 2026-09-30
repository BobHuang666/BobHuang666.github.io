import { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorState } from './ErrorState';

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
    // HashRouter 下切路由即可恢复，避免一次失败把整站永久锁死在错误页
    window.addEventListener('hashchange', this.reset);
  }

  componentWillUnmount() {
    window.removeEventListener('hashchange', this.reset);
  }

  reset = () => {
    window.removeEventListener('hashchange', this.reset);
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <ErrorState
            code="500"
            title="系统开小差了 💥"
            description="这个页面遇到了意外问题。请按 Ctrl+Shift+R / Cmd+Shift+R 强制刷新重试。"
            detail={this.state.error?.message}
          />
        )
      );
    }

    return this.props.children;
  }
}
