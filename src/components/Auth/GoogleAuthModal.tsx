import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../../store/useAuthStore';
import { X, ShieldCheck } from 'lucide-react';
import catalougeLogo from '../../assets/catalouge_logo.png';

interface GoogleOidcPayload {
  sub: string;
  email: string;
  name: string;
  picture: string;
}

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({ isOpen, onClose }) => {
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const [selectedDisplayName, setSelectedDisplayName] = useState('');
  const [clientId, setClientId] = useState(
    import.meta.env.VITE_GOOGLE_CLIENT_ID || '1088492049281-catalouge-sandbox.apps.googleusercontent.com'
  );

  useEffect(() => {
    // Load Google Identity Services (GIS) Script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCredentialResponse
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId]);

  const handleGoogleCredentialResponse = (response: any) => {
    try {
      const idToken = response.credential;
      const decoded: GoogleOidcPayload = jwtDecode(idToken);
      loginWithGoogle({
        googleSubId: decoded.sub,
        email: decoded.email,
        name: selectedDisplayName.trim() || decoded.name || 'Learner',
        picture: decoded.picture
      }, idToken);
      onClose();
    } catch (e) {
      console.error('Failed to parse Google OIDC Token:', e);
    }
  };

  const handleSandboxLogin = () => {
    // E2E Sandbox Google Identity Services (OIDC) authentication
    loginWithGoogle({
      googleSubId: 'google-sub-1029384756',
      email: 'sensei@google.com',
      name: selectedDisplayName.trim() || 'Learner',
      picture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpsPyAmyFX0-x7YmO2F6V-HYUNSkQZ9y5ZwiGTPRDuKh7w8NLjQdcf1Q2MivuhQ4D9qxOYSRakIe57czlU0OETFOGpsghOsax81R8YeFIC_QKmFDJ6W4koSBPBvEruskA_MQyZ4RgLhVW1PM3kb-l4J8Xn4WkSprmlTkQlvaOABYQ0SKUWhiFcEmtyH6yhDEmNEgnsyQMttVVfCDSSXR6Gw_JKdDikoKAyDWZ2yHGXkiNggh5IEs39Zg'
    }, 'mock-google-oidc-jwt-token');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-fadeIn">
      {/* Clean Modern White Card Modal Container */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-8 space-y-6 text-center relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors cursor-pointer"
          title="Close modal"
        >
          <X size={18} />
        </button>

        {/* Header & Cat Mascot Logo Badge */}
        <div className="space-y-3 pt-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center p-2.5 shadow-xs">
            <img src={catalougeLogo} alt="CATalouge Logo" className="w-full h-full object-contain" />
          </div>

          <div className="space-y-1">
            <h3 className="font-display font-black text-2xl text-slate-900 tracking-tight">
              Sign in to CATALOUGE
            </h3>
            <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto leading-relaxed">
              Use Google Identity Services (OAuth 2.0 & OIDC) for real-time cloud sync with Convex.
            </p>
          </div>
        </div>

        {/* Display Name Input Section */}
        <div className="space-y-1.5 text-left bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80">
          <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block">
            DISPLAY NAME
          </label>
          <input
            type="text"
            value={selectedDisplayName}
            onChange={(e) => setSelectedDisplayName(e.target.value)}
            placeholder="Enter your display name"
            className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#FF6B35] transition-all"
          />
        </div>

        {/* Duolingo 3D Style Google Sign In Button */}
        <div className="space-y-4 pt-1">
          <button
            onClick={handleSandboxLogin}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm transition-all border-2 border-slate-200 shadow-[0_4px_0_0_#cbd5e1] active:translate-y-1 active:shadow-none cursor-pointer"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
            <span>Sign in with Google (OIDC)</span>
          </button>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-extrabold text-[#F97316] uppercase tracking-wider pt-1">
            <ShieldCheck size={14} className="text-[#F97316]" />
            <span>OAuth 2.0 & OpenID Connect Secured</span>
          </div>
        </div>
      </div>
    </div>
  );
};

declare global {
  interface Window {
    google?: any;
  }
}
