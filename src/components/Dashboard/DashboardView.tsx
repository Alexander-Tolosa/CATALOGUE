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
  const { mood, bondLevel, equippedCosmetics, speechText } = useKleoStore();

  const [isLoading, setIsLoading] = useState(!initialDashboardLoaded);

  // Syllable block builder interactive state
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

  const userName = profile.name && profile.name.trim().length > 0 ? profile.name : 'Learner';

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
        className={`pt-20 px-4 md:px-8 pb-24 max-w-6xl mx-auto space-y-6 transition-colors duration-200 ${
          isDarkMode ? 'bg-[#0b0f19] text-white' : 'bg-[#FAF6F0] text-[#2B2725]'
        }`}
      >
        {/* 1. Header Welcome Bar (Personalized Name, Cleaned of Duplicated Stats & Sign Out Button) */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`font-display text-2xl md:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-[#2B2725]'
            }`}>
              Welcome, {userName}!
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-[#7A736E] dark:text-slate-400">
              <span className="material-symbols-outlined text-sm">translate</span>
              <span>{activeLangName} track</span>
            </div>
          </div>
        </div>

        {/* 2. Top Bento Grid Row: Kleo Mascot Card + Daily Goal Card (Standardized p-6 md:p-7 padding, gap-6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Kleo Mascot Interactive Widget with Speech Bubble Tail */}
          <div className={`p-6 md:p-7 rounded-3xl border flex flex-col sm:flex-row items-center gap-5 transition-all shadow-xs ${
            isDarkMode
              ? 'bg-[#131b2e] border-white/10 text-white'
              : 'bg-white border-[#EDE5DA] text-[#2B2725]'
          }`}>
            <div className="relative w-20 h-20 rounded-2xl bg-[#FFF4EE] dark:bg-slate-800 border border-[#FDE3D5] dark:border-slate-700 flex items-center justify-center p-1 shrink-0 shadow-inner">
              <KleoAvatar mood={mood} equippedCosmetics={equippedCosmetics} size={64} />
              <span className="absolute -bottom-2 bg-[#F06543] text-white font-bold text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Bond Lv.{bondLevel}
              </span>
            </div>

            <div className="space-y-2 flex-1 text-center sm:text-left">
              {/* Speech Bubble with Directional Pointer Tail */}
              <div className={`relative px-4 py-3 rounded-2xl rounded-tl-none border shadow-2xs ${
                isDarkMode
                  ? 'bg-[#1e293b] border-slate-700 text-white before:content-[\'\'] before:absolute before:-left-2 before:top-3.5 before:w-0 before:h-0 before:border-y-6 before:border-y-transparent before:border-r-6 before:border-r-[#1e293b]'
                  : 'bg-[#FFF4EE] border-[#FDE3D5] text-[#2B2725] before:content-[\'\'] before:absolute before:-left-2 before:top-3.5 before:w-0 before:h-0 before:border-y-6 before:border-y-transparent before:border-r-6 before:border-r-[#FFF4EE]'
              }`}>
                <p className="font-display font-semibold text-xs md:text-sm leading-relaxed">
                  "{speechText || `Ready when you are. Shall we learn some ${scriptName}?`}"
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2 pt-0.5">
                <span className="font-display font-bold text-xs">Kleo</span>
                <span className="text-[11px] text-[#7A736E] dark:text-slate-400">AI Tutor Mascot</span>
              </div>
            </div>
          </div>

          {/* Card 2: Daily Goal Gauge Card */}
          <div className={`p-6 md:p-7 rounded-3xl border flex items-center gap-6 transition-all shadow-xs ${
            isDarkMode
              ? 'bg-[#131b2e] border-white/10 text-white'
              : 'bg-white border-[#EDE5DA] text-[#2B2725]'
          }`}>
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className={isDarkMode ? 'text-slate-800' : 'text-[#F5EFE6]'}
                  cx="40"
                  cy="40"
                  fill="transparent"
                  r="32"
                  stroke="currentColor"
                  strokeWidth="6"
                />
                <circle
                  className="text-[#F06543] transition-all duration-700"
                  cx="40"
                  cy="40"
                  fill="transparent"
                  r="32"
                  stroke="currentColor"
                  strokeDasharray="201"
                  strokeDashoffset={201 - (201 * percentGoal) / 100}
                  strokeLinecap="round"
                  strokeWidth="6"
                />
              </svg>
              <span className={`absolute font-display font-extrabold text-sm ${
                isDarkMode ? 'text-white' : 'text-[#2B2725]'
              }`}>
                {percentGoal}%
              </span>
            </div>

            <div className="space-y-1">
              <h3 className={`font-display text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
                Daily goal
              </h3>
              <p className={`text-xs md:text-sm ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
                {profile.minutesCompletedToday} of {profile.dailyGoalMinutes} min completed today
              </p>
              <p className="text-[11px] font-semibold text-[#F06543]">
                {percentGoal >= 100 ? '🎉 Daily goal completed!' : `${profile.dailyGoalMinutes - profile.minutesCompletedToday} min remaining`}
              </p>
            </div>
          </div>
        </div>

        {/* 3. Main Unit Banner ("Letters unit") with Prominent Primary CTA */}
        <div className="space-y-2">
          <h2 className={`font-display font-bold text-xs uppercase tracking-widest ${
            isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'
          }`}>
            Letters unit
          </h2>

          <div className={`p-8 md:p-10 rounded-3xl border text-center flex flex-col items-center justify-center space-y-5 shadow-xs ${
            isDarkMode
              ? 'bg-[#131b2e] border-white/10 text-white'
              : 'bg-white border-[#EDE5DA] text-[#2B2725]'
          }`}>
            <div className="w-14 h-14 rounded-2xl bg-[#FFF4EE] dark:bg-slate-800 border border-[#FDE3D5] dark:border-slate-700 flex items-center justify-center text-[#F06543]">
              <span className="material-symbols-outlined text-3xl">auto_awesome</span>
            </div>

            <div className="max-w-md space-y-1.5">
              <h3 className="font-display text-lg font-extrabold">
                {nextNode ? nextNode.title : 'Hangul Foundations'}
              </h3>
              <p className={`text-xs md:text-sm font-medium leading-relaxed ${
                isDarkMode ? 'text-slate-300' : 'text-[#7A736E]'
              }`}>
                {nextNode ? nextNode.description : 'Your journey starts with Hangul consonants. It takes about 5 minutes.'}
              </p>
            </div>

            {/* Enlarged Primary CTA Button */}
            <button
              onClick={() => nextNode && onSelectNode(nextNode)}
              className="bg-[#F06543] hover:bg-[#E05432] text-white font-extrabold text-sm md:text-base px-10 py-4 rounded-2xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2.5 tracking-wide"
            >
              <span>Start your first lesson</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* 4. Quick Access Action Grid (3 Equal Columns, Fully Clickable Hover Targets) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Review Deck */}
          <div
            onClick={() => onNavigate('review')}
            className={`p-6 rounded-3xl border flex items-center gap-4 cursor-pointer group hover:-translate-y-1 hover:shadow-md transition-all duration-200 ${
              isDarkMode
                ? 'bg-[#131b2e] border-white/10 hover:border-slate-700'
                : 'bg-white border-[#EDE5DA] hover:border-[#E2D9CE] hover:bg-[#FAF6F1]'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] dark:bg-slate-800 border border-[#EDE5DA] dark:border-slate-700 flex items-center justify-center text-[#2B2725] dark:text-white shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">autorenew</span>
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className={`font-display text-sm font-bold truncate group-hover:text-[#F06543] transition-colors ${
                isDarkMode ? 'text-white' : 'text-[#2B2725]'
              }`}>
                Review
              </h4>
              <p className={`text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
                {savedPhrases.length} item(s) due
              </p>
            </div>
          </div>

          {/* Card 2: Script & Letters Reference */}
          <div
            onClick={() => onNavigate('letters')}
            className={`p-6 rounded-3xl border flex items-center gap-4 cursor-pointer group hover:-translate-y-1 hover:shadow-md transition-all duration-200 ${
              isDarkMode
                ? 'bg-[#131b2e] border-white/10 hover:border-slate-700'
                : 'bg-white border-[#EDE5DA] hover:border-[#E2D9CE] hover:bg-[#FAF6F1]'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FAF6F0] dark:bg-slate-800 border border-[#EDE5DA] dark:border-slate-700 flex items-center justify-center text-[#2B2725] dark:text-white shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">translate</span>
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className={`font-display text-sm font-bold truncate group-hover:text-[#F06543] transition-colors ${
                isDarkMode ? 'text-white' : 'text-[#2B2725]'
              }`}>
                Script & letters
              </h4>
              <p className={`text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
                Full {scriptName} reference
              </p>
            </div>
          </div>

          {/* Card 3: Chat with Kleo */}
          <div
            onClick={() => onNavigate('chatbot')}
            className={`p-6 rounded-3xl border flex items-center gap-4 cursor-pointer group hover:-translate-y-1 hover:shadow-md transition-all duration-200 ${
              isDarkMode
                ? 'bg-[#131b2e] border-white/10 hover:border-slate-700'
                : 'bg-white border-[#EDE5DA] hover:border-[#E2D9CE] hover:bg-[#FAF6F1]'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4EE] dark:bg-slate-800 border border-[#FDE3D5] dark:border-slate-700 flex items-center justify-center text-[#F06543] shrink-0 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-xl">chat_bubble</span>
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className={`font-display text-sm font-bold truncate group-hover:text-[#F06543] transition-colors ${
                isDarkMode ? 'text-white' : 'text-[#2B2725]'
              }`}>
                Chat with Kleo
              </h4>
              <p className={`text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
                AI Language Tutor
              </p>
            </div>
          </div>
        </div>

        {/* 5. Syllable Block Builder Card (Interactive Feedback & Enlarged Touch Targets) */}
        <div className={`p-6 md:p-8 rounded-3xl border space-y-5 shadow-xs ${
          isDarkMode
            ? 'bg-[#131b2e] border-white/10 text-white'
            : 'bg-white border-[#EDE5DA] text-[#2B2725]'
        }`}>
          <div>
            <h3 className={`font-display text-base font-bold ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
              Syllable block builder
            </h3>
            <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
              Pick a consonant and a vowel to build a real Hangul block.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
            {/* Dynamic Syllable Display Card with Explicit Interactive Mapping */}
            <div className="w-36 h-36 rounded-2xl bg-[#FAF6F0] dark:bg-slate-800 border border-[#EDE5DA] dark:border-slate-700 flex flex-col items-center justify-center p-3 shadow-inner shrink-0 relative">
              <span className="font-kr font-black text-5xl text-[#2B2725] dark:text-white">
                {selectedConsonant}{selectedVowel}
              </span>
              <span className="text-[11px] font-mono font-bold text-[#F06543] mt-2 bg-[#FFF4EE] dark:bg-slate-700 px-2.5 py-0.5 rounded-full border border-[#FDE3D5] dark:border-slate-600">
                {selectedConsonant} + {selectedVowel} ➔ {selectedConsonant}{selectedVowel}
              </span>
            </div>

            {/* Consonants & Vowels Selector with Enlarged Hitboxes */}
            <div className="flex-1 space-y-4 w-full">
              {/* Consonants Row */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">
                  Consonant ({selectedConsonant})
                </span>
                <div className="flex flex-wrap gap-2">
                  {consonants.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedConsonant(c)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center ${
                        selectedConsonant === c
                          ? 'bg-[#F06543] text-white shadow-md shadow-orange-500/30 scale-105'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                          : 'bg-[#FAF6F0] text-[#2B2725] hover:bg-[#F2EAE0] border border-[#EDE5DA]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vowels Row */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">
                  Vowel ({selectedVowel})
                </span>
                <div className="flex flex-wrap gap-2">
                  {vowels.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVowel(v)}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center justify-center ${
                        selectedVowel === v
                          ? 'bg-[#F06543] text-white shadow-md shadow-orange-500/30 scale-105'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                          : 'bg-[#FAF6F0] text-[#2B2725] hover:bg-[#F2EAE0] border border-[#EDE5DA]'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};
