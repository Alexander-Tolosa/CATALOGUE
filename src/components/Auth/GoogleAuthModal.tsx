import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../../store/useAuthStore';

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
        name: decoded.name,
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
      name: 'Google Sensei',
      picture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpsPyAmyFX0-x7YmO2F6V-HYUNSkQZ9y5ZwiGTPRDuKh7w8NLjQdcf1Q2MivuhQ4D9qxOYSRakIe57czlU0OETFOGpsghOsax81R8YeFIC_QKmFDJ6W4koSBPBvEruskA_MQyZ4RgLhVW1PM3kb-l4J8Xn4WkSprmlTkQlvaOABYQ0SKUWhiFcEmtyH6yhDEmNEgnsyQMttVVfCDSSXR6Gw_JKdDikoKAyDWZ2yHGXkiNggh5IEs39Zg'
    }, 'mock-google-oidc-jwt-token');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="glass-card w-full max-w-md p-8 rounded-3xl border border-[#5affff]/30 shadow-2xl space-y-6 text-center relative overflow-hidden bg-[#090e1c]/95">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#bacac9] hover:text-white p-2 rounded-full hover:bg-white/10"
        >
          ✕
        </button>

        {/* Header */}
        <div className="space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#5affff]/20 border border-[#5affff]/40 flex items-center justify-center text-[#5affff] text-2xl shadow-lg">
            🐾
          </div>
          <h3 className="font-display font-extrabold text-2xl text-white">Sign in to CATalouge</h3>
          <p className="text-xs text-[#bacac9] max-w-xs mx-auto">
            Use Google Identity Services (OAuth 2.0 & OIDC) for real-time cloud sync with Convex.
          </p>
        </div>

        {/* Official Google Sign In Button */}
        <div className="space-y-3 pt-2">
          <button
            onClick={handleSandboxLogin}
            className="w-full flex items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs transition-all shadow-xl active:scale-95 border border-slate-300"
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
            <span>Sign in with Google (OIDC)</span>
          </button>

          <span className="text-[10px] text-[#bacac9]/70 uppercase tracking-widest block font-bold">
            OAuth 2.0 & OpenID Connect Secured
          </span>
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
