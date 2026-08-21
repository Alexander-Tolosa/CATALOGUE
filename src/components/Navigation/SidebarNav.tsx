import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AppView } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { LogoutModal } from './LogoutModal';
import { GoogleAuthModal } from '../Auth/GoogleAuthModal';
import { Badge } from '../ui/badge';
import catalogueLogo from '../../assets/catalogue_logo.png';
import kleoChatbotLogo from '../../assets/kleo_chatbot_logo.png';

interface SidebarNavProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  reviewItemsDueCount: number;
}

// Authentic 3D Fluffy Cat Paw Vector Component with Jelly Beans
const Cat3DPawIcon: React.FC<{ size?: number; className?: string }> = ({ size = 26, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_2px_8px_rgba(240,101,67,0.4)] ${className}`}
  >
    <defs>
      <linearGradient id="pawFurGrad" x1="50" y1="10" x2="50" y2="90" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="70%" stopColor="#FFF5F0" />
        <stop offset="100%" stopColor="#FDDEC9" />
      </linearGradient>

      <linearGradient id="pawPadGrad" x1="50" y1="20" x2="50" y2="85" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFAA80" />
        <stop offset="40%" stopColor="#FF6B4A" />
        <stop offset="100%" stopColor="#E04824" />
      </linearGradient>
    </defs>

    {/* 3D Base Shadow Edge */}
    <path
      d="M 24 38
         C 16 34, 16 20, 26 18
         C 33 17, 35 24, 37 26
         C 39 18, 44 10, 52 10
         C 60 10, 65 18, 67 25
         C 69 18, 74 12, 82 15
         C 91 19, 89 33, 82 40
         C 89 50, 88 72, 78 82
         C 68 91, 35 91, 25 82
         C 15 72, 15 50, 24 38 Z"
      fill="#E5BCA8"
    />

    {/* Main Fluffy White Chubby Paw Body */}
    <path
      d="M 24 36
         C 16 32, 16 18, 26 16
         C 33 15, 35 22, 37 24
         C 39 16, 44 8, 52 8
         C 60 8, 65 16, 67 23
         C 69 16, 74 10, 82 13
         C 91 17, 89 31, 82 38
         C 89 48, 88 70, 78 80
         C 68 89, 35 89, 25 80
         C 15 70, 15 48, 24 36 Z"
      fill="url(#pawFurGrad)"
      stroke="#FFFFFF"
      strokeWidth="1.5"
    />

    {/* Main Tri-lobed Cat Palm Pad */}
    <path
      d="M 52 42
         C 38 42, 28 50, 28 62
         C 28 72, 36 78, 43 78
         C 48 78, 50 74, 52 74
         C 54 74, 56 78, 61 78
         C 68 78, 76 72, 76 62
         C 76 50, 66 42, 52 42 Z"
      fill="url(#pawPadGrad)"
    />

    {/* Palm Pad Glossy Shine */}
    <path
      d="M 46 46
         C 39 46, 33 50, 33 56
         C 33 59, 35 60, 37 59
         C 39 55, 43 53, 48 53
         C 50 53, 51 51, 49 49
         C 48 47, 47 46, 46 46 Z"
      fill="#FFFFFF"
      opacity="0.65"
    />
    <circle cx="63" cy="68" r="2.2" fill="#FFFFFF" opacity="0.45" />

    {/* 4 Chubby Toe Beans */}
    <g transform="rotate(-28 26 26)">
      <ellipse cx="26" cy="26" rx="6.5" ry="8.5" fill="url(#pawPadGrad)" />
      <ellipse cx="24.5" cy="23" rx="2" ry="3.2" fill="#FFFFFF" opacity="0.75" />
    </g>

    <g transform="rotate(-9 43 17)">
      <ellipse cx="43" cy="17" rx="7" ry="9.5" fill="url(#pawPadGrad)" />
      <ellipse cx="41.5" cy="13.5" rx="2.3" ry="3.5" fill="#FFFFFF" opacity="0.75" />
    </g>

    <g transform="rotate(9 61 17)">
      <ellipse cx="61" cy="17" rx="7" ry="9.5" fill="url(#pawPadGrad)" />
      <ellipse cx="59.5" cy="13.5" rx="2.3" ry="3.5" fill="#FFFFFF" opacity="0.75" />
    </g>

    <g transform="rotate(28 78 26)">
      <ellipse cx="78" cy="26" rx="6.5" ry="8.5" fill="url(#pawPadGrad)" />
      <ellipse cx="76.5" cy="23" rx="2" ry="3.2" fill="#FFFFFF" opacity="0.75" />
    </g>
  </svg>
);

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeView,
  onSelectView,
  reviewItemsDueCount
}) => {
  const { isDarkMode } = useAppStore();
  const { googleUser, isAuthenticated, logout } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDesktopHovered, setIsDesktopHovered] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsMobileDrawerOpen(prev => !prev);
    window.addEventListener('catalogue:toggle-mobile-drawer', handleToggle);
    return () => window.removeEventListener('catalogue:toggle-mobile-drawer', handleToggle);
  }, []);

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  const handleBrandClick = () => {
    onSelectView('dashboard');
    window.location.reload();
  };

  const navItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: 'grid_view' },
    { id: 'learn', label: 'Skill Tree', icon: 'school' },
    { id: 'letters', label: 'Writing & Letters', icon: 'translate' },
    { id: 'translator', label: 'Translator', icon: 'language' },
    { id: 'scanner', label: 'Scan & Translate', icon: 'document_scanner' },
    { id: 'gamify', label: 'Leaderboard & Stats', icon: 'leaderboard' },
    { id: 'review', label: 'Review Deck', icon: 'rebase_edit' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <>
      {/* Desktop Left Sidebar Navigation (Hidden on mobile <768px, visible on md+) */}
      <aside
        onMouseEnter={() => setIsDesktopHovered(true)}
        onMouseLeave={() => setIsDesktopHovered(false)}
        className={`group/sidebar hidden md:flex h-screen fixed left-0 top-0 border-r flex-col py-3 z-50 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isDesktopHovered
            ? 'w-64 px-3.5 shadow-[0_12px_45px_rgba(0,0,0,0.3)]'
            : 'w-20 px-2.5 shadow-xs'
        } ${
          isDarkMode
            ? 'bg-[#0b0f17] border-[#1e293b] text-white'
            : 'bg-[#FFFDF9] border-[#EDE5DA] text-[#2B2725]'
        }`}
      >
        {/* Brand Header & Cat Mascot Logo (Clicking logo reloads/refreshes the dashboard while staying logged in) */}
        <div
          onClick={handleBrandClick}
          className="mb-2 w-full flex flex-col items-center justify-center cursor-pointer select-none py-0.5 group shrink-0"
          title="Refresh Dashboard"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className={`flex items-center justify-center shrink-0 transition-all duration-300 ${
              isDesktopHovered ? 'w-12 h-12' : 'w-10 h-10'
            }`}
          >
            <img
              src={catalogueLogo}
              alt="CATALOGUE Logo"
              className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(240,101,67,0.25)]"
            />
          </motion.div>

          {/* Brand Title (Gracefully slides in on hover) */}
          <AnimatePresence>
            {isDesktopHovered && (
              <motion.div
                initial={{ opacity: 0, x: -16, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: -12, height: 0 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden flex flex-col items-center mt-1"
              >
                <h1
                  className={`font-display font-extrabold text-sm tracking-wider leading-none text-center group-hover:text-[#F06543] transition-colors whitespace-nowrap ${
                    isDarkMode ? 'text-white' : 'text-[#2B2725]'
                  }`}
                >
                  CATALOGUE
                </h1>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pt-1 pb-1 w-full">
          {navItems.map((item, idx) => {
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                title={!isDesktopHovered ? item.label : undefined}
                className={`relative overflow-visible w-full flex items-center transition-all duration-200 text-xs font-semibold cursor-pointer ${
                  isDesktopHovered
                    ? 'justify-between gap-2.5 px-3 py-2 rounded-xl'
                    : 'justify-center h-10 px-0 rounded-xl'
                } ${
                  isActive
                    ? 'text-white bg-[#F06543] border border-[#F06543] shadow-[0_4px_14px_rgba(240,101,67,0.35)] font-bold'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-[#111827] hover:text-white border border-transparent'
                    : 'text-[#7A736E] hover:bg-[#FAF6F0] hover:text-[#2B2725]'
                }`}
              >
                {/* 3D Golden-Orange Cat Paw Icon perched on Top Right Corner */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, y: [0, -2, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        y: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' },
                        scale: { type: 'spring', stiffness: 400, damping: 25 }
                      }}
                      className={`absolute z-30 pointer-events-none ${
                        isDesktopHovered ? '-top-1.5 right-1' : '-top-1.5 -right-1'
                      }`}
                    >
                      <Cat3DPawIcon size={isDesktopHovered ? 24 : 20} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className={`flex items-center ${isDesktopHovered ? 'gap-2.5 min-w-0' : 'justify-center'}`}>
                  <span
                    className={`material-symbols-outlined text-xl shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>

                  {/* Label with smooth slide-in */}
                  <AnimatePresence>
                    {isDesktopHovered && (
                      <motion.span
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{
                          duration: 0.22,
                          delay: idx * 0.015,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                        className={`truncate ${isActive ? 'text-white font-bold' : ''}`}
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                {/* Badge count */}
                {item.id === 'review' && reviewItemsDueCount > 0 && (
                  <AnimatePresence>
                    {isDesktopHovered ? (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.6, x: -6 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.6 }}
                        className={`font-bold text-[9px] px-1.5 py-0.5 rounded-full shadow-xs shrink-0 ${
                          isActive ? 'bg-white text-[#F06543]' : 'bg-[#F06543] text-white'
                        }`}
                      >
                        {reviewItemsDueCount}
                      </motion.span>
                    ) : (
                      <span className="absolute -top-1 -right-1 bg-[#F06543] text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full shadow-xs">
                        {reviewItemsDueCount}
                      </span>
                    )}
                  </AnimatePresence>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar AI Companion Hub Card / Compact Icon */}
        <div className="my-2 w-full shrink-0">
          <motion.button
            onClick={() => onSelectView('kleo')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            title={!isDesktopHovered ? 'Kleo Companion Hub' : undefined}
            className={`relative overflow-visible w-full transition-all duration-200 shadow-md cursor-pointer ${
              isDesktopHovered
                ? 'p-2.5 rounded-xl border text-left flex items-center gap-2.5'
                : 'h-11 rounded-xl border flex items-center justify-center p-0'
            } ${
              activeView === 'kleo'
                ? 'bg-gradient-to-r from-[#f97316] to-[#ff7849] text-white border-[#f97316] shadow-[0_0_22px_rgba(249,115,22,0.5)]'
                : isDarkMode
                ? 'bg-[#111827] border-[#1e293b] text-slate-300 hover:border-[#f97316]/50'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#f97316]/50'
            }`}
          >
            <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-white/30 shadow-xs">
              <img src={kleoChatbotLogo} alt="Kleo Companion" className="w-full h-full object-cover" />
            </div>

            {/* Companion info with slide-in animation */}
            <AnimatePresence>
              {isDesktopHovered && (
                <motion.div
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col min-w-0"
                >
                  <span
                    className={`text-xs font-bold leading-tight truncate ${
                      activeView === 'kleo' ? 'text-white' : 'text-[#f97316]'
                    }`}
                  >
                    Kleo Companion
                  </span>
                  <span
                    className={`text-[10px] truncate ${
                      activeView === 'kleo' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Wardrobe & Bond Level
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Bottom User Profile Section */}
        <div className={`pt-3 border-t shrink-0 w-full ${isDarkMode ? 'border-[#1e293b]' : 'border-slate-200'}`}>
          {isAuthenticated && googleUser ? (
            <AnimatePresence mode="wait">
              {isDesktopHovered ? (
                <motion.div
                  key="expanded-profile-card"
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-2"
                >
                  {/* Expanded Profile Card */}
                  <div
                    className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                      isDarkMode ? 'bg-[#111827] border-[#1e293b]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="relative w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0">
                      <img
                        src={googleUser.picture}
                        alt={googleUser.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐾</text></svg>';
                        }}
                      />
                      <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className={`text-xs font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {googleUser.name}
                      </span>
                      <span className="text-[10px] text-[#f97316] font-semibold truncate">Google OIDC Active</span>
                    </div>
                  </div>

                  {/* Log Out Button */}
                  <motion.button
                    onClick={() => setIsLogoutModalOpen(true)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border text-rose-600 dark:text-rose-400 font-semibold text-xs transition-colors cursor-pointer ${
                      isDarkMode
                        ? 'bg-[#111827] border-slate-800 hover:bg-rose-950/20'
                        : 'bg-white border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    <span>Log Out</span>
                  </motion.button>
                </motion.div>
              ) : (
                /* Collapsed Compact Profile Avatar & Quick Action */
                <motion.div
                  key="collapsed-profile-avatar"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.18 }}
                  className="flex flex-col items-center justify-center gap-1"
                >
                  <div
                    onClick={() => onSelectView('profile')}
                    title={`${googleUser.name} (View Profile)`}
                    className="relative w-10 h-10 rounded-full bg-slate-200 border-2 border-orange-500/30 overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  >
                    <img
                      src={googleUser.picture}
                      alt={googleUser.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐾</text></svg>';
                      }}
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : (
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              title={!isDesktopHovered ? 'Sign in with Google' : undefined}
              className={`w-full flex items-center justify-center rounded-lg btn-primary-saas text-xs font-semibold cursor-pointer ${
                isDesktopHovered ? 'gap-2 py-2 px-3' : 'h-10 px-0'
              }`}
            >
              <span className="material-symbols-outlined text-base">login</span>
              <AnimatePresence>
                {isDesktopHovered && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                  >
                    Sign in with Google
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Overlay (<768px) */}
      <AnimatePresence>
        {isMobileDrawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileDrawerOpen(false)}
              className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-[60]"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className={`md:hidden fixed top-0 left-0 bottom-0 w-72 z-[70] flex flex-col py-4 px-4 shadow-2xl ${
                isDarkMode ? 'bg-[#0b0f17] text-white border-r border-[#1e293b]' : 'bg-[#FFFDF9] text-[#2B2725] border-r border-[#EDE5DA]'
              }`}
            >
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-700/40">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 p-1 flex items-center justify-center">
                    <img src={catalogueLogo} alt="CATALOGUE Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-sm tracking-wider">CATALOGUE</span>
                </div>
                <button
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                  const isActive = activeView === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onSelectView(item.id);
                        setIsMobileDrawerOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#F06543] text-white shadow-md'
                          : isDarkMode ? 'text-slate-300 hover:bg-slate-900' : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-lg">{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                    </button>
                  );
                })}
              </nav>

              <div className="pt-3 border-t border-slate-700/40 space-y-2">
                <button
                  onClick={() => {
                    onSelectView('kleo');
                    setIsMobileDrawerOpen(false);
                  }}
                  className="w-full p-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs flex items-center gap-2 shadow-md"
                >
                  <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white/30">
                    <img src={kleoChatbotLogo} alt="Kleo" className="w-full h-full object-cover" />
                  </div>
                  <span>Kleo Companion Hub</span>
                </button>

                {isAuthenticated && googleUser && (
                  <button
                    onClick={() => {
                      setIsLogoutModalOpen(true);
                      setIsMobileDrawerOpen(false);
                    }}
                    className="w-full py-2 text-center text-xs font-bold text-rose-500 bg-rose-500/10 rounded-xl"
                  >
                    Log Out
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Bar (< 768px) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t p-2 z-50 flex items-center justify-around backdrop-blur-md ${
        isDarkMode ? 'bg-[#0b0f17]/95 border-[#1e293b]' : 'bg-white/95 border-slate-200'
      }`}>
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex flex-col items-center p-1 rounded-md text-[10px] font-medium relative ${
                isActive ? 'text-[#f97316]' : isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {isActive && (
                <span className="material-symbols-outlined text-xs text-[#f97316] absolute -top-2 right-0 animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                  pets
                </span>
              )}
              <span className="material-symbols-outlined text-base">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Log Out Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />

      {/* Google Identity Services Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />
    </>
  );
};
