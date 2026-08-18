import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Key,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Globe,
  LogOut,
  Laptop,
  History,
  Eye,
  EyeOff,
  Check
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { useAppStore } from '../../store/useAppStore';

interface ActiveSessionItem {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export const SecuritySignInSection: React.FC = () => {
  const { isDarkMode } = useAppStore();
  const { googleUser, logout } = useAuthStore();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [sessions, setSessions] = useState<ActiveSessionItem[]>([
    {
      id: 'sess-1',
      device: 'Windows PC (Desktop)',
      browser: 'Chrome 122.0 / Windows 11',
      ip: '120.28.174.45',
      location: 'Iloilo City, Philippines',
      lastActive: 'Current Active Session',
      isCurrent: true
    },
    {
      id: 'sess-2',
      device: 'iPhone 15 Pro (Mobile)',
      browser: 'Mobile Safari / iOS 17.4',
      ip: '112.198.88.12',
      location: 'Manila, Philippines',
      lastActive: '3 hours ago',
      isCurrent: false
    }
  ]);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccessMessage('');

    if (newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordSuccessMessage('Password updated successfully! Your account is secured.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccessMessage(''), 4000);
  };

  const handleRevokeSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between transition-colors ${
        isDarkMode ? 'bg-[#101625] border-[#1d273d] text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div>
          <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest block mb-1">
            Account Protection & Privacy
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black flex items-center gap-2.5">
            <Lock className="text-emerald-400" size={28} /> Security & Sign-in
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage your login credentials, password, two-factor authentication, and connected student identity sessions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Change Password */}
        <div className={`p-6 rounded-3xl border space-y-4 ${
          isDarkMode ? 'bg-[#101625] border-[#1d273d]' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          <h3 className="font-display font-black text-sm text-slate-100 flex items-center gap-2">
            <Key size={18} className="text-[#F06543]" /> Change Password
          </h3>
          <p className="text-xs text-slate-400">
            Ensure your account uses a strong, unique password with at least 8 characters.
          </p>

          <form onSubmit={handlePasswordChange} className="space-y-3 pt-2">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-[#F06543]/40 ${
                    isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter at least 8 characters"
                required
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-[#F06543]/40 ${
                  isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type new password"
                required
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-[#F06543]/40 ${
                  isDarkMode ? 'bg-[#161f33] border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {passwordError && (
              <p className="text-xs text-rose-400 font-bold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
                {passwordError}
              </p>
            )}

            {passwordSuccessMessage && (
              <p className="text-xs text-emerald-400 font-bold bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle2 size={15} /> {passwordSuccessMessage}
              </p>
            )}

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#F06543] hover:bg-[#E05432] text-white font-extrabold text-xs shadow-md transition-all cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* 2. Two-Factor Authentication & Connected Identities */}
        <div className="space-y-6">
          {/* 2FA Box */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            isDarkMode ? 'bg-[#101625] border-[#1d273d]' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Smartphone size={20} />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-slate-100">Two-Factor Authentication (2FA)</h4>
                  <p className="text-[11px] text-slate-400">Protects your account with one-time security codes.</p>
                </div>
              </div>

              <button
                onClick={() => setIs2FAEnabled(!is2FAEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                  is2FAEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    is2FAEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-300">2FA Status:</span>
              <span className={`font-black uppercase text-[10px] px-2 py-0.5 rounded-full ${
                is2FAEnabled ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'
              }`}>
                {is2FAEnabled ? 'Enabled & Active' : 'Disabled'}
              </span>
            </div>
          </div>

          {/* Connected Single Sign-On (SSO) */}
          <div className={`p-6 rounded-3xl border space-y-4 ${
            isDarkMode ? 'bg-[#101625] border-[#1d273d]' : 'bg-white border-slate-200 shadow-xs'
          }`}>
            <h3 className="font-display font-black text-sm text-slate-100 flex items-center gap-2">
              <Globe size={18} className="text-sky-400" /> Connected Identity Accounts
            </h3>

            <div className="space-y-2.5">
              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white p-1.5 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-full h-full">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-200 block">Google OIDC</span>
                    <span className="text-[10px] text-slate-400">{googleUser?.email || 'alexander.tolosa@clase.edu.ph'}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Connected
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-black text-xs">
                    CLASE
                  </div>
                  <div>
                    <span className="font-extrabold text-xs text-slate-200 block">University CLASE Portal SSO</span>
                    <span className="text-[10px] text-slate-400">Student ID: 2020-09482</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Sessions Management */}
      <div className={`p-6 rounded-3xl border space-y-4 ${
        isDarkMode ? 'bg-[#101625] border-[#1d273d]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between">
          <h3 className="font-display font-black text-sm text-slate-100 flex items-center gap-2">
            <Laptop size={18} className="text-sky-400" /> Active Logged-in Sessions
          </h3>
          <span className="text-xs text-slate-400">{sessions.length} devices active</span>
        </div>

        <div className="space-y-3">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 shrink-0">
                  <Laptop size={18} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-100">{sess.device}</span>
                    {sess.isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase">
                        Current Device
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">{sess.browser} • {sess.location}</p>
                  <p className="text-[10px] text-slate-500">IP: {sess.ip} • {sess.lastActive}</p>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => handleRevokeSession(sess.id)}
                  className="px-3 py-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 text-xs font-bold transition-colors cursor-pointer self-end sm:self-center"
                >
                  Revoke Session
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
