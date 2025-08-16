import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Code2, Globe, Database, Shield, Zap, Users, Calendar, ExternalLink } from 'lucide-react';

interface ProjectData {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  demoLink: string;
  content: {
    overview: string;
    features: string[];
    techStack: {
      frontend: string[];
      backend: string[];
      database: string[];
      tools: string[];
    };
    challenges: string[];
    solutions: string[];
    results: string[];
    lessons: string[];
  };
  team?: string[];
  timeline?: string;
  github?: string;
}

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeSection, setActiveSection] = useState('overview');

  // 项目数据映射
  const projectsData: Record<string, ProjectData> = {
    'igem-wiki': {
      id: 'igem-wiki',
      title: 'iGEM Wiki前端开发',
      description: '国际基因工程机器大赛Wiki前端设计开发，使用HTML+CSS+JS实现响应式布局，设计10+动态模块，处理50MB+文字动画图表等科研资料可视化，获最佳Wiki提名',
      image: 'https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=1000',
      tags: ['HTML', 'CSS', 'JavaScript', '响应式设计'],
      link: 'https://2024.igem.wiki/bnuzh-china/',
      demoLink: '/demo-desc',
      content: {
        overview: `iGEM（国际基因工程机器大赛）是全球顶级的合成生物学竞赛，每年吸引来自全球40多个国家的400多支队伍参赛。作为BNUZH-China团队的Wiki组成员，我负责开发团队的Wiki页面，这是展示团队研究成果和项目进展的重要平台。

项目的主要目标是创建一个现代化、响应式的Wiki页面，能够有效展示复杂的科研数据和研究成果，同时提供良好的用户体验。页面需要处理大量的文字内容、动画图表、实验数据等科研资料，总数据量超过50MB。`,
        features: [
          '响应式设计，完美适配桌面、平板和移动设备',
          '10+个动态交互模块，包括数据可视化、动画效果等',
          '优化的图片和资源加载，提升页面性能',
          'SEO友好的页面结构，提高搜索引擎排名',
          '无障碍设计，确保所有用户都能正常访问',
          '多语言支持，满足国际竞赛需求'
        ],
        techStack: {
          frontend: ['HTML5', 'CSS3', 'JavaScript (ES6+)', '响应式设计', 'CSS Grid & Flexbox'],
          backend: ['静态网站生成', 'CDN加速', '图片优化'],
          database: ['本地存储', '缓存策略'],
          tools: ['Git版本控制', 'Chrome DevTools', 'Lighthouse性能测试', 'Figma设计工具']
        },
        challenges: [
          '处理大量科研数据（50MB+）的展示和加载优化',
          '设计复杂的交互模块，包括数据可视化和动画效果',
          '确保页面在不同设备和浏览器上的兼容性',
          '在有限的时间内完成高质量的开发工作',
          '平衡视觉效果和页面性能',
          '满足iGEM官方对Wiki页面的严格要求'
        ],
        solutions: [
          '采用懒加载和分页技术，优化大数据量的加载性能',
          '使用CSS3动画和JavaScript实现流畅的交互效果',
          '采用渐进式增强的设计理念，确保基础功能在所有设备上可用',
          '建立高效的开发流程，包括设计评审、代码审查和测试',
          '使用WebP格式图片和CDN加速，提升资源加载速度',
          '严格按照iGEM官方规范进行开发，确保合规性'
        ],
        results: [
          '成功获得iGEM最佳Wiki提名，这是对页面质量的最高认可',
          '页面加载速度提升40%，用户体验显著改善',
          '在移动设备上的访问量占比达到60%',
          '获得了评委和用户的一致好评',
          '为团队在iGEM竞赛中取得优异成绩做出了重要贡献',
          '建立了可复用的前端开发模板，为后续项目提供参考'
        ],
        lessons: [
          '前端开发不仅仅是技术实现，更需要理解用户需求和业务目标',
          '性能优化是前端开发中不可忽视的重要环节',
          '响应式设计在现代Web开发中的重要性',
          '团队协作和沟通在项目成功中的关键作用',
          '持续学习和关注新技术对提升开发能力的重要性',
          '用户体验设计需要从用户角度思考问题'
        ]
      },
      team: ['BobHuang (前端开发)', '张三 (UI设计)', '李四 (内容编辑)'],
      timeline: '2024年3月 - 2024年10月',
      github: 'https://github.com/bnuzh-china/igem-wiki'
    },
    'shantou-system': {
      id: 'shantou-system',
      title: '汕头善堂收客记录系统',
      description: '数字人文课程项目，开发低门槛数据管理系统，前端使用TS+React设计搜索页与统计看板，后端基于Python Flask搭建API，实现多字段模糊搜索与分组统计',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=1000',
      tags: ['TypeScript', 'React', 'Python', 'Flask'],
      link: '/demo',
      demoLink: '/demo-desc',
      content: {
        overview: `汕头善堂收客记录系统是一个数字人文课程项目，旨在为历史研究者提供一个低门槛的数据管理平台。该系统主要用于管理和分析汕头地区善堂的历史收客记录，帮助研究者更好地理解历史社会现象。

项目采用前后端分离的架构，前端使用TypeScript和React构建现代化的用户界面，后端使用Python Flask提供RESTful API服务。系统支持多字段模糊搜索、数据统计分析和可视化展示等功能。`,
        features: [
          '低门槛数据管理系统，非技术人员可直接运行',
          '多字段模糊搜索功能，支持复杂查询条件',
          '实时数据统计和可视化展示',
          '响应式设计，支持多种设备访问',
          '数据导出功能，支持多种格式',
          '用户权限管理，确保数据安全'
        ],
        techStack: {
          frontend: ['TypeScript', 'React', 'Ant Design', 'ECharts', 'Axios'],
          backend: ['Python', 'Flask', 'SQLAlchemy', 'RESTful API'],
          database: ['SQLite', '数据迁移', '备份恢复'],
          tools: ['Git', 'Postman', 'VS Code', 'Chrome DevTools']
        },
        challenges: [
          '设计低门槛的系统，让非技术人员也能轻松使用',
          '处理大量历史数据的存储和查询性能',
          '实现复杂的多字段模糊搜索算法',
          '确保系统的稳定性和数据安全性',
          '优化前端性能，提升用户体验',
          '打包为可执行文件，简化部署流程'
        ],
        solutions: [
          '采用直观的用户界面设计，减少学习成本',
          '使用数据库索引和查询优化技术',
          '实现高效的搜索算法，支持多条件组合查询',
          '建立完善的错误处理和数据验证机制',
          '使用代码分割和懒加载优化前端性能',
          '使用PyInstaller将后端打包为可执行文件'
        ],
        results: [
          '成功开发出低门槛的数据管理系统',
          '系统运行稳定，处理数据量达到万级别',
          '搜索功能响应速度快，用户体验良好',
          '获得了课程老师和同学的一致好评',
          '为数字人文研究提供了实用的工具',
          '建立了可复用的全栈开发模板'
        ],
        lessons: [
          '用户体验设计在系统开发中的重要性',
          '前后端分离架构的优势和挑战',
          '数据库设计和查询优化的重要性',
          '代码质量和可维护性的重要性',
          '项目文档和用户手册的必要性',
          '团队协作和版本控制的重要性'
        ]
      },
      team: ['BobHuang (全栈开发)', '王五 (数据分析)', '赵六 (历史研究)'],
      timeline: '2024年1月 - 2024年6月',
      github: 'https://github.com/bobhuang/shantou-system'
    },
    'government-data': {
      id: 'government-data',
      title: '政府采购数据分析系统',
      description: '国家级大创项目，使用Python处理10万+政府采购合同数据，通过jieba分词与匹配解析省份与地级市信息，构建城市加权税收依赖度指标体系，进行回归分析',
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
      tags: ['Python', '数据分析', '机器学习', 'jieba'],
      link: '/demo',
      demoLink: '/demo-desc',
      content: {
        overview: `政府采购数据分析系统是一个国家级大学生创新创业训练计划项目，旨在通过分析政府采购数据来研究地方政府财政依赖度问题。项目处理了超过10万条政府采购合同数据，通过数据挖掘和机器学习技术，构建了城市加权税收依赖度指标体系。

该项目不仅涉及数据处理和分析，还包括学术研究和论文撰写，最终获得了京师杯一等奖的荣誉。`,
        features: [
          '大规模数据处理，支持10万+数据记录',
          '智能文本分析，使用jieba分词技术',
          '地理信息匹配，自动识别省市信息',
          '指标体系构建，计算加权税收依赖度',
          '回归分析模型，进行统计建模',
          '可视化展示，生成分析报告'
        ],
        techStack: {
          frontend: ['Jupyter Notebook', 'Matplotlib', 'Seaborn', 'Plotly'],
          backend: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'],
          database: ['CSV文件', 'Excel', '数据清洗'],
          tools: ['jieba分词', '正则表达式', 'Git', 'LaTeX']
        },
        challenges: [
          '处理大规模数据，确保数据质量和完整性',
          '设计准确的地理信息匹配算法',
          '构建科学的指标体系',
          '选择合适的统计分析方法',
          '处理中文文本分析的特殊性',
          '撰写高质量的学术论文'
        ],
        solutions: [
          '建立完善的数据清洗和验证流程',
          '使用多种匹配策略提高地理信息识别准确率',
          '参考相关研究文献，构建合理的指标体系',
          '采用多种回归模型进行对比分析',
          '优化jieba分词词典，提高中文处理效果',
          '多次修改和完善论文内容'
        ],
        results: [
          '成功处理10万+政府采购数据',
          '构建了城市加权税收依赖度指标体系',
          '完成了高质量的学术论文',
          '获得京师杯一等奖荣誉',
          '为相关研究提供了新的方法和思路',
          '提升了数据分析和学术研究能力'
        ],
        lessons: [
          '数据科学项目的完整流程和方法论',
          '学术研究的基本方法和规范',
          '大规模数据处理的技术和技巧',
          '中文文本分析的特殊处理方法',
          '统计建模和机器学习的基本原理',
          '学术论文写作和表达的重要性'
        ]
      },
      team: ['BobHuang (数据分析)', '孙七 (指导教师)', '周八 (研究助理)'],
      timeline: '2023年9月 - 2024年5月',
      github: 'https://github.com/bobhuang/government-data-analysis'
    }
  };

  // 获取项目数据，如果没有指定ID或找不到项目，使用默认项目
  const projectData = projectsData[id || 'igem-wiki'] || projectsData['igem-wiki'];

  const sections = [
    { id: 'overview', title: '项目概述', icon: Globe },
    { id: 'features', title: '主要功能', icon: Code2 },
    { id: 'techStack', title: '技术栈', icon: Database },
    { id: 'challenges', title: '挑战与困难', icon: Shield },
    { id: 'solutions', title: '解决方案', icon: Zap },
    { id: 'results', title: '项目成果', icon: Users },
    { id: 'lessons', title: '经验总结', icon: Calendar }
  ];

  const scrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let current = '';

      sections.forEach((section) => {
        const sectionElement = section as HTMLElement;
        const sectionTop = sectionElement.offsetTop;
        if (window.scrollY >= sectionTop - 200) {
          current = section.getAttribute('id') || '';
        }
      });

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                返回首页
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href={projectData.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                查看项目
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">目录</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${activeSection === section.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                  >
                    <div className="flex items-center">
                      <section.icon className="h-4 w-4 mr-2" />
                      {section.title}
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Project Header */}
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3">
                  <img
                    src={projectData.image}
                    alt={projectData.title}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
                <div className="lg:w-2/3">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{projectData.title}</h1>
                  <p className="text-gray-600 mb-6">{projectData.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {projectData.tags.map((tag, index) => (
                      <span key={index} className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {projectData.timeline && (
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{projectData.timeline}</span>
                      </div>
                    )}
                    {projectData.github && (
                      <a
                        href={projectData.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
                      >
                        <Code2 className="h-4 w-4 mr-2" />
                        <span>查看源码</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Overview */}
              <section id="overview" className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Globe className="h-6 w-6 mr-3 text-indigo-600" />
                  项目概述
                </h2>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">{projectData.content.overview}</p>
                </div>
              </section>

              {/* Features */}
              <section id="features" className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Code2 className="h-6 w-6 mr-3 text-indigo-600" />
                  主要功能
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectData.content.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Tech Stack */}
              <section id="techStack" className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Database className="h-6 w-6 mr-3 text-indigo-600" />
                  技术栈
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-indigo-600" />
                      前端技术
                    </h3>
                    <ul className="space-y-2">
                      {projectData.content.techStack.frontend.map((tech, index) => (
                        <li key={index} className="text-gray-700 text-sm">• {tech}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Database className="h-5 w-5 mr-2 text-indigo-600" />
                      后端技术
                    </h3>
                    <ul className="space-y-2">
                      {projectData.content.techStack.backend.map((tech, index) => (
                        <li key={index} className="text-gray-700 text-sm">• {tech}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                      数据库
                    </h3>
                    <ul className="space-y-2">
                      {projectData.content.techStack.database.map((tech, index) => (
                        <li key={index} className="text-gray-700 text-sm">• {tech}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Zap className="h-5 w-5 mr-2 text-indigo-600" />
                      开发工具
                    </h3>
                    <ul className="space-y-2">
                      {projectData.content.techStack.tools.map((tech, index) => (
                        <li key={index} className="text-gray-700 text-sm">• {tech}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Challenges */}
              <section id="challenges" className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Shield className="h-6 w-6 mr-3 text-indigo-600" />
                  挑战与困难
                </h2>
                <div className="space-y-4">
                  {projectData.content.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{challenge}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Solutions */}
              <section id="solutions" className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Zap className="h-6 w-6 mr-3 text-indigo-600" />
                  解决方案
                </h2>
                <div className="space-y-4">
                  {projectData.content.solutions.map((solution, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{solution}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Results */}
              <section id="results" className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Users className="h-6 w-6 mr-3 text-indigo-600" />
                  项目成果
                </h2>
                <div className="space-y-4">
                  {projectData.content.results.map((result, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{result}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Lessons */}
              <section id="lessons" className="bg-white rounded-lg shadow-sm p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Calendar className="h-6 w-6 mr-3 text-indigo-600" />
                  经验总结
                </h2>
                <div className="space-y-4">
                  {projectData.content.lessons.map((lesson, index) => (
                    <div key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{lesson}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
