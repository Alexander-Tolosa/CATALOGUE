/**
 * Ethical Restriction & Multi-Language Word Censorship Engine for CATALOGUE
 * Prohibits inappropriate words and sentences across English, Korean, Japanese, etc.
 * Replaces characters in detected bad words with the '#' symbol.
 */

// Multi-language dictionary of inappropriate, profanity, and offensive terms
export const BAD_WORDS_DICTIONARY = [
  // --- English Profanities & Bad Words ---
  'fuck', 'fucking', 'fucker', 'fucked', 'shit', 'shitting', 'shitty',
  'bitch', 'bitches', 'bastard', 'asshole', 'ass', 'dick', 'cock', 'pussy',
  'cunt', 'whore', 'slut', 'nigger', 'nigga', 'faggot', 'retard', 'motherfucker',
  'bullshit', 'bastards', 'dumbass', 'jackass', 'piss', 'pissed',

  // --- Korean Profanities & Bad Words (한국어 욕설) ---
  '씨발', '시발', '씨빨', '씨바', '씨팔', '시팔', '개새끼', '개새', '개새키',
  '병신', '븅신', '지랄', '지랄병', '좆', '좆같', '좆까', '존나', '젴나',
  '미친년', '미친놈', '미친새끼', '꺼져', '닥쳐', '엠창', '느금마', '애미',
  '씨부랄', '새끼', '개같은', '미친',

  // --- Japanese Profanities & Bad Words (日本語 暴言・罵倒語) ---
  'バカ', 'ばか', '馬鹿', 'アホ', 'あほ', '死ね', 'しね', 'くそ', 'クソ',
  '糞', 'ちくしょう', '畜生', 'ぶっ殺す', 'ぶっ殺すぞ', '殺す', 'ころす',
  'キチガイ', 'きちがい', 'きちがい', '気違い', '変態', 'へんたい', 'ブス', 'ぶす',
  'ビッチ', 'びっち', 'ふざけるな'
];

export interface CensorshipResult {
  censoredText: string;
  hasInappropriate: boolean;
  foundWords: string[];
}

// Custom Event for triggering system-wide ethical warning toasts
export const ETHICAL_WARNING_EVENT = 'catalogue:ethical-warning';
export const ETHICAL_WARNING_MESSAGE = 'Warning! Inappropriate words are not allowed.';

/**
 * Triggers a global warning alert toast notifying the user about inappropriate word restriction
 */
export function triggerEthicalWarning(customMessage?: string): void {
  const message = customMessage || ETHICAL_WARNING_MESSAGE;
  const event = new CustomEvent(ETHICAL_WARNING_EVENT, { detail: { message } });
  window.dispatchEvent(event);
}

/**
 * Scans text for inappropriate words in any language and replaces characters with '#'
 */
export function checkAndCensorText(text: string): CensorshipResult {
  if (!text || typeof text !== 'string') {
    return { censoredText: '', hasInappropriate: false, foundWords: [] };
  }

  let censoredText = text;
  let hasInappropriate = false;
  const foundWords: string[] = [];

  // Sort dictionary by length descending so longer phrases match first before substring components
  const sortedDict = [...BAD_WORDS_DICTIONARY].sort((a, b) => b.length - a.length);

  for (const word of sortedDict) {
    // Regex matching case-insensitive with boundary sensitivity for Latin script, direct substring match for CJK
    const isLatin = /^[a-zA-Z0-9]+$/.test(word);
    
    let regex: RegExp;
    if (isLatin) {
      regex = new RegExp(`\\b${word}\\b`, 'gi');
    } else {
      // For CJK (Korean/Japanese), search global case-insensitive exact substring match
      regex = new RegExp(escapeRegExp(word), 'gi');
    }

    if (regex.test(censoredText)) {
      hasInappropriate = true;
      if (!foundWords.includes(word)) {
        foundWords.push(word);
      }
      
      // Replace matching string with '#' symbol repeated for the exact length of the match
      censoredText = censoredText.replace(regex, (match) => '#'.repeat(match.length));
    }
  }

  return {
    censoredText,
    hasInappropriate,
    foundWords
  };
}

/**
 * Helper to escape special regex characters in CJK strings
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
