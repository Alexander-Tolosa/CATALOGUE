import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { MatchingGameStats } from '../../types';
import { matchingSounds } from '../../utils/matchingSoundEffects';
import { useKleoStore } from '../../store/useKleoStore';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import { RotateCcw, ArrowRight, Grid, Sparkles, Trophy, Flame, Timer, Target } from 'lucide-react';

interface MatchingCelebrationModalProps {
  stats: MatchingGameStats;
  categoryTitle: string;
  onPlayAgain: () => void;
  onSelectCategory: () => void;
  onNavigateHome: () => void;
}

export const MatchingCelebrationModal: React.FC<MatchingCelebrationModalProps> = ({
  stats,
  categoryTitle,
  onPlayAgain,
  onSelectCategory,
  onNavigateHome
}) => {
  const { equippedCosmetics } = useKleoStore();

  useEffect(() => {
    // Play celebratory sound fanfare
    matchingSounds.playVictory();

    // Trigger double confetti blast
    const count = 200;
    const defaults = { origin: { y: 0.65 } };

    const fire = (particleRatio: number, opts: confetti.Options) => {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    };

    fire(0.25, { spread: 26, startVelocity: 55 });
    fire(0.2, { spread: 60 });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
    fire(0.1, { spread: 120, startVelocity: 45 });
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainderSecs).padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="w-full max-w-lg rounded-3xl bg-[#11182c] border border-[#2d3b66] shadow-[0_20px_60px_rgba(0,0,0,0.8)] p-6 sm:p-8 text-center text-white space-y-6 relative overflow-hidden"
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#f06543]/25 rounded-full blur-3xl pointer-events-none" />

        {/* Mascot & Crown Celebration */}
        <div className="relative inline-block mt-2">
          <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500/20 via-orange-500/30 to-purple-500/20 border border-amber-400/40 flex items-center justify-center p-2 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
            <KleoAvatar mood="celebrating" equippedCosmetics={equippedCosmetics} size={88} />
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -25 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="absolute -top-3 -right-2 bg-amber-400 text-slate-950 p-1.5 rounded-full shadow-lg border-2 border-[#11182c]"
          >
            <Trophy size={18} className="fill-slate-950" />
          </motion.div>
        </div>

        {/* Title & Stars */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((starIdx) => (
              <motion.span
                key={starIdx}
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15 * starIdx, type: 'spring', stiffness: 400 }}
                className={`text-2xl sm:text-3xl ${
                  starIdx <= stats.stars
                    ? 'text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.8)]'
                    : 'text-slate-600'
                }`}
              >
                ★
              </motion.span>
            ))}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Purr-fect Match! 🎉
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            You mastered all {stats.totalPairs} pairs in <span className="text-amber-300 font-bold">{categoryTitle}</span>!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3 py-1">
          {/* Time Stat */}
          <div className="bg-[#182344] border border-[#2b3a6a] p-3 rounded-2xl space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-sky-400 uppercase tracking-wider">
              <Timer size={14} />
              <span>Time</span>
            </div>
            <p className="text-lg sm:text-xl font-black font-mono text-white">
              {formatTime(stats.timeSeconds)}
            </p>
          </div>

          {/* Moves Stat */}
          <div className="bg-[#182344] border border-[#2b3a6a] p-3 rounded-2xl space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              <Target size={14} />
              <span>Moves</span>
            </div>
            <p className="text-lg sm:text-xl font-black font-mono text-white">
              {stats.moves}
            </p>
          </div>

          {/* Accuracy Stat */}
          <div className="bg-[#182344] border border-[#2b3a6a] p-3 rounded-2xl space-y-1">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              <Flame size={14} />
              <span>Accuracy</span>
            </div>
            <p className="text-lg sm:text-xl font-black font-mono text-emerald-300">
              {stats.accuracy}%
            </p>
          </div>
        </div>

        {/* XP Reward Banner */}
        <div className="bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-amber-500/20 border border-amber-500/40 p-3.5 rounded-2xl flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-amber-500/30 flex items-center justify-center text-amber-300">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-200 uppercase tracking-wider">Reward Claimed</p>
              <p className="text-[11px] text-slate-300">+25 Experience & Bond XP added</p>
            </div>
          </div>
          <span className="text-xl font-black text-amber-400 tracking-tight">
            +{stats.xpEarned} XP
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#F06543] to-[#ff7849] hover:from-[#e05432] hover:to-[#f06543] text-white font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(240,101,67,0.4)] active:scale-98 transition-all cursor-pointer"
          >
            <RotateCcw size={18} />
            <span>Play Again (Reshuffle)</span>
          </button>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={onSelectCategory}
              className="py-3 px-4 rounded-xl bg-[#1e2a4f] hover:bg-[#253563] border border-[#33457a] text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Grid size={16} />
              <span>Categories</span>
            </button>

            <button
              onClick={onNavigateHome}
              className="py-3 px-4 rounded-xl bg-[#1e2a4f] hover:bg-[#253563] border border-[#33457a] text-slate-200 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>Dashboard</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
