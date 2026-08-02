import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, LanguageTrack, LessonNode, ReviewItem, AppView } from '../../types';
import { useKleoStore } from '../../store/useKleoStore';
import { useAppStore } from '../../store/useAppStore';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import { DashboardLoader } from './DashboardLoader';

interface DashboardViewProps {
  profile: UserProfile;
  activeNodes: LessonNode[];
  savedPhrases: ReviewItem[];
  onSelectLanguage: (lang: LanguageTrack) => void;
  onSelectNode: (node: LessonNode) => void;
  onNavigate: (view: AppView) => void;
}

let initialDashboardLoaded = false;

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  activeNodes,
  savedPhrases,
  onSelectLanguage,
  onSelectNode,
  onNavigate
}) => {
  const { isDarkMode } = useAppStore();
  const { mood, speechText, bondXp, bondLevel, equippedCosmetics } = useKleoStore();
  const [isLoading, setIsLoading] = useState(!initialDashboardLoaded);

  const handleFinishLoading = () => {
    initialDashboardLoaded = true;
    setIsLoading(false);
  };

  const nextNode = activeNodes.find(n => !profile.completedNodeIds.includes(n.id)) || activeNodes[0];
  const percentGoal = Math.min(100, Math.round((profile.minutesCompletedToday / profile.dailyGoalMinutes) * 100));

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <DashboardLoader key="dashboard-loader" onFinish={handleFinishLoading} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 15 : 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`pt-20 px-4 md:px-8 pb-24 max-w-7xl mx-auto space-y-6 transition-colors duration-250 ${isDarkMode ? 'bg-[#0b0f19]' : 'bg-[#f8fafc]'}`}
      >
      {/* Top Bento Grid Section (12 Columns) */}
      <section className="grid grid-cols-12 gap-6 items-stretch">
        {/* Kleo Hero Mascot Banner Card (Col 8) */}
        <div
          className={`col-span-12 lg:col-span-8 ${isDarkMode ? 'saas-card-dark text-white' : 'saas-card-light text-slate-900'
            } p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden`}
        >
          {/* Decorative Subtle Radial Backdrop */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#FF6B35]/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Kleo Cat Mascot Circle */}
          <div className="relative w-40 h-40 flex-shrink-0">
            <div
              className={`w-full h-full rounded-full border-4 flex items-center justify-center p-2.5 shadow-inner ${isDarkMode ? 'bg-[#0b0f19] border-[#FF6B35]/30' : 'bg-slate-50 border-[#FF6B35]/20'
                }`}
            >
              <KleoAvatar mood={mood} equippedCosmetics={equippedCosmetics} size={130} />
            </div>
            <div className="absolute -bottom-2 right-1.5 bg-gradient-to-r from-[#FF6B35] to-[#ff7849] text-white font-black text-[11px] px-3 py-0.5 rounded-full shadow-md uppercase tracking-wider">
              {mood}
            </div>
          </div>

          {/* Kleo Content & Speech Card */}
          <div className="flex-1 space-y-4 z-10 text-center md:text-left w-full">
            {/* Speech Bubble */}
            <div
              className={`inline-block px-5 py-3 rounded-2xl rounded-tl-none border shadow-2xs ${isDarkMode
                  ? 'bg-[#1e293b] border-[#334155] text-white'
                  : 'bg-[#fff7ed] border-[#ffe4c9] text-slate-900 font-medium'
                }`}
            >
              <p className="font-display font-bold text-sm md:text-base leading-relaxed">
                "{speechText}"
              </p>
            </div>

            {/* Kleo Bond Level Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1 text-xs font-bold">
                <span className={`uppercase tracking-tight ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                  Kleo Bond Level {bondLevel}
                </span>
                <span className="text-[#FF6B35] font-mono font-extrabold">{bondXp} / 1000 XP</span>
              </div>
              <div className={`h-2.5 w-full rounded-full overflow-hidden border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-slate-100 border-slate-200'}`}>
                <div
                  className="h-full bg-gradient-to-r from-[#FF6B35] to-[#ff7849] rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${Math.min(100, (bondXp % 100))}%` }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-1 justify-center md:justify-start">
              {/* Practice Now Primary CTA */}
              <button
                onClick={() => nextNode && onSelectNode(nextNode)}
                className="btn-vibrant-orange px-6 py-2.5 rounded-xl text-xs flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                  play_circle
                </span>
                <span>Practice Now</span>
              </button>

              {/* Chat with Kleo Ghost Button */}
              <button
                onClick={() => onNavigate('chatbot')}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all border ${isDarkMode
                    ? 'border-[#334155] text-slate-200 hover:bg-[#1e293b] hover:border-[#FF6B35]/50'
                    : 'border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                Chat with Kleo
              </button>
            </div>
          </div>
        </div>

        {/* Daily Goal Progress Card (Col 4) */}
        <div
          className={`col-span-12 lg:col-span-4 ${isDarkMode ? 'saas-card-dark text-white' : 'saas-card-light text-slate-900'
            } p-6 flex flex-col items-center justify-center text-center space-y-4`}
        >
          <h3 className={`font-display text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Daily Goal
          </h3>

          {/* Circular Progress Gauge */}
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className={isDarkMode ? 'text-[#1e293b]' : 'text-slate-100'}
                cx="72"
                cy="72"
                fill="transparent"
                r="56"
                stroke="currentColor"
                strokeWidth="10"
              />
              <circle
                className="text-[#FF6B35] transition-all duration-700"
                cx="72"
                cy="72"
                fill="transparent"
                r="56"
                stroke="currentColor"
                strokeDasharray="351.8"
                strokeDashoffset={351.8 - (351.8 * percentGoal) / 100}
                strokeLinecap="round"
                strokeWidth="10"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`font-display text-3xl font-black leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {profile.minutesCompletedToday}
              </span>
              <span className="text-xs font-semibold text-[#FF6B35] mt-1">/ {profile.dailyGoalMinutes} min</span>
            </div>
          </div>

          <p className={`text-xs px-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            You've completed <strong className="text-[#FF6B35]">{percentGoal}%</strong> of today's study block. Keep it up!
          </p>
        </div>
      </section>

      {/* Bottom Grid Section: Sequence Card + 4 Quick Action Cards */}
      <section className="grid grid-cols-12 gap-6">
        {/* Next Up In Sequence Card (Col 7) */}
        {nextNode && (
          <div
            onClick={() => onSelectNode(nextNode)}
            className={`col-span-12 md:col-span-7 ${isDarkMode ? 'saas-card-dark text-white' : 'saas-card-light text-slate-900'
              } p-6 flex flex-col justify-between group cursor-pointer border-l-4 border-l-[#FF6B35]`}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-widest">
                  Next Up In Sequence
                </span>
                <h2 className={`font-display text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {nextNode.title}
                </h2>
                <p className={`text-xs leading-relaxed max-w-md ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {nextNode.description}
                </p>
              </div>

              <div className="w-12 h-12 bg-[#fff7ed] rounded-2xl flex items-center justify-center text-[#FF6B35] group-hover:scale-110 transition-transform shrink-0 border border-[#ffe4c9]">
                <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#FF6B35]">
                <span className="material-symbols-outlined text-base">stars</span>
                <span>+{nextNode.xpReward} XP Reward</span>
              </div>

              <button className="btn-vibrant-orange px-5 py-2 rounded-xl text-xs flex items-center gap-1.5">
                <span>Continue</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* 4 Quick Access Widgets (Col 5) */}
        <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">
          {/* Translator Widget */}
          <div
            onClick={() => onNavigate('translator')}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer transition-all ${isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] hover:border-[#FF6B35]/40 hover:bg-[#1a243d]'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
          >
            <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#FF6B35] border border-[#ffe4c9]">
              <span className="material-symbols-outlined text-xl">translate</span>
            </div>
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Translator</span>
          </div>

          {/* Review Widget */}
          <div
            onClick={() => onNavigate('review')}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer relative transition-all ${isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] hover:border-[#FF6B35]/40 hover:bg-[#1a243d]'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
          >
            {savedPhrases.length > 0 && (
              <span className="absolute top-2.5 right-2.5 bg-[#FF6B35] text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-xs">
                {savedPhrases.length} DUE
              </span>
            )}
            <div className="w-11 h-11 rounded-2xl bg-[#fff7ed] flex items-center justify-center text-[#FF6B35] border border-[#ffe4c9]">
              <span className="material-symbols-outlined text-xl">rebase_edit</span>
            </div>
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Review</span>
          </div>

          {/* League Widget */}
          <div
            onClick={() => onNavigate('gamify')}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer transition-all ${isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] hover:border-[#FF6B35]/40 hover:bg-[#1a243d]'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              <span className="material-symbols-outlined text-xl">leaderboard</span>
            </div>
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>League</span>
          </div>

          {/* Journal Widget */}
          <div
            onClick={() => onNavigate('gamify')}
            className={`p-4 rounded-2xl border flex flex-col items-center justify-center text-center gap-2.5 cursor-pointer transition-all ${isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] hover:border-[#FF6B35]/40 hover:bg-[#1a243d]'
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-2xs'
              }`}
          >
            <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
              <span className="material-symbols-outlined text-xl">menu_book</span>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  </>
  );
};
