import React, { useState } from 'react';
import { ReviewItem } from '../../types';
import { X, Volume2, RotateCcw, Sparkles, Heart } from 'lucide-react';

interface ReviewDeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ReviewItem[];
  onRefillHearts: () => void;
}

export const ReviewDeckModal: React.FC<ReviewDeckModalProps> = ({
  isOpen,
  onClose,
  items,
  onRefillHearts
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen) return null;

  const currentItem = items[currentIndex] || {
    term: '안녕하세요 (Annyeonghaseyo)',
    translation: 'Hello / Good day',
    language: 'ko',
    phonetic: 'an-nyeong-ha-se-yo'
  };

  const speakAudio = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-lg p-6 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={22} />
        </button>

        <div className="text-center space-y-1">
          <h2 className="font-brand text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
            <Sparkles size={22} className="text-amber-400" /> Spaced-Repetition Review Deck
          </h2>
          <p className="text-xs text-slate-400">
            Practice previously learned phrases to solidify memory & refill your Hearts!
          </p>
        </div>

        {/* Flashcard Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="min-h-56 bg-slate-950/90 border border-sky-500/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:border-sky-400 transition-all shadow-2xl relative"
        >
          <span className="absolute top-3 right-3 text-[10px] text-sky-400 font-bold uppercase tracking-wider bg-sky-950 px-2 py-0.5 rounded-full border border-sky-800">
            Tap to Flip 🔄
          </span>

          {!isFlipped ? (
            <div className="space-y-2 animate-fadeIn">
              <span className="text-xs text-slate-400 block uppercase font-bold">Front Script</span>
              <div className="text-3xl font-bold text-slate-100 font-kr font-jp">{currentItem.term}</div>
              {currentItem.phonetic && (
                <div className="text-xs text-sky-300 font-mono">[{currentItem.phonetic}]</div>
              )}
            </div>
          ) : (
            <div className="space-y-2 animate-fadeIn">
              <span className="text-xs text-emerald-400 block uppercase font-bold">Translation / Meaning</span>
              <div className="text-2xl font-bold text-emerald-300">{currentItem.translation}</div>
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              speakAudio(currentItem.term, currentItem.language);
            }}
            className="mt-4 p-2 rounded-full bg-slate-900 border border-slate-700 text-sky-400 hover:bg-slate-800"
            title="Listen Audio"
          >
            <Volume2 size={20} />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onRefillHearts();
              alert("❤️ Hearts fully refilled! Great job reviewing your deck!");
            }}
            className="glass-button bg-rose-950/80 border-rose-800 text-rose-300 text-xs py-2.5 px-4 hover:bg-rose-900"
          >
            <Heart size={16} fill="#f43f5e" /> Practice to Refill Hearts
          </button>

          <button
            onClick={handleNext}
            className="glass-button btn-primary text-xs py-2.5 px-5"
          >
            Next Card <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
