import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppView } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { LogoutModal } from './LogoutModal';
import { GoogleAuthModal } from '../Auth/GoogleAuthModal';
import { Badge } from '../ui/badge';

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

  const navItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid_view' },
    { id: 'learn', label: 'Learn', icon: 'school' },
    { id: 'letters', label: 'Letters', icon: 'translate' },
    { id: 'translator', label: 'Translator', icon: 'language' },
    { id: 'gamify', label: 'Gamify', icon: 'leaderboard' },
    { id: 'review', label: 'Review', icon: 'rebase_edit' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <>
      {/* Desktop Left Sidebar Navigation */}
      <aside
        className={`h-screen w-64 fixed left-0 top-0 border-r flex flex-col py-6 px-4 z-50 transition-colors duration-250 ${
          isDarkMode
            ? 'bg-[#0b0f19] border-[#1e293b] text-white'
            : 'bg-white border-slate-200/80 text-slate-900 shadow-xs'
        }`}
      >
        {/* Brand Header & Logo */}
        <div className="mb-6 px-2 flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 5 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6B35] to-[#ff7849] flex items-center justify-center text-white shadow-md font-bold shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              language
            </span>
          </motion.div>
          <div>
            <h1 className={`font-display font-black text-xl tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              CATalouge
            </h1>
            <p className="text-[10px] font-bold text-[#FF6B35] uppercase tracking-widest mt-1">
              Mastering Language
            </p>
          </div>
        </div>

        {/* Navigation Items with Framer Motion Spring Animations */}
        <nav className="flex-1 space-y-2 overflow-y-visible pt-1 px-1">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className={`relative overflow-visible w-full flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl transition-all duration-200 text-xs font-extrabold cursor-pointer ${
                  isActive
                    ? 'text-[#FF6B35] border-l-4 border-[#FF6B35] bg-[#fff7ed] dark:bg-[#FF6B35]/20 shadow-xs'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-[#131b2e] hover:text-white'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {/* Framer Motion Bouncing Standalone Cat Paw Badge */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, y: 5 }}
                      animate={{ scale: 1, opacity: 1, y: [0, -4, 0] }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        y: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
                        scale: { type: 'spring', stiffness: 400, damping: 25 }
                      }}
                      className="absolute -top-2.5 -right-1 z-30 pointer-events-none flex items-center justify-center text-[#FF6B35] drop-shadow-md"
                    >
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        pets
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-3">
                  <span
                    className={`material-symbols-outlined text-xl ${isActive ? 'text-[#FF6B35]' : ''}`}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span className={isActive ? 'text-[#FF6B35] font-black' : ''}>{item.label}</span>
                </div>

                {item.id === 'review' && reviewItemsDueCount > 0 && (
                  <Badge variant="default" className="text-[9px] px-2 py-0.5">
                    {reviewItemsDueCount} DUE
                  </Badge>
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
            className={`relative overflow-visible w-full p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all duration-200 shadow-md group cursor-pointer ${
              activeView === 'kleo'
                ? 'bg-gradient-to-r from-[#FF6B35] to-[#ff7849] text-white border-transparent'
                : 'bg-[#fff7ed] dark:bg-[#FF6B35]/15 border-[#FF6B35]/30 hover:border-[#FF6B35]'
            }`}
          >
            <AnimatePresence>
              {activeView === 'kleo' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, y: [0, -4, 0] }}
                  exit={{ scale: 0 }}
                  transition={{ y: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' } }}
                  className="absolute -top-2.5 -right-1 z-30 pointer-events-none flex items-center justify-center text-white drop-shadow-md"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    pets
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
              activeView === 'kleo'
                ? 'bg-white/20 text-white'
                : 'bg-[#FF6B35] text-white shadow-xs'
            }`}>
              <span className="material-symbols-outlined text-xl">auto_awesome</span>
            </div>
            <div className="flex flex-col min-w-0">
              <span className={`text-xs font-black tracking-tight leading-snug ${
                activeView === 'kleo' ? 'text-white' : 'text-[#FF6B35]'
              }`}>
                AI Tutor & Grammar Coach
              </span>
              <span className={`text-[9px] font-bold ${
                activeView === 'kleo' ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'
              }`}>
                Chat with Kleo AI
              </span>
            </div>
          </motion.button>
        </div>

        {/* Bottom User Profile Section */}
        <div className={`pt-3 border-t space-y-2.5 ${isDarkMode ? 'border-[#1e293b]' : 'border-slate-200'}`}>
          {isAuthenticated && googleUser ? (
            <>
              {/* Compact User Profile Pill */}
              <div className={`p-3 rounded-2xl border flex items-center gap-3 ${
                isDarkMode ? 'bg-[#131b2e] border-[#1e293b]' : 'bg-slate-50 border-slate-200/80'
              }`}>
                <div className="relative w-9 h-9 rounded-full bg-slate-200 border border-[#FF6B35]/40 overflow-hidden shrink-0">
                  <img
                    src={googleUser.picture}
                    alt={googleUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐾</text></svg>';
                    }}
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {googleUser.name}
                  </span>
                  <span className="text-[10px] text-[#FF6B35] font-extrabold tracking-tight">Google OIDC Active</span>
                </div>
              </div>

              {/* Log Out Button */}
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-[#FF6B35] font-bold text-xs transition-all duration-200 shadow-2xs active:scale-95 ${
                  isDarkMode
                    ? 'bg-[#131b2e] border-[#FF6B35]/30 hover:border-[#FF6B35] hover:bg-[#FF6B35]/15'
                    : 'bg-white border-[#FF6B35]/30 hover:border-[#FF6B35] hover:bg-[#fff7ed]'
                }`}
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl btn-vibrant-orange text-xs transition-all shadow-md active:scale-95"
            >
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Bar (< 768px) */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 border-t p-2 z-50 flex items-center justify-around backdrop-blur-xl ${
        isDarkMode ? 'bg-[#0b0f19]/95 border-[#1e293b]' : 'bg-white/95 border-slate-200'
      }`}>
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex flex-col items-center p-1.5 rounded-xl text-[10px] font-bold relative overflow-visible ${
                isActive ? 'text-[#FF6B35]' : isDarkMode ? 'text-slate-300' : 'text-slate-500'
              }`}
            >
              {isActive && (
                <span className="material-symbols-outlined text-sm text-[#FF6B35] absolute -top-2 right-0 animate-bounce" style={{ fontVariationSettings: "'FILL' 1" }}>
                  pets
                </span>
              )}
              <span className="material-symbols-outlined text-lg">{item.icon}</span>
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
