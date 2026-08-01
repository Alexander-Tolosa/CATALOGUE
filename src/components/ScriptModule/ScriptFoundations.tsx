import React, { useState } from 'react';
import { LanguageTrack } from '../../types';
import { KOREAN_FOUNDATIONS } from '../../data/koreanData';
import { JAPANESE_FOUNDATIONS } from '../../data/japaneseData';
import { ENGLISH_FOUNDATIONS } from '../../data/englishData';
import { StrokeTracingCanvas } from './StrokeTracingCanvas';
import { Volume2, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ScriptFoundationsProps {
  language: LanguageTrack;
  onFinishFoundations: () => void;
}

export const ScriptFoundations: React.FC<ScriptFoundationsProps> = ({
  language,
  onFinishFoundations
}) => {
  const [selectedChar, setSelectedChar] = useState<string>(
    language === 'ko' ? 'ㄱ' : language === 'ja' ? 'あ' : 'A'
  );
  const [selectedBlock, setSelectedBlock] = useState<{ consonant: string; vowel: string }>({
    consonant: 'ㄱ',
    vowel: 'ㅏ'
  });

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="glass-panel p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-sky-400 uppercase tracking-widest">
            <Sparkles size={14} /> Script & Foundations Module
          </div>
          <h2 className="font-brand text-2xl font-bold text-slate-100 mt-1">
            {language === 'ko' && KOREAN_FOUNDATIONS.title}
            {language === 'ja' && JAPANESE_FOUNDATIONS.title}
            {language === 'en' && ENGLISH_FOUNDATIONS.title}
          </h2>
          <p className="text-sm text-slate-400">
            {language === 'ko' && KOREAN_FOUNDATIONS.subtitle}
            {language === 'ja' && JAPANESE_FOUNDATIONS.subtitle}
            {language === 'en' && ENGLISH_FOUNDATIONS.subtitle}
          </p>
        </div>

        <button
          onClick={onFinishFoundations}
          className="glass-button btn-primary text-sm shrink-0"
        >
          Continue to Skill Tree <ArrowRight size={16} />
        </button>
      </div>

      {/* Main Content split into Tracing & Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Character Grid */}
        <div className="md:col-span-7 space-y-5">
          {language === 'ko' && (
            <>
              {/* Korean Block Building Interactive Sandbox */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Interactive Hangul Block Constructor
                </h3>

                <div className="flex items-center justify-center gap-4 bg-slate-950 p-4 rounded-xl border border-sky-500/30">
                  <div className="text-center">
                    <span className="text-xs text-slate-400 block">Consonant</span>
                    <span className="text-3xl font-bold text-sky-400 font-kr">{selectedBlock.consonant}</span>
                  </div>
                  <span className="text-xl font-bold text-slate-500">+</span>
                  <div className="text-center">
                    <span className="text-xs text-slate-400 block">Vowel</span>
                    <span className="text-3xl font-bold text-amber-400 font-kr">{selectedBlock.vowel}</span>
                  </div>
                  <span className="text-xl font-bold text-slate-500">=</span>
                  <div className="text-center bg-sky-950/80 px-5 py-2 rounded-xl border border-sky-400/50 shadow-lg">
                    <span className="text-xs text-slate-300 block">Syllable Block</span>
                    <span className="text-4xl font-extrabold text-white font-kr">
                      {selectedBlock.consonant === 'ㄱ' && selectedBlock.vowel === 'ㅏ' ? '가' :
                       selectedBlock.consonant === 'ㄴ' && selectedBlock.vowel === 'ㅏ' ? '나' :
                       selectedBlock.consonant === 'ㄷ' && selectedBlock.vowel === 'ㅏ' ? '다' :
                       selectedBlock.consonant === 'ㅇ' && selectedBlock.vowel === 'ㅜ' ? '우' : '가'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Pick Consonant:</label>
                    <div className="flex flex-wrap gap-2">
                      {KOREAN_FOUNDATIONS.consonants.slice(0, 4).map(c => (
                        <button
                          key={c.char}
                          onClick={() => {
                            setSelectedBlock(prev => ({ ...prev, consonant: c.char }));
                            setSelectedChar(c.char);
                          }}
                          className={`w-10 h-10 rounded-lg font-kr font-bold text-lg border transition-all ${
                            selectedBlock.consonant === c.char
                              ? 'bg-sky-500 text-white border-sky-300'
                              : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {c.char}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Pick Vowel:</label>
                    <div className="flex flex-wrap gap-2">
                      {KOREAN_FOUNDATIONS.vowels.map(v => (
                        <button
                          key={v.char}
                          onClick={() => setSelectedBlock(prev => ({ ...prev, vowel: v.char }))}
                          className={`w-10 h-10 rounded-lg font-kr font-bold text-lg border transition-all ${
                            selectedBlock.vowel === v.char
                              ? 'bg-amber-500 text-white border-amber-300'
                              : 'bg-slate-800 text-slate-200 border-slate-700 hover:border-slate-600'
                          }`}
                        >
                          {v.char}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Consonants list */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Basic Consonants
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {KOREAN_FOUNDATIONS.consonants.map(item => (
                    <button
                      key={item.char}
                      onClick={() => {
                        setSelectedChar(item.char);
                        speakText(item.char);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        selectedChar === item.char
                          ? 'bg-sky-950 border-sky-400 text-white shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl font-bold font-kr">{item.char}</span>
                      <span className="text-xs text-slate-400 mt-1">{item.sound}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {language === 'ja' && (
            <>
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Hiragana Vowels
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {JAPANESE_FOUNDATIONS.hiraganaVowels.map(item => (
                    <button
                      key={item.char}
                      onClick={() => {
                        setSelectedChar(item.char);
                        speakText(item.char);
                      }}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        selectedChar === item.char
                          ? 'bg-sky-950 border-sky-400 text-white shadow-lg'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl font-bold font-jp">{item.char}</span>
                      <span className="text-xs text-slate-400 mt-1">{item.romaji}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Essential Kanji Radicals
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {JAPANESE_FOUNDATIONS.kanjiRadicals.map(item => (
                    <div
                      key={item.char}
                      onClick={() => {
                        setSelectedChar(item.char);
                        speakText(item.char);
                      }}
                      className="p-3 rounded-xl border bg-slate-900/60 border-slate-800 flex items-center justify-between cursor-pointer hover:border-sky-500/50"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl font-bold font-jp text-sky-400">{item.char}</span>
                        <div>
                          <div className="text-sm font-semibold text-slate-200">{item.meaning}</div>
                          <div className="text-xs text-slate-400">Onyomi: {item.onyomi}</div>
                        </div>
                      </div>
                      <Volume2 size={18} className="text-slate-400 hover:text-sky-400" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {language === 'en' && (
            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Phonics & Letter Sounds
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {ENGLISH_FOUNDATIONS.vowels.map(item => (
                  <div
                    key={item.char}
                    onClick={() => {
                      setSelectedChar(item.char);
                      speakText(item.example);
                    }}
                    className="p-3 rounded-xl border bg-slate-900/60 border-slate-800 flex items-center justify-between cursor-pointer hover:border-sky-500/50"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl font-bold text-amber-400">{item.char}</span>
                      <div>
                        <div className="text-sm font-semibold text-slate-200">{item.example}</div>
                        <div className="text-xs text-slate-400">Sound: {item.sound}</div>
                      </div>
                    </div>
                    <Volume2 size={18} className="text-slate-400 hover:text-sky-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Interactive Stroke Tracing Practice */}
        <div className="md:col-span-5 flex flex-col items-center justify-center bg-slate-900/40 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 mb-3 text-sm font-semibold text-slate-300">
            <span>Stroke Tracing Practice:</span>
            <span className="text-2xl font-bold text-sky-400 font-kr font-jp">{selectedChar}</span>
            <button
              onClick={() => speakText(selectedChar)}
              className="p-1 rounded-md hover:bg-slate-800 text-sky-400"
              title="Listen Audio"
            >
              <Volume2 size={18} />
            </button>
          </div>

          <StrokeTracingCanvas
            character={selectedChar}
            guideText="Follow the faint outline to practice your stroke order!"
          />
        </div>
      </div>
    </div>
  );
};
