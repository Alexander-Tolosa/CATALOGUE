import { LessonNode } from '../types';

export const JAPANESE_FOUNDATIONS = {
  title: "Japanese Writing Systems (Hiragana, Katakana & Kanji)",
  subtitle: "Master complete 46 Hiragana, 46 Katakana syllabaries, and essential Kanji radicals",
  hiraganaVowels: [
    // Vowels
    { char: 'あ', romaji: 'a' },
    { char: 'い', romaji: 'i' },
    { char: 'う', romaji: 'u' },
    { char: 'え', romaji: 'e' },
    { char: 'お', romaji: 'o' },
    // K-row
    { char: 'か', romaji: 'ka' },
    { char: 'き', romaji: 'ki' },
    { char: 'く', romaji: 'ku' },
    { char: 'け', romaji: 'ke' },
    { char: 'こ', romaji: 'ko' },
    // S-row
    { char: 'さ', romaji: 'sa' },
    { char: 'し', romaji: 'shi' },
    { char: 'す', romaji: 'su' },
    { char: 'せ', romaji: 'se' },
    { char: 'そ', romaji: 'so' },
    // T-row
    { char: 'た', romaji: 'ta' },
    { char: 'ち', romaji: 'chi' },
    { char: 'つ', romaji: 'tsu' },
    { char: 'て', romaji: 'te' },
    { char: 'と', romaji: 'to' },
    // N-row
    { char: 'な', romaji: 'na' },
    { char: 'に', romaji: 'ni' },
    { char: 'ぬ', romaji: 'nu' },
    { char: 'ね', romaji: 'ne' },
    { char: 'の', romaji: 'no' },
    // H-row
    { char: 'は', romaji: 'ha' },
    { char: 'ひ', romaji: 'hi' },
    { char: 'ふ', romaji: 'fu' },
    { char: 'へ', romaji: 'he' },
    { char: 'ほ', romaji: 'ho' },
    // M-row
    { char: 'ま', romaji: 'ma' },
    { char: 'み', romaji: 'mi' },
    { char: 'む', romaji: 'mu' },
    { char: 'め', romaji: 'me' },
    { char: 'も', romaji: 'mo' },
    // Y-row
    { char: 'や', romaji: 'ya' },
    { char: 'ゆ', romaji: 'yu' },
    { char: 'よ', romaji: 'yo' },
    // R-row
    { char: 'ら', romaji: 'ra' },
    { char: 'り', romaji: 'ri' },
    { char: 'る', romaji: 'ru' },
    { char: 'れ', romaji: 're' },
    { char: 'ろ', romaji: 'ro' },
    // W-row & N
    { char: 'わ', romaji: 'wa' },
    { char: 'を', romaji: 'wo' },
    { char: 'ん', romaji: 'n' }
  ],
  katakanaVowels: [
    // Vowels
    { char: 'ア', romaji: 'a' },
    { char: 'イ', romaji: 'i' },
    { char: 'ウ', romaji: 'u' },
    { char: 'エ', romaji: 'e' },
    { char: 'オ', romaji: 'o' },
    // K-row
    { char: 'カ', romaji: 'ka' },
    { char: 'キ', romaji: 'ki' },
    { char: 'ク', romaji: 'ku' },
    { char: 'ケ', romaji: 'ke' },
    { char: 'コ', romaji: 'ko' },
    // S-row
    { char: 'サ', romaji: 'sa' },
    { char: 'シ', romaji: 'shi' },
    { char: 'ス', romaji: 'su' },
    { char: 'セ', romaji: 'se' },
    { char: 'ソ', romaji: 'so' },
    // T-row
    { char: 'タ', romaji: 'ta' },
    { char: 'チ', romaji: 'chi' },
    { char: 'ツ', romaji: 'tsu' },
    { char: 'テ', romaji: 'te' },
    { char: 'ト', romaji: 'to' },
    // N-row
    { char: 'ナ', romaji: 'na' },
    { char: 'ニ', romaji: 'ni' },
    { char: 'ヌ', romaji: 'nu' },
    { char: 'ネ', romaji: 'ne' },
    { char: 'ノ', romaji: 'no' },
    // H-row
    { char: 'ハ', romaji: 'ha' },
    { char: 'ヒ', romaji: 'hi' },
    { char: 'フ', romaji: 'fu' },
    { char: 'ヘ', romaji: 'he' },
    { char: 'ホ', romaji: 'ho' },
    // M-row
    { char: 'マ', romaji: 'ma' },
    { char: 'ミ', romaji: 'mi' },
    { char: 'ム', romaji: 'mu' },
    { char: 'メ', romaji: 'me' },
    { char: 'モ', romaji: 'mo' },
    // Y-row
    { char: 'ヤ', romaji: 'ya' },
    { char: 'ユ', romaji: 'yu' },
    { char: 'ヨ', romaji: 'yo' },
    // R-row
    { char: 'ラ', romaji: 'ra' },
    { char: 'リ', romaji: 'ri' },
    { char: 'ル', romaji: 'ru' },
    { char: 'レ', romaji: 're' },
    { char: 'ロ', romaji: 'ro' },
    // W-row & N
    { char: 'ワ', romaji: 'wa' },
    { char: 'ヲ', romaji: 'wo' },
    { char: 'ン', romaji: 'n' }
  ],
  kanjiRadicals: [
    { char: '日', meaning: 'Sun / Day', onyomi: 'Nichi / Jitsu', kunyomi: 'Hi' },
    { char: '月', meaning: 'Moon / Month', onyomi: 'Getsu / Gatsu', kunyomi: 'Tsuki' },
    { char: '木', meaning: 'Tree / Wood', onyomi: 'Moku / Boku', kunyomi: 'Ki' },
    { char: '水', meaning: 'Water', onyomi: 'Sui', kunyomi: 'Mizu' },
    { char: '火', meaning: 'Fire', onyomi: 'Ka', kunyomi: 'Hi' },
    { char: '土', meaning: 'Earth / Soil', onyomi: 'To / Do', kunyomi: 'Tsuchi' },
    { char: '人', meaning: 'Person / Human', onyomi: 'Jin / Nin', kunyomi: 'Hito' },
    { char: '山', meaning: 'Mountain', onyomi: 'San', kunyomi: 'Yama' },
    { char: '川', meaning: 'River', onyomi: 'Sen', kunyomi: 'Kawa' },
    { char: '田', meaning: 'Rice Field', onyomi: 'Den', kunyomi: 'Ta' }
  ]
};

export const JAPANESE_NODES: LessonNode[] = [
  {
    id: 'ja-node-1',
    title: 'Hiragana & Katakana Foundations',
    description: 'Learn complete Hiragana and Katakana character syllabaries',
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
      }
    ]
  }
];
