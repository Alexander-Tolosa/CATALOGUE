import React from 'react';
import { UserProfile, Badge } from '../../types';
import { Trophy, Flame, Heart, Award, Calendar, Zap, CheckCircle2, Lock } from 'lucide-react';

interface GamifyHubViewProps {
  profile: UserProfile;
  onRefillHearts: () => void;
  onUpdateDailyGoal: (minutes: number) => void;
}

export const GamifyHubView: React.FC<GamifyHubViewProps> = ({
  profile,
  onRefillHearts,
  onUpdateDailyGoal
}) => {
  // Generate 35-day streak calendar heatmap
  const days = Array.from({ length: 35 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (34 - i));
    const iso = d.toISOString().split('T')[0];
    const isStudied = profile.studyDatesHistory.includes(iso);
    return { date: iso, dayNum: d.getDate(), isStudied };
  });

  const badges: Badge[] = [
    { id: 'b1', title: 'Hangul Master', description: 'Complete Korean script foundations unit', icon: '🇰🇷', isEarned: true },
    { id: 'b2', title: '100-Word Vocabulary', description: 'Learn 100 native vocabulary terms', icon: '📚', isEarned: profile.xp >= 100 },
    { id: 'b3', title: 'Streak Champion', description: 'Maintain a 7-day consecutive habit streak', icon: '🔥', isEarned: profile.streakDays >= 5 },
    { id: 'b4', title: 'Kleo Best Friend', description: 'Reach Bond Level 5 with Kleo companion', icon: '🐾', isEarned: true }
  ];

  const leaderboards = [
    { rank: 1, name: 'Hallyu_King 👑', xp: 540, avatar: '🐈‍⬛' },
    { rank: 2, name: 'AnimeFan99 🌸', xp: 420, avatar: '🐱' },
    { rank: 3, name: `${profile.name} (You) 🐾`, xp: profile.xp + 50, avatar: '😺' },
    { rank: 4, name: 'TokyoTraveler 🚅', xp: 210, avatar: '😸' },
    { rank: 5, name: 'SeoulVibes 🍜', xp: 180, avatar: '😹' }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-amber-950 via-slate-950 to-orange-950 border border-amber-500/40 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest block mb-1">
            Habit Building & Achievements Hub
          </span>
          <h2 className="font-brand text-3xl font-black text-white flex items-center gap-2">
            <Trophy size={28} className="text-amber-400" /> Gamification Center
          </h2>
          <p className="text-xs text-slate-300 mt-1">Track your streak heatmap, XP ranks, weekly league, and badges</p>
        </div>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Streak */}
        <div className="glass-panel p-5 bg-slate-950/90 border border-slate-800 text-center space-y-2">
          <Flame size={28} fill="#f97316" className="mx-auto text-orange-500" />
          <div className="text-3xl font-black text-white">{profile.streakDays} Days</div>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Consecutive Streak</span>
        </div>

        {/* XP / Level */}
        <div className="glass-panel p-5 bg-slate-950/90 border border-slate-800 text-center space-y-2">
          <Award size={28} className="mx-auto text-sky-400" />
          <div className="text-3xl font-black text-white">{profile.xp} XP</div>
          <span className="text-xs text-slate-400 uppercase font-bold tracking-wider block">Level {profile.level} Master</span>
        </div>

        {/* Hearts Life Refill */}
        <div className="glass-panel p-5 bg-slate-950/90 border border-slate-800 text-center space-y-2">
          <Heart size={28} fill="#f43f5e" className="mx-auto text-rose-500" />
          <div className="text-3xl font-black text-white">{profile.hearts} / {profile.maxHearts}</div>
          <button
            onClick={onRefillHearts}
            className="text-xs font-black text-rose-300 bg-rose-950 border border-rose-800 px-3 py-1 rounded-full hover:bg-rose-900"
          >
            Practice to Refill Hearts ❤️
          </button>
        </div>
      </div>

      {/* Daily Goal Pace Selector */}
      <div className="glass-panel p-6 bg-slate-950/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-brand font-black text-slate-100 text-base flex items-center gap-2">
            <Zap size={20} className="text-amber-400" /> Adjustable Daily Goal Pace
          </h3>
          <span className="text-xs text-slate-400">Adjust anytime without losing streak status</span>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => onUpdateDailyGoal(5)}
            className={`p-4 rounded-2xl border text-center transition-all ${
              profile.dailyGoalMinutes === 5
                ? 'bg-sky-950 border-sky-400 text-white font-black shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-sm font-black">Casual</div>
            <div className="text-xs text-slate-400 mt-1">5 min / day</div>
          </button>

          <button
            onClick={() => onUpdateDailyGoal(10)}
            className={`p-4 rounded-2xl border text-center transition-all ${
              profile.dailyGoalMinutes === 10
                ? 'bg-sky-950 border-sky-400 text-white font-black shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-sm font-black">Regular</div>
            <div className="text-xs text-slate-400 mt-1">10 min / day</div>
          </button>

          <button
            onClick={() => onUpdateDailyGoal(20)}
            className={`p-4 rounded-2xl border text-center transition-all ${
              profile.dailyGoalMinutes === 20
                ? 'bg-sky-950 border-sky-400 text-white font-black shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="text-sm font-black">Intense</div>
            <div className="text-xs text-slate-400 mt-1">20 min / day</div>
          </button>
        </div>
      </div>

      {/* Streak Calendar Heatmap */}
      <div className="glass-panel p-6 bg-slate-950/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-brand font-black text-slate-100 text-base flex items-center gap-2">
            <Calendar size={20} className="text-emerald-400" /> 35-Day Habit Streak Heatmap
          </h3>
          <span className="text-xs text-orange-400 font-bold">🔥 Active Streak Logged</span>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((item, idx) => (
            <div
              key={idx}
              className={`h-11 rounded-xl flex flex-col items-center justify-center text-xs font-black transition-all ${
                item.isStudied
                  ? 'bg-gradient-to-tr from-amber-600 to-orange-500 text-white shadow-md'
                  : 'bg-slate-900 border border-slate-800 text-slate-600'
              }`}
              title={item.date}
            >
              <span>{item.dayNum}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Leaderboard & Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Leaderboard */}
        <div className="glass-panel p-6 bg-slate-950/90 border border-slate-800 space-y-4">
          <h3 className="font-brand font-black text-slate-100 text-base flex items-center gap-2">
            <Trophy size={20} className="text-amber-400" /> Weekly League Rankings
          </h3>

          <div className="space-y-2">
            {leaderboards.map((item) => (
              <div
                key={item.rank}
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  item.name.includes('(You)')
                    ? 'bg-sky-950 border-sky-400 font-black text-sky-100'
                    : 'bg-slate-900 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                    #{item.rank}
                  </span>
                  <span className="text-base">{item.avatar}</span>
                  <span className="text-xs font-bold">{item.name}</span>
                </div>
                <span className="text-xs font-black text-amber-400">{item.xp} XP</span>
              </div>
            ))}
          </div>
        </div>

        {/* Milestones & Badges Grid */}
        <div className="glass-panel p-6 bg-slate-950/90 border border-slate-800 space-y-4">
          <h3 className="font-brand font-black text-slate-100 text-base flex items-center gap-2">
            <Award size={20} className="text-sky-400" /> Milestones & Badges
          </h3>

          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-xl border flex items-center gap-3 ${
                  badge.isEarned
                    ? 'bg-slate-900 border-amber-500/60 text-slate-100'
                    : 'bg-slate-950 border-slate-900 opacity-40'
                }`}
              >
                <span className="text-2xl">{badge.icon}</span>
                <div>
                  <div className="text-xs font-extrabold">{badge.title}</div>
                  <div className="text-[10px] text-slate-400">{badge.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
