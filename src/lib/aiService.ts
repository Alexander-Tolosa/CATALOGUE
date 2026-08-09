/**
 * Unified AI Service for CATalouge
 * Routes both Chatbot (/chat) and Letter Feedback through the same AI orchestration pipeline.
 * Reuses conversation context (such as vocabulary the user struggled with in chat) to inform writing feedback.
 */

import {
  ChatScenario,
  LanguageTrack,
  AIChatResponse,
  AILetterFeedbackResponse,
  InlineCorrection,
  StruggledWordItem
} from '../types';
import { retrieveContext, DEFAULT_KNOWLEDGE_BASE } from './ragEngine';

export interface AIServiceChatOptions {
  message: string;
  scenario: ChatScenario;
  language: LanguageTrack;
  userLevel: number;
  struggledVocab?: StruggledWordItem[];
  history?: Array<{ sender: 'ai' | 'user'; text: string }>;
}

export interface AIServiceLetterOptions {
  letterContent: string;
  language: LanguageTrack;
  userLevel: number;
  struggledVocab?: StruggledWordItem[];
  letterType?: string;
}

/**
 * Builds the dynamic system prompt for Chatbot Roleplay & Grammar Correction
 */
export function buildChatbotSystemPrompt(options: Omit<AIServiceChatOptions, 'message'>): string {
  const { scenario, language, userLevel, struggledVocab } = options;
  const langName = language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English';
  
  const vocabListStr = struggledVocab && struggledVocab.length > 0
    ? struggledVocab.map(v => v.word).join(', ')
    : 'None yet';

  let scenarioDesc = '';
  switch (scenario) {
    case 'order_coffee':
      scenarioDesc = `Roleplay Scenario: You are a friendly barista in a busy café in Tokyo/Seoul/London. Guide the customer through ordering coffee, asking for size, sugar, and payment method.`;
      break;
    case 'job_interview':
      scenarioDesc = `Roleplay Scenario: You are a hiring manager interviewing the user for a bilingual position. Ask standard interview questions, evaluate their politeness, and offer tips.`;
      break;
    case 'hotel_checkin':
      scenarioDesc = `Roleplay Scenario: You are a receptionist at a boutique hotel. Help the user check in, ask for reservation details, and answer room questions.`;
      break;
    case 'airport_customs':
      scenarioDesc = `Roleplay Scenario: You are an airport customs officer. Ask the user about their travel purpose, stay duration, and declaration items.`;
      break;
    case 'free_chat':
    default:
      scenarioDesc = `Roleplay Scenario: Free conversation mode as Kleo, the encouraging Siamese cat AI language tutor. Answer language questions, chat naturally, and offer gentle corrections.`;
      break;
  }

  return `You are Kleo AI Service (CATalouge Platform).
Target Language: ${langName}
User Proficiency Level: Level ${userLevel}
User's Recently Struggled Vocabulary Context: [${vocabListStr}]

${scenarioDesc}

INSTRUCTIONS & OUTPUT RULES:
1. Immediately provide the requested translation, explanation, or scenario response directly.
2. When answering language queries or translations:
   a. State the native script translation directly.
   b. Provide the Romanization.
   c. Provide a brief breakdown of the phrase/grammar rule.
3. NEVER repeat, rephrase, or echo the user's prompt back to them (e.g. NEVER state "Regarding '...'" or "You asked about '...'").
4. Respond in character for the selected scenario in ${langName}.
5. If grammar errors are detected, include inline corrections with the exact original snippet, corrected version, and explanation.
6. EMOJI RULE: Do NOT include any emojis in your response text. Write clean, natural, human text without emojis.`;
}

/**
 * Builds the dynamic system prompt for Writing & Letter Feedback
 */
export function buildLetterFeedbackSystemPrompt(options: Omit<AIServiceLetterOptions, 'letterContent'>): string {
  const { language, userLevel, struggledVocab, letterType } = options;
  const langName = language === 'ko' ? 'Korean' : language === 'ja' ? 'Japanese' : 'English';

  const vocabListStr = struggledVocab && struggledVocab.length > 0
    ? struggledVocab.map(v => v.word).join(', ')
    : 'None yet';

  return `You are Kleo Writing & Letter Feedback Service (CATalouge Platform).
Target Language: ${langName}
User Proficiency Level: Level ${userLevel}
Letter/Essay Type: ${letterType || 'General Letter'}
Cross-Feature Chat Context (User's Struggled Terms from Chatbot): [${vocabListStr}]

INSTRUCTIONS:
1. Provide a comprehensive critique of the user's letter draft.
2. Evaluate overall clarity, sentence structure, and register (e.g. 존댓말/반말 honorifics in Korean, です/ます in Japanese).
3. Directly reference and address any vocabulary items from their recent Chatbot struggles ([${vocabListStr}]) if applicable to help reinforce their weak areas.
4. Provide line-by-line corrections and recommended vocabulary expressions.
5. EMOJI RULE: Do NOT use emojis in your response text. Write clean, clear, human text.`;
}

/**
 * Centralized Chatbot Service Call
 */
export async function processAIChatMessage(options: AIServiceChatOptions): Promise<AIChatResponse> {
  const { message, scenario, language, userLevel, struggledVocab } = options;
  const ragResult = retrieveContext(message, DEFAULT_KNOWLEDGE_BASE, 2);

  try {
    const res = await fetch('/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'chat',
        message,
        scenario,
        language,
        userLevel,
        struggledVocab,
        ragContext: ragResult.contextPromptString
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend /api/ai/process unreachable, utilizing client-side AI fallback engine:', err);
  }

  // --- Dynamic Client-Side Fallback Generator ---
  return generateClientChatFallback(options, ragResult.contextPromptString);
}

/**
 * Centralized Letter Feedback Service Call
 */
export async function processAILetterFeedback(options: AIServiceLetterOptions): Promise<AILetterFeedbackResponse> {
  const { letterContent, language, userLevel, struggledVocab, letterType } = options;
  const ragResult = retrieveContext(letterContent, DEFAULT_KNOWLEDGE_BASE, 2);

  try {
    const res = await fetch('/api/ai/process', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'letter_feedback',
        letterContent,
        language,
        userLevel,
        struggledVocab,
        letterType,
        ragContext: ragResult.contextPromptString
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Backend /api/ai/process unreachable, utilizing client-side Letter Feedback engine:', err);
  }

  // --- Dynamic Client-Side Fallback Generator ---
  return generateClientLetterFallback(options);
}

/**
 * Fallback AI Generator for Chatbot
 */
function generateClientChatFallback(options: AIServiceChatOptions, ragContext: string): AIChatResponse {
  const { message, scenario, language, struggledVocab } = options;
  const textLower = message.toLowerCase();
  const corrections: InlineCorrection[] = [];
  const detectedStruggledWords: string[] = [];

  let reply = '';

  // Scenario specific roleplay responses
  if (scenario === 'order_coffee') {
    if (language === 'ko') {
      reply = '어서오세요! 카페 카탈로그입니다. 어떤 음료로 주문하시겠어요? 따뜻한 아메리카노나 라떼가 준비되어 있습니다.';
      if (textLower.includes('주세요') || textLower.includes('커피')) {
        reply = '네! 아이스로 준비해 드릴까요, 아니면 따뜻하게 드릴까요? 사이즈는 보통(Regular)과 큰(Large) 사이즈가 있습니다.';
      }
    } else if (language === 'ja') {
      reply = 'いらっしゃいませ！カフェCATalougeへようこそ。ご注文はお決まりですか？';
      if (textLower.includes('ください') || textLower.includes('コーヒー')) {
        reply = 'かしこまりました！ホットとアイスのどちらになさいますか？サイズはMとLがございます。';
      }
    } else {
      reply = 'Welcome to Coffee CATalouge! What can I get started for you today? We have freshly roasted espresso and matcha lattes.';
    }
  } else if (scenario === 'job_interview') {
    if (language === 'ko') {
      reply = '안녕하십니까! 오늘 면접에 응해주셔서 감사합니다. 먼저 간단히 자기소개 부탁드립니다.';
    } else if (language === 'ja') {
      reply = '本日は面接にお越しいただきありがとうございます。まず簡単に自己紹介をお願いいたします。';
    } else {
      reply = 'Thank you for taking the time to interview with us today! Could you please start by introducing yourself and your language background?';
    }
  } else if (scenario === 'hotel_checkin') {
    if (language === 'ko') {
      reply = '안녕하세요, 카탈로그 호텔 리셉션입니다. 예약하신 성함을 말씀해 주시겠어요?';
    } else if (language === 'ja') {
      reply = 'いらっしゃいませ。CATalougeホテルへようこそ。ご予約のお名前をお伺いできますか？';
    } else {
      reply = 'Welcome to Hotel CATalouge! May I have your name for the reservation check-in, please?';
    }
  } else if (scenario === 'airport_customs') {
    if (language === 'ko') {
      reply = '입국 심사대입니다. 방문 목적이 무엇인가요? 얼마나 체류할 예정이신가요?';
    } else if (language === 'ja') {
      reply = '入国審査へようこそ。滞在の目的と、滞在期間를教えていただけますか？';
    } else {
      reply = 'Passport and customs control. What is the main purpose of your visit today, and how long will you be staying?';
    }
  } else {
    // Free chat direct answer generator (No meta-echoing)
    if (language === 'ko') {
      if (textLower.includes('hi') || textLower.includes('hello') || textLower.includes('안녕')) {
        reply = `안녕하세요 (Annyeonghaseyo)\n\nRomanization: Annyeonghaseyo\nBreakdown: Standard polite greeting used in Korean to say "Hello" or "Good day".`;
      } else if (textLower.includes('thank')) {
        reply = `감사합니다 (Gamsahamnida)\n\nRomanization: Gamsahamnida\nBreakdown: Formal and polite expression for "Thank you".`;
      } else if (textLower.includes('nice to meet')) {
        reply = `반갑습니다 (Bangapseumnida)\n\nRomanization: Bangapseumnida\nBreakdown: Polite expression used when meeting someone for the first time.`;
      } else {
        reply = `안녕하세요! 무엇이든 물어보세요. 문법, 단어, 회화 연습까지 친절하게 답변해 드릴게요.`;
      }
    } else if (language === 'ja') {
      if (textLower.includes('hi') || textLower.includes('hello') || textLower.includes('こんにちは')) {
        reply = `こんにちは (Konnichiwa)\n\nRomanization: Konnichiwa\nBreakdown: Standard daytime greeting used in Japanese.`;
      } else if (textLower.includes('thank')) {
        reply = `ありがとうございます (Arigatou gozaimasu)\n\nRomanization: Arigatou gozaimasu\nBreakdown: Polite expression for "Thank you very much".`;
      } else {
        reply = `こんにちは！日本語の文法や単語、日常会話について気兼ねなく質問してくださいね。`;
      }
    } else {
      if (textLower.includes('hi') || textLower.includes('hello')) {
        reply = `Hello! How can I assist you with your English practice today?`;
      } else {
        reply = `Hello! Ask me any question about vocabulary, grammar patterns, or conversation practice.`;
      }
    }
  }

  // Detect potential grammar / politeness mistakes for inline correction bubbles
  if (language === 'ko') {
    if (textLower.includes('안녕 ') || textLower.includes(' 고마워') || (textLower.endsWith('야') && !textLower.endsWith('이야'))) {
      corrections.push({
        id: 'corr-' + Date.now() + '-1',
        original: message,
        corrected: message.replace(/안녕$/g, '안녕하세요').replace(/고마워$/g, '감사합니다'),
        explanation: 'Friendly polite speech (존댓말) ending with ~요 or ~습니까 is recommended for polite roleplay.',
        type: 'politeness',
        struggledWord: '존댓말 (Friendly Honorifics)'
      });
      detectedStruggledWords.push('존댓말 (Friendly Honorifics)');
    }
  } else if (language === 'ja') {
    if (textLower.includes('だ') || textLower.includes('ありがとう') || textLower.includes('これ ')) {
      corrections.push({
        id: 'corr-' + Date.now() + '-2',
        original: message,
        corrected: message + ' です/ます',
        explanation: 'In Japanese polite roleplay, adding です (desu) or ます (masu) makes your sentences polite and natural.',
        type: 'politeness',
        struggledWord: 'です/ます (Teineigo Polite Form)'
      });
      detectedStruggledWords.push('です/ます (Teineigo Polite Form)');
    }
  } else {
    if (textLower.includes('i goes') || textLower.includes('he do ')) {
      corrections.push({
        id: 'corr-' + Date.now() + '-3',
        original: textLower.includes('i goes') ? 'I goes' : 'he do',
        corrected: textLower.includes('i goes') ? 'I go' : 'he does',
        explanation: 'Subject-verb agreement: Use first-person "I go" or third-person singular "he does".',
        type: 'grammar',
        struggledWord: 'Subject-Verb Agreement'
      });
      detectedStruggledWords.push('Subject-Verb Agreement');
    }
  }

  // Check if user utilized previously struggled words in chat
  if (struggledVocab && struggledVocab.length > 0) {
    const matched = struggledVocab.find(v => message.includes(v.word.split(' ')[0]));
    if (matched) {
      reply += `\n\n**Kleo Notice**: Great job incorporating your past struggled word **"${matched.word}"** into conversation!`;
    }
  }

  return {
    reply,
    corrections: corrections.length > 0 ? corrections : undefined,
    struggledWords: detectedStruggledWords,
    scenarioContext: scenario
  };
}

/**
 * Fallback AI Generator for Letter Feedback
 */
function generateClientLetterFallback(options: AIServiceLetterOptions): AILetterFeedbackResponse {
  const { letterContent, language, struggledVocab } = options;
  const length = letterContent.trim().length;

  const addressedStruggled: string[] = [];
  if (struggledVocab && struggledVocab.length > 0) {
    struggledVocab.forEach(v => {
      const keyword = v.word.split(' ')[0];
      if (letterContent.toLowerCase().includes(keyword.toLowerCase())) {
        addressedStruggled.push(v.word);
      }
    });
  }

  const lineCorrections: Array<{ originalLine: string; suggestedLine: string; explanation: string }> = [];

  if (language === 'ko') {
    lineCorrections.push({
      originalLine: letterContent.slice(0, Math.min(30, length)),
      suggestedLine: letterContent.slice(0, Math.min(30, length)) + ' (안녕하십니까, 잘 부탁드립니다.)',
      explanation: 'Adding formal opening greeting (~안녕하십니까) sets a polished tone for letters.'
    });
  } else if (language === 'ja') {
    lineCorrections.push({
      originalLine: letterContent.slice(0, Math.min(30, length)),
      suggestedLine: letterContent.slice(0, Math.min(30, length)) + '（拝啓 お世話になっております）',
      explanation: 'Standard Japanese letter etiquette begins with formal greeting formulas like お世話になっております.'
    });
  } else {
    lineCorrections.push({
      originalLine: letterContent.slice(0, Math.min(30, length)),
      suggestedLine: 'Dear Hiring Manager / Recipient,\n' + letterContent.slice(0, Math.min(30, length)),
      explanation: 'Include a formal salutation header ("Dear [Name/Title]") to open formal letters.'
    });
  }

  return {
    overallScore: Math.min(95, 70 + Math.floor(length / 10)),
    politenessRating: language === 'ko' ? 'Formal Politeness (존댓말)' : language === 'ja' ? 'Polite Form (丁寧語)' : 'Standard Professional',
    summary: `Your letter draft is clear and structured. Reusing vocabulary learned in chat (such as ${addressedStruggled.join(', ') || 'polite sentence endings'}) adds confidence to your written composition!`,
    lineCorrections,
    struggledVocabAddressed: addressedStruggled,
    suggestedPhrases: [
      {
        term: language === 'ko' ? '잘 부탁드립니다' : language === 'ja' ? 'よろしくお願いいたします' : 'I look forward to hearing from you',
        translation: 'I look forward to working with you / your kind consideration',
        context: 'Perfect formal closing sentence for business and personal correspondence.'
      },
      {
        term: language === 'ko' ? '감사의 말씀을 드립니다' : language === 'ja' ? '心より感謝申し上げます' : 'Expressing my sincere gratitude',
        translation: 'I express my sincere thanks',
        context: 'High honorific expression of gratitude.'
      }
    ]
  };
}
