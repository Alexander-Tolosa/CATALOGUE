import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchingCardItem, MatchingCategoryId, MatchingPair, MatchingGameStats, LanguageTrack } from '../../types';
import { MATCHING_PAIRS, MATCHING_CATEGORIES } from '../../data/matchingData';
import { matchingSounds } from '../../utils/matchingSoundEffects';
import { useAppStore } from '../../store/useAppStore';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  ArrowLeft,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Trophy
} from 'lucide-react';

interface MatchingGameBoardProps {
  categoryId: MatchingCategoryId;
  pairCount: number;
  currentLanguage?: LanguageTrack;
  onSelectLanguage?: (lang: LanguageTrack) => void;
  onBackToCategories: () => void;
  onGameComplete: (stats: MatchingGameStats) => void;
}

const FlagIcon: React.FC<{ country: 'ja' | 'ko' | 'en'; className?: string }> = ({
  country,
  className = "w-4 h-3 rounded-xs shrink-0"
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

// Utility to shuffle an array (Fisher-Yates)
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const MatchingGameBoard: React.FC<MatchingGameBoardProps> = ({
  categoryId,
  pairCount,
  currentLanguage,
  onSelectLanguage,
  onBackToCategories,
  onGameComplete
}) => {
  const { profile, isDarkMode } = useAppStore();
  const lang: LanguageTrack = currentLanguage || profile.selectedLanguage || 'ko';

  const [sourceCards, setSourceCards] = useState<MatchingCardItem[]>([]);
  const [targetCards, setTargetCards] = useState<MatchingCardItem[]>([]);
  const [selectedSourceId, setSelectedSourceId] = useState<string | null>(null);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [shakingCardIds, setShakingCardIds] = useState<string[]>([]);
  const [matchedPairIds, setMatchedPairIds] = useState<string[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(matchingSounds.getMuted());
  const [isHelpTooltipOpen, setIsHelpTooltipOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const categoryMeta = (MATCHING_CATEGORIES[lang] || MATCHING_CATEGORIES.ko).find(
    (c) => c.id === categoryId
  ) || MATCHING_CATEGORIES.ko[0];

  const sourceColTitle =
    lang === 'ko' ? 'KOREAN' : lang === 'ja' ? 'JAPANESE' : 'ENGLISH VOCAB';
  const targetColTitle = 'ENGLISH';

  // Initialize and shuffle board
  const initializeGame = () => {
    const allPairs: MatchingPair[] = MATCHING_PAIRS[lang]?.[categoryId] || MATCHING_PAIRS.ko.basics;
    const shuffledPool = shuffleArray(allPairs);
    const selectedPairs = shuffledPool.slice(0, Math.min(pairCount, allPairs.length));

    // Create Left Column (Source cards: Foreign word + pronunciation)
    const left: MatchingCardItem[] = selectedPairs.map((pair) => ({
      id: `src-${pair.id}`,
      pairId: pair.id,
      type: 'source',
      mainText: pair.sourceText,
      subText: pair.sourcePronunciation,
      isMatched: false,
      isSelected: false
    }));

    // Create Right Column (Target cards: English translation + lower text)
    const right: MatchingCardItem[] = selectedPairs.map((pair) => ({
      id: `tgt-${pair.id}`,
      pairId: pair.id,
      type: 'target',
      mainText: pair.targetText,
      subText: pair.targetSubText || pair.targetText.toLowerCase(),
      isMatched: false,
      isSelected: false
    }));

    // Shuffle left and right independently so they are in different orders!
    setSourceCards(shuffleArray(left));
    setTargetCards(shuffleArray(right));
    setSelectedSourceId(null);
    setSelectedTargetId(null);
    setShakingCardIds([]);
    setMatchedPairIds([]);
    setMoves(0);
    setTimeSeconds(0);
    setIsTimerRunning(true);
  };

  useEffect(() => {
    initializeGame();
  }, [categoryId, pairCount, lang]);

  // Stopwatch timer
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setTimeSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Handle Card Click
  const handleCardClick = (card: MatchingCardItem) => {
    // Cannot click already matched cards or when a mismatch shake is running
    if (card.isMatched || shakingCardIds.length > 0) return;

    matchingSounds.playCardSelect();

    if (card.type === 'source') {
      // If clicked again, deselect
      if (selectedSourceId === card.id) {
        setSelectedSourceId(null);
        return;
      }
      setSelectedSourceId(card.id);
      // Speak native pronunciation audio
      matchingSounds.speak(card.mainText, lang);

      // Check if target is already selected
      if (selectedTargetId) {
        const targetCard = targetCards.find((c) => c.id === selectedTargetId);
        if (targetCard) {
          evaluateMatch(card, targetCard);
        }
      }
    } else {
      // Clicked on target card (Right column)
      if (selectedTargetId === card.id) {
        setSelectedTargetId(null);
        return;
      }
      setSelectedTargetId(card.id);

      // Check if source is already selected
      if (selectedSourceId) {
        const sourceCard = sourceCards.find((c) => c.id === selectedSourceId);
        if (sourceCard) {
          evaluateMatch(sourceCard, card);
        }
      }
    }
  };

  // Evaluate Match between Left card and Right card
  const evaluateMatch = (srcCard: MatchingCardItem, tgtCard: MatchingCardItem) => {
    setMoves((prev) => prev + 1);

    if (srcCard.pairId === tgtCard.pairId) {
      // MATCH SUCCESS!
      matchingSounds.playMatchSuccess();
      matchingSounds.speak(srcCard.mainText, lang);

      const nextMatched = [...matchedPairIds, srcCard.pairId];
      setMatchedPairIds(nextMatched);

      setSourceCards((prev) =>
        prev.map((c) => (c.id === srcCard.id ? { ...c, isMatched: true } : c))
      );
      setTargetCards((prev) =>
        prev.map((c) => (c.id === tgtCard.id ? { ...c, isMatched: true } : c))
      );

      setSelectedSourceId(null);
      setSelectedTargetId(null);

      // Check if all matched
      const totalPairsCount = sourceCards.length;
      if (nextMatched.length === totalPairsCount) {
        setIsTimerRunning(false);
        const finalMoves = moves + 1;
        const finalTime = timeSeconds;
        const accuracy = Math.round((totalPairsCount / finalMoves) * 100);
        let stars = 1;
        if (accuracy >= 80 && finalTime <= 60) stars = 3;
        else if (accuracy >= 55) stars = 2;

        setTimeout(() => {
          onGameComplete({
            moves: finalMoves,
            matchedPairs: totalPairsCount,
            totalPairs: totalPairsCount,
            timeSeconds: finalTime,
            accuracy: Math.min(100, accuracy),
            stars,
            xpEarned: 25
          });
        }, 600);
      }
    } else {
      // MISMATCH!
      matchingSounds.playMismatch();
      setShakingCardIds([srcCard.id, tgtCard.id]);

      setTimeout(() => {
        setShakingCardIds([]);
        setSelectedSourceId(null);
        setSelectedTargetId(null);
      }, 550);
    }
  };

  const handleToggleMute = () => {
    const nextMuted = matchingSounds.toggleMuted();
    setIsMuted(nextMuted);
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
  };

  const totalPairsCount = sourceCards.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 pb-20 animate-fadeIn select-none">
      {/* Top Navigation & Category Title Bar */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onBackToCategories}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            isDarkMode
              ? 'bg-[#151c33] hover:bg-[#1d2747] text-slate-300 hover:text-white border border-[#243058]'
              : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
          }`}
        >
          <ArrowLeft size={16} />
          <span>Categories</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Quick Language Toggle Pill */}
          {onSelectLanguage && (
            <div className="flex items-center p-0.5 rounded-xl bg-slate-900/80 border border-slate-800">
              <button
                onClick={() => onSelectLanguage('ko')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === 'ko'
                    ? 'bg-[#F06543] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Korean"
              >
                <FlagIcon country="ko" className="w-3.5 h-2.5 rounded-2xs" />
                <span>KO</span>
              </button>

              <button
                onClick={() => onSelectLanguage('ja')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lang === 'ja'
                    ? 'bg-[#F06543] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Switch to Japanese"
              >
                <FlagIcon country="ja" className="w-3.5 h-2.5 rounded-2xs" />
                <span>JA</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-[#F06543] text-xs font-bold">
            <span className="material-symbols-outlined text-base">
              {categoryMeta.icon}
            </span>
            <span>{categoryMeta.title}</span>
          </div>

          <button
            onClick={initializeGame}
            title="Restart / Reshuffle"
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#151c33] hover:bg-[#1d2747] text-slate-300 hover:text-white border border-[#243058]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <RotateCcw size={16} />
          </button>

          <button
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Audio SFX' : 'Mute Audio SFX'}
            className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#151c33] hover:bg-[#1d2747] text-slate-300 hover:text-white border border-[#243058]'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            {isMuted ? <VolumeX size={16} className="text-rose-400" /> : <Volume2 size={16} className="text-amber-400" />}
          </button>
        </div>
      </div>

      {/* Main Arcade Frame (Replicating exact layout of user's reference image) */}
      <div className="rounded-3xl bg-[#0e1326] border border-[#1e294b] shadow-[0_10px_40px_rgba(0,0,0,0.6)] p-4 sm:p-7 space-y-6">
        {/* Header Stats Bar: MOVES | MATCHES | TIME with Dotted Line */}
        <div className="space-y-3">
          <div className="flex items-center justify-between font-mono text-xs sm:text-sm font-black tracking-widest text-[#a8b8db]">
            {/* Left: MOVES */}
            <div className="flex items-center gap-2">
              <span className="uppercase">MOVES</span>
              <span className="text-white font-extrabold text-sm sm:text-base">{moves}</span>
            </div>

            {/* Center: MATCHES */}
            <div className="flex items-center gap-2">
              <span className="uppercase">MATCHES</span>
              <span className="text-[#f06543] font-black text-sm sm:text-base">
                {matchedPairIds.length}/{totalPairsCount}
              </span>
            </div>

            {/* Right: TIME */}
            <div className="flex items-center gap-2">
              <span className="uppercase">TIME</span>
              <span className="text-amber-300 font-black text-sm sm:text-base">
                {formatTimer(timeSeconds)}
              </span>
            </div>
          </div>

          {/* Authentic Dotted Line Separator matching screenshot */}
          <div className="border-b border-dotted border-[#33426e] w-full" />
        </div>

        {/* 2-Column Matching Board Grid */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
          {/* Column 1: KOREAN (or target language) */}
          <div className="space-y-3">
            {/* Column Header */}
            <div className="text-center">
              <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[#c7d2fe]">
                {sourceColTitle}
              </h3>
            </div>

            {/* Cards List */}
            <div className="space-y-2.5 sm:space-y-3">
              {sourceCards.map((card) => {
                const isSelected = selectedSourceId === card.id;
                const isMatched = card.isMatched;
                const isShaking = shakingCardIds.includes(card.id);

                return (
                  <motion.div
                    key={card.id}
                    layout
                    whileHover={!isMatched ? { scale: 1.02 } : undefined}
                    whileTap={!isMatched ? { scale: 0.98 } : undefined}
                    animate={
                      isShaking
                        ? { x: [-6, 6, -5, 5, -3, 3, 0] }
                        : {}
                    }
                    transition={{ duration: 0.3 }}
                    onClick={() => handleCardClick(card)}
                    className={`relative rounded-xl sm:rounded-2xl p-3 sm:py-3.5 sm:px-4 text-center cursor-pointer transition-all duration-200 border select-none ${
                      isMatched
                        ? 'bg-[#101d2c]/80 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.25)] opacity-85'
                        : isSelected
                        ? 'bg-[#22305a] border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                        : isShaking
                        ? 'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500/40'
                        : 'bg-[#17213d] hover:bg-[#1e2a4d] border-[#293863] hover:border-[#425894]'
                    }`}
                  >
                    {/* Main Foreign Script Word */}
                    <div className="font-kr font-jp font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                      {card.mainText}
                    </div>

                    {/* Pronunciation Romanization Underneath */}
                    <div className="text-xs sm:text-sm text-[#94a3b8] font-medium font-mono mt-0.5 lowercase tracking-wider">
                      {card.subText}
                    </div>

                    {/* Matched Success Indicator */}
                    {isMatched && (
                      <div className="absolute top-2 right-2 text-emerald-400">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Column 2: ENGLISH */}
          <div className="space-y-3">
            {/* Column Header */}
            <div className="text-center">
              <h3 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-widest text-[#c7d2fe]">
                {targetColTitle}
              </h3>
            </div>

            {/* Cards List */}
            <div className="space-y-2.5 sm:space-y-3">
              {targetCards.map((card) => {
                const isSelected = selectedTargetId === card.id;
                const isMatched = card.isMatched;
                const isShaking = shakingCardIds.includes(card.id);

                return (
                  <motion.div
                    key={card.id}
                    layout
                    whileHover={!isMatched ? { scale: 1.02 } : undefined}
                    whileTap={!isMatched ? { scale: 0.98 } : undefined}
                    animate={
                      isShaking
                        ? { x: [-6, 6, -5, 5, -3, 3, 0] }
                        : {}
                    }
                    transition={{ duration: 0.3 }}
                    onClick={() => handleCardClick(card)}
                    className={`relative rounded-xl sm:rounded-2xl p-3 sm:py-3.5 sm:px-4 text-center cursor-pointer transition-all duration-200 border select-none ${
                      isMatched
                        ? 'bg-[#101d2c]/80 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.25)] opacity-85'
                        : isSelected
                        ? 'bg-[#22305a] border-amber-400 ring-2 ring-amber-400/50 shadow-[0_0_20px_rgba(251,191,36,0.35)]'
                        : isShaking
                        ? 'bg-rose-950/60 border-rose-500 text-rose-200 ring-2 ring-rose-500/40'
                        : 'bg-[#17213d] hover:bg-[#1e2a4d] border-[#293863] hover:border-[#425894]'
                    }`}
                  >
                    {/* English Word (Stylized font matching screenshot) */}
                    <div className="font-serif italic font-extrabold text-xl sm:text-2xl text-white tracking-tight leading-tight">
                      {card.mainText}
                    </div>

                    {/* Lower Subtext Translation Underneath */}
                    <div className="text-xs sm:text-sm text-[#94a3b8] font-medium font-serif italic mt-0.5 lowercase tracking-wider">
                      {card.subText}
                    </div>

                    {/* Matched Success Indicator */}
                    {isMatched && (
                      <div className="absolute top-2 right-2 text-emerald-400">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Gameplay Tip */}
        <div className="pt-2 text-center text-xs text-[#7182ab] flex items-center justify-center gap-1.5">
          <Sparkles size={14} className="text-amber-400" />
          <span>Click a word card on the left and its matching definition on the right to clear the board!</span>
        </div>
      </div>
    </div>
  );
};
