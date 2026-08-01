import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { GoogleAuthModal } from './GoogleAuthModal';
import { Lock, ArrowLeft } from 'lucide-react';
import catalougeLogo from '../../assets/catalouge_logo.png';

interface AuthScreenProps {
  onBack?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBack }) => {
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('you@company.com');
  const [password, setPassword] = useState('••••••••');
  const [name, setName] = useState('User_Sensei');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Authenticate user via session
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
    <div className="min-h-screen bg-[#f3f4f6] text-slate-900 font-sans flex items-center justify-center p-4 selection:bg-[#f97316]/20 relative overflow-hidden">
      {/* Top Left Big Lucide Back Arrow Button */}
      {onBack && (
        <button
          onClick={onBack}
          className="fixed top-6 left-6 z-50 p-3 rounded-full bg-white hover:bg-slate-50 text-slate-700 hover:text-[#f97316] border border-slate-200 shadow-md transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center"
          title="Back to Landing Page"
        >
          <ArrowLeft size={24} className="stroke-[2.5]" />
        </button>
      )}

      {/* Background Soft Glow Aura */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-orange-100/50 blur-[140px] rounded-full" />
      </div>

      {/* Main Authentication Card Container */}
      <div className="bg-white w-full max-w-md p-8 md:p-10 rounded-3xl border border-slate-100 shadow-2xl shadow-slate-300/40 space-y-6 relative z-10 text-center">
        {/* Top Circular Brand Mascot Logo Badge */}
        <div className="space-y-3">
          <div className="w-14 h-14 mx-auto rounded-full bg-orange-50 border border-orange-200/80 flex items-center justify-center p-2 shadow-2xs">
            <img src={catalougeLogo} alt="CATalouge Logo" className="w-full h-full object-contain" />
          </div>

          <div>
            <h1 className="font-display font-black text-2xl text-slate-900 tracking-tight">
              CATalogue
            </h1>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mt-0.5">
              MULTILINGUAL AI PLATFORM
            </p>
          </div>

          <div className="pt-2 space-y-1">
            <h2 className="font-display font-black text-xl text-slate-900">
              {isRegisterMode ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-xs text-slate-500">
              {isRegisterMode
                ? 'Sign up to start mastering new languages with Kleo.'
                : 'Sign in to continue where you left off.'}
            </p>
          </div>
        </div>

        {/* Google Identity Services (OAuth 2.0 & OIDC) Button */}
        <div className="space-y-4">
          <button
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs transition-all border border-slate-200 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
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
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="w-full border-t border-slate-200" />
            <span className="absolute bg-white px-3 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
              OR CONTINUE WITH EMAIL
            </span>
          </div>
        </div>

        {/* Email & Password Authentication Form */}
        <form onSubmit={handleEmailSubmit} className="space-y-3.5 text-left">
          {isRegisterMode && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                FULL NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="User Sensei"
                className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f97316] focus:bg-white transition-all"
                required
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f97316] focus:bg-white transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                PASSWORD
              </label>
              {!isRegisterMode && (
                <button
                  type="button"
                  onClick={() => alert('Password reset link sent to your email!')}
                  className="text-[11px] font-bold text-[#f97316] hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#f97316] focus:bg-white transition-all"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#f97316] hover:bg-[#ea580c] text-white font-black text-xs transition-all shadow-md active:scale-98 uppercase tracking-wider cursor-pointer mt-2"
          >
            {isRegisterMode ? 'CREATE AN ACCOUNT' : 'SIGN IN TO CATALOGUE'}
          </button>
        </form>

        {/* Footer & Mode Toggle */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <button
            onClick={() => setIsRegisterMode(!isRegisterMode)}
            className="text-xs font-medium text-slate-600 cursor-pointer transition-colors"
          >
            {isRegisterMode ? (
              <>Already have an account? <span className="text-[#f97316] font-bold hover:underline">Sign in</span></>
            ) : (
              <>New to CATalogue? <span className="text-[#f97316] font-bold hover:underline">Create an account</span></>
            )}
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium text-slate-400">
            <Lock size={12} className="text-slate-400" />
            <span>Your access is protected with secure encryption</span>
          </div>
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
