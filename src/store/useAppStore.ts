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
    username: 'xxsenxx9438',
    statusMessage: "Food you're craving now?",
    pronouns: "Iced Latte'",
    roleBadge: '⚡ GDev',
    privateNote: '',
    connections: [
      { id: 'c1', platform: 'github', username: 'alexander-tolosa' },
      { id: 'c2', platform: 'discord', username: 'lexzunder#9438' }
    ],
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
    bio: 'Tell us a bit about you',
    joinedDate: 'Jun 24, 2021',
    lastActivity: '3 hours ago',
    recentAvatars: [
      "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%2338BDF8'/><path d='M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z' fill='%2310B981'/><rect x='44' y='52' width='12' height='18' fill='%238D5B4C'/><ellipse cx='50' cy='46' rx='16' ry='18' fill='%238D5B4C'/><path d='M 44 54 Q 50 60 56 54' stroke='%23FFFFFF' stroke-width='2.5' stroke-linecap='round' fill='none'/><path d='M 33 42 C 33 28 42 22 50 22 C 58 22 67 28 67 42 C 67 33 60 28 50 28 C 40 28 33 33 33 42 Z' fill='%231F2937'/></svg>",
      "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%2310B981'/><path d='M 20 92 C 20 74 35 66 50 66 C 65 66 80 74 80 92 Z' fill='%23064E3B'/><rect x='44' y='50' width='12' height='18' fill='%23C68642'/><ellipse cx='50' cy='44' rx='16' ry='18' fill='%23C68642'/><circle cx='43' cy='43' r='4' stroke='%23F59E0B' stroke-width='1.5' fill='none'/><circle cx='57' cy='43' r='4' stroke='%23F59E0B' stroke-width='1.5' fill='none'/><line x1='47' y1='43' x2='53' y2='43' stroke='%23F59E0B' stroke-width='1.5'/><path d='M 45 52 Q 50 56 55 52' stroke='%23FFFFFF' stroke-width='2' stroke-linecap='round' fill='none'/><path d='M 32 38 C 32 24 42 18 50 18 C 58 18 68 24 68 38 C 68 30 60 25 50 25 C 40 25 32 30 32 38 Z' fill='%23451A03'/></svg>",
      "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%23EC4899'/><path d='M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z' fill='%23831843'/><rect x='44' y='52' width='12' height='18' fill='%23FBD5BD'/><ellipse cx='50' cy='46' rx='16' ry='18' fill='%23FBD5BD'/><circle cx='43' cy='44' r='2.5' fill='%23831843'/><circle cx='57' cy='44' r='2.5' fill='%23831843'/><path d='M 45 53 Q 50 57 55 53' stroke='%23E11D48' stroke-width='2' stroke-linecap='round' fill='none'/><path d='M 30 40 C 30 20 40 16 50 16 C 60 16 70 20 70 40 C 74 55 72 70 72 70 C 66 58 66 45 66 40 C 60 30 40 30 34 40 C 34 45 34 58 28 70 C 28 70 26 55 30 40 Z' fill='%23F472B6'/></svg>",
      "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%230F172A'/><path d='M 20 92 C 20 72 34 65 50 65 C 66 65 80 72 80 92 Z' fill='%231E293B'/><rect x='44' y='52' width='12' height='18' fill='%23D1D5DB'/><ellipse cx='50' cy='46' rx='16' ry='18' fill='%23E5E7EB'/><rect x='36' y='40' width='28' height='8' rx='2' fill='%2306B6D4' stroke='%2322D3EE' stroke-width='1.5'/><circle cx='43' cy='44' r='2' fill='%23FFFFFF'/><circle cx='57' cy='44' r='2' fill='%23FFFFFF'/><path d='M 45 54 H 55' stroke='%2306B6D4' stroke-width='2'/><path d='M 32 36 L 40 18 L 50 26 L 60 18 L 68 36 Z' fill='%23F43F5E'/></svg>",
      "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%23F97316'/><path d='M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z' fill='%237C2D12'/><rect x='44' y='52' width='12' height='18' fill='%23E0A96D'/><ellipse cx='50' cy='46' rx='16' ry='18' fill='%23E0A96D'/><path d='M 44 54 Q 50 59 56 54' stroke='%23FFFFFF' stroke-width='2' fill='none'/><path d='M 32 40 C 32 25 40 20 50 20 C 60 20 68 25 68 40 C 68 32 60 27 50 27 C 40 27 32 32 32 40 Z' fill='%2318181B'/></svg>",
      "data:image/svg+xml;utf8,<svg viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'><circle cx='50' cy='50' r='50' fill='%238B5CF6'/><path d='M 22 92 C 22 75 35 68 50 68 C 65 68 78 75 78 92 Z' fill='%234C1D95'/><rect x='44' y='52' width='12' height='18' fill='%23FDE68A'/><ellipse cx='50' cy='46' rx='16' ry='18' fill='%23FDE68A'/><circle cx='34' cy='44' r='5' fill='%23DDD6FE' stroke='%23A78BFA' stroke-width='1.5'/><circle cx='66' cy='44' r='5' fill='%23DDD6FE' stroke='%23A78BFA' stroke-width='1.5'/><path d='M 34 40 C 34 26 66 26 66 40' stroke='%23DDD6FE' stroke-width='2.5' fill='none'/></svg>"
    ]
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
  interfaceLanguage: LanguageTrack;
  setInterfaceLanguage: (lang: LanguageTrack) => void;
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

  interfaceLanguage: (() => {
    const saved = localStorage.getItem('catalogue_interface_language');
    if (saved === 'ko' || saved === 'ja' || saved === 'en') return saved;
    const profileSaved = localStorage.getItem('catalogue_user_profile');
    if (profileSaved) {
      try {
        const parsed = JSON.parse(profileSaved);
        if (parsed.interfaceLanguage) return parsed.interfaceLanguage;
      } catch {}
    }
    return 'en';
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

  setInterfaceLanguage: (lang) => {
    localStorage.setItem('catalogue_interface_language', lang);
    set((state) => {
      const updated = { ...state.profile, interfaceLanguage: lang };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updated));
      return { interfaceLanguage: lang, profile: updated };
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
      let recentAvatars = info.recentAvatars || currentPersonalInfo.recentAvatars || DEFAULT_PROFILE.personalInfo!.recentAvatars || [];

      if (info.avatarUrl && typeof info.avatarUrl === 'string' && !recentAvatars.includes(info.avatarUrl)) {
        recentAvatars = [info.avatarUrl, ...recentAvatars.filter(u => u !== info.avatarUrl)].slice(0, 6);
      }

      const updatedPersonalInfo = {
        ...currentPersonalInfo,
        ...info,
        recentAvatars
      };
      const updatedProfile: UserProfile = {
        ...state.profile,
        name: info.name || info.fullName || state.profile.name,
        avatarUrl: info.avatarUrl !== undefined ? info.avatarUrl : (updatedPersonalInfo.avatarUrl || state.profile.avatarUrl),
        bannerUrl: info.bannerUrl !== undefined ? info.bannerUrl : (updatedPersonalInfo.bannerUrl || state.profile.bannerUrl),
        personalInfo: updatedPersonalInfo
      };
      localStorage.setItem('catalogue_user_profile', JSON.stringify(updatedProfile));

      // Also sync with googleUser if stored
      try {
        const savedGoogle = localStorage.getItem('catalogue_google_user');
        if (savedGoogle) {
          const parsedGoogle = JSON.parse(savedGoogle);
          parsedGoogle.name = updatedProfile.name;
          if (updatedProfile.avatarUrl) {
            parsedGoogle.picture = updatedProfile.avatarUrl;
          }
          localStorage.setItem('catalogue_google_user', JSON.stringify(parsedGoogle));
        }
      } catch (e) {
        console.error(e);
      }

      return { profile: updatedProfile };
    });
  }
}));

