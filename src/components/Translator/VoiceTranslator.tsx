import React, { useState } from 'react';
import { LanguageTrack, ReviewItem } from '../../types';
import { Mic, Volume2, Bookmark, BookmarkCheck, ArrowRightLeft, Sparkles, X } from 'lucide-react';
import { checkAndCensorText, triggerEthicalWarning } from '../../lib/ethicalGuard';

interface VoiceTranslatorProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveToReview: (item: Omit<ReviewItem, 'id' | 'interval' | 'easeFactor' | 'nextReviewAt'>) => void;
}

export const VoiceTranslator: React.FC<VoiceTranslatorProps> = ({
  isOpen,
  onClose,
  onSaveToReview
}) => {
  const [sourceLang, setSourceLang] = useState<LanguageTrack>('en');
  const [targetLang, setTargetLang] = useState<LanguageTrack>('ko');
  const [inputText, setInputText] = useState<string>('Hello, where is the cat?');
  const [translatedText, setTranslatedText] = useState<string>('안녕하세요, 고양이는 어디에 있나요?');
  const [phonetic, setPhonetic] = useState<string>('Annyeonghaseyo, goyang-ineun eodie issnayo?');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleTranslate = (textOverride?: string) => {
    const raw = textOverride !== undefined ? textOverride : inputText;
    const check = checkAndCensorText(raw);
    if (check.hasInappropriate) {
      triggerEthicalWarning();
    }
    const cleanInput = check.censoredText;
    if (cleanInput !== inputText) {
      setInputText(cleanInput);
    }

    // Simulated instant translation engine for popular English/Japanese/Korean phrases
    if (sourceLang === 'en' && targetLang === 'ko') {
      if (cleanInput.toLowerCase().includes('hello') || cleanInput.toLowerCase().includes('cat')) {
        setTranslatedText('안녕하세요, 귀여운 고양이입니다!');
        setPhonetic('Annyeonghaseyo, gwiyeoun goyangi-imnida!');
      } else {
        setTranslatedText('오늘 날씨가 정말 좋네요.');
        setPhonetic('Oneul nalssiga jeongmal johneyo.');
      }
    } else if (sourceLang === 'en' && targetLang === 'ja') {
      setTranslatedText('こんにちは、可愛い猫はどこですか？');
      setPhonetic('Konnichiwa, kawaii neko wa doko desu ka?');
    } else {
      setTranslatedText('Hello, nice to meet you!');
      setPhonetic('Hel-lo, nice to meet you!');
    }
    setIsSaved(false);
  };

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Voice recognition is simulated in this browser session. Speak standard phrase.");
      setIsListening(true);
      setTimeout(() => {
        setIsListening(false);
        handleTranslate();
      }, 1500);
      return;
    }

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = sourceLang === 'ko' ? 'ko-KR' : sourceLang === 'ja' ? 'ja-JP' : 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        handleTranslate(transcript);
      };
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  const speakText = (text: string, lang: LanguageTrack) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'ko' ? 'ko-KR' : lang === 'ja' ? 'ja-JP' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSaveCard = () => {
    onSaveToReview({
      term: translatedText,
      translation: inputText,
      language: targetLang,
      phonetic: phonetic
    });
    setIsSaved(true);
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-xl p-6 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={22} />
        </button>

        <div className="flex items-center gap-2 text-sky-400 font-brand font-bold text-xl">
          <Sparkles size={22} /> Voice-Command Translator
        </div>

        {/* Language Selection Switcher */}
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
          <select
            value={sourceLang}
            onChange={(e) => {
              const newSource = e.target.value as LanguageTrack;
              if (newSource === targetLang) {
                const prevSource = sourceLang;
                setSourceLang(newSource);
                setTargetLang(prevSource);
              } else {
                setSourceLang(newSource);
              }
            }}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-semibold"
          >
            <option value="en">English 🇺🇸</option>
            <option value="ko">Korean 🇰🇷</option>
            <option value="ja">Japanese 🇯🇵</option>
          </select>

          <button
            onClick={() => {
              const temp = sourceLang;
              setSourceLang(targetLang);
              setTargetLang(temp);
            }}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 transition-colors"
            title="Swap Languages"
          >
            <ArrowRightLeft size={18} />
          </button>

          <select
            value={targetLang}
            onChange={(e) => {
              const newTarget = e.target.value as LanguageTrack;
              if (newTarget === sourceLang) {
                const prevTarget = targetLang;
                setTargetLang(newTarget);
                setSourceLang(prevTarget);
              } else {
                setTargetLang(newTarget);
              }
            }}
            className="bg-slate-900 text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-semibold"
          >
            <option value="ko">Korean 🇰🇷</option>
            <option value="ja">Japanese 🇯🇵</option>
            <option value="en">English 🇺🇸</option>
          </select>
        </div>

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Input Phrase or Speak</span>
            <button
              onClick={startVoiceInput}
              className={`flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-semibold transition-all ${
                isListening
                  ? 'bg-rose-600 border-rose-400 text-white animate-pulse'
                  : 'bg-sky-950 border-sky-800 text-sky-300 hover:bg-sky-900'
              }`}
            >
              <Mic size={14} /> {isListening ? 'Listening...' : 'Voice Input'}
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type or speak phrase to translate..."
            className="w-full h-24 bg-slate-950/80 border border-slate-800 rounded-xl p-3 text-slate-100 text-sm focus:outline-none focus:border-sky-500 font-sans resize-none"
          />
        </div>

        <button
          onClick={() => handleTranslate()}
          className="w-full glass-button btn-primary py-2.5 text-sm justify-center"
        >
          Translate Phrase
        </button>

        {/* Translation Output Card */}
        {translatedText && (
          <div className="bg-slate-950 p-4 rounded-xl border border-sky-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block">Translation</span>
                <div className="text-2xl font-bold text-slate-100 font-kr font-jp mt-1">{translatedText}</div>
                {phonetic && <div className="text-xs text-slate-400 font-mono mt-0.5">{phonetic}</div>}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => speakText(translatedText, targetLang)}
                  className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700"
                  title="Listen Audio"
                >
                  <Volume2 size={18} />
                </button>

                <button
                  onClick={handleSaveCard}
                  disabled={isSaved}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                    isSaved
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-amber-950/80 hover:bg-amber-900 border-amber-800 text-amber-300'
                  }`}
                >
                  {isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
                  {isSaved ? 'Saved!' : 'Save Flashcard'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
