import { Github, Mail, Code2, Award, BookOpen, Database, Globe, Shield, Trophy, Users, Brain } from 'lucide-react';

function HomePage() {

  const projects = [
    {
      title: "iGEM Wiki前端开发",
      description: "国际基因工程机器大赛Wiki前端设计开发，使用HTML+CSS+JS实现响应式布局，设计10+动态模块，处理50MB+文字动画图表等科研资料可视化，获最佳Wiki提名",
      image: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=1000",
      tags: ["HTML", "CSS", "JavaScript", "响应式设计"],
      link: "https://2024.igem.wiki/bnuzh-china/",
      demoLink: "/demo-desc"
    },
    {
      title: "汕头善堂收客记录系统",
      description: "数字人文课程项目，开发低门槛数据管理系统，前端使用TS+React设计搜索页与统计看板，后端基于Python Flask搭建API，实现多字段模糊搜索与分组统计",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000",
      tags: ["TypeScript", "React", "Python", "Flask"],
      link: "/demo",
      demoLink: "/demo-desc"
    },
    {
      title: "政府采购数据分析系统",
      description: "国家级大创项目，使用Python处理10万+政府采购合同数据，通过jieba分词与匹配解析省份与地级市信息，构建城市加权税收依赖度指标体系，进行回归分析",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000",
      tags: ["Python", "数据分析", "机器学习", "jieba"],
      link: "/demo",
      demoLink: "/demo-desc"
    }
  ];

  const techStack = [
    { name: "编程语言", icon: Code2, skills: ["C/C++", "Java", "Python", "JavaScript", "TypeScript"] },
    { name: "前端开发", icon: Globe, skills: ["React", "Vue", "HTML/CSS", "响应式设计"] },
    { name: "后端开发", icon: Database, skills: ["Flask", "MySQL", "SQLServer", "API设计"] },
    { name: "工具技能", icon: Shield, skills: ["Git", "Linux", "Docker", "SSH", "算法"] }
  ];

  const blogPosts = [
    {
      title: "iGEM竞赛中的前端开发实践",
      excerpt: "分享在国际基因工程机器大赛中负责Wiki前端开发的经历，包括响应式设计、动态模块开发、大数据可视化等技术的应用...",
      date: "2024-01-15",
      readTime: "10分钟",
      category: "竞赛经历"
    },
    {
      title: "Python在数据处理中的应用",
      excerpt: "从政府采购数据分析项目出发，探讨Python在数据清洗、分词处理、统计分析等方面的实际应用技巧...",
      date: "2024-01-10",
      readTime: "12分钟",
      category: "技术分享"
    },
    {
      title: "全栈开发项目经验总结",
      excerpt: "结合汕头善堂收客记录系统项目，分享TypeScript+React+Python Flask的全栈开发经验和技术选型思考...",
      date: "2024-01-05",
      readTime: "8分钟",
      category: "项目经验"
    }
  ];

  const awards = [
    {
      title: "蓝桥杯决赛三等奖",
      organization: "第十六届蓝桥杯",
      year: "2024",
      description: "C/C++大学A组决赛三等奖，算法竞赛领域的重要成就",
      icon: Trophy
    },
    {
      title: "iGEM最佳Wiki提名",
      organization: "国际基因工程机器大赛",
      year: "2024",
      description: "负责Wiki前端开发，获最佳Wiki提名，全球顶级合成生物学竞赛",
      icon: Award
    },
    {
      title: "京师杯一等奖",
      organization: "北京师范大学",
      year: "2024",
      description: "政府采购与新质生产力发展研究论文获一等奖",
      icon: BookOpen
    },
    {
      title: "CCF算法能力大赛区域赛二等奖",
      organization: "CCF算法能力大赛",
      year: "2023",
      description: "算法竞赛区域赛二等奖，展示算法设计与编程能力",
      icon: Brain
    },
    {
      title: "北京师范大学程序设计大赛金奖",
      organization: "北京师范大学",
      year: "2023",
      description: "校内程序设计大赛最高荣誉，体现编程实力",
      icon: Code2
    },
    {
      title: "全国大学生数学建模竞赛广东省二等奖",
      organization: "全国大学生数学建模竞赛",
      year: "2023",
      description: "数学建模竞赛省级二等奖，展示数学建模与问题解决能力",
      icon: Users
    },
    {
      title: "北京高校数学建模校际联赛一等奖",
      organization: "北京高校数学建模校际联赛",
      year: "2023",
      description: "校际联赛一等奖，在数学建模领域表现优异",
      icon: Users
    }
  ];

  const handleProjectClick = (project: typeof projects[0], type: 'demo' | 'desc') => {
    if (type === 'demo' && project.link.startsWith('http')) {
      // 外部链接在新标签页打开
      window.open(project.link, '_blank');
    } else if (type === 'desc') {
      // 项目详情在新标签页打开
      window.open(project.demoLink, '_blank');
    } else {
      // 内部演示页面在新标签页打开
      window.open(project.link, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="pt-4 pb-12 md:pt-16 md:pb-20 bg-gradient-to-r from-indigo-500 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Bob Huang
          </h1>
          <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto">
            数据科学与大数据技术专业在读本科生，热爱编程。Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique vel mollitia atque, quos incidunt officiis rerum reprehenderit, consequatur accusantium, provident aspernatur praesentium vitae doloremque veniam quasi quo nulla quisquam dolore!
          </p>
          <div className="flex justify-center space-x-4">
            <a href="#projects" className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              查看项目
            </a>
            <a href="/profile" className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-colors">
              个人介绍
            </a>
            <a href="#contact" className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-indigo-600 transition-colors">
              CALL ME
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      {/* <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">关于我</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              我是北京师范大学数据科学与大数据技术专业的学生，专注于算法竞赛和全栈开发。
              在国际基因工程机器大赛中负责Wiki前端开发，获得最佳Wiki提名。
              同时担任学校程序设计竞赛社团社长，组织算法相关比赛与活动。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">竞赛成就</h3>
              <p className="text-gray-600">蓝桥杯决赛三等奖、CCF算法能力大赛二等奖、iGEM最佳Wiki提名等多项竞赛荣誉</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">技术能力</h3>
              <p className="text-gray-600">熟练掌握C/C++、Java、Python，具备全栈开发能力，熟悉算法与数据结构</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">学生工作</h3>
              <p className="text-gray-600">担任程序设计竞赛社团社长，校团委青年科技创新协会学术创新部部长</p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Skills Section */}
      <section id="skills" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">技能点</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {techStack.map((category, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <category.icon className="h-8 w-8 text-indigo-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                </div>
                <div className="space-y-2">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">通关副本</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleProjectClick(project, 'demo')}
                      className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                    >
                      在线演示
                    </button>
                    <button
                      onClick={() => handleProjectClick(project, 'desc')}
                      className="flex-1 border border-indigo-600 text-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-50 transition-colors text-sm"
                    >
                      项目详情
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">游戏攻略</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-gray-500 text-sm ml-auto">{post.readTime}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 hover:text-indigo-600 transition-colors cursor-pointer">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{post.date}</span>
                    <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                      阅读全文 →
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section id="awards" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">历史战绩</h2>
          <div className="overflow-x-auto">
            <div className="flex gap-6 pb-4 awards-container">
              {awards.map((award, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100 hover:shadow-lg transition-shadow flex-shrink-0 w-80">
                  <div className="flex items-center mb-4">
                    <award.icon className="h-10 w-10 text-indigo-600 mr-4" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{award.title}</h3>
                      <p className="text-sm text-gray-600">{award.organization}</p>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{award.description}</p>
                  <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                    {award.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">联系客服</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            如果你对算法竞赛、全栈开发或者技术交流感兴趣，欢迎随时联系我！
            我期待与你一起探讨技术，共同进步。
          </p>
          <div className="flex justify-center space-x-6">
            <a href="https://github.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Github className="h-8 w-8" />
            </a>
            <a href="mailto:your.email@example.com" className="text-gray-600 hover:text-indigo-600 transition-colors">
              <Mail className="h-8 w-8" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>© {new Date().getFullYear()} BobHuang. 保留所有权利。</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
