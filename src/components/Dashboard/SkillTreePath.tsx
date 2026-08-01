import React from 'react';
import { LessonNode, LanguageTrack } from '../../types';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import { BookOpen, Star, Gift, Trophy, ArrowLeft, FastForward, Check, Sparkles } from 'lucide-react';

interface SkillTreePathProps {
  nodes: LessonNode[];
  completedNodeIds: string[];
  selectedLanguage: LanguageTrack;
  onSelectNode: (node: LessonNode) => void;
  onOpenGuidebook: () => void;
  equippedCosmetics?: { hat?: string; scarf?: string; glasses?: string };
}

export const SkillTreePath: React.FC<SkillTreePathProps> = ({
  nodes,
  completedNodeIds,
  selectedLanguage,
  onSelectNode,
  onOpenGuidebook,
  equippedCosmetics
}) => {
  const currentUnitTitle =
    selectedLanguage === 'ko'
      ? 'Hangul Foundations & Conversational Mastery'
      : selectedLanguage === 'ja'
      ? 'Hiragana, Katakana & Radical Mastery'
      : 'Phonics & Spoken English Fluency';

  return (
    <div className="flex-1 max-w-xl mx-auto space-y-8 pb-20">
      {/* 1. Million-Dollar Bright Unit Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-sky-600 text-white p-6 rounded-3xl shadow-2xl flex items-center justify-between gap-4 border border-white/20 relative overflow-hidden">
        {/* Glow Aura */}
        <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-white/20 rounded-full blur-2xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-100">
            <ArrowLeft size={16} /> SECTION 1, UNIT 1
          </div>
          <h2 className="font-brand text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow-md">
            {currentUnitTitle}
          </h2>
          <p className="text-xs text-emerald-100/90 font-medium">
            3-minute micro-lessons • Adaptive AI repetition engine
          </p>
        </div>

        <button
          onClick={onOpenGuidebook}
          className="bg-slate-950/40 hover:bg-slate-950/60 text-white font-black text-xs px-4 py-3 rounded-2xl flex items-center gap-2 transition-all shrink-0 shadow-lg border border-white/30 hover:scale-105"
        >
          <BookOpen size={16} /> GUIDEBOOK
        </button>
      </div>

      {/* 2. Sinuous Vertical Path with Kleo Mascot */}
      <div className="relative flex flex-col items-center py-6 space-y-12">
        {/* Node 1: Active START Node */}
        <div className="relative flex flex-col items-center">
          {/* START Tooltip Pill */}
          <div className="mb-3 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl shadow-emerald-500/30 animate-bounce flex items-center gap-1">
            <Sparkles size={14} /> START HERE
          </div>

          {/* Active Glowing Circle Node Button */}
          <button
            onClick={() => nodes[0] && onSelectNode(nodes[0])}
            className="w-22 h-22 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 border-4 border-white shadow-2xl flex items-center justify-center text-slate-950 ring-4 ring-emerald-500/50 hover:scale-110 transition-transform relative z-10"
          >
            {completedNodeIds.includes(nodes[0]?.id) ? (
              <Check size={40} strokeWidth={4} className="text-white" />
            ) : (
              <Star size={40} fill="#040711" className="text-slate-950" />
            )}
          </button>

          {/* Kleo Cat Mascot standing right next to active node */}
          <div className="absolute top-2 -right-36 pointer-events-none animate-float hidden sm:block">
            <div className="relative">
              <KleoAvatar mood="happy" equippedCosmetics={equippedCosmetics} size={120} />
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-slate-900/90 border border-sky-400/50 text-[10px] font-black text-sky-300 px-2.5 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                🐾 Companion Active
              </div>
            </div>
          </div>
        </div>

        {/* Connecting Vertical Path Line 1 */}
        <div className="w-2 h-12 bg-gradient-to-b from-emerald-500 to-slate-700 rounded-full shadow-md" />

        {/* Node 2: Lesson Node 2 */}
        <div className="relative flex flex-col items-center transform -translate-x-8">
          <button
            onClick={() => nodes[1] && onSelectNode(nodes[1])}
            className={`w-18 h-18 rounded-full border-4 flex items-center justify-center transition-all shadow-2xl ${
              completedNodeIds.includes(nodes[1]?.id)
                ? 'bg-emerald-500 border-white text-white shadow-emerald-500/30'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-sky-400 hover:scale-105'
            }`}
          >
            <Star size={30} fill={completedNodeIds.includes(nodes[1]?.id) ? '#ffffff' : '#475569'} />
          </button>
        </div>

        {/* Connecting Vertical Path Line 2 */}
        <div className="w-2 h-12 bg-slate-700/80 rounded-full" />

        {/* Node 3: Reward Chest Node */}
        <div className="relative flex flex-col items-center transform translate-x-8">
          <button
            onClick={() => alert("🎁 Treasure Chest Unlocked! You earned +50 XP & bonus flashcards!")}
            className="w-18 h-18 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 border-4 border-amber-300 flex items-center justify-center text-slate-950 hover:scale-110 shadow-2xl shadow-amber-500/30 transition-all"
          >
            <Gift size={32} fill="#040711" />
          </button>
        </div>

        {/* Connecting Vertical Path Line 3 */}
        <div className="w-2 h-12 bg-slate-700/80 rounded-full" />

        {/* Node 4: Trophy Milestone Node */}
        <div className="relative flex flex-col items-center">
          <button
            onClick={() => nodes[2] && onSelectNode(nodes[2])}
            className="w-18 h-18 rounded-full bg-slate-900 border-4 border-slate-700 flex items-center justify-center text-slate-500 hover:border-sky-400 shadow-2xl transition-all"
          >
            <Trophy size={30} />
          </button>
        </div>

        {/* 3. Unit Divider Line */}
        <div className="w-full flex items-center gap-4 py-4 text-xs font-black text-slate-400 uppercase tracking-widest">
          <div className="flex-1 h-0.5 bg-slate-800" />
          <span>Basic Words & Sentence Construction</span>
          <div className="flex-1 h-0.5 bg-slate-800" />
        </div>

        {/* 4. Bottom Jump Button */}
        <div className="flex flex-col items-center space-y-2 pt-2">
          <div className="bg-[#1cb0f6] text-slate-950 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-sky-500/30">
            JUMP TO NEXT UNIT
          </div>
          <button
            onClick={() => onSelectNode(nodes[0])}
            className="w-16 h-16 rounded-full bg-[#1cb0f6] border-4 border-white shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform"
          >
            <FastForward size={28} fill="#ffffff" />
          </button>
        </div>
      </div>
    </div>
  );
};
