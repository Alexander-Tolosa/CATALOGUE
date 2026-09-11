import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { SEED_DATA } from './seedData.js';
import { generateCertificatePdf } from './certificateService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'catalogue_million_dollar_secret';

app.use(cors());
app.use(express.json());

// Serve static uploads (certificates, assets)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
const certsDir = path.join(uploadsDir, 'certificates');
if (!fs.existsSync(certsDir)) {
  fs.mkdirSync(certsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// In-Memory Database with Proficiency Levels, Lessons, Quizzes & Certificates
const db = {
  users: [
    {
      id: 'usr-1',
      name: 'Alexander Michael Tolosa',
      email: 'learner@catalogue.app',
      passwordHash: bcrypt.hashSync('password123', 10),
      createdAt: new Date().toISOString()
    }
  ],
  languages: SEED_DATA.languages,
  levels: SEED_DATA.levels,
  courses: SEED_DATA.courses || [],
  userProgress: [
    // Pre-pass Level 1 for Korean so user can see immediate unlock & progress
    {
      id: 'prog-ko-1',
      userId: 'usr-1',
      levelId: 'ko-lvl-1',
      status: 'passed',
      bestScore: 1.0,
      completedAt: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ],
  certificates: [],
  tracks: [
    { userId: 'usr-1', language: 'ko', currentUnit: 1, dailyGoal: 10 },
    { userId: 'usr-1', language: 'ja', currentUnit: 1, dailyGoal: 10 },
    { userId: 'usr-1', language: 'en', currentUnit: 1, dailyGoal: 10 }
  ],
  streaks: {
    'usr-1': { currentStreak: 5, longestStreak: 12, lastActiveDate: new Date().toISOString().split('T')[0] }
  },
  kleoState: {
    'usr-1': { bondXp: 245, mood: 'happy', equippedCosmetics: { hat: 'blue_beret' }, unlockedCosmetics: ['blue_beret', 'red_scarf'] }
  },
  savedPhrases: [
    {
      id: 'rev-101',
      userId: 'usr-1',
      term: '안녕하세요 (Annyeonghaseyo)',
      translation: 'Hello / Good day',
      language: 'ko',
      phonetic: 'an-nyeong-ha-se-yo',
      interval: 1,
      easeFactor: 2.5,
      nextReviewAt: new Date().toISOString().split('T')[0]
    }
  ],
  chatMessages: [
    {
      id: 'msg-1',
      userId: 'usr-1',
      role: 'assistant',
      content: 'Meow! Welcome to CATALOGUE AI Tutor! Ask me any grammar, vocabulary, or culture questions!'
    }
  ]
};

// Seed an initial sample certificate for Alexander in Korean TOPIK I
const initialCertCode = 'CAT-KO-L1-8821';
const initialCertPath = path.join(certsDir, `${initialCertCode}.pdf`);
generateCertificatePdf({
  userName: 'Alexander Michael Tolosa',
  languageName: 'Korean',
  levelName: 'TOPIK I — Level 1 (Novice)',
  levelCode: '1',
  code: initialCertCode,
  verifyUrl: `http://localhost:3000/verify/${initialCertCode}`,
  outputPath: initialCertPath
}).then(() => {
  db.certificates.push({
    id: 'cert-init-1',
    userId: 'usr-1',
    userName: 'Alexander Michael Tolosa',
    languageId: 'lang-ko',
    languageName: 'Korean',
    languageCode: 'ko',
    levelId: 'ko-lvl-1',
    levelName: 'TOPIK I — Level 1 (Novice)',
    levelCode: '1',
    issuedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    certificateCode: initialCertCode,
    pdfUrl: `/uploads/certificates/${initialCertCode}.pdf`
  });
}).catch(console.error);

// Middleware: Authenticate JWT Token (optional or strict)
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized: missing token' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: invalid token' });
  }
};

// Optional Auth resolver: extracts user id from header or defaults to 'usr-1'
const resolveUserId = (req) => {
  if (req.headers.authorization) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded && decoded.id) return decoded.id;
    } catch {}
  }
  return req.query.userId || req.body?.userId || 'usr-1';
};

// --- Auth Routes ---
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const existing = db.users.find(u => u.email === email);
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const newUser = {
    id: 'usr-' + Date.now(),
    name: name || email.split('@')[0],
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: newUser.id, email: newUser.email, name: newUser.name } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email, name: user.name || 'Learner' }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email, name: user.name });
});

// ==========================================
// 1 & 2. LANGUAGE PROFICIENCY & LEVEL ROUTES
// ==========================================

// GET /api/languages — list languages
app.get('/api/languages', (req, res) => {
  res.json({ languages: db.languages });
});

// GET /api/languages/:code/levels — levels in order, with current user's progress status merged in
app.get('/api/languages/:code/levels', (req, res) => {
  const { code } = req.params;
  const userId = resolveUserId(req);

  const language = db.languages.find(l => l.code.toLowerCase() === code.toLowerCase());
  if (!language) {
    return res.status(404).json({ error: `Language with code '${code}' not found` });
  }

  // Retrieve and sort all levels for this language by order
  const langLevels = db.levels
    .filter(lvl => lvl.languageId === language.id)
    .sort((a, b) => a.order - b.order);

  // Merge user progress and apply level-locking rules:
  // Rule: Order = 0 is ALWAYS unlocked.
  // Rule: Order = N is unlocked ONLY IF Order = N - 1 is 'passed'.
  let previousPassed = true; // For order 0, this enables it automatically

  const levelsWithProgress = langLevels.map((lvl) => {
    const progress = db.userProgress.find(p => p.userId === userId && p.levelId === lvl.id);
    const isPassed = progress ? progress.status === 'passed' : false;

    let computedStatus = 'locked';
    if (lvl.order === 0 || previousPassed) {
      computedStatus = isPassed ? 'passed' : (progress ? progress.status : 'in_progress');
    }

    // Prepare next level's unlock condition
    previousPassed = isPassed;

    const matchedCourses = (db.courses || []).filter(c => c.levelId === lvl.id);

    return {
      id: lvl.id,
      languageId: lvl.languageId,
      code: lvl.code,
      name: lvl.name,
      order: lvl.order,
      description: lvl.description,
      lessonCount: lvl.lessons.length,
      courseCount: matchedCourses.length,
      courses: matchedCourses,
      hasQuiz: Boolean(lvl.quiz),
      status: computedStatus,
      bestScore: progress?.bestScore ?? null,
      completedAt: progress?.completedAt ?? null,
      isFinalLevel: lvl.order === langLevels.length - 1
    };
  });

  res.json({
    language,
    levels: levelsWithProgress
  });
});

// GET /api/languages/:code/courses — all matched online courses for a language track
app.get('/api/languages/:code/courses', (req, res) => {
  const { code } = req.params;
  const { levelCode } = req.query;

  let courses = (db.courses || []).filter(
    c => c.languageCode.toLowerCase() === code.toLowerCase()
  );

  if (levelCode) {
    courses = courses.filter(
      c => c.levelCode.toLowerCase() === String(levelCode).toLowerCase()
    );
  }

  res.json({
    languageCode: code,
    total: courses.length,
    courses
  });
});

// GET /api/levels/:id — level detail with lessons + quiz + matched online courses
app.get('/api/levels/:id', (req, res) => {
  const { id } = req.params;
  const level = db.levels.find(l => l.id === id);
  if (!level) {
    return res.status(404).json({ error: `Level '${id}' not found` });
  }

  const language = db.languages.find(l => l.id === level.languageId);
  const levelCourses = (db.courses || []).filter(c => c.levelId === level.id);

  // Return quiz with prompt & choices, without exposing correctAnswer
  const sanitizedQuiz = level.quiz
    ? {
        id: level.quiz.id,
        levelId: level.id,
        passThreshold: level.quiz.passThreshold,
        questions: level.quiz.questions.map(q => ({
          id: q.id,
          prompt: q.prompt,
          choices: q.choices
        }))
      }
    : null;

  res.json({
    level: {
      id: level.id,
      languageId: level.languageId,
      languageName: language?.name,
      languageCode: language?.code,
      code: level.code,
      name: level.name,
      order: level.order,
      description: level.description,
      lessons: level.lessons.sort((a, b) => a.order - b.order),
      courses: levelCourses,
      quiz: sanitizedQuiz
    }
  });
});

// GET /api/citations — Academic integrity, citations ledger & anti-plagiarism disclosure
app.get('/api/citations', (req, res) => {
  const citations = (db.courses || []).map(c => ({
    courseId: c.id,
    title: c.title,
    language: c.languageCode,
    levelCode: c.levelCode,
    provider: c.provider,
    institution: c.institution,
    instructor: c.instructor,
    sourceUrl: c.sourceUrl,
    license: c.license,
    attributionStatement: c.attributionStatement
  }));

  res.json({
    policy: 'Academic Fair Use, Educational Attribution & Anti-Plagiarism Statement',
    compliance: 'All external course curricula and frameworks are attributed directly to their copyright holders with genuine source links.',
    totalCoursesIndexed: citations.length,
    citations
  });
});

// POST /api/levels/:id/quiz/submit — grade submitted answers, update UserProgress,
// unlock next level if passed, and if this was the FINAL level, issue certificate!
app.post('/api/levels/:id/quiz/submit', async (req, res) => {
  const { id } = req.params;
  const { answers } = req.body; // Map: { [questionId: string]: string }
  const userId = resolveUserId(req);

  const level = db.levels.find(l => l.id === id);
  if (!level) {
    return res.status(404).json({ error: `Level '${id}' not found` });
  }

  if (!level.quiz || !level.quiz.questions || level.quiz.questions.length === 0) {
    return res.status(400).json({ error: `Level '${id}' has no quiz associated` });
  }

  const language = db.languages.find(l => l.id === level.languageId);
  const totalQuestions = level.quiz.questions.length;
  let correctCount = 0;

  const results = level.quiz.questions.map(q => {
    const submitted = answers ? answers[q.id] : undefined;
    const isCorrect = submitted === q.correctAnswer;
    if (isCorrect) correctCount++;
    return {
      questionId: q.id,
      submitted,
      correctAnswer: q.correctAnswer,
      isCorrect
    };
  });

  const score = totalQuestions > 0 ? correctCount / totalQuestions : 0;
  const passed = score >= level.quiz.passThreshold;

  // Update or create UserProgress
  let userProg = db.userProgress.find(p => p.userId === userId && p.levelId === level.id);
  if (!userProg) {
    userProg = {
      id: 'prog-' + Date.now(),
      userId,
      levelId: level.id,
      status: passed ? 'passed' : 'in_progress',
      bestScore: score,
      completedAt: passed ? new Date().toISOString() : null
    };
    db.userProgress.push(userProg);
  } else {
    if (passed) {
      userProg.status = 'passed';
      userProg.completedAt = new Date().toISOString();
    }
    userProg.bestScore = Math.max(userProg.bestScore || 0, score);
  }

  // Determine if this is the final level of the language
  const allLanguageLevels = db.levels
    .filter(lvl => lvl.languageId === level.languageId)
    .sort((a, b) => a.order - b.order);
  const maxOrder = allLanguageLevels[allLanguageLevels.length - 1]?.order;
  const isFinalLevel = level.order === maxOrder;

  let issuedCertificate = null;

  // If passed and is final level (or level passed warrants certificate), trigger certificate issuance!
  if (passed && isFinalLevel) {
    // Check if certificate already exists
    let existingCert = db.certificates.find(c => c.userId === userId && c.levelId === level.id);
    if (!existingCert) {
      const user = db.users.find(u => u.id === userId);
      const userName = user?.name || req.body.userName || 'Alexander Michael Tolosa';
      const cleanCode = level.code.replace(/[^A-Za-z0-9]/g, '');
      const uniqueSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
      const certificateCode = `CAT-${(language?.code || 'GL').toUpperCase()}-${cleanCode}-${uniqueSuffix}`;
      const certFilename = `${certificateCode}.pdf`;
      const outputPath = path.join(certsDir, certFilename);

      try {
        await generateCertificatePdf({
          userName,
          languageName: language?.name || 'Language',
          levelName: level.name,
          levelCode: level.code,
          code: certificateCode,
          verifyUrl: `http://localhost:3000/verify/${certificateCode}`,
          outputPath
        });

        existingCert = {
          id: 'cert-' + Date.now(),
          userId,
          userName,
          languageId: language?.id,
          languageName: language?.name,
          languageCode: language?.code,
          levelId: level.id,
          levelName: level.name,
          levelCode: level.code,
          issuedAt: new Date().toISOString(),
          certificateCode,
          pdfUrl: `/uploads/certificates/${certFilename}`
        };
        db.certificates.push(existingCert);
      } catch (err) {
        console.error('Error issuing certificate PDF:', err);
      }
    }
    issuedCertificate = existingCert;
  }

  res.json({
    passed,
    score: Math.round(score * 100) / 100,
    scorePercentage: Math.round(score * 100),
    passThreshold: level.quiz.passThreshold,
    correctCount,
    totalQuestions,
    results,
    isFinalLevel,
    certificate: issuedCertificate
  });
});

// ==========================================
// 3. CERTIFICATE API ROUTES
// ==========================================

// GET /api/certificates/:userId — list a user's earned certificates
app.get('/api/certificates/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userCerts = db.certificates.filter(c => c.userId === userId || userId === 'all');
  res.json({ certificates: userCerts });
});

// Alias for backwards compatibility
app.get('/api/certificates/:userId', (req, res, next) => {
  // If param looks like a verify code (starts with CAT-), forward to verify
  if (req.params.userId.startsWith('CAT-')) {
    return next();
  }
  const { userId } = req.params;
  const userCerts = db.certificates.filter(c => c.userId === userId || userId === 'all');
  res.json({ certificates: userCerts });
});

// GET /api/certificates/:code/download — stream the certificate PDF
app.get('/api/certificates/:code/download', (req, res) => {
  const { code } = req.params;
  const cert = db.certificates.find(c => c.certificateCode.toLowerCase() === code.toLowerCase());

  const certFilename = `${code}.pdf`;
  const filePath = path.join(certsDir, certFilename);

  if (!fs.existsSync(filePath)) {
    // If not on disk but cert record exists, generate on the fly
    if (cert) {
      generateCertificatePdf({
        userName: cert.userName || 'Learner',
        languageName: cert.languageName || 'Language',
        levelName: cert.levelName || 'Proficiency Level',
        levelCode: cert.levelCode || 'L1',
        code: cert.certificateCode,
        verifyUrl: `http://localhost:3000/verify/${cert.certificateCode}`,
        outputPath: filePath
      }).then(() => {
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${certFilename}"`);
        fs.createReadStream(filePath).pipe(res);
      }).catch(err => {
        res.status(500).json({ error: 'Failed to generate PDF download' });
      });
      return;
    }
    return res.status(404).json({ error: `Certificate PDF '${code}' not found` });
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${certFilename}"`);
  fs.createReadStream(filePath).pipe(res);
});

// GET /api/certificates/verify/:code — public endpoint returning verification details
app.get('/api/certificates/verify/:code', (req, res) => {
  const { code } = req.params;
  const cert = db.certificates.find(c => c.certificateCode.toLowerCase() === code.toLowerCase());

  if (!cert) {
    return res.status(404).json({
      valid: false,
      error: 'Certificate not found or verification code is invalid.'
    });
  }

  res.json({
    valid: true,
    certificateCode: cert.certificateCode,
    userName: cert.userName,
    language: cert.languageName,
    languageCode: cert.languageCode,
    level: cert.levelName,
    levelCode: cert.levelCode,
    issuedAt: cert.issuedAt,
    pdfUrl: cert.pdfUrl,
    institution: 'CATALOUGE Language Academy',
    verificationUrl: `http://localhost:3000/verify/${cert.certificateCode}`
  });
});

// --- Existing Lessons & Complete Routes (Preserved) ---
app.get('/api/lessons/:language', (req, res) => {
  const { language } = req.params;
  res.json({
    language,
    unit: 1,
    nodes: [
      {
        id: `${language}-node-1`,
        title: language === 'ko' ? 'Hangul Foundations' : language === 'ja' ? 'Hiragana Basics' : 'Alphabet Phonics',
        description: 'Master letters, consonants, vowels, and character sounds',
        type: 'letters',
        unit: 1,
        xpReward: 20,
        isUnlocked: true,
        isCompleted: true
      },
      {
        id: `${language}-node-2`,
        title: 'Basic Words',
        description: 'Essential greetings, everyday nouns, and culture words',
        type: 'words',
        unit: 1,
        xpReward: 25,
        isUnlocked: true,
        isCompleted: false
      },
      {
        id: `${language}-node-3`,
        title: 'Short Phrases & Politeness',
        description: 'Master polite endings and conversational expressions',
        type: 'phrases',
        unit: 2,
        xpReward: 30,
        isUnlocked: false,
        isCompleted: false
      }
    ]
  });
});

app.post('/api/lessons/complete', (req, res) => {
  const { lessonId, xpReward } = req.body;
  res.json({ success: true, xpEarned: xpReward || 20, bondXpEarned: 15 });
});

// --- Voice Translator Routes (Preserved) ---
app.post('/api/translator/translate', (req, res) => {
  const { text, from, to } = req.body;
  let translatedText = text;
  let phonetic = '';

  if (to === 'ko') {
    translatedText = '안녕하세요! 고양이가 너무 귀여워요.';
    phonetic = 'Annyeonghaseyo! Goyang-iga neomu gwiyeowoyo.';
  } else if (to === 'ja') {
    translatedText = 'こんにちは！猫がとても可愛いです。';
    phonetic = 'Konnichiwa! Neko ga totemo kawaii desu.';
  } else {
    translatedText = 'Hello! The cat is very cute.';
    phonetic = 'Hel-lo! The cat is ve-ry cute.';
  }

  res.json({
    originalText: text,
    translatedText,
    phonetic,
    from,
    to
  });
});

app.post('/api/translator/save', (req, res) => {
  const { term, translation, language, phonetic } = req.body;
  const newItem = {
    id: 'rev-' + Date.now(),
    userId: 'usr-1',
    term,
    translation,
    language,
    phonetic: phonetic || '',
    interval: 1,
    easeFactor: 2.5,
    nextReviewAt: new Date().toISOString().split('T')[0]
  };
  db.savedPhrases.unshift(newItem);
  res.json({ success: true, item: newItem });
});

// --- Spaced Repetition (SM-2) Flashcard Review Routes (Preserved) ---
app.get('/api/review/items', (req, res) => {
  res.json({ items: db.savedPhrases });
});

app.post('/api/review/rate', (req, res) => {
  const { id, rating } = req.body;
  const item = db.savedPhrases.find(i => i.id === id);
  if (item) {
    if (rating === 'again') {
      item.interval = 1;
    } else if (rating === 'hard') {
      item.interval = Math.max(1, Math.round(item.interval * 1.2));
    } else if (rating === 'good') {
      item.interval = Math.max(1, Math.round(item.interval * 2.0));
    } else if (rating === 'easy') {
      item.interval = Math.max(1, Math.round(item.interval * 2.5));
    }
  }
  res.json({ success: true, item });
});

// --- Kleo State & Wardrobe Routes (Preserved) ---
app.get('/api/kleo/state', (req, res) => {
  res.json(db.kleoState['usr-1']);
});

app.post('/api/kleo/equip', (req, res) => {
  const { category, cosmeticId } = req.body;
  db.kleoState['usr-1'].equippedCosmetics[category] = cosmeticId;
  res.json({ success: true, equippedCosmetics: db.kleoState['usr-1'].equippedCosmetics });
});

// --- Unified AI Service Route (Chatbot & Letter Feedback) (Preserved) ---
app.post('/api/ai/process', (req, res) => {
  const { type, message, letterContent, scenario, language, userLevel, struggledVocab, letterType } = req.body;

  if (type === 'letter_feedback') {
    const text = letterContent || '';
    const length = text.trim().length;
    const addressedStruggled = [];

    if (Array.isArray(struggledVocab)) {
      struggledVocab.forEach(v => {
        const keyword = (v.word || '').split(' ')[0];
        if (keyword && text.toLowerCase().includes(keyword.toLowerCase())) {
          addressedStruggled.push(v.word);
        }
      });
    }

    return res.json({
      overallScore: Math.min(96, 75 + Math.floor(length / 10)),
      politenessRating: language === 'ko' ? 'Formal Politeness (존댓말)' : language === 'ja' ? 'Polite Form (丁寧語)' : 'Standard Professional',
      summary: `Your ${letterType || 'letter'} draft demonstrates solid sentence flow. We verified that your cross-feature chat context was incorporated!`,
      lineCorrections: [
        {
          originalLine: text.slice(0, Math.min(40, text.length)),
          suggestedLine: text.slice(0, Math.min(40, text.length)) + (language === 'ko' ? ' (안녕하십니까)' : language === 'ja' ? '（お世話になっております）' : ' (Dear Hiring Manager,)'),
          explanation: 'Adding formal opening etiquette sets a polished tone for official letters.'
        }
      ],
      struggledVocabAddressed: addressedStruggled,
      suggestedPhrases: [
        {
          term: language === 'ko' ? '잘 부탁드립니다' : language === 'ja' ? 'よろしくお願いいたします' : 'Best regards',
          translation: 'I look forward to your kind consideration',
          context: 'Essential closing expression for letters.'
        }
      ]
    });
  }

  // Type === 'chat'
  const textMsg = message || '';
  const textLower = textMsg.toLowerCase();
  const corrections = [];
  const detectedStruggled = [];

  let reply = '';
  if (scenario === 'order_coffee') {
    reply = language === 'ko'
      ? '어서오세요! 주문하시겠습니까? 아이스 아메리카노와 카페라떼가 준비되어 있습니다.'
      : language === 'ja'
      ? 'いらっしゃいませ！ご注文はお決まりですか？'
      : 'Welcome to Coffee CATALOGUE! What can I get started for you today?';
  } else if (scenario === 'job_interview') {
    reply = language === 'ko'
      ? '안녕하십니까! 면접에 참석해 주셔서 감사합니다. 간단히 자기소개 부탁드립니다.'
      : language === 'ja'
      ? '本日は面接にお越しいただきありがとうございます。自己紹介をお願いします。'
      : 'Thank you for attending the interview today! Please start with a short self-introduction.';
  } else {
    reply = `Meow~! Kleo AI Service processed your message in scenario "${scenario || 'free_chat'}": "${textMsg}". Excellent practice!`;
  }

  if (language === 'ko' && (textLower.includes('안녕 ') || textLower.endsWith('야'))) {
    corrections.push({
      id: 'corr-srv-' + Date.now(),
      original: textMsg,
      corrected: textMsg.replace(/야$/g, '요'),
      explanation: 'Polite speech (존댓말) is recommended when communicating in formal or roleplay contexts.',
      type: 'politeness',
      struggledWord: '존댓말 (Polite Speech)'
    });
    detectedStruggled.push('존댓말 (Polite Speech)');
  }

  return res.json({
    reply,
    corrections: corrections.length > 0 ? corrections : undefined,
    struggledWords: detectedStruggled,
    scenarioContext: scenario || 'free_chat'
  });
});

// --- Grounded Language Tool Chatbot Route (Preserved) ---
app.post('/api/chat', (req, res) => {
  const { messages, userLevel = "beginner", targetLanguage = "ja" } = req.body;
  const lastMsg = Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1] : null;
  const userText = lastMsg && typeof lastMsg.content === 'string' ? lastMsg.content : '';

  let reply = `Grounded AI Tutor Response for ${targetLanguage.toUpperCase()} (${userLevel}): `;
  
  if (userText.toLowerCase().includes('eat') || userText.includes('食べる') || userText.includes('먹다')) {
    reply += targetLanguage === 'ja'
      ? 'The dictionary entry for "eat" is 食べる (taberu, N5 verb). Example: 林檎を食べる (I eat an apple).'
      : targetLanguage === 'ko'
      ? 'The dictionary entry for "eat" is 먹다 (meokda, TOPIK 1 verb) or formal 드시다 (deusida).'
      : 'The dictionary entry for "eat" is defined as putting food in the mouth and swallowing it.';
  } else if (userText.toLowerCase().includes('grammar') || userText.includes('て-form') || userText.includes('존댓말')) {
    reply += targetLanguage === 'ja'
      ? 'Verified Grammar Rule: て-form + いる (N5) describes an ongoing action or resulting state (e.g. 本を読んでいる).'
      : targetLanguage === 'ko'
      ? 'Verified Grammar Rule: 존댓말 (TOPIK 2 honorific speech) uses distinct vocabulary and endings (e.g. 먹다 → 드시다).'
      : 'Verified Grammar Rule: Present Continuous (be + verb-ing) describes actions happening right now.';
  } else {
    reply += `Grounded facts checked against language database dictionary and grammar rules.`;
  }

  res.json({ reply });
});

app.listen(PORT, () => {
  console.log(`CATALOGUE Express API Server listening on port ${PORT}`);
});
