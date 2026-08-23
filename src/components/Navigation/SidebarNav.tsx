import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { AppView } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';
import { LogoutModal } from './LogoutModal';
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
  const { isDarkMode, setSidebarExpanded, triggerAppRefresh } = useAppStore();
  const { googleUser, isAuthenticated, logout } = useAuthStore();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setIsHovered(true);
    setSidebarExpanded(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsHovered(false);
      setSidebarExpanded(false);
    }, 140);
  };

  const isExpanded = isHovered;

  useEffect(() => {
    const handleToggle = () => setIsMobileDrawerOpen(prev => !prev);
    window.addEventListener('catalogue:toggle-mobile-drawer', handleToggle);
    return () => {
      window.removeEventListener('catalogue:toggle-mobile-drawer', handleToggle);
      if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
      setSidebarExpanded(false);
    };
  }, [setSidebarExpanded]);

  const handleConfirmLogout = () => {
    logout();
    setIsLogoutModalOpen(false);
  };

  const handleBrandClick = () => {
    onSelectView('dashboard');
    triggerAppRefresh();
  };

  const navItems: { id: AppView; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Overview', icon: 'grid_view' },
    { id: 'learn', label: 'Skill Tree', icon: 'school' },
    { id: 'letters', label: 'Writing & Letters', icon: 'translate' },
    { id: 'translator', label: 'Translator', icon: 'language' },
    { id: 'scanner', label: 'Scan & Translate', icon: 'document_scanner' },
    { id: 'gamify', label: 'Leaderboard & Stats', icon: 'leaderboard' },
    { id: 'review', label: 'Review Deck', icon: 'rebase_edit' }
  ];

  return (
    <>
      {/* Desktop Fluid Expanding Sidebar (Hidden on mobile <768px, visible on md+) */}
      <motion.aside
        initial={false}
        animate={{
          width: isExpanded ? 260 : 76,
          boxShadow: isExpanded
            ? isDarkMode
              ? '0 20px 50px -10px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)'
              : '0 20px 50px -10px rgba(43,39,37,0.16), 0 0 0 1px rgba(0,0,0,0.04)'
            : 'none'
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 28,
          mass: 0.85
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`hidden md:flex h-screen fixed left-0 top-0 border-r flex-col py-3.5 z-50 select-none overflow-hidden backdrop-blur-xl transition-colors duration-300 ${
          isDarkMode
            ? 'bg-[#0b0f17]/95 border-[#1e293b] text-white'
            : 'bg-[#FFFDF9]/95 border-[#EDE5DA] text-[#2B2725]'
        }`}
      >
        {/* Centered Brand Mascot Logo (Clicking logo reloads/refreshes the dashboard) */}
        <div
          onClick={handleBrandClick}
          className="mb-1.5 w-full flex items-center justify-center cursor-pointer select-none py-1 group shrink-0"
          title="Refresh Dashboard"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
            whileTap={{ scale: 0.92 }}
            animate={{
              width: isExpanded ? 60 : 46,
              height: isExpanded ? 60 : 46
            }}
            transition={{ type: 'spring', stiffness: 350, damping: 24 }}
            className="flex items-center justify-center shrink-0 mx-auto"
          >
            <img
              src={catalogueLogo}
              alt="CATALOGUE Logo"
              className="w-full h-full object-contain drop-shadow-[0_4px_18px_rgba(240,101,67,0.3)]"
            />
          </motion.div>
        </div>

        {/* Navigation Items (Clean, vibrant modern buttons without heavy neumorphic inset wells) */}
        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar pt-3 pb-1.5 w-full px-2.5">
          {navItems.map((item, idx) => {
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.97 }}
                title={!isExpanded ? item.label : undefined}
                className={`relative overflow-visible w-full h-10.5 rounded-xl flex items-center transition-all duration-200 text-xs font-semibold cursor-pointer ${
                  isActive
                    ? 'text-white bg-[#F06543] border border-[#F06543] shadow-[0_4px_16px_rgba(240,101,67,0.38)] font-bold'
                    : isDarkMode
                    ? 'text-slate-300 hover:bg-[#151c2e] hover:text-white border border-transparent'
                    : 'text-[#7A736E] hover:bg-[#FAF6F0] hover:text-[#2B2725] border border-transparent'
                }`}
              >
                {/* Active 3D Cat Paw */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0, rotate: -20 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        rotate: 0,
                        y: [0, -3, 0]
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{
                        y: { repeat: Infinity, duration: 1.6, ease: 'easeInOut' },
                        scale: { type: 'spring', stiffness: 450, damping: 22 }
                      }}
                      className={`absolute z-30 pointer-events-none ${
                        isExpanded ? '-top-2 right-1.5' : '-top-2 right-0.5'
                      }`}
                    >
                      <Cat3DPawIcon size={isExpanded ? 24 : 19} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Anchor Slot for Icon (Clean, centered icon) */}
                <div className="w-[50px] flex items-center justify-center shrink-0">
                  <span
                    className={`material-symbols-outlined text-xl ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                </div>

                {/* Label (Staggered spring wave reveal) */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -6 }}
                      transition={{
                        duration: 0.2,
                        delay: idx * 0.015,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className={`truncate pr-2 ${isActive ? 'text-white font-bold' : ''}`}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </nav>

        {/* Kleo Companion Hub */}
        <div className="my-1.5 w-full px-2.5 shrink-0">
          <motion.button
            onClick={() => onSelectView('kleo')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            title={!isExpanded ? 'Kleo Companion Hub' : undefined}
            className={`relative overflow-visible w-full h-11 rounded-xl border flex items-center transition-all duration-200 shadow-md cursor-pointer ${
              activeView === 'kleo'
                ? 'bg-gradient-to-r from-[#f97316] to-[#ff7849] text-white border-[#f97316] shadow-[0_0_20px_rgba(249,115,22,0.45)]'
                : isDarkMode
                ? 'bg-[#111827] border-[#1e293b] text-slate-300 hover:border-[#f97316]/60 hover:bg-[#151d30]'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-[#f97316]/60 hover:bg-white'
            }`}
          >
            <div className="w-[50px] flex items-center justify-center shrink-0">
              <div className="w-7.5 h-7.5 rounded-full overflow-hidden shrink-0 border border-white/30 shadow-xs ring-1 ring-orange-500/20">
                <img src={kleoChatbotLogo} alt="Kleo Companion" className="w-full h-full object-cover" />
              </div>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -6 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="flex flex-col min-w-0 pr-2"
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
                      activeView === 'kleo' ? 'text-white/85' : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    Wardrobe & Bond
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.aside>

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
                    <img src={catalogueLogo} alt="CATALOUGE Logo" className="w-full h-full object-contain" />
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
    </>
  );
};
