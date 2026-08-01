import React, { useState } from 'react';
import { ReviewItem } from '../../types';
import { Bookmark, Volume2, RotateCcw, Sparkles, CheckCircle2, Heart } from 'lucide-react';

interface ReviewDeckViewProps {
  items: ReviewItem[];
  onRefillHearts: () => void;
}

export const ReviewDeckView: React.FC<ReviewDeckViewProps> = ({ items, onRefillHearts }) => {
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
      <div className="glass-panel p-6 bg-gradient-to-r from-rose-950 via-slate-950 to-purple-950 border border-rose-500/40 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-rose-400 uppercase tracking-widest block mb-1">
            SM-2 Spaced Repetition Flashcard Engine
          </span>
          <h2 className="font-brand text-3xl font-black text-white flex items-center gap-2">
            <Bookmark size={26} className="text-rose-400" /> Review Deck Session
          </h2>
          <p className="text-xs text-slate-300 mt-1">Review saved vocabulary to solidify long-term memory & refill Hearts</p>
        </div>

        <span className="bg-rose-950 text-rose-300 font-black text-xs px-3 py-1.5 rounded-full border border-rose-800">
          {currentIndex + 1} / {items.length || 1} Cards
        </span>
      </div>

      {!sessionCompleted ? (
        <div className="space-y-6">
          {/* Flashcard Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="min-h-72 bg-slate-950/90 border border-sky-500/40 rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-sky-400 transition-all shadow-2xl relative select-none"
          >
            <span className="absolute top-4 right-4 text-xs text-sky-400 font-bold uppercase tracking-wider bg-sky-950 px-3 py-1 rounded-full border border-sky-800">
              Tap Card to Flip 🔄
            </span>

            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-xs text-slate-400 uppercase font-black tracking-widest block">Front • Target Script</span>
                <div className="text-4xl font-black text-white font-kr font-jp">{activeItem.term}</div>
                {activeItem.phonetic && <div className="text-xs text-sky-300 font-mono">[{activeItem.phonetic}]</div>}
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-xs text-emerald-400 uppercase font-black tracking-widest block">Back • Translation</span>
                <div className="text-3xl font-black text-emerald-300">{activeItem.translation}</div>
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                speakAudio(activeItem.term, activeItem.language);
              }}
              className="mt-6 p-3 rounded-full bg-slate-900 border border-slate-700 text-sky-400 hover:bg-slate-800"
              title="Listen Pronunciation"
            >
              <Volume2 size={22} />
            </button>
          </div>

          {/* SM-2 Self-Rating Buttons */}
          <div className="space-y-2">
            <span className="text-xs text-slate-400 font-black uppercase tracking-wider text-center block">
              Rate Recall Difficulty to Reschedule:
            </span>

            <div className="grid grid-cols-4 gap-3">
              <button
                onClick={() => handleSelfRate('again')}
                className="p-3 rounded-2xl bg-rose-950 hover:bg-rose-900 border border-rose-800 text-rose-300 font-black text-xs"
              >
                Again (1 day)
              </button>

              <button
                onClick={() => handleSelfRate('hard')}
                className="p-3 rounded-2xl bg-amber-950 hover:bg-amber-900 border border-amber-800 text-amber-300 font-black text-xs"
              >
                Hard (3 days)
              </button>

              <button
                onClick={() => handleSelfRate('good')}
                className="p-3 rounded-2xl bg-sky-950 hover:bg-sky-900 border border-sky-800 text-sky-300 font-black text-xs"
              >
                Good (7 days)
              </button>

              <button
                onClick={() => handleSelfRate('easy')}
                className="p-3 rounded-2xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-800 text-emerald-300 font-black text-xs"
              >
                Easy (14 days)
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Completion Screen */
        <div className="glass-panel p-8 text-center space-y-5 bg-slate-950/90 border border-emerald-500/40">
          <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-2xl">
            <CheckCircle2 size={36} />
          </div>

          <h3 className="font-brand text-2xl font-black text-white">Review Session Complete! 🎉</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            You reviewed all flashcards in your deck! Your Hearts have been fully refilled! ❤️
          </p>

          <button
            onClick={() => {
              setSessionCompleted(false);
              setCurrentIndex(0);
            }}
            className="glass-button btn-primary py-3 px-6 text-xs font-black rounded-xl"
          >
            Review Again
          </button>
        </div>
      )}
    </div>
  );
};
