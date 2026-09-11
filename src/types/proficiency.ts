export interface Language {
  id: string;
  name: string;
  code: 'en' | 'ko' | 'ja' | string;
}

export interface CourseSyllabusModule {
  weekOrUnit: string;
  title: string;
  topics: string[];
}

export interface OnlineCourse {
  id: string;
  levelId: string;
  languageCode: 'en' | 'ko' | 'ja' | string;
  levelCode: string;
  levelName: string;
  title: string;
  provider: string; // e.g. 'Yonsei University (Coursera)', 'British Council'
  institution: string; // e.g. 'Yonsei University Korean Language Institute'
  instructor?: string; // e.g. 'Prof. Seung Hae Kang'
  courseType: 'MOOC' | 'Accredited Standard' | 'Interactive Public Broadcast' | 'Open Educational Resource';
  sourceUrl: string; // Original canonical website URL
  thumbnail?: string;
  duration: string; // e.g. '5 Weeks (12 Hours)'
  rating: number; // e.g. 4.9
  reviewCount: number;
  description: string;
  learningPoints: string[];
  syllabus: CourseSyllabusModule[];
  license: string; // e.g. 'Educational Fair Use Reference © Yonsei University'
  attributionStatement: string; // Anti-plagiarism credibility credit
}

export interface LanguageCitationsSummary {
  ownerName: string;
  institution: string;
  platform: string;
  language: 'en' | 'ko' | 'ja' | string;
  levelCodes: string[];
  courseTitles: string[];
  sourceUrl: string;
  license: string;
  plagiarismDisclosure: string;
}

export interface ProficiencyLevel {
  id: string;
  languageId: string;
  code: string;
  name: string;
  order: number;
  description: string;
  lessonCount: number;
  courseCount?: number;
  courses?: OnlineCourse[];
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
  courses?: OnlineCourse[];
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
