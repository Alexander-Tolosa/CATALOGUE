/**
 * useConvexSync — Hydrates Zustand stores from Convex after authentication.
 *
 * This hook bridges Convex's reactive database with the local Zustand stores.
 * It runs once after auth and keeps the local state in sync with Convex data.
 *
 * Pattern: Convex = source of truth for persistence, Zustand = fast local UI state.
 * On mount: Pull from Convex → merge into Zustand.
 * On mutation: Write to both Zustand (instant UI) and Convex (persistence).
 */

import { useEffect, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { useConvexAuth } from '@convex-dev/auth/react';
import { api } from '../../convex/_generated/api';
import { useAuthStore } from '../store/useAuthStore';
import { useAppStore } from '../store/useAppStore';

export function useConvexSync() {
  const { userId, googleUser, isAuthenticated } = useAuthStore();
  const { isAuthenticated: isConvexAuthActive } = useConvexAuth();
  const hasSynced = useRef(false);

  // Check viewer from Convex Auth session
  const convexViewer = useQuery(api.users.viewer);

  // Resolve the active user ID consistently
  const activeUserId = convexViewer?.userId || userId || (googleUser?.googleSubId ? `usr-g-${googleUser.googleSubId.slice(-8)}` : null);

  // Hydrate local auth if Convex Auth session is authenticated
  useEffect(() => {
    if (convexViewer?.user && !isAuthenticated) {
      useAuthStore.getState().loginWithGoogle(
        {
          googleSubId: convexViewer.userId,
          email: convexViewer.user.email || '',
          name: convexViewer.user.name || 'Learner',
          picture: convexViewer.user.image || convexViewer.profile?.avatarUrl || ''
        },
        convexViewer.userId
      );
    }
  }, [convexViewer, isAuthenticated]);

  // Convex queries (reactive — auto-update when data changes)
  const convexProfile = useQuery(
    api.users.getUserProfile,
    activeUserId ? { userId: activeUserId } : 'skip'
  );

  const convexStreak = useQuery(
    api.languages.getUserStreak,
    activeUserId ? { userId: activeUserId } : 'skip'
  );

  // Convex mutations
  const storeUser = useMutation(api.users.storeUserFromGoogleToken);
  const updateProfile = useMutation(api.users.updateUserProfile);

  // Sync Google user to Convex on first auth
  useEffect(() => {
    if (!isAuthenticated || !googleUser || hasSynced.current) return;

    const syncUser = async () => {
      try {
        await storeUser({
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          googleSubId: googleUser.googleSubId
        });
        hasSynced.current = true;
      } catch (err) {
        console.warn('Convex user sync deferred (may be offline or connecting):', err);
      }
    };

    syncUser();
  }, [isAuthenticated, googleUser, storeUser]);

  // Hydrate Zustand from Convex profile when it arrives
  useEffect(() => {
    if (!convexProfile || !activeUserId) return;

    const appStore = useAppStore.getState();
    const currentProfile = appStore.profile;

    // Only hydrate if Convex has meaningful data that differs from local
    if (convexProfile.fullName && convexProfile.fullName !== currentProfile.name) {
      appStore.updatePersonalInfo({
        fullName: convexProfile.fullName,
        username: convexProfile.username || undefined,
        statusMessage: convexProfile.statusMessage || undefined,
        pronouns: convexProfile.pronouns || undefined,
        roleBadge: convexProfile.roleBadge || undefined,
        bio: convexProfile.bio || undefined,
        studentId: convexProfile.studentId || undefined,
        department: convexProfile.department || undefined,
        program: convexProfile.program || undefined,
        yearLevel: convexProfile.yearLevel || undefined,
        phone: convexProfile.phone || undefined,
        dateOfBirth: convexProfile.dateOfBirth || undefined,
        address: convexProfile.address || undefined,
        avatarUrl: convexProfile.avatarUrl || undefined,
        bannerUrl: convexProfile.bannerUrl || undefined
      });
    }
  }, [convexProfile, activeUserId]);

  // Hydrate streak data from Convex
  useEffect(() => {
    if (!convexStreak || !activeUserId) return;

    const appStore = useAppStore.getState();
    const currentProfile = appStore.profile;

    if (convexStreak.currentStreak !== currentProfile.streakDays) {
      useAppStore.setState(prev => ({
        profile: {
          ...prev.profile,
          streakDays: convexStreak.currentStreak,
          lastStudyDate: convexStreak.lastActiveDate,
          studyDatesHistory: convexStreak.historyDates
            ? JSON.parse(convexStreak.historyDates)
            : prev.profile.studyDatesHistory
        }
      }));
    }
  }, [convexStreak, activeUserId]);

  return {
    activeUserId,
    isConvexReady: convexProfile !== undefined,
    updateProfile,
    storeUser
  };
}
