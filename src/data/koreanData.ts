import { LessonNode } from '../types';

export const KOREAN_FOUNDATIONS = {
  title: "Hangul (한글) Syllables & Alphabet",
  subtitle: "Master all 40 Korean consonants, vowels, double consonants & compound vowels",
  consonants: [
    { char: 'ㄱ', name: 'Giyeok', sound: 'g', strokeGuide: "Top left to right, then down" },
    { char: 'ㄴ', name: 'Nieun', sound: 'n', strokeGuide: "Down then right" },
    { char: 'ㄷ', name: 'Digeut', sound: 'd', strokeGuide: "Top bar, then down and right" },
    { char: 'ㄹ', name: 'Rieul', sound: 'r', strokeGuide: "Z-shaped stroke" },
    { char: 'ㅁ', name: 'Mieum', sound: 'm', strokeGuide: "Four-sided box" },
    { char: 'ㅂ', name: 'Bieup', sound: 'b', strokeGuide: "Two vertical bars, two horizontal" },
    { char: 'ㅅ', name: 'Siot', sound: 's', strokeGuide: "Inverted V shape" },
    { char: 'ㅇ', name: 'Ieung', sound: 'ng', strokeGuide: "Counter-clockwise circle" },
    { char: 'ㅈ', name: 'Jieut', sound: 'j', strokeGuide: "Top bar over inverted V" },
    { char: 'ㅊ', name: 'Chieut', sound: 'ch', strokeGuide: "Top dot over Jieut" },
    { char: 'ㅋ', name: 'Kieuk', sound: 'k', strokeGuide: "Giyeok with middle horizontal bar" },
    { char: 'ㅌ', name: 'Tieut', sound: 't', strokeGuide: "Digeut with middle horizontal bar" },
    { char: 'ㅍ', name: 'Pieup', sound: 'p', strokeGuide: "Top/bottom bars with two vertical lines" },
    { char: 'ㅎ', name: 'Hieut', sound: 'h', strokeGuide: "Top line & dot over circle" },
    // Double Consonants
    { char: 'ㄲ', name: 'Ssang-giyeok', sound: 'kk', strokeGuide: "Double Giyeok" },
    { char: 'ㄸ', name: 'Ssang-digeut', sound: 'tt', strokeGuide: "Double Digeut" },
    { char: 'ㅃ', name: 'Ssang-bieup', sound: 'pp', strokeGuide: "Double Bieup" },
    { char: 'ㅆ', name: 'Ssang-siot', sound: 'ss', strokeGuide: "Double Siot" },
    { char: 'ㅉ', name: 'Ssang-jieut', sound: 'jj', strokeGuide: "Double Jieut" }
  ],
  vowels: [
    { char: 'ㅏ', name: 'A', sound: 'a', direction: 'vertical' },
    { char: 'ㅐ', name: 'AE', sound: 'ae', direction: 'vertical' },
    { char: 'ㅑ', name: 'YA', sound: 'ya', direction: 'vertical' },
    { char: 'ㅒ', name: 'YAE', sound: 'yae', direction: 'vertical' },
    { char: 'ㅓ', name: 'EO', sound: 'eo', direction: 'vertical' },
    { char: 'ㅔ', name: 'E', sound: 'e', direction: 'vertical' },
    { char: 'ㅕ', name: 'YEO', sound: 'yeo', direction: 'vertical' },
    { char: 'ㅖ', name: 'YE', sound: 'ye', direction: 'vertical' },
    { char: 'ㅗ', name: 'O', sound: 'o', direction: 'horizontal' },
    { char: 'ㅘ', name: 'WA', sound: 'wa', direction: 'compound' },
    { char: 'ㅙ', name: 'WAE', sound: 'wae', direction: 'compound' },
    { char: 'ㅚ', name: 'OE', sound: 'oe', direction: 'compound' },
    { char: 'ㅛ', name: 'YO', sound: 'yo', direction: 'horizontal' },
    { char: 'ㅜ', name: 'U', sound: 'u', direction: 'horizontal' },
    { char: 'ㅝ', name: 'WO', sound: 'wo', direction: 'compound' },
    { char: 'ㅞ', name: 'WE', sound: 'we', direction: 'compound' },
    { char: 'ㅟ', name: 'WI', sound: 'wi', direction: 'compound' },
    { char: 'ㅠ', name: 'YU', sound: 'yu', direction: 'horizontal' },
    { char: 'ㅡ', name: 'EU', sound: 'eu', direction: 'horizontal' },
    { char: 'ㅢ', name: 'UI', sound: 'ui', direction: 'compound' },
    { char: 'ㅣ', name: 'I', sound: 'i', direction: 'vertical' }
  ],
  sampleBlocks: [
    { block: '가', consonant: 'ㄱ', vowel: 'ㅏ', meaning: 'Go', roman: 'ga' },
    { block: '나', consonant: 'ㄴ', vowel: 'ㅏ', meaning: 'I / Me', roman: 'na' },
    { block: '다', consonant: 'ㄷ', vowel: 'ㅏ', meaning: 'All', roman: 'da' },
    { block: '라', consonant: 'ㄹ', vowel: 'ㅏ', meaning: 'Net', roman: 'ra' },
    { block: '마', consonant: 'ㅁ', vowel: 'ㅏ', meaning: 'Hemp / Yam', roman: 'ma' },
    { block: '바', consonant: 'ㅂ', vowel: 'ㅏ', meaning: 'Sea / Bar', roman: 'ba' },
    { block: '사', consonant: 'ㅅ', vowel: 'ㅏ', meaning: 'Four / Buy', roman: 'sa' },
    { block: '아', consonant: 'ㅇ', vowel: 'ㅏ', meaning: 'Ah / Child', roman: 'a' },
    { block: '자', consonant: 'ㅈ', vowel: 'ㅏ', meaning: 'Ruler / Sleep', roman: 'ja' },
    { block: '차', consonant: 'ㅊ', vowel: 'ㅏ', meaning: 'Car / Tea', roman: 'cha' },
    { block: '카', consonant: 'ㅋ', vowel: 'ㅏ', meaning: 'Card / Car', roman: 'ka' },
    { block: '타', consonant: 'ㅌ', vowel: 'ㅏ', meaning: 'Ride', roman: 'ta' },
    { block: '파', consonant: 'ㅍ', vowel: 'ㅏ', meaning: 'Green onion', roman: 'pa' },
    { block: '하', consonant: 'ㅎ', vowel: 'ㅏ', meaning: 'Lower / Sun', roman: 'ha' }
  ]
};

export const KOREAN_NODES: LessonNode[] = [
  {
    id: 'ko-node-1',
    title: 'Hangul Foundations',
    description: 'Master all 40 consonants, vowels, and syllable block building',
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
        explanation: 'ㅏ is pronounced "a" as in "father".'
      }
    ]
  }
];
