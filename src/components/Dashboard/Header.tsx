import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfile, LanguageTrack, AppView } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
import {
  Mail,
  Bell,
  ChevronDown,
  Moon,
  Sun,
  HelpCircle,
  Printer,
  Globe,
  GraduationCap,
  Menu,
  X,
  Flame,
  CheckCircle2,
  BookOpen,
  Sparkles
} from 'lucide-react';

interface HeaderProps {
  profile: UserProfile;
  activeView: AppView;
  onSelectLanguage: (lang: LanguageTrack) => void;
  onOpenPitchModal: () => void;
  onSelectView?: (view: AppView) => void;
}

const FlagIcon: React.FC<{ country: 'ja' | 'ko' | 'en'; className?: string }> = ({ country, className = "w-4 h-3 rounded-xs shrink-0" }) => {
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
      <circle cx="2.5" cy="2" r="0.7" fill="#FFFFFF" />
      <circle cx="6" cy="2" r="0.7" fill="#FFFFFF" />
      <circle cx="9.5" cy="2" r="0.7" fill="#FFFFFF" />
      <circle cx="4.25" cy="4" r="0.7" fill="#FFFFFF" />
      <circle cx="7.75" cy="4" r="0.7" fill="#FFFFFF" />
      <circle cx="2.5" cy="6" r="0.7" fill="#FFFFFF" />
      <circle cx="6" cy="6" r="0.7" fill="#FFFFFF" />
      <circle cx="9.5" cy="6" r="0.7" fill="#FFFFFF" />
      <circle cx="4.25" cy="8" r="0.7" fill="#FFFFFF" />
      <circle cx="7.75" cy="8" r="0.7" fill="#FFFFFF" />
    </svg>
  );
};

export const TopAppBar: React.FC<HeaderProps> = ({
  profile,
  activeView,
  onSelectLanguage,
  onOpenPitchModal,
  onSelectView
}) => {
  const { isDarkMode, toggleThemeMode, isSidebarExpanded, interfaceLanguage, setInterfaceLanguage } = useAppStore();
  const { googleUser } = useAuthStore();
  const { t, getLanguageName } = useTranslation();

  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dropdown states
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isMailOpen, setIsMailOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLangSubmenuOpen, setIsLangSubmenuOpen] = useState(false);
  const [isInterfaceLangSubmenuOpen, setIsInterfaceLangSubmenuOpen] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const mailRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setIsProfileMenuOpen(false);
        setIsLangSubmenuOpen(false);
        setIsInterfaceLangSubmenuOpen(false);
      }
      if (mailRef.current && !mailRef.current.contains(target)) {
        setIsMailOpen(false);
      }
      if (bellRef.current && !bellRef.current.contains(target)) {
        setIsBellOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userName = profile.name || profile.personalInfo?.fullName || googleUser?.name || 'Learner';

  const handlePrint = () => {
    setIsProfileMenuOpen(false);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  return (
    <>
      <motion.header
        initial={false}
        animate={{
          left: isDesktop ? (isSidebarExpanded ? 260 : 76) : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 28,
          mass: 0.85
        }}
        className={`fixed top-0 right-0 h-16 backdrop-blur-md border-b flex items-center justify-between px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 z-40 transition-colors duration-200 select-none ${
          isDarkMode
            ? 'bg-[#0e1322]/95 border-[#1d2538] text-white'
            : 'bg-[#ffffff]/95 border-[#e8dfd3] text-[#2b2725] shadow-xs'
        }`}
      >
        {/* Left Section: Mobile Menu + Day Streak Flame Badge */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
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
            title={`${profile.streakDays} ${t.header.dayStreakTitle}`}
          >
            <span
              className="material-symbols-outlined text-base streak-pulse text-amber-500"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              local_fire_department
            </span>
            <span className="font-extrabold text-xs tracking-tight">
              {profile.streakDays} <span className="hidden sm:inline">{t.common.dayStreak}</span>
            </span>
          </div>
        </div>

        {/* Right Section: [Profile Avatar + Username] -> [Messages] -> [Notifications] (Inset inward from far right) */}
        <div className="flex items-center gap-3.5 sm:gap-5 md:gap-6 min-w-0 mr-2 sm:mr-4 md:mr-6 lg:mr-8">
          {/* 1. User Profile Icon with ONLY Username Beside It */}
          <div className="relative" ref={profileMenuRef}>
            <div className="flex items-center gap-2 sm:gap-2.5 select-none">
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
                  {(profile.avatarUrl || profile.personalInfo?.avatarUrl || googleUser?.picture) ? (
                    <img
                      src={profile.avatarUrl || profile.personalInfo?.avatarUrl || googleUser?.picture}
                      alt={userName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    /* Default Stylish User Avatar Vector Graphic */
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

              {/* ONLY Username beside profile icon */}
              <span
                onClick={() => {
                  if (onSelectView) {
                    onSelectView('profile');
                  } else {
                    window.dispatchEvent(new CustomEvent('catalogue:navigate-view', { detail: 'profile' }));
                  }
                }}
                className={`text-xs sm:text-sm font-extrabold uppercase tracking-wide truncate max-w-[110px] sm:max-w-[160px] md:max-w-[200px] cursor-pointer hover:text-[#F06543] transition-colors ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
                title={userName}
              >
                {userName}
              </span>
            </div>

            {/* Profile Dropdown Menu */}
            {isProfileMenuOpen && (
              <div
                className={`absolute left-0 sm:left-auto sm:right-0 mt-2 w-60 rounded-2xl border shadow-2xl py-2 z-50 animate-fadeIn ${
                  isDarkMode
                    ? 'bg-[#131722] border-[#22283a] text-slate-100'
                    : 'bg-white border-[#e2d9cd] text-slate-800'
                }`}
              >
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
                  <span>{t.header.toggleDarkMode}</span>
                  {isDarkMode ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-slate-600" />
                  )}
                </button>

                {/* 2. Interface Language Switcher (Displays only active language) */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsInterfaceLangSubmenuOpen(!isInterfaceLangSubmenuOpen);
                      setIsLangSubmenuOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'hover:bg-[#1a2032] text-slate-200'
                        : 'hover:bg-[#f6f1e8] text-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FlagIcon country={interfaceLanguage as 'ja' | 'ko' | 'en'} className="w-4 h-3 rounded-2xs" />
                      <span className="text-[#F06543]">{getLanguageName(interfaceLanguage)}</span>
                    </span>
                    <Globe className="w-4 h-4 text-[#F06543]" />
                  </button>

                  {/* Interface Language Submenu */}
                  {isInterfaceLangSubmenuOpen && (
                    <div
                      className={`mx-2 my-1 rounded-xl p-1 border space-y-1 ${
                        isDarkMode
                          ? 'bg-[#1a2032] border-[#28324a]'
                          : 'bg-[#faf6f0] border-[#e8dfd3]'
                      }`}
                    >
                      <button
                        onClick={() => {
                          setInterfaceLanguage('en');
                          setIsInterfaceLangSubmenuOpen(false);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
                          interfaceLanguage === 'en'
                            ? 'bg-[#F06543] text-white shadow-xs'
                            : isDarkMode
                            ? 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                            : 'text-slate-800 hover:bg-[#eae1d4] hover:text-slate-950 font-bold'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FlagIcon country="en" className="w-4 h-3 rounded-2xs" />
                          <span>{t.header.english}</span>
                        </span>
                        {interfaceLanguage === 'en' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setInterfaceLanguage('ko');
                          setIsInterfaceLangSubmenuOpen(false);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
                          interfaceLanguage === 'ko'
                            ? 'bg-[#F06543] text-white shadow-xs'
                            : isDarkMode
                            ? 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                            : 'text-slate-800 hover:bg-[#eae1d4] hover:text-slate-950 font-bold'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FlagIcon country="ko" className="w-4 h-3 rounded-2xs" />
                          <span>{t.header.korean}</span>
                        </span>
                        {interfaceLanguage === 'ko' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setInterfaceLanguage('ja');
                          setIsInterfaceLangSubmenuOpen(false);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
                          interfaceLanguage === 'ja'
                            ? 'bg-[#F06543] text-white shadow-xs'
                            : isDarkMode
                            ? 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                            : 'text-slate-800 hover:bg-[#eae1d4] hover:text-slate-950 font-bold'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FlagIcon country="ja" className="w-4 h-3 rounded-2xs" />
                          <span>{t.header.japanese}</span>
                        </span>
                        {interfaceLanguage === 'ja' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* 3. Study Track Switcher (Displays only active learning language) */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setIsLangSubmenuOpen(!isLangSubmenuOpen);
                      setIsInterfaceLangSubmenuOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'hover:bg-[#1a2032] text-slate-200'
                        : 'hover:bg-[#f6f1e8] text-slate-800'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <FlagIcon country={profile.selectedLanguage as 'ja' | 'ko' | 'en'} className="w-4 h-3 rounded-2xs" />
                      <span className="text-emerald-500">{getLanguageName(profile.selectedLanguage as LanguageTrack)}</span>
                    </span>
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                  </button>

                  {/* Language Track Submenu */}
                  {isLangSubmenuOpen && (
                    <div
                      className={`mx-2 my-1 rounded-xl p-1 border space-y-1 ${
                        isDarkMode
                          ? 'bg-[#1a2032] border-[#28324a]'
                          : 'bg-[#faf6f0] border-[#e8dfd3]'
                      }`}
                    >
                      <button
                        onClick={() => {
                          onSelectLanguage('en');
                          setIsLangSubmenuOpen(false);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
                          profile.selectedLanguage === 'en'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : isDarkMode
                            ? 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                            : 'text-slate-800 hover:bg-[#eae1d4] hover:text-slate-950 font-bold'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FlagIcon country="en" className="w-4 h-3 rounded-2xs" />
                          <span>{t.header.english}</span>
                        </span>
                        {profile.selectedLanguage === 'en' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          onSelectLanguage('ko');
                          setIsLangSubmenuOpen(false);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
                          profile.selectedLanguage === 'ko'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : isDarkMode
                            ? 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                            : 'text-slate-800 hover:bg-[#eae1d4] hover:text-slate-950 font-bold'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FlagIcon country="ko" className="w-4 h-3 rounded-2xs" />
                          <span>{t.header.korean}</span>
                        </span>
                        {profile.selectedLanguage === 'ko' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>

                      <button
                        onClick={() => {
                          onSelectLanguage('ja');
                          setIsLangSubmenuOpen(false);
                          setIsProfileMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-lg text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
                          profile.selectedLanguage === 'ja'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : isDarkMode
                            ? 'text-slate-300 hover:bg-slate-700/40 hover:text-white'
                            : 'text-slate-800 hover:bg-[#eae1d4] hover:text-slate-950 font-bold'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <FlagIcon country="ja" className="w-4 h-3 rounded-2xs" />
                          <span>{t.header.japanese}</span>
                        </span>
                        {profile.selectedLanguage === 'ja' && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Help */}
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
                  <span>{t.header.help}</span>
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                </button>

                {/* 5. Print this page */}
                <button
                  onClick={handlePrint}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'hover:bg-[#1a2032] text-slate-200'
                      : 'hover:bg-[#f6f1e8] text-slate-800'
                  }`}
                >
                  <span>{t.header.printPage}</span>
                  <Printer className="w-4 h-4 text-slate-400" />
                </button>
              </div>
            )}
          </div>

          {/* 2. Messages Icon with Red Badge (25) */}
          <div className="relative" ref={mailRef}>
            <button
              onClick={() => {
                setIsMailOpen(!isMailOpen);
                setIsBellOpen(false);
                setIsProfileMenuOpen(false);
              }}
              className={`relative p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={t.header.messagesTitle}
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
                <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-700/40' : 'border-[#e0d6c7]'}`}>
                  <span className="font-extrabold text-xs tracking-tight">{t.header.messagesTitle}</span>
                  <span className="text-[10px] font-bold text-[#e11d48] bg-rose-500/15 px-2 py-0.5 rounded-full">
                    {t.header.unreadTutorMessages}
                  </span>
                </div>
                <div className="py-2 space-y-2 max-h-56 overflow-y-auto text-xs">
                  <div className="p-2.5 rounded-xl bg-[#F06543]/10 border border-[#F06543]/20 space-y-1">
                    <p className="font-bold text-[#F06543]">{t.header.kleoTipOfDay}</p>
                    <p className={`text-[11px] leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      {t.header.kleoTipContent}
                    </p>
                  </div>
                  <div className={`p-2.5 rounded-xl border space-y-1 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-[#faf6f0] border-[#e8dfd3]'}`}>
                    <p className={`font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>{t.header.reviewReminderTitle}</p>
                    <p className={`text-[11px] ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      {t.header.reviewReminderContent}
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
                setIsProfileMenuOpen(false);
              }}
              className={`relative p-1.5 sm:p-2 rounded-xl transition-colors cursor-pointer ${
                isDarkMode
                  ? 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
              title={t.header.notificationsTitle}
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
                <div className={`flex items-center justify-between pb-2 border-b ${isDarkMode ? 'border-slate-700/40' : 'border-[#e0d6c7]'}`}>
                  <span className="font-extrabold text-xs tracking-tight">{t.header.notificationsTitle}</span>
                  <span className="text-[10px] font-bold text-[#e11d48] bg-rose-500/15 px-2 py-0.5 rounded-full">
                    {t.header.unreadNotifications}
                  </span>
                </div>
                <div className="py-2 space-y-2 max-h-56 overflow-y-auto text-xs">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                    <p className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>{t.header.streakMaintainedTitle}</p>
                    <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.header.streakMaintainedContent}</p>
                  </div>
                  <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <p className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{t.header.milestoneReachedTitle}</p>
                    <p className={`text-[11px] mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.header.milestoneReachedContent}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.header>

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
              className={`absolute top-5 right-5 p-1.5 rounded-full transition-colors cursor-pointer ${
                isDarkMode ? 'hover:bg-slate-800/40 text-slate-400 hover:text-white' : 'hover:bg-slate-200 text-slate-600 hover:text-slate-950'
              }`}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F06543]/20 border border-[#F06543]/30 flex items-center justify-center text-[#F06543]">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-xl tracking-tight">
                  {t.header.helpTitle}
                </h3>
                <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {t.header.helpSubtitle}
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <div className={`p-3 rounded-xl border space-y-1 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-[#faf6f0] border-[#e8dfd3]'}`}>
                <p className="font-bold text-[#F06543] flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-amber-500" /> {t.header.dailyStreaksTitle}
                </p>
                <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                  {t.header.dailyStreaksDesc}
                </p>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-[#faf6f0] border-[#e8dfd3]'}`}>
                <p className={`font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>
                  <Sparkles className="w-4 h-4" /> {t.header.kleoCompanionTitle}
                </p>
                <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                  {t.header.kleoCompanionDesc}
                </p>
              </div>

              <div className={`p-3 rounded-xl border space-y-1 ${isDarkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-[#faf6f0] border-[#e8dfd3]'}`}>
                <p className={`font-bold flex items-center gap-1.5 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                  <BookOpen className="w-4 h-4" /> {t.header.spacedRepetitionTitle}
                </p>
                <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                  {t.header.spacedRepetitionDesc}
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsHelpModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#F06543] hover:bg-[#E05432] text-white font-extrabold text-xs transition-all shadow-md cursor-pointer"
              >
                {t.common.gotIt}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
