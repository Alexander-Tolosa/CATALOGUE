import React from 'react';
import { UserProfile, LanguageTrack, AppView } from '../../types';
import { useAppStore } from '../../store/useAppStore';

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
  const { isDarkMode } = useAppStore();

  return (
    <header
      className={`fixed top-0 right-0 left-0 md:left-64 h-16 backdrop-blur-md border-b flex items-center justify-between px-6 z-40 transition-colors duration-250 ${
        isDarkMode
          ? 'bg-[#0b0f19]/90 border-[#1e293b] text-white'
          : 'bg-white/90 border-slate-200/80 text-slate-900 shadow-xs'
      }`}
    >
      {/* Left Title / Language Track Switcher */}
      <div className="flex items-center gap-4">
        {activeView === 'translator' ? (
          <h2 className={`font-display text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            Translator
          </h2>
        ) : activeView === 'kleo' ? (
          <div className="flex items-center gap-3">
            <h2 className={`font-display text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Kleo Companion Hub
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff7ed] border border-[#FF6B35]/30 text-[#FF6B35]">
              <span className="material-symbols-outlined text-[#FF6B35] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="font-bold text-xs">{profile.streakDays + 2} Day Streak</span>
            </div>
          </div>
        ) : (
          <div className="relative group">
            <button
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all shadow-2xs ${
                isDarkMode
                  ? 'bg-[#131b2e] border-[#1e293b] text-white hover:border-[#FF6B35]/40'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span className="text-base">
                {profile.selectedLanguage === 'ko' ? '🇰🇷' : profile.selectedLanguage === 'ja' ? '🇯🇵' : '🇺🇸'}
              </span>
              <span className="font-semibold">
                {profile.selectedLanguage === 'ko' ? 'Korean Track' : profile.selectedLanguage === 'ja' ? 'Japanese Track' : 'English Track'}
              </span>
              <span className="material-symbols-outlined text-[18px] text-[#FF6B35]">expand_more</span>
            </button>

            <div
              className={`absolute top-full left-0 mt-1 w-48 rounded-2xl p-1.5 shadow-xl hidden group-hover:block z-50 border ${
                isDarkMode ? 'bg-[#131b2e] border-[#1e293b]' : 'bg-white border-slate-200'
              }`}
            >
              <button
                onClick={() => onSelectLanguage('ko')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  isDarkMode ? 'text-white hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>🇰🇷</span> Korean Track
              </button>
              <button
                onClick={() => onSelectLanguage('ja')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  isDarkMode ? 'text-white hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>🇯🇵</span> Japanese Track
              </button>
              <button
                onClick={() => onSelectLanguage('en')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2 ${
                  isDarkMode ? 'text-white hover:bg-[#1e293b]' : 'text-slate-800 hover:bg-slate-50'
                }`}
              >
                <span>🇺🇸</span> English Track
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Right Controls Bar */}
      <div className="flex items-center gap-3 md:gap-4">
        {activeView === 'dashboard' && (
          <>
            {/* Streak Flame Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff7ed] border border-[#FF6B35]/30 text-[#FF6B35]">
              <span className="material-symbols-outlined text-[#FF6B35] text-base streak-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="font-extrabold text-xs">{profile.streakDays} Day Streak</span>
            </div>

            {/* Hearts Pill */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff1f2] border border-[#ff7849]/30 text-[#ff7849]">
              <span className="material-symbols-outlined text-[#ff7849] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span className="font-extrabold text-xs">{profile.hearts}</span>
            </div>

            {/* Level & XP Progress Bar */}
            <div className="hidden sm:flex items-center gap-2.5">
              <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Lv. {profile.level}
              </span>
              <div className={`w-24 h-2 rounded-full overflow-hidden border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-slate-200 border-slate-300'}`}>
                <div className="h-full bg-gradient-to-r from-[#FF6B35] to-[#ff7849]" style={{ width: `${Math.min(100, profile.xp % 100)}%` }}></div>
              </div>
            </div>
          </>
        )}

        {/* Investor Pitch Deck Launcher */}
        <button
          onClick={onOpenPitchModal}
          className={`p-1.5 rounded-full transition-colors ${
            isDarkMode ? 'text-[#FF6B35] hover:bg-[#131b2e]' : 'text-[#FF6B35] hover:bg-slate-100'
          }`}
          title="Investor Pitch Deck"
        >
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
        </button>

        {/* Notifications Icon */}
        <button className={`material-symbols-outlined transition-colors text-xl ${
          isDarkMode ? 'text-slate-400 hover:text-[#FF6B35]' : 'text-slate-500 hover:text-[#FF6B35]'
        }`}>
          notifications
        </button>

        {/* Profile Avatar Icon */}
        <button className={`material-symbols-outlined transition-colors text-xl ${
          isDarkMode ? 'text-slate-400 hover:text-[#FF6B35]' : 'text-slate-500 hover:text-[#FF6B35]'
        }`}>
          account_circle
        </button>
      </div>
    </header>
  );
};
