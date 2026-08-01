import React, { useState } from 'react';
import { LanguageTrack, ReviewItem } from '../../types';

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
  };

  const startVoiceInput = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      handleTranslate();
    }, 1500);
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
    <div className="pt-20 px-4 md:px-8 pb-16 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      {/* Center Translator Canvas */}
      <section className="flex-1 w-full space-y-6">
        {/* Language Selection Capsule */}
        <div className="flex items-center justify-center">
          <div className="bg-[#161b2b] border border-[#5affff]/20 rounded-full px-6 py-2 flex items-center gap-6 shadow-lg">
            <button className="text-xs font-bold text-white flex items-center gap-2">
              <span>{fromLang}</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>

            <button
              onClick={() => {
                const temp = fromLang;
                setFromLang(toLang);
                setToLang(temp);
              }}
              className="text-[#5affff] hover:rotate-180 transition-transform"
            >
              <span className="material-symbols-outlined text-base">swap_horiz</span>
            </button>

            <button className="text-xs font-bold text-white flex items-center gap-2">
              <span>{toLang}</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          </div>
        </div>

        {/* Input Text Box Card */}
        <div className="glass-card rounded-3xl p-8 min-h-56 relative flex flex-col justify-between border border-[#5affff]/20 shadow-2xl">
          <button
            onClick={() => setInputText('')}
            className="absolute top-6 right-6 text-[#bacac9] hover:text-white"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type phrase or tap mic below to speak..."
            className="w-full bg-transparent border-none text-2xl font-display font-bold text-white focus:outline-none resize-none font-sans"
            rows={3}
          />

          {/* Animated Audio Equalizer Waveform Divider */}
          <div className="flex items-center justify-center gap-1 py-2 opacity-60">
            <span className="w-1 h-6 bg-[#5affff] rounded-full animate-pulse" />
            <span className="w-1 h-9 bg-[#5affff] rounded-full animate-pulse delay-75" />
            <span className="w-1 h-4 bg-[#5affff] rounded-full animate-pulse delay-150" />
            <span className="w-1 h-8 bg-[#5affff] rounded-full animate-pulse" />
            <span className="w-1 h-5 bg-[#5affff] rounded-full animate-pulse delay-100" />
          </div>
        </div>

        {/* Translation Output Card */}
        {translatedText && (
          <div className="glass-card rounded-3xl p-8 border border-[#5affff]/40 space-y-6 shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-[#5affff] uppercase tracking-widest block">TRANSLATION</span>
                <div className="text-3xl font-bold text-white font-jp font-kr">{translatedText}</div>
                <div className="text-xs text-[#bacac9] font-mono">{phoneticText}</div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={speakAudio}
                  className="w-12 h-12 rounded-full bg-[#cebdff]/20 text-[#cebdff] hover:bg-[#cebdff]/30 flex items-center justify-center border border-[#cebdff]/30 transition-transform active:scale-95"
                  title="Listen Pronunciation"
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                  </span>
                </button>

                <button
                  onClick={handleSaveCard}
                  disabled={isSaved}
                  className={`w-12 h-12 rounded-full flex items-center justify-center border transition-all active:scale-95 ${
                    isSaved
                      ? 'bg-[#5affff] border-[#5affff] text-[#003737]'
                      : 'bg-[#161b2b] border-[#5affff]/30 text-[#5affff] hover:bg-[#25293a]'
                  }`}
                  title="Save to Flashcard Deck"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: isSaved ? "'FILL' 1" : "'FILL' 0" }}>
                    bookmark
                  </span>
                </button>
              </div>
            </div>

            {/* Topic Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-full bg-[#161b2b] border border-[#5affff]/20 text-[11px] text-[#bacac9] font-medium">
                Formal (Polite)
              </span>
              <span className="px-3 py-1 rounded-full bg-[#161b2b] border border-[#5affff]/20 text-[11px] text-[#bacac9] font-medium">
                Ordering
              </span>
              <span className="px-3 py-1 rounded-full bg-[#161b2b] border border-[#5affff]/20 text-[11px] text-[#bacac9] font-medium">
                Food & Drink
              </span>
            </div>
          </div>
        )}

        {/* Large Floating Mic Record Button */}
        <div className="flex flex-col items-center justify-center pt-4">
          <button
            onClick={startVoiceInput}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening
                ? 'bg-[#ffb4ab] text-[#690005] animate-ping'
                : 'bg-[#5affff] text-[#003737] shadow-[0_0_30px_rgba(90,255,255,0.5)] hover:scale-110 active:scale-95'
            }`}
          >
            <span className="material-symbols-outlined text-3xl font-bold">mic</span>
          </button>
          <span className="text-xs font-bold text-[#5affff] mt-3 tracking-wide">Tap to Speak</span>
        </div>
      </section>

      {/* Right Side History & Sync Panel */}
      <aside className="w-full lg:w-80 space-y-6 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-white">History</h3>
          <button onClick={() => setHistory([])} className="text-xs text-[#5affff] font-bold hover:underline">
            Clear all
          </button>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {history.map((item) => (
            <div key={item.id} className="glass-card p-4 rounded-2xl border border-white/5 space-y-1.5 hover:border-[#5affff]/30">
              <div className="flex items-center justify-between text-[11px] text-[#bacac9]">
                <span>{item.from} → {item.to}</span>
              </div>
              <div className="text-xs font-bold text-white truncate">{item.original}</div>
              <div className="text-xs text-[#5affff] font-jp font-kr">{item.translated}</div>
              <div className="text-[10px] text-[#bacac9]/60 flex items-center gap-1 pt-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                <span>{item.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Sync Anywhere Banner */}
        <div className="glass-card p-6 rounded-2xl border border-[#5affff]/20 text-center space-y-3">
          <h4 className="font-display text-lg font-bold text-white">Sync Anywhere</h4>
          <p className="text-xs text-[#bacac9]">Unlock cross-device history and vocabulary building.</p>
          <button className="w-full py-2.5 bg-[#5affff] text-[#003737] font-extrabold text-xs rounded-xl shadow-lg hover:scale-105 transition-transform">
            Go Pro
          </button>
        </div>
      </aside>
    </div>
  );
};
