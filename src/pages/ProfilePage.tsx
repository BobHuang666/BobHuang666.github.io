import { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Code2,
  Award,
  BookOpen,
  Heart,
  Plane,
  Camera,
  Music,
  Gamepad2,
  Coffee,
  Globe,
  Database,
  Shield,
  Brain,
  Trophy,
  Users,
  Github,
  Star,
  Clock
} from 'lucide-react';

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('basic');

  const User = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const basicInfo = {
    name: "Bob Huang",
    title: "数据科学与大数据技术专业学生",
    // avatar: "https://www.red-official.cn/assets/red-logo-tJoEccrT.svg",
    avatar: "/static/img/avatar.jpg",
    email: "bob.huang@example.com",
    phone: "+86 138-0000-0000",
    location: "北京师范大学",
    birthDate: "2004年11月",
    education: "北京师范大学 数据科学与大数据技术专业",
    grade: "2023级本科生"
  };

  const tabs = [
    { id: 'basic', name: '基本信息', icon: User },
    { id: 'skills', name: '技能专长', icon: Code2 },
    { id: 'awards', name: '获奖经历', icon: Award },
    { id: 'courses', name: '课程成绩', icon: BookOpen },
    { id: 'interests', name: '兴趣爱好', icon: Heart },
    { id: 'experiences', name: '个人经历', icon: Plane }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
            <div className="relative">
              <img
                src={basicInfo.avatar}
                alt={basicInfo.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{basicInfo.name}</h1>
              <p className="text-xl text-indigo-600 mb-4">{basicInfo.title}</p>
              <p className="text-gray-600 mb-6">热爱编程的算法竞赛选手，专注于全栈开发与数据科学</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-3 text-indigo-500" />
                  <span>{basicInfo.email}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-3 text-indigo-500" />
                  <span>{basicInfo.phone}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-3 text-indigo-500" />
                  <span>{basicInfo.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3 text-indigo-500" />
                  <span>{basicInfo.birthDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 whitespace-nowrap transition-colors ${activeTab === tab.id
                  ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                  : 'text-gray-600 hover:text-indigo-600 hover:bg-gray-50'
                  }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {activeTab === 'basic' && <BasicInfoTab />}
          {activeTab === 'skills' && <SkillsTab />}
          {activeTab === 'awards' && <AwardsTab />}
          {activeTab === 'courses' && <CoursesTab />}
          {activeTab === 'interests' && <InterestsTab />}
          {activeTab === 'experiences' && <ExperiencesTab />}
        </div>
      </div>
    </div>
  );
}

function BasicInfoTab() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <GraduationCap className="h-8 w-8 text-indigo-600 mr-3" />
          教育背景
        </h3>
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">学校</h4>
              <p className="text-gray-700">北京师范大学 数据科学与大数据技术专业</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">年级</h4>
              <p className="text-gray-700">2023级本科生</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">专业</h4>
              <p className="text-gray-700">数据科学与大数据技术</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">GPA</h4>
              <p className="text-gray-700">3.8/4.0</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <Users className="h-8 w-8 text-indigo-600 mr-3" />
          学生工作
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">程序设计竞赛社团社长</h4>
            <p className="text-gray-700 mb-3">2025年9月 - 至今</p>
            <p className="text-gray-600">组织算法相关比赛与活动，培养同学们的编程兴趣</p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">校团委青年科技创新协会学术创新部部长</h4>
            <p className="text-gray-700 mb-3">2024年3月 - 至今</p>
            <p className="text-gray-600">负责学术创新活动的组织与策划</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkillsTab() {
  const skills = [
    {
      category: "编程语言",
      icon: Code2,
      skills: [
        { name: "C/C++", level: 95, color: "from-blue-500 to-blue-600" },
        { name: "Java", level: 90, color: "from-orange-500 to-orange-600" },
        { name: "Python", level: 88, color: "from-yellow-500 to-yellow-600" },
        { name: "JavaScript", level: 85, color: "from-yellow-400 to-yellow-500" },
        { name: "TypeScript", level: 80, color: "from-blue-400 to-blue-500" }
      ]
    },
    {
      category: "前端开发",
      icon: Globe,
      skills: [
        { name: "React", level: 85, color: "from-cyan-500 to-cyan-600" },
        { name: "Vue", level: 80, color: "from-green-500 to-green-600" },
        { name: "HTML/CSS", level: 90, color: "from-orange-500 to-orange-600" },
        { name: "响应式设计", level: 85, color: "from-purple-500 to-purple-600" }
      ]
    },
    {
      category: "后端开发",
      icon: Database,
      skills: [
        { name: "Flask", level: 80, color: "from-gray-500 to-gray-600" },
        { name: "MySQL", level: 75, color: "from-blue-500 to-blue-600" },
        { name: "SQLServer", level: 70, color: "from-red-500 to-red-600" },
        { name: "API设计", level: 85, color: "from-green-500 to-green-600" }
      ]
    },
    {
      category: "工具技能",
      icon: Shield,
      skills: [
        { name: "Git", level: 90, color: "from-orange-500 to-orange-600" },
        { name: "Linux", level: 80, color: "from-yellow-500 to-yellow-600" },
        { name: "Docker", level: 70, color: "from-blue-500 to-blue-600" },
        { name: "算法", level: 95, color: "from-purple-500 to-purple-600" }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {skills.map((category, index) => (
        <div key={index}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <category.icon className="h-8 w-8 text-indigo-600 mr-3" />
            {category.category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.skills.map((skill, skillIndex) => (
              <div key={skillIndex} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{skill.name}</span>
                  <span className="text-sm text-gray-500">{skill.level}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${skill.color}`}
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AwardsTab() {
  const awards = [
    {
      title: "蓝桥杯决赛三等奖",
      organization: "第十六届蓝桥杯",
      year: "2024",
      description: "C/C++大学A组决赛三等奖，算法竞赛领域的重要成就",
      icon: Trophy,
      color: "from-yellow-500 to-orange-500"
    },
    {
      title: "iGEM最佳Wiki提名",
      organization: "国际基因工程机器大赛",
      year: "2024",
      description: "负责Wiki前端开发，获最佳Wiki提名，全球顶级合成生物学竞赛",
      icon: Award,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "京师杯一等奖",
      organization: "北京师范大学",
      year: "2024",
      description: "政府采购与新质生产力发展研究论文获一等奖",
      icon: BookOpen,
      color: "from-green-500 to-teal-500"
    },
    {
      title: "CCF算法能力大赛区域赛二等奖",
      organization: "CCF算法能力大赛",
      year: "2023",
      description: "算法竞赛区域赛二等奖，展示算法设计与编程能力",
      icon: Brain,
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "北京师范大学程序设计大赛金奖",
      organization: "北京师范大学",
      year: "2023",
      description: "校内程序设计大赛最高荣誉，体现编程实力",
      icon: Code2,
      color: "from-red-500 to-pink-500"
    },
    {
      title: "全国大学生数学建模竞赛广东省二等奖",
      organization: "全国大学生数学建模竞赛",
      year: "2023",
      description: "数学建模竞赛省级二等奖，展示数学建模与问题解决能力",
      icon: Users,
      color: "from-indigo-500 to-purple-500"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {awards.map((award, index) => (
          <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${award.color} flex items-center justify-center mr-4`}>
                <award.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{award.title}</h4>
                <p className="text-sm text-gray-600">{award.organization}</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">{award.description}</p>
            <div className="flex items-center justify-between">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                {award.year}
              </span>
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoursesTab() {
  const courses = [
    {
      name: "数据结构与算法",
      grade: "A+",
      description: "掌握基础数据结构与算法设计，为竞赛打下坚实基础",
      semester: "2023年春季"
    },
    {
      name: "数据库系统原理",
      grade: "A",
      description: "深入学习数据库设计与管理，掌握SQL优化技术",
      semester: "2023年秋季"
    },
    {
      name: "机器学习",
      grade: "A-",
      description: "学习机器学习算法原理，掌握Python在AI领域的应用",
      semester: "2024年春季"
    },
    {
      name: "Web开发技术",
      grade: "A+",
      description: "全栈开发实践，掌握前后端分离架构",
      semester: "2023年秋季"
    },
    {
      name: "数据挖掘",
      grade: "A",
      description: "学习数据挖掘技术，掌握大数据处理流程",
      semester: "2024年春季"
    },
    {
      name: "软件工程",
      grade: "A-",
      description: "了解软件开发流程，掌握项目管理方法",
      semester: "2023年春季"
    }
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">{course.name}</h4>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${course.grade === 'A+' ? 'bg-green-100 text-green-800' :
                course.grade === 'A' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                {course.grade}
              </span>
            </div>
            <p className="text-gray-700 mb-3">{course.description}</p>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-2" />
              {course.semester}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InterestsTab() {
  const interests = [
    {
      category: "技术爱好",
      icon: Code2,
      items: [
        { name: "算法竞赛", description: "热爱解决算法问题，参与各类编程竞赛", icon: Brain },
        { name: "开源项目", description: "积极参与开源社区，贡献代码", icon: Github },
        { name: "技术博客", description: "分享技术心得，记录学习历程", icon: BookOpen }
      ]
    },
    {
      category: "生活爱好",
      icon: Heart,
      items: [
        { name: "摄影", description: "喜欢用镜头记录生活中的美好瞬间", icon: Camera },
        { name: "音乐", description: "古典音乐爱好者，偶尔弹钢琴", icon: Music },
        { name: "游戏", description: "策略类游戏爱好者，享受思考的乐趣", icon: Gamepad2 },
        { name: "咖啡", description: "咖啡文化爱好者，喜欢尝试不同风味", icon: Coffee }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {interests.map((category, index) => (
        <div key={index}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <category.icon className="h-8 w-8 text-indigo-600 mr-3" />
            {category.category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                    <item.icon className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">{item.name}</h4>
                </div>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperiencesTab() {
  const experiences = [
    {
      category: "旅行经历",
      icon: Plane,
      items: [
        {
          title: "云南大理",
          date: "2024年寒假",
          description: "体验白族文化，游览洱海风光，感受古城魅力",
          images: ["https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&q=80&w=400"]
        },
        {
          title: "西安古城",
          date: "2023年暑假",
          description: "探索古都文化，参观兵马俑，品尝陕西美食",
          images: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400"]
        },
        {
          title: "杭州西湖",
          date: "2023年春季",
          description: "漫步西湖十景，体验江南水乡的诗意生活",
          images: ["https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?auto=format&fit=crop&q=80&w=400"]
        }
      ]
    },
    {
      category: "学习经历",
      icon: BookOpen,
      items: [
        {
          title: "iGEM竞赛",
          date: "2024年",
          description: "参与国际基因工程机器大赛，负责Wiki前端开发，获得最佳Wiki提名",
          images: ["https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&q=80&w=400"]
        },
        {
          title: "程序设计社团",
          date: "2023-2024年",
          description: "担任程序设计竞赛社团社长，组织算法相关比赛与活动",
          images: ["https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=400"]
        }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {experiences.map((category, index) => (
        <div key={index}>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <category.icon className="h-8 w-8 text-indigo-600 mr-3" />
            {category.category}
          </h3>
          <div className="space-y-6">
            {category.items.map((item, itemIndex) => (
              <div key={itemIndex} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h4>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {item.date}
                    </div>
                  </div>
                  {item.images && item.images.length > 0 && (
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg mt-4 md:mt-0"
                    />
                  )}
                </div>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProfilePage;
