import { Home, RotateCcw } from 'lucide-react';

const ServerErrorPage = () => (
  <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center gap-0">
    <div className="relative">
      <h1 className="text-[100px] md:text-[150px] font-extrabold leading-none text-gradient-brand select-none">
        500
      </h1>
    </div>
    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">
      系统开小差了 💥
    </h2>
    <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
      请刷新页面重试，或回到主页继续浏览。
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
);

export default ServerErrorPage;
