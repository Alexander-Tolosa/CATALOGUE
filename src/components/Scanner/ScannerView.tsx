import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createWorker } from 'tesseract.js';
import { LanguageTrack, ReviewItem } from '../../types';
import { useAppStore } from '../../store/useAppStore';
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
  Play
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

// Hangul Romanization Engine
const INITIALS = ['g', 'g', 'n', 'd', 'd', 'r', 'm', 'b', 'b', 's', 's', '', 'j', 'j', 'ch', 'k', 't', 'p', 'h'];
const VOWELS = ['a', 'ae', 'ya', 'yae', 'eo', 'e', 'yeo', 'ye', 'o', 'wa', 'wae', 'oe', 'yo', 'u', 'wo', 'we', 'wi', 'yu', 'eu', 'ui', 'i'];
const FINALS = ['', 'g', 'g', 'gs', 'n', 'nj', 'nh', 'd', 'l', 'lg', 'lm', 'lb', 'ls', 'lt', 'lp', 'lh', 'm', 'b', 'bs', 's', 'ss', 'ng', 'j', 'ch', 'k', 't', 'p', 'h'];

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
  'だ':'da','ぢ':'ji','づ':'zu','de':'de','ど':'do',
  'ば':'ba','び':'bi','ぶ':'bu','べ':'be','ぼ':'bo',
  'ぱ':'pa','ぴ':'pi','ぷ':'pu','ぺ':'pe','ぽ':'po'
};

function generatePhonetic(text: string, lang: LangOption): string {
  if (!text.trim() || lang === 'English') return '';

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
    return result;
  }

  return '';
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

  // Mode: Live Camera vs. Uploaded Image
  const [activeMode, setActiveMode] = useState<'camera' | 'upload'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Captured / Uploaded Image Data URL
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  // OCR & Translation State
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const [fromLang, setFromLang] = useState<LangOption>('Japanese');
  const [toLang, setToLang] = useState<LangOption>('English');

  const [scannedText, setScannedText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [phoneticText, setPhoneticText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Interactive Tokens
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [selectedWordTranslation, setSelectedWordTranslation] = useState<string | null>(null);

  // Audio TTS State
  const [isSpeakingSource, setIsSpeakingSource] = useState(false);
  const [isSpeakingTarget, setIsSpeakingTarget] = useState(false);

  // UX Feedback
  const [isSaved, setIsSaved] = useState(false);
  const [copiedToast, setCopiedToast] = useState(false);

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Translation Function using Google GTX & MyMemory fallback
  const performTranslation = useCallback(async (text: string, source: LangOption, target: LangOption) => {
    if (!text.trim()) {
      setTranslatedText('');
      setPhoneticText('');
      return;
    }

    setIsTranslating(true);
    setIsSaved(false);

    const srcCode = LANG_CONFIG[source].apiCode;
    const tgtCode = LANG_CONFIG[target].apiCode;

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcCode}&tl=${tgtCode}&dt=t&q=${encodeURIComponent(text)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && Array.isArray(data[0])) {
          const result = data[0].filter((item: any) => item && item[0]).map((item: any) => item[0]).join('');
          if (result.trim()) {
            setTranslatedText(result);
            setPhoneticText(generatePhonetic(result, target));
            setIsTranslating(false);
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Primary translation engine failed, using fallback:', err);
    }

    // Fallback engine: MyMemory
    try {
      const fbRes = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${srcCode}|${tgtCode}`
      );
      if (fbRes.ok) {
        const fbData = await fbRes.json();
        if (fbData?.responseData?.translatedText) {
          const res = fbData.responseData.translatedText;
          setTranslatedText(res);
          setPhoneticText(generatePhonetic(res, target));
        }
      }
    } catch (fbErr) {
      console.warn('Fallback translation failed:', fbErr);
    } finally {
      setIsTranslating(false);
    }
  }, []);

  // Run OCR on an Image (DataURL or Canvas)
  const processOCR = async (imageSource: string) => {
    setIsScanning(true);
    setScanProgress(5);
    setStatusMessage('Initializing OCR Neural Engine...');
    setSelectedWord(null);
    setSelectedWordTranslation(null);

    try {
      const tesseractLang = LANG_CONFIG[fromLang].tesseractLang;
      // Load worker
      const worker = await createWorker(tesseractLang, 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            setScanProgress(Math.floor(m.progress * 100));
            setStatusMessage(`Recognizing text (${Math.floor(m.progress * 100)}%)...`);
          } else if (m.status) {
            setStatusMessage(`${m.status.charAt(0).toUpperCase() + m.status.slice(1)}...`);
          }
        }
      });

      const { data } = await worker.recognize(imageSource);
      await worker.terminate();

      const extracted = data.text.trim().replace(/\s+/g, ' ');
      if (extracted) {
        setScannedText(extracted);
        setStatusMessage('Text recognized! Translating...');
        await performTranslation(extracted, fromLang, toLang);
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

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/png');
    setCapturedImage(dataUrl);

    // Run OCR
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

  // Translate Single Word on Click
  const handleSelectWord = async (word: string) => {
    const cleanWord = word.replace(/[.,!?;:"'(){}\[\]]/g, '').trim();
    if (!cleanWord) return;

    setSelectedWord(cleanWord);
    setSelectedWordTranslation('Translating...');

    const srcCode = LANG_CONFIG[fromLang].apiCode;
    const tgtCode = LANG_CONFIG[toLang].apiCode;

    try {
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${srcCode}&tl=${tgtCode}&dt=t&q=${encodeURIComponent(cleanWord)}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data[0] && data[0][0]) {
          setSelectedWordTranslation(data[0][0][0]);
          return;
        }
      }
    } catch (err) {
      console.warn('Word translation failed:', err);
    }
    setSelectedWordTranslation('Direct definition unavailable');
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
    if (!scannedText.trim() || !translatedText.trim()) return;

    onSaveToReview({
      term: scannedText,
      translation: translatedText,
      language: LANG_CONFIG[toLang].trackCode,
      phonetic: phoneticText || undefined
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  // Copy Translation
  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
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

  const wordsList = scannedText ? scannedText.split(' ').filter(Boolean) : [];

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
                Camera & Word Scanner
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/15 text-[#F06543] border border-orange-500/30 uppercase tracking-wider">
                  AI OCR Vision
                </span>
              </h1>
              <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Point camera at foreign words, menus, or signs to extract text and translate instantly.
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
              <span>Live Camera</span>
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
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        {/* Language Selection Ribbon */}
        <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-[280px]">
            {/* Source Language Custom Dropdown */}
            <CustomLanguageDropdown
              label="Scan From"
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
              label="Translate To"
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
              <div className="text-center p-6 space-y-3 w-full h-full flex flex-col items-center justify-center">
                {capturedImage ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img src={capturedImage} alt="Uploaded text preview" className="max-h-full max-w-full object-contain rounded-xl" />
                    <button
                      onClick={() => {
                        setCapturedImage(null);
                        setScannedText('');
                        setTranslatedText('');
                      }}
                      className="absolute top-2 right-2 py-1 px-3 rounded-lg bg-black/70 text-white text-xs font-bold hover:bg-black/90"
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-full border-2 border-dashed border-slate-700 hover:border-orange-500 rounded-2xl flex flex-col items-center justify-center p-6 cursor-pointer transition-colors bg-slate-900/40"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 mb-3">
                      <ImageIcon size={28} />
                    </div>
                    <span className="font-bold text-sm text-white">Click or Drag Image Here</span>
                    <span className="text-xs text-slate-400 mt-1">Supports PNG, JPG, WEBP screenshots or photos</span>
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
                <span>{isScanning ? 'Processing Frame...' : 'Snap & Translate'}</span>
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
            isDarkMode ? 'bg-[#0f172a]/90 border-[#1e293b] text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FlagIcon code={LANG_CONFIG[fromLang].code} size="sm" />
                <span>Extracted {fromLang} Text</span>
              </span>

              {scannedText && (
                <button
                  onClick={() => handleSpeak(scannedText, fromLang, true)}
                  className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                    isSpeakingSource
                      ? 'bg-orange-500 text-white border-orange-500'
                      : isDarkMode
                      ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                      : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
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
                  performTranslation(e.target.value, fromLang, toLang);
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
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/60">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
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
                      <span className="font-bold">{selectedWord}:</span>
                      <span className="truncate">{selectedWordTranslation}</span>
                    </div>
                    <button
                      onClick={() => {
                        onSaveToReview({
                          term: selectedWord,
                          translation: selectedWordTranslation || '',
                          language: LANG_CONFIG[toLang].trackCode
                        });
                        setIsSaved(true);
                        setTimeout(() => setIsSaved(false), 2000);
                      }}
                      className="px-2 py-0.5 rounded-md bg-[#F06543] text-white font-bold text-[10px] shrink-0"
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
            isDarkMode ? 'bg-[#0f172a]/90 border-[#1e293b] text-white' : 'bg-white border-slate-200 text-slate-800'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800/80">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <FlagIcon code={LANG_CONFIG[toLang].code} size="sm" />
                <span>{toLang} Translation</span>
              </span>

              <div className="flex items-center gap-1.5">
                {translatedText && (
                  <>
                    <button
                      onClick={() => handleSpeak(translatedText, toLang, false)}
                      className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer ${
                        isSpeakingTarget
                          ? 'bg-orange-500 text-white border-orange-500'
                          : isDarkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
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
                          : 'bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900'
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
            <div className="py-4 min-h-[90px] flex flex-col justify-center">
              {isTranslating ? (
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400">
                  <span className="material-symbols-outlined text-base animate-spin">sync</span>
                  <span>Generating instant translation...</span>
                </div>
              ) : translatedText ? (
                <div className="space-y-1.5">
                  <p className="font-display font-bold text-base sm:text-lg leading-relaxed text-slate-900 dark:text-white">
                    {translatedText}
                  </p>
                  {phoneticText && (
                    <p className="text-xs font-mono font-medium text-orange-500 dark:text-orange-400">
                      /{phoneticText}/
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">
                  Capture or type text to view translated meaning.
                </p>
              )}
            </div>

            {/* Save to Review Deck CTA */}
            {translatedText && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
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
