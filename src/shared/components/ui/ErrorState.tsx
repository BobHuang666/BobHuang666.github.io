import { Home, RotateCcw } from 'lucide-react';

interface Props {
  /** 大字号状态码，如 500 */
  code: string;
  title: string;
  description: string;
  /** 可选的技术细节（仅在错误边界捕获到时展示） */
  detail?: string;
}

/**
 * 全站统一的错误页（500 / 渲染异常）。
 * 路由级错误边界与 /500 路由共用同一份视图，保证文案与操作一致。
 */
export const ErrorState = ({ code, title, description, detail }: Props) => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center gap-0">
    <div className="relative">
      <h1 className="text-[100px] md:text-[150px] font-extrabold leading-none text-gradient-brand select-none">
        {code}
      </h1>
    </div>
    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
      {title}
    </h2>
    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">{description}</p>
    {detail && (
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-6 max-w-md break-words">{detail}</p>
    )}
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
);
