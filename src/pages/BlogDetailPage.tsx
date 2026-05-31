import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Tag as TagIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getPost, blogData } from '../data/blog';
import { series } from '../data/series';
import MarkdownRenderer from '../components/MarkdownRenderer';
import TableOfContents from '../components/TableOfContents';
import ReadingProgress from '../components/ReadingProgress';
import Comments from '../components/Comments';
import { RelatedLink } from '../components/RelatedLink';

const BlogDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const post = id ? getPost(id) : undefined;

  // 推荐 & 专题：放在 useParams 后，无 post 时 short-circuit
  const matchedSeries = post
    ? series.filter((s) => s.matchTags.some((tag) => post.tags.includes(tag)))
    : [];
  const related = post
    ? blogData
        .filter(
          (p) =>
            p.id !== post.id &&
            !p.isDraft &&
            (p.category === post.category || p.tags.some((t) => post.tags.includes(t))),
        )
        .slice(0, 2)
    : [];

  if (!post) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
          文章不存在 📭
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-2">
          这篇文章可能已下架或链接错误
        </p>
        <p className="text-xs text-slate-400 mb-6">
          可用文章：{blogData.map((p) => p.id).join(' / ')}
        </p>
        <Link to="/blog" className="btn-primary">
          返回博客列表
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950">
      <ReadingProgress />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-sm text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          返回
        </button>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_220px] gap-10">
          <article id="blog-article" className="min-w-0">
            <header className="mb-8 pb-8 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="px-2.5 py-0.5 text-xs rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                  {post.category}
                </span>
                {post.isDraft && (
                  <span className="px-2.5 py-0.5 text-xs rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300">
                    {t('misc.draft')}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mb-5">{post.excerpt}</p>

              <div className="flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {post.publishDate}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {t('misc.readingMin', { n: post.readTime })}
                </span>
                <span>{post.author}</span>
              </div>

              {post.tags.length > 0 && (
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <TagIcon className="h-4 w-4 text-slate-400" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            <MarkdownRenderer content={post.content} />

            {/* 所属专题 */}
            {matchedSeries.length > 0 && (
              <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  📚 本文所属专题
                </h3>
                <div className="flex flex-wrap gap-2">
                  {matchedSeries.map((s) => (
                    <Link
                      key={s.slug}
                      to={`/series/${s.slug}`}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs text-white bg-gradient-to-r ${s.color} hover:shadow-md transition-shadow`}
                    >
                      <span>{s.icon}</span>
                      {s.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 推荐阅读 */}
            {related.length > 0 && (
              <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  ✨ 推荐阅读
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {related.map((p) => (
                    <RelatedLink
                      key={p.id}
                      to={`/blog/${p.id}`}
                      emoji="📝"
                      title={p.title}
                      desc={p.excerpt}
                    />
                  ))}
                </div>
              </div>
            )}

            <Comments term={`blog-${post.id}`} />

            <div className="mt-12 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                读到这里啦，谢谢你的耐心 🙇
              </p>
              <Link to="/blog" className="btn-primary">
                返回博客列表
              </Link>
            </div>
          </article>

          {/* 右侧 TOC（xl 以上才出现） */}
          <aside>
            <TableOfContents content={post.content} containerSelector="#blog-article" />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BlogDetailPage;
