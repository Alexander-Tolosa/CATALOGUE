import { LessonNode } from '../types';

export const ENGLISH_FOUNDATIONS = {
  title: "English Alphabet, Phonics & Sound Pairings",
  subtitle: "Learn letter pronunciations and phonics combinations",
  vowels: [
    { char: 'A', sound: 'ay / ah', example: 'Apple' },
    { char: 'E', sound: 'ee / eh', example: 'Elephant' },
    { char: 'I', sound: 'eye / ih', example: 'Igloo' },
    { char: 'O', sound: 'oh / aw', example: 'Octopus' },
    { char: 'U', sound: 'yoo / uh', example: 'Umbrella' }
  ],
  phonics: [
    { combo: 'TH', sound: 'Unvoiced / Voiced', example: 'Think, This' },
    { combo: 'SH', sound: 'Soft sh', example: 'Shine, Ship' },
    { combo: 'CH', sound: 'Tch sound', example: 'Chair, Chat' }
  ]
};

export const ENGLISH_NODES: LessonNode[] = [
  {
    id: 'en-node-1',
    title: 'Alphabet & Phonics',
    description: 'Master letters, vowels, and essential phonics rules',
    type: 'letters',
    unit: 1,
    order: 1,
    xpReward: 20,
    isUnlocked: true,
    isCompleted: false,
    exercises: [
      {
        id: 'en-ex-1',
        type: 'multiple-choice',
        prompt: 'Which word starts with the short "A" sound?',
        options: ['Apple', 'Eagle', 'Ice', 'Open'],
        correctAnswer: 'Apple',
        explanation: 'Apple begins with the short "A" sound (/æ/).'
      },
      {
        id: 'en-ex-2',
        type: 'listening',
        prompt: 'Listen and select the word with "TH" sound',
        audioText: 'Think',
        options: ['Think', 'Sink', 'Pink', 'Wink'],
        correctAnswer: 'Think',
        explanation: '"TH" requires placing your tongue lightly between your teeth.'
      }
    ]
  },
  {
    id: 'en-node-2',
    title: 'Everyday Words & Greetings',
    description: 'Learn common English expressions and everyday vocabulary',
    type: 'words',
    unit: 1,
    order: 2,
    xpReward: 25,
    isUnlocked: false,
    isCompleted: false,
    exercises: [
      {
        id: 'en-ex-3',
        type: 'sentence-assembly',
        prompt: 'Assemble: "How are you today?"',
        options: ['How', 'are', 'you', 'today?'],
        correctAnswer: ['How', 'are', 'you', 'today?'],
        explanation: 'Standard friendly greeting in English conversations.'
      }
    ]
  }
];
