import React from 'react';
import { UserProfile, LanguageTrack, AppView } from '../../types';

interface HeaderProps {
  profile: UserProfile;
  activeView: AppView;
  onSelectLanguage: (lang: LanguageTrack) => void;
  onOpenPitchModal: () => void;
}

export const TopAppBar: React.FC<HeaderProps> = ({
  profile,
  activeView,
  onSelectLanguage,
  onOpenPitchModal
}) => {
  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-[#090d16]/90 backdrop-blur-xl border-b border-[#38bdf8]/15 flex items-center justify-between px-6 z-40">
      {/* Left Title / Pill Switcher */}
      <div className="flex items-center gap-4">
        {activeView === 'translator' ? (
          <h2 className="font-display text-xl font-bold text-white">Translator</h2>
        ) : activeView === 'kleo' ? (
          <div className="flex items-center gap-3">
            <h2 className="font-display text-xl font-bold text-white">Kleo Companion Hub</h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161b2b] border border-[#f97316]/30 text-[#f97316]">
              <span className="material-symbols-outlined text-[#f97316] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="font-bold text-xs">{profile.streakDays + 2} Day Streak</span>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <button className="flex items-center gap-2 bg-[#161b2b] px-4 py-1.5 rounded-full border border-[#38bdf8]/25 text-xs font-bold text-[#f8fafc] hover:bg-[#1e293b] transition-colors shadow-sm">
              <span className="text-base">
                {profile.selectedLanguage === 'ko' ? '🇰🇷' : profile.selectedLanguage === 'ja' ? '🇯🇵' : '🇺🇸'}
              </span>
              <span className="font-semibold">
                {profile.selectedLanguage === 'ko' ? 'Korean Track' : profile.selectedLanguage === 'ja' ? 'Japanese Track' : 'English Track'}
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#38bdf8]">expand_more</span>
            </button>

            <div className="absolute top-full left-0 mt-1 w-44 bg-[#1e293b] border border-[#38bdf8]/25 rounded-2xl p-1.5 shadow-2xl hidden group-hover:block z-50">
              <button
                onClick={() => onSelectLanguage('ko')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#f8fafc] hover:bg-[#090d16] flex items-center gap-2"
              >
                <span>🇰🇷</span> Korean Track
              </button>
              <button
                onClick={() => onSelectLanguage('ja')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#f8fafc] hover:bg-[#090d16] flex items-center gap-2"
              >
                <span>🇯🇵</span> Japanese Track
              </button>
              <button
                onClick={() => onSelectLanguage('en')}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-[#f8fafc] hover:bg-[#090d16] flex items-center gap-2"
              >
                <span>🇺🇸</span> English Track
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {activeView === 'dashboard' && (
          <>
            {/* Streak Flame Pill */}
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161b2b] border border-[#f97316]/30 text-[#f97316]">
              <span className="material-symbols-outlined text-[#f97316] text-base streak-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="font-extrabold text-xs">{profile.streakDays} Day Streak</span>
            </div>

            {/* Hearts Pill */}
            <div className="flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#161b2b] border border-[#ff6b4a]/30 text-[#ff6b4a]">
              <span className="material-symbols-outlined text-[#ff6b4a] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span className="font-extrabold text-xs">{profile.hearts}</span>
            </div>

            {/* Level Bar */}
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs font-bold text-slate-300">Lv. {profile.level}</span>
              <div className="w-28 h-2 bg-[#1e293b] rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] neon-glow" style={{ width: `${Math.min(100, profile.xp % 100)}%` }}></div>
              </div>
            </div>
          </>
        )}

        {/* Pitch Deck Launcher */}
        <button
          onClick={onOpenPitchModal}
          className="p-1.5 rounded-full hover:bg-[#1e293b] text-[#38bdf8] transition-colors"
          title="Investor Pitch Deck"
        >
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
        </button>

        {/* Notifications & Profile */}
        <button className="material-symbols-outlined text-slate-400 hover:text-[#38bdf8] transition-colors text-xl">
          notifications
        </button>
        <button className="material-symbols-outlined text-slate-400 hover:text-[#38bdf8] transition-colors text-xl">
          account_circle
        </button>
      </div>
    </header>
  );
};
