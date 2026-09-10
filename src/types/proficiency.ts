export interface Language {
  id: string;
  name: string;
  code: 'en' | 'ko' | 'ja' | string;
}

export interface ProficiencyLevel {
  id: string;
  languageId: string;
  code: string;
  name: string;
  order: number;
  description: string;
  lessonCount: number;
  hasQuiz: boolean;
  status: 'locked' | 'in_progress' | 'passed';
  bestScore: number | null;
  completedAt: string | null;
  isFinalLevel: boolean;
}

export interface LevelLesson {
  id: string;
  levelId: string;
  title: string;
  content: string;
  order: number;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  choices: string[];
}

export interface LevelQuiz {
  id: string;
  levelId: string;
  passThreshold: number;
  questions: QuizQuestion[];
}

export interface LevelDetail {
  id: string;
  languageId: string;
  languageName: string;
  languageCode: string;
  code: string;
  name: string;
  order: number;
  description: string;
  lessons: LevelLesson[];
  quiz: LevelQuiz | null;
}

export interface QuizSubmissionResult {
  passed: boolean;
  score: number;
  scorePercentage: number;
  passThreshold: number;
  correctCount: number;
  totalQuestions: number;
  isFinalLevel: boolean;
  results: {
    questionId: string;
    submitted?: string;
    correctAnswer: string;
    isCorrect: boolean;
  }[];
  certificate: EarnedCertificate | null;
}

export interface EarnedCertificate {
  id: string;
  userId: string;
  userName: string;
  languageId: string;
  languageName: string;
  languageCode: string;
  levelId: string;
  levelName: string;
  levelCode: string;
  issuedAt: string;
  certificateCode: string;
  pdfUrl: string;
}
