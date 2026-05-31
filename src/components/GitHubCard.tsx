import { useEffect, useState } from 'react';
import { Github, Star, GitFork, BookOpen, Users } from 'lucide-react';

interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  html_url: string;
}

interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  fork: boolean;
}

interface Props {
  username: string;
}

const LANG_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  'C++': '#f34b7d',
  C: '#555555',
  Go: '#00ADD8',
  Java: '#b07219',
  Vue: '#41b883',
  HTML: '#e34c26',
  CSS: '#563d7c',
};

const GitHubCard = ({ username }: Props) => {
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    setLoading(true);

    Promise.all([
      fetch(`https://api.github.com/users/${username}`).then((r) => {
        if (!r.ok) throw new Error(`User ${r.status}`);
        return r.json();
      }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`).then((r) => {
        if (!r.ok) throw new Error(`Repos ${r.status}`);
        return r.json();
      }),
    ])
      .then(([u, rs]: [GitHubUser, GitHubRepo[]]) => {
        if (ignore) return;
        setUser(u);
        // 过滤 fork，按 star 排序取前 4
        const topRepos = (rs ?? [])
          .filter((r) => !r.fork)
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 4);
        setRepos(topRepos);
      })
      .catch((e: Error) => {
        if (!ignore) setError(e.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [username]);

  if (loading) {
    return (
      <div className="card-base p-6 animate-pulse">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          </div>
        </div>
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="card-base p-6 text-center">
        <Github className="h-8 w-8 mx-auto text-slate-400 mb-2" />
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">
          GitHub 数据加载失败
        </p>
        <p className="text-xs text-slate-400">
          {error ?? '未知错误'} · 用户：{username}
        </p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center mt-3 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
        >
          直接访问 GitHub →
        </a>
      </div>
    );
  }

  return (
    <div className="card-base p-6">
      <div className="flex items-start gap-4 mb-5">
        <img
          src={user.avatar_url}
          alt={user.login}
          className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-800 shadow"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
              {user.name ?? user.login}
            </h3>
            <a
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shrink-0"
              aria-label="访问 GitHub"
            >
              <Github className="h-4 w-4" />
            </a>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">@{user.login}</p>
          {user.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">{user.bio}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-5 text-center">
        <Stat icon={BookOpen} value={user.public_repos} label="仓库" />
        <Stat icon={Users} value={user.followers} label="关注者" />
        <Stat icon={Users} value={user.following} label="关注中" />
      </div>

      {repos.length > 0 && (
        <>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            热门仓库
          </h4>
          <div className="space-y-2">
            {repos.map((r) => (
              <a
                key={r.id}
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                    {r.name}
                  </span>
                  <span className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 shrink-0 ml-2">
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3" />
                      {r.stargazers_count}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <GitFork className="h-3 w-3" />
                      {r.forks_count}
                    </span>
                  </span>
                </div>
                {r.description && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-1">
                    {r.description}
                  </p>
                )}
                {r.language && (
                  <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: LANG_COLORS[r.language] ?? '#9ca3af' }}
                    />
                    {r.language}
                  </span>
                )}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const Stat = ({ icon: Icon, value, label }: { icon: typeof Star; value: number; label: string }) => (
  <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 py-2">
    <Icon className="h-3.5 w-3.5 mx-auto text-slate-400 mb-1" />
    <div className="text-base font-bold text-slate-900 dark:text-slate-100 leading-none">
      {value}
    </div>
    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{label}</div>
  </div>
);

export default GitHubCard;
