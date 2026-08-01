import React from 'react';
import { X, Trophy, Flame, Sparkles } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userXp: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  userXp
}) => {
  if (!isOpen) return null;

  const mockLeaderboard = [
    { rank: 1, name: 'Hallyu_King 👑', xp: 540, avatar: '🐈‍⬛' },
    { rank: 2, name: 'AnimeFan99 🌸', xp: 420, avatar: '🐱' },
    { rank: 3, name: 'You (Learner) 🐾', xp: userXp + 50, avatar: '😺' },
    { rank: 4, name: 'TokyoTraveler 🚅', xp: 210, avatar: '😸' },
    { rank: 5, name: 'SeoulVibes 🍜', xp: 180, avatar: '😹' }
  ];

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-md p-6 relative space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={22} />
        </button>

        <div className="text-center space-y-1">
          <h2 className="font-brand text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
            <Trophy size={24} className="text-amber-400" /> Weekly League Leaderboard
          </h2>
          <p className="text-xs text-slate-400">Compete with fellow language learners to reach the Diamond League!</p>
        </div>

        <div className="space-y-2">
          {mockLeaderboard.map((item) => {
            const isUser = item.name.includes('You');
            return (
              <div
                key={item.rank}
                className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                  isUser
                    ? 'bg-sky-950/80 border-sky-400 text-sky-100 shadow-md shadow-sky-500/20 font-bold'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${
                    item.rank === 1 ? 'bg-amber-500 text-slate-950' :
                    item.rank === 2 ? 'bg-slate-300 text-slate-950' :
                    item.rank === 3 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{item.rank}
                  </span>
                  <span className="text-lg">{item.avatar}</span>
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>

                <span className="text-sm font-extrabold text-amber-400">{item.xp} XP</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
