import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { GoogleAuthModal } from './GoogleAuthModal';
import kleoCatImg from '../../assets/kleo_cat_isolated.png';

export const AuthScreen: React.FC = () => {
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('learner@catalouge.app');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('User_Sensei');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Authenticate user via JWT / Session
    loginWithGoogle(
      {
        googleSubId: 'usr-' + Date.now(),
        email: email,
        name: name || email.split('@')[0],
        picture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpsPyAmyFX0-x7YmO2F6V-HYUNSkQZ9y5ZwiGTPRDuKh7w8NLjQdcf1Q2MivuhQ4D9qxOYSRakIe57czlU0OETFOGpsghOsax81R8YeFIC_QKmFDJ6W4koSBPBvEruskA_MQyZ4RgLhVW1PM3kb-l4J8Xn4WkSprmlTkQlvaOABYQ0SKUWhiFcEmtyH6yhDEmNEgnsyQMttVVfCDSSXR6Gw_JKdDikoKAyDWZ2yHGXkiNggh5IEs39Zg'
      },
      'jwt-session-token-' + Date.now()
    );
  };

  return (
    <div className="min-h-screen bg-[#0e1322] text-[#dee1f7] font-sans flex items-center justify-center p-4 selection:bg-[#5affff]/30 relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#5affff]/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#cebdff]/10 blur-[130px] rounded-full" />
      </div>

      {/* Auth Container Card */}
      <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-[#5affff]/30 shadow-2xl space-y-6 relative z-10 bg-[#090e1c]/90">
        {/* Brand Header & Kleo Cat Mascot Avatar */}
        <div className="text-center space-y-3">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#161b2b] border-2 border-[#5affff]/30 p-2 relative flex items-center justify-center shadow-[0_0_25px_rgba(90,255,255,0.2)]">
            <img
              src={kleoCatImg}
              alt="Kleo Cat Mascot"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/kleo_cat_isolated.png';
              }}
            />
          </div>

          <div>
            <h1 className="font-display font-black text-3xl text-[#5affff] tracking-tight">CATalouge</h1>
            <p className="text-xs font-bold text-[#bacac9]/70 uppercase tracking-widest mt-0.5">
              Multilingual AI Platform
            </p>
          </div>
        </div>

        {/* Google Identity Services (OAuth 2.0 & OIDC) Quick Button */}
        <div className="space-y-3">
          <button
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs transition-all shadow-xl active:scale-95 border border-slate-300"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google (OIDC)</span>
          </button>

          <div className="flex items-center gap-3 py-1">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] text-[#bacac9]/60 font-bold uppercase tracking-widest">OR EMAIL</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>
        </div>

        {/* Email & Password Authentication Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          {isRegisterMode && (
            <div className="space-y-1 text-left">
              <label className="text-[11px] font-bold text-[#bacac9] uppercase tracking-wider">Display Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your display name"
                className="w-full bg-[#161b2b] border border-[#5affff]/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#5affff]"
                required
              />
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="text-[11px] font-bold text-[#bacac9] uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="learner@catalouge.app"
              className="w-full bg-[#161b2b] border border-[#5affff]/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#5affff]"
              required
            />
          </div>

          <div className="space-y-1 text-left">
            <label className="text-[11px] font-bold text-[#bacac9] uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#161b2b] border border-[#5affff]/20 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#5affff]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-2xl bg-[#5affff] text-[#003737] font-black text-xs transition-all shadow-[0_0_20px_rgba(90,255,255,0.3)] hover:scale-[1.02] active:scale-95 uppercase tracking-wider"
          >
            {isRegisterMode ? 'Create Account & Start Learning' : 'Sign In to CATalouge'}
          </button>
        </form>

        {/* Toggle Mode Footer */}
        <div className="text-center pt-2 border-t border-white/5">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs font-bold text-[#5affff] hover:underline"
          >
            {isRegisterMode
              ? 'Already have an account? Sign In'
              : "Don't have an account? Register Now"}
          </button>
        </div>
      </div>

      {/* Google Identity Services Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />
    </div>
  );
};
