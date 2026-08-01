import { LessonNode } from '../types';

export const JAPANESE_FOUNDATIONS = {
  title: "Japanese Writing Systems (Hiragana, Katakana & Kanji)",
  subtitle: "Master character strokes, syllabaries, and essential radicals",
  hiraganaVowels: [
    { char: 'あ', romaji: 'a', strokeGuide: 'Horizontal top stroke, vertical loop, curved swoop' },
    { char: 'い', romaji: 'i', strokeGuide: 'Two vertical curved strokes' },
    { char: 'う', romaji: 'u', strokeGuide: 'Top short stroke, curve below' },
    { char: 'え', romaji: 'e', strokeGuide: 'Top dash, Z-like stroke' },
    { char: 'お', romaji: 'o', strokeGuide: 'Horizontal bar, vertical cross with loop, top right dot' }
  ],
  katakanaVowels: [
    { char: 'ア', romaji: 'a' },
    { char: 'イ', romaji: 'i' },
    { char: 'ウ', romaji: 'u' },
    { char: 'エ', romaji: 'e' },
    { char: 'オ', romaji: 'o' }
  ],
  kanjiRadicals: [
    { char: '日', meaning: 'Sun / Day', onyomi: 'Nichi / Jitsu', kunyomi: 'Hi' },
    { char: '月', meaning: 'Moon / Month', onyomi: 'Getsu / Gatsu', kunyomi: 'Tsuki' },
    { char: '木', meaning: 'Tree / Wood', onyomi: 'Moku / Boku', kunyomi: 'Ki' },
    { char: '水', meaning: 'Water', onyomi: 'Sui', kunyomi: 'Mizu' }
  ]
};

export const JAPANESE_NODES: LessonNode[] = [
  {
    id: 'ja-node-1',
    title: 'Hiragana & Katakana Foundations',
    description: 'Learn the primary Japanese phonetic characters',
    type: 'letters',
    unit: 1,
    order: 1,
    xpReward: 20,
    isUnlocked: true,
    isCompleted: false,
    exercises: [
      {
        id: 'ja-ex-1',
        type: 'tracing',
        prompt: 'Trace the Hiragana character "あ" (A)',
        targetScript: 'あ',
        romanization: 'a',
        explanation: 'あ is the first vowel in the Hiragana syllabary.',
        correctAnswer: 'あ'
      },
      {
        id: 'ja-ex-2',
        type: 'multiple-choice',
        prompt: 'Select the romaji for "ねこ" (Neko)',
        targetScript: 'ねこ',
        options: ['Neko (Cat)', 'Inu (Dog)', 'Tori (Bird)', 'Sakana (Fish)'],
        correctAnswer: 'Neko (Cat)',
        explanation: 'ねこ (Neko) is the Japanese word for Cat!'
      },
      {
        id: 'ja-ex-3',
        type: 'listening',
        prompt: 'Listen and select the character for "i"',
        audioText: 'い',
        options: ['い', 'あ', 'う', 'お'],
        correctAnswer: 'い',
        explanation: 'い consists of two vertical curved strokes.'
      }
    ]
  },
  {
    id: 'ja-node-2',
    title: 'Essential Kanji & Vocabulary',
    description: 'Discover core Kanji radicals and basic nouns',
    type: 'words',
    unit: 1,
    order: 2,
    xpReward: 25,
    isUnlocked: false,
    isCompleted: false,
    exercises: [
      {
        id: 'ja-ex-4',
        type: 'multiple-choice',
        prompt: 'What does the Kanji "日" mean?',
        targetScript: '日',
        romanization: 'Nichi / Hi',
        options: ['Sun / Day', 'Moon', 'Tree', 'Water'],
        correctAnswer: 'Sun / Day',
        culturalNote: '日 is used in 日本 (Nihon / Japan), meaning "Origin of the Sun".'
      },
      {
        id: 'ja-ex-5',
        type: 'sentence-assembly',
        prompt: 'Assemble: "Good Morning" (おはようございます)',
        options: ['おはよう', 'ございます', 'こんにちは', 'ありがとう'],
        correctAnswer: ['おはよう', 'ございます'],
        explanation: 'おはようございます (Ohayou gozaimasu) is the polite morning greeting.'
      }
    ]
  },
  {
    id: 'ja-node-3',
    title: 'Phrases & Politeness (Desu / Masu)',
    description: 'Master polite sentence structures in Japanese',
    type: 'phrases',
    unit: 2,
    order: 3,
    xpReward: 30,
    isUnlocked: false,
    isCompleted: false,
    exercises: [
      {
        id: 'ja-ex-6',
        type: 'speaking',
        prompt: 'Say "ありがとうございます" (Thank you very much)',
        targetScript: 'ありがとうございます',
        romanization: 'Arigatou gozaimasu',
        audioText: 'ありがとうございます',
        correctAnswer: 'ありがとうございます',
        explanation: 'Used to express polite gratitude in Japanese.'
      }
    ]
  }
];
