import { create } from 'zustand';
import { UserProfile, LanguageTrack, ReviewItem, CosmeticItem } from '../types';
import { KOREAN_NODES } from '../data/koreanData';
import { JAPANESE_NODES } from '../data/japaneseData';
import { ENGLISH_NODES } from '../data/englishData';

export const COSMETIC_ITEMS: CosmeticItem[] = [
  { id: 'blue_beret', name: 'Blue Beret', category: 'hat', icon: '🧢', requiredBondLevel: 1 },
  { id: 'red_scarf', name: 'Cozy Red Scarf', category: 'scarf', icon: '🧣', requiredBondLevel: 2 },
  { id: 'cat_glasses', name: 'Smart Glasses', category: 'glasses', icon: '👓', requiredBondLevel: 3 },
  { id: 'golden_crown', name: 'Royal Crown', category: 'hat', icon: '👑', requiredBondLevel: 5 },
  { id: 'sakura_flower', name: 'Sakura Pin', category: 'hat', icon: '🌸', requiredBondLevel: 4 }
];

const DEFAULT_PROFILE: UserProfile = {
  name: 'ALEXANDER MICHAEL TOLOSA',
  lifecycleState: 'returning',
  selectedLanguage: 'ko',
  dailyGoalMinutes: 10,
  minutesCompletedToday: 4,
  xp: 140,
  level: 2,
  streakDays: 5,
  lastStudyDate: new Date().toISOString().split('T')[0],
  studyDatesHistory: [
    new Date(Date.now() - 86400000 * 4).toISOString().split('T')[0],
    new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0],
    new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0],
    new Date(Date.now() - 86400000 * 1).toISOString().split('T')[0],
    new Date().toISOString().split('T')[0]
  ],
  hearts: 5,
  maxHearts: 5,
  equippedCosmetics: {
    hat: 'blue_beret'
  },
  savedPhrases: [
    {
      id: 'rev-1',
      term: '안녕하세요 (Annyeonghaseyo)',
      translation: 'Hello / Good day',
      language: 'ko',
      phonetic: 'an-nyeong-ha-se-yo',
      interval: 1,
      easeFactor: 2.5,
      nextReviewAt: new Date().toISOString().split('T')[0]
    },
    {
      id: 'rev-2',
      term: '猫 (Neko)',
      translation: 'Cat',
      language: 'ja',
      phonetic: 'ne-ko',
      interval: 1,
      easeFactor: 2.5,
      nextReviewAt: new Date().toISOString().split('T')[0]
    }
  ],
  completedNodeIds: ['ko-node-1'],
  struggledVocab: [
    { word: '존댓말 (Honorifics)', language: 'ko', context: 'Used casual banmal with elder in chat', timestamp: new Date().toISOString() },
    { word: 'です / ます (Polite Form)', language: 'ja', context: 'Omitted polite verb ending in roleplay', timestamp: new Date().toISOString() }
  ],
  personalInfo: {
    fullName: 'ALEXANDER MICHAEL TOLOSA',
    studentId: '2020-09482',
    department: 'College of Liberal Arts, Sciences and Education (CLASE)',
    program: 'Information Technology (CLASE)',
    yearLevel: 'BSIT 2nd Year (Section 2C)',
    email: 'alexander.tolosa@clase.edu.ph',
    phone: '+63 912 345 6789',
    dateOfBirth: 'March 15, 2002',
    address: 'Iloilo City, Philippines',
    emergencyContact: {
      name: 'Maria Teresa Tolosa',
      relationship: 'Mother / Guardian',
      phone: '+63 918 765 4321'
    },
    bio: 'There is currently no information about this member.',
    joinedDate: 'Sep 4, 2020',
    lastActivity: '3 hours ago'
  }
};

interface AppStoreState {
  profile: UserProfile;
  isDarkMode: boolean;
  isChatbotOpen: boolean;
  isSidebarExpanded: boolean;
  setSidebarExpanded: (expanded: boolean) => void;
  isAppRefreshing: boolean;
  triggerAppRefresh: () => void;
  finishAppRefresh: () => void;
  toggleChatbot: () => void;
  setIsChatbotOpen: (isOpen: boolean) => void;
  toggleThemeMode: () => void;
  selectLanguageTrack: (lang: LanguageTrack) => void;
  deductHeart: () => void;
  refillHearts: () => void;
  addXP: (amount: number) => void;
  completeLessonNode: (nodeId: string, xpReward: number) => void;
  savePhraseToReview: (item: Omit<ReviewItem, 'id' | 'interval' | 'easeFactor' | 'nextReviewAt'>) => void;
  addStruggledWords: (words: string[], context?: string) => void;
  clearStruggledWords: () => void;
  equipCosmetic: (category: 'hat' | 'scarf' | 'glasses' | 'skin', cosmeticId?: string) => void;
  getActiveNodes: () => typeof KOREAN_NODES;
  updatePersonalInfo: (info: Partial<UserProfile['personalInfo']> & { name?: string }) => void;
}

export const useAppStore = create<AppStoreState>((set, get) => ({
  profile: (() => {
    const saved = localStorage.getItem('catalogue_user_profile') || localStorage.getItem('catalouge_user_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_PROFILE;
  })(),

  isDarkMode: (localStorage.getItem('catalogue_theme_dark') || localStorage.getItem('catalouge_theme_dark')) === 'true',
  isChatbotOpen: false,
  isSidebarExpanded: false,
  isAppRefreshing: false,

  triggerAppRefresh: () => {
    set({ isAppRefreshing: true });
  },

  finishAppRefresh: () => {
    set({ isAppRefreshing: false });
  },

  setSidebarExpanded: (expanded: boolean) => {
    set({ isSidebarExpanded: expanded });
  },

  toggleChatbot: () => {
    set((state) => ({ isChatbotOpen: !state.isChatbotOpen }));
  },

  setIsChatbotOpen: (isOpen: boolean) => {
    set({ isChatbotOpen: isOpen });
  },

  toggleThemeMode: () => {
    set((state) => {
      const nextMode = !state.isDarkMode;
      localStorage.setItem('catalogue_theme_dark', String(nextMode));
      if (typeof document !== 'undefined') {
        if (nextMode) {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      }
      return { isDarkMode: nextMode };
    });
  },

  selectLanguageTrack: (lang) => {
    set((state) => {
      const updated = { ...state.profile, selectedLanguage: lang };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updated));
      return { profile: updated };
    });
  },

  deductHeart: () => {
    set((state) => {
      const updated = { ...state.profile, hearts: Math.max(0, state.profile.hearts - 1) };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updated));
      return { profile: updated };
    });
  },

  refillHearts: () => {
    set((state) => {
      const updated = { ...state.profile, hearts: state.profile.maxHearts };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updated));
      return { profile: updated };
    });
  },

  addXP: (amount) => {
    set((state) => {
      const newXP = state.profile.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const updated = {
        ...state.profile,
        xp: newXP,
        level: newLevel,
        minutesCompletedToday: state.profile.minutesCompletedToday + 3
      };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updated));
      return { profile: updated };
    });
  },

  completeLessonNode: (nodeId, xpReward) => {
    set((state) => {
      const completed = state.profile.completedNodeIds.includes(nodeId)
        ? state.profile.completedNodeIds
        : [...state.profile.completedNodeIds, nodeId];
      const updated = {
        ...state.profile,
        completedNodeIds: completed,
        xp: state.profile.xp + xpReward
      };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updated));
      return { profile: updated };
    });
  },

  savePhraseToReview: (item) => {
    const newItem: ReviewItem = {
      ...item,
      id: 'rev-' + Date.now(),
      interval: 1,
      easeFactor: 2.5,
      nextReviewAt: new Date().toISOString().split('T')[0]
    };
    set((state) => {
      const updated = {
        ...state.profile,
        savedPhrases: [newItem, ...state.profile.savedPhrases]
      };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updated));
      return { profile: updated };
    });
  },

  addStruggledWords: (words, context) => {
    set((state) => {
      const currentList = state.profile.struggledVocab || [];
      const newItems = words.map(w => ({
        word: w,
        language: state.profile.selectedLanguage,
        context: context || 'Identified in AI practice session',
        timestamp: new Date().toISOString()
      }));
      // Filter duplicates
      const filteredExisting = currentList.filter(existing => !words.includes(existing.word));
      const updatedList = [...newItems, ...filteredExisting].slice(0, 20); // Keep top 20 recent
      const updated = { ...state.profile, struggledVocab: updatedList };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updated));
      return { profile: updated };
    });
  },

  clearStruggledWords: () => {
    set((state) => {
      const updated = { ...state.profile, struggledVocab: [] };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updated));
      return { profile: updated };
    });
  },

  equipCosmetic: (category, cosmeticId) => {
    set((state) => {
      const updated = {
        ...state.profile,
        equippedCosmetics: {
          ...state.profile.equippedCosmetics,
          [category]: cosmeticId
        }
      };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updated));
      return { profile: updated };
    });
  },

  getActiveNodes: () => {
    const lang = get().profile.selectedLanguage;
    switch (lang) {
      case 'ja': return JAPANESE_NODES;
      case 'en': return ENGLISH_NODES;
      case 'ko':
      default: return KOREAN_NODES;
    }
  },

  updatePersonalInfo: (info) => {
    set((state) => {
      const currentPersonalInfo = state.profile.personalInfo || DEFAULT_PROFILE.personalInfo!;
      const updatedPersonalInfo = {
        ...currentPersonalInfo,
        ...info
      };
      const updatedProfile: UserProfile = {
        ...state.profile,
        name: info.name || info.fullName || state.profile.name,
        personalInfo: updatedPersonalInfo
      };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updatedProfile));
      return { profile: updatedProfile };
    });
  }
}));

