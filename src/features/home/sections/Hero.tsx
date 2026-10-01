import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Sparkles } from 'lucide-react';
import { uiText } from '../../../data/uiText';
import { profile } from '../../../data/profile';
import { scrollToId } from '../../../utils/scroll';
import { HeroBackground } from '../../../shared/components/effects/HeroBackground';
import Avatar from '../../../shared/components/ui/Avatar';
import { TypeWriter } from '../TypeWriter';

/** Hero：头像 + 状态徽章 + 打字机标语 + 三个入口按钮 */
export const Hero = () => (
  <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-slate-900 bg-[length:200%_200%] animate-gradient-x">
    {/* 增强背景 —— 网格 + blob + Aurora + 鼠标视差 */}
    <HeroBackground />

    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      {/* 头像 + 状态徽章组合 */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center mb-6"
      >
        <Avatar src={profile.avatar} name={profile.name} size="md" showRing showStatus />

        {/* 状态文案 —— 紧贴头像下方 */}
        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur text-white/95 text-xs border border-white/20">
          {uiText.home.status}
        </div>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight"
      >
        {profile.name}
        <span className="block text-lg md:text-2xl font-medium text-white/85 mt-2">
          {profile.education[0].major} · {profile.education[0].degree}
        </span>
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed min-h-[3.5rem]"
      >
        <TypeWriter sequences={uiText.home.taglines} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap justify-center gap-3"
      >
        <button
          type="button"
          onClick={() => scrollToId('projects')}
          className="inline-flex items-center px-6 py-3 rounded-lg font-medium bg-white text-indigo-600 hover:bg-slate-50 transition-colors shadow-lg"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          {uiText.common.viewProjects}
        </button>
        <Link
          to="/profile"
          className="inline-flex items-center px-6 py-3 rounded-lg font-medium border-2 border-white/70 text-white hover:bg-white hover:text-indigo-600 transition-colors"
        >
          {uiText.common.aboutMe} <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
        <button
          type="button"
          onClick={() => scrollToId('contact')}
          className="inline-flex items-center px-6 py-3 rounded-lg font-medium border-2 border-white/70 text-white hover:bg-white hover:text-indigo-600 transition-colors"
        >
          <Mail className="h-4 w-4 mr-2" /> {uiText.common.contactMe}
        </button>
      </motion.div>
    </div>
  </section>
);
