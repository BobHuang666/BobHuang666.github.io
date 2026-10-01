import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { uiText } from '../../../data/uiText';
import { blogMeta } from '../../../data/blog';
import { SectionReveal } from '../../../shared/components/effects/SectionReveal';
import { SectionHeader } from './SectionHeader';

/** 首页精选文章（取最新 3 篇） */
export const BlogSection = () => {
  const navigate = useNavigate();
  const featured = blogMeta.slice(0, 3);

  return (
    <section id="blog" className="py-20 bg-white dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader title={uiText.home.blogTitle} subtitle={uiText.home.blogSub} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((post, index) => (
            <SectionReveal key={post.id} variant="scale" delay={index * 0.08}>
              <article
                onClick={() => navigate(`/blog/${post.id}`)}
                className="card-base p-6 h-full cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300">
                    {post.category}
                  </span>
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
      </div>
    </section>
  );
};
