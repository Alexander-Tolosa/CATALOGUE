import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import { FlagIcon } from '../Common/FlagIcon';
import { Sparkles, Globe, ShieldCheck, Heart, Award, ArrowRight, ChevronDown } from 'lucide-react';
import catalougeLogo from '../../assets/catalouge_logo.png';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  const [selectedSiteLang, setSelectedSiteLang] = useState('ENGLISH');

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-[#F97316]/20">
      {/* 1. Top Header Navigation (Duolingo Style) */}
      <header className="h-20 border-b border-slate-200 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-50">
        {/* Brand Header & Cat Mascot Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onGetStarted}>
          <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center p-1 shadow-sm shrink-0">
            <img src={catalougeLogo} alt="CATalouge Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h1 className="font-display font-black text-2xl tracking-tight leading-none text-slate-900">
              CATalouge
            </h1>
            <span className="text-[10px] font-bold text-[#F97316] uppercase tracking-widest block mt-0.5">
              Mastering Language
            </span>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-4">
          {/* Site Language Selector Dropdown */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 cursor-pointer px-3 py-1.5 rounded-xl border border-slate-200">
            <Globe size={16} className="text-[#F97316]" />
            <span>SITE LANGUAGE: {selectedSiteLang}</span>
            <ChevronDown size={14} />
          </div>

          {/* Log In Button */}
          <button
            onClick={onLogin}
            className="px-5 py-2.5 rounded-xl border-2 border-slate-200 hover:border-[#F97316] hover:bg-orange-50 text-[#F97316] font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_3px_0_#cbd5e1] active:translate-y-0.5 active:shadow-none cursor-pointer"
          >
            Log In
          </button>
        </div>
      </header>

      {/* 2. Hero Section (Duolingo 2-Column Layout) */}
      <section className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        {/* Left Column: 2D Kleo Mascot Avatar Banner */}
        <div className="md:col-span-6 flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative p-6 rounded-full bg-orange-50 border-4 border-orange-200/80 shadow-2xl flex items-center justify-center">
            <KleoAvatar mood="happy" size={260} />
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#fff7ed] border border-[#ffe4c9] text-[#F97316] text-xs font-bold shadow-xs">
            <span className="text-sm">🐾</span>
            <span>Hover to pet Kleo for purrs & bond XP!</span>
          </div>
        </div>

        {/* Right Column: Duolingo Headline & 3D Buttons */}
        <div className="md:col-span-6 space-y-8 text-center md:text-left">
          <h2 className="font-display font-black text-3xl sm:text-4xl md:text-5xl text-slate-900 leading-tight tracking-tight">
            The free, fun, and effective way to learn Asian & English languages!
          </h2>

          <div className="space-y-4 max-w-md mx-auto md:mx-0">
            {/* GET STARTED Primary 3D Button */}
            <button
              onClick={onGetStarted}
              className="w-full py-4 px-6 rounded-2xl bg-[#F97316] hover:bg-[#ea580c] text-white font-black text-sm tracking-wider uppercase transition-all shadow-[0_5px_0_#c2410c] active:translate-y-1 active:shadow-none cursor-pointer flex items-center justify-center gap-2"
            >
              <span>GET STARTED</span>
              <ArrowRight size={18} />
            </button>

            {/* I ALREADY HAVE AN ACCOUNT Secondary 3D Button */}
            <button
              onClick={onLogin}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-sm tracking-wider uppercase transition-all border-2 border-slate-200 shadow-[0_5px_0_#cbd5e1] active:translate-y-1 active:shadow-none cursor-pointer"
            >
              I ALREADY HAVE AN ACCOUNT
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
              <span className="font-display font-extrabold text-sm text-slate-900 block">Korean</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HANGUL & HONORIFICS</span>
            </div>
          </button>

          {/* Japanese Track Flag Card */}
          <button
            onClick={onGetStarted}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#F97316] hover:scale-105 transition-all cursor-pointer"
          >
            <FlagIcon code="jp" size="lg" />
            <div className="text-left">
              <span className="font-display font-extrabold text-sm text-slate-900 block">Japanese</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">KANA & KANJI RADICALS</span>
            </div>
          </button>

          {/* English Track Flag Card */}
          <button
            onClick={onGetStarted}
            className="flex items-center gap-3 px-6 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs hover:border-[#F97316] hover:scale-105 transition-all cursor-pointer"
          >
            <FlagIcon code="us" size="lg" />
            <div className="text-left">
              <span className="font-display font-extrabold text-sm text-slate-900 block">English</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">CONTEXTUAL SPEECH</span>
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
              EFFECTIVE & GAMIFIED
            </span>
            <h3 className="font-display font-black text-3xl text-slate-900">
              Free, fun, and effective language learning
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              CATalouge combines bite-sized skill tree lessons, native Web Speech pronunciation, and SM-2 flashcard decks that fit naturally into your daily routine.
            </p>
          </div>
          <div className="md:col-span-6 p-8 rounded-3xl bg-slate-50 border border-slate-200 shadow-xl flex items-center justify-center">
            <div className="space-y-4 w-full max-w-sm">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#F97316] flex items-center justify-center font-bold">
                  ⚡
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">Bite-Sized Skill Tree</span>
                  <span className="text-[10px] text-slate-500">Master Hangul & Kana in 5 mins/day</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-4 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  🎯
                </div>
                <div>
                  <span className="font-bold text-xs text-slate-900 block">SM-2 Spaced Repetition</span>
                  <span className="text-[10px] text-slate-500">Remember vocabulary forever</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 2: Interactive 2D Companion Mascot Kleo */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-6 md:order-2 space-y-4 text-center md:text-left">
            <span className="text-xs font-black text-[#F97316] uppercase tracking-widest">
              AI COMPANION LAYER
            </span>
            <h3 className="font-display font-black text-3xl text-slate-900">
              Stay motivated with Kleo your AI Siamese Companion
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-md">
              Pet Kleo to increase your Bond Level, unlock cosmetic hats and berets, and receive comforting purrs when learning new scripts!
            </p>
          </div>
          <div className="md:col-span-6 md:order-1 p-8 rounded-3xl bg-[#fff7ed] border border-[#ffe4c9] shadow-xl flex items-center justify-center">
            <div className="text-center space-y-3">
              <div className="w-32 h-32 mx-auto rounded-full bg-white border-4 border-[#F97316]/30 flex items-center justify-center p-2 shadow-inner">
                <KleoAvatar mood="nuzzling" size={120} />
              </div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-white text-[#F97316] font-black text-xs shadow-sm">
                "Purrrrr! Let's practice Korean today! 🐾"
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action Section (Duolingo Style) */}
      <section className="bg-gradient-to-b from-orange-500 to-[#F97316] text-white py-16 px-6 text-center space-y-6">
        <h3 className="font-display font-black text-3xl sm:text-4xl">
          Learn a new language with CATalouge today.
        </h3>
        <p className="text-sm text-orange-100 max-w-md mx-auto">
          Join thousands of learners mastering Korean, Japanese, and English scripts!
        </p>

        <button
          onClick={onGetStarted}
          className="py-4 px-8 rounded-2xl bg-white hover:bg-slate-100 text-[#F97316] font-black text-sm tracking-wider uppercase transition-all shadow-[0_5px_0_#c2410c] active:translate-y-1 active:shadow-none cursor-pointer"
        >
          GET STARTED NOW
        </button>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500 space-y-2">
        <p>© 2026 CATalouge EdTech Platform. All rights reserved.</p>
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
