import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, FileText, Tag as TagIcon, Filter, Rss } from 'lucide-react';
import { motion } from 'framer-motion';
import { blogData, blogCategories, blogTags } from '../../data/blog';
import { copy } from '../../data/copy';
import { Chip } from '../../shared/components/ui/Chip';
import { EmptyState } from '../../shared/components/ui/EmptyState';

/** /blog —— 列表页：负责筛选状态与编排，卡片与筛选器复用共享组件 */
const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const kw = searchTerm.trim().toLowerCase();
    return blogData.filter((p) => {
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
  }, [searchTerm, selectedCategory, selectedTags]);

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

  const hasFilter = searchTerm || selectedCategory !== 'all' || selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-3">
            {copy.blog.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-4">
            {copy.blog.subtitle}
          </p>
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 hover:bg-orange-200 dark:hover:bg-orange-900/60 transition-colors"
          >
            <Rss className="h-3.5 w-3.5" />
            {copy.blog.rss}
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-5 lg:sticky lg:top-24">
              {/* Search */}
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                {copy.blog.searchLabel}
              </label>
              <div className="relative mb-5">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={copy.blog.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              {/* Category —— 分类与计数全部由 data/blog.ts 派生 */}
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                {copy.blog.categoryLabel}
              </label>
              <div className="space-y-1 mb-5">
                {blogCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`w-full text-left px-3 py-1.5 rounded-md text-sm transition-all duration-200 flex items-center justify-between ${selectedCategory === c.id
                      ? 'bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-medium'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded-full">
                      {c.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Tags */}
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-wide">
                <TagIcon className="inline h-3 w-3 mr-1" />
                {copy.blog.tagsLabel}
              </label>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {blogTags.map((tag) => (
                  <Chip
                    key={tag}
                    active={selectedTags.includes(tag)}
                    onClick={() => toggleTag(tag)}
                    className="px-2.5 py-1"
                  >
                    {tag}
                  </Chip>
                ))}
              </div>

              {hasFilter && (
                <button
                  onClick={clearFilters}
                  className="w-full mt-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center justify-center gap-1"
                >
                  <Filter className="h-3 w-3" />
                  {copy.blog.clearFilters}
                </button>
              )}
            </div>
          </aside>

          {/* List */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-slate-600 dark:text-slate-400">
              {copy.blog.found(filtered.length)}
              {searchTerm && <> · 搜索 "<span className="font-medium">{searchTerm}</span>"</>}
            </div>

            {filtered.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-12">
                <EmptyState
                  icon={FileText}
                  title={copy.blog.emptyTitle}
                  description={copy.blog.emptyDesc}
                  className="py-0"
                />
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
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {post.publishDate}
                        </span>
                        <span className="text-xs text-slate-400">·</span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {copy.misc.readingMin(post.readTime)}
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
