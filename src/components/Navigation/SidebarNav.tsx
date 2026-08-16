import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AppView } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { LogoutModal } from './LogoutModal';
import { GoogleAuthModal } from '../Auth/GoogleAuthModal';
import { Badge } from '../ui/badge';
import catalougeLogo from '../../assets/catalouge_logo.png';

interface SidebarNavProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  reviewItemsDueCount: number;
}

// 3D Golden-Orange & Cream Cat Paw Vector Component (Matching User Reference Image)
const Cat3DPawIcon: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`drop-shadow-[0_3px_8px_rgba(184,73,14,0.45)] ${className}`}
  >
    {/* 3D Base Shadow Layer */}
    <path
      d="M50 96C74 96 89 82 85 64C81 46 66 43 50 43C34 43 19 46 15 64C11 82 26 96 50 96Z"
      fill="#A8430B"
    />
    {/* Main Golden-Orange Paw Base Body */}
    <path
      d="M50 90C72 90 86 78 82 60C78 44 64 40 50 40C36 40 22 44 18 60C14 78 28 90 50 90Z"
      fill="#F97316"
    />
    {/* Highlighted Top Edge Layer */}
    <path
      d="M50 86C69 86 82 75 79 58C76 43 63 39 50 39C37 39 24 43 21 58C18 75 31 86 50 86Z"
      fill="#FB923C"
    />

    {/* Main Palm Center Pad (Cream Yellow) */}
    <path
      d="M50 81C62 81 71 73 68 61C65 51 57 47 50 47C43 47 35 51 32 61C29 73 38 81 50 81Z"
      fill="#FFFBEB"
    />

    {/* Toe Bean 1 (Leftmost) */}
    <ellipse cx="27" cy="30" rx="9" ry="12" transform="rotate(-22 27 30)" fill="#A8430B" />
    <ellipse cx="27" cy="28" rx="8.5" ry="11" transform="rotate(-22 27 28)" fill="#F97316" />
    <ellipse cx="27" cy="27" rx="6.5" ry="8.5" transform="rotate(-22 27 27)" fill="#FFFBEB" />

    {/* Toe Bean 2 (Mid Left) */}
    <ellipse cx="42" cy="20" rx="9" ry="12" transform="rotate(-6 42 20)" fill="#A8430B" />
    <ellipse cx="42" cy="18" rx="8.5" ry="11" transform="rotate(-6 42 18)" fill="#F97316" />
    <ellipse cx="42" cy="17" rx="6.5" ry="8.5" transform="rotate(-6 42 17)" fill="#FFFBEB" />

    {/* Toe Bean 3 (Mid Right) */}
    <ellipse cx="58" cy="20" rx="9" ry="12" transform="rotate(6 58 20)" fill="#A8430B" />
    <ellipse cx="58" cy="18" rx="8.5" ry="11" transform="rotate(6 58 18)" fill="#F97316" />
    <ellipse cx="58" cy="17" rx="6.5" ry="8.5" transform="rotate(6 58 17)" fill="#FFFBEB" />

    {/* Toe Bean 4 (Rightmost) */}
    <ellipse cx="73" cy="30" rx="9" ry="12" transform="rotate(22 73 30)" fill="#A8430B" />
    <ellipse cx="73" cy="28" rx="8.5" ry="11" transform="rotate(22 73 28)" fill="#F97316" />
    <ellipse cx="73" cy="27" rx="6.5" ry="8.5" transform="rotate(22 73 27)" fill="#FFFBEB" />
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

  useEffect(() => {
    const handleToggle = () => setIsMobileDrawerOpen(prev => !prev);
    window.addEventListener('catalouge:toggle-mobile-drawer', handleToggle);
    return () => window.removeEventListener('catalouge:toggle-mobile-drawer', handleToggle);
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
    { id: 'gamify', label: 'Leaderboard & Stats', icon: 'leaderboard' },
    { id: 'review', label: 'Review Deck', icon: 'rebase_edit' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <>
      {/* Desktop Left Sidebar Navigation (Hidden on mobile <768px, visible on md+) */}
      <aside
        className={`hidden md:flex h-screen w-64 fixed left-0 top-0 border-r flex-col py-4 pl-3 pr-5 z-50 transition-colors duration-150 ${
          isDarkMode
            ? 'bg-[#0b0f17] border-[#1e293b] text-white'
            : 'bg-[#FFFDF9] border-[#EDE5DA] text-[#2B2725] shadow-2xs'
        }`}
      >
        {/* Brand Header & Cat Mascot Logo (Clicking logo reloads/refreshes the dashboard while staying logged in) */}
        <div
          onClick={handleBrandClick}
          className="mb-5 w-full flex flex-col items-center justify-center cursor-pointer group select-none py-1"
          title="Refresh Dashboard"
        >
          <motion.div
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="w-20 h-20 flex items-center justify-center shrink-0"
          >
            <img
              src={catalougeLogo}
              alt="CATALOUGE Logo"
              className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(240,101,67,0.25)]"
            />
          </motion.div>
          <h1 className={`mt-2.5 font-display font-extrabold text-base tracking-wider leading-none text-center group-hover:text-[#F06543] transition-colors ${
            isDarkMode ? 'text-white' : 'text-[#2B2725]'
          }`}>
            CATALOUGE
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2 overflow-y-auto no-scrollbar pt-4 pb-3 pl-1 pr-3">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative overflow-visible w-full flex items-center justify-between gap-2.5 px-3.5 py-2 rounded-xl transition-all duration-200 text-xs font-semibold cursor-pointer ${
                  isActive
                    ? 'text-white bg-[#F06543] border border-[#F06543] shadow-[0_4px_14px_rgba(240,101,67,0.35)] font-bold scale-[1.02]'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-[#111827] hover:text-white'
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
                      className="absolute -top-1.5 right-1 z-30 pointer-events-none"
                    >
                      <Cat3DPawIcon size={24} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-lg ${isActive ? 'text-white' : 'text-slate-400'}`}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className={isActive ? 'text-white font-bold' : ''}>{item.label}</span>
                </div>

                {item.id === 'review' && reviewItemsDueCount > 0 && (
                  <span className={`font-bold text-[9px] px-1.5 py-0.5 rounded-full shadow-xs ${
                    isActive ? 'bg-white text-[#F06543]' : 'bg-[#F06543] text-white'
                  }`}>
                    {reviewItemsDueCount}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar AI Companion Hub Card */}
        <div className="mb-2 px-1">
          <motion.button
            onClick={() => onSelectView('kleo')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative overflow-visible w-full p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-200 shadow-md cursor-pointer ${
              activeView === 'kleo'
                ? 'bg-gradient-to-r from-[#f97316] to-[#ff7849] text-white border-[#f97316] shadow-[0_0_22px_rgba(249,115,22,0.5)] scale-[1.02]'
                : isDarkMode
                ? 'bg-[#111827] border-[#1e293b] text-slate-300 hover:border-[#f97316]/50'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#f97316]/50'
            }`}
          >
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              activeView === 'kleo' ? 'bg-white/20 text-white' : 'bg-[#f97316] text-white shadow-xs'
            }`}>
              <span className="material-symbols-outlined text-base">auto_awesome</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold leading-tight ${
                activeView === 'kleo' ? 'text-white' : 'text-[#f97316]'
              }`}>
                Kleo Companion
              </span>
              <span className={`text-[10px] ${
                activeView === 'kleo' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
              }`}>
                Wardrobe & Bond Level
              </span>
            </div>
          </motion.button>
        </div>

        {/* Bottom User Profile Section */}
        <div className={`pt-3 border-t space-y-2 ${isDarkMode ? 'border-[#1e293b]' : 'border-slate-200'}`}>
          {isAuthenticated && googleUser ? (
            <>
              {/* Compact Profile Card */}
              <div className={`p-2.5 rounded-xl border flex items-center gap-2.5 ${
                isDarkMode ? 'bg-[#111827] border-[#1e293b]' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className="relative w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden shrink-0">
                  <img
                    src={googleUser.picture}
                    alt={googleUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐾</text></svg>';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-semibold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {googleUser.name}
                  </span>
                  <span className="text-[10px] text-[#f97316] font-semibold">Google OIDC Active</span>
                </div>
              </div>

              {/* Log Out Button */}
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className={`w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border text-rose-600 dark:text-rose-400 font-semibold text-xs transition-colors cursor-pointer ${
                  isDarkMode
                    ? 'bg-[#111827] border-slate-800 hover:bg-rose-950/20'
                    : 'bg-white border-slate-200 hover:bg-rose-50'
                }`}
              >
                <span className="material-symbols-outlined text-sm">logout</span>
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg btn-primary-saas text-xs font-semibold cursor-pointer"
            >
              <span>Sign in with Google</span>
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
                    <img src={catalougeLogo} alt="CATALOUGE Logo" className="w-full h-full object-contain" />
                  </div>
                  <span className="font-bold text-sm tracking-wider">CATALOUGE</span>
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
                  <span className="material-symbols-outlined text-base">auto_awesome</span>
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
