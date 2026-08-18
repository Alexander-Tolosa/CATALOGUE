import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, LanguageTrack, AppView } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Globe, LogOut, User, Flame, Heart, Menu } from 'lucide-react';

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
  const { logout } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header
      /* 
        MOBILE-FIRST CHANGE:
        - h-14 on mobile (<640px) to conserve screen real estate, scaling to h-16 on sm+ viewports.
        - left-0 on mobile, md:left-64 on tablet/desktop to make room for fixed sidebar.
        - px-3 on mobile to prevent overflow, md:px-6 on desktop.
      */
      className={`fixed top-0 right-0 left-0 md:left-64 h-14 sm:h-16 backdrop-blur-md border-b flex items-center justify-between px-3 sm:px-4 md:px-6 z-40 transition-colors duration-250 ${
        isDarkMode
          ? 'bg-[#0b0f19]/90 border-[#1e293b] text-white'
          : 'bg-white/90 border-[#EDE5DA] text-[#2B2725] shadow-2xs'
      }`}
    >
      {/* Left Title / Language Track Switcher & Mobile Hamburger Button */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        {/* Mobile Hamburger Menu Toggle Button */}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent('catalogue:toggle-mobile-drawer'))}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-[#F06543]" />
        </button>
        {activeView === 'translator' ? (
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-[#F06543] shrink-0" />
            <h2 className={`font-display text-base sm:text-xl font-bold tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
              Translator
            </h2>
          </div>
        ) : activeView === 'scanner' ? (
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F06543] text-xl shrink-0">
              document_scanner
            </span>
            <h2 className={`font-display text-base sm:text-xl font-bold tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
              Scan & Translate
            </h2>
          </div>
        ) : activeView === 'kleo' ? (
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h2 className={`font-display text-base sm:text-xl font-bold tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
              Kleo Hub
            </h2>
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4EE] border border-[#F06543]/30 text-[#F06543]">
              <span className="material-symbols-outlined text-[#F06543] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="font-bold text-xs">{profile.streakDays + 2} Day Streak</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Right Controls Bar */}
      <div className="flex items-center gap-1.5 sm:gap-3 md:gap-4 shrink-0">
        {/* Streak Flame Pill */}
        <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full border shadow-2xs ${
          isDarkMode
            ? 'bg-[#131b2e] border-[#1e293b] text-amber-400'
            : 'bg-[#FFF4EE] border-[#FDE3D5] text-[#F06543]'
        }`}>
          <span className="material-symbols-outlined text-sm sm:text-base streak-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
            local_fire_department
          </span>
          {/* MOBILE-FIRST CHANGE: Hide verbose 'Day Streak' label on mobile (<640px) */}
          <span className="font-extrabold text-xs">
            {profile.streakDays} <span className="hidden sm:inline">Day Streak</span>
          </span>
        </div>

        {/* Hearts Pill */}
        <div className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full border shadow-2xs ${
          isDarkMode
            ? 'bg-[#131b2e] border-[#1e293b] text-rose-400'
            : 'bg-rose-50 border-rose-200 text-rose-500'
        }`}>
          <span className="material-symbols-outlined text-sm sm:text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
            favorite
          </span>
          <span className="font-extrabold text-xs">{profile.hearts}</span>
        </div>

        {/* Level & XP Progress Bar */}
        {/* MOBILE-FIRST CHANGE: Hidden on narrow mobile screens (hidden sm:flex) to prevent header congestion */}
        <div className="hidden sm:flex items-center gap-2.5">
          <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-[#7A736E]'}`}>
            Lv. {profile.level}
          </span>
          <div className={`w-20 md:w-24 h-2 rounded-full overflow-hidden border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#FAF6F0] border-[#EDE5DA]'}`}>
            <div className="h-full bg-gradient-to-r from-[#F06543] to-[#F97316]" style={{ width: `${Math.min(100, profile.xp % 100)}%` }}></div>
          </div>
        </div>

        {/* Investor Pitch Deck Launcher */}
        <button
          onClick={onOpenPitchModal}
          className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-[#F06543] hover:bg-[#131b2e]' : 'text-[#F06543] hover:bg-[#FAF6F0]'}`}
          title="Investor Pitch Deck"
        >
          <span className="material-symbols-outlined text-lg sm:text-xl">auto_awesome</span>
        </button>

        {/* Profile Avatar Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#1e293b] border-slate-700 text-white hover:border-[#F06543]'
                : 'bg-[#FFF4EE] border-[#FDE3D5] text-[#F06543] hover:border-[#F06543]'
            }`}
            title="User Settings & Account"
          >
            {profile.name ? profile.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </button>

          {/* Dropdown Menu Popup */}
          {isMenuOpen && (
            <div className={`absolute right-0 mt-2 w-48 rounded-2xl border shadow-lg py-1.5 z-50 transition-all animate-fadeIn ${
              isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] text-white'
                : 'bg-white border-[#EDE5DA] text-[#2B2725]'
            }`}>
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-xs font-bold truncate">{profile.name || 'User'}</p>
                <p className={`text-[10px] truncate ${isDarkMode ? 'text-slate-400' : 'text-[#7A736E]'}`}>
                  Level {profile.level} Learner
                </p>
              </div>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                }}
                className="w-full px-4 py-2.5 text-left text-xs font-bold flex items-center gap-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
