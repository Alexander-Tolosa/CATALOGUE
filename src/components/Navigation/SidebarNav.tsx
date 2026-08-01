import React, { useState } from 'react';
import { AppView } from '../../types';
import { useAuthStore } from '../../store/useAuthStore';
import { LogoutModal } from './LogoutModal';
import { GoogleAuthModal } from '../Auth/GoogleAuthModal';

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
    { id: 'kleo', label: 'Kleo', icon: 'smart_toy' },
    { id: 'gamify', label: 'Gamify', icon: 'leaderboard' },
    { id: 'review', label: 'Review', icon: 'rebase_edit' },
    { id: 'settings', label: 'Settings', icon: 'settings' }
  ];

  return (
    <>
      {/* Desktop Left Sidebar Navigation */}
      <aside className="h-screen w-64 fixed left-0 top-0 border-r border-[#38bdf8]/15 bg-[#090d16] flex flex-col py-6 px-4 z-50">
        {/* Brand Header */}
        <div className="mb-8 px-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#2dd4bf] flex items-center justify-center text-[#0f172a] shadow-[0_0_15px_rgba(56,189,248,0.3)] font-bold">
            <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              language
            </span>
          </div>
          <div>
            <h1 className="font-display font-black text-2xl text-[#38bdf8] tracking-tight leading-none">CATalouge</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Mastering Language</p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-xs font-bold ${
                  isActive
                    ? 'text-[#38bdf8] border-r-4 border-[#38bdf8] bg-[#38bdf8]/10 shadow-md font-extrabold'
                    : 'text-slate-400 hover:bg-[#161b2b] hover:text-[#38bdf8]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className="material-symbols-outlined text-xl"
                    style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.id === 'review' && reviewItemsDueCount > 0 && (
                  <span className="bg-[#f97316] text-white font-black text-[9px] px-2 py-0.5 rounded-full shadow-sm">
                    {reviewItemsDueCount} DUE
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom User Profile Section */}
        <div className="mt-auto pt-4 border-t border-[#38bdf8]/15 space-y-2">
          {isAuthenticated && googleUser ? (
            <>
              {/* Profile Card */}
              <div className="p-3 rounded-2xl bg-[#161b2b] border border-[#38bdf8]/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#1e293b] border border-[#38bdf8]/40 overflow-hidden shrink-0">
                  <img
                    src={googleUser.picture}
                    alt={googleUser.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐾</text></svg>';
                    }}
                  />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-[#f8fafc] truncate">{googleUser.name}</span>
                  <span className="text-[10px] text-[#38bdf8] font-extrabold tracking-tight">Google OIDC Active</span>
                </div>
              </div>

              {/* Log Out Button */}
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-[#161b2b] border border-[#f97316]/30 hover:border-[#f97316]/70 hover:bg-[#f97316]/10 text-[#f97316] font-bold text-xs transition-all duration-200 shadow-md active:scale-95"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                <span>Log Out</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex items-center justify-center gap-2 py-3 px-3 rounded-2xl btn-teal text-xs transition-all shadow-lg active:scale-95"
            >
              <span>Sign in with Google</span>
            </button>
          )}
        </div>
      </aside>

      {/* Mobile Bottom Bar (< 768px) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-[#090d16]/95 border-t border-[#38bdf8]/15 p-2 z-50 flex items-center justify-around backdrop-blur-xl">
        {navItems.slice(0, 5).map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectView(item.id)}
              className={`flex flex-col items-center p-1.5 rounded-xl text-[10px] font-bold ${
                isActive ? 'text-[#38bdf8]' : 'text-slate-400'
              }`}
            >
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
