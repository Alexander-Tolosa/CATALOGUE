import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, LanguageTrack, AppView } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { Globe, LogOut, User } from 'lucide-react';

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
      className={`fixed top-0 right-0 left-0 md:left-64 h-16 backdrop-blur-md border-b flex items-center justify-between px-6 z-40 transition-colors duration-250 ${
        isDarkMode
          ? 'bg-[#0b0f19]/90 border-[#1e293b] text-white'
          : 'bg-white/90 border-[#EDE5DA] text-[#2B2725] shadow-2xs'
      }`}
    >
      {/* Left Title / Language Track Switcher */}
      <div className="flex items-center gap-4">
        {activeView === 'translator' ? (
          <div className="flex items-center gap-2.5">
            <Globe className="w-5.5 h-5.5 text-[#F06543]" />
            <h2 className={`font-display text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
              Translator
            </h2>
          </div>
        ) : activeView === 'kleo' ? (
          <div className="flex items-center gap-3">
            <h2 className={`font-display text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
              Kleo Companion Hub
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF4EE] border border-[#F06543]/30 text-[#F06543]">
              <span className="material-symbols-outlined text-[#F06543] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="font-bold text-xs">{profile.streakDays + 2} Day Streak</span>
            </div>
          </div>
        ) : activeView === 'chatbot' ? (
          <div className="flex items-center gap-3">
            <h2 className={`font-display text-xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#2B2725]'}`}>
              AI Chat Room
            </h2>
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        ) : null}
      </div>

      {/* Right Controls Bar */}
      <div className="flex items-center gap-3 md:gap-4">
        {activeView !== 'chatbot' && (
          <>
            {/* Streak Flame Pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs ${
              isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] text-amber-400'
                : 'bg-[#FFF4EE] border-[#FDE3D5] text-[#F06543]'
            }`}>
              <span className="material-symbols-outlined text-base streak-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
              <span className="font-extrabold text-xs">{profile.streakDays} Day Streak</span>
            </div>

            {/* Hearts Pill */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-2xs ${
              isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] text-rose-400'
                : 'bg-rose-50 border-rose-200 text-rose-500'
            }`}>
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                favorite
              </span>
              <span className="font-extrabold text-xs">{profile.hearts}</span>
            </div>

            {/* Level & XP Progress Bar */}
            <div className="hidden sm:flex items-center gap-2.5">
              <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-[#7A736E]'}`}>
                Lv. {profile.level}
              </span>
              <div className={`w-24 h-2 rounded-full overflow-hidden border ${isDarkMode ? 'bg-[#1e293b] border-[#334155]' : 'bg-[#FAF6F0] border-[#EDE5DA]'}`}>
                <div className="h-full bg-gradient-to-r from-[#F06543] to-[#F97316]" style={{ width: `${Math.min(100, profile.xp % 100)}%` }}></div>
              </div>
            </div>
          </>
        )}

        {/* Investor Pitch Deck Launcher */}
        <button
          onClick={onOpenPitchModal}
          className={`p-1.5 rounded-full transition-colors ${isDarkMode ? 'text-[#F06543] hover:bg-[#131b2e]' : 'text-[#F06543] hover:bg-[#FAF6F0]'
            }`}
          title="Investor Pitch Deck"
        >
          <span className="material-symbols-outlined text-xl">auto_awesome</span>
        </button>

        {/* Profile Avatar Dropdown Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs border transition-all cursor-pointer ${
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
