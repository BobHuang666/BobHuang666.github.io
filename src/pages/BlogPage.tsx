import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Tag as TagIcon, Filter, Rss } from 'lucide-react';
import { blogData } from '../data/blog';
import { motion } from 'framer-motion';
import { RelatedLink } from '../components/RelatedLink';

const categories = [
  { id: 'all', name: '全部' },
  { id: '项目复盘', name: '项目复盘' },
  { id: '算法题解', name: '算法题解' },
  { id: '前端开发', name: '前端开发' },
  { id: '学习笔记', name: '学习笔记' },
  { id: '随笔', name: '随笔' },
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showDrafts, setShowDrafts] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogData.forEach((p) => p.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, []);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: blogData.length };
    blogData.forEach((p) => {
      counts[p.category] = (counts[p.category] ?? 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    return blogData.filter((p) => {
      if (!showDrafts && p.isDraft) return false;
      const matchKw =
        !kw ||
        p.title.toLowerCase().includes(kw) ||
        p.excerpt.toLowerCase().includes(kw) ||
        p.tags.some((t) => t.toLowerCase().includes(kw));
      const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
      const matchTags =
        selectedTags.length === 0 || selectedTags.some((t) => p.tags.includes(t));
      return matchKw && matchCat && matchTags;
    });
  }, [searchTerm, selectedCategory, selectedTags, showDrafts]);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            游戏攻略
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-4">
            技术笔记、项目复盘、学习记录 —— 慢慢写，慢慢更新
          </p>
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/60 transition-colors"
          >
            <Rss className="h-3.5 w-3.5" />
            RSS 订阅
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 lg:sticky lg:top-24">
              {/* Search */}
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                搜索
              </label>
              <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="标题、标签…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Category */}
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                分类
              </label>
              <div className="space-y-1 mb-5">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-all duration-200 flex items-center justify-between ${
                      selectedCategory === c.id
                        ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full">
                      {categoryCounts[c.id] ?? 0}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tags */}
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                <TagIcon className="inline h-3 w-3 mr-1" />
                标签
              </label>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 text-xs rounded-full transition-all duration-200 ${
                      selectedTags.includes(tag)
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Draft toggle */}
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 dark:text-slate-400 mb-3">
                <input
                  type="checkbox"
                  checked={showDrafts}
                  onChange={(e) => setShowDrafts(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                显示草稿文章
              </label>

              {(searchTerm || selectedCategory !== 'all' || selectedTags.length > 0) && (
                <button
                  onClick={clearFilters}
                  className="w-full mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center justify-center gap-1"
                >
                  <Filter className="h-3 w-3" />
                  清空筛选
                </button>
              )}
            </div>
          </aside>

          {/* List */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              找到 <span className="font-semibold text-indigo-600 dark:text-indigo-400">{filtered.length}</span> 篇文章
              {searchTerm && <> · 搜索 "<span className="font-medium">{searchTerm}</span>"</>}
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12 text-center">
                <FileText className="mx-auto h-12 w-12 text-slate-400 mb-3" />
                <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-1">
                  没有找到相关文章
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  尝试调整搜索条件或清空筛选
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filtered.map((post, i) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow overflow-hidden"
                  >
                    <Link to={`/blog/${post.id}`} className="block p-6">
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="px-2.5 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                          {post.category}
                        </span>
                        {post.isDraft && (
                          <span className="px-2.5 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                            草稿
                          </span>
                        )}
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {post.publishDate}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {post.readTime} 分钟阅读
                        </span>
                      </div>

                      <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-950/40 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                              {post.author.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs text-slate-600 dark:text-slate-400">{post.author}</span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <RelatedLink to="/series" emoji="📚" title="专题系列" desc="按主题浏览博客" />
              <RelatedLink to="/now" emoji="✨" title="当前动态" desc="最近在做什么" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
