export type LanguageTrack = 'ko' | 'ja' | 'en';

export type AppView = 'dashboard' | 'learn' | 'letters' | 'matching' | 'translator' | 'scanner' | 'kleo' | 'chatbot' | 'gamify' | 'review' | 'settings' | 'profile';

export type MatchingCategoryId = 'food' | 'things' | 'verbs' | 'basics';

export interface MatchingPair {
  id: string;
  sourceText: string;
  sourcePronunciation: string;
  targetText: string;
  targetSubText?: string;
  category: MatchingCategoryId;
}

export interface MatchingCategoryMeta {
  id: MatchingCategoryId;
  title: string;
  nativeTitle: string;
  description: string;
  icon: string;
  badgeColor: string;
  glowColor: string;
  totalWords: number;
  tags: string[];
}

export interface MatchingCardItem {
  id: string;
  pairId: string;
  type: 'source' | 'target'; // 'source' is foreign word + pronunciation (left col), 'target' is English (right col)
  mainText: string;
  subText: string;
  isMatched: boolean;
  isSelected: boolean;
  isShaking?: boolean;
}

export interface MatchingGameStats {
  moves: number;
  matchedPairs: number;
  totalPairs: number;
  timeSeconds: number;
  accuracy: number;
  stars: number;
  xpEarned: number;
}


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

export type FriendStatus = 'online' | 'offline' | 'in_lesson' | 'studying';

export interface FriendUser {
  id: string;
  name: string;
  avatarUrl?: string;
  avatarColor?: string;
  avatarInitials?: string;
  department: string;
  program: string;
  status: FriendStatus;
  statusMessage?: string;
  targetLanguage: LanguageTrack;
  level: number;
  streakDays: number;
  mutualFriendsCount?: number;
  isOnline: boolean;
  lastActive?: string;
  bio?: string;
  interests?: string[];
}

export interface FriendRequest {
  id: string;
  fromUser: FriendUser;
  timestamp: string;
  message?: string;
  status: 'pending' | 'accepted' | 'declined';
}

export interface FriendChatMessage {
  id: string;
  senderId: string; // 'current_user' or friend.id
  text: string;
  timestamp: string;
  isAudioSnippet?: boolean;
}

export interface CertificateAward {
  id: string;
  title: string;
  course: string;
  awardedDate: string;
  issuer: string;
  grade?: string;
  certificateNumber: string;
  skillsCovered: string[];
}

export interface BadgeAward {
  id: string;
  title: string;
  course: string;
  awardedDate: string;
  iconType: 'badge' | 'star' | 'trophy' | 'medal';
  iconColor: string;
  description: string;
}

export interface UserPersonalInfo {
  fullName: string;
  studentId: string;
  department: string;
  program: string;
  yearLevel: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  bio: string;
  joinedDate: string;
  lastActivity: string;
}

export interface ActiveSession {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
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
  personalInfo?: UserPersonalInfo;
};

