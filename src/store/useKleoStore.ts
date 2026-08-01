import { create } from 'zustand';
import { KleoMood } from '../types';

interface KleoStoreState {
  mood: KleoMood;
  speechText: string;
  bondXp: number;
  bondLevel: number;
  equippedCosmetics: {
    hat?: string;
    scarf?: string;
    glasses?: string;
    skin?: string;
  };
  unlockedCosmetics: string[];
  react: (event: 'correct' | 'error' | 'streak' | 'lapsed' | 'celebrate' | 'welcome' | 'petting') => void;
  equipCosmetic: (category: 'hat' | 'scarf' | 'glasses' | 'skin', cosmeticId?: string) => void;
  addBondXp: (amount: number) => void;
  petKleo: () => void;
}

export const useKleoStore = create<KleoStoreState>((set, get) => ({
  mood: 'happy',
  speechText: "Meow! Welcome back! Ready to master a new script today?",
  bondXp: 245,
  bondLevel: 5,
  equippedCosmetics: { hat: 'blue_beret' },
  unlockedCosmetics: ['blue_beret', 'red_scarf', 'cat_glasses'],

  react: (event) => {
    switch (event) {
      case 'petting':
        set((state) => ({
          mood: 'nuzzling',
          speechText: "Purrrrrr! 🐾 Kleo loves being petted! Comfort level 100%!",
          bondXp: state.bondXp + 5,
          bondLevel: Math.floor((state.bondXp + 5) / 50) + 1
        }));
        break;
      case 'correct':
        set({
          mood: 'happy',
          speechText: "Purr-fect! Excellent answer!"
        });
        break;
      case 'error':
        set({
          mood: 'nuzzling',
          speechText: "No worries! Mistakes are just steps toward mastery! 🐾"
        });
        break;
      case 'streak':
        set({
          mood: 'celebrating',
          speechText: "🎉 Incredible! You reached a new streak milestone!"
        });
        break;
      case 'lapsed':
        set({
          mood: 'curious',
          speechText: "Kleo missed you! Let meow-tivate you with a quick refresher lesson!"
        });
        break;
      case 'celebrate':
        set({
          mood: 'celebrating',
          speechText: "🌟 Phenomenal work! Lesson completed!"
        });
        break;
      case 'welcome':
      default:
        set({
          mood: 'happy',
          speechText: "Meow! Welcome back! Ready for today's lesson?"
        });
        break;
    }
  },

  equipCosmetic: (category, cosmeticId) => {
    set((state) => ({
      equippedCosmetics: {
        ...state.equippedCosmetics,
        [category]: cosmeticId
      }
    }));
  },

  addBondXp: (amount) => {
    set((state) => {
      const nextXp = state.bondXp + amount;
      const nextLevel = Math.floor(nextXp / 50) + 1;
      return { bondXp: nextXp, bondLevel: nextLevel };
    });
  },

  petKleo: () => {
    get().react('petting');
  }
}));
