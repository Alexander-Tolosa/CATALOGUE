import { create } from 'zustand';
import { useAppStore } from './useAppStore';

export interface GoogleUserProfile {
  googleSubId: string;
  email: string;
  name: string;
  picture: string;
}

interface AuthState {
  userId: string | null;
  token: string | null;
  googleUser: GoogleUserProfile | null;
  isAuthenticated: boolean;
  loginWithGoogle: (profile: GoogleUserProfile, token: string) => void;
  setAuthenticatedUser: (user: { id: string; email: string; name: string; picture?: string }, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: localStorage.getItem('catalogue_user_id') || null,
  token: localStorage.getItem('catalogue_google_oidc_token') || localStorage.getItem('catalouge_google_oidc_token'),
  googleUser: (() => {
    const saved = localStorage.getItem('catalogue_google_user') || localStorage.getItem('catalouge_google_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  })(),
  isAuthenticated: !!(localStorage.getItem('catalogue_google_oidc_token') || localStorage.getItem('catalouge_google_oidc_token')),

  loginWithGoogle: (profile, token) => {
    const generatedUserId = `usr-g-${profile.googleSubId.slice(-8)}`;
    localStorage.setItem('catalogue_google_oidc_token', token);
    localStorage.setItem('catalogue_google_user', JSON.stringify(profile));
    localStorage.setItem('catalogue_user_id', generatedUserId);

    // Synchronize authenticated user into app store
    useAppStore.getState().syncWithAuthenticatedUser({
      id: generatedUserId,
      name: profile.name,
      email: profile.email,
      picture: profile.picture
    });

    set({ userId: generatedUserId, token, googleUser: profile, isAuthenticated: true });
  },

  setAuthenticatedUser: (user, token) => {
    localStorage.setItem('catalogue_google_oidc_token', token);
    localStorage.setItem('catalogue_user_id', user.id);

    useAppStore.getState().syncWithAuthenticatedUser({
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture
    });

    set({
      userId: user.id,
      token,
      googleUser: {
        googleSubId: user.id,
        email: user.email,
        name: user.name,
        picture: user.picture || ''
      },
      isAuthenticated: true
    });
  },

  logout: () => {
    localStorage.removeItem('catalogue_google_oidc_token');
    localStorage.removeItem('catalouge_google_oidc_token');
    localStorage.removeItem('catalogue_google_user');
    localStorage.removeItem('catalouge_google_user');
    localStorage.removeItem('catalogue_user_id');
    set({ userId: null, token: null, googleUser: null, isAuthenticated: false });
  }
}));
