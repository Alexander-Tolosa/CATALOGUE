import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createWorker } from 'tesseract.js';
import { LanguageTrack, ReviewItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { FlagIcon } from '../Common/FlagIcon';
import {
  Camera,
  CameraOff,
  Upload,
  RefreshCw,
  Sparkles,
  Volume2,
  BookmarkPlus,
  Check,
  Copy,
  ArrowRightLeft,
  ScanLine,
  Image as ImageIcon,
  Zap,
  HelpCircle,
  FileText,
  Play,
  BookOpen,
  Info
} from 'lucide-react';

interface ScannerViewProps {
  onSaveToReview: (item: Omit<ReviewItem, 'id' | 'interval' | 'easeFactor' | 'nextReviewAt'>) => void;
}

type LangOption = 'English' | 'Japanese' | 'Korean';

const LANG_CONFIG: Record<LangOption, { code: 'us' | 'jp' | 'kr'; trackCode: LanguageTrack; apiCode: string; tesseractLang: string; bcp47: string }> = {
  English: { code: 'us', trackCode: 'en', apiCode: 'en', tesseractLang: 'eng', bcp47: 'en-US' },
  Japanese: { code: 'jp', trackCode: 'ja', apiCode: 'ja', tesseractLang: 'jpn', bcp47: 'ja-JP' },
  Korean: { code: 'kr', trackCode: 'ko', apiCode: 'ko', tesseractLang: 'kor', bcp47: 'ko-KR' }
};

// ==========================================
// Direct Korean / Japanese Lexicon
// ==========================================
interface LexiconEntry {
  translations: Record<LangOption, string>;
  phonetic: string;
}

const COMPREHENSIVE_LEXICON: Record<string, LexiconEntry> = {
  '안녕하세요': {
    translations: { English: 'Hello', Japanese: 'こんにちは', Korean: '안녕하세요' },
    phonetic: 'Annyeonghaseyo'
  },
  '안녕': {
    translations: { English: 'Hi', Japanese: 'こんにちは', Korean: '안녕' },
    phonetic: 'Annyeong'
  },
  '감사합니다': {
    translations: { English: 'Thank you', Japanese: 'ありがとうございます', Korean: '감사합니다' },
    phonetic: 'Gamsahamnida'
  },
  '고맙습니다': {
    translations: { English: 'Thank you', Japanese: 'ありがとうございます', Korean: '고맙습니다' },
    phonetic: 'Gomapseumnida'
  },
  '고마워': {
    translations: { English: 'Thanks', Japanese: 'ありがとう', Korean: '고마워' },
    phonetic: 'Gomawo'
  },
  '죄송합니다': {
    translations: { English: 'I am sorry', Japanese: 'すみません', Korean: '죄송합니다' },
    phonetic: 'Joesonghamnida'
  },
  '미안해요': {
    translations: { English: 'I am sorry', Japanese: 'ごめんなさい', Korean: '미안해요' },
    phonetic: 'Mianhaeyo'
  },
  '미안해': {
    translations: { English: 'Sorry', Japanese: 'ごめん', Korean: '미안해' },
    phonetic: 'Mianhae'
  },
  '실례합니다': {
    translations: { English: 'Excuse me', Japanese: '失礼します', Korean: '실례합니다' },
    phonetic: 'Sillyehamnida'
  },
  '잠시만요': {
    translations: { English: 'Just a moment', Japanese: '少々お待ちください', Korean: '잠시만요' },
    phonetic: 'Jamsimanyo'
  },
  '화장실이 어디예요?': {
    translations: { English: 'Where is the restroom?', Japanese: 'お手洗いはどこですか？', Korean: '화장실이 어디예요?' },
    phonetic: 'Hwajangsiri eodiyeyo?'
  },
  '화장실': {
    translations: { English: 'Restroom', Japanese: 'お手洗い', Korean: '화장실' },
    phonetic: 'Hwajangsil'
  },
  '이거 얼마예요?': {
    translations: { English: 'How much is this?', Japanese: 'これはいくらですか？', Korean: '이거 얼마예요?' },
    phonetic: 'Igeo eolmayeyo?'
  },
  '이거': {
    translations: { English: 'This', Japanese: 'これ', Korean: '이거' },
    phonetic: 'Igeo'
  },
  '얼마예요': {
    translations: { English: 'How much is it?', Japanese: 'いくらですか', Korean: '얼마예요' },
    phonetic: 'Eolmayeyo'
  },
  '물 주세요': {
    translations: { English: 'Water, please', Japanese: 'お水をお願いします', Korean: '물 주세요' },
    phonetic: 'Mul juseyo'
  },
  '물': {
    translations: { English: 'Water', Japanese: '水', Korean: '물' },
    phonetic: 'Mul'
  },
  '주세요': {
    translations: { English: 'Please give me', Japanese: 'ください', Korean: '주세요' },
    phonetic: 'Juseyo'
  },
  '메뉴판 주세요': {
    translations: { English: 'Please give me the menu', Japanese: 'メニューをお願いします', Korean: '메뉴판 주세요' },
    phonetic: 'Menyupan juseyo'
  },
  '메뉴': {
    translations: { English: 'Menu', Japanese: 'メニュー', Korean: '메뉴' },
    phonetic: 'Menyu'
  },
  '맛있어요': {
    translations: { English: 'It is delicious', Japanese: '美味しいです', Korean: '맛있어요' },
    phonetic: 'Masisseoyo'
  },
  '사랑해요': {
    translations: { English: 'I love you', Japanese: '愛しています', Korean: '사랑해요' },
    phonetic: 'Saranghaeyo'
  },
  '네': {
    translations: { English: 'Yes', Japanese: 'はい', Korean: '네' },
    phonetic: 'Ne'
  },
  '아니요': {
    translations: { English: 'No', Japanese: 'いいえ', Korean: '아니요' },
    phonetic: 'Aniyo'
  },
  '도와주세요': {
    translations: { English: 'Please help me', Japanese: '助けてください', Korean: '도와주세요' },
    phonetic: 'Dowajuseyo'
  },
  '안녕히 계세요': {
    translations: { English: 'Goodbye', Japanese: 'さようなら', Korean: '안녕히 계세요' },
    phonetic: 'Annyeonghi gyeseyo'
  },
  '안녕히 가세요': {
    translations: { English: 'Goodbye', Japanese: '行ってらっしゃい', Korean: '안녕히 가세요' },
    phonetic: 'Annyeonghi gaseyo'
  },
  '만나서 반가워요': {
    translations: { English: 'Nice to meet you', Japanese: 'お会いできて嬉しいです', Korean: '만나서 반가워요' },
    phonetic: 'Mannaseo bangawoyo'
  },
  '괜찮아요': {
    translations: { English: "It's okay", Japanese: '大丈夫です', Korean: '괜찮아요' },
    phonetic: 'Gwaenchannayo'
  },
  '모르겠어요': {
    translations: { English: "I don't know", Japanese: 'わかりません', Korean: '모르겠어요' },
    phonetic: 'Moreugesseoyo'
  },
  '알겠어요': {
    translations: { English: 'I understand', Japanese: 'わかりました', Korean: '알겠어요' },
    phonetic: 'Algesseoyo'
  },
  '식당': { translations: { English: 'Restaurant', Japanese: '食堂', Korean: '식당' }, phonetic: 'Sikdang' },
  '카페': { translations: { English: 'Cafe', Japanese: 'カフェ', Korean: '카페' }, phonetic: 'Kape' },
  '병원': { translations: { English: 'Hospital', Japanese: '病院', Korean: '병원' }, phonetic: 'Byeongwon' },
  '약국': { translations: { English: 'Pharmacy', Japanese: '薬局', Korean: '약국' }, phonetic: 'Yakguk' },
  '지하철': { translations: { English: 'Subway', Japanese: '地下鉄', Korean: '지하철' }, phonetic: 'Jihacheol' },
  '출구': { translations: { English: 'Exit', Japanese: '出口', Korean: '출구' }, phonetic: 'Chulgu' },
  '입구': { translations: { English: 'Entrance', Japanese: '入口', Korean: '입구' }, phonetic: 'Ipgu' },
  '고양이': { translations: { English: 'Cat', Japanese: '猫', Korean: '고양이' }, phonetic: 'Goyangi' },
  '강아지': { translations: { English: 'Puppy', Japanese: '子犬', Korean: '강아지' }, phonetic: 'Gang-aji' },
  '친구': { translations: { English: 'Friend', Japanese: '友達', Korean: '친구' }, phonetic: 'Chingu' },
  '선생님': { translations: { English: 'Teacher', Japanese: '先生', Korean: '선생님' }, phonetic: 'Seonsaengnim' },
  '학교': { translations: { English: 'School', Japanese: '学校', Korean: '학교' }, phonetic: 'Hakgyo' },
  '오늘': { translations: { English: 'Today', Japanese: '今日', Korean: '오늘' }, phonetic: 'Oneul' },
  '내일': { translations: { English: 'Tomorrow', Japanese: '明日', Korean: '내일' }, phonetic: 'Naeil' },
  '어제': { translations: { English: 'Yesterday', Japanese: '昨日', Korean: '어제' }, phonetic: 'Eoje' },
  'こんにちは': {
    translations: { English: 'Hello', Korean: '안녕하세요', Japanese: 'こんにちは' },
    phonetic: 'Konnichiwa'
  },
  'ありがとうございます': {
    translations: { English: 'Thank you', Korean: '감사합니다', Japanese: 'ありがとうございます' },
    phonetic: 'Arigatou gozaimasu'
  },
  'すみません': {
    translations: { English: 'Excuse me', Korean: '죄송합니다', Japanese: 'すみません' },
    phonetic: 'Sumimasen'
  },
  'ごめんなさい': {
    translations: { English: 'I am sorry', Korean: '미안해요', Japanese: 'ごめんなさい' },
    phonetic: 'Gomennasai'
  },
  '猫': {
    translations: { English: 'Cat', Korean: '고양이', Japanese: '猫 (ねこ)' },
    phonetic: 'Neko'
  },
  '犬': {
    translations: { English: 'Dog', Korean: '개 / 강아지', Japanese: '犬 (いぬ)' },
    phonetic: 'Inu'
  },
  '美味しい': {
    translations: { English: 'Delicious / Tasty', Korean: '맛있어요', Japanese: '美味しい (おいしい)' },
    phonetic: 'Oishii'
  }
};

// Hangul Romanization Engine
const INITIALS = ['g', 'kk', 'n', 'd', 'tt', 'r', 'm', 'b', 'pp', 's', 'ss', '', 'j', 'jj', 'ch', 'k', 't', 'p', 'h'];
const VOWELS = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const FINALS = ['', 'k', 'k', 'k', 'n', 'n', 'n', 't', 'l', 'k', 'm', 'p', 'l', 't', 'p', 'l', 'm', 'p', 'p', 't', 't', 'ng', 't', 't', 'k', 't', 'p', 't'];

function romanizeHangul(char: string): string {
  const code = char.charCodeAt(0);
  if (code >= 0xac00 && code <= 0xd7a3) {
    const syllableIndex = code - 0xac00;
    const initialIndex = Math.floor(syllableIndex / 588);
    const vowelIndex = Math.floor((syllableIndex % 588) / 28);
    const finalIndex = syllableIndex % 28;
    return (INITIALS[initialIndex] || '') + (VOWELS[vowelIndex] || '') + (FINALS[finalIndex] || '');
  }
  return char;
}

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

function generatePhonetic(text: string, lang: LangOption): string {
  if (!text.trim() || lang === 'English') return '';

  const clean = text.trim();
  if (COMPREHENSIVE_LEXICON[clean]?.phonetic) {
    return COMPREHENSIVE_LEXICON[clean].phonetic;
  }

  if (lang === 'Korean') {
    const result = text.split('').map(char => romanizeHangul(char)).join('');
    return result ? result.charAt(0).toUpperCase() + result.slice(1) : '';
  }

  if (lang === 'Japanese') {
    let result = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      result += KANA_ROMAN[char] || char;
    }
    return result ? result.charAt(0).toUpperCase() + result.slice(1) : '';
  }

  return '';
}

function detectLanguageFromText(text: string): LangOption | null {
  if (/[\uAC00-\uD7A3]/.test(text)) return 'Korean';
  if (/[\u3040-\u30FF\u4E00-\u9FAF]/.test(text)) return 'Japanese';
  if (/^[A-Za-z0-9\s.,!?'"-]+$/.test(text) && text.trim().length > 0) return 'English';
  return null;
}

function cleanOcrText(text: string, lang: LangOption): string {
  if (!text) return '';
  let cleaned = text.trim();

  // If Korean: merge accidentally split Korean syllables
  if (lang === 'Korean' || /[\uAC00-\uD7A3]/.test(cleaned)) {
    cleaned = cleaned.replace(/([\uAC00-\uD7A3])\s+([\uAC00-\uD7A3])/g, '$1$2');
    cleaned = cleaned.replace(/([\uAC00-\uD7A3])\s+([\uAC00-\uD7A3])/g, '$1$2');
  }

  // If Japanese: merge split kana
  if (lang === 'Japanese' || /[\u3040-\u30FF\u4E00-\u9FAF]/.test(cleaned)) {
    cleaned = cleaned.replace(/([\u3040-\u30FF\u4E00-\u9FAF])\s+([\u3040-\u30FF\u4E00-\u9FAF])/g, '$1$2');
  }

  return cleaned.replace(/[|~`^]+/g, '').trim();
}

// Canvas Image Preprocessor for High-Accuracy OCR
function preprocessImageForOCR(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(imageSrc);
          return;
        }

        const maxDim = Math.max(img.width, img.height);
        const scale = Math.max(1, Math.min(2.5, 1200 / maxDim));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        ctx.imageSmoothingEnabled = true;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = imgData.data;

        // Grayscale + Contrast normalization
        for (let i = 0; i < d.length; i += 4) {
          const r = d[i];
          const g = d[i + 1];
          const b = d[i + 2];
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          const factor = 1.3;
          let enhanced = factor * (gray - 128) + 128;
          enhanced = Math.max(0, Math.min(255, enhanced));
          d[i] = enhanced;
          d[i + 1] = enhanced;
          d[i + 2] = enhanced;
        }

        ctx.putImageData(imgData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (e) {
        resolve(imageSrc);
      }
    };
    img.onerror = () => resolve(imageSrc);
    img.src = imageSrc;
  });
}

const ALL_LANGS: LangOption[] = ['Japanese', 'Korean', 'English'];

interface CustomLanguageDropdownProps {
  label: string;
  value: LangOption;
  onChange: (val: LangOption) => void;
  options: LangOption[];
  isDarkMode: boolean;
}

const CustomLanguageDropdown: React.FC<CustomLanguageDropdownProps> = ({
  label,
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
    <div className="relative flex-1 min-w-0" ref={dropdownRef}>
      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer min-w-0 ${
          isOpen
            ? 'border-orange-500 shadow-[0_0_20px_rgba(240,101,67,0.3)] bg-orange-500/10 text-orange-400'
            : isDarkMode
            ? 'bg-[#1e293b] border-slate-700 text-white hover:border-orange-500/50 hover:bg-slate-800'
            : 'bg-slate-50 border-slate-200 text-slate-900 hover:border-orange-500/50 hover:bg-white'
        }`}
      >
        <span className="flex items-center gap-2 min-w-0 overflow-hidden">
          <FlagIcon code={LANG_CONFIG[value].code} size="sm" />
          <span className="truncate">{value}</span>
        </span>
        <span
          className={`material-symbols-outlined text-base text-orange-400 shrink-0 transition-transform duration-200 ${
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
            className={`absolute left-0 right-0 top-full z-50 p-1.5 rounded-2xl border shadow-2xl backdrop-blur-xl ${
              isDarkMode
                ? 'bg-[#0f172a]/95 border-slate-700 text-white shadow-black/80'
                : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-300/50'
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
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-orange-500/15 text-[#F06543] border border-orange-500/30'
                      : isDarkMode
                      ? 'text-slate-200 hover:bg-slate-800 hover:text-white'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <FlagIcon code={LANG_CONFIG[opt].code} size="sm" />
                    <span>{opt}</span>
                  </span>
                  {isSelected && (
                    <span className="material-symbols-outlined text-sm text-[#F06543]">
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

export const ScannerView: React.FC<ScannerViewProps> = ({ onSaveToReview }) => {
  const { isDarkMode } = useAppStore();
  const { t } = useTranslation();

  // Mode: Live Camera vs. Uploaded Image
  const [activeMode, setActiveMode] = useState<'camera' | 'upload'>('upload');
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Captured / Uploaded Image Data URL
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // OCR & Translation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const [fromLang, setFromLang] = useState<LangOption>('Korean');
  const [toLang, setToLang] = useState<LangOption>('English');

  const [scannedText, setScannedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [phoneticText, setPhoneticText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [lexiconInsight, setLexiconInsight] = useState<LexiconEntry | null>(null);

  // Interactive Tokens
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedWordTranslation, setSelectedWordTranslation] = useState<string | null>(null);
  const [selectedWordPhonetic, setSelectedWordPhonetic] = useState<string | null>(null);

  // Audio TTS State
  const [isSpeakingSource, setIsSpeakingSource] = useState(false);
  const [isSpeakingTarget, setIsSpeakingTarget] = useState(false);

  // UX Feedback
  const [isSaved, setIsSaved] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [pasteToast, setPasteToast] = useState(false);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global Clipboard Paste Listener (Ctrl+V / Cmd+V)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) {
            e.preventDefault();
            const reader = new FileReader();
            reader.onload = (event) => {
              const dataUrl = event.target?.result as string;
              setCapturedImage(dataUrl);
              setActiveMode('upload');
              setPasteToast(true);
              setTimeout(() => setPasteToast(false), 2500);
              processOCR(dataUrl);
            };
            reader.readAsDataURL(file);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [fromLang, toLang]);

  // Click-to-paste from Clipboard API
  const handlePasteFromClipboard = async () => {
    try {
      if (!navigator.clipboard?.read) {
        alert('Please press Ctrl+V to paste your copied image.');
        return;
      }
      const clipboardItems = await navigator.clipboard.read();
      for (const item of clipboardItems) {
        const imageType = item.types.find((t) => t.startsWith('image/'));
        if (imageType) {
          const blob = await item.getType(imageType);
          const reader = new FileReader();
          reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            setCapturedImage(dataUrl);
            setActiveMode('upload');
            setPasteToast(true);
            setTimeout(() => setPasteToast(false), 2500);
            processOCR(dataUrl);
          };
          reader.readAsDataURL(blob);
          return;
        }
      }
      alert('No image found in your clipboard. Please copy an image or take a screenshot first, then paste!');
    } catch (err) {
      console.warn('Clipboard read error:', err);
    }
  };

  // Drag & Drop Handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setCapturedImage(dataUrl);
        processOCR(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  // Camera Management
  const stopCameraStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCameraStream = useCallback(async () => {
    stopCameraStream();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera stream failed:', err);
      setCameraError(err.message || 'Unable to access camera. Please allow camera permissions or upload an image.');
      setCameraActive(false);
    }
  }, [facingMode, stopCameraStream]);

  // Start / Stop camera based on active mode
  useEffect(() => {
    if (activeMode === 'camera') {
      startCameraStream();
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [activeMode, startCameraStream, stopCameraStream]);

  // =========================================================
  // Multi-Engine Resilient Translation (with offline lexicon)
  // =========================================================
  const performTranslation = useCallback(async (text: string, source: LangOption, target: LangOption) => {
    const clean = text.trim();
    if (!clean) {
      setTranslatedText('');
      setPhoneticText('');
      return;
    }

    setIsTranslating(true);
    setIsSaved(false);

    // Calculate phonetic immediately
    const computedPhonetic = generatePhonetic(clean, source);
    setPhoneticText(computedPhonetic);

    // 1. Instant check against offline lexicon (exact and normalized)
    const normalized = clean.replace(/[.,!?;:~\s"']/g, '').trim();
    const directMatch = COMPREHENSIVE_LEXICON[clean] || COMPREHENSIVE_LEXICON[normalized];
    if (directMatch && directMatch.translations[target]) {
      setTranslatedText(directMatch.translations[target]);
      setPhoneticText(directMatch.phonetic || computedPhonetic);
      setIsTranslating(false);
      return;
    }

    const srcCode = LANG_CONFIG[source].apiCode;
    const tgtCode = LANG_CONFIG[target].apiCode;

    // Engine 1: Google GTX API
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcCode}&tl=${tgtCode}&dt=t&q=${encodeURIComponent(clean)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && Array.isArray(data[0])) {
          const result = data[0].filter((item: any) => item && item[0]).map((item: any) => item[0]).join('');
          if (result.trim()) {
            setTranslatedText(result);
            setIsTranslating(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Google GTX failed, trying secondary engines...', err);
    }

    // Engine 2: Google Dict Client API
    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=${srcCode}&tl=${tgtCode}&dt=t&q=${encodeURIComponent(clean)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && Array.isArray(data[0])) {
          const result = data[0].filter((item: any) => item && item[0]).map((item: any) => item[0]).join('');
          if (result.trim()) {
            setTranslatedText(result);
            setIsTranslating(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Google Dict API failed:', err);
    }

    // Engine 3: MyMemory API
    try {
      const fbRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${srcCode}|${tgtCode}`
      );
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        if (fbData?.responseData?.translatedText) {
          const res = fbData.responseData.translatedText;
          if (res.trim()) {
            setTranslatedText(res);
            setIsTranslating(false);
            return;
          }
        }
      }
    } catch (fbErr) {
      console.warn('MyMemory API failed:', fbErr);
    }

    // Engine 4: Lingva Proxy API
    try {
      const lingvaRes = await fetch(
        `https://lingva.ml/api/v1/${srcCode}/${tgtCode}/${encodeURIComponent(clean)}`
      );
      if (lingvaRes.ok) {
        const lingvaData = await lingvaRes.json();
        if (lingvaData?.translation) {
          setTranslatedText(lingvaData.translation);
          setIsTranslating(false);
          return;
        }
      }
    } catch (lErr) {
      console.warn('Lingva Proxy failed:', lErr);
    }

    // Fallback: Partial word matching or direct clean word
    let partialFound = false;
    for (const [dictWord, dictEntry] of Object.entries(COMPREHENSIVE_LEXICON)) {
      if ((clean.includes(dictWord) || normalized.includes(dictWord)) && dictEntry.translations[target]) {
        setTranslatedText(dictEntry.translations[target]);
        if (dictEntry.phonetic) setPhoneticText(dictEntry.phonetic);
        partialFound = true;
        break;
      }
    }

    if (!partialFound) {
      setTranslatedText(clean);
    }

    setIsTranslating(false);
  }, []);

  // Auto-translate whenever scannedText, fromLang, or toLang changes
  useEffect(() => {
    if (scannedText.trim()) {
      performTranslation(scannedText, fromLang, toLang);
    } else {
      setTranslatedText('');
      setPhoneticText('');
    }
  }, [scannedText, fromLang, toLang, performTranslation]);

  // Run OCR on an Image with Preprocessing
  const processOCR = async (imageSource: string) => {
    setIsScanning(true);
    setScanProgress(10);
    setStatusMessage('Preprocessing image for high optical contrast...');
    setSelectedWord(null);
    setSelectedWordTranslation(null);

    try {
      // Step 1: Canvas Enhancement
      const enhancedSource = await preprocessImageForOCR(imageSource);
      setScanProgress(25);
      setStatusMessage('Loading OCR Neural Engine...');

      // Step 2: Run Tesseract with configured language
      const tesseractLang = LANG_CONFIG[fromLang].tesseractLang;
      const worker = await createWorker(tesseractLang, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pct = Math.floor(m.progress * 65) + 30;
            setScanProgress(Math.min(95, pct));
            setStatusMessage(`Recognizing foreign characters (${Math.floor(m.progress * 100)}%)...`);
          } else if (m.status) {
            setStatusMessage(`${m.status.charAt(0).toUpperCase() + m.status.slice(1)}...`);
          }
        }
      });

      const { data } = await worker.recognize(enhancedSource);
      await worker.terminate();

      let rawExtracted = data.text.trim();
      let cleaned = cleanOcrText(rawExtracted, fromLang);

      // Auto-detect language if mismatch
      const detected = detectLanguageFromText(cleaned);
      let activeFrom = fromLang;
      let activeTo = toLang;

      if (detected && detected !== fromLang) {
        activeFrom = detected;
        setFromLang(detected);
        if (toLang === detected) {
          activeTo = detected === 'English' ? 'Korean' : 'English';
          setToLang(activeTo);
        }
      }

      if (cleaned) {
        setScannedText(cleaned);
        setScanProgress(100);
        setStatusMessage('Text recognized! Generating instant translation...');
        await performTranslation(cleaned, activeFrom, activeTo);
      } else {
        setScannedText('No clear text detected. Please aim closely with good lighting.');
        setStatusMessage('No text found.');
      }
    } catch (err: any) {
      console.error('OCR recognition error:', err);
      setStatusMessage('OCR error. Please try again with higher contrast.');
    } finally {
      setIsScanning(false);
    }
  };

  // Capture Snapshot from Live Video
  const handleCaptureSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;

    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);

    processOCR(dataUrl);
  };

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setCapturedImage(dataUrl);
      processOCR(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // Translate Single Word on Click with Lexicon & API Lookup
  const handleSelectWord = async (word: string) => {
    const cleanWord = word.replace(/[.,!?;:"'(){}\[\]]/g, '').trim();
    if (!cleanWord) return;

    setSelectedWord(cleanWord);
    setSelectedWordTranslation('Looking up definition...');
    setSelectedWordPhonetic(generatePhonetic(cleanWord, fromLang));

    // Check offline dictionary first
    if (COMPREHENSIVE_LEXICON[cleanWord]) {
      const entry = COMPREHENSIVE_LEXICON[cleanWord];
      const match = entry.translations[toLang];
      if (match) {
        setSelectedWordTranslation(match);
        return;
      }
    }

    const srcCode = LANG_CONFIG[fromLang].apiCode;
    const tgtCode = LANG_CONFIG[toLang].apiCode;

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcCode}&tl=${tgtCode}&dt=t&q=${encodeURIComponent(cleanWord)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && data[0][0] && data[0][0][0]) {
          setSelectedWordTranslation(data[0][0][0]);
          return;
        }
      }
    } catch (err) {
      console.warn('Word translation API failed, checking dictionary...', err);
    }

    try {
      const fbRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanWord)}&langpair=${srcCode}|${tgtCode}`
      );
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        if (fbData?.responseData?.translatedText) {
          setSelectedWordTranslation(fbData.responseData.translatedText);
          return;
        }
      }
    } catch (e) {
      console.warn('Fallback failed:', e);
    }

    setSelectedWordTranslation(cleanWord);
  };

  // Audio Speech Synthesis
  const handleSpeak = (text: string, lang: LangOption, isSource: boolean) => {
    if (!text.trim() || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANG_CONFIG[lang].bcp47;
    utterance.rate = 0.9;

    if (isSource) {
      setIsSpeakingSource(true);
      utterance.onend = () => setIsSpeakingSource(false);
      utterance.onerror = () => setIsSpeakingSource(false);
    } else {
      setIsSpeakingTarget(true);
      utterance.onend = () => setIsSpeakingTarget(false);
      utterance.onerror = () => setIsSpeakingTarget(false);
    }

    window.speechSynthesis.speak(utterance);
  };

  // Save to Review Deck
  const handleSaveToReview = () => {
    const term = scannedText.trim();
    const translation =
      translatedText ||
      COMPREHENSIVE_LEXICON[term]?.translations[toLang] ||
      COMPREHENSIVE_LEXICON[term.replace(/[.,!?;:~\s"']/g, '')]?.translations[toLang] ||
      term;
    if (!term || !translation) return;

    const phonetic =
      phoneticText ||
      COMPREHENSIVE_LEXICON[term]?.phonetic ||
      COMPREHENSIVE_LEXICON[term.replace(/[.,!?;:~\s"']/g, '')]?.phonetic ||
      generatePhonetic(term, fromLang);

    onSaveToReview({
      term,
      translation,
      language: LANG_CONFIG[toLang].trackCode,
      phonetic: phonetic || undefined
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Copy Translation
  const handleCopy = () => {
    const term = scannedText.trim();
    const textToCopy =
      translatedText ||
      COMPREHENSIVE_LEXICON[term]?.translations[toLang] ||
      COMPREHENSIVE_LEXICON[term.replace(/[.,!?;:~\s"']/g, '')]?.translations[toLang] ||
      term;
    if (!textToCopy) return;
    navigator.clipboard.writeText(textToCopy);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2000);
  };

  // Swap Languages
  const handleSwapLanguages = () => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
    if (scannedText) {
      performTranslation(scannedText, toLang, temp);
    }
  };

  // Break text into interactive word tokens
  const wordsList: string[] = useMemo(() => {
    if (!scannedText) return [];
    return scannedText.split(/\s+/).filter(Boolean);
  }, [scannedText]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 px-2 sm:px-4">
      {/* Top Header Card */}
      <div className={`p-5 rounded-3xl border transition-all ${
        isDarkMode ? 'bg-[#0f172a]/90 border-[#1e293b] text-white shadow-xl' : 'bg-white border-slate-200 text-slate-800 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#F06543] to-[#F97316] flex items-center justify-center text-white shadow-md shadow-orange-500/20">
              <span className="material-symbols-outlined text-2xl">document_scanner</span>
            </div>
            <div>
              <h1 className="font-display font-extrabold text-xl tracking-tight flex items-center gap-2">
                {t.scanner.title}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-[#F06543] border border-orange-500/30 uppercase tracking-wider">
                  AI OCR Vision
                </span>
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {t.scanner.subtitle}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className={`flex items-center p-1 rounded-2xl border self-start md:self-auto ${
            isDarkMode ? 'bg-[#1e293b]/70 border-slate-700' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => {
                setActiveMode('camera');
                setCapturedImage(null);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'camera'
                  ? 'bg-[#F06543] text-white shadow-md'
                  : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Camera size={14} />
              <span>{t.scanner.liveCamera}</span>
            </button>
            <button
              onClick={() => setActiveMode('upload')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeMode === 'upload'
                  ? 'bg-[#F06543] text-white shadow-md'
                  : isDarkMode ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload size={14} />
              <span>{t.scanner.uploadPhoto}</span>
            </button>
          </div>
        </div>

        {/* Language Selection Ribbon */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-[280px]">
            {/* Source Language Custom Dropdown */}
            <CustomLanguageDropdown
              label={t.scanner.scanFrom}
              value={fromLang}
              onChange={(newFrom) => {
                if (newFrom === toLang) {
                  const prevFrom = fromLang;
                  setFromLang(newFrom);
                  setToLang(prevFrom);
                  if (scannedText) performTranslation(scannedText, newFrom, prevFrom);
                } else {
                  setFromLang(newFrom);
                  if (scannedText) performTranslation(scannedText, newFrom, toLang);
                }
              }}
              options={ALL_LANGS}
              isDarkMode={isDarkMode}
            />

            {/* Swap Button */}
            <button
              onClick={handleSwapLanguages}
              className="mt-4 p-2 rounded-xl border border-orange-500/30 text-[#F06543] hover:bg-orange-500/10 transition-colors cursor-pointer"
              title="Swap Languages"
            >
              <ArrowRightLeft size={16} />
            </button>

            {/* Target Language Custom Dropdown */}
            <CustomLanguageDropdown
              label={t.scanner.translateTo}
              value={toLang}
              onChange={(newTo) => {
                if (newTo === fromLang) {
                  const prevTo = toLang;
                  setToLang(newTo);
                  setFromLang(prevTo);
                  if (scannedText) performTranslation(scannedText, prevTo, newTo);
                } else {
                  setToLang(newTo);
                  if (scannedText) performTranslation(scannedText, fromLang, newTo);
                }
              }}
              options={ALL_LANGS}
              isDarkMode={isDarkMode}
            />
          </div>
        </div>
      </div>

      {/* Toast banner for pasted screenshot */}
      <AnimatePresence>
        {pasteToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#F06543] to-[#F97316] text-white font-bold text-xs shadow-xl flex items-center gap-2 border border-white/20 backdrop-blur-md"
          >
            <span className="material-symbols-outlined text-base">content_paste</span>
            <span>Image pasted from clipboard! Scanning text...</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Scanner Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Camera Viewport / Photo Uploader (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className={`relative rounded-3xl overflow-hidden border aspect-[4/3] flex items-center justify-center ${
            isDarkMode ? 'bg-black border-[#1e293b]' : 'bg-slate-900 border-slate-200'
          }`}>
            {activeMode === 'camera' ? (
              cameraActive ? (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />

                  {/* Cyberpunk HUD Viewfinder & Laser Scanning Overlay */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6">
                    {/* Viewfinder Target Box */}
                    <div className="relative w-4/5 h-3/5 border-2 border-orange-500/50 rounded-2xl shadow-[0_0_20px_rgba(240,101,67,0.3)]">
                      {/* Corner Accents */}
                      <span className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-orange-400" />
                      <span className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-orange-400" />
                      <span className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-orange-400" />
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-orange-400" />

                      {/* Animated Laser Scanning Line */}
                      <motion.div
                        animate={{ y: ['0%', '100%', '0%'] }}
                        transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                        className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_8px_#F06543]"
                      />

                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white tracking-wider">
                        ALIGN WORDS IN FRAME
                      </div>
                    </div>
                  </div>

                  {/* Top Camera Controls Overlay */}
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <button
                      onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md text-white hover:bg-black/80 transition-colors cursor-pointer"
                      title="Flip Camera"
                    >
                      <RefreshCw size={16} />
                    </button>
                    <button
                      onClick={stopCameraStream}
                      className="p-2 rounded-full bg-black/60 backdrop-blur-md text-rose-400 hover:bg-rose-950/60 transition-colors cursor-pointer"
                      title="Pause Camera"
                    >
                      <CameraOff size={16} />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-6 space-y-3">
                  <div className="w-16 h-16 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center mx-auto text-orange-400">
                    <Camera size={28} />
                  </div>
                  <h3 className="font-bold text-sm text-white">Camera is Inactive</h3>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">
                    {cameraError || 'Click below to turn on the camera stream and scan vocabulary.'}
                  </p>
                  <button
                    onClick={startCameraStream}
                    className="py-2 px-4 rounded-xl bg-[#F06543] text-white font-bold text-xs shadow-lg hover:brightness-110 cursor-pointer"
                  >
                    Start Camera
                  </button>
                </div>
              )
            ) : (
              /* Photo Upload Mode */
              <div className="text-center p-4 sm:p-6 space-y-3 w-full h-full flex flex-col items-center justify-center">
                {capturedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img src={capturedImage} alt="Uploaded text preview" className="max-h-full max-w-full object-contain rounded-xl" />
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        setScannedText('');
                        setTranslatedText('');
                      }}
                      className="absolute top-2 right-2 py-1 px-3 rounded-lg bg-black/70 text-white text-xs font-bold hover:bg-black/90 cursor-pointer"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`w-full h-full border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${
                      isDragging
                        ? 'border-orange-500 bg-orange-500/10 scale-[0.99]'
                        : isDarkMode
                        ? 'border-slate-700 hover:border-orange-500/70 bg-slate-900/40'
                        : 'border-slate-300 hover:border-orange-500/70 bg-slate-50/70'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3">
                      <ImageIcon size={28} />
                    </div>
                    <h3 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      Drop Image Here or Paste (Ctrl+V)
                    </h3>
                    <p className="text-xs text-slate-400 max-w-xs mt-1">
                      Supports JPG, PNG, WebP screenshots, receipts, product packaging or study notes.
                    </p>
                    <div className="mt-4 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                            : 'bg-white border-slate-300 text-slate-700 hover:text-slate-900 shadow-xs'
                        }`}
                      >
                        <Upload size={14} />
                        <span>Browse Files</span>
                      </button>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}

            {/* Hidden Canvas for snapshot extraction */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Shutter / Action Controls */}
          {activeMode === 'camera' && cameraActive && (
            <div className="flex items-center justify-center gap-4 pt-1">
              <button
                onClick={handleCaptureSnapshot}
                disabled={isScanning}
                className="py-3 px-8 rounded-2xl bg-gradient-to-r from-[#F06543] to-[#F97316] text-white font-extrabold text-sm shadow-[0_4px_20px_rgba(240,101,67,0.4)] flex items-center gap-2.5 hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
              >
                <ScanLine size={18} />
                <span>{isScanning ? 'Processing Frame...' : t.scanner.snapAndTranslate}</span>
              </button>
            </div>
          )}

          {/* OCR Progress Bar */}
          {isScanning && (
            <div className={`p-4 rounded-2xl border space-y-2 ${
              isDarkMode ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-2 text-orange-400">
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  <span>{statusMessage}</span>
                </span>
                <span className="text-[#F06543]">{scanProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-300"
                  style={{ width: `${Math.max(5, scanProgress)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Scanned Text & Translation Output (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Scanned Original Text Card */}
          <div className={`p-5 rounded-3xl border transition-all ${
            isDarkMode ? 'bg-[#0f172a]/90 border-[#1e293b]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDarkMode ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <span className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <FlagIcon code={LANG_CONFIG[fromLang].code} size="sm" />
                <span>{t.scanner.extractedText} ({fromLang})</span>
              </span>

              {scannedText && (
                <button
                  onClick={() => handleSpeak(scannedText, fromLang, true)}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSpeakingSource
                      ? 'bg-orange-500 text-white border-orange-500'
                      : isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
                  }`}
                  title="Play pronunciation"
                >
                  <Volume2 size={14} />
                  <span>Listen</span>
                </button>
              )}
            </div>

            {/* Textarea for manual editing / viewing */}
            <div className="mt-3">
              <textarea
                value={scannedText}
                onChange={(e) => {
                  setScannedText(e.target.value);
                }}
                placeholder="Scanned words will appear here. You can also edit or type manually..."
                rows={3}
                className={`w-full p-3 rounded-2xl text-sm font-medium border resize-none focus:outline-hidden transition-all ${
                  isDarkMode
                    ? 'bg-[#131b2e] border-slate-800 text-white focus:border-orange-500'
                    : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-orange-500'
                }`}
              />
            </div>

            {/* Interactive Word Breakdown Pills */}
            {wordsList.length > 0 && (
              <div className={`mt-3 pt-3 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    Tap Word For Single Breakdown:
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto no-scrollbar">
                  {wordsList.map((word, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectWord(word)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        selectedWord === word.replace(/[.,!?;:"'(){}\[\]]/g, '').trim()
                          ? 'bg-orange-500 text-white shadow-xs'
                          : isDarkMode
                          ? 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {word}
                    </button>
                  ))}
                </div>

                {/* Selected Single Word Translation Banner */}
                {selectedWord && (
                  <div className={`mt-2.5 p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs animate-fadeIn ${
                    isDarkMode ? 'bg-orange-950/30 border-orange-500/30 text-orange-300' : 'bg-orange-50 border-orange-200 text-orange-900'
                  }`}>
                    <div className="flex items-center gap-2 truncate">
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{selectedWord}:</span>
                      {selectedWordPhonetic && (
                        <span className="text-[11px] text-orange-500 font-mono">[{selectedWordPhonetic}]</span>
                      )}
                      <span className={`truncate font-semibold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        {selectedWordTranslation}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        onSaveToReview({
                          term: selectedWord,
                          translation: selectedWordTranslation || '',
                          language: LANG_CONFIG[toLang].trackCode,
                          phonetic: selectedWordPhonetic || undefined
                        });
                        setIsSaved(true);
                        setTimeout(() => setIsSaved(false), 2000);
                      }}
                      className="px-2 py-0.5 rounded-md bg-[#F06543] text-white font-bold text-[10px] shrink-0 cursor-pointer"
                    >
                      Save Word
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Translation Result Card */}
          <div className={`p-5 rounded-3xl border transition-all relative overflow-hidden ${
            isDarkMode ? 'bg-[#0f172a]/90 border-[#1e293b]' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className={`flex items-center justify-between pb-3 border-b ${
              isDarkMode ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <span className={`text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <FlagIcon code={LANG_CONFIG[toLang].code} size="sm" />
                <span>{toLang} Translation</span>
              </span>

              <div className="flex items-center gap-1.5">
                {(translatedText || scannedText) && (
                  <>
                    <button
                      onClick={() => {
                        const term = scannedText.trim();
                        const wordToSpeak =
                          translatedText ||
                          COMPREHENSIVE_LEXICON[term]?.translations[toLang] ||
                          COMPREHENSIVE_LEXICON[term.replace(/[.,!?;:~\s"']/g, '')]?.translations[toLang] ||
                          term;
                        handleSpeak(wordToSpeak, toLang, false);
                      }}
                      className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isSpeakingTarget
                          ? 'bg-orange-500 text-white border-orange-500'
                          : isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
                      }`}
                      title="Play Translation Pronunciation"
                    >
                      <Volume2 size={14} />
                    </button>
                    <button
                      onClick={handleCopy}
                      className={`p-1.5 rounded-lg border text-xs font-bold transition-colors cursor-pointer ${
                        copiedToast
                          ? 'bg-emerald-500 text-white border-emerald-500'
                          : isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          : 'bg-slate-100 border-slate-300 text-slate-700 hover:text-slate-900'
                      }`}
                      title="Copy translation"
                    >
                      {copiedToast ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Translation Output Body */}
            <div className="py-5 min-h-[90px] flex flex-col justify-center space-y-2.5">
              {isTranslating && !translatedText ? (
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                  <span>Translating...</span>
                </div>
              ) : (
                (() => {
                  const directWord =
                    translatedText ||
                    (scannedText
                      ? COMPREHENSIVE_LEXICON[scannedText.trim()]?.translations[toLang] ||
                        COMPREHENSIVE_LEXICON[scannedText.trim().replace(/[.,!?;:~\s"']/g, '')]?.translations[toLang] ||
                        ''
                      : '');
                  const currentPhonetic =
                    phoneticText ||
                    (scannedText
                      ? COMPREHENSIVE_LEXICON[scannedText.trim()]?.phonetic ||
                        COMPREHENSIVE_LEXICON[scannedText.trim().replace(/[.,!?;:~\s"']/g, '')]?.phonetic ||
                        generatePhonetic(scannedText, fromLang)
                      : '');

                  if (!directWord && !scannedText) {
                    return (
                      <p className={`text-xs italic ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Capture or type text to view translated meaning.
                      </p>
                    );
                  }

                  return (
                    <div className="space-y-2.5 animate-fadeIn">
                      <h2 className={`font-display font-black text-3xl sm:text-4xl tracking-tight leading-snug ${
                        isDarkMode ? 'text-white' : 'text-slate-900'
                      }`}>
                        {directWord || scannedText}
                      </h2>

                      {/* Clean Pronunciation Guide */}
                      {currentPhonetic && (
                        <div className={`flex items-center gap-2 pt-2 border-t ${
                          isDarkMode ? 'border-slate-800' : 'border-slate-100'
                        }`}>
                          <span className={`text-[10px] font-extrabold uppercase tracking-wider ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            Pronunciation:
                          </span>
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-lg border ${
                            isDarkMode
                              ? 'text-orange-400 bg-orange-500/10 border-orange-500/30'
                              : 'text-[#ea580c] bg-orange-50 border-orange-200'
                          }`}>
                            [{currentPhonetic}]
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()
              )}
            </div>

            {/* Save to Review Deck CTA */}
            {(translatedText || scannedText) && (
              <div className={`pt-3 border-t flex items-center justify-between ${
                isDarkMode ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <button
                  onClick={handleSaveToReview}
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    isSaved
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-gradient-to-r from-[#F06543] to-[#F97316] text-white shadow-md hover:brightness-110 active:scale-95'
                  }`}
                >
                  {isSaved ? (
                    <>
                      <Check size={16} />
                      <span>Saved to SRS Review Deck!</span>
                    </>
                  ) : (
                    <>
                      <BookmarkPlus size={16} />
                      <span>Save Phrase to Review Deck</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
