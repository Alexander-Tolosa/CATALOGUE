import { LessonNode } from '../types';

export const KOREAN_FOUNDATIONS = {
  title: "Hangul (한글) Block-Building Logic",
  subtitle: "Learn how consonants and vowels combine into syllable blocks",
  consonants: [
    { char: 'ㄱ', name: 'Giyeok', sound: 'g/k', strokeGuide: "Top left to right, then down" },
    { char: 'ㄴ', name: 'Nieun', sound: 'n', strokeGuide: "Down then right" },
    { char: 'ㄷ', name: 'Digeut', sound: 'd/t', strokeGuide: "Top bar, then down and right" },
    { char: 'ㄹ', name: 'Rieul', sound: 'r/l', strokeGuide: "Z-shaped stroke" },
    { char: 'ㅁ', name: 'Mieum', sound: 'm', strokeGuide: "Four-sided box" },
    { char: 'ㅂ', name: 'Bieup', sound: 'b/p', strokeGuide: "Two vertical bars, two horizontal" },
    { char: 'ㅅ', name: 'Siot', sound: 's', strokeGuide: "Inverted V shape" },
    { char: 'ㅇ', name: 'Ieung', sound: 'silent/ng', strokeGuide: "Counter-clockwise circle" }
  ],
  vowels: [
    { char: 'ㅏ', name: 'A', sound: 'ah', direction: 'vertical' },
    { char: 'ㅓ', name: 'EO', sound: 'uh', direction: 'vertical' },
    { char: 'ㅗ', name: 'O', sound: 'oh', direction: 'horizontal' },
    { char: 'ㅜ', name: 'U', sound: 'oo', direction: 'horizontal' },
    { char: 'ㅣ', name: 'I', sound: 'ee', direction: 'vertical' }
  ],
  sampleBlocks: [
    { block: '가', consonant: 'ㄱ', vowel: 'ㅏ', meaning: 'Go', roman: 'ga' },
    { block: '나', consonant: 'ㄴ', vowel: 'ㅏ', meaning: 'I / Me', roman: 'na' },
    { block: '다', consonant: 'ㄷ', vowel: 'ㅏ', meaning: 'All', roman: 'da' },
    { block: '우', consonant: 'ㅇ', vowel: 'ㅜ', meaning: 'Up / Rain', roman: 'u' }
  ]
};

export const KOREAN_NODES: LessonNode[] = [
  {
    id: 'ko-node-1',
    title: 'Hangul Foundations',
    description: 'Master consonants, vowels, and syllable block building',
    type: 'letters',
    unit: 1,
    order: 1,
    xpReward: 20,
    isUnlocked: true,
    isCompleted: false,
    exercises: [
      {
        id: 'ko-ex-1',
        type: 'tracing',
        prompt: 'Trace the consonant "ㄱ" (Giyeok)',
        targetScript: 'ㄱ',
        romanization: 'g / k',
        explanation: 'ㄱ sounds like "g" at the beginning of a word and "k" at the end.',
        correctAnswer: 'ㄱ'
      },
      {
        id: 'ko-ex-2',
        type: 'multiple-choice',
        prompt: 'Which vowel makes the "ah" sound?',
        options: ['ㅏ', 'ㅓ', 'ㅗ', 'ㅜ'],
        correctAnswer: 'ㅏ',
        explanation: 'ㅏ is pronounced "ah" like in "father".'
      },
      {
        id: 'ko-ex-3',
        type: 'sentence-assembly',
        prompt: 'Assemble the block for "ga" (ㄱ + ㅏ)',
        options: ['ㄱ', 'ㅏ', 'ㄴ'],
        correctAnswer: ['ㄱ', 'ㅏ'],
        explanation: 'Combining ㄱ (g) and ㅏ (a) forms the syllable block 가 (ga).'
      },
      {
        id: 'ko-ex-4',
        type: 'listening',
        prompt: 'Listen and select the correct character: "Ieung" (Silent/NG)',
        audioText: 'ㅇ',
        options: ['ㅇ', 'ㅁ', 'ㄴ', 'ㄹ'],
        correctAnswer: 'ㅇ',
        explanation: 'ㅇ acts as a silent placeholder before vowels or "ng" at the bottom.'
      }
    ]
  },
  {
    id: 'ko-node-2',
    title: 'Basic Words',
    description: 'Learn essential Korean greetings and everyday words',
    type: 'words',
    unit: 1,
    order: 2,
    xpReward: 25,
    isUnlocked: false,
    isCompleted: false,
    exercises: [
      {
        id: 'ko-ex-5',
        type: 'multiple-choice',
        prompt: 'What does "안녕하세요" (Annyeonghaseyo) mean?',
        targetScript: '안녕하세요',
        romanization: 'Annyeonghaseyo',
        options: ['Hello', 'Thank you', 'Goodbye', 'Delicious'],
        correctAnswer: 'Hello',
        culturalNote: '안녕하세요 is the standard polite greeting used throughout Korea.'
      },
      {
        id: 'ko-ex-6',
        type: 'multiple-choice',
        prompt: 'Select the Korean word for "Cat"',
        options: ['고양이 (Goyangi)', '강아지 (Gangaji)', '새 (Sae)', '호랑이 (Horangi)'],
        correctAnswer: '고양이 (Goyangi)',
        explanation: '고양이 (Goyangi) is Korean for cat — just like Kleo!'
      },
      {
        id: 'ko-ex-7',
        type: 'sentence-assembly',
        prompt: 'Build the phrase: "Thank you"',
        options: ['감사', '합니다', '안녕', '반가워요'],
        correctAnswer: ['감사', '합니다'],
        explanation: '감사합니다 (Gamsahamnida) is the polite way to express thanks.'
      }
    ]
  },
  {
    id: 'ko-node-3',
    title: 'Short Phrases & Politeness',
    description: 'Understand polite endings and common expressions',
    type: 'phrases',
    unit: 2,
    order: 3,
    xpReward: 30,
    isUnlocked: false,
    isCompleted: false,
    exercises: [
      {
        id: 'ko-ex-8',
        type: 'multiple-choice',
        prompt: 'Which polite ending is added to informal sentences?',
        options: ['~요 (~yo)', '~입니다 (~imnida)', '~지 (~ji)', '~다 (~da)'],
        correctAnswer: '~요 (~yo)',
        culturalNote: 'Adding ~요 to standard verb stems turns casual speech into friendly, polite speech.'
      },
      {
        id: 'ko-ex-9',
        type: 'speaking',
        prompt: 'Say "맛있어요" (It is delicious!)',
        targetScript: '맛있어요',
        romanization: 'Mas-iss-eoyo',
        audioText: '맛있어요',
        correctAnswer: '맛있어요',
        explanation: 'Use this whenever you eat great Korean food!'
      }
    ]
  },
  {
    id: 'ko-node-4',
    title: 'Full Sentences & Dialogues',
    description: 'Construct complete Korean sentences and practice conversations',
    type: 'sentences',
    unit: 2,
    order: 4,
    xpReward: 35,
    isUnlocked: false,
    isCompleted: false,
    exercises: [
      {
        id: 'ko-ex-10',
        type: 'sentence-assembly',
        prompt: 'Assemble: "I am a student" (저는 학생입니다)',
        options: ['저는', '학생입니다', '고양이', '감사합니다'],
        correctAnswer: ['저는', '학생입니다'],
        explanation: '저 (I) + 는 (topic marker) + 학생 (student) + 입니다 (is/am).'
      }
    ]
  }
];
