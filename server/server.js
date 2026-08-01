const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'catalouge_million_dollar_secret';

app.use(cors());
app.use(express.json());

// In-Memory Fallback Seed Database for instant E2E execution
const db = {
  users: [
    {
      id: 'usr-1',
      email: 'learner@catalouge.app',
      passwordHash: bcrypt.hashSync('password123', 10),
      createdAt: new Date().toISOString()
    }
  ],
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
      content: 'Meow! Welcome to CATalouge AI Tutor! Ask me any grammar, vocabulary, or culture questions!'
    }
  ]
};

// Middleware: Authenticate JWT Token
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

// --- Auth Routes ---
app.post('/api/auth/register', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  const existing = db.users.find(u => u.email === email);
  if (existing) return res.status(400).json({ error: 'Email already registered' });

  const newUser = {
    id: 'usr-' + Date.now(),
    email,
    passwordHash: bcrypt.hashSync(password, 10),
    createdAt: new Date().toISOString()
  };
  db.users.push(newUser);

  const token = jwt.sign({ id: newUser.id, email: newUser.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: newUser.id, email: newUser.email } });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.email === email);
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email } });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ id: user.id, email: user.email });
});

// --- Lessons & Skill Tree Routes ---
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

// --- Voice Translator Routes ---
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

// --- Spaced Repetition (SM-2) Flashcard Review Routes ---
app.get('/api/review/items', (req, res) => {
  res.json({ items: db.savedPhrases });
});

app.post('/api/review/rate', (req, res) => {
  const { id, rating } = req.body; // rating: 'again' | 'hard' | 'good' | 'easy'
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

// --- Kleo State & Wardrobe Routes ---
app.get('/api/kleo/state', (req, res) => {
  res.json(db.kleoState['usr-1']);
});

app.post('/api/kleo/equip', (req, res) => {
  const { category, cosmeticId } = req.body;
  db.kleoState['usr-1'].equippedCosmetics[category] = cosmeticId;
  res.json({ success: true, equippedCosmetics: db.kleoState['usr-1'].equippedCosmetics });
});

// --- AI Chatbot Route ---
app.post('/api/chat/message', (req, res) => {
  const { message, currentLesson } = req.body;
  let reply = "Meow! That's a great language question!";

  if (message.toLowerCase().includes('formal') || message.toLowerCase().includes('polite')) {
    reply = "💡 **Grammar Tip**: In Korean, adding '~요' (~yo) creates friendly polite speech (존댓말), while '~입니다' (~imnida) is used in formal situations. In Japanese, 'です' (desu) and 'ます' (masu) serve the exact same polite purpose!";
  } else if (message.toLowerCase().includes('quiz')) {
    reply = "🎯 **Quick Quiz**: What is the Korean word for Cat?\nA) 강아지 (Gangaji)\nB) 고양이 (Goyangi)\nC) 새 (Sae)";
  } else {
    reply = `Regarding your query "${message}": Keep practicing your daily script lessons and flashcards! Kleo is cheering for you! 🐾`;
  }

  const responseMsg = {
    id: 'msg-' + Date.now(),
    role: 'assistant',
    content: reply
  };
  db.chatMessages.push(responseMsg);
  res.json(responseMsg);
});

app.listen(PORT, () => {
  console.log(`CATalouge Express API Server listening on port ${PORT}`);
});
