import React from 'react';
import { UserProfile, LanguageTrack, LessonNode, ReviewItem, AppView } from '../../types';
import { useKleoStore } from '../../store/useKleoStore';
import { KleoAvatar } from '../Kleo/KleoAvatar';

interface DashboardViewProps {
  profile: UserProfile;
  activeNodes: LessonNode[];
  savedPhrases: ReviewItem[];
  onSelectLanguage: (lang: LanguageTrack) => void;
  onSelectNode: (node: LessonNode) => void;
  onNavigate: (view: AppView) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  activeNodes,
  savedPhrases,
  onSelectLanguage,
  onSelectNode,
  onNavigate
}) => {
  const { mood, speechText, bondXp, bondLevel, equippedCosmetics } = useKleoStore();

  const nextNode = activeNodes.find(n => !profile.completedNodeIds.includes(n.id)) || activeNodes[0];
  const percentGoal = Math.min(100, Math.round((profile.minutesCompletedToday / profile.dailyGoalMinutes) * 100));

  return (
    <div className="pt-20 px-4 md:px-8 pb-16 max-w-7xl mx-auto space-y-8">
      {/* Top Bento Row */}
      <section className="grid grid-cols-12 gap-6 items-stretch">
        {/* Kleo Mascot Card (Bento Item 1) */}
        <div className="col-span-12 lg:col-span-8 glass-card rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden bg-[#161b2b]/80 border border-[#38bdf8]/20">
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#38bdf8]/10 blur-[90px] rounded-full pointer-events-none" />

          {/* Avatar Container */}
          <div className="relative w-44 h-44 flex-shrink-0">
            <div className="w-full h-full rounded-full border-4 border-[#38bdf8]/30 flex items-center justify-center p-3 bg-[#090d16] shadow-inner">
              <KleoAvatar mood={mood} equippedCosmetics={equippedCosmetics} size={140} />
            </div>
            <div className="absolute -bottom-2 right-2 bg-gradient-to-r from-[#f97316] to-[#ff6b4a] text-white font-black text-xs px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
              {mood}
            </div>
          </div>

          {/* Kleo Info & Speech Bubble */}
          <div className="flex-1 space-y-4 z-10 text-center md:text-left w-full">
            <div className="inline-block px-5 py-3.5 bg-[#1e293b] rounded-2xl rounded-tl-none border border-[#38bdf8]/25 shadow-md">
              <p className="font-display font-bold text-base text-[#38bdf8] leading-relaxed">
                "{speechText}"
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1 text-xs font-bold">
                <span className="text-[#f8fafc] uppercase tracking-tighter">Kleo Bond Level {bondLevel}</span>
                <span className="text-[#38bdf8] font-mono">{bondXp} / 1000 XP</span>
              </div>
              <div className="h-3 w-full bg-[#1e293b] rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-[#0ea5e9] to-[#2dd4bf] neon-glow rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (bondXp % 100))}%` }}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-1 justify-center md:justify-start">
              {/* Vibrant Coral / Orange Action CTA */}
              <button
                onClick={() => nextNode && onSelectNode(nextNode)}
                className="btn-orange px-6 py-2.5 rounded-xl text-xs flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-lg">play_circle</span>
                Practice Now
              </button>
              <button
                onClick={() => onNavigate('kleo')}
                className="border-2 border-[#38bdf8]/40 text-[#38bdf8] px-6 py-2.5 rounded-xl font-bold hover:bg-[#38bdf8]/10 active:scale-95 transition-all text-xs"
              >
                Chat with Kleo
              </button>
            </div>
          </div>
        </div>

        {/* Daily Goal Meter (Bento Item 2) */}
        <div className="col-span-12 lg:col-span-4 glass-card rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-4 bg-[#161b2b]/80 border border-[#38bdf8]/20">
          <h3 className="font-display text-lg font-bold text-[#f8fafc]">Daily Goal</h3>
          <div className="relative w-36 h-36 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-[#1e293b]" cx="72" cy="72" fill="transparent" r="60" stroke="currentColor" strokeWidth="10" />
              <circle
                className="text-[#38bdf8] neon-glow transition-all duration-700"
                cx="72"
                cy="72"
                fill="transparent"
                r="60"
                stroke="currentColor"
                strokeDasharray="376.8"
                strokeDashoffset={376.8 - (376.8 * percentGoal) / 100}
                strokeLinecap="round"
                strokeWidth="10"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-3xl font-extrabold text-white leading-none">{profile.minutesCompletedToday}</span>
              <span className="text-xs font-semibold text-[#38bdf8]">/ {profile.dailyGoalMinutes} min</span>
            </div>
          </div>
          <p className="text-xs text-slate-300 px-2">You've completed {percentGoal}% of today's study block. Keep it up!</p>
        </div>
      </section>

      {/* Bottom Bento Row: Lessons & Quick Access */}
      <section className="grid grid-cols-12 gap-6">
        {/* Continue Lesson Card */}
        {nextNode && (
          <div
            onClick={() => onSelectNode(nextNode)}
            className="col-span-12 md:col-span-7 glass-card rounded-3xl p-6 flex flex-col justify-between group cursor-pointer border-l-4 border-l-[#f97316] bg-[#161b2b]/80 hover:scale-[1.01]"
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="text-xs font-bold text-[#f97316] uppercase tracking-widest">Next Up In Sequence</span>
                <h2 className="font-display text-xl font-bold mt-1 text-white">{nextNode.title}</h2>
                <p className="text-xs text-slate-300 mt-1.5">{nextNode.description}</p>
              </div>
              <div className="w-14 h-14 bg-[#f97316]/15 rounded-2xl flex items-center justify-center text-[#f97316] group-hover:scale-110 transition-transform shrink-0 border border-[#f97316]/30">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  school
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#38bdf8] text-base">stars</span>
                  <span className="text-xs font-bold text-[#38bdf8]">+{nextNode.xpReward} XP Reward</span>
                </div>
                <button className="btn-orange px-5 py-2 rounded-xl text-xs flex items-center gap-1.5">
                  <span>Continue</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Access Grid */}
        <div className="col-span-12 md:col-span-5 grid grid-cols-2 gap-4">
          {/* Translator */}
          <div
            onClick={() => onNavigate('translator')}
            className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 bg-[#161b2b]/80 hover:bg-[#1e293b] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#38bdf8]/15 flex items-center justify-center text-[#38bdf8] border border-[#38bdf8]/30">
              <span className="material-symbols-outlined text-2xl">translate</span>
            </div>
            <span className="text-xs font-bold text-[#f8fafc]">Translator</span>
          </div>

          {/* Review */}
          <div
            onClick={() => onNavigate('review')}
            className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 bg-[#161b2b]/80 hover:bg-[#1e293b] cursor-pointer relative"
          >
            {savedPhrases.length > 0 && (
              <div className="absolute top-2.5 right-2.5 bg-[#f97316] text-white font-black text-[10px] px-2 py-0.5 rounded-full shadow-md">
                {savedPhrases.length} DUE
              </div>
            )}
            <div className="w-12 h-12 rounded-full bg-[#f97316]/15 flex items-center justify-center text-[#f97316] border border-[#f97316]/30">
              <span className="material-symbols-outlined text-2xl">rebase_edit</span>
            </div>
            <span className="text-xs font-bold text-[#f8fafc]">Review</span>
          </div>

          {/* League */}
          <div
            onClick={() => onNavigate('gamify')}
            className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 bg-[#161b2b]/80 hover:bg-[#1e293b] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#2dd4bf]/15 flex items-center justify-center text-[#2dd4bf] border border-[#2dd4bf]/30">
              <span className="material-symbols-outlined text-2xl">leaderboard</span>
            </div>
            <span className="text-xs font-bold text-[#f8fafc]">League</span>
          </div>

          {/* Journal */}
          <div
            onClick={() => onNavigate('gamify')}
            className="glass-card rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2 bg-[#161b2b]/80 hover:bg-[#1e293b] cursor-pointer"
          >
            <div className="w-12 h-12 rounded-full bg-[#0284c7]/15 flex items-center justify-center text-[#38bdf8] border border-[#0284c7]/30">
              <span className="material-symbols-outlined text-2xl">menu_book</span>
            </div>
            <span className="text-xs font-bold text-[#f8fafc]">Journal</span>
          </div>
        </div>
      </section>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => nextNode && onSelectNode(nextNode)}
        className="fixed bottom-8 right-8 w-14 h-14 btn-orange rounded-full flex items-center justify-center glow-orange hover:scale-110 active:scale-95 transition-all shadow-2xl z-40"
        title="Start Practice Session"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>
    </div>
  );
};
