import React, { useState, useMemo, useEffect } from 'react';
import { LanguageTrack } from '../../types';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { useAppStore } from '../../store/useAppStore';
import { KOREAN_FOUNDATIONS } from '../../data/koreanData';
import { JAPANESE_FOUNDATIONS } from '../../data/japaneseData';
import { ENGLISH_FOUNDATIONS } from '../../data/englishData';
import {
  Globe,
  ArrowRight,
  Search,
  BookOpen,
  Star,
  Award,
  Layers,
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

  // Search & Category Filter for Master List
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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
    setCategoryFilter('all');
    setSearchQuery('');
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

  // Master list data items for active language
  const masterListItems = useMemo(() => {
    if (language === 'ko') {
      const list: Array<{ char: string; name: string; sound: string; category: string; guide?: string }> = [];
      KOREAN_FOUNDATIONS.consonants.forEach(c =>
        list.push({
          char: c.char,
          name: c.name,
          sound: c.sound,
          category: c.name.startsWith('Ssang') ? 'Double Consonant' : 'Consonant',
          guide: c.strokeGuide
        })
      );
      KOREAN_FOUNDATIONS.vowels.forEach(v =>
        list.push({
          char: v.char,
          name: v.name,
          sound: v.sound,
          category: v.direction === 'compound' ? 'Compound Vowel' : 'Vowel'
        })
      );
      KOREAN_FOUNDATIONS.sampleBlocks.forEach(b =>
        list.push({ char: b.block, name: b.meaning, sound: b.roman, category: 'Syllable Block' })
      );
      return list;
    } else if (language === 'ja') {
      const list: Array<{ char: string; name: string; sound: string; category: string; guide?: string }> = [];
      JAPANESE_FOUNDATIONS.hiraganaVowels.forEach(h =>
        list.push({ char: h.char, name: h.romaji, sound: h.romaji, category: 'Hiragana' })
      );
      JAPANESE_FOUNDATIONS.katakanaVowels.forEach(k =>
        list.push({ char: k.char, name: k.romaji, sound: k.romaji, category: 'Katakana' })
      );
      JAPANESE_FOUNDATIONS.kanjiRadicals.forEach(kr =>
        list.push({ char: kr.char, name: kr.meaning, sound: `${kr.onyomi} / ${kr.kunyomi}`, category: 'Kanji Radical' })
      );
      return list;
    } else {
      const list: Array<{ char: string; name: string; sound: string; category: string; guide?: string }> = [];
      ENGLISH_FOUNDATIONS.alphabet.forEach(item =>
        list.push({
          char: `${item.char} ${item.lowerChar}`,
          name: item.example,
          sound: `${item.ipa} (${item.sound})`,
          category: ['A', 'E', 'I', 'O', 'U'].includes(item.char) ? 'Alphabet Vowel' : 'Alphabet Consonant'
        })
      );
      ENGLISH_FOUNDATIONS.phonics.forEach(p =>
        list.push({ char: p.combo, name: p.example, sound: p.sound, category: 'Phonics Pairings' })
      );
      return list;
    }
  }, [language]);

  // Filtered master list based on search and category
  const filteredMasterList = useMemo(() => {
    return masterListItems.filter(item => {
      const matchesSearch =
        item.char.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.sound.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'all' ||
        item.category.toLowerCase().includes(categoryFilter.toLowerCase());

      return matchesSearch && matchesCategory;
    });
  }, [masterListItems, searchQuery, categoryFilter]);

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
          <div className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest ${
            isDarkMode ? 'text-cyan-400' : 'text-sky-600'
          }`}>
            <Globe size={15} /> {t.script.title}
          </div>

          <h2 className={`font-brand text-3xl font-extrabold mt-1.5 tracking-tight flex items-center gap-3 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            {t.script.title}
            <span className={`text-xs font-mono font-normal px-3 py-1 rounded-full border ${
              isDarkMode
                ? 'bg-cyan-950/80 border-cyan-500/40 text-cyan-300'
                : 'bg-sky-50 border-sky-200 text-sky-700 font-semibold'
            }`}>
              {language === 'ko' ? 'Korean (한글 40자)' : language === 'ja' ? 'Japanese (五十音 46자)' : 'English (Alphabet A-Z)'}
            </span>
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

        {/* Level Progression & Action Button */}
        <div className="flex flex-wrap items-center gap-4">
          <div className={`px-4 py-2.5 rounded-2xl flex items-center gap-4 border transition-colors ${
            isDarkMode
              ? 'bg-slate-900/90 border-slate-800 shadow-inner'
              : 'bg-stone-50/90 border-stone-200 shadow-xs'
          }`}>
            <div className="flex flex-col items-start">
              <div className={`flex items-center gap-1.5 text-xs font-bold ${
                isDarkMode ? 'text-slate-200' : 'text-slate-800'
              }`}>
                <Award className="text-amber-500 shrink-0" size={16} />
                <span>Language Level: 1 - Foundational</span>
              </div>
              <div className={`text-[10px] font-mono mt-0.5 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                Total Script Letters: <span className={`font-bold ${isDarkMode ? 'text-cyan-300' : 'text-sky-600'}`}>{masterListItems.length}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={14}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          </div>

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
          <div className={`flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider ${
            isDarkMode ? 'text-slate-200' : 'text-slate-800'
          }`}>
            <Layers size={16} className={isDarkMode ? 'text-cyan-400' : 'text-sky-600'} />
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

      {/* 3. Full-Width Searchable Script Master List */}
      <div className={`p-6 rounded-2xl border space-y-5 shadow-xl transition-colors ${
        isDarkMode
          ? 'bg-slate-900/60 border-slate-800'
          : 'bg-[#FAF8F5] border-[#EDE5DA] shadow-xs'
      }`}>
        {/* Header + Search Bar + Category Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className={`text-sm font-extrabold uppercase tracking-wider flex items-center gap-2 ${
              isDarkMode ? 'text-slate-200' : 'text-slate-800'
            }`}>
              <BookOpen size={16} className={isDarkMode ? 'text-cyan-400' : 'text-sky-600'} />
              Script Master List ({filteredMasterList.length})
            </h3>
            <p className={`text-xs mt-0.5 ${
              isDarkMode ? 'text-slate-400' : 'text-slate-500'
            }`}>
              Accurate, comprehensive script list. Search and click cards to play audio pronunciation.
            </p>
          </div>

          {/* Search Input Box */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className={`absolute left-3.5 top-2.5 ${
              isDarkMode ? 'text-slate-500' : 'text-slate-400'
            }`} />
            <input
              type="text"
              placeholder="Search by letter or sound..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs transition-colors focus:outline-none ${
                isDarkMode
                  ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-cyan-500'
                  : 'bg-white border-stone-200 text-slate-800 placeholder-slate-400 focus:border-sky-500 shadow-2xs'
              }`}
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
              categoryFilter === 'all'
                ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                : isDarkMode
                ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200 shadow-2xs hover:bg-stone-50'
            }`}
          >
            All Items
          </button>

          {language === 'ko' && (
            <>
              <button
                onClick={() => setCategoryFilter('consonant')}
                className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                  categoryFilter === 'consonant'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : isDarkMode
                    ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200 shadow-2xs hover:bg-stone-50'
                }`}
              >
                Consonants (19)
              </button>
              <button
                onClick={() => setCategoryFilter('vowel')}
                className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                  categoryFilter === 'vowel'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : isDarkMode
                    ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200 shadow-2xs hover:bg-stone-50'
                }`}
              >
                Vowels (21)
              </button>
              <button
                onClick={() => setCategoryFilter('syllable block')}
                className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                  categoryFilter === 'syllable block'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : isDarkMode
                    ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200 shadow-2xs hover:bg-stone-50'
                }`}
              >
                Syllable Blocks
              </button>
            </>
          )}

          {language === 'ja' && (
            <>
              <button
                onClick={() => setCategoryFilter('hiragana')}
                className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                  categoryFilter === 'hiragana'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : isDarkMode
                    ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200 shadow-2xs hover:bg-stone-50'
                }`}
              >
                Hiragana (46)
              </button>
              <button
                onClick={() => setCategoryFilter('katakana')}
                className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                  categoryFilter === 'katakana'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : isDarkMode
                    ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200 shadow-2xs hover:bg-stone-50'
                }`}
              >
                Katakana (46)
              </button>
              <button
                onClick={() => setCategoryFilter('kanji radical')}
                className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                  categoryFilter === 'kanji radical'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : isDarkMode
                    ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200 shadow-2xs hover:bg-stone-50'
                }`}
              >
                Kanji Radicals
              </button>
            </>
          )}

          {language === 'en' && (
            <>
              <button
                onClick={() => setCategoryFilter('alphabet')}
                className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                  categoryFilter === 'alphabet'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : isDarkMode
                    ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200 shadow-2xs hover:bg-stone-50'
                }`}
              >
                Alphabet A-Z (26)
              </button>
              <button
                onClick={() => setCategoryFilter('phonics')}
                className={`px-3.5 py-1.5 rounded-xl font-bold shrink-0 transition-colors ${
                  categoryFilter === 'phonics'
                    ? 'bg-sky-500 text-white shadow-md shadow-sky-500/20'
                    : isDarkMode
                    ? 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-stone-200 shadow-2xs hover:bg-stone-50'
                }`}
              >
                Phonics Pairings
              </button>
            </>
          )}
        </div>

        {/* Master Grid */}
        <div className={`max-h-96 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 scrollbar-thin ${
          isDarkMode ? 'scrollbar-thumb-slate-800' : 'scrollbar-thumb-stone-200'
        }`}>
          {filteredMasterList.map(item => {
            const isSelected = selectedChar === item.char || selectedChar.startsWith(item.char.split(' ')[0]);

            return (
              <div
                key={item.char}
                onClick={() => handleSelectCharacter(item.char, item.sound, item.name)}
                className={`p-4 rounded-2xl border flex flex-col items-center justify-between text-left transition-all cursor-pointer relative overflow-hidden group ${
                  isSelected
                    ? isDarkMode
                      ? 'bg-sky-950 border-cyan-400 text-white ring-2 ring-cyan-400/40 shadow-xl scale-[1.02]'
                      : 'bg-sky-50 border-sky-400 text-sky-950 ring-2 ring-sky-300/80 shadow-md scale-[1.02]'
                    : isDarkMode
                    ? 'bg-slate-950/70 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    : 'bg-white border-stone-200/90 text-slate-600 hover:border-stone-300 hover:shadow-md hover:bg-stone-50/80 shadow-xs'
                }`}
              >
                {/* Category Label */}
                <div className={`w-full flex items-center justify-between text-[10px] font-medium mb-1.5 ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                }`}>
                  <span className={`truncate uppercase tracking-wider font-bold ${
                    isDarkMode ? 'text-sky-400/80' : 'text-sky-600'
                  }`}>
                    {item.category}
                  </span>
                </div>

                {/* Character Symbol */}
                <span className={`text-3xl font-extrabold font-kr font-jp my-1 group-hover:scale-110 transition-transform ${
                  isDarkMode ? 'text-slate-100' : 'text-slate-800'
                }`}>
                  {item.char}
                </span>

                {/* Sound / IPA & Audio Icon */}
                <div className={`w-full flex items-center justify-between pt-1 mt-1 border-t ${
                  isDarkMode ? 'border-slate-800/60' : 'border-stone-200'
                }`}>
                  <span className={`text-[11px] truncate font-mono font-medium ${
                    isDarkMode ? 'text-cyan-300/90' : 'text-sky-700'
                  }`}>
                    {item.sound}
                  </span>
                  <Volume2 size={13} className={`shrink-0 transition-colors ${
                    isDarkMode ? 'text-slate-500 hover:text-sky-400' : 'text-slate-400 hover:text-sky-600'
                  }`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
