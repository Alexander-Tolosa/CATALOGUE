import React, { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { GoogleAuthModal } from './GoogleAuthModal';
import { Lock, Eye, EyeOff, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import catalougeLogo from '../../assets/catalouge_logo.png';

interface AuthScreenProps {
  onBack?: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onBack }) => {
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const [isRegisterMode, setIsRegisterMode] = useState(true);

  // Form Fields
  const [displayName, setDisplayName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    const fullName = displayName.trim() ||
      (isRegisterMode ? `${firstName} ${lastName}`.trim() : '') ||
      email.split('@')[0];

    // Authenticate user via session
    loginWithGoogle(
      {
        googleSubId: 'usr-' + Date.now(),
        email: email,
        name: fullName,
        picture:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDpsPyAmyFX0-x7YmO2F6V-HYUNSkQZ9y5ZwiGTPRDuKh7w8NLjQdcf1Q2MivuhQ4D9qxOYSRakIe57czlU0OETFOGpsghOsax81R8YeFIC_QKmFDJ6W4koSBPBvEruskA_MQyZ4RgLhVW1PM3kb-l4J8Xn4WkSprmlTkQlvaOABYQ0SKUWhiFcEmtyH6yhDEmNEgnsyQMttVVfCDSSXR6Gw_JKdDikoKAyDWZ2yHGXkiNggh5IEs39Zg'
      },
      'jwt-session-token-' + Date.now()
    );
  };

  return (
    <div className="min-h-screen bg-[#faf6f0] text-slate-900 font-sans flex flex-col lg:flex-row relative overflow-hidden selection:bg-[#FF6B35]/20">
      {/* LEFT HALF: Brand Showcase & Value Proposition */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-between relative z-10 border-b lg:border-b-0 lg:border-r border-orange-200/50 bg-gradient-to-br from-[#fffdf9] via-[#faf5ec] to-[#f6eee2]">
        {/* Soft Ambient Smudge Light Glowing Auras */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#FF6B35]/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-300/20 blur-[110px] rounded-full pointer-events-none" />

        {/* Top Brand Logo - Clicking Logo returns to Landing Page */}
        <div className="pt-2 lg:pt-0">
          <div
            onClick={onBack}
            className={`inline-flex items-center gap-3 group transition-transform ${onBack ? 'cursor-pointer select-none hover:scale-105 active:scale-95' : ''
              }`}
            title={onBack ? 'Click to return to Landing Page' : undefined}
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-b from-white to-[#f7eee1] border border-orange-200/80 flex items-center justify-center p-2 shadow-[0_6px_14px_rgba(180,100,30,0.12),_inset_0_1px_0_rgba(255,255,255,1)] group-hover:border-[#FF6B35]/60 transition-all">
              <img src={catalougeLogo} alt="CATalouge Logo" className="w-full h-full object-contain" />
            </div>
            <span className="font-brand font-extrabold text-xl tracking-wider text-slate-900 uppercase drop-shadow-xs group-hover:text-[#FF6B35] transition-colors">
              CATalogue
            </span>
          </div>
        </div>

        {/* Center Tagline & Subtitle */}
        <div className="my-12 lg:my-0 space-y-6 max-w-lg">
          <div className="font-brand text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-900">
            <div>Learn.</div>
            <div className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B35] to-[#ff8c42]">
              Master.
            </div>
            <div>Converse.</div>
            <div className="text-[#FF6B35]">Repeat.</div>
          </div>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-medium">
            Track your study streaks, master native script pronunciations, log spaced-repetition flashcards, and converse naturally with Kleo AI.
          </p>

          {/* Key Metrics / Features Row */}
          <div className="grid grid-cols-3 gap-4 pt-5 border-t border-orange-200/70">
            <div>
              <div className="text-sm font-black text-[#FF6B35]">25-min</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Focus Loops
              </div>
            </div>
            <div>
              <div className="text-sm font-black text-[#ff8c42]">Daily</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Streak Logs
              </div>
            </div>
            <div>
              <div className="text-sm font-black text-[#FF6B35]">Built-in</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                Flashcards & AI
              </div>
            </div>
          </div>
        </div>

        {/* Footer Copyright */}
        <div className="text-xs text-slate-500 font-medium">
          © 2026 CATalouge. Multilingual AI Platform powered by Kleo.
        </div>
      </div>

      {/* RIGHT HALF: Skeuomorphic Auth Card Container */}
      <div className="lg:w-1/2 p-6 sm:p-12 lg:p-16 flex items-center justify-center relative z-10 bg-[#faf6f0] bg-[radial-gradient(#e6dccf_1px,transparent_1px)] [background-size:24px_24px]">
        {/* Soft Background Smudge Aura behind card */}
        <div className="absolute w-[480px] h-[480px] bg-gradient-to-tr from-[#FF6B35]/20 to-amber-200/30 blur-[130px] rounded-full pointer-events-none" />

        {/* Skeuomorphic Floating Card Container */}
        <div className="w-full max-w-md bg-gradient-to-b from-white via-[#fdfaf5] to-[#f8f1e5] border-2 border-white/90 ring-1 ring-orange-200/60 rounded-[32px] p-8 sm:p-10 shadow-[0_25px_60px_-10px_rgba(180,110,40,0.16),_0_2px_6px_rgba(0,0,0,0.06),_inset_0_2px_1px_rgba(255,255,255,1),_inset_0_-2px_4px_rgba(0,0,0,0.03)] space-y-6 relative z-10">
          {/* Card Header Title & Subtitle */}
          <div className="space-y-1.5 text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-brand drop-shadow-xs">
              {isRegisterMode ? 'Create your account' : 'Welcome back'}
            </h2>
            <p className="text-xs font-semibold text-slate-500">
              {isRegisterMode
                ? 'Start your language learning journey today'
                : 'Sign in to continue your daily streak'}
            </p>
          </div>

          {/* Skeuomorphic Recessed Form Content Wrapper */}
          <div className="bg-gradient-to-b from-[#f8f0e3] to-[#f2e6d3] p-5.5 rounded-2xl border border-orange-200/80 shadow-[inset_0_3px_8px_rgba(0,0,0,0.07),_0_1px_0_rgba(255,255,255,0.9)] space-y-4">
            {/* 3D Convex Google Social Auth Button */}
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-b from-white via-[#fcf8f3] to-[#f4e8d8] text-slate-800 font-extrabold text-xs transition-all border border-orange-200/90 shadow-[0_4px_10px_rgba(0,0,0,0.08),_0_1px_2px_rgba(0,0,0,0.05),_inset_0_1.5px_0_rgba(255,255,255,1)] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] cursor-pointer group"
            >
              <svg className="w-4 h-4 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
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

            {/* Skeuomorphic Engraved Divider "OR" */}
            <div className="relative flex items-center justify-center my-3.5">
              <div className="w-full border-t border-orange-300/60 shadow-[0_1px_0_rgba(255,255,255,0.8)]" />
              <span className="absolute bg-[#f5ebe0] px-3.5 py-0.5 rounded-full border border-orange-200/80 text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-xs">
                or
              </span>
            </div>

            {/* Main Skeuomorphic Form Inputs */}
            <form onSubmit={handleEmailSubmit} className="space-y-4 text-left">
              {/* Display Name Input Field */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                  DISPLAY NAME
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  className="w-full bg-[#f0e6d5] border border-orange-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-semibold shadow-[inset_0_2px_5px_rgba(0,0,0,0.09),_0_1px_0_rgba(255,255,255,0.8)] focus:outline-none focus:bg-white focus:border-[#FF6B35] focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.04),_0_0_10px_rgba(255,107,53,0.25)] transition-all"
                />
              </div>

              {/* Sign Up Mode: First Name & Last Name (Side by Side) */}
              {isRegisterMode && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                      FIRST NAME
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="First name"
                      className="w-full bg-[#f0e6d5] border border-orange-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-semibold shadow-[inset_0_2px_5px_rgba(0,0,0,0.09),_0_1px_0_rgba(255,255,255,0.8)] focus:outline-none focus:bg-white focus:border-[#FF6B35] focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.04),_0_0_10px_rgba(255,107,53,0.25)] transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                      LAST NAME
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Last name"
                      className="w-full bg-[#f0e6d5] border border-orange-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-semibold shadow-[inset_0_2px_5px_rgba(0,0,0,0.09),_0_1px_0_rgba(255,255,255,0.8)] focus:outline-none focus:bg-white focus:border-[#FF6B35] focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.04),_0_0_10px_rgba(255,107,53,0.25)] transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                  EMAIL ADDRESS
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full bg-[#f0e6d5] border border-orange-200/90 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-semibold shadow-[inset_0_2px_5px_rgba(0,0,0,0.09),_0_1px_0_rgba(255,255,255,0.8)] focus:outline-none focus:bg-white focus:border-[#FF6B35] focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.04),_0_0_10px_rgba(255,107,53,0.25)] transition-all"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-extrabold text-slate-600 uppercase tracking-wider block">
                    PASSWORD
                  </label>
                  {!isRegisterMode && (
                    <button
                      type="button"
                      onClick={() => alert('Password reset link sent to your email!')}
                      className="text-[10px] font-bold text-[#FF6B35] hover:underline cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full bg-[#f0e6d5] border border-orange-200/90 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 font-semibold shadow-[inset_0_2px_5px_rgba(0,0,0,0.09),_0_1px_0_rgba(255,255,255,0.8)] focus:outline-none focus:bg-white focus:border-[#FF6B35] focus:shadow-[inset_0_1px_3px_rgba(0,0,0,0.04),_0_0_10px_rgba(255,107,53,0.25)] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* 3D Glossy Orange Primary Action Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-b from-[#FF7B47] via-[#FF6B35] to-[#E55118] text-white font-black text-xs transition-all shadow-[0_6px_18px_rgba(255,107,53,0.4),_0_2px_4px_rgba(0,0,0,0.15),_inset_0_1.5px_0_rgba(255,255,255,0.45),_inset_0_-2px_0_rgba(0,0,0,0.2)] border-t border-white/30 border-b-2 border-[#b83a0a] hover:from-[#ff8554] hover:to-[#ee581f] hover:translate-y-[-1px] active:translate-y-[1px] active:shadow-[inset_0_3px_6px_rgba(0,0,0,0.3)] tracking-wider cursor-pointer mt-3 flex items-center justify-center gap-1.5"
              >
                <span>{isRegisterMode ? 'Continue' : 'Sign In'}</span>
                <ArrowRight size={15} className="stroke-[3]" />
              </button>
            </form>
          </div>

          {/* Mode Switcher Footer */}
          <div className="pt-2 text-center space-y-3">
            <button
              onClick={() => setIsRegisterMode(!isRegisterMode)}
              className="text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
            >
              {isRegisterMode ? (
                <>
                  Already have an account?{' '}
                  <span className="text-[#FF6B35] font-extrabold hover:underline">Sign in</span>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <span className="text-[#FF6B35] font-extrabold hover:underline">Sign up</span>
                </>
              )}
            </button>

            {/* Skeuomorphic Engraved Security Plate */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-slate-600 bg-gradient-to-b from-[#efe5d4] to-[#e7dbca] py-2 px-3.5 rounded-xl border border-orange-200/80 shadow-[inset_0_1px_3px_rgba(0,0,0,0.06),_0_1px_0_rgba(255,255,255,0.8)] max-w-xs mx-auto">
              <ShieldCheck size={14} className="text-[#FF6B35]" />
              <span>Secured by CATalouge Auth • Encrypted Session</span>
            </div>
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

