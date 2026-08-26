import React from 'react';
import { motion } from 'framer-motion';
import { MatchingCategoryId, LanguageTrack } from '../../types';
import { MATCHING_CATEGORIES, MATCHING_PAIRS } from '../../data/matchingData';
import { useAppStore } from '../../store/useAppStore';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import { useKleoStore } from '../../store/useKleoStore';
import { Sparkles, ArrowRight, Play, CheckCircle2, Zap } from 'lucide-react';

interface MatchingCategorySelectProps {
  currentLanguage: LanguageTrack;
  onSelectLanguage: (lang: LanguageTrack) => void;
  onSelectCategory: (categoryId: MatchingCategoryId, pairCount: number) => void;
  selectedPairCount: number;
  onChangePairCount: (count: number) => void;
}

const FlagIcon: React.FC<{ country: 'ja' | 'ko' | 'en'; className?: string }> = ({
  country,
  className = "w-5 h-3.5 rounded-xs shrink-0"
}) => {
  if (country === 'ja') {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shadow-2xs border border-white/20 inline-block`} xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="20" fill="#FFFFFF" />
        <circle cx="15" cy="10" r="6" fill="#BC002D" />
      </svg>
    );
  }
  if (country === 'ko') {
    return (
      <svg viewBox="0 0 30 20" className={`${className} shadow-2xs border border-white/20 inline-block`} xmlns="http://www.w3.org/2000/svg">
        <rect width="30" height="20" fill="#FFFFFF" />
        <circle cx="15" cy="10" r="5" fill="#C60C30" />
        <path d="M15 5a5 5 0 0 0 0 5 2.5 2.5 0 0 1 0 5 5 5 0 0 0 0-10z" fill="#003478" />
        <circle cx="15" cy="7.5" r="2.5" fill="#C60C30" />
        <rect x="3.5" y="3.5" width="4.5" height="1" transform="rotate(33 5.7 4)" fill="#000000" />
        <rect x="4" y="5" width="4.5" height="1" transform="rotate(33 6.2 5.5)" fill="#000000" />
        <rect x="22" y="14" width="4.5" height="1" transform="rotate(33 24.2 14.5)" fill="#000000" />
        <rect x="22.5" y="15.5" width="4.5" height="1" transform="rotate(33 24.7 16)" fill="#000000" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 30 20" className={`${className} shadow-2xs border border-white/20 inline-block`} xmlns="http://www.w3.org/2000/svg">
      <rect width="30" height="20" fill="#B22234" />
      <rect y="1.54" width="30" height="1.54" fill="#FFFFFF" />
      <rect y="4.62" width="30" height="1.54" fill="#FFFFFF" />
      <rect y="7.69" width="30" height="1.54" fill="#FFFFFF" />
      <rect y="10.77" width="30" height="1.54" fill="#FFFFFF" />
      <rect y="13.85" width="30" height="1.54" fill="#FFFFFF" />
      <rect y="16.92" width="30" height="1.54" fill="#FFFFFF" />
      <rect width="12" height="10.77" fill="#3C3B6E" />
    </svg>
  );
};

export const MatchingCategorySelect: React.FC<MatchingCategorySelectProps> = ({
  currentLanguage,
  onSelectLanguage,
  onSelectCategory,
  selectedPairCount,
  onChangePairCount
}) => {
  const { isDarkMode } = useAppStore();
  const { equippedCosmetics } = useKleoStore();

  const lang: LanguageTrack = currentLanguage || 'ko';
  const categories = MATCHING_CATEGORIES[lang] || MATCHING_CATEGORIES.ko;

  const langName =
    lang === 'ko' ? 'Korean' : lang === 'ja' ? 'Japanese' : 'English';

  const languageOptions: { id: LanguageTrack; name: string; nativeName: string }[] = [
    { id: 'ko', name: 'Korean', nativeName: '한국어' },
    { id: 'ja', name: 'Japanese', nativeName: '日本語' },
    { id: 'en', name: 'English', nativeName: 'English' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto pb-16">
      {/* Target Language Selection Segmented Control */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-2xl bg-white/60 dark:bg-[#11182c]/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl text-[#F06543]">
            translate
          </span>
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Target Language:
          </span>
        </div>

        {/* 3-Way Language Switcher (Korean / Japanese / English) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
          {languageOptions.map((opt) => {
            const isSelected = lang === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => onSelectLanguage(opt.id)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                  isSelected
                    ? 'bg-[#F06543] text-white shadow-md shadow-orange-500/25 font-extrabold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/60'
                }`}
              >
                <FlagIcon country={opt.id as 'ko' | 'ja' | 'en'} className="w-4 h-3 rounded-2xs" />
                <span>{opt.name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'}`}>
                  ({opt.nativeName})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div
        className={`relative overflow-hidden rounded-3xl p-6 md:p-8 border shadow-lg transition-all ${
          isDarkMode
            ? 'bg-gradient-to-r from-[#121a30] via-[#16203d] to-[#121a30] border-[#223055] text-white'
            : 'bg-gradient-to-r from-[#fff9f4] via-[#ffffff] to-[#fff4eb] border-[#ede0d2] text-[#2b2725]'
        }`}
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F06543]/15 border border-[#F06543]/30 text-[#F06543] text-xs font-bold uppercase tracking-wider">
              <Sparkles size={14} />
              <span>Interactive Memory Deck</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-display tracking-tight leading-tight">
              {langName} <span className="text-[#F06543]">Word Match</span>
            </h1>

            <p className={`text-xs sm:text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              Select a category to begin. Match native {langName} words with their pronunciation on the left to their English definitions on the right to test your vocabulary recall and speech!
            </p>

            {/* Pair Count / Difficulty Selector */}
            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Round Size:</span>
              <div className="inline-flex p-1 rounded-xl bg-slate-900/30 border border-slate-700/50 backdrop-blur-xs">
                {[
                  { count: 6, label: 'Quick (6)' },
                  { count: 8, label: 'Standard (8)' },
                  { count: 10, label: 'Master (10)' }
                ].map((option) => (
                  <button
                    key={option.count}
                    onClick={() => onChangePairCount(option.count)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${
                      selectedPairCount === option.count
                        ? 'bg-[#F06543] text-white shadow-md'
                        : isDarkMode
                        ? 'text-slate-400 hover:text-white'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Kleo Mascot Companion Callout */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative p-3 rounded-2xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-white/10 backdrop-blur-md shadow-xl">
              <KleoAvatar mood="encouraging" equippedCosmetics={equippedCosmetics} size={90} />
            </div>
            <div className="mt-2 text-center">
              <span className="text-[11px] font-bold text-[#F06543] bg-[#F06543]/15 px-2.5 py-0.5 rounded-full border border-[#F06543]/30 flex items-center gap-1.5 justify-center">
                <FlagIcon country={lang as 'ko' | 'ja' | 'en'} className="w-3.5 h-2.5 rounded-2xs" />
                <span>{langName} Deck Active</span>
              </span>
            </div>
          </div>
        </div>

        {/* Ambient background blur lights */}
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-[#F06543]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Category Selection Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className={`font-display text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Choose a Category
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pick your focus area to start matching cards
            </p>
          </div>
          <span className="text-xs font-bold text-[#F06543] bg-[#F06543]/10 px-3 py-1 rounded-full border border-[#F06543]/20">
            {categories.length} Categories Available
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {categories.map((category, idx) => {
            const wordList = MATCHING_PAIRS[lang]?.[category.id] || [];
            const previewWords = wordList.slice(0, 5);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                onClick={() => onSelectCategory(category.id, selectedPairCount)}
                className={`group relative overflow-hidden rounded-3xl p-6 border cursor-pointer transition-all duration-300 shadow-md ${
                  isDarkMode
                    ? 'bg-[#131b2e] hover:bg-[#18233d] border-[#223055] hover:border-[#F06543]/60'
                    : 'bg-white hover:bg-[#FAF6F1] border-[#EDE5DA] hover:border-[#F06543]/50'
                }`}
              >
                {/* Category Header Bar */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${category.badgeColor} p-0.5 flex items-center justify-center shadow-lg text-white shrink-0 group-hover:scale-110 transition-transform duration-200`}
                    >
                      <span className="material-symbols-outlined text-2xl">
                        {category.icon}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white dark:text-white">
                          <span className={isDarkMode ? 'text-white' : 'text-slate-900 group-hover:text-[#F06543] transition-colors'}>
                            {category.title}
                          </span>
                        </h3>
                      </div>
                      <span className="text-xs font-semibold text-[#F06543] font-kr font-jp">
                        {category.nativeTitle}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-slate-400 bg-slate-800/60 dark:bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-700/50">
                    {category.totalWords} Words
                  </span>
                </div>

                {/* Description */}
                <p className={`text-xs sm:text-sm mb-4 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  {category.description}
                </p>

                {/* Preview Chips */}
                <div className="space-y-2 mb-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Sample Vocabulary:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {previewWords.map((w) => (
                      <span
                        key={w.id}
                        className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border font-kr font-jp ${
                          isDarkMode
                            ? 'bg-[#0f1526] border-slate-700/80 text-slate-200'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <span className="font-bold">{w.sourceText}</span>
                        <span className="text-[10px] text-slate-400 ml-1">({w.sourcePronunciation})</span>
                      </span>
                    ))}
                    {wordList.length > 5 && (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20">
                        +{wordList.length - 5} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom CTA Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-700/30 dark:border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <Zap size={14} className="text-amber-400" />
                    <span>8 pairs per round</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 font-extrabold text-xs text-white bg-[#F06543] group-hover:bg-[#E05432] px-4 py-2 rounded-xl shadow-md transition-colors">
                    <span>Play Now</span>
                    <Play size={12} className="fill-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
