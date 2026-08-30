import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, LanguageTrack, LessonNode, ReviewItem, AppView } from '../../types';
import { useKleoStore } from '../../store/useKleoStore';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { DashboardLoader } from './DashboardLoader';
import { OverviewRightSidebar } from './OverviewRightSidebar';
import {
  GraduationCap,
  RotateCw,
  Layers,
  Scan,
  MessageSquare,
  Type,
  Globe,
  Award
} from 'lucide-react';
import kleoHalfBody from '../../assets/kleo_2d_half_body.png';
import kleoChatbotLogo from '../../assets/kleo_chatbot_logo.png';

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
  const { mood, bondLevel, equippedCosmetics, speechText } = useKleoStore();
  const { t, getLanguageName } = useTranslation();

  const [isLoading, setIsLoading] = useState(!initialDashboardLoaded);
  const [showSyllableBuilder, setShowSyllableBuilder] = useState(false);

  // Syllable block builder state
  const [selectedConsonant, setSelectedConsonant] = useState('ㅁ');
  const [selectedVowel, setSelectedVowel] = useState('ㅏ');

  const consonants = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const vowels = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ'];

  const handleFinishLoading = () => {
    initialDashboardLoaded = true;
    setIsLoading(false);
  };

  const nextNode = activeNodes.find(n => !profile.completedNodeIds.includes(n.id)) || activeNodes[0];
  const percentGoal = Math.min(100, Math.round((profile.minutesCompletedToday / profile.dailyGoalMinutes) * 100));

  const activeLangName =
    profile.selectedLanguage === 'ko'
      ? 'Korean'
      : profile.selectedLanguage === 'ja'
      ? 'Japanese'
      : 'English';

  const scriptName =
    profile.selectedLanguage === 'ko'
      ? 'Hangul'
      : profile.selectedLanguage === 'ja'
      ? 'Hiragana & Kanji'
      : 'Phonics & Words';

  // Extract first name or learner name
  const rawName = profile.name && profile.name.trim().length > 0 ? profile.name : 'Learner';
  const firstName = rawName.split(' ')[0];

  // Dynamic Date Formatter
  const formattedDate = useMemo(() => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return now.toLocaleDateString('en-US', options).toUpperCase();
  }, []);

  // Greeting Time of Day
  const greetingText = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return t.dashboard.goodMorning;
    if (hour < 18) return t.dashboard.goodAfternoon;
    return t.dashboard.goodEvening;
  }, [t]);

  // Overall Mastery Calculation
  const totalNodesCount = activeNodes.length || 10;
  const completedNodesCount = profile.completedNodeIds.length || 3;
  const overallMastery = Math.min(100, Math.max(15, Math.round((completedNodesCount / totalNodesCount) * 100)));

  // 7-day study consistency data (M, T, W, T, F, S, S)
  const daysOfWeek = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // 0=Mon, 6=Sun
  const weeklyStudyMins = [12, 18, 15, 22, 10, profile.minutesCompletedToday || 8, 14];

  // Dynamic Mascot Tip
  const mascotTip = useMemo(() => {
    if (speechText) return speechText;
    if (profile.selectedLanguage === 'ko') {
      return `Hangul syllable & vocabulary practice is active today. Complete 1 review session to keep your ${profile.streakDays || 5}-day streak going strong!`;
    }
    if (profile.selectedLanguage === 'ja') {
      return `Hiragana foundation & daily phrases are ready. Practice for ${profile.dailyGoalMinutes} minutes today to level up your bond!`;
    }
    return `English idioms and phonetic practice are loaded. Keep your study streak active today!`;
  }, [speechText, profile.selectedLanguage, profile.streakDays, profile.dailyGoalMinutes]);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <DashboardLoader key="dashboard-loader" onFinish={handleFinishLoading} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 12 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className={`pt-20 px-4 sm:px-6 lg:px-8 pb-24 w-full transition-colors duration-200 ${
          isDarkMode ? 'bg-[#0b0f19] text-white' : 'bg-[#FAF6F0] text-[#2B2725]'
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
          {/* Main Dashboard Workspace Content */}
          <div className="flex-1 min-w-0 space-y-6 w-full">
            
            {/* 1. Header Section: Greeting */}
            <div className="space-y-1">
              {/* Dynamic Greeting */}
              <div className="flex items-center justify-between">
                <h1 className={`font-display text-2xl md:text-3xl font-extrabold tracking-tight ${
                  isDarkMode ? 'text-white' : 'text-[#1E2433]'
                }`}>
                  {greetingText}, {firstName}!
                </h1>
                <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-[#7A736E] dark:text-slate-300 bg-[#FAF6F0] dark:bg-[#131b2e] px-3.5 py-1.5 rounded-xl border border-white/90 dark:border-white/[0.04] shadow-[-3px_-3px_7px_rgba(255,255,255,0.95),3px_3px_7px_rgba(215,200,185,0.55)] dark:shadow-[-2px_-2px_5px_rgba(255,255,255,0.03),2px_2px_5px_rgba(0,0,0,0.55)]">
                  <span className="material-symbols-outlined text-sm text-[#F06543]">translate</span>
                  <span>{getLanguageName(profile.selectedLanguage as LanguageTrack)}</span>
                </div>
              </div>
            </div>

            {/* 2. Hero Section: Mascot AI Tutor Banner (Full Width) */}
            <div className="w-full relative rounded-[26px] bg-gradient-to-r from-[#ff6b4a] to-[#f05a36] p-4 sm:p-5 sm:px-6 overflow-hidden border border-[#ff8366]/40 shadow-[0_8px_30px_rgba(240,90,54,0.3)] flex items-center gap-4 sm:gap-6">
              {/* Background decorative wave */}
              <div className="absolute right-0 top-0 bottom-0 w-44 bg-white/[0.1] rounded-l-full pointer-events-none" />
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/[0.08] rounded-full blur-2xl pointer-events-none" />

              {/* Mascot Illustration - Aligned Flush to Bottom Border */}
              <div className="relative shrink-0 self-end flex items-end justify-center w-28 sm:w-36 md:w-40 h-28 sm:h-36 md:h-40 -mb-4 sm:-mb-5 select-none">
                <img
                  src={kleoHalfBody}
                  alt="Kleo AI Tutor Companion"
                  className="w-full h-full object-contain object-bottom drop-shadow-md hover:scale-105 transition-transform duration-300 pointer-events-none"
                  draggable={false}
                />
              </div>

              {/* Mascot Speech Bubble Card */}
              <div className="relative flex-1 bg-white dark:bg-[#121624] rounded-2xl p-3.5 sm:p-4 shadow-sm border border-white/80 dark:border-slate-700/60">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-extrabold text-xs sm:text-sm text-[#f05a36] dark:text-[#ff6b4a] flex items-center gap-1.5">
                    <span>Kleo</span>
                  </span>
                  <button
                    onClick={() => onNavigate('chatbot')}
                    className="text-xs font-bold text-[#f05a36] hover:text-[#d84824] dark:text-[#ff7e61] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Chat</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
                <p className="text-xs sm:text-sm text-[#2B3545] dark:text-slate-200 leading-relaxed font-medium">
                  {mascotTip}
                </p>
              </div>
            </div>

            {/* 3. Quick Actions Section (Below Banner, Full Width) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#7A736E] dark:text-slate-400">
                  {t.dashboard.quickActions}
                </h3>
                <span className="text-[11px] font-bold text-[#F06543]">{activeNodes.length} nodes ready</span>
              </div>

              {/* Horizontal Quick Actions Grid across full width */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-3.5">
                {/* Action 1: Lessons */}
                <button
                  onClick={() => onNavigate('learn')}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-4px_-4px_10px_rgba(255,255,255,1),4px_4px_10px_rgba(215,200,185,0.6)] dark:shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),3px_3px_8px_rgba(0,0,0,0.55)] hover:shadow-[-2px_-2px_6px_rgba(255,255,255,1),2px_2px_6px_rgba(215,200,185,0.7)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(215,200,185,0.65),inset_-2px_-2px_5px_rgba(255,255,255,0.95)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),inset_-2px_-2px_5px_rgba(255,255,255,0.03)] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.6),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.03)] group-hover:scale-110 transition-transform">
                    <GraduationCap className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="font-bold text-xs text-[#2B2725] dark:text-slate-200 group-hover:text-[#F06543] truncate">
                    Lessons
                  </span>
                </button>

                {/* Action 2: Review Deck */}
                <button
                  onClick={() => onNavigate('review')}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-4px_-4px_10px_rgba(255,255,255,1),4px_4px_10px_rgba(215,200,185,0.6)] dark:shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),3px_3px_8px_rgba(0,0,0,0.55)] hover:shadow-[-2px_-2px_6px_rgba(255,255,255,1),2px_2px_6px_rgba(215,200,185,0.7)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(215,200,185,0.65),inset_-2px_-2px_5px_rgba(255,255,255,0.95)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),inset_-2px_-2px_5px_rgba(255,255,255,0.03)] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group relative"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.6),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.03)] group-hover:scale-110 transition-transform">
                    <RotateCw className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="font-bold text-xs text-[#2B2725] dark:text-slate-200 group-hover:text-[#F06543] truncate">
                    Review
                  </span>
                  {savedPhrases.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-[#F06543] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-xs">
                      {savedPhrases.length}
                    </span>
                  )}
                </button>

                {/* Action 3: Word Match */}
                <button
                  onClick={() => onNavigate('matching')}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-4px_-4px_10px_rgba(255,255,255,1),4px_4px_10px_rgba(215,200,185,0.6)] dark:shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),3px_3px_8px_rgba(0,0,0,0.55)] hover:shadow-[-2px_-2px_6px_rgba(255,255,255,1),2px_2px_6px_rgba(215,200,185,0.7)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(215,200,185,0.65),inset_-2px_-2px_5px_rgba(255,255,255,0.95)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),inset_-2px_-2px_5px_rgba(255,255,255,0.03)] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.6),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.03)] group-hover:scale-110 transition-transform">
                    <Layers className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="font-bold text-xs text-[#2B2725] dark:text-slate-200 group-hover:text-[#F06543] truncate">
                    Match
                  </span>
                </button>

                {/* Action 4: Scanner & Lens */}
                <button
                  onClick={() => onNavigate('scanner')}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-4px_-4px_10px_rgba(255,255,255,1),4px_4px_10px_rgba(215,200,185,0.6)] dark:shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),3px_3px_8px_rgba(0,0,0,0.55)] hover:shadow-[-2px_-2px_6px_rgba(255,255,255,1),2px_2px_6px_rgba(215,200,185,0.7)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(215,200,185,0.65),inset_-2px_-2px_5px_rgba(255,255,255,0.95)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),inset_-2px_-2px_5px_rgba(255,255,255,0.03)] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.6),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.03)] group-hover:scale-110 transition-transform">
                    <Scan className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="font-bold text-xs text-[#2B2725] dark:text-slate-200 group-hover:text-[#F06543] truncate">
                    Scanner
                  </span>
                </button>

                {/* Action 5: Kleo AI Tutor */}
                <button
                  onClick={() => onNavigate('chatbot')}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-4px_-4px_10px_rgba(255,255,255,1),4px_4px_10px_rgba(215,200,185,0.6)] dark:shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),3px_3px_8px_rgba(0,0,0,0.55)] hover:shadow-[-2px_-2px_6px_rgba(255,255,255,1),2px_2px_6px_rgba(215,200,185,0.7)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(215,200,185,0.65),inset_-2px_-2px_5px_rgba(255,255,255,0.95)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),inset_-2px_-2px_5px_rgba(255,255,255,0.03)] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-rose-500/15 text-rose-600 dark:text-rose-400 flex items-center justify-center shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.6),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.03)] group-hover:scale-110 transition-transform">
                    <MessageSquare className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="font-bold text-xs text-[#2B2725] dark:text-slate-200 group-hover:text-[#F06543] truncate">
                    Kleo AI
                  </span>
                </button>

                {/* Action 6: Scripts & Alphabet */}
                <button
                  onClick={() => onNavigate('letters')}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-4px_-4px_10px_rgba(255,255,255,1),4px_4px_10px_rgba(215,200,185,0.6)] dark:shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),3px_3px_8px_rgba(0,0,0,0.55)] hover:shadow-[-2px_-2px_6px_rgba(255,255,255,1),2px_2px_6px_rgba(215,200,185,0.7)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(215,200,185,0.65),inset_-2px_-2px_5px_rgba(255,255,255,0.95)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),inset_-2px_-2px_5px_rgba(255,255,255,0.03)] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.6),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.03)] group-hover:scale-110 transition-transform">
                    <Type className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="font-bold text-xs text-[#2B2725] dark:text-slate-200 group-hover:text-[#F06543] truncate">
                    Scripts
                  </span>
                </button>

                {/* Action 7: Translator */}
                <button
                  onClick={() => onNavigate('translator')}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-4px_-4px_10px_rgba(255,255,255,1),4px_4px_10px_rgba(215,200,185,0.6)] dark:shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),3px_3px_8px_rgba(0,0,0,0.55)] hover:shadow-[-2px_-2px_6px_rgba(255,255,255,1),2px_2px_6px_rgba(215,200,185,0.7)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(215,200,185,0.65),inset_-2px_-2px_5px_rgba(255,255,255,0.95)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),inset_-2px_-2px_5px_rgba(255,255,255,0.03)] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.6),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.03)] group-hover:scale-110 transition-transform">
                    <Globe className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="font-bold text-xs text-[#2B2725] dark:text-slate-200 group-hover:text-[#F06543] truncate">
                    Translate
                  </span>
                </button>

                {/* Action 8: Gamify Hub & Badges */}
                <button
                  onClick={() => onNavigate('gamify')}
                  className="p-3 sm:p-3.5 rounded-2xl bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-4px_-4px_10px_rgba(255,255,255,1),4px_4px_10px_rgba(215,200,185,0.6)] dark:shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),3px_3px_8px_rgba(0,0,0,0.55)] hover:shadow-[-2px_-2px_6px_rgba(255,255,255,1),2px_2px_6px_rgba(215,200,185,0.7)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_5px_rgba(215,200,185,0.65),inset_-2px_-2px_5px_rgba(255,255,255,0.95)] dark:active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.7),inset_-2px_-2px_5px_rgba(255,255,255,0.03)] transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer group"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.6),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.03)] group-hover:scale-110 transition-transform">
                    <Award className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="font-bold text-xs text-[#2B2725] dark:text-slate-200 group-hover:text-[#F06543] truncate">
                    Badges
                  </span>
                </button>
              </div>
            </div>

            {/* 3. Bottom 3-Card Analytics & Feature Row (Last 7 Days | Mastery Distribution | Today's Goal) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              
              {/* Card 1: LAST 7 DAYS Study Activity Bar Chart */}
              <div className="p-5 sm:p-6 rounded-[28px] bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-6px_-6px_16px_rgba(255,255,255,1),6px_6px_16px_rgba(215,200,185,0.6)] dark:shadow-[-4px_-4px_12px_rgba(255,255,255,0.03),4px_4px_12px_rgba(0,0,0,0.55)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#7A736E] dark:text-slate-400">
                      {t.dashboard.last7Days}
                    </h3>
                    <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-[#F2ECE4] dark:bg-[#0c101c] px-2.5 py-1 rounded-full shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_1.5px_1.5px_3px_rgba(0,0,0,0.6),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.03)] border border-white/40 dark:border-white/[0.02]">
                      🔥 100% Active
                    </span>
                  </div>

                  {/* 7-Day Vertical Bar Chart */}
                  <div className="h-32 flex items-end justify-between gap-2 pt-4 px-1">
                    {daysOfWeek.map((day, idx) => {
                      const mins = weeklyStudyMins[idx];
                      const heightPercent = Math.min(100, Math.max(15, (mins / 25) * 100));
                      const isToday = idx === todayDayIndex;

                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                          {/* Tooltip on hover */}
                          <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-[#1E2433] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md whitespace-nowrap z-10 shadow-md">
                            {mins} min
                          </div>

                          {/* Neumorphic Sunken Bar Well */}
                          <div className="w-full max-w-[18px] bg-[#EDE5DA] dark:bg-[#0b0e18] rounded-full h-24 flex items-end justify-center p-0.5 shadow-[inset_2px_2px_5px_rgba(215,200,185,0.65),inset_-2px_-2px_5px_rgba(255,255,255,0.95)] dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.75),inset_-2px_-2px_5px_rgba(255,255,255,0.03)] border border-white/30 dark:border-white/[0.02]">
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: `${heightPercent}%` }}
                              transition={{ duration: 0.6, delay: idx * 0.08, ease: 'easeOut' }}
                              className={`w-full rounded-full transition-colors ${
                                isToday
                                  ? 'bg-gradient-to-t from-[#ff5a36] to-[#ff7b5a] shadow-[0_2px_8px_rgba(255,90,54,0.45)]'
                                  : 'bg-gradient-to-t from-[#38A169] to-[#48BB78] shadow-[0_2px_6px_rgba(56,161,105,0.4)]'
                              }`}
                            />
                          </div>

                          {/* Day Letter Label */}
                          <span className={`text-[11px] font-bold ${
                            isToday
                              ? 'text-[#F06543] font-black'
                              : 'text-[#7A736E] dark:text-slate-400'
                          }`}>
                            {day}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Subtext info */}
                <div className="pt-3 mt-3 border-t border-[#EDE5DA]/80 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-[#7A736E] dark:text-slate-400 font-medium">
                  <span>{t.dashboard.avgStudyTime}: <strong className="text-[#2B2725] dark:text-slate-200 font-bold">14 min/day</strong></span>
                </div>
              </div>

              {/* Card 2: MASTERY DISTRIBUTION Circular Donut Chart */}
              <div className="p-5 sm:p-6 rounded-[28px] bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-6px_-6px_16px_rgba(255,255,255,1),6px_6px_16px_rgba(215,200,185,0.6)] dark:shadow-[-4px_-4px_12px_rgba(255,255,255,0.03),4px_4px_12px_rgba(0,0,0,0.55)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#7A736E] dark:text-slate-400">
                      {t.dashboard.masteryDistribution}
                    </h3>
                  </div>

                  {/* Donut Progress and Breakdown */}
                  <div className="flex items-center gap-4 py-2">
                    {/* SVG Radial Donut Chart with Neumorphic Well */}
                    <div className="relative w-24 h-24 rounded-full shadow-[inset_2px_2px_6px_rgba(215,200,185,0.5),inset_-2px_-2px_6px_rgba(255,255,255,0.95)] dark:shadow-[inset_2px_2px_6px_rgba(0,0,0,0.65),inset_-2px_-2px_6px_rgba(255,255,255,0.03)] bg-[#F2ECE4] dark:bg-[#0c101c] flex items-center justify-center shrink-0 border border-white/40 dark:border-white/[0.02]">
                      <svg className="w-full h-full transform -rotate-90 p-1">
                        <circle
                          className={isDarkMode ? 'text-slate-800/60' : 'text-[#E5DCCF]/50'}
                          cx="44"
                          cy="44"
                          fill="transparent"
                          r="35"
                          stroke="currentColor"
                          strokeWidth="6.5"
                        />
                        {/* Vocabulary Arc (Green) */}
                        <circle
                          className="text-[#38A169] transition-all duration-1000"
                          cx="44"
                          cy="44"
                          fill="transparent"
                          r="35"
                          stroke="currentColor"
                          strokeDasharray="220"
                          strokeDashoffset={220 - (220 * 0.48)}
                          strokeLinecap="round"
                          strokeWidth="6.5"
                        />
                        {/* Grammar Arc (Orange) */}
                        <circle
                          className="text-[#F06543] transition-all duration-1000"
                          cx="44"
                          cy="44"
                          fill="transparent"
                          r="35"
                          stroke="currentColor"
                          strokeDasharray="220"
                          strokeDashoffset={220 - (220 * 0.28)}
                          strokeLinecap="round"
                          strokeWidth="6.5"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="font-display font-extrabold text-lg text-[#1E2433] dark:text-white leading-none">
                          {overallMastery}%
                        </span>
                      </div>
                    </div>

                    {/* Legend Breakdown */}
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-[#7A736E] dark:text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-[#38A169] shadow-xs" />
                          <span className="truncate">{t.dashboard.vocabularyMastery}</span>
                        </span>
                        <strong className="font-bold text-[#2B2725] dark:text-white">48%</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-[#7A736E] dark:text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-[#F06543] shadow-xs" />
                          <span className="truncate">{t.dashboard.grammarMastery}</span>
                        </span>
                        <strong className="font-bold text-[#2B2725] dark:text-white">35%</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 font-medium text-[#7A736E] dark:text-slate-300">
                          <span className="w-2 h-2 rounded-full bg-[#805AD5] shadow-xs" />
                          <span className="truncate">{t.dashboard.scriptMastery}</span>
                        </span>
                        <strong className="font-bold text-[#2B2725] dark:text-white">17%</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Link */}
                <div className="pt-3 mt-3 border-t border-[#EDE5DA]/80 dark:border-slate-800/80 text-center">
                  <button
                    onClick={() => onNavigate('learn')}
                    className="text-xs font-bold text-[#38A169] dark:text-emerald-400 hover:underline cursor-pointer inline-flex items-center gap-1"
                  >
                    {t.dashboard.viewCurriculum}
                  </button>
                </div>
              </div>

              {/* Card 3: TODAY'S PROGRESS & Primary CTA */}
              <div className="p-5 sm:p-6 rounded-[28px] bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-6px_-6px_16px_rgba(255,255,255,1),6px_6px_16px_rgba(215,200,185,0.6)] dark:shadow-[-4px_-4px_12px_rgba(255,255,255,0.03),4px_4px_12px_rgba(0,0,0,0.55)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-extrabold text-xs uppercase tracking-wider text-[#7A736E] dark:text-slate-400">
                      {t.dashboard.todayProgress}
                    </h3>
                    <span className="text-[11px] font-bold text-[#38A169] dark:text-emerald-400 flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[13px]">trending_up</span>
                      <span>+24 XP</span>
                    </span>
                  </div>

                  {/* Metrics Stack with Soft Inset Panels */}
                  <div className="space-y-2 py-1">
                    <div className="flex items-center justify-between text-xs sm:text-sm p-2.5 rounded-xl bg-[#F2ECE4] dark:bg-[#0c101c] shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-1px_-1px_3px_rgba(255,255,255,0.03)] border border-white/50 dark:border-white/[0.02]">
                      <span className="text-[#7A736E] dark:text-slate-400 font-medium">⚡ Total XP</span>
                      <strong className="font-display font-extrabold text-base text-[#1E2433] dark:text-white">
                        {profile.xp || 140} XP
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm p-2.5 rounded-xl bg-[#F2ECE4] dark:bg-[#0c101c] shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-1px_-1px_3px_rgba(255,255,255,0.03)] border border-white/50 dark:border-white/[0.02]">
                      <span className="text-[#7A736E] dark:text-slate-400 font-medium">⏱ Daily Study Goal</span>
                      <strong className="font-bold text-[#2B2725] dark:text-white">
                        {profile.minutesCompletedToday} / {profile.dailyGoalMinutes} min
                      </strong>
                    </div>

                    <div className="flex items-center justify-between text-xs sm:text-sm p-2.5 rounded-xl bg-[#F2ECE4] dark:bg-[#0c101c] shadow-[inset_1.5px_1.5px_3px_rgba(215,200,185,0.5),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.9)] dark:shadow-[inset_2px_2px_4px_rgba(0,0,0,0.6),inset_-1px_-1px_3px_rgba(255,255,255,0.03)] border border-white/50 dark:border-white/[0.02]">
                      <span className="text-[#7A736E] dark:text-slate-400 font-medium">❤️ Health Hearts</span>
                      <strong className="font-bold text-[#F06543]">
                        {profile.hearts}/{profile.maxHearts} Safe
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div className="pt-4 mt-4 border-t border-[#EDE5DA]/80 dark:border-slate-800/80 flex flex-col gap-3">
                  <button
                    onClick={() => nextNode && onSelectNode(nextNode)}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-b from-[#38a169] to-[#2e8455] text-white font-extrabold text-sm tracking-wide shadow-[0_4px_0_#1c5335,0_8px_16px_rgba(46,132,85,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_#1c5335,0_4px_8px_rgba(46,132,85,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2 select-none"
                  >
                    <span>{t.dashboard.continueLesson}</span>
                    <span className="material-symbols-outlined text-base">arrow_forward</span>
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onNavigate('matching')}
                      className="flex-1 py-2.5 sm:py-3 px-3 rounded-xl bg-[#FAF6F0] dark:bg-[#151c2e] hover:bg-white dark:hover:bg-[#1a233a] text-[#2B2725] dark:text-slate-200 text-xs font-bold shadow-[-3px_-3px_7px_rgba(255,255,255,0.95),3px_3px_7px_rgba(215,200,185,0.55)] dark:shadow-[-2px_-2px_6px_rgba(255,255,255,0.03),2px_2px_6px_rgba(0,0,0,0.55)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_4px_rgba(215,200,185,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/80 dark:border-white/[0.04] transition-all text-center cursor-pointer"
                    >
                      Word Match
                    </button>
                    <button
                      onClick={() => onNavigate('review')}
                      className="flex-1 py-2.5 sm:py-3 px-3 rounded-xl bg-[#FAF6F0] dark:bg-[#151c2e] hover:bg-white dark:hover:bg-[#1a233a] text-[#2B2725] dark:text-slate-200 text-xs font-bold shadow-[-3px_-3px_7px_rgba(255,255,255,0.95),3px_3px_7px_rgba(215,200,185,0.55)] dark:shadow-[-2px_-2px_6px_rgba(255,255,255,0.03),2px_2px_6px_rgba(0,0,0,0.55)] hover:scale-[1.02] active:scale-[0.98] active:shadow-[inset_2px_2px_4px_rgba(215,200,185,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/80 dark:border-white/[0.04] transition-all text-center cursor-pointer"
                    >
                      Review Deck
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Interactive Syllable & Script Foundations Lab (Collapsible / Accessible) */}
            <div className="p-6 rounded-[28px] bg-[#FAF6F0] dark:bg-[#131b2e] border border-white/90 dark:border-white/[0.04] shadow-[-6px_-6px_16px_rgba(255,255,255,1),6px_6px_16px_rgba(215,200,185,0.6)] dark:shadow-[-4px_-4px_12px_rgba(255,255,255,0.03),4px_4px_12px_rgba(0,0,0,0.55)] space-y-4 transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`font-display text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
                    {t.dashboard.syllableBuilderTitle}
                  </h3>
                  <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
                    {t.dashboard.syllableBuilderDesc}
                  </p>
                </div>
                <button
                  onClick={() => setShowSyllableBuilder(!showSyllableBuilder)}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#FAF6F0] dark:bg-[#151c2e] hover:bg-white dark:hover:bg-[#1a233a] text-[#2B2725] dark:text-slate-200 shadow-[-3px_-3px_7px_rgba(255,255,255,0.95),3px_3px_7px_rgba(215,200,185,0.55)] dark:shadow-[-2px_-2px_6px_rgba(255,255,255,0.03),2px_2px_6px_rgba(0,0,0,0.55)] active:shadow-[inset_2px_2px_4px_rgba(215,200,185,0.6),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] border border-white/80 dark:border-white/[0.04] cursor-pointer transition-all flex items-center gap-1"
                >
                  <span>{showSyllableBuilder ? 'Hide Lab' : 'Practice Lab'}</span>
                  <span className="material-symbols-outlined text-sm">
                    {showSyllableBuilder ? 'expand_less' : 'expand_more'}
                  </span>
                </button>
              </div>

              {showSyllableBuilder && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex flex-col md:flex-row items-center gap-6 pt-2"
                >
                  {/* Dynamic Syllable Display Card */}
                  <div className="w-32 h-32 rounded-2xl bg-[#F2ECE4] dark:bg-[#0c101c] shadow-[inset_3px_3px_8px_rgba(215,200,185,0.6),inset_-3px_-3px_8px_rgba(255,255,255,0.95)] dark:shadow-[inset_3px_3px_8px_rgba(0,0,0,0.7),inset_-3px_-3px_8px_rgba(255,255,255,0.03)] border border-white/50 dark:border-white/[0.02] flex flex-col items-center justify-center p-3 shrink-0 relative">
                    <span className="font-kr font-black text-4xl text-[#2B2725] dark:text-white">
                      {selectedConsonant}{selectedVowel}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-[#F06543] mt-2 bg-[#FFF4EE] dark:bg-slate-700 px-2 py-0.5 rounded-full border border-[#FDE3D5] dark:border-slate-600 shadow-2xs">
                      {selectedConsonant} + {selectedVowel} ➔ {selectedConsonant}{selectedVowel}
                    </span>
                  </div>

                  {/* Consonants & Vowels Selector */}
                  <div className="flex-1 space-y-3 w-full">
                    {/* Consonants Row */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">
                        {t.dashboard.consonant} ({selectedConsonant})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {consonants.map((c) => (
                          <button
                            key={c}
                            onClick={() => setSelectedConsonant(c)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              selectedConsonant === c
                                ? 'bg-gradient-to-br from-[#ff6b4a] to-[#f05a36] text-white shadow-[0_3px_8px_rgba(240,90,54,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] scale-105'
                                : 'bg-[#FAF6F0] dark:bg-[#151c2e] text-[#2B2725] dark:text-slate-300 shadow-[-2px_-2px_5px_rgba(255,255,255,0.95),2px_2px_5px_rgba(215,200,185,0.5)] dark:shadow-[-2px_-2px_4px_rgba(255,255,255,0.03),2px_2px_4px_rgba(0,0,0,0.5)] active:shadow-[inset_2px_2px_4px_rgba(215,200,185,0.6)] border border-white/70 dark:border-white/[0.03]'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Vowels Row */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">
                        {t.dashboard.vowel} ({selectedVowel})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {vowels.map((v) => (
                          <button
                            key={v}
                            onClick={() => setSelectedVowel(v)}
                            className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                              selectedVowel === v
                                ? 'bg-gradient-to-br from-[#ff6b4a] to-[#f05a36] text-white shadow-[0_3px_8px_rgba(240,90,54,0.4),inset_0_1px_0_rgba(255,255,255,0.4)] scale-105'
                                : 'bg-[#FAF6F0] dark:bg-[#151c2e] text-[#2B2725] dark:text-slate-300 shadow-[-2px_-2px_5px_rgba(255,255,255,0.95),2px_2px_5px_rgba(215,200,185,0.5)] dark:shadow-[-2px_-2px_4px_rgba(255,255,255,0.03),2px_2px_4px_rgba(0,0,0,0.5)] active:shadow-[inset_2px_2px_4px_rgba(215,200,185,0.6)] border border-white/70 dark:border-white/[0.03]'
                            }`}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

          </div>

          {/* Right Sidebar: Calendar and Online Friends */}
          <OverviewRightSidebar onNavigate={onNavigate} />
        </div>
      </motion.div>
    </>
  );
};

