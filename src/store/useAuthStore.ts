import { create } from 'zustand';

export interface GoogleUserProfile {
  googleSubId: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthState {
  token: string | null;
  googleUser: GoogleUserProfile | null;
  isAuthenticated: boolean;
  loginWithGoogle: (profile: GoogleUserProfile, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('catalouge_google_oidc_token') || 'google-oidc-active-token',
  googleUser: (() => {
    const saved = localStorage.getItem('catalouge_google_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {
      googleSubId: 'google-sub-1029384756',
      email: 'sensei@google.com',
      name: 'User_Sensei',
      picture: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDpsPyAmyFX0-x7YmO2F6V-HYUNSkQZ9y5ZwiGTPRDuKh7w8NLjQdcf1Q2MivuhQ4D9qxOYSRakIe57czlU0OETFOGpsghOsax81R8YeFIC_QKmFDJ6W4koSBPBvEruskA_MQyZ4RgLhVW1PM3kb-l4J8Xn4WkSprmlTkQlvaOABYQ0SKUWhiFcEmtyH6yhDEmNEgnsyQMttVVfCDSSXR6Gw_JKdDikoKAyDWZ2yHGXkiNggh5IEs39Zg'
    };
  })(),
  isAuthenticated: true,

  loginWithGoogle: (profile, token) => {
    localStorage.setItem('catalouge_google_oidc_token', token);
    localStorage.setItem('catalouge_google_user', JSON.stringify(profile));
    set({ token, googleUser: profile, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('catalouge_google_oidc_token');
    localStorage.removeItem('catalouge_google_user');
    set({ token: null, googleUser: null, isAuthenticated: false });
  }
}));
