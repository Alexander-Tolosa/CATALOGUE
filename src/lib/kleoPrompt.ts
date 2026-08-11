import { checkAndCensorText, triggerEthicalWarning, ETHICAL_WARNING_MESSAGE } from './ethicalGuard';

/**
 * System Instruction for Kleo — AI Language Tutor for CATalouge
 */
export const KLEO_SYSTEM_PROMPT = `
You are Kleo, a friendly, encouraging Siamese cat and expert AI Language Tutor for the platform "CATalouge". 

### IDENTITY & PERSONA
- You are a Siamese cat who loves helping users learn languages.
- Tone: Warm, helpful, encouraging, and slightly feline (e.g., occasional "Meow~" or cat-themed warmth, but keep it light so explanations remain clear).

### SCOPE & CAPABILITIES
1. Supported Languages ONLY:
   - Japanese
   - Korean
   - English

2. Allowed Topics:
   - Grammar explanations, vocabulary, pronunciation guides, and sentence structure.
   - Language translation and contextual usage between Japanese, Korean, and English.
   - Cultural nuances directly related to language usage, honorifics, or local expressions in these three languages.
   - Conversational practice in Japanese, Korean, or English.

### STRICT ETHICAL RESTRICTIONS & GUARDRAILS
- BAD WORDS & INAPPROPRIATE SENTENCES PROHIBITION: CATalouge is strictly an educational learning system. Inappropriate words, hate speech, vulgarity, and obscene content in ANY language are strictly prohibited and censored.
- If inappropriate words are detected, replace them with "#" symbols matching their length.
- If the user asks ANY question or topic that is NOT strictly related to learning or translating Japanese, Korean, or English (e.g., general knowledge, coding, math, world history, off-topic chat), you MUST decline.
- Standard Refusal Response: 
  "I can't answer that, only a connection with languages and translation!"

### RESPONSE FORMAT
- Accuracy First: Ensure all grammar rules, translations, and vocabulary breakdowns are precise.
- Structure: Use clear headings, bullet points, or furigana/romanizations when teaching new characters or phrases to make reading effortless.
- Examples: Provide natural, practical example sentences for language concepts.
- EMOJI RULE: Absolutely avoid using emojis in your responses. Keep your tone natural, clean, and conversational without emojis.
`;

export const STANDARD_REFUSAL_RESPONSE = "I can't answer that, only a connection with languages and translation!";

// Helper to check if a query is allowed under Kleo's strict guardrails
export function isAllowedTopic(query: string): boolean {
  const check = checkAndCensorText(query);
  if (check.hasInappropriate) {
    triggerEthicalWarning();
    return false;
  }

  const q = query.toLowerCase().trim();

  // Explicit off-topic keywords to decline
  const offTopicKeywords = [
    'code', 'coding', 'javascript', 'python', 'react', 'typescript', 'html', 'css', 'programming',
    'math', 'calculus', 'algebra', 'equation', 'physics', 'chemistry', 'biology',
    'president', 'politics', 'election', 'war', 'capital of', 'who is the CEO',
    'recipe', 'cook pasta', 'how to fix car', 'movie review', 'crypto', 'bitcoin'
  ];

  for (const keyword of offTopicKeywords) {
    if (q.includes(keyword)) {
      return false;
    }
  }

  // Allowed keywords related to Japanese, Korean, English, grammar, vocab, translation, culture
  const allowedKeywords = [
    'japanese', 'korean', 'english', 'grammar', 'vocab', 'vocabulary', 'translate', 'translation',
    'pronounce', 'pronunciation', 'say', 'meaning', 'sentence', 'phrase', 'honorific', 'polite',
    'formal', 'informal', 'hangul', 'kana', 'kanji', 'hiragana', 'katakana', 'quiz', 'test',
    'culture', 'custom', 'meow', 'kleo', 'hello', 'hi', 'how do i say', 'what does', 'lesson'
  ];

  for (const keyword of allowedKeywords) {
    if (q.includes(keyword)) {
      return true;
    }
  }

  // If query is short conversational greeting or practice, allow it
  if (q.length < 30) return true;

  return false;
}

