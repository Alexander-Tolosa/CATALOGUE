import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { FlagIcon } from '../Common/FlagIcon';
import { Sparkles, Globe, Zap, Bot, ShieldCheck, Heart, Award, ArrowRight, ChevronDown } from 'lucide-react';
import catalougeLogo from '../../assets/catalouge_logo.png';
import catVideo from '../../assets/Cat.mp4';
import studyVideo from '../../assets/Study.mp4';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

type SiteLanguage = 'ENGLISH' | 'KOREAN' | 'JAPANESE';

interface TranslationSchema {
  siteLangLabel: string;
  login: string;
  masterHeadline: string;
  getStarted: string;
  alreadyAccount: string;
  koreanTrack: string;
  koreanSubtitle: string;
  japaneseTrack: string;
  japaneseSubtitle: string;
  englishTrack: string;
  englishSubtitle: string;
  effectiveBadge: string;
  effectiveTitle: string;
  effectiveDesc: string;
  translatorTitle: string;
  translatorDesc: string;
  gamifiedTitle: string;
  gamifiedDesc: string;
  chatbotTitle: string;
  chatbotDesc: string;
  companionBadge: string;
  companionTitle: string;
  companionDesc: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
  rights: string;
}

const translations: Record<SiteLanguage, TranslationSchema> = {
  ENGLISH: {
    siteLangLabel: 'SITE LANGUAGE: ENGLISH',
    login: 'LOG IN',
    masterHeadline: 'Master English and Asian languages easily & effectively',
    getStarted: 'GET STARTED',
    alreadyAccount: 'I ALREADY HAVE AN ACCOUNT',
    koreanTrack: 'Korean',
    koreanSubtitle: 'HANGUL & HONORIFICS',
    japaneseTrack: 'Japanese',
    japaneseSubtitle: 'KANA & KANJI RADICALS',
    englishTrack: 'English',
    englishSubtitle: 'CONTEXTUAL SPEECH',
    effectiveBadge: 'EFFECTIVE & GAMIFIED',
    effectiveTitle: 'Free, fun, and effective language learning',
    effectiveDesc: 'Learn with Kleo, your AI feline companion. Practice reading, listening, writing, and speaking through interactive bite-sized lessons.',
    translatorTitle: 'Real-Time AI Translator',
    translatorDesc: 'Contextual translations with formality levels, breakdowns, and audio playback.',
    gamifiedTitle: 'Gamified Progress & Streaks',
    gamifiedDesc: 'Earn XP, unlock cosmetic outfits for Kleo, and build long-term daily habits.',
    chatbotTitle: 'Contextual AI Companion',
    chatbotDesc: 'Practice natural conversations with Kleo anytime, adapted to your level.',
    companionBadge: 'MEET YOUR COMPANION',
    companionTitle: 'Stay motivated with Kleo',
    companionDesc: 'Kleo grows with you! Customize outfits, earn bond XP, and practice real-world language skills together.',
    ctaTitle: 'Ready to start learning?',
    ctaSubtitle: 'Join thousands of learners mastering Korean, Japanese, and English script!',
    ctaButton: 'GET STARTED NOW',
    rights: '© 2026 CATalouge Platform. All rights reserved.'
  },
  KOREAN: {
    siteLangLabel: '사이트 언어: 한국어',
    login: '로그인',
    masterHeadline: '영어 및 아시아 언어를 쉽고 효과적으로 마스터하세요',
    getStarted: '시작하기',
    alreadyAccount: '이미 계정이 있습니다',
    koreanTrack: '한국어',
    koreanSubtitle: '한글 & 존댓말',
    japaneseTrack: '일본어',
    japaneseSubtitle: '가나 & 한자 부수',
    englishTrack: '영어',
    englishSubtitle: '맥락별 회화',
    effectiveBadge: '효과적이고 흥미진진한 학습',
    effectiveTitle: '무료로 즐겁고 효과적으로 언어를 배워보세요',
    effectiveDesc: 'AI 고양이 동반자 클레오와 함께 읽기, 듣기, 쓰기, 말하기를 습득하세요.',
    translatorTitle: '실시간 AI 번역기',
    translatorDesc: '높임말 레벨과 문장 구조 분석이 포함된 맥락 맞춤 번역.',
    gamifiedTitle: '게임화된 성장 및 연속 학습',
    gamifiedDesc: 'XP를 획득하고 클레오 의상을 해제하며 매일 연속 학습을 이어가세요.',
    chatbotTitle: '상황 맞춤형 AI 대화',
    chatbotDesc: '당신의 언어 수준에 맞춰 클레오와 자유롭게 대화 연습을 하세요.',
    companionBadge: '나만의 AI 동반자',
    companionTitle: '클레오와 함께 동기부여를 유지하세요',
    companionDesc: '클레오와 함께 성장하세요! 의상을 꾸미고 유대감 XP를 쌓으세요.',
    ctaTitle: '학습을 시작할 준비가 되셨나요?',
    ctaSubtitle: '한국어, 일본어, 영어 학습자들과 함께 지금 시작하세요!',
    ctaButton: '지금 시작하기',
    rights: '© 2026 CATalouge Platform. All rights reserved.'
  },
  JAPANESE: {
    siteLangLabel: 'サイト言語: 日本語',
    login: 'ログイン',
    masterHeadline: '英語とアジアの言語を簡単・効果的にマスターしよう',
    getStarted: '今すぐ始める',
    alreadyAccount: 'アカウントをお持ちの方',
    koreanTrack: '韓国語',
    koreanSubtitle: 'ハングル＆敬語',
    japaneseTrack: '日本語',
    japaneseSubtitle: '仮名＆漢字部首',
    englishTrack: '英語',
    englishSubtitle: '文脈英会話',
    effectiveBadge: '効果的でゲーム感覚の学習',
    effectiveTitle: '楽しく効果的な言語学習を無料で',
    effectiveDesc: 'AI猫パートナーのクレオと一緒に、読む・聴く・書く・話すスキルを磨きましょう。',
    translatorTitle: 'リアルタイムAI翻訳',
    translatorDesc: '敬語レベルや文法分解機能を備えた文脈理解型翻訳。',
    gamifiedTitle: 'ゲーム感覚の成長と連続記録',
    gamifiedDesc: 'XPを獲得し、クレオの着せ替えアイテムをアンロック。',
    chatbotTitle: '対話型AIパートナー',
    chatbotDesc: 'あなたのレベルに合わせたクレオとの自然な会話練習。',
    companionBadge: 'パートナーに会おう',
    companionTitle: 'クレオと一緒にモチベーション維持',
    companionDesc: 'クレオと一緒に成長！衣装をカスタマイズして親密度をアップ。',
    ctaTitle: '学習を始める準備はできましたか？',
    ctaSubtitle: '韓国語、日本語、英語の文字をマスターする何千人もの学習者に加わりましょう！',
    ctaButton: '今すぐ始める',
    rights: '© 2026 CATalouge Platform. All rights reserved.'
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const [selectedSiteLang, setSelectedSiteLang] = useState<SiteLanguage>('ENGLISH');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const t = translations[selectedSiteLang];

  const handleBrandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#F97316]/20">
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-white/90 backdrop-blur-md"
          >
            <div style={{ width: '220px', height: '220px' }}>
              <DotLottieReact
                src="https://lottie.host/1d9b3064-7e18-43ac-8329-64175e1f6827/uQnFW5Tt64.lottie"
                loop
                autoplay
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 1. Top Header Navigation (Duolingo Style) */}
      <header className="h-20 border-b border-orange-400/30 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-gradient-to-r from-[#F97316]/80 to-[#fb923c]/75 backdrop-blur-xl z-50 shadow-lg shadow-orange-500/10">
        {/* Brand Header & Cat Mascot Logo */}
        <div
          onClick={handleBrandClick}
          className="flex items-center gap-3 cursor-pointer group select-none"
          title="Refresh site & return to top"
        >
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center p-1 shadow-sm shrink-0">
            <img
              src={catalougeLogo}
              alt="CATalouge Logo"
              onClick={handleBrandClick}
              className="w-full h-full object-contain cursor-pointer"
            />
          </div>
          <div onClick={handleBrandClick} className="cursor-pointer">
            <h1 className="font-display font-black text-2xl tracking-tight leading-none text-white group-hover:text-orange-100 transition-colors drop-shadow-sm">
              CATalouge
            </h1>
            <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest block mt-0.5">
              Mastering Language
            </span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-4">
          {/* Site Language Selector Dropdown (Skeuomorphic 3D UI) */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="hidden sm:flex items-center gap-2 text-xs font-black text-[#EA580C] cursor-pointer px-4 py-2 rounded-xl bg-gradient-to-b from-white via-orange-50/60 to-orange-100/80 border-t-2 border-t-white border-b-2 border-b-orange-200/90 border-x border-x-orange-100 shadow-[0_4px_8px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,1)] hover:from-white hover:to-orange-100 transition-all select-none"
            >
              <Globe size={16} className="text-[#F97316] drop-shadow-[0_1px_0_rgba(255,255,255,0.8)]" />
              <span className="drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">{t.siteLangLabel}</span>
              <ChevronDown size={14} className={`text-[#F97316] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu Modal */}
            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white border border-slate-200 shadow-2xl p-2 z-50 overflow-hidden"
                >
                  <div className="text-[10px] font-bold text-slate-400 px-3 py-1.5 uppercase tracking-wider">
                    SELECT LANGUAGE
                  </div>

                  <button
                    onClick={() => { setSelectedSiteLang('ENGLISH'); setIsDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSiteLang === 'ENGLISH'
                        ? 'bg-orange-50 text-[#F97316] border border-orange-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FlagIcon code="us" size="sm" />
                    <span>English (ENGLISH)</span>
                  </button>

                  <button
                    onClick={() => { setSelectedSiteLang('KOREAN'); setIsDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSiteLang === 'KOREAN'
                        ? 'bg-orange-50 text-[#F97316] border border-orange-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FlagIcon code="kr" size="sm" />
                    <span>한국어 (KOREAN)</span>
                  </button>

                  <button
                    onClick={() => { setSelectedSiteLang('JAPANESE'); setIsDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedSiteLang === 'JAPANESE'
                        ? 'bg-orange-50 text-[#F97316] border border-orange-200'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <FlagIcon code="jp" size="sm" />
                    <span>日本語 (JAPANESE)</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Log In Button (Duolingo 3D Style in Orange) */}
          <button
            onClick={onLogin}
            className="px-6 py-2.5 rounded-xl bg-[#F97316] hover:bg-[#ea580c] text-white font-black text-xs tracking-wider uppercase transition-all shadow-[0_4px_0_0_#c2410c] active:translate-y-1 active:shadow-none cursor-pointer border border-[#ea580c]/50"
          >
            {t.login}
          </button>
        </div>
      </header>

      {/* 2. Hero Section (Duolingo 2-Column Layout with Full Unclipped Study.mp4 Video Mascot) */}
      <section className="max-w-7xl mx-auto px-6 py-6 md:py-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 items-center">
        {/* Left Column: Unclipped Large Study.mp4 Video Mascot Container */}
        <div className="md:col-span-6 flex flex-col items-center justify-center text-center md:-translate-x-6 lg:-translate-x-10">
          <div className="mascot-container relative flex items-center justify-center w-full max-w-[560px] h-[440px] sm:h-[500px] md:h-[540px]">
            <video
              src={studyVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain scale-[1.3] transform mix-blend-multiply contrast-[1.05] brightness-[1.02] pointer-events-none select-none"
            />
          </div>
        </div>

        {/* Right Column: Hero Headline & 3D Action Buttons */}
        <div className="md:col-span-6 space-y-8 text-center md:text-left">
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight tracking-tight">
            {t.masterHeadline}
          </h2>

          <div className="space-y-4 max-w-md mx-auto md:mx-0">
            {/* GET STARTED Primary 3D Button */}
            <button
              onClick={onGetStarted}
              className="w-full py-4 px-6 rounded-2xl bg-[#F97316] hover:bg-[#ea580c] text-white font-black text-sm tracking-wider uppercase transition-all shadow-[0_5px_0_#c2410c] active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center gap-2"
            >
              <span>{t.getStarted}</span>
              <ArrowRight size={18} />
            </button>

            {/* I ALREADY HAVE AN ACCOUNT Secondary 3D Button */}
            <button
              onClick={onLogin}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm tracking-wider uppercase transition-all border-2 border-slate-200 shadow-[0_5px_0_#cbd5e1] active:translate-y-1 active:shadow-none cursor-pointer"
            >
              {t.alreadyAccount}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Language Selector Marquee Bar (Country Flags) */}
      <section className="border-y border-slate-200 bg-slate-50/80 py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6">
          {/* Korean Track Flag Card */}
          <button
            onClick={onGetStarted}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#F97316] hover:scale-105 transition-all cursor-pointer"
          >
            <FlagIcon code="kr" size="lg" />
            <div className="text-left">
              <span className="font-display font-extrabold text-sm text-slate-900 block">{t.koreanTrack}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.koreanSubtitle}</span>
            </div>
          </button>

          {/* Japanese Track Flag Card */}
          <button
            onClick={onGetStarted}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#F97316] hover:scale-105 transition-all cursor-pointer"
          >
            <FlagIcon code="jp" size="lg" />
            <div className="text-left">
              <span className="font-display font-extrabold text-sm text-slate-900 block">{t.japaneseTrack}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.japaneseSubtitle}</span>
            </div>
          </button>

          {/* English Track Flag Card */}
          <button
            onClick={onGetStarted}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#F97316] hover:scale-105 transition-all cursor-pointer"
          >
            <FlagIcon code="us" size="lg" />
            <div className="text-left">
              <span className="font-display font-extrabold text-sm text-slate-900 block">{t.englishTrack}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{t.englishSubtitle}</span>
            </div>
          </button>
        </div>
      </section>

      {/* 4. Duolingo-Style Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-6 py-20 space-y-20">
        {/* Feature 1: Free, Fun, Effective */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 space-y-4 text-center md:text-left">
            <span className="text-xs font-black text-[#F97316] uppercase tracking-widest">
              {t.effectiveBadge}
            </span>
            <h3 className="font-display font-black text-3xl text-slate-900">
              {t.effectiveTitle}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              {t.effectiveDesc}
            </p>
          </div>

          {/* Soft Neumorphism Extruded Cards Container */}
          <div className="md:col-span-6 p-8 rounded-3xl bg-[#eef2f7] border border-white/60 shadow-[10px_10px_24px_rgba(163,177,198,0.4),-10px_-10px_24px_rgba(255,255,255,0.9)] flex items-center justify-center">
            <div className="space-y-4.5 w-full max-w-sm">
              {/* 1. Translator */}
              <div className="p-4 rounded-2xl bg-[#eef2f7] shadow-[6px_6px_14px_rgba(163,177,198,0.4),-6px_-6px_14px_rgba(255,255,255,0.9)] flex items-center gap-4 border border-white/60 transition-all hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-[#dbeafe]/80 text-blue-500 flex items-center justify-center shrink-0 shadow-inner">
                  <Globe size={22} className="text-blue-500 stroke-[2.2]" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-slate-800 block">{t.translatorTitle}</span>
                  <span className="text-[10px] font-medium text-slate-500">{t.translatorDesc}</span>
                </div>
              </div>

              {/* 2. Gamified Lessons */}
              <div className="p-4 rounded-2xl bg-[#eef2f7] shadow-[6px_6px_14px_rgba(163,177,198,0.4),-6px_-6px_14px_rgba(255,255,255,0.9)] flex items-center gap-4 border border-white/60 transition-all hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-[#ffedd5]/80 text-amber-500 flex items-center justify-center shrink-0 shadow-inner">
                  <Zap size={22} className="text-amber-500 fill-amber-400 stroke-[1.8]" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-slate-800 block">{t.gamifiedTitle}</span>
                  <span className="text-[10px] font-medium text-slate-500">{t.gamifiedDesc}</span>
                </div>
              </div>

              {/* 3. AI Chatbot */}
              <div className="p-4 rounded-2xl bg-[#eef2f7] shadow-[6px_6px_14px_rgba(163,177,198,0.4),-6px_-6px_14px_rgba(255,255,255,0.9)] flex items-center gap-4 border border-white/60 transition-all hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-2xl bg-[#f3e8ff]/80 text-purple-500 flex items-center justify-center shrink-0 shadow-inner">
                  <Bot size={22} className="text-purple-500 stroke-[2.2]" />
                </div>
                <div>
                  <span className="font-extrabold text-xs text-slate-800 block">{t.chatbotTitle}</span>
                  <span className="text-[10px] font-medium text-slate-500">{t.chatbotDesc}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Interactive 2D Companion Mascot Kleo */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 md:order-2 space-y-4 text-center md:text-left">
            <span className="text-xs font-black text-[#F97316] uppercase tracking-widest">
              {t.companionBadge}
            </span>
            <h3 className="font-display font-black text-3xl text-slate-900">
              {t.companionTitle}
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              {t.companionDesc}
            </p>
          </div>
          <div className="md:col-span-6 md:order-1 flex items-center justify-center">
            <div className="w-full max-w-[540px] h-[400px] sm:h-[480px] md:h-[520px] flex items-center justify-center">
              <video
                src={catVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-contain scale-[1.35] transform mix-blend-multiply contrast-[1.05] brightness-[1.02] pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action Section (Duolingo Style) */}
      <section className="bg-gradient-to-b from-orange-500 to-[#F97316] text-white py-16 px-6 text-center space-y-6">
        <h3 className="font-display font-black text-3xl sm:text-4xl">
          {t.ctaTitle}
        </h3>
        <p className="text-sm text-orange-100 max-w-md mx-auto">
          {t.ctaSubtitle}
        </p>

        <button
          onClick={onGetStarted}
          className="py-4 px-8 rounded-2xl bg-white hover:bg-slate-100 text-[#F97316] font-black text-sm tracking-wider uppercase transition-all shadow-[0_5px_0_#c2410c] active:translate-y-1 active:shadow-none cursor-pointer"
        >
          {t.ctaButton}
        </button>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500 space-y-2">
        <p>{t.rights}</p>
        <div className="flex items-center justify-center gap-4 text-slate-400 font-semibold">
          <a href="#" onClick={onGetStarted} className="hover:text-[#F97316]">Korean</a>
          <span>•</span>
          <a href="#" onClick={onGetStarted} className="hover:text-[#F97316]">Japanese</a>
          <span>•</span>
          <a href="#" onClick={onGetStarted} className="hover:text-[#F97316]">English</a>
        </div>
      </footer>
    </div>
  );
};
