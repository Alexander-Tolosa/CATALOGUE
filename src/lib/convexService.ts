/**
 * Convex Client Service Bridge
 * Connects CATALOGUE's React UI & Zustand state with Convex Reactive Database.
 * Provides typed operations with resilience and local fallback caching.
 */

import { useQuery, useMutation } from "convex/react";
import { anyApi } from "convex/server";
import { useAuthStore } from "../store/useAuthStore";
import { useAppStore } from "../store/useAppStore";
import { EarnedCertificate } from "../types/proficiency";

// Helper to get active user ID
export function getActiveUserId(): string {
  const { userId, googleUser } = useAuthStore.getState();
  if (userId) return userId;
  if (googleUser?.googleSubId) return `usr-g-${googleUser.googleSubId.slice(-8)}`;
  return "usr-guest";
}

/**
 * Hook to retrieve the current user's profile from Convex
 */
export function useConvexUserProfile() {
  const userId = getActiveUserId();
  try {
    const profile = useQuery((anyApi as any).users.getUserProfile, { userId });
    return { profile, loading: profile === undefined };
  } catch {
    return { profile: null, loading: false };
  }
}

/**
 * Hook to retrieve user's earned certificates from Convex
 */
export function useConvexCertificates(): { certificates: EarnedCertificate[]; loading: boolean } {
  const userId = getActiveUserId();
  try {
    const certs = useQuery((anyApi as any).certificates.getUserCertificates, { userId });
    if (Array.isArray(certs)) {
      return {
        certificates: certs.map((c: any) => ({
          id: c._id || c.id || '',
          userId: c.userId || userId,
          userName: c.userName || 'Learner',
          languageId: c.languageId || `lang-${c.languageCode || 'ko'}`,
          languageName: c.languageName || 'Language',
          languageCode: c.languageCode || 'ko',
          levelId: c.levelId || 'lvl-1',
          levelName: c.levelName || 'Proficiency Level',
          levelCode: c.levelCode || 'L1',
          issuedAt: c.issuedAt || new Date().toISOString(),
          certificateCode: c.certificateCode || '',
          pdfUrl: c.pdfUrl || ''
        })),
        loading: false
      };
    }
    return { certificates: [], loading: certs === undefined };
  } catch {
    return { certificates: [], loading: false };
  }
}

/**
 * Hook to retrieve user's level progress for a language track
 */
export function useConvexProgress(languageCode: string) {
  const userId = getActiveUserId();
  try {
    const progressList = useQuery((anyApi as any).progress.getUserProgress, {
      userId,
      languageCode
    });
    return { progressList: progressList || [], loading: progressList === undefined };
  } catch {
    return { progressList: [], loading: false };
  }
}

/**
 * Service helpers for mutations
 */
export const convexService = {
  // Sync authenticated user into Convex
  async syncUserWithConvex(googleUser: { email: string; name: string; picture: string; googleSubId: string }, convexClient?: any) {
    if (convexClient && typeof convexClient.mutation === "function") {
      try {
        await convexClient.mutation((anyApi as any).users.storeUserFromGoogleToken, {
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          googleSubId: googleUser.googleSubId
        });
      } catch (err) {
        console.warn("Convex user sync notice (offline or connecting):", err);
      }
    }
  },

  // Save quiz completion to Convex
  async submitQuizResult(
    levelId: string,
    languageCode: string,
    score: number,
    passed: boolean,
    convexMutation?: any
  ) {
    const userId = getActiveUserId();
    if (convexMutation) {
      try {
        await convexMutation({
          userId,
          languageCode,
          levelId,
          score,
          passed
        });
      } catch (err) {
        console.warn("Failed to persist quiz result to Convex:", err);
      }
    }

    // Also update local store for instant UI feedback
    if (passed) {
      useAppStore.getState().completeLessonNode(levelId, 50);
    }
  },

  // Persist newly issued certificate into Convex
  async persistCertificate(certData: {
    userName: string;
    languageName: string;
    languageCode: string;
    levelName: string;
    levelCode: string;
    certificateCode: string;
    pdfUrl: string;
  }, convexMutation?: any) {
    const userId = getActiveUserId();
    if (convexMutation) {
      try {
        await convexMutation({
          userId,
          ...certData
        });
      } catch (err) {
        console.warn("Failed to persist certificate to Convex:", err);
      }
    }
  }
};
