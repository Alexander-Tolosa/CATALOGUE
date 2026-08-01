import React from 'react';
import { UserProfile } from '../../types';
import { X, Flame, Calendar, Award, Trophy, BookOpen } from 'lucide-react';

interface ProgressJournalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const ProgressJournal: React.FC<ProgressJournalProps> = ({
  isOpen,
  onClose,
  profile
}) => {
  if (!isOpen) return null;

  // Generate 28-day calendar heatmap
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const isoString = d.toISOString().split('T')[0];
    const isStudied = profile.studyDatesHistory.includes(isoString);
    return { date: isoString, dayNum: d.getDate(), isStudied };
  });

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-xl p-6 relative space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={22} />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-950 border border-amber-800 text-amber-400">
            <Trophy size={24} />
          </div>
          <div>
            <h2 className="font-brand text-2xl font-bold text-slate-100">Progress Journal & Stats</h2>
            <p className="text-xs text-slate-400">Track your daily habit streak, XP growth, and language milestones</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <Flame size={20} className="mx-auto text-orange-500 mb-1" />
            <span className="text-2xl font-extrabold text-slate-100">{profile.streakDays} Days</span>
            <span className="text-[10px] text-slate-400 block uppercase font-bold mt-0.5">Current Streak</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <Award size={20} className="mx-auto text-sky-400 mb-1" />
            <span className="text-2xl font-extrabold text-slate-100">{profile.xp} XP</span>
            <span className="text-[10px] text-slate-400 block uppercase font-bold mt-0.5">Level {profile.level}</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <BookOpen size={20} className="mx-auto text-emerald-400 mb-1" />
            <span className="text-2xl font-extrabold text-slate-100">{profile.completedNodeIds.length}</span>
            <span className="text-[10px] text-slate-400 block uppercase font-bold mt-0.5">Nodes Completed</span>
          </div>
        </div>

        {/* Calendar Heatmap */}
        <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1"><Calendar size={14} /> 28-Day Activity Heatmap</span>
            <span className="text-orange-400 font-normal">🔥 Streak Active</span>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {days.map((item, idx) => (
              <div
                key={idx}
                className={`h-9 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  item.isStudied
                    ? 'bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-900 border border-slate-800 text-slate-600'
                }`}
                title={item.date}
              >
                {item.dayNum}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
