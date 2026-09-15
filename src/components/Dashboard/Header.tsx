import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, LanguageTrack, AppView } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
import {
  Mail,
  Bell,
  ChevronDown,
  ChevronRight,
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
import { FlagIcon } from '../Common/FlagIcon';

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

                {/* Overlaid Round Badge with Chevron Down Icon (iPhone AirPlay Trigger) */}
                <div className="absolute -bottom-1 -right-1">
                  {/* AirPlay Expanding Broadcast Waves / Ping Rings */}
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <>
                        <motion.span
                          key="airplay-wave-outer"
                          initial={{ scale: 0.8, opacity: 0.95 }}
                          animate={{ scale: 2.3, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute -inset-0.5 rounded-full border-2 border-sky-400 pointer-events-none"
                        />
                        <motion.span
                          key="airplay-wave-inner"
                          initial={{ scale: 0.8, opacity: 0.6 }}
                          animate={{ scale: 1.7, opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
                          className="absolute -inset-0.5 rounded-full bg-sky-400/35 pointer-events-none"
                        />
                      </>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.82 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsProfileMenuOpen(!isProfileMenuOpen);
                      setIsMailOpen(false);
                      setIsBellOpen(false);
                    }}
                    className={`relative w-5 h-5 rounded-full flex items-center justify-center border shadow-md cursor-pointer transition-all duration-200 ${
                      isProfileMenuOpen
                        ? 'ring-2 ring-sky-400/90 shadow-[0_0_12px_rgba(56,189,248,0.55)] scale-105'
                        : ''
                    } ${
                      isDarkMode
                        ? 'bg-[#181f33] border-white/20 text-slate-200 hover:text-white shadow-black/40'
                        : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 shadow-slate-300/60'
                    }`}
                    title="Account Menu"
                  >
                    <motion.div
                      animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                      transition={{ type: 'spring', stiffness: 480, damping: 22, mass: 0.5 }}
                      className="flex items-center justify-center"
                    >
                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    </motion.div>
                  </motion.button>
                </div>
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

            {/* Profile Dropdown Menu with iPhone AirPlay Pop-Down Animation */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.65, y: -16, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.76, y: -12, filter: 'blur(8px)' }}
                  transition={{
                    type: 'spring',
                    stiffness: 440,
                    damping: 24,
                    mass: 0.62
                  }}
                  style={{ transformOrigin: '28px 0px' }}
                  className={`gpu-layer absolute left-0 sm:-left-2 mt-3 w-72 sm:w-80 rounded-[28px] border p-2.5 z-50 select-none backdrop-blur-3xl overflow-hidden ${
                    isDarkMode
                      ? 'bg-[#121727]/92 border-white/[0.14] text-slate-100 shadow-[0_24px_50px_-10px_rgba(0,0,0,0.7),inset_0_1px_0_0_rgba(255,255,255,0.18)]'
                      : 'bg-white/94 border-slate-200/80 text-slate-800 shadow-[0_24px_50px_-10px_rgba(15,23,42,0.14),inset_0_1px_0_0_rgba(255,255,255,0.9)]'
                  }`}
                >
                  {/* AirPlay Anchor Caret Pointer pointing to the Chevron button */}
                  <div
                    className={`absolute -top-1.5 left-7 w-3.5 h-3.5 rotate-45 border-t border-l pointer-events-none z-10 ${
                      isDarkMode
                        ? 'bg-[#121727] border-white/[0.14]'
                        : 'bg-white border-slate-200/80'
                    }`}
                  />

                  {/* List of Controls */}
                  <motion.div
                    variants={{
                      initial: {},
                      animate: {
                        transition: {
                          staggerChildren: 0.025,
                          delayChildren: 0.02
                        }
                      }
                    }}
                    initial="initial"
                    animate="animate"
                    className="space-y-0.5"
                  >
                    {/* 1. Toggle Dark Mode with iOS Switch */}
                    <motion.div
                      variants={{
                        initial: { opacity: 0, y: -6, scale: 0.98 },
                        animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 450, damping: 28 } }
                      }}
                      whileHover={{ x: 2, scale: 1.012, transition: { duration: 0.12 } }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <button
                        onClick={() => {
                          toggleThemeMode();
                        }}
                        className={`w-full px-3 py-2 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'hover:bg-white/[0.06] text-slate-200'
                            : 'hover:bg-black/[0.04] text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-xl flex items-center justify-center border ${
                            isDarkMode
                              ? 'bg-amber-500/15 border-amber-500/25 text-amber-400'
                              : 'bg-amber-500/10 border-amber-500/20 text-amber-600'
                          }`}>
                            {isDarkMode ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
                          </div>
                          <span>{t.header.toggleDarkMode}</span>
                        </div>

                        {/* iOS Animated Toggle Switch */}
                        <div
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-200 ease-out flex items-center ${
                            isDarkMode ? 'bg-[#38bdf8]' : 'bg-slate-300'
                          }`}
                        >
                          <motion.div
                            layout
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className={`w-4 h-4 rounded-full bg-white shadow-sm transform ${
                              isDarkMode ? 'translate-x-4' : 'translate-x-0'
                            }`}
                          />
                        </div>
                      </button>
                    </motion.div>

                    {/* 2. Interface Language Switcher */}
                    <motion.div
                      variants={{
                        initial: { opacity: 0, y: -6, scale: 0.98 },
                        animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 450, damping: 28 } }
                      }}
                      whileHover={{ x: 2, scale: 1.012, transition: { duration: 0.12 } }}
                      whileTap={{ scale: 0.97 }}
                      className="relative"
                    >
                      <button
                        onClick={() => {
                          setIsInterfaceLangSubmenuOpen(!isInterfaceLangSubmenuOpen);
                          setIsLangSubmenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'hover:bg-white/[0.06] text-slate-200'
                            : 'hover:bg-black/[0.04] text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-[#F06543]/15 border border-[#F06543]/25 text-[#F06543]">
                            <Globe className="w-3.5 h-3.5" />
                          </div>
                          <span>Interface Language</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-[#F06543]/10 text-[#F06543]">
                            <FlagIcon country={interfaceLanguage as 'ja' | 'ko' | 'en'} className="w-3.5 h-2.5 rounded-2xs" />
                            <span>{getLanguageName(interfaceLanguage)}</span>
                          </span>
                          <motion.div
                            animate={{ rotate: isInterfaceLangSubmenuOpen ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          </motion.div>
                        </div>
                      </button>

                      {/* Interface Language Submenu */}
                      <AnimatePresence>
                        {isInterfaceLangSubmenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                            className={`mx-1 my-1 rounded-2xl p-1 border space-y-1 overflow-hidden ${
                              isDarkMode
                                ? 'bg-[#182033] border-white/10'
                                : 'bg-[#faf6f0] border-[#e8dfd3]'
                            }`}
                          >
                            <button
                              onClick={() => {
                                setInterfaceLanguage('en');
                                setIsInterfaceLangSubmenuOpen(false);
                                setIsProfileMenuOpen(false);
                              }}
                              className={`w-full px-3 py-1.5 rounded-xl text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
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
                              className={`w-full px-3 py-1.5 rounded-xl text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
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
                              className={`w-full px-3 py-1.5 rounded-xl text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* 3. Study Track Switcher */}
                    <motion.div
                      variants={{
                        initial: { opacity: 0, y: -6, scale: 0.98 },
                        animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 450, damping: 28 } }
                      }}
                      whileHover={{ x: 2, scale: 1.012, transition: { duration: 0.12 } }}
                      whileTap={{ scale: 0.97 }}
                      className="relative"
                    >
                      <button
                        onClick={() => {
                          setIsLangSubmenuOpen(!isLangSubmenuOpen);
                          setIsInterfaceLangSubmenuOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'hover:bg-white/[0.06] text-slate-200'
                            : 'hover:bg-black/[0.04] text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
                            <GraduationCap className="w-3.5 h-3.5" />
                          </div>
                          <span>Study Track</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                            <FlagIcon country={profile.selectedLanguage as 'ja' | 'ko' | 'en'} className="w-3.5 h-2.5 rounded-2xs" />
                            <span>{getLanguageName(profile.selectedLanguage as LanguageTrack)}</span>
                          </span>
                          <motion.div
                            animate={{ rotate: isLangSubmenuOpen ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                          >
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          </motion.div>
                        </div>
                      </button>

                      {/* Language Track Submenu */}
                      <AnimatePresence>
                        {isLangSubmenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
                            className={`mx-1 my-1 rounded-2xl p-1 border space-y-1 overflow-hidden ${
                              isDarkMode
                                ? 'bg-[#182033] border-white/10'
                                : 'bg-[#faf6f0] border-[#e8dfd3]'
                            }`}
                          >
                            <button
                              onClick={() => {
                                onSelectLanguage('en');
                                setIsLangSubmenuOpen(false);
                                setIsProfileMenuOpen(false);
                              }}
                              className={`w-full px-3 py-1.5 rounded-xl text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
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
                              className={`w-full px-3 py-1.5 rounded-xl text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
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
                              className={`w-full px-3 py-1.5 rounded-xl text-left text-[11px] font-bold flex items-center justify-between cursor-pointer transition-all ${
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
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    {/* 4. Help */}
                    <motion.div
                      variants={{
                        initial: { opacity: 0, y: -6, scale: 0.98 },
                        animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 450, damping: 28 } }
                      }}
                      whileHover={{ x: 2, scale: 1.012, transition: { duration: 0.12 } }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          setIsHelpModalOpen(true);
                        }}
                        className={`w-full px-3 py-2 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'hover:bg-white/[0.06] text-slate-200'
                            : 'hover:bg-black/[0.04] text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-sky-500/15 border border-sky-500/25 text-sky-400">
                            <HelpCircle className="w-3.5 h-3.5" />
                          </div>
                          <span>{t.header.help}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    </motion.div>

                    {/* 5. Print this page */}
                    <motion.div
                      variants={{
                        initial: { opacity: 0, y: -6, scale: 0.98 },
                        animate: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 450, damping: 28 } }
                      }}
                      whileHover={{ x: 2, scale: 1.012, transition: { duration: 0.12 } }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <button
                        onClick={handlePrint}
                        className={`w-full px-3 py-2 rounded-2xl text-left text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                          isDarkMode
                            ? 'hover:bg-white/[0.06] text-slate-200'
                            : 'hover:bg-black/[0.04] text-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-violet-500/15 border border-violet-500/25 text-violet-400">
                            <Printer className="w-3.5 h-3.5" />
                          </div>
                          <span>{t.header.printPage}</span>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </button>
                    </motion.div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
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
