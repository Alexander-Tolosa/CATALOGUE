import React, { useState } from 'react';
import { ReviewItem } from '../../types';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { Bookmark, Volume2, RotateCcw, Sparkles, CheckCircle2, Heart } from 'lucide-react';

interface ReviewDeckViewProps {
  items: ReviewItem[];
  onRefillHearts: () => void;
}

export const ReviewDeckView: React.FC<ReviewDeckViewProps> = ({ items, onRefillHearts }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const activeItem = items[currentIndex] || {
    id: 'rev-default',
    term: '안녕하세요 (Annyeonghaseyo)',
    translation: 'Hello / Good day',
    language: 'ko',
    phonetic: 'an-nyeong-ha-se-yo',
    interval: 1,
    easeFactor: 2.5,
    nextReviewAt: new Date().toISOString().split('T')[0]
  };

  const handleSelfRate = (rating: 'again' | 'hard' | 'good' | 'easy') => {
    setIsFlipped(false);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionCompleted(true);
      onRefillHearts();
    }
  };

  const speakAudio = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between transition-colors ${
        isDarkMode
          ? 'bg-gradient-to-r from-rose-950 via-slate-950 to-purple-950 border-rose-500/40 text-white'
          : 'bg-gradient-to-r from-[#FFF5F3] via-white to-[#FDF4FF] border-[#FCE7E2] text-slate-900 shadow-sm'
      }`}>
        <div>
          <span className={`text-xs font-black uppercase tracking-widest block mb-1 ${isDarkMode ? 'text-rose-400' : 'text-[#F06543]'}`}>
            {t.review.title}
          </span>
          <h2 className={`font-brand text-3xl font-black flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            <Bookmark size={26} className={isDarkMode ? 'text-rose-400' : 'text-[#F06543]'} /> {t.review.title}
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{t.review.subtitle}</p>
        </div>

        <span className={`font-black text-xs px-3.5 py-1.5 rounded-full border shadow-xs ${
          isDarkMode
            ? 'bg-rose-950 text-rose-300 border-rose-800'
            : 'bg-[#FFF0EB] text-[#F06543] border-[#FDDAD0]'
        }`}>
          {currentIndex + 1} / {items.length || 1} Cards
        </span>
      </div>

      {!sessionCompleted ? (
        <div className="space-y-6">
          {/* Flashcard Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-72 border rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all shadow-xl relative select-none ${
              isDarkMode
                ? 'bg-slate-950/90 border-sky-500/40 hover:border-sky-400'
                : 'bg-white border-[#e0d6c7] hover:border-sky-500 shadow-md'
            }`}
          >
            <span className={`absolute top-4 right-4 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${
              isDarkMode
                ? 'bg-sky-950 text-sky-400 border-sky-800'
                : 'bg-sky-50 text-sky-700 border-sky-200'
            }`}>
              {t.review.flipCard}
            </span>

            {!isFlipped ? (
              <div className="space-y-3">
                <span className={`text-xs uppercase font-black tracking-widest block ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Front • Target Script
                </span>
                <div className={`text-4xl font-black font-kr font-jp ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {activeItem.term}
                </div>
                {activeItem.phonetic && (
                  <div className={`text-xs font-mono font-bold ${isDarkMode ? 'text-sky-300' : 'text-sky-600'}`}>
                    [{activeItem.phonetic}]
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <span className={`text-xs uppercase font-black tracking-widest block ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Back • Translation
                </span>
                <div className={`text-3xl font-black ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                  {activeItem.translation}
                </div>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                speakAudio(activeItem.term, activeItem.language);
              }}
              className={`mt-6 p-3 rounded-full border transition-colors cursor-pointer ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-700 text-sky-400 hover:bg-slate-800'
                  : 'bg-sky-50 border-sky-200 text-sky-600 hover:bg-sky-100 shadow-xs'
              }`}
              title={t.review.listen}
            >
              <Volume2 size={22} />
            </button>
          </div>

          {/* SM-2 Self-Rating Buttons */}
          <div className="space-y-2">
            <span className={`text-xs font-black uppercase tracking-wider text-center block ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {t.review.ratePrompt}:
            </span>

            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => handleSelfRate('again')}
                className={`p-3 rounded-2xl border font-black text-xs cursor-pointer transition-all shadow-xs ${
                  isDarkMode
                    ? 'bg-rose-950 hover:bg-rose-900 border-rose-800 text-rose-300'
                    : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700'
                }`}
              >
                {t.review.again}
              </button>

              <button
                onClick={() => handleSelfRate('hard')}
                className={`p-3 rounded-2xl border font-black text-xs cursor-pointer transition-all shadow-xs ${
                  isDarkMode
                    ? 'bg-amber-950 hover:bg-amber-900 border-amber-800 text-amber-300'
                    : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-700'
                }`}
              >
                {t.review.hard}
              </button>

              <button
                onClick={() => handleSelfRate('good')}
                className={`p-3 rounded-2xl border font-black text-xs cursor-pointer transition-all shadow-xs ${
                  isDarkMode
                    ? 'bg-sky-950 hover:bg-sky-900 border-sky-800 text-sky-300'
                    : 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-700'
                }`}
              >
                {t.review.good}
              </button>

              <button
                onClick={() => handleSelfRate('easy')}
                className={`p-3 rounded-2xl border font-black text-xs cursor-pointer transition-all shadow-xs ${
                  isDarkMode
                    ? 'bg-emerald-950 hover:bg-emerald-900 border-emerald-800 text-emerald-300'
                    : 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-700'
                }`}
              >
                {t.review.easy}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Completion Screen */
        <div className={`p-8 rounded-3xl text-center space-y-5 border shadow-xl ${
          isDarkMode
            ? 'bg-slate-950/90 border-emerald-500/40 text-white'
            : 'bg-white border-emerald-200 text-slate-900 shadow-md'
        }`}>
          <div className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto text-2xl ${
            isDarkMode
              ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
              : 'bg-emerald-50 border-emerald-300 text-emerald-600'
          }`}>
            <CheckCircle2 size={36} />
          </div>

          <h3 className={`font-brand text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {t.review.complete}
          </h3>
          <p className={`text-xs max-w-md mx-auto leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {t.review.completeMsg}
          </p>

          <button
            onClick={() => {
              setSessionCompleted(false);
              setCurrentIndex(0);
            }}
            className="px-6 py-3 rounded-xl bg-[#F06543] hover:bg-[#E05432] text-white text-xs font-black shadow-md cursor-pointer transition-all"
          >
            {t.review.reviewAgain}
          </button>
        </div>
      )}
    </div>
  );
};
