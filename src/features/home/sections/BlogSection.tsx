/** 首页博客区：最新文章卡片 */
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { uiText } from '@/data/uiText';
import { blogMeta } from '@/data/blog';
import { SectionReveal } from '@/shared/components/effects/SectionReveal';
import { SectionShell } from '@/shared/components/layout/SectionShell';

export const BlogSection = () => {
  const navigate = useNavigate();
  const featured = blogMeta.slice(0, 3);

  return (
    <SectionShell
      id="blog"
      no="02"
      eyebrow={uiText.home.blogEyebrow}
      title={uiText.home.blogTitle}
      subtitle={uiText.home.blogSub}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((post, index) => (
          <SectionReveal key={post.id} variant="scale" delay={index * 0.08}>
            <article
              onClick={() => navigate(`/blog/${post.id}`)}
              className="card-base p-6 h-full cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="tag-chip rounded-full">{post.category}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {uiText.common.readingMin(post.readTime)}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {post.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  {post.publishDate}
                </span>
                <span className="text-indigo-600 dark:text-indigo-400 font-medium inline-flex items-center">
                  阅读 <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </span>
              </div>
            </article>
          </SectionReveal>
        ))}
      </div>
      <div className="text-center mt-10">
        <Link
          to="/blog"
          className="inline-flex items-center text-indigo-600 dark:text-indigo-400 hover:underline text-sm font-medium"
        >
          {uiText.home.viewAllPosts} <ArrowRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </SectionShell>
  );
};
