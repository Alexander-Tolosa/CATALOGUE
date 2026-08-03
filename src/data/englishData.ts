import { LessonNode } from '../types';

export const ENGLISH_FOUNDATIONS = {
  title: "English Alphabet & Pronunciation (A-Z)",
  subtitle: "Master all 26 letters with official IPA phonetic pronunciations and phonics",
  alphabet: [
    { char: 'A', lowerChar: 'a', ipa: '[eɪ]', sound: 'ei', example: 'Apple' },
    { char: 'B', lowerChar: 'b', ipa: '[bi:]', sound: 'bee', example: 'Ball' },
    { char: 'C', lowerChar: 'c', ipa: '[si:]', sound: 'see', example: 'Cat' },
    { char: 'D', lowerChar: 'd', ipa: '[di:]', sound: 'dee', example: 'Dog' },
    { char: 'E', lowerChar: 'e', ipa: '[i:]', sound: 'ee', example: 'Elephant' },
    { char: 'F', lowerChar: 'f', ipa: '[ef]', sound: 'ef', example: 'Fish' },
    { char: 'G', lowerChar: 'g', ipa: '[dʒi:]', sound: 'jee', example: 'Giraffe' },
    { char: 'H', lowerChar: 'h', ipa: '[eɪtʃ]', sound: 'aitch', example: 'House' },
    { char: 'I', lowerChar: 'i', ipa: '[aɪ]', sound: 'eye', example: 'Igloo' },
    { char: 'J', lowerChar: 'j', ipa: '[dʒeɪ]', sound: 'jay', example: 'Jelly' },
    { char: 'K', lowerChar: 'k', ipa: '[keɪ]', sound: 'kay', example: 'Kangaroo' },
    { char: 'L', lowerChar: 'l', ipa: '[el]', sound: 'el', example: 'Lion' },
    { char: 'M', lowerChar: 'm', ipa: '[em]', sound: 'em', example: 'Monkey' },
    { char: 'N', lowerChar: 'n', ipa: '[en]', sound: 'en', example: 'Nest' },
    { char: 'O', lowerChar: 'o', ipa: '[əʊ]', sound: 'oh', example: 'Octopus' },
    { char: 'P', lowerChar: 'p', ipa: '[pi:]', sound: 'pee', example: 'Penguin' },
    { char: 'Q', lowerChar: 'q', ipa: '[kju:]', sound: 'cue', example: 'Queen' },
    { char: 'R', lowerChar: 'r', ipa: '[ɑ:]', sound: 'ar', example: 'Rabbit' },
    { char: 'S', lowerChar: 's', ipa: '[es]', sound: 'es', example: 'Sun' },
    { char: 'T', lowerChar: 't', ipa: '[ti:]', sound: 'tee', example: 'Tiger' },
    { char: 'U', lowerChar: 'u', ipa: '[ju:]', sound: 'yoo', example: 'Umbrella' },
    { char: 'V', lowerChar: 'v', ipa: '[vi:]', sound: 'vee', example: 'Violin' },
    { char: 'W', lowerChar: 'w', ipa: "['dʌbəlju:]", sound: 'double-u', example: 'Whale' },
    { char: 'X', lowerChar: 'x', ipa: '[eks]', sound: 'eks', example: 'Xylophone' },
    { char: 'Y', lowerChar: 'y', ipa: '[waɪ]', sound: 'why', example: 'Yak' },
    { char: 'Z', lowerChar: 'z', ipa: '[zed/zi:]', sound: 'zee', example: 'Zebra' }
  ],
  phonics: [
    { combo: 'TH', sound: 'Unvoiced / Voiced', example: 'Think, This' },
    { combo: 'SH', sound: 'Soft sh', example: 'Shine, Ship' },
    { combo: 'CH', sound: 'Tch sound', example: 'Chair, Chat' },
    { combo: 'PH', sound: 'F sound', example: 'Phone, Photo' },
    { combo: 'WH', sound: 'W sound', example: 'Whale, White' }
  ]
};

export const ENGLISH_NODES: LessonNode[] = [
  {
    id: 'en-node-1',
    title: 'Alphabet & Phonics',
    description: 'Master all 26 English letters, IPA pronunciations, and phonics',
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
        prompt: 'Which word starts with the letter "A"?',
        options: ['Apple', 'Eagle', 'Ice', 'Open'],
        correctAnswer: 'Apple',
        explanation: 'Apple begins with the letter A [eɪ].'
      }
    ]
  }
];
