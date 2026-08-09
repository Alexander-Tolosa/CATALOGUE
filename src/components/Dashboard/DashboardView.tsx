import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, LanguageTrack, LessonNode, ReviewItem, AppView } from '../../types';
import { useKleoStore } from '../../store/useKleoStore';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
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
  const { isDarkMode, toggleChatbot } = useAppStore();
  const { mood, bondLevel, equippedCosmetics } = useKleoStore();
  const { logout } = useAuthStore();

  const [isLoading, setIsLoading] = useState(!initialDashboardLoaded);

  // Syllable block builder interactive state (matching reference image)
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
        className={`pt-20 px-4 md:px-8 pb-24 max-w-5xl mx-auto space-y-6 transition-colors duration-200 ${
          isDarkMode ? 'bg-[#0b0f19] text-white' : 'bg-[#FAF6F0] text-[#2B2725]'
        }`}
      >
        {/* 1. Header Welcome & Track Bar (Reference Design) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`font-display text-2xl md:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-white' : 'text-[#2B2725]'
            }`}>
              Welcome, {profile.name.toLowerCase()}!
            </h1>
            <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-[#7A736E] dark:text-slate-400">
              <span className="material-symbols-outlined text-sm">translate</span>
              <span>{activeLangName} track</span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className={`self-start sm:self-center flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-full border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#1e293b] border-slate-800 text-slate-300 hover:bg-slate-800'
                : 'bg-white border-[#EDE5DA] text-[#4A4440] hover:bg-[#F5EFE6] shadow-2xs'
            }`}
          >
            <span className="material-symbols-outlined text-sm">logout</span>
            <span>Sign out</span>
          </button>
        </div>

        {/* 2. Floating Stats Pills Row (Streak, Hearts, Level/XP) */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Streak Pill */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-bold shadow-2xs ${
            isDarkMode ? 'bg-[#131b2e] border-[#1e293b] text-white' : 'bg-white border-[#EDE5DA] text-[#2B2725]'
          }`}>
            <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <span>{profile.streakDays} day streak</span>
          </div>

          {/* Hearts Pill */}
          <div className={`flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-bold shadow-2xs ${
            isDarkMode ? 'bg-[#131b2e] border-[#1e293b] text-white' : 'bg-white border-[#EDE5DA] text-[#2B2725]'
          }`}>
            <div className="flex items-center gap-0.5 text-rose-500">
              {[...Array(profile.maxHearts)].map((_, i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: i < profile.hearts ? "'FILL' 1" : "'FILL' 0" }}
                >
                  favorite
                </span>
              ))}
            </div>
          </div>

          {/* Level & XP Progress Pill */}
          <div className={`flex-1 min-w-[240px] flex items-center justify-between gap-3 px-4 py-2 rounded-full border text-xs font-bold shadow-2xs ${
            isDarkMode ? 'bg-[#131b2e] border-[#1e293b] text-white' : 'bg-white border-[#EDE5DA] text-[#2B2725]'
          }`}>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="material-symbols-outlined text-amber-400 text-sm">star</span>
              <span>Level {profile.level}</span>
            </div>

            <div className="flex-1 flex items-center gap-2 max-w-xs">
              <div className={`h-2 w-full rounded-full overflow-hidden ${
                isDarkMode ? 'bg-slate-800' : 'bg-[#FAF6F0]'
              }`}>
                <div
                  className="h-full bg-[#F06543] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, profile.xp % 100)}%` }}
                />
              </div>
              <span className="text-[11px] font-semibold text-[#7A736E] shrink-0 font-mono">
                {profile.xp % 100}/100 XP
              </span>
            </div>
          </div>
        </div>

        {/* 3. Top Bento Grid Row: Kleo Status Card + Daily Goal Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Kleo Companion Status */}
          <div className={`p-6 rounded-3xl border flex items-center gap-4 transition-all shadow-2xs ${
            isDarkMode ? 'bg-[#131b2e] border-[#1e293b] text-white' : 'bg-white border-[#EDE5DA] text-[#2B2725]'
          }`}>
            <div className="w-16 h-16 rounded-2xl bg-[#FFF4EE] dark:bg-slate-800 border border-[#FDE3D5] dark:border-slate-700 flex items-center justify-center p-1 shrink-0 shadow-inner">
              <KleoAvatar mood={mood} equippedCosmetics={equippedCosmetics} size={54} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-base">Kleo</span>
                <span className="bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] font-bold text-[10px] px-2.5 py-0.5 rounded-full">
                  Bond Lv.{bondLevel}
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-[#7A736E]'}`}>
                Ready when you are. Shall we learn some {scriptName}?
              </p>
            </div>
          </div>

          {/* Card 2: Daily Goal Gauge */}
          <div className={`p-6 rounded-3xl border flex items-center gap-5 transition-all shadow-2xs ${
            isDarkMode ? 'bg-[#131b2e] border-[#1e293b] text-white' : 'bg-white border-[#EDE5DA] text-[#2B2725]'
          }`}>
            <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className={isDarkMode ? 'text-slate-800' : 'text-[#F5EFE6]'}
                  cx="32"
                  cy="32"
                  fill="transparent"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                />
                <circle
                  className="text-[#F06543] transition-all duration-700"
                  cx="32"
                  cy="32"
                  fill="transparent"
                  r="26"
                  stroke="currentColor"
                  strokeDasharray="163.3"
                  strokeDashoffset={163.3 - (163.3 * percentGoal) / 100}
                  strokeLinecap="round"
                  strokeWidth="5"
                />
              </svg>
              <span className={`absolute font-display font-extrabold text-xs ${
                isDarkMode ? 'text-white' : 'text-[#2B2725]'
              }`}>
                {percentGoal}%
              </span>
            </div>

            <div className="space-y-0.5">
              <h3 className={`font-display text-sm font-bold ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
                Daily goal
              </h3>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
                {profile.minutesCompletedToday} of {profile.dailyGoalMinutes} min today
              </p>
            </div>
          </div>
        </div>

        {/* 4. Main Unit Banner ("Letters unit") */}
        <div className="space-y-2">
          <h2 className={`font-display font-bold text-sm uppercase tracking-wider ${
            isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'
          }`}>
            Letters unit
          </h2>

          <div className={`p-8 md:p-10 rounded-3xl border text-center flex flex-col items-center justify-center space-y-4 shadow-2xs ${
            isDarkMode ? 'bg-[#131b2e] border-[#1e293b] text-white' : 'bg-white border-[#EDE5DA] text-[#2B2725]'
          }`}>
            <div className="w-12 h-12 rounded-2xl bg-[#FFF4EE] border border-[#FDE3D5] flex items-center justify-center text-[#F06543]">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>

            <div className="max-w-md space-y-1">
              <p className={`text-xs md:text-sm font-medium ${
                isDarkMode ? 'text-slate-300' : 'text-[#7A736E]'
              }`}>
                {nextNode ? nextNode.description : 'Your journey starts with Hangul consonants. It takes about 5 minutes.'}
              </p>
            </div>

            <button
              onClick={() => nextNode && onSelectNode(nextNode)}
              className="bg-[#F06543] hover:bg-[#E05432] text-white font-bold text-xs md:text-sm px-8 py-3.5 rounded-2xl shadow-md shadow-orange-500/20 active:scale-98 transition-all cursor-pointer"
            >
              Start your first lesson
            </button>
          </div>
        </div>

        {/* 5. Quick Access Action Grid (3 Equal Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Card 1: Review Deck */}
          <div
            onClick={() => onNavigate('review')}
            className={`p-4 rounded-3xl border flex items-center gap-3.5 cursor-pointer transition-all shadow-2xs ${
              isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] hover:border-slate-700'
                : 'bg-white border-[#EDE5DA] hover:border-[#E2D9CE] hover:bg-[#FAF6F1]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] dark:bg-slate-800 border border-[#EDE5DA] dark:border-slate-700 flex items-center justify-center text-[#2B2725] dark:text-white shrink-0">
              <span className="material-symbols-outlined text-lg">autorenew</span>
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className={`font-display text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
                Review
              </h4>
              <p className={`text-[11px] truncate ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
                {savedPhrases.length} item(s) due
              </p>
            </div>
          </div>

          {/* Card 2: Script & Letters Reference */}
          <div
            onClick={() => onNavigate('letters')}
            className={`p-4 rounded-3xl border flex items-center gap-3.5 cursor-pointer transition-all shadow-2xs ${
              isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] hover:border-slate-700'
                : 'bg-white border-[#EDE5DA] hover:border-[#E2D9CE] hover:bg-[#FAF6F1]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FAF6F0] dark:bg-slate-800 border border-[#EDE5DA] dark:border-slate-700 flex items-center justify-center text-[#2B2725] dark:text-white shrink-0">
              <span className="material-symbols-outlined text-lg">translate</span>
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className={`font-display text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
                Script & letters
              </h4>
              <p className={`text-[11px] truncate ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
                Full {scriptName} reference
              </p>
            </div>
          </div>

          {/* Card 3: Chat with Kleo */}
          <div
            onClick={() => onNavigate('chatbot')}
            className={`p-4 rounded-3xl border flex items-center gap-3.5 cursor-pointer transition-all shadow-2xs ${
              isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] hover:border-slate-700'
                : 'bg-white border-[#EDE5DA] hover:border-[#E2D9CE] hover:bg-[#FAF6F1]'
            }`}
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF4EE] dark:bg-slate-800 border border-[#FDE3D5] dark:border-slate-700 flex items-center justify-center text-[#F06543] shrink-0">
              <span className="material-symbols-outlined text-lg">chat_bubble</span>
            </div>
            <div className="space-y-0.5 min-w-0">
              <h4 className={`font-display text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
                Chat with Kleo
              </h4>
              <p className={`text-[11px] truncate ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
                AI Language Tutor
              </p>
            </div>
          </div>
        </div>

        {/* 6. Syllable Block Builder Card (Interactive Feature from Reference) */}
        <div className={`p-6 md:p-8 rounded-3xl border space-y-4 shadow-2xs ${
          isDarkMode ? 'bg-[#131b2e] border-[#1e293b] text-white' : 'bg-white border-[#EDE5DA] text-[#2B2725]'
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
            {/* Built Syllable Display Card */}
            <div className="w-32 h-32 rounded-2xl bg-[#FAF6F0] dark:bg-slate-800 border border-[#EDE5DA] dark:border-slate-700 flex flex-col items-center justify-center p-3 shadow-inner shrink-0">
              <span className="font-kr font-black text-5xl text-[#2B2725] dark:text-white">
                {selectedConsonant}{selectedVowel}
              </span>
              <span className="text-[10px] font-mono font-semibold text-[#F06543] mt-1">
                {selectedConsonant} + {selectedVowel}
              </span>
            </div>

            {/* Consonants & Vowels Selector */}
            <div className="flex-1 space-y-3 w-full">
              {/* Consonants Row */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">Consonant</span>
                <div className="flex flex-wrap gap-1.5">
                  {consonants.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedConsonant(c)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedConsonant === c
                          ? 'bg-[#F06543] text-white shadow-xs scale-105'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          : 'bg-[#FAF6F0] text-[#2B2725] hover:bg-[#F2EAE0] border border-[#EDE5DA]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vowels Row */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7A736E]">Vowel</span>
                <div className="flex flex-wrap gap-1.5">
                  {vowels.map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVowel(v)}
                      className={`w-8 h-8 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        selectedVowel === v
                          ? 'bg-[#F06543] text-white shadow-xs scale-105'
                          : isDarkMode
                          ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
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
