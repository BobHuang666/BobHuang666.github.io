import { Link } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <h1 className="text-[120px] md:text-[180px] font-extrabold leading-none text-gradient-brand select-none">
          404
        </h1>
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100 mb-3">
        迷失在副本之外
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        这条路线还未解锁，或者地图已经更新。回到主城，开始新的冒险吧。
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn-primary">
          <Home className="h-4 w-4 mr-2" /> 返回主城
        </Link>
        <Link
          to="/blog"
          className="btn-outline text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950"
        >
          <Compass className="h-4 w-4 mr-2" /> 翻翻攻略
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
