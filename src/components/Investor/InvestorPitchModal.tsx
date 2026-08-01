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
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-4xl p-8 relative space-y-6 max-h-[92vh] overflow-y-auto border border-amber-500/40 bg-gradient-to-b from-[#0e172a] via-[#090d1a] to-[#040711] shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Hero Title */}
        <div className="text-center space-y-2 border-b border-slate-800 pb-5">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-400/10 px-4 py-1.5 rounded-full border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} /> Million-Dollar Product Strategy & Pitch Deck
          </div>
          <h2 className="font-brand text-3xl md:text-4xl font-black text-white tracking-tight">
            CATalouge Enterprise EdTech
          </h2>
          <p className="text-sm text-slate-300 max-w-2xl mx-auto">
            A next-generation, AI-driven gamified language learning web application designed for high retention in Asian & English scripts.
          </p>
        </div>

        {/* Executive Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/80 p-4 rounded-2xl border border-sky-500/30 text-center space-y-1">
            <TrendingUp size={24} className="mx-auto text-sky-400 mb-1" />
            <span className="text-2xl font-black text-white">3.4x Higher</span>
            <span className="text-xs text-slate-400 block font-semibold">30-Day Learner Retention</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-amber-500/30 text-center space-y-1">
            <Cpu size={24} className="mx-auto text-amber-400 mb-1" />
            <span className="text-2xl font-black text-white">Dual-AI Layer</span>
            <span className="text-xs text-slate-400 block font-semibold">Kleo Mascot + Context LLM</span>
          </div>

          <div className="bg-slate-950/80 p-4 rounded-2xl border border-emerald-500/30 text-center space-y-1">
            <ShieldCheck size={24} className="mx-auto text-emerald-400 mb-1" />
            <span className="text-2xl font-black text-white">3 Languages</span>
            <span className="text-xs text-slate-400 block font-semibold">Korean, Japanese & English</span>
          </div>
        </div>

        {/* 4 Core Platform Moats */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Platform Competitive Moats ($1M+ Valuation Highlights)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Moat 1 */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                <CheckCircle2 size={18} /> Dedicated Script & Foundations Engine
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlike Duolingo which mixes writing systems into generic drills, CATalouge features standalone stroke-tracing for Hangul block building, Hiragana, Katakana, and Kanji radicals.
              </p>
            </div>

            {/* Moat 2 */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Heart size={18} /> Kleo — Emotionally Driven Companion Layer
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Kleo reacts visually to mistakes with comforting nuzzles, celebrates streaks, and unlocks cosmetic gear via an active Bond Level meter, drastically lowering churn.
              </p>
            </div>

            {/* Moat 3 */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Mic size={18} /> Voice-Command STT/TTS Translator
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Integrated real-time speech-to-text and native pronunciation playback with instant tap-to-save flashcard deck creation.
              </p>
            </div>

            {/* Moat 4 */}
            <div className="bg-slate-900/90 p-5 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Bot size={18} /> Context-Aware LLM Grammar & Cultural Tutor
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Persistent AI tutor panel providing real-time grammar explanations (formal vs informal honorifics) without leaving the active session.
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="glass-button btn-gold py-3 px-6 text-xs font-black rounded-xl"
          >
            Explore Live Demo App 🚀
          </button>
        </div>
      </div>
    </div>
  );
};
