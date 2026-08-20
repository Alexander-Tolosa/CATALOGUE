import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, LanguageTrack, AppView } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import {
  Mail,
  Bell,
  Calendar,
  ChevronDown,
  Moon,
  Sun,
  HelpCircle,
  Printer,
  Globe,
  LogOut,
  Menu,
  X,
  Flame,
  CheckCircle2,
  BookOpen,
  Sparkles,
  User
} from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  activeView: AppView;
  onSelectLanguage: (lang: LanguageTrack) => void;
  onOpenPitchModal: () => void;
  onSelectView?: (view: AppView) => void;
}

export const TopAppBar: React.FC<HeaderProps> = ({
  profile,
  activeView,
  onSelectLanguage,
  onOpenPitchModal,
  onSelectView
}) => {
  const { isDarkMode, toggleThemeMode } = useAppStore();
  const { googleUser, logout } = useAuthStore();

  // Dropdown states
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLangSubmenuOpen, setIsLangSubmenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mailRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
        setIsLangSubmenuOpen(false);
      }
      if (mailRef.current && !mailRef.current.contains(target)) {
        setIsMailOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(target)) {
        setIsBellOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(target)) {
        setIsCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName = (
    googleUser?.name ||
    profile.name ||
    'ALEXANDER MICHAEL...'
  ).toUpperCase();

  const currentLanguageLabel =
    profile.selectedLanguage === 'ko'
      ? 'Korean (KR)'
      : profile.selectedLanguage === 'ja'
      ? 'Japanese (JP)'
      : 'English (US)';

  const handlePrint = () => {
    setIsProfileMenuOpen(false);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <>
      <header
        className={`fixed top-0 right-0 left-0 md:left-64 h-16 backdrop-blur-md border-b flex items-center justify-between px-3 sm:px-5 md:px-6 z-40 transition-colors duration-200 select-none ${
          isDarkMode
            ? 'bg-[#0e1322]/95 border-[#1d2538] text-white'
            : 'bg-[#ffffff]/95 border-[#e8dfd3] text-[#2b2725] shadow-xs'
        }`}
      >
        {/* Left Section: Mobile Menu + Day Streak Flame Badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          {/* Mobile Drawer Hamburger */}
          <button
            onClick={() =>
              window.dispatchEvent(new CustomEvent('catalogue:toggle-mobile-drawer'))
            }
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            title="Open Menu"
          >
            <Menu className="w-5 h-5 text-[#F06543]" />
          </button>

          {/* Day Streak Pill (Maintained as requested) */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border shadow-xs transition-transform hover:scale-105 cursor-default ${
              isDarkMode
                ? 'bg-[#151c2e] border-[#24304c] text-amber-400'
                : 'bg-[#FFF4EE] border-[#FDE3D5] text-[#F06543]'
            }`}
            title={`You're on a ${profile.streakDays} Day Study Streak!`}
          >
            <span
              className="material-symbols-outlined text-base streak-pulse text-amber-500"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="font-extrabold text-xs tracking-tight">
              {profile.streakDays} <span className="hidden sm:inline">Day Streak</span>
            </span>
          </div>
        </div>

        {/* Right Section: Notification Badges & Profile */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-5 min-w-0">
          {/* 1. Messages Icon with Red Badge (25) */}
          <div className="relative" ref={mailRef}>
            <button
              onClick={() => {
                setIsMailOpen(!isMailOpen);
                setIsBellOpen(false);
                setIsCalendarOpen(false);
                setIsProfileMenuOpen(false);
              }}
              className={`relative p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="25 Unread Tutor Prompts & Messages"
            >
              <Mail className="w-5 h-5 stroke-[1.8]" />
              {/* Red Badge 25 */}
              <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#e11d48] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border border-white/20">
                25
              </span>
            </button>

            {/* Mail Popover */}
            {isMailOpen && (
              <div
                className={`absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border shadow-2xl p-3 z-50 animate-fadeIn ${
                  isDarkMode
                    ? 'bg-[#131722] border-[#22283a] text-white'
                    : 'bg-white border-[#e0d6c7] text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                  <span className="font-extrabold text-xs tracking-tight">Kleo AI Tutor Messages</span>
                  <span className="text-[10px] font-bold text-[#e11d48] bg-rose-500/15 px-2 py-0.5 rounded-full">
                    25 New
                  </span>
                </div>
                <div className="py-2 space-y-2 max-h-56 overflow-y-auto text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F06543]/10 border border-[#F06543]/20 space-y-1">
                    <p className="font-bold text-[#F06543]">🐾 Kleo Tip of the Day</p>
                    <p className="text-[11px] text-slate-300 dark:text-slate-300 leading-relaxed">
                      "Remember that Korean polite endings (~요) soften your requests in cafes and restaurants!"
                    </p>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                    <p className="font-semibold text-slate-200">Flashcard Review Reminder</p>
                    <p className="text-[11px] text-slate-400">
                      You have 2 review items scheduled for spaced repetition review today.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 3. Notifications Bell Icon with Red Badge (38) */}
          <div className="relative" ref={bellRef}>
            <button
              onClick={() => {
                setIsBellOpen(!isBellOpen);
                setIsMailOpen(false);
                setIsCalendarOpen(false);
                setIsProfileMenuOpen(false);
              }}
              className={`relative p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="38 Notifications & Activity Updates"
            >
              <Bell className="w-5 h-5 stroke-[1.8]" />
              {/* Red Badge 38 */}
              <span className="absolute -top-1 -right-1.5 min-w-[18px] h-[18px] px-1 bg-[#e11d48] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-sm border border-white/20">
                38
              </span>
            </button>

            {/* Bell Notifications Popover */}
            {isBellOpen && (
              <div
                className={`absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl border shadow-2xl p-3 z-50 animate-fadeIn ${
                  isDarkMode
                    ? 'bg-[#131722] border-[#22283a] text-white'
                    : 'bg-white border-[#e0d6c7] text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                  <span className="font-extrabold text-xs tracking-tight">Notifications</span>
                  <span className="text-[10px] font-bold text-[#e11d48] bg-rose-500/15 px-2 py-0.5 rounded-full">
                    38 Unread
                  </span>
                </div>
                <div className="py-2 space-y-2 max-h-56 overflow-y-auto text-xs">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className="font-bold text-amber-400">🔥 5-Day Streak Maintained</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">Keep studying today to reach Day 6!</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className="font-bold text-emerald-400">✨ XP Milestone Reached</p>
                    <p className="text-[11px] text-slate-300 mt-0.5">Level {profile.level} unlocked with {profile.xp} total XP.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. Calendar Icon */}
          <div className="relative" ref={calendarRef}>
            <button
              onClick={() => {
                setIsCalendarOpen(!isCalendarOpen);
                setIsMailOpen(false);
                setIsBellOpen(false);
                setIsProfileMenuOpen(false);
              }}
              className={`p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title="Daily Study Calendar & Streak History"
            >
              <Calendar className="w-5 h-5 stroke-[1.8]" />
            </button>

            {/* Calendar Popover */}
            {isCalendarOpen && (
              <div
                className={`absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl p-4 z-50 animate-fadeIn ${
                  isDarkMode
                    ? 'bg-[#131722] border-[#22283a] text-white'
                    : 'bg-white border-[#e0d6c7] text-slate-900'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-700/40">
                  <span className="font-extrabold text-xs">Study Streak Calendar</span>
                  <span className="text-[10px] font-bold text-amber-400">🔥 5 Days</span>
                </div>
                <div className="py-3 text-center space-y-2">
                  <p className="text-xs font-semibold text-slate-300">Active Study Days</p>
                  <div className="grid grid-cols-7 gap-1 text-[10px] font-bold">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
                      <div key={i} className="text-slate-400">{d}</div>
                    ))}
                    {[24, 25, 26, 27, 28, 29, 30].map((day, i) => {
                      const isStreak = i < 5;
                      return (
                        <div
                          key={day}
                          className={`h-7 rounded-lg flex items-center justify-center font-extrabold ${
                            isStreak
                              ? 'bg-[#F06543] text-white shadow-xs'
                              : 'bg-slate-800/40 text-slate-500'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 5. User Profile Avatar with Chevron Down (Exact Picture 1 & Picture 3 Reference) */}
          <div className="relative" ref={profileMenuRef}>
            <div
              className="flex items-center gap-2.5 group select-none"
              title="My Profile"
            >
              {/* Cyan/Sky Blue Circle Avatar with Overlaid Chevron Badge */}
              <div className="relative shrink-0">
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    if (onSelectView) {
                      onSelectView('profile');
                    } else {
                      window.dispatchEvent(new CustomEvent('catalogue:navigate-view', { detail: 'profile' }));
                    }
                  }}
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#38bdf8] to-[#22d3ee] p-0.5 shadow-md flex items-center justify-center overflow-hidden border border-white/40 cursor-pointer hover:scale-105 transition-transform"
                  title="View Profile"
                >
                  {googleUser?.picture ? (
                    <img
                      src={googleUser.picture}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    /* Default Stylish User Avatar Vector Graphic (Matching Picture 1) */
                    <svg
                      viewBox="0 0 100 100"
                      className="w-full h-full object-cover"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="50" cy="50" r="50" fill="#38BDF8" />
                      {/* Shirt */}
                      <path
                        d="M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z"
                        fill="#10B981"
                      />
                      {/* Neck */}
                      <rect x="44" y="52" width="12" height="18" fill="#8D5B4C" />
                      {/* Face */}
                      <ellipse cx="50" cy="46" rx="16" ry="18" fill="#8D5B4C" />
                      {/* Smile */}
                      <path
                        d="M 44 54 Q 50 60 56 54"
                        stroke="#FFFFFF"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                      />
                      {/* Hair */}
                      <path
                        d="M 33 42 C 33 28 42 22 50 22 C 58 22 67 28 67 42 C 67 33 60 28 50 28 C 40 28 33 33 33 42 Z"
                        fill="#1F2937"
                      />
                    </svg>
                  )}
                </button>

                {/* Overlaid Dark Round Badge with Chevron Down Icon (Toggles Menu) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsProfileMenuOpen(!isProfileMenuOpen);
                    setIsMailOpen(false);
                    setIsBellOpen(false);
                    setIsCalendarOpen(false);
                  }}
                  className={`absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center border shadow-xs transition-transform duration-200 cursor-pointer ${
                    isProfileMenuOpen ? 'rotate-180' : ''
                  } ${
                    isDarkMode
                      ? 'bg-[#161a26] border-[#2b3145] text-slate-300 hover:text-white'
                      : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                  title="Account Menu"
                >
                  <ChevronDown className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Profile Dropdown Menu (Picture 3 Reference) */}
            {isProfileMenuOpen && (
              <div
                className={`absolute right-0 mt-3 w-60 rounded-2xl border shadow-2xl py-2 z-50 animate-fadeIn ${
                  isDarkMode
                    ? 'bg-[#131722] border-[#22283a] text-slate-100'
                    : 'bg-white border-[#e2d9cd] text-slate-800'
                }`}
              >
                {/* 0. My Profile & Awards */}
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    if (onSelectView) {
                      onSelectView('profile');
                    } else {
                      window.dispatchEvent(new CustomEvent('catalogue:navigate-view', { detail: 'profile' }));
                    }
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer text-[#F06543] ${
                    isDarkMode ? 'hover:bg-[#1a2032]' : 'hover:bg-[#f6f1e8]'
                  }`}
                >
                  <span className="font-extrabold flex items-center gap-2">
                    <User className="w-4 h-4 text-[#F06543]" />
                    <span>My Profile & Friends</span>
                  </span>
                  <span className="text-[10px] font-black bg-[#F06543]/15 text-[#F06543] px-2 py-0.5 rounded-full">
                    CLASE
                  </span>
                </button>

                <div className={`my-1 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`} />

                {/* 1. Toggle Dark Mode */}
                <button
                  onClick={() => {
                    toggleThemeMode();
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'hover:bg-[#1a2032] text-slate-200'
                      : 'hover:bg-[#f6f1e8] text-slate-800'
                  }`}
                >
                  <span>Toggle dark mode</span>
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {/* 2. Help */}
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    setIsHelpModalOpen(true);
                  }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'hover:bg-[#1a2032] text-slate-200'
                      : 'hover:bg-[#f6f1e8] text-slate-800'
                  }`}
                >
                  <span>Help</span>
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                </button>

                {/* 3. Print this page */}
                <button
                  onClick={handlePrint}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'hover:bg-[#1a2032] text-slate-200'
                      : 'hover:bg-[#f6f1e8] text-slate-800'
                  }`}
                >
                  <span>Print this page</span>
                  <Printer className="w-4 h-4 text-slate-400" />
                </button>

                {/* 4. English (US) / Active Language Track */}
                <div className="relative">
                  <button
                    onClick={() => setIsLangSubmenuOpen(!isLangSubmenuOpen)}
                    className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'hover:bg-[#1a2032] text-slate-200'
                        : 'hover:bg-[#f6f1e8] text-slate-800'
                    }`}
                  >
                    <span>{currentLanguageLabel}</span>
                    <Globe className="w-4 h-4 text-[#F06543]" />
                  </button>

                  {/* Language Track Submenu */}
                  {isLangSubmenuOpen && (
                    <div
                      className={`mx-2 my-1 rounded-xl p-1 border space-y-1 ${
                        isDarkMode
                          ? 'bg-[#1a2032] border-[#28324a]'
                          : 'bg-[#f6f1e8] border-[#e0d6c7]'
                      }`}
                    >
                      <button
                        onClick={() => {
                          onSelectLanguage('en');
                          setIsLangSubmenuOpen(false);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-bold flex items-center justify-between ${
                          profile.selectedLanguage === 'en'
                            ? 'bg-[#F06543] text-white'
                            : 'text-slate-300 hover:bg-slate-700/40'
                        }`}
                      >
                        <span>🇺🇸 English (US)</span>
                        {profile.selectedLanguage === 'en' && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          onSelectLanguage('ko');
                          setIsLangSubmenuOpen(false);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-bold flex items-center justify-between ${
                          profile.selectedLanguage === 'ko'
                            ? 'bg-[#F06543] text-white'
                            : 'text-slate-300 hover:bg-slate-700/40'
                        }`}
                      >
                        <span>🇰🇷 Korean (한국어)</span>
                        {profile.selectedLanguage === 'ko' && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          onSelectLanguage('ja');
                          setIsLangSubmenuOpen(false);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-bold flex items-center justify-between ${
                          profile.selectedLanguage === 'ja'
                            ? 'bg-[#F06543] text-white'
                            : 'text-slate-300 hover:bg-slate-700/40'
                        }`}
                      >
                        <span>🇯🇵 Japanese (日本語)</span>
                        {profile.selectedLanguage === 'ja' && (
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <div className={`my-1 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`} />

                {/* 5. Log out */}
                <button
                  onClick={() => {
                    setIsProfileMenuOpen(false);
                    logout();
                  }}
                  className="w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <span>Log out</span>
                  <LogOut className="w-4 h-4 text-rose-500" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Interactive Help Modal */}
      {isHelpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn">
          <div
            className={`w-full max-w-lg rounded-3xl border shadow-2xl p-6 sm:p-8 space-y-5 relative ${
              isDarkMode
                ? 'bg-[#101524] border-[#222b42] text-white'
                : 'bg-white border-[#e0d6c7] text-slate-900'
            }`}
          >
            <button
              onClick={() => setIsHelpModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-slate-800/40 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F06543]/20 border border-[#F06543]/30 flex items-center justify-center text-[#F06543]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl tracking-tight">
                  CATALOGUE Help & Guide
                </h3>
                <p className="text-xs text-slate-400">
                  Quick tips to maximize your daily language learning
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                <p className="font-bold text-[#F06543] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" /> Daily Streaks
                </p>
                <p className="text-slate-300">
                  Complete at least one lesson or review session daily to increase your streak and earn bonus bond XP.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                <p className="font-bold text-sky-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Kleo AI Companion
                </p>
                <p className="text-slate-300">
                  Ask Kleo grammar questions anytime via the chat button or practice coffee ordering and job interviews in the Chatroom.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 space-y-1">
                <p className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Spaced Repetition (SM-2)
                </p>
                <p className="text-slate-300">
                  Save translations directly into your Review Deck to reinforce vocabulary with proven memory intervals.
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#F06543] hover:bg-[#E05432] text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

