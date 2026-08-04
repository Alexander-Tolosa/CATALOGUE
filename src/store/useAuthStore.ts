import { create } from 'zustand';
import { useAppStore } from './useAppStore';

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
  token: localStorage.getItem('catalouge_google_oidc_token'),
  googleUser: (() => {
    const saved = localStorage.getItem('catalouge_google_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  })(),
  isAuthenticated: !!localStorage.getItem('catalouge_google_oidc_token'),

  loginWithGoogle: (profile, token) => {
    localStorage.setItem('catalouge_google_oidc_token', token);
    localStorage.setItem('catalouge_google_user', JSON.stringify(profile));

    // Synchronize authenticated display name into app user profile
    try {
      const savedAppProfile = localStorage.getItem('catalouge_user_profile');
      if (savedAppProfile) {
        const parsed = JSON.parse(savedAppProfile);
        parsed.name = profile.name;
        localStorage.setItem('catalouge_user_profile', JSON.stringify(parsed));
        useAppStore.setState({ profile: parsed });
      } else {
        useAppStore.setState((state) => {
          const updated = { ...state.profile, name: profile.name };
          localStorage.setItem('catalouge_user_profile', JSON.stringify(updated));
          return { profile: updated };
        });
      }
    } catch (e) {
      console.error('Failed to sync profile display name:', e);
    }

    set({ token, googleUser: profile, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('catalouge_google_oidc_token');
    localStorage.removeItem('catalouge_google_user');
    set({ token: null, googleUser: null, isAuthenticated: false });
  }
}));
