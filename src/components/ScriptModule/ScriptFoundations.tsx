import React, { useState, useMemo, useEffect } from 'react';
import { LanguageTrack } from '../../types';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { KOREAN_FOUNDATIONS } from '../../data/koreanData';
import { JAPANESE_FOUNDATIONS } from '../../data/japaneseData';
import { ENGLISH_FOUNDATIONS } from '../../data/englishData';
import {
  ArrowRight,
  BookOpen,
  Volume2
} from 'lucide-react';

interface ScriptFoundationsProps {
  language: LanguageTrack;
  onFinishFoundations: () => void;
}

// Helper for Korean Syllable Block Unicode Synthesis
function composeHangul(consonant: string, vowel: string): string {
  const choseong = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const jungseong = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const cIndex = choseong.indexOf(consonant);
  const vIndex = jungseong.indexOf(vowel);
  if (cIndex === -1 || vIndex === -1) return consonant + vowel;
  const unicode = 0xac00 + cIndex * 588 + vIndex * 28;
  return String.fromCharCode(unicode);
}

// Standalone Korean consonant/vowel phonetic map for accurate speech synthesis
const KOREAN_TTS_MAP: Record<string, string> = {
  'ㄱ': '기역', 'ㄴ': '니은', 'ㄷ': '디귿', 'ㄹ': '리을', 'ㅁ': '미음',
  'ㅂ': '비읍', 'ㅅ': '시옷', 'ㅇ': '이응', 'ㅈ': '지읒', 'ㅊ': '치읓',
  'ㅋ': '키읔', 'ㅌ': '티읕', 'ㅍ': '피읖', 'ㅎ': '히읗',
  'ㄲ': '쌍기역', 'ㄸ': '쌍디귿', 'ㅃ': '쌍비읍', 'ㅆ': '쌍시옷', 'ㅉ': '쌍지읒',
  'ㅏ': '아', 'ㅐ': '애', 'ㅑ': '야', 'ㅒ': '얘', 'ㅓ': '어',
  'ㅔ': '에', 'ㅕ': '여', 'ㅖ': '예', 'ㅗ': '오', 'ㅘ': '와',
  'ㅙ': '왜', 'ㅚ': '외', 'ㅛ': '요', 'ㅜ': '우', 'ㅝ': '워',
  'ㅞ': '웨', 'ㅟ': '위', 'ㅠ': '유', 'ㅡ': '으', 'ㅢ': '의', 'ㅣ': '이'
};

export const ScriptFoundations: React.FC<ScriptFoundationsProps> = ({
  language,
  onFinishFoundations
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useAppStore();

  // Selected Hangul Consonant & Vowel
  const [selectedBlock, setSelectedBlock] = useState<{ consonant: string; vowel: string }>({
    consonant: 'ㄱ',
    vowel: 'ㅏ'
  });

  // Selected practice character & details
  const [selectedChar, setSelectedChar] = useState<string>(
    language === 'ko' ? '가' : language === 'ja' ? 'あ' : 'A'
  );
  const [selectedRomanization, setSelectedRomanization] = useState<string>(
    language === 'ko' ? 'ga' : language === 'ja' ? 'a' : '[eɪ]'
  );
  const [selectedMeaning, setSelectedMeaning] = useState<string>(
    language === 'ko' ? 'Go / Sentence start' : language === 'ja' ? 'Hiragana vowel A' : 'Letter A (Apple)'
  );

  // Sync initial selection when language prop changes
  useEffect(() => {
    if (language === 'ko') {
      setSelectedChar('가');
      setSelectedRomanization('ga');
      setSelectedMeaning('Go / Sentence start');
    } else if (language === 'ja') {
      setSelectedChar('あ');
      setSelectedRomanization('a');
      setSelectedMeaning('Hiragana vowel A');
    } else {
      setSelectedChar('A');
      setSelectedRomanization('[eɪ]');
      setSelectedMeaning('Letter A (Apple)');
    }
  }, [language]);

  // Compute active composed Hangul block
  const activeSyllableBlock = useMemo(() => {
    return composeHangul(selectedBlock.consonant, selectedBlock.vowel);
  }, [selectedBlock]);

  // Robust, bug-free audio speech synthesis helper with exact native voice selection
  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;

    // 1. Cancel previous speech synthesis to prevent stuttering/queue locks
    window.speechSynthesis.cancel();

    // 2. Format input text (extract single letter if formatted like "A a")
    let targetText = text.trim();
    if (targetText.includes(' ')) {
      targetText = targetText.split(' ')[0];
    }

    // 3. Map standalone Korean consonants/vowels to speakable Korean words
    if (language === 'ko' && KOREAN_TTS_MAP[targetText]) {
      targetText = KOREAN_TTS_MAP[targetText];
    }

    const utterance = new SpeechSynthesisUtterance(targetText);
    const bcp47 = language === 'ko' ? 'ko-KR' : language === 'ja' ? 'ja-JP' : 'en-US';
    utterance.lang = bcp47;
    utterance.rate = 0.85; // Learner-friendly speech rate
    utterance.pitch = 1.0;

    // 4. Select matching native voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v => v.lang.toLowerCase().includes(language));
      if (match) {
        utterance.voice = match;
      }
    }

    window.speechSynthesis.speak(utterance);
  };

  // Handle character click
  const handleSelectCharacter = (char: string, roman: string = '', meaning: string = '') => {
    setSelectedChar(char);
    setSelectedRomanization(roman || char);
    setSelectedMeaning(meaning);
    speakText(char);
  };

  // Master sections for active language
  const masterSections = useMemo(() => {
    if (language === 'ko') {
      const consonants = KOREAN_FOUNDATIONS.consonants.map(c => ({
        char: c.char,
        name: c.name,
        sound: c.sound,
        category: 'consonant',
        guide: c.strokeGuide
      }));
      const vowels = KOREAN_FOUNDATIONS.vowels.map(v => ({
        char: v.char,
        name: v.name,
        sound: v.sound,
        category: 'vowel'
      }));
      const sampleBlocks = KOREAN_FOUNDATIONS.sampleBlocks.map(b => ({
        char: b.block,
        name: b.meaning,
        sound: b.roman,
        category: 'syllable block'
      }));

      return [
        {
          id: 'consonants',
          title: 'consonants',
          subtitle: '/ 19 consonants /',
          gridColsClass: 'grid-cols-7',
          items: consonants
        },
        {
          id: 'vowels',
          title: 'vowels',
          subtitle: '/ 21 vowels /',
          gridColsClass: 'grid-cols-7',
          items: vowels
        },
        {
          id: 'syllable-blocks',
          title: 'syllable blocks',
          subtitle: '/ 14 sample blocks /',
          gridColsClass: 'grid-cols-7',
          items: sampleBlocks
        }
      ];
    } else if (language === 'ja') {
      const hiragana = JAPANESE_FOUNDATIONS.hiraganaVowels.map(h => ({
        char: h.char,
        name: h.romaji,
        sound: h.romaji,
        category: 'hiragana'
      }));
      const katakana = JAPANESE_FOUNDATIONS.katakanaVowels.map(k => ({
        char: k.char,
        name: k.romaji,
        sound: k.romaji,
        category: 'katakana'
      }));
      const kanjiRadicals = JAPANESE_FOUNDATIONS.kanjiRadicals.map(kr => ({
        char: kr.char,
        name: kr.meaning,
        sound: `${kr.onyomi} / ${kr.kunyomi}`,
        category: 'kanji radical'
      }));

      return [
        {
          id: 'hiragana',
          title: 'hiragana (平仮名)',
          subtitle: '/ 46 syllabary letters /',
          gridColsClass: 'grid-cols-5 sm:grid-cols-10',
          items: hiragana
        },
        {
          id: 'katakana',
          title: 'katakana (片仮名)',
          subtitle: '/ 46 syllabary letters /',
          gridColsClass: 'grid-cols-5 sm:grid-cols-10',
          items: katakana
        },
        {
          id: 'kanji-radicals',
          title: 'kanji radicals (部首)',
          subtitle: '/ essential radicals /',
          gridColsClass: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-8',
          items: kanjiRadicals
        }
      ];
    } else {
      const alphabet = ENGLISH_FOUNDATIONS.alphabet.map(item => ({
        char: `${item.char} ${item.lowerChar}`,
        name: item.example,
        sound: `${item.ipa} (${item.sound})`,
        category: 'alphabet'
      }));
      const phonics = ENGLISH_FOUNDATIONS.phonics.map(p => ({
        char: p.combo,
        name: p.example,
        sound: p.sound,
        category: 'phonics'
      }));

      return [
        {
          id: 'alphabet',
          title: 'alphabet a-z',
          subtitle: '/ 26 letters /',
          gridColsClass: 'grid-cols-4 sm:grid-cols-6 md:grid-cols-7',
          items: alphabet
        },
        {
          id: 'phonics',
          title: 'phonics pairings',
          subtitle: '/ essential blends /',
          gridColsClass: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-5',
          items: phonics
        }
      ];
    }
  }, [language]);

  // Flattened master list for active language
  const masterListItems = useMemo(() => {
    return masterSections.flatMap(section => section.items);
  }, [masterSections]);

  // Subtitle based purely on current active language
  const activeSubtitle =
    language === 'ko'
      ? 'Language Level / 언어 단계'
      : language === 'ja'
      ? 'Language Level / 語学レベル'
      : 'Language Level / Foundational Script';

  const activeLanguageTitle =
    language === 'ko'
      ? KOREAN_FOUNDATIONS.title
      : language === 'ja'
      ? JAPANESE_FOUNDATIONS.title
      : ENGLISH_FOUNDATIONS.title;

  return (
    <div className={`p-6 sm:p-8 max-w-6xl mx-auto space-y-8 rounded-3xl transition-all duration-300 ${
      isDarkMode
        ? 'glass-panel bg-[#131b2e]/90 border border-slate-800 shadow-2xl text-slate-100'
        : 'bg-white/95 border border-[#EDE5DA] shadow-xl shadow-stone-200/50 text-[#2B2725]'
    }`}>
      {/* 1. Header Module */}
      <div className={`flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 transition-colors border-b ${
        isDarkMode ? 'border-slate-800/80' : 'border-stone-200'
      }`}>
        <div>
          <div className={`text-xs font-extrabold uppercase tracking-widest ${
            isDarkMode ? 'text-cyan-400' : 'text-sky-600'
          }`}>
            {t.script.title}
          </div>

          <h2 className={`font-brand text-3xl font-extrabold mt-1.5 tracking-tight flex items-center gap-3 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {t.script.title}
          </h2>

          <p className={`text-xs mt-1 flex items-center gap-2 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <span className={isDarkMode ? 'text-slate-300 font-semibold' : 'text-slate-700 font-semibold'}>
              {activeSubtitle}
            </span>
            <span className={isDarkMode ? 'text-slate-600' : 'text-slate-300'}>•</span>
            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
              {activeLanguageTitle}
            </span>
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={onFinishFoundations}
            className="glass-button btn-primary text-xs font-bold py-2.5 px-5 rounded-xl flex items-center gap-2 bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 transition-transform active:scale-95 cursor-pointer"
          >
            {t.script.continueToSkillTree} <ArrowRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. Full-Width Interactive Constructor Block */}
      <div className={`p-6 rounded-2xl border space-y-6 shadow-xl relative overflow-hidden transition-colors ${
        isDarkMode
          ? 'bg-slate-900/60 border-slate-800'
          : 'bg-[#FAF8F5] border-[#EDE5DA] shadow-xs'
      }`}>
        <div className="flex items-center justify-between">
          <div className={`text-xs font-extrabold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            {language === 'ko' && 'Hangul Syllable Block Constructor'}
            {language === 'ja' && 'Japanese Syllabary & Radical Constructor'}
            {language === 'en' && 'English Alphabet & Phonics Constructor'}
          </div>

          <div className={`text-xs flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
            isDarkMode
              ? 'bg-slate-950 border-slate-800 text-slate-400'
              : 'bg-white border-stone-200 text-slate-600 shadow-xs'
          }`}>
            <span>Selected Character:</span>
            <span className={`font-bold text-lg font-kr font-jp ${
              isDarkMode ? 'text-cyan-400' : 'text-sky-600'
            }`}>
              {selectedChar}
            </span>
            <button
              onClick={() => speakText(selectedChar)}
              className={`p-1 rounded transition-colors ${
                isDarkMode
                  ? 'hover:bg-slate-800 text-sky-400'
                  : 'hover:bg-stone-100 text-sky-600'
              }`}
              title="Listen Audio"
            >
              <Volume2 size={16} />
            </button>
          </div>
        </div>

        {/* Korean Script Constructor */}
        {language === 'ko' && (
          <div className="space-y-6">
            {/* Visual Syllable Assembly Box */}
            <div className={`flex flex-wrap items-center justify-center gap-4 sm:gap-8 p-5 rounded-2xl border transition-colors ${
              isDarkMode
                ? 'bg-slate-950/90 border-sky-500/30 shadow-inner'
                : 'bg-white border-sky-200 shadow-sm'
            }`}>
              <div className="text-center">
                <span className={`text-xs uppercase font-semibold block mb-1.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>Consonant (Choseong)</span>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-md transition-colors ${
                  isDarkMode
                    ? 'bg-slate-900 border-sky-500/40 text-sky-400'
                    : 'bg-sky-50/80 border-sky-300 text-sky-600 shadow-xs'
                }`}>
                  <span className="text-4xl font-extrabold font-kr">{selectedBlock.consonant}</span>
                </div>
              </div>

              <span className={`text-3xl font-black ${
                isDarkMode ? 'text-slate-600' : 'text-slate-400'
              }`}>+</span>

              <div className="text-center">
                <span className={`text-xs uppercase font-semibold block mb-1.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>Vowel (Jungseong)</span>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-md transition-colors ${
                  isDarkMode
                    ? 'bg-slate-900 border-amber-500/40 text-amber-400'
                    : 'bg-amber-50/80 border-amber-300 text-amber-600 shadow-xs'
                }`}>
                  <span className="text-4xl font-extrabold font-kr">{selectedBlock.vowel}</span>
                </div>
              </div>

              <span className={`text-3xl font-black ${
                isDarkMode ? 'text-slate-600' : 'text-slate-400'
              }`}>=</span>

              <div className={`text-center px-8 py-3 rounded-2xl border shadow-xl transition-all ${
                isDarkMode
                  ? 'bg-gradient-to-br from-sky-950 via-cyan-950 to-slate-950 border-cyan-400/60 text-white'
                  : 'bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-50 border-sky-300 text-sky-950 shadow-md'
              }`}>
                <span className={`text-xs uppercase font-bold block mb-1 ${
                  isDarkMode ? 'text-cyan-300' : 'text-sky-700'
                }`}>Syllable Block</span>
                <span className={`text-5xl font-black font-kr tracking-wide ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}>
                  {activeSyllableBlock}
                </span>
              </div>
            </div>

            {/* Consonant & Vowel Grids */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-4 rounded-xl border transition-colors ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
              }`}>
                <label className={`text-xs font-bold mb-2.5 flex items-center justify-between ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <span>Pick Consonant (19):</span>
                  <span className={`text-[10px] font-normal ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>Basic & Double</span>
                </label>
                <div className={`flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin ${
                  isDarkMode ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-stone-200'
                }`}>
                  {KOREAN_FOUNDATIONS.consonants.map(c => (
                    <button
                      key={c.char}
                      onClick={() => {
                        const newBlock = { ...selectedBlock, consonant: c.char };
                        setSelectedBlock(newBlock);
                        const composed = composeHangul(c.char, selectedBlock.vowel);
                        handleSelectCharacter(composed, c.sound, `Consonant ${c.name} (${c.sound})`);
                      }}
                      className={`w-11 h-11 rounded-xl font-kr font-bold text-lg border transition-all flex items-center justify-center ${
                        selectedBlock.consonant === c.char
                          ? 'bg-sky-500 text-white border-sky-300 shadow-lg shadow-sky-500/30 scale-105'
                          : isDarkMode
                          ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600 hover:bg-slate-850'
                          : 'bg-stone-50 text-slate-700 border-stone-200 hover:border-stone-300 hover:bg-stone-100 shadow-2xs'
                      }`}
                    >
                      {c.char}
                    </button>
                  ))}
                </div>
              </div>

              <div className={`p-4 rounded-xl border transition-colors ${
                isDarkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-stone-200 shadow-xs'
              }`}>
                <label className={`text-xs font-bold mb-2.5 flex items-center justify-between ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  <span>Pick Vowel (21):</span>
                  <span className={`text-[10px] font-normal ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>Basic & Compound</span>
                </label>
                <div className={`flex flex-wrap gap-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin ${
                  isDarkMode ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-stone-200'
                }`}>
                  {KOREAN_FOUNDATIONS.vowels.map(v => (
                    <button
                      key={v.char}
                      onClick={() => {
                        const newBlock = { ...selectedBlock, vowel: v.char };
                        setSelectedBlock(newBlock);
                        const composed = composeHangul(selectedBlock.consonant, v.char);
                        handleSelectCharacter(composed, v.sound, `Vowel ${v.name} (${v.sound})`);
                      }}
                      className={`w-11 h-11 rounded-xl font-kr font-bold text-lg border transition-all flex items-center justify-center ${
                        selectedBlock.vowel === v.char
                          ? 'bg-amber-500 text-white border-amber-300 shadow-lg shadow-amber-500/30 scale-105'
                          : isDarkMode
                          ? 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-600 hover:bg-slate-850'
                          : 'bg-stone-50 text-slate-700 border-stone-200 hover:border-stone-300 hover:bg-stone-100 shadow-2xs'
                      }`}
                    >
                      {v.char}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dynamic Lesson Description Box */}
            <div className={`p-4 rounded-xl border text-xs space-y-1.5 transition-colors ${
              isDarkMode
                ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                : 'bg-sky-50/80 border-sky-100 text-slate-700 shadow-xs'
            }`}>
              <div className={`font-bold flex items-center gap-2 text-sm ${
                isDarkMode ? 'text-cyan-300' : 'text-sky-800'
              }`}>
                <BookOpen size={16} />
                <span>Lesson: Selected Letter & Block: [{activeSyllableBlock}]</span>
              </div>
              <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Korean characters are syllabic blocks created by pairing an initial consonant with a medial vowel.
                The currently constructed block <span className={`font-bold text-sm ${isDarkMode ? 'text-cyan-300' : 'text-sky-700'}`}>[{activeSyllableBlock}]</span> combines initial consonant{' '}
                <span className={`font-bold ${isDarkMode ? 'text-sky-400' : 'text-sky-600'}`}>{selectedBlock.consonant}</span> with vowel{' '}
                <span className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{selectedBlock.vowel}</span>. Practice saying this syllable aloud and review its position in words!
              </p>
            </div>
          </div>
        )}

        {/* Japanese Script Constructor */}
        {language === 'ja' && (
          <div className="space-y-6">
            <div className={`max-h-60 overflow-y-auto pr-1 grid grid-cols-5 sm:grid-cols-9 md:grid-cols-10 gap-2.5 scrollbar-thin ${
              isDarkMode ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-stone-200'
            }`}>
              {JAPANESE_FOUNDATIONS.hiraganaVowels.map(h => (
                <button
                  key={h.char}
                  onClick={() => handleSelectCharacter(h.char, h.romaji, 'Hiragana Syllabary')}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedChar === h.char
                      ? isDarkMode
                        ? 'bg-sky-950 border-cyan-400 text-white shadow-lg ring-2 ring-cyan-400/40'
                        : 'bg-sky-50 border-sky-400 text-sky-950 shadow-md ring-2 ring-sky-300'
                      : isDarkMode
                      ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      : 'bg-white text-slate-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50 shadow-2xs'
                  }`}
                >
                  <span className={`text-2xl font-bold font-jp ${
                    isDarkMode ? 'text-amber-300' : 'text-amber-600'
                  }`}>{h.char}</span>
                  <span className={`text-[10px] mt-0.5 font-mono ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>{h.romaji}</span>
                </button>
              ))}
            </div>

            <div className={`p-4 rounded-xl border text-xs space-y-1.5 transition-colors ${
              isDarkMode
                ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                : 'bg-sky-50/80 border-sky-100 text-slate-700 shadow-xs'
            }`}>
              <div className={`font-bold flex items-center gap-2 text-sm ${
                isDarkMode ? 'text-cyan-300' : 'text-sky-800'
              }`}>
                <BookOpen size={16} />
                <span>Lesson: Selected Letter & Block: [{selectedChar}]</span>
              </div>
              <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Japanese uses Hiragana for primary phonetic writing, Katakana for foreign loanwords, and Kanji for core concepts.
                Selected character <span className={`font-bold text-sm ${isDarkMode ? 'text-amber-300' : 'text-amber-600'}`}>[{selectedChar}]</span> represents the phonetic sound <span className={`font-semibold font-mono ${isDarkMode ? 'text-cyan-300' : 'text-sky-700'}`}>"{selectedRomanization}"</span>.
              </p>
            </div>
          </div>
        )}

        {/* English Script Constructor */}
        {language === 'en' && (
          <div className="space-y-6">
            <div className={`max-h-64 overflow-y-auto pr-1 grid grid-cols-4 sm:grid-cols-7 md:grid-cols-9 gap-2.5 scrollbar-thin ${
              isDarkMode ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-stone-200'
            }`}>
              {ENGLISH_FOUNDATIONS.alphabet.map(item => (
                <button
                  key={item.char}
                  onClick={() => handleSelectCharacter(`${item.char} ${item.lowerChar}`, item.ipa, item.example)}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    selectedChar.includes(item.char)
                      ? isDarkMode
                        ? 'bg-sky-950 border-cyan-400 text-white shadow-lg ring-2 ring-cyan-400/40'
                        : 'bg-sky-50 border-sky-400 text-sky-950 shadow-md ring-2 ring-sky-300'
                      : isDarkMode
                      ? 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      : 'bg-white text-slate-700 border-stone-200 hover:border-stone-300 hover:bg-stone-50 shadow-2xs'
                  }`}
                >
                  <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-extrabold ${
                      isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                    }`}>{item.char}</span>
                    <span className={`text-sm font-semibold ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`}>{item.lowerChar}</span>
                  </div>
                  <span className={`text-[10px] mt-0.5 font-mono ${
                    isDarkMode ? 'text-cyan-300' : 'text-sky-600 font-medium'
                  }`}>{item.ipa}</span>
                </button>
              ))}
            </div>

            <div className={`p-4 rounded-xl border text-xs space-y-1.5 transition-colors ${
              isDarkMode
                ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                : 'bg-sky-50/80 border-sky-100 text-slate-700 shadow-xs'
            }`}>
              <div className={`font-bold flex items-center gap-2 text-sm ${
                isDarkMode ? 'text-cyan-300' : 'text-sky-800'
              }`}>
                <BookOpen size={16} />
                <span>Lesson: Selected Letter & Block: [{selectedChar}]</span>
              </div>
              <p className={`leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Official International Phonetic Alphabet (IPA) pronunciation for letter <span className={`font-bold text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>[{selectedChar}]</span>: <span className={`font-bold font-mono ${isDarkMode ? 'text-cyan-300' : 'text-sky-700'}`}>{selectedRomanization}</span>. Example word: <span className={`font-semibold ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>{selectedMeaning}</span>.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Full-Width Script Master List */}
      <div className={`p-6 sm:p-8 rounded-2xl border space-y-6 shadow-xl transition-colors ${
        isDarkMode
          ? 'bg-slate-900/60 border-slate-800'
          : 'bg-[#FAF8F5] border-[#EDE5DA] shadow-xs'
      }`}>
        {/* Header */}
        <div>
          <h3 className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            <BookOpen size={16} className={isDarkMode ? 'text-cyan-400' : 'text-sky-600'} />
            Script Master List ({masterListItems.length})
          </h3>
          <p className={`text-xs mt-0.5 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Accurate, comprehensive script list. Click cards to play audio pronunciation.
          </p>
        </div>

        {/* Hangul Header (when active language is Korean) */}
        {language === 'ko' && (
          <div className="text-center pt-2 pb-1">
            <h3 className={`font-brand text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDarkMode ? 'text-slate-100' : 'text-slate-800'
            }`}>
              Hangul
            </h3>
            <p className={`text-xs font-mono tracking-widest mt-0.5 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              /korean alphabet/
            </p>
          </div>
        )}

        {/* Master Sections List */}
        <div className={`space-y-8 max-h-[640px] overflow-y-auto pr-1 scrollbar-thin ${
          isDarkMode ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-stone-200'
        }`}>
          {masterSections.map(section => (
            <div key={section.id} className="space-y-3">
              {/* Section Title */}
              <div className="flex items-center gap-2">
                <h4 className={`text-sm sm:text-base font-bold lowercase tracking-wide ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  {section.title}
                </h4>
                {section.subtitle && (
                  <span className={`text-[11px] font-mono ${
                    isDarkMode ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {section.subtitle}
                  </span>
                )}
              </div>

              {/* Grid of Cards */}
              <div className="overflow-x-auto pb-2 scrollbar-none">
                <div className={`min-w-[520px] sm:min-w-0 grid ${section.gridColsClass} gap-2 sm:gap-2.5`}>
                  {section.items.map(item => {
                    const isSelected = selectedChar === item.char || selectedChar.startsWith(item.char.split(' ')[0]);

                    return (
                      <div
                        key={item.char}
                        onClick={() => handleSelectCharacter(item.char, item.sound, item.name)}
                        className={`py-3 sm:py-4 px-2 rounded-2xl border flex flex-col items-center justify-center text-center transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                          isSelected
                            ? isDarkMode
                              ? 'bg-sky-950 border-cyan-400 text-white ring-2 ring-cyan-400/50 shadow-xl scale-[1.03]'
                              : 'bg-sky-50 border-sky-400 text-sky-950 ring-2 ring-sky-300/80 shadow-md scale-[1.03]'
                            : isDarkMode
                            ? 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300 hover:scale-[1.03] hover:shadow-lg'
                            : 'bg-white border-stone-200/90 text-slate-600 hover:border-stone-300 hover:shadow-md hover:bg-stone-50/80 shadow-xs hover:scale-[1.03]'
                        }`}
                      >
                        {/* Character Symbol */}
                        <span className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold font-kr font-jp my-0.5 group-hover:scale-110 transition-transform ${
                          isSelected
                            ? isDarkMode ? 'text-white' : 'text-sky-900'
                            : isDarkMode ? 'text-slate-100' : 'text-slate-800'
                        }`}>
                          {item.char}
                        </span>

                        {/* Sound & Audio Icon */}
                        <div className="flex items-center justify-center gap-1 mt-1">
                          <span className={`text-[11px] sm:text-xs font-mono font-medium truncate ${
                            isSelected
                              ? isDarkMode ? 'text-cyan-300' : 'text-sky-700 font-bold'
                              : isDarkMode ? 'text-cyan-400/80 group-hover:text-cyan-300' : 'text-sky-700 group-hover:text-sky-800'
                          }`}>
                            {item.sound}
                          </span>
                          <Volume2 size={12} className={`shrink-0 opacity-40 group-hover:opacity-100 transition-opacity ${
                            isSelected
                              ? isDarkMode ? 'text-cyan-300 opacity-100' : 'text-sky-600 opacity-100'
                              : isDarkMode ? 'text-slate-400 group-hover:text-cyan-300' : 'text-slate-400 group-hover:text-sky-600'
                          }`} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
