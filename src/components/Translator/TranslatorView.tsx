import React, { useState } from 'react';
import { LanguageTrack, ReviewItem } from '../../types';
import { LoadingScreen } from '../Common/LoadingScreen';

interface TranslatorViewProps {
  onSaveToReview: (item: Omit<ReviewItem, 'id' | 'interval' | 'easeFactor' | 'nextReviewAt'>) => void;
}

type TranslationRecord = {
  id: string;
  from: string;
  to: string;
  original: string;
  translated: string;
  timeAgo: string;
};

export const TranslatorView: React.FC<TranslatorViewProps> = ({ onSaveToReview }) => {
  const [fromLang, setFromLang] = useState<'English' | 'Japanese' | 'Korean'>('English');
  const [toLang, setToLang] = useState<'English' | 'Japanese' | 'Korean'>('Japanese');
  const [inputText, setInputText] = useState('I would like a matcha latte, please.');
  const [translatedText, setTranslatedText] = useState('抹茶ラテをお願いします。');
  const [phoneticText, setPhoneticText] = useState('Matcha rate o onegaishimasu.');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [history, setHistory] = useState<TranslationRecord[]>([
    {
      id: 'h1',
      from: 'English',
      to: 'Japanese',
      original: 'Where is the nearest train st...',
      translated: '最寄りの駅はどこですか？',
      timeAgo: '2 mins ago'
    },
    {
      id: 'h2',
      from: 'English',
      to: 'Japanese',
      original: 'Could I have the check, please...',
      translated: 'お会計をお願いします。',
      timeAgo: '1 hour ago'
    },
    {
      id: 'h3',
      from: 'English',
      to: 'Japanese',
      original: 'Excuse me, is this seat taken?',
      translated: 'すみません、この席は空いていますか？',
      timeAgo: 'Yesterday'
    }
  ]);

  const handleTranslate = () => {
    setIsLoading(true);
    setTimeout(() => {
      if (toLang === 'Japanese') {
        setTranslatedText('抹茶ラテをお願いします。');
        setPhoneticText('Matcha rate o onegaishimasu.');
      } else if (toLang === 'Korean') {
        setTranslatedText('말차 라떼 한 잔 주세요.');
        setPhoneticText('Malcha latte han jan juseyo.');
      } else {
        setTranslatedText('I would like a matcha latte, please.');
        setPhoneticText('I would like a mat-cha lat-te, please.');
      }
      setIsSaved(false);
      setIsLoading(false);
    }, 600);
  };

  const startVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleTranslate();
    }, 1200);
  };

  const speakAudio = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = toLang === 'Japanese' ? 'ja-JP' : toLang === 'Korean' ? 'ko-KR' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveCard = () => {
    onSaveToReview({
      term: translatedText,
      translation: inputText,
      language: toLang === 'Japanese' ? 'ja' : toLang === 'Korean' ? 'ko' : 'en',
      phonetic: phoneticText
    });
    setIsSaved(true);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-display tracking-tight">AI Context Translator</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Translate phrase structures with native audio pronunciation & grammar breakdown.
        </p>
      </div>

      {/* Language Selector Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xs">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase">From:</label>
          <select
            value={fromLang}
            onChange={(e) => setFromLang(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#f97316]"
          >
            <option value="English">English 🇺🇸</option>
            <option value="Japanese">Japanese 🇯🇵</option>
            <option value="Korean">Korean 🇰🇷</option>
          </select>
        </div>

        <button
          onClick={() => {
            const temp = fromLang;
            setFromLang(toLang);
            setToLang(temp);
          }}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
          title="Swap Languages"
        >
          <span className="material-symbols-outlined text-sm">swap_horiz</span>
        </button>

        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-400 uppercase">To:</label>
          <select
            value={toLang}
            onChange={(e) => setToLang(e.target.value as any)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-[#f97316]"
          >
            <option value="Japanese">Japanese 🇯🇵</option>
            <option value="Korean">Korean 🇰🇷</option>
            <option value="English">English 🇺🇸</option>
          </select>
        </div>
      </div>

      {/* Main Translation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <div className="p-5 rounded-xl border bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-2xs">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{fromLang} Input</span>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder="Type phrase to translate..."
              className="w-full bg-transparent resize-none focus:outline-none text-base font-medium placeholder-slate-400"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={startVoiceInput}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
                isListening
                  ? 'bg-rose-500 text-white border-rose-600 animate-pulse'
                  : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="material-symbols-outlined text-sm">mic</span>
              <span>{isListening ? 'Listening...' : 'Voice Input'}</span>
            </button>

            <button
              onClick={handleTranslate}
              className="btn-primary-saas px-4 py-2 text-xs font-bold rounded-lg cursor-pointer"
            >
              Translate
            </button>
          </div>
        </div>

        {/* Output Card with Lottie Loading Screen */}
        <div className="p-5 rounded-xl border bg-white dark:bg-[#111827] border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-4 shadow-2xs relative min-h-[220px]">
          {isLoading ? (
            <LoadingScreen message="Kleo is translating your phrase..." size={140} />
          ) : (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#f97316] uppercase tracking-wider">{toLang} Result</span>
                  <button
                    onClick={speakAudio}
                    className="p-1.5 rounded-lg bg-orange-50 dark:bg-slate-800 text-[#f97316] hover:bg-orange-100 transition-colors cursor-pointer"
                    title="Play Audio"
                  >
                    <span className="material-symbols-outlined text-base">volume_up</span>
                  </button>
                </div>

                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-snug">
                    {translatedText}
                  </h2>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Phonetic: {phoneticText}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">verified</span>
                  Context-Verified by Kleo LLM
                </span>

                <button
                  onClick={handleSaveCard}
                  disabled={isSaved}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border-emerald-300'
                      : 'bg-[#f97316] text-white border-[#f97316] hover:bg-[#ea580c]'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">{isSaved ? 'check' : 'bookmark_add'}</span>
                  <span>{isSaved ? 'Saved to Review Deck' : 'Save to Deck'}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
