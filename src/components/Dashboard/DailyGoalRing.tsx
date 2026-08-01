import React from 'react';

interface DailyGoalRingProps {
  completedMinutes: number;
  goalMinutes: number;
}

export const DailyGoalRing: React.FC<DailyGoalRingProps> = ({
  completedMinutes,
  goalMinutes
}) => {
  const percent = Math.min(100, Math.round((completedMinutes / goalMinutes) * 100));
  const strokeDashoffset = 251.2 - (251.2 * percent) / 100;

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl flex flex-col justify-between h-full space-y-3">
      {/* Header */}
      <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800/80 pb-2">
        Daily Study Goal
      </h3>

      {/* Donut Ring */}
      <div className="relative my-2 w-32 h-32 mx-auto flex items-center justify-center">
        <svg width="128" height="128" className="transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="44"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="11"
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r="44"
            stroke="#38bdf8"
            strokeWidth="11"
            fill="transparent"
            strokeDasharray="276.4"
            strokeDashoffset={276.4 - (276.4 * percent) / 100}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none space-y-0.5">
          <span className="text-2xl font-extrabold text-white font-brand">{percent}%</span>
          <span className="text-xs text-slate-300 font-mono font-semibold">{completedMinutes}/{goalMinutes} min</span>
        </div>
      </div>

      {/* Bottom Subtitle */}
      <div className="text-center pt-2 border-t border-slate-800/80 space-y-0.5">
        <span className="text-xs font-bold text-slate-200 block">Next Up In Sequence</span>
        <span className="text-xs text-slate-400 block">{goalMinutes - completedMinutes} minutes left to reach target</span>
      </div>
    </div>
  );
};
