import React from 'react';
import { LanguageTrack, UserProfile } from '../../types';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import { Flame, Heart, Award, Shield, Zap, Sparkles, ChevronDown, Trophy } from 'lucide-react';
import { FlagIcon } from '../Common/FlagIcon';

interface RightSidebarProps {
  profile: UserProfile;
  onSelectLanguage: (lang: LanguageTrack) => void;
  onOpenWardrobe: () => void;
  onOpenLeaderboard: () => void;
  onOpenReviewDeck: () => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  profile,
  onSelectLanguage,
  onOpenWardrobe,
  onOpenLeaderboard,
  onOpenReviewDeck
}) => {
  return (
    <aside className="w-80 space-y-6 shrink-0 hidden lg:block">
      {/* 1. Top Status Icons Header Bar */}
      <div className="flex items-center justify-between bg-[#090e1c] border border-slate-800 p-3.5 rounded-2xl shadow-xl">
        {/* Language Flag Selector Dropdown */}
        <div className="relative group">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700/90 text-xs font-black text-slate-100 hover:bg-slate-800 transition-colors shadow-md">
            <FlagIcon code={profile.selectedLanguage === 'ko' ? 'kr' : profile.selectedLanguage === 'ja' ? 'jp' : 'us'} size="sm" />
            <span className="font-mono">1</span>
            <ChevronDown size={14} className="text-slate-400" />
          </button>

          {/* Language Dropdown Menu */}
          <div className="absolute top-full left-0 mt-1.5 w-40 bg-slate-900 border border-slate-700 rounded-xl p-1.5 shadow-2xl hidden group-hover:block z-50">
            <button
              onClick={() => onSelectLanguage('ko')}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
            >
              <FlagIcon code="kr" size="sm" /> Korean
            </button>
            <button
              onClick={() => onSelectLanguage('ja')}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
            >
              <FlagIcon code="jp" size="sm" /> Japanese
            </button>
            <button
              onClick={() => onSelectLanguage('en')}
              className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer"
            >
              <FlagIcon code="us" size="sm" /> English
            </button>
          </div>
        </div>

        {/* Streak Flame */}
        <div className="flex items-center gap-1 text-orange-400 font-black text-xs bg-amber-950/60 px-2.5 py-1 rounded-xl border border-amber-800/80">
          <Flame size={18} fill="#f97316" />
          <span>{profile.streakDays}</span>
        </div>

        {/* Gems / XP */}
        <div className="flex items-center gap-1 text-sky-400 font-black text-xs bg-sky-950/60 px-2.5 py-1 rounded-xl border border-sky-800/80">
          <span className="text-base">💎</span>
          <span>{profile.xp + 370}</span>
        </div>

        {/* Hearts Life */}
        <div className="flex items-center gap-1 text-rose-400 font-black text-xs bg-rose-950/60 px-2.5 py-1 rounded-xl border border-rose-800/80">
          <Heart size={18} fill="#f43f5e" />
          <span>{profile.hearts}</span>
        </div>
      </div>

      {/* 2. Card 1: Kleo Super / Kleo Pro Card */}
      <div className="bg-gradient-to-br from-[#0c1527] via-slate-900 to-sky-950/80 border border-sky-400/40 p-6 rounded-3xl shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 max-w-[70%]">
            <span className="text-[10px] font-black tracking-widest text-sky-300 uppercase bg-sky-950 px-2.5 py-1 rounded-full border border-sky-700 inline-block shadow-md">
              SUPER KLEO PRO
            </span>
            <h3 className="font-brand text-lg font-black text-white mt-1">
              Try Kleo Pro for free
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              No ads, personalized practice, and unlimited companion features!
            </p>
          </div>

          <div className="shrink-0 transform translate-x-2 -translate-y-2">
            <KleoAvatar mood="happy" equippedCosmetics={profile.equippedCosmetics} size={90} />
          </div>
        </div>

        <button
          onClick={onOpenWardrobe}
          className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-xs tracking-wider shadow-xl transition-all hover:scale-[1.02]"
        >
          TRY 1 WEEK FREE / WARDROBE
        </button>
      </div>

      {/* 3. Card 2: Unlock Leaderboards */}
      <div className="bg-[#090e1c] border border-slate-800/90 p-5 rounded-3xl shadow-xl space-y-3">
        <h3 className="font-brand text-sm font-black text-white flex items-center justify-between">
          <span>Unlock Leaderboards!</span>
          <Trophy size={16} className="text-amber-400" />
        </h3>

        <div className="flex items-center gap-3.5 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
          <div className="w-11 h-11 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 shadow-md">
            <Shield size={22} />
          </div>
          <p className="text-xs text-slate-300 font-semibold leading-relaxed">
            Complete 1 more lesson to start competing in weekly leagues
          </p>
        </div>
      </div>

      {/* 4. Card 3: Daily Quests Progress Card */}
      <div className="bg-[#090e1c] border border-slate-800/90 p-5 rounded-3xl shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-brand text-sm font-black text-white">
            Daily Quests
          </h3>
          <button
            onClick={onOpenReviewDeck}
            className="text-[11px] font-black text-sky-400 hover:underline uppercase tracking-wider"
          >
            VIEW ALL
          </button>
        </div>

        <div className="flex items-center gap-3.5 bg-slate-900/90 p-3.5 rounded-2xl border border-slate-800">
          <Zap size={26} className="text-amber-400 shrink-0 fill-amber-400" />

          <div className="flex-1 space-y-1.5">
            <div className="flex justify-between text-xs font-black text-slate-200">
              <span>Earn 10 XP</span>
              <span className="text-slate-400 font-mono">0 / 10</span>
            </div>

            <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 flex items-center">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                style={{ width: '40%' }}
              />
            </div>
          </div>

          <span className="text-xl shrink-0">🎁</span>
        </div>
      </div>
    </aside>
  );
};
