import React from 'react';
import { X, Sparkles, TrendingUp, Cpu, Heart, Mic, Bot, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InvestorPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvestorPitchModal: React.FC<InvestorPitchModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 md:p-8 animate-fadeIn">
      <div className="glass-panel w-full max-w-4xl p-6 md:p-8 relative space-y-6 max-h-[90vh] overflow-y-auto border border-[#FF6B35]/40 bg-[#090d16]/95 text-white shadow-2xl rounded-3xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          title="Close Pitch Deck"
        >
          <X size={24} />
        </button>

        {/* Hero Title */}
        <div className="text-center space-y-2 border-b border-slate-800 pb-5 pt-2">
          <div className="inline-flex items-center gap-2 bg-[#FF6B35]/20 px-4 py-1.5 rounded-full border border-[#FF6B35]/40 text-[#FF6B35] text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} /> Million-Dollar Product Strategy & Pitch Deck
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
            CATalouge Enterprise EdTech
          </h2>
          <p className="text-xs md:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A next-generation, AI-driven gamified language learning web application designed for high retention in Asian & English scripts.
          </p>
        </div>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/90 p-4 rounded-2xl border border-sky-500/30 text-center space-y-1">
            <TrendingUp size={24} className="mx-auto text-sky-400 mb-1" />
            <span className="text-2xl font-black text-white">3.4x Higher</span>
            <span className="text-xs text-slate-400 block font-semibold">30-Day Learner Retention</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-[#FF6B35]/40 text-center space-y-1">
            <Cpu size={24} className="mx-auto text-[#FF6B35] mb-1" />
            <span className="text-2xl font-black text-white">Dual-AI Layer</span>
            <span className="text-xs text-slate-400 block font-semibold">Kleo Mascot + Context LLM</span>
          </div>

          <div className="bg-slate-900/90 p-4 rounded-2xl border border-emerald-500/30 text-center space-y-1">
            <ShieldCheck size={24} className="mx-auto text-emerald-400 mb-1" />
            <span className="text-2xl font-black text-white">3 Languages</span>
            <span className="text-xs text-slate-400 block font-semibold">Korean, Japanese & English</span>
          </div>
        </div>

        {/* 4 Core Platform Moats */}
        <div className="space-y-3">
          <h3 className="font-display font-black text-xs uppercase tracking-widest text-[#FF6B35]">
            4 Key Moats ($1M+ Valuation Highlights)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-sky-400 font-bold">
                <Mic size={16} />
                <span>1. Native Speech Foundations Engine</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Replaces boring repetitive drills with active stroke tracing for Hangul block building & Kanji radicals.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-[#FF6B35] font-bold">
                <Heart size={16} />
                <span>2. Kleo — Emotionally Driven Companion Layer</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Kleo reacts visually to mistakes with comforting nuzzles, celebrates streaks, and unlocks cosmetic gear via an active Bond Level meter.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Bot size={16} />
                <span>3. Live Web Speech Translator</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Bi-directional speech-to-text with native pronunciation and instant 1-click SM-2 flashcard creation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-purple-400 font-bold">
                <Bot size={16} />
                <span>4. Context-Aware LLM Grammar & Cultural Tutor</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Persistent AI tutor panel providing real-time grammar explanations (formal vs informal honorifics) without leaving the active session.
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-semibold">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Ready for seed investment & scale</span>
          </div>

          <button
            onClick={onClose}
            className="btn-vibrant-orange px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 font-extrabold"
          >
            <span>Explore Live Demo App</span>
            <span>🚀</span>
          </button>
        </div>
      </div>
    </div>
  );
};
