import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

export const SidebarNav: React.FC<SidebarNavProps> = ({
  activeView,
  onSelectView,
  reviewItemsDueCount
}) => {
  const { isDarkMode } = useAppStore();
  const { googleUser, isAuthenticated, logout } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

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
      {/* Desktop Left Sidebar Navigation */}
      <aside
        className={`h-screen w-64 fixed left-0 top-0 border-r flex flex-col py-4 px-3 z-50 transition-colors duration-150 ${
          isDarkMode
            ? 'bg-[#0b0f17] border-[#1e293b] text-white'
            : 'bg-white border-slate-200 text-slate-900 shadow-2xs'
        }`}
      >
        {/* Brand Header & Cat Mascot Logo (Clicking logo reloads/refreshes the dashboard while staying logged in) */}
        <div
          onClick={handleBrandClick}
          className="mb-5 px-2 flex items-center gap-2.5 cursor-pointer group select-none"
          title="Refresh Dashboard"
        >
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            className="w-9 h-9 rounded-xl bg-orange-50 dark:bg-slate-800 border border-[#f97316]/30 flex items-center justify-center p-1 shadow-xs shrink-0"
          >
            <img src={catalougeLogo} alt="CATalouge Logo" className="w-full h-full object-contain" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className={`font-display font-bold text-base tracking-tight leading-none group-hover:text-[#f97316] transition-colors ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}>
              CATalouge
            </h1>
            <span className="text-[10px] font-semibold text-[#f97316] uppercase tracking-wider mt-0.5">
              Mastering Language
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-2.5 overflow-y-visible pt-1 px-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative overflow-visible w-full flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold cursor-pointer ${
                  isActive
                    ? 'text-[#f97316] bg-[#3a1c12] dark:bg-[#2e150a] border border-[#f97316] shadow-[0_0_20px_rgba(249,115,22,0.45)] font-bold scale-[1.02]'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-[#111827] hover:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {/* Standalone Bouncing Paw Symbol perched on Top Right Corner */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, y: [0, -3, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        y: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' },
                        scale: { type: 'spring', stiffness: 400, damping: 25 }
                      }}
                      className="absolute -top-2.5 -right-1 z-30 pointer-events-none text-[#f97316] drop-shadow-[0_2px_8px_rgba(249,115,22,0.6)]"
                    >
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        pets
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-lg ${isActive ? 'text-[#f97316]' : 'text-slate-400'}`}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className={isActive ? 'text-[#f97316] font-bold' : ''}>{item.label}</span>
                </div>

                {item.id === 'review' && reviewItemsDueCount > 0 && (
                  <span className="bg-[#f97316] text-white font-bold text-[9px] px-1.5 py-0.5 rounded-full shadow-xs">
                    {reviewItemsDueCount}
                  </span>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Sidebar AI Tutor & Coach Feature Card */}
        <div className="my-3 px-1">
          <motion.button
            onClick={() => onSelectView('kleo')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`relative overflow-visible w-full p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all duration-200 shadow-md cursor-pointer ${
              activeView === 'kleo'
                ? 'bg-gradient-to-r from-[#f97316] to-[#ff7849] text-white border-[#f97316] shadow-[0_0_22px_rgba(249,115,22,0.5)] scale-[1.02]'
                : 'bg-[#fff7ed] dark:bg-[#f97316]/10 border-[#f97316]/30 hover:border-[#f97316]'
            }`}
          >
            <AnimatePresence>
              {activeView === 'kleo' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, y: [0, -3, 0] }}
                  exit={{ scale: 0 }}
                  transition={{ y: { repeat: Infinity, duration: 1.4, ease: 'easeInOut' } }}
                  className="absolute -top-2.5 -right-1 z-30 pointer-events-none text-[#f97316] dark:text-white drop-shadow-[0_2px_8px_rgba(249,115,22,0.6)]"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    pets
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
              activeView === 'kleo' ? 'bg-white/20 text-white' : 'bg-[#f97316] text-white shadow-xs'
            }`}>
              <span className="material-symbols-outlined text-base">auto_awesome</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-bold leading-tight ${
                activeView === 'kleo' ? 'text-white' : 'text-[#f97316]'
              }`}>
                AI Tutor & Coach
              </span>
              <span className={`text-[10px] ${
                activeView === 'kleo' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
              }`}>
                Context-aware Kleo LLM
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
