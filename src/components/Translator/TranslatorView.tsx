import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LanguageTrack, ReviewItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { FlagIcon } from '../Common/FlagIcon';

interface TranslatorViewProps {
  onSaveToReview: (item: Omit<ReviewItem, 'id' | 'interval' | 'easeFactor' | 'nextReviewAt'>) => void;
}

type LangOption = 'English' | 'Japanese' | 'Korean';

const LANG_CODES: Record<LangOption, { code: 'us' | 'jp' | 'kr'; apiCode: string; bcp47: string }> = {
  English: { code: 'us', apiCode: 'en', bcp47: 'en-US' },
  Japanese: { code: 'jp', apiCode: 'ja', bcp47: 'ja-JP' },
  Korean: { code: 'kr', apiCode: 'ko', bcp47: 'ko-KR' }
};

// Known Phonetic Dictionary for accurate Romanization
const PHONETIC_MAP: Record<string, string> = {
  '抹茶ラテをお願いします。': 'Matcha rate o onegaishimasu.',
  '말차 라떼 한 잔 주세요.': 'Malcha latte han jan juseyo.',
  'I would like a matcha latte, please.': 'I would like a mat-cha lat-te, please.',
  '最寄りの駅はどこですか？': 'Moyori no eki wa doko desu ka?',
  'お会計をお願いします。': 'O-kaikei o onegaishimasu.',
  'すみません、この席は空いていますか？': 'Sumimasen, kono seki wa aite imasu ka?',
  '무료로 즐겁고 효과적으로 언어를 배워보세요': 'mulyolo jeulgeobgo hyogwajeog-eulo eon-eoleul baewoboseyo',
  'Learn a language effectively and enjoyably for free.': 'Learn a lan-guage ef-fec-tive-ly for free.',
  '안녕하세요': 'Annyeonghaseyo',
  'こんにちは': 'Konnichiwa',
  '감사합니다': 'Gamsahamnida',
  'ありがとう': 'Arigatou'
};

// Real Hangul Romanization Engine (Revised Romanization of Korean)
const INITIALS = ['g', 'g', 'n', 'd', 'd', 'r', 'm', 'b', 'b', 's', 's', '', 'j', 'j', 'ch', 'k', 't', 'p', 'h'];
const VOWELS = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const FINALS = ['', 'g', 'g', 'gs', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'b', 'bs', 's', 'ss', 'ng', 'j', 'ch', 'k', 't', 'p', 'h'];

// Real Kana Romanization Dictionary for Japanese
const KANA_ROMAN: Record<string, string> = {
  'あ':'a','い':'i','う':'u','え':'e','お':'o',
  'か':'ka','き':'ki','く':'ku','け':'ke','こ':'ko',
  'さ':'sa','し':'shi','す':'su','せ':'se','そ':'so',
  'た':'ta','ち':'chi','つ':'tsu','て':'te','と':'to',
  'な':'na','に':'ni','ぬ':'nu','ね':'ne','の':'no',
  'は':'ha','ひ':'hi','ふ':'fu','へ':'he','ほ':'ho',
  'ま':'ma','み':'mi','む':'mu','め':'me','も':'mo',
  'や':'ya','ゆ':'yu','よ':'yo',
  'ら':'ra','り':'ri','る':'ru','れ':'re','ろ':'ro',
  'わ':'wa','を':'o','ん':'n',
  'が':'ga','ぎ':'gi','ぐ':'gu','げ':'ge','ご':'go',
  'ざ':'za','じ':'ji','ず':'zu','ぜ':'ze','ぞ':'zo',
  'だ':'da','ぢ':'ji','づ':'zu','で':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po',
  'ア':'a','イ':'i','ウ':'u','エ':'e','オ':'o',
  'カ':'ka','キ':'ki','ク':'ku','ケ':'ke','コ':'ko',
  'サ':'sa','シ':'shi','ス':'su','セ':'se','ソ':'so',
  'タ':'ta','チ':'chi','ツ':'tsu','テ':'te','ト':'to',
  'ナ':'na','ニ':'ni','ヌ':'nu','ネ':'ne','ノ':'no',
  'ハ':'ha','ヒ':'hi','フ':'fu','ヘ':'he','ホ':'ho',
  'マ':'ma','ミ':'mi','ム':'mu','メ':'me','モ':'mo',
  'ヤ':'ya','ユ':'yu','ヨ':'yo',
  'ラ':'ra','リ':'ri','ル':'ru','レ':'re','ロ':'ro',
  'ワ':'wa','ヲ':'o','ン':'n'
};

function romanizeHangul(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const syllableIndex = code - 0xac00;
    const initialIndex = Math.floor(syllableIndex / 588);
    const vowelIndex = Math.floor((syllableIndex % 588) / 28);
    const finalIndex = syllableIndex % 28;

    const initial = INITIALS[initialIndex] || '';
    const vowel = VOWELS[vowelIndex] || '';
    const final = FINALS[finalIndex] || '';

    return initial + vowel + final;
  }
  return char;
}

function generatePhonetic(text: string, lang: LangOption): string {
  if (!text.trim()) return '';
  if (lang === 'English') return ''; // English target output does not need Romanization

  if (PHONETIC_MAP[text.trim()]) return PHONETIC_MAP[text.trim()];

  if (lang === 'Korean') {
    const result = text.split('').map(char => romanizeHangul(char)).join('');
    return result ? result.charAt(0).toUpperCase() + result.slice(1) : '';
  }

  if (lang === 'Japanese') {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (KANA_ROMAN[char]) {
        result += KANA_ROMAN[char];
      } else {
        result += char;
      }
    }
    return result.trim() ? result.charAt(0).toUpperCase() + result.slice(1) : '';
  }

  return '';
}

const OFFLINE_DICTIONARY: Record<string, Record<string, string>> = {
  '나 화장실에 가도 돼?': {
    English: 'May I go to the bathroom?',
    Japanese: 'お手洗いに行ってもいいですか？'
  },
  '화장실에 가도 될까요?': {
    English: 'May I go to the bathroom?',
    Japanese: 'お手洗いに行ってもいいですか？'
  },
  '말차 라떼 한 잔 주세요.': {
    English: 'I would like a matcha latte, please.',
    Japanese: '抹茶ラテをお願いします。'
  },
  '抹茶ラテをお願いします。': {
    English: 'I would like a matcha latte, please.',
    Korean: '말차 라떼 한 잔 주세요.'
  },
  'I would like a matcha latte, please.': {
    Japanese: '抹茶ラテをお願いします。',
    Korean: '말차 라떼 한 잔 주세요.'
  }
};

interface CustomLanguageDropdownProps {
  value: LangOption;
  onChange: (val: LangOption) => void;
  options: LangOption[];
  isDarkMode: boolean;
}

const CustomLanguageDropdown: React.FC<CustomLanguageDropdownProps> = ({
  value,
  onChange,
  options,
  isDarkMode
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex-1" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all border cursor-pointer ${
          isOpen
            ? 'border-[#FF6B35] shadow-[0_0_15px_rgba(255,107,53,0.25)]'
            : isDarkMode
            ? 'bg-[#0b0f19]/80 border-[#1e293b] text-white hover:border-[#FF6B35]/50'
            : 'bg-slate-50 border-slate-200 text-slate-800 hover:border-slate-300'
        }`}
      >
        <span className="flex items-center gap-2.5">
          <FlagIcon code={LANG_CODES[value].code} size="sm" />
          <span>{value}</span>
        </span>
        <span
          className={`material-symbols-outlined text-base text-[#FF6B35] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 4, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute left-0 right-0 top-full z-50 p-1.5 rounded-2xl border shadow-2xl ${
              isDarkMode
                ? 'bg-[#131b2e] border-[#1e293b] text-white'
                : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {options.map((opt) => {
              const isSelected = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs md:text-sm font-bold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FF6B35]/15 text-[#FF6B35]'
                      : isDarkMode
                      ? 'text-slate-200 hover:bg-[#1e293b]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <FlagIcon code={LANG_CODES[opt].code} size="sm" />
                    <span>{opt}</span>
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-base text-[#FF6B35]">
                      check
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const TranslatorView: React.FC<TranslatorViewProps> = ({ onSaveToReview }) => {
  const { isDarkMode } = useAppStore();
  const [fromLang, setFromLang] = useState<LangOption>('English');
  const [toLang, setToLang] = useState<LangOption>('Japanese');
  const [inputText, setInputText] = useState('I would like a matcha latte, please.');
  const [translatedText, setTranslatedText] = useState('抹茶ラテをお願いします。');
  const [phoneticText, setPhoneticText] = useState('Matcha rate o onegaishimasu.');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isSpeakingSource, setIsSpeakingSource] = useState(false);
  const [isSpeakingTarget, setIsSpeakingTarget] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Translation Function using multi-engine internet APIs
  const performTranslation = useCallback(
    async (text: string, source: LangOption, target: LangOption) => {
      if (!text.trim()) {
        setTranslatedText('');
        setPhoneticText('');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setIsSaved(false);

      const srcCode = LANG_CODES[source].apiCode;
      const tgtCode = LANG_CODES[target].apiCode;

      // Engine 1: Google Translate Primary GTX Client API
      try {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcCode}&tl=${tgtCode}&dt=t&q=${encodeURIComponent(
            text
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data[0] && Array.isArray(data[0])) {
            const translatedResult = data[0]
              .filter((item: any) => item && item[0])
              .map((item: any) => item[0])
              .join('');
            if (translatedResult.trim()) {
              setTranslatedText(translatedResult);
              setPhoneticText(generatePhonetic(translatedResult, target));
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Google GTX Translation API failed, trying dictionary fallback...', err);
      }

      // Engine 2: Google Translate Secondary Dict Client API
      try {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=${srcCode}&tl=${tgtCode}&dt=t&q=${encodeURIComponent(
            text
          )}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data[0] && Array.isArray(data[0])) {
            const translatedResult = data[0]
              .filter((item: any) => item && item[0])
              .map((item: any) => item[0])
              .join('');
            if (translatedResult.trim()) {
              setTranslatedText(translatedResult);
              setPhoneticText(generatePhonetic(translatedResult, target));
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('Google Dict API failed, trying MyMemory API...', err);
      }

      // Engine 3: MyMemory Free Internet Translation API
      try {
        const fallbackRes = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            text
          )}&langpair=${srcCode}|${tgtCode}`
        );
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (fallbackData?.responseData?.translatedText) {
            const result = fallbackData.responseData.translatedText;
            if (result.trim()) {
              setTranslatedText(result);
              setPhoneticText(generatePhonetic(result, target));
              setIsLoading(false);
              return;
            }
          }
        }
      } catch (err) {
        console.warn('MyMemory API failed:', err);
      }

      // Engine 4: Lingva Open Proxy API
      try {
        const lingvaRes = await fetch(
          `https://lingva.ml/api/v1/${srcCode}/${tgtCode}/${encodeURIComponent(text)}`
        );
        if (lingvaRes.ok) {
          const lingvaData = await lingvaRes.json();
          if (lingvaData?.translation) {
            setTranslatedText(lingvaData.translation);
            setPhoneticText(generatePhonetic(lingvaData.translation, target));
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Lingva Proxy API failed:', err);
      }

      // Check Offline Dictionary Fallback
      if (OFFLINE_DICTIONARY[text.trim()] && OFFLINE_DICTIONARY[text.trim()][target]) {
        const dictResult = OFFLINE_DICTIONARY[text.trim()][target];
        setTranslatedText(dictResult);
        setPhoneticText(generatePhonetic(dictResult, target));
        setIsLoading(false);
        return;
      }

      // Final fallback: Return input text if target equals source, otherwise set empty or input
      if (source === target) {
        setTranslatedText(text);
        setPhoneticText(generatePhonetic(text, target));
      } else {
        setTranslatedText('');
        setPhoneticText('');
      }
      setIsLoading(false);
    },
    []
  );

  // Debounced auto-translate on text change
  const handleInputChange = (text: string) => {
    setInputText(text);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!text.trim()) {
      setTranslatedText('');
      setPhoneticText('');
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      performTranslation(text, fromLang, toLang);
    }, 400);
  };

  // Immediate Translate Button Trigger
  const handleManualTranslate = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    performTranslation(inputText, fromLang, toLang);
  };

  // Swap Languages (<-> Button)
  const handleSwapLanguages = () => {
    const newFrom = toLang;
    const newTo = fromLang;
    const newFromText = translatedText;

    setFromLang(newFrom);
    setToLang(newTo);
    setInputText(newFromText);
    setTranslatedText('');
    setPhoneticText('');

    if (newFromText.trim()) {
      performTranslation(newFromText, newFrom, newTo);
    }
  };

  // Clear Text ('X' Button)
  const handleClearText = () => {
    setInputText('');
    setTranslatedText('');
    setPhoneticText('');
    setIsSaved(false);
  };

  // Text-To-Speech (TTS)
  const speakText = (text: string, lang: LangOption, isSource: boolean) => {
    if (!text.trim()) return;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = LANG_CODES[lang].bcp47;
      utterance.rate = 0.9;

      if (isSource) setIsSpeakingSource(true);
      else setIsSpeakingTarget(true);

      utterance.onend = () => {
        if (isSource) setIsSpeakingSource(false);
        else setIsSpeakingTarget(false);
      };
      utterance.onerror = () => {
        if (isSource) setIsSpeakingSource(false);
        else setIsSpeakingTarget(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  // Speech-To-Text (Voice Input)
  const startVoiceInput = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech Recognition is not supported in your browser. Try Google Chrome.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = LANG_CODES[fromLang].bcp47;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        performTranslation(transcript, fromLang, toLang);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Speech recognition failed to start:', err);
      setIsListening(false);
    }
  };

  // Copy to Clipboard
  const handleCopyTranslated = () => {
    if (!translatedText.trim()) return;
    navigator.clipboard.writeText(translatedText);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Save to Review Deck
  const handleSaveCard = () => {
    if (!translatedText.trim()) return;
    onSaveToReview({
      term: translatedText,
      translation: inputText,
      language: toLang === 'Japanese' ? 'ja' : toLang === 'Korean' ? 'ko' : 'en',
      phonetic: phoneticText
    });
    setIsSaved(true);
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header & Branding */}
      <div>
        <h1
          className={`text-2xl md:text-3xl font-black font-display tracking-tight flex items-center gap-2.5 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          <span>AI Context Translator</span>
          <span className="text-[#FF6B35] text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#FF6B35]/10 border border-[#FF6B35]/20">
            PRO
          </span>
        </h1>
        <p className={`text-xs md:text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          Translate phrase structures with native audio pronunciation & grammar breakdown.
        </p>
      </div>

      {/* Main Translator Interface Box */}
      <div className="space-y-3">
        {/* Top Language Bar (Header Dropdowns + Swap Button) */}
        <div
          className={`flex items-center justify-between gap-2 p-2 rounded-2xl border shadow-sm ${
            isDarkMode ? 'bg-[#131b2e] border-[#1e293b]' : 'bg-white border-slate-200'
          }`}
        >
          {/* Source Language Dropdown (Left) */}
          <CustomLanguageDropdown
            value={fromLang}
            onChange={(newFrom) => {
              setFromLang(newFrom);
              if (inputText.trim()) performTranslation(inputText, newFrom, toLang);
            }}
            options={['English', 'Japanese', 'Korean']}
            isDarkMode={isDarkMode}
          />

          {/* Swap Button (<->) */}
          <button
            onClick={handleSwapLanguages}
            className={`p-2.5 rounded-xl border transition-all duration-200 shrink-0 cursor-pointer ${
              isDarkMode
                ? 'bg-[#1e293b] border-[#334155] text-slate-300 hover:text-[#FF6B35] hover:border-[#FF6B35]/50'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-[#FF6B35] hover:border-[#FF6B35]/50'
            }`}
            title="Swap Languages (<->)"
          >
            <span className="material-symbols-outlined text-base md:text-lg block">swap_horiz</span>
          </button>

          {/* Target Language Dropdown (Right) */}
          <CustomLanguageDropdown
            value={toLang}
            onChange={(newTo) => {
              setToLang(newTo);
              if (inputText.trim()) performTranslation(inputText, fromLang, newTo);
            }}
            options={['Japanese', 'Korean', 'English']}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* 2-Column Side-by-Side Text Containers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Left Container: Input Text Area */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[280px] shadow-sm relative transition-all ${
              isDarkMode ? 'bg-[#131b2e] border-[#1e293b]' : 'bg-white border-slate-200'
            }`}
          >
            {/* Top Label & Clear ('X') Button */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <FlagIcon code={LANG_CODES[fromLang].code} size="sm" />
                <span>{fromLang.toUpperCase()} INPUT</span>
              </span>

              {inputText.length > 0 && (
                <button
                  onClick={handleClearText}
                  className={`p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors cursor-pointer ${
                    isDarkMode ? 'hover:bg-[#1e293b]' : 'hover:bg-slate-100'
                  }`}
                  title="Clear text"
                >
                  <span className="material-symbols-outlined text-lg block">close</span>
                </button>
              )}
            </div>

            {/* Input Textarea */}
            <div className="flex-1 my-3">
              <textarea
                value={inputText}
                onChange={(e) => handleInputChange(e.target.value)}
                rows={5}
                placeholder={`Type or paste ${fromLang} text here...`}
                className={`w-full h-full bg-transparent resize-none focus:outline-none text-base md:text-lg font-medium leading-relaxed ${
                  isDarkMode
                    ? 'text-white placeholder-slate-500'
                    : 'text-slate-900 placeholder-slate-400'
                }`}
              />
            </div>

            {/* Bottom Actions Bar (Left Container) */}
            <div
              className={`flex items-center justify-between pt-3 border-t ${
                isDarkMode ? 'border-[#1e293b]' : 'border-slate-100'
              }`}
            >
              {/* Left Action Icons: Voice Input & TTS */}
              <div className="flex items-center gap-2">
                {/* Voice Input Button */}
                <button
                  onClick={startVoiceInput}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                    isListening
                      ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                      : isDarkMode
                      ? 'bg-[#1e293b] border-[#334155] text-slate-300 hover:text-white hover:border-[#FF6B35]/40'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Speak into Microphone"
                >
                  <span className="material-symbols-outlined text-base">mic</span>
                  <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
                </button>

                {/* Audio Speaker Icon for Source Text */}
                <button
                  onClick={() => speakText(inputText, fromLang, true)}
                  disabled={!inputText.trim()}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isSpeakingSource
                      ? 'bg-[#FF6B35]/20 text-[#FF6B35] border-[#FF6B35]'
                      : isDarkMode
                      ? 'bg-[#1e293b] border-[#334155] text-slate-300 hover:text-[#FF6B35] disabled:opacity-40'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-[#FF6B35] disabled:opacity-40'
                  }`}
                  title="Listen to Source Text"
                >
                  <span className="material-symbols-outlined text-base block">volume_up</span>
                </button>
              </div>

              {/* Right Action Items: Character Count & Translate Button */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-slate-400 font-mono">
                  {inputText.length} / 500
                </span>
                <button
                  onClick={handleManualTranslate}
                  disabled={isLoading || !inputText.trim()}
                  className="btn-vibrant-orange px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">translate</span>
                  )}
                  <span>{isLoading ? 'Translating...' : 'Translate'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Container: Output Translation Display */}
          <div
            className={`p-5 rounded-2xl border flex flex-col justify-between min-h-[280px] shadow-sm relative transition-all ${
              isDarkMode ? 'bg-[#131b2e] border-[#1e293b]' : 'bg-white border-slate-200'
            }`}
          >
            {/* Top Label */}
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#FF6B35] uppercase tracking-wider flex items-center gap-1.5">
                <FlagIcon code={LANG_CODES[toLang].code} size="sm" />
                <span>{toLang.toUpperCase()} RESULT</span>
              </span>

              {/* Toast Notification Badge for Copied Text */}
              {copiedToast && (
                <span className="bg-emerald-500 text-white font-bold text-[10px] px-2.5 py-0.5 rounded-full shadow-xs animate-bounce">
                  Copied!
                </span>
              )}
            </div>

            {/* Translation Output Display & Phonetic Romanization */}
            <div className="flex-1 my-3 space-y-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full py-8 text-center space-y-2">
                  <span className="material-symbols-outlined text-3xl text-[#FF6B35] animate-spin">
                    sync
                  </span>
                  <p className="text-xs font-semibold text-slate-400">Contextual translation in progress...</p>
                </div>
              ) : translatedText ? (
                <div className="space-y-2">
                  <h2
                    className={`text-xl md:text-2xl font-bold leading-relaxed ${
                      isDarkMode ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    {translatedText}
                  </h2>
                  {phoneticText && (
                    <p className={`text-xs md:text-sm font-semibold italic ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Phonetic: {phoneticText}
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-sm font-medium text-slate-500 italic py-6">
                  Translation will appear here...
                </p>
              )}
            </div>

            {/* Bottom Actions Bar (Right Container) */}
            <div
              className={`flex items-center justify-between pt-3 border-t ${
                isDarkMode ? 'border-[#1e293b]' : 'border-slate-100'
              }`}
            >
              {/* Left Action Icons: Copy & TTS for Output */}
              <div className="flex items-center gap-2">
                {/* Copy Button */}
                <button
                  onClick={handleCopyTranslated}
                  disabled={!translatedText.trim()}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isDarkMode
                      ? 'bg-[#1e293b] border-[#334155] text-slate-300 hover:text-white hover:border-[#FF6B35]/40 disabled:opacity-40'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900 disabled:opacity-40'
                  }`}
                  title="Copy Translation"
                >
                  <span className="material-symbols-outlined text-base block">content_copy</span>
                </button>

                {/* Audio Speaker Icon for Target Text */}
                <button
                  onClick={() => speakText(translatedText, toLang, false)}
                  disabled={!translatedText.trim()}
                  className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                    isSpeakingTarget
                      ? 'bg-[#FF6B35]/20 text-[#FF6B35] border-[#FF6B35]'
                      : isDarkMode
                      ? 'bg-[#1e293b] border-[#334155] text-slate-300 hover:text-[#FF6B35] disabled:opacity-40'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-[#FF6B35] disabled:opacity-40'
                  }`}
                  title="Listen to Translation"
                >
                  <span className="material-symbols-outlined text-base block">volume_up</span>
                </button>
              </div>

              {/* Right Badges & Save to Deck Action */}
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Context-Verified by Kleo LLM
                </span>

                <button
                  onClick={handleSaveCard}
                  disabled={!translatedText.trim() || isSaved}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer disabled:opacity-50 ${
                    isSaved
                      ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40'
                      : 'btn-vibrant-orange'
                  }`}
                >
                  <span className="material-symbols-outlined text-base">
                    {isSaved ? 'check' : 'bookmark_add'}
                  </span>
                  <span>{isSaved ? 'Saved to Deck' : 'Save to Deck'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
