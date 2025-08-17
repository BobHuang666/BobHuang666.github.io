import { useState, useMemo } from "react";
import { Link } from "react-router-dom";

// 博客数据类型定义
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string[];
  publishDate: string;
  readTime: number;
  author: string;
  coverImage?: string;
}

// 模拟博客数据
const blogData: BlogPost[] = [
  {
    id: "1",
    title: "React Hooks 深度解析：从入门到精通",
    excerpt: "深入探讨React Hooks的使用技巧和最佳实践，包括useState、useEffect、useContext等核心Hook的详细用法...",
    content: "React Hooks是React 16.8引入的新特性，它让我们可以在函数组件中使用状态和其他React特性...",
    category: "前端开发",
    tags: ["React", "Hooks", "JavaScript", "前端"],
    publishDate: "2024-01-15",
    readTime: 8,
    author: "Bob Huang"
  },
  {
    id: "2",
    title: "算法题解：LeetCode 经典动态规划问题",
    excerpt: "详细解析LeetCode中常见的动态规划问题，包括解题思路、代码实现和复杂度分析...",
    content: "动态规划是算法设计中的一种重要方法，通过将复杂问题分解为子问题来解决...",
    category: "算法题解",
    tags: ["算法", "动态规划", "LeetCode", "数据结构"],
    publishDate: "2024-01-10",
    readTime: 12,
    author: "Bob Huang"
  },
  {
    id: "3",
    title: "TypeScript 高级类型系统详解",
    excerpt: "探索TypeScript的高级类型特性，包括条件类型、映射类型、模板字面量类型等...",
    content: "TypeScript的类型系统非常强大，提供了许多高级特性来帮助我们编写更安全的代码...",
    category: "前端开发",
    tags: ["TypeScript", "类型系统", "JavaScript"],
    publishDate: "2024-01-08",
    readTime: 15,
    author: "Bob Huang"
  },
  {
    id: "4",
    title: "Vue3 Composition API 实战指南",
    excerpt: "通过实际项目案例，学习Vue3 Composition API的使用方法和最佳实践...",
    content: "Vue3的Composition API提供了一种更灵活的方式来组织组件逻辑...",
    category: "前端开发",
    tags: ["Vue3", "Composition API", "前端"],
    publishDate: "2024-01-05",
    readTime: 10,
    author: "Bob Huang"
  },
  {
    id: "5",
    title: "数据结构与算法：二叉树遍历详解",
    excerpt: "深入理解二叉树的前序、中序、后序遍历算法，以及递归和迭代两种实现方式...",
    content: "二叉树是计算机科学中最基础的数据结构之一，掌握其遍历方法对于理解更复杂的算法至关重要...",
    category: "算法题解",
    tags: ["数据结构", "二叉树", "算法", "遍历"],
    publishDate: "2024-01-03",
    readTime: 9,
    author: "Bob Huang"
  },
  {
    id: "6",
    title: "CSS Grid 布局完全指南",
    excerpt: "从基础概念到高级技巧，全面掌握CSS Grid布局系统的使用方法...",
    content: "CSS Grid是一个强大的二维布局系统，可以轻松创建复杂的网页布局...",
    category: "前端开发",
    tags: ["CSS", "Grid", "布局", "前端"],
    publishDate: "2024-01-01",
    readTime: 11,
    author: "Bob Huang"
  }
];

// 分类数据
const categories = [
  { id: "all", name: "全部", count: blogData.length },
  { id: "前端开发", name: "前端开发", count: blogData.filter(post => post.category === "前端开发").length },
  { id: "算法题解", name: "算法题解", count: blogData.filter(post => post.category === "算法题解").length },
  { id: "自学内容", name: "自学内容", count: 0 },
  { id: "出题", name: "出题", count: 0 },
  { id: "笔记", name: "笔记", count: 0 }
];

const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // 获取所有标签
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    blogData.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, []);

  // 筛选博客文章
  const filteredBlogs = useMemo(() => {
    return blogData.filter(post => {
      // 搜索筛选
      const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      // 分类筛选
      const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;

      // 标签筛选
      const matchesTags = selectedTags.length === 0 ||
        selectedTags.some(tag => post.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    });
  }, [searchTerm, selectedCategory, selectedTags]);

  // 切换标签选择
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              {/* 搜索框 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">搜索文章</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索标题、内容或标签..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                  <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* 分类筛选 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">分类</label>
                <div className="space-y-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${selectedCategory === category.id
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{category.name}</span>
                        <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                          {category.count}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 标签筛选 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">标签</label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 text-xs rounded-full transition-all duration-200 ${selectedTags.includes(tag)
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                        }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 主要内容 */}
          <div className="lg:col-span-3">
            {/* 结果统计 */}
            <div className="mb-6">
              <p className="text-gray-600">
                找到 <span className="font-semibold text-indigo-600">{filteredBlogs.length}</span> 篇文章
                {searchTerm && (
                  <span className="ml-2">
                    搜索 "<span className="font-medium">{searchTerm}</span>"
                  </span>
                )}
              </p>
            </div>

            {/* 博客列表 */}
            <div className="space-y-6">
              {filteredBlogs.map(post => (
                <article key={post.id} className="bg-white rounded-xl shadow-sm border hover:shadow-md transition-shadow duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                            {post.category}
                          </span>
                          <span className="text-gray-500 text-sm">{post.publishDate}</span>
                          <span className="text-gray-500 text-sm">·</span>
                          <span className="text-gray-500 text-sm">{post.readTime} 分钟阅读</span>
                        </div>

                        <Link to={`/blog/${post.id}`}>
                          <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors">
                            {post.title}
                          </h2>
                        </Link>

                        <p className="text-gray-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <span className="text-indigo-600 text-sm font-medium">
                                {post.author.charAt(0)}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600">{post.author}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            {post.tags.slice(0, 3).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                                {tag}
                              </span>
                            ))}
                            {post.tags.length > 3 && (
                              <span className="text-gray-400 text-xs">+{post.tags.length - 3}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* 空状态 */}
            {filteredBlogs.length === 0 && (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">没有找到相关文章</h3>
                <p className="mt-1 text-sm text-gray-500">
                  尝试调整搜索条件或筛选器
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPage;
