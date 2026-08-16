export type LanguageTrack = 'ko' | 'ja' | 'en';

export type AppView = 'dashboard' | 'learn' | 'letters' | 'translator' | 'scanner' | 'kleo' | 'chatbot' | 'gamify' | 'review' | 'settings';

export type UserLifecycleState = 'new' | 'returning' | 'lapsed';

export type KleoMood = 'happy' | 'curious' | 'encouraging' | 'nuzzling' | 'celebrating' | 'sleepy';

export type CosmeticCategory = 'hat' | 'scarf' | 'glasses' | 'skin';

export type CosmeticItem = {
  id: string;
  name: string;
  category: CosmeticCategory;
  icon: string;
  requiredBondLevel: number;
};

export type ExerciseType = 'tracing' | 'multiple-choice' | 'listening' | 'sentence-assembly' | 'speaking';

export type Exercise = {
  id: string;
  type: ExerciseType;
  prompt: string;
  targetScript?: string;
  romanization?: string;
  audioText?: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
  culturalNote?: string;
};

export type LessonNode = {
  id: string;
  title: string;
  description: string;
  type: 'letters' | 'words' | 'phrases' | 'sentences' | 'dialogue';
  unit: number;
  order: number;
  xpReward: number;
  isUnlocked: boolean;
  isCompleted: boolean;
  exercises: Exercise[];
};

export type ReviewItem = {
  id: string;
  term: string;
  translation: string;
  language: LanguageTrack;
  phonetic?: string;
  interval: number; // days
  easeFactor: number; // SM-2 ease factor
  nextReviewAt: string; // YYYY-MM-DD
};

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  isEarned: boolean;
};

export type ChatScenario = 'free_chat' | 'order_coffee' | 'job_interview' | 'hotel_checkin' | 'airport_customs';

export interface InlineCorrection {
  id: string;
  original: string;
  corrected: string;
  explanation: string;
  type: 'grammar' | 'vocab' | 'politeness' | 'spelling';
  struggledWord?: string;
}

export interface AIChatResponse {
  reply: string;
  corrections?: InlineCorrection[];
  struggledWords?: string[];
  scenarioContext?: string;
}

export interface AILetterFeedbackResponse {
  overallScore: number;
  politenessRating: string;
  summary: string;
  lineCorrections: Array<{
    originalLine: string;
    suggestedLine: string;
    explanation: string;
  }>;
  struggledVocabAddressed: string[];
  suggestedPhrases: Array<{
    term: string;
    translation: string;
    context: string;
  }>;
}

export interface StruggledWordItem {
  word: string;
  language: LanguageTrack;
  context?: string;
  timestamp: string;
}

export type UserProfile = {
  name: string;
  lifecycleState: UserLifecycleState;
  selectedLanguage: LanguageTrack;
  dailyGoalMinutes: number;
  minutesCompletedToday: number;
  xp: number;
  level: number;
  streakDays: number;
  lastStudyDate: string;
  studyDatesHistory: string[];
  hearts: number;
  maxHearts: number;
  completedNodeIds: string[];
  equippedCosmetics: {
    hat?: string;
    scarf?: string;
    glasses?: string;
    skin?: string;
  };
  savedPhrases: ReviewItem[];
  struggledVocab?: StruggledWordItem[];
};

