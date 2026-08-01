import React from 'react';
import { UserProfile } from '../../types';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import { Trophy, Shirt } from 'lucide-react';

interface KleoPanelProps {
  profile: UserProfile;
  onOpenWardrobe: () => void;
}

export const KleoPanel: React.FC<KleoPanelProps> = ({ profile, onOpenWardrobe }) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-4">
      {/* Header Title */}
      <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800/80 pb-2">
        Kleo the Companion
      </h3>

      {/* Main Avatar + Speech Bubble Container */}
      <div className="flex flex-col sm:flex-row items-center gap-5">
        <div className="shrink-0">
          <KleoAvatar mood="happy" equippedCosmetics={profile.equippedCosmetics} size={110} />
        </div>

        {/* Right Content */}
        <div className="flex-1 space-y-3 w-full">
          {/* Speech Bubble */}
          <div className="bg-slate-900 border border-slate-700/80 p-3.5 rounded-2xl relative shadow-md">
            <p className="text-xs md:text-sm text-slate-200 leading-relaxed font-medium">
              Meow! Welcome back! You are on an impressive {profile.streakDays}-day streak! Let's conquer today's lessons together!.
            </p>
          </div>

          {/* Kleo Bond Level XP */}
          <div className="flex items-center gap-2 text-xs text-slate-300 font-bold px-1">
            <Trophy size={16} className="text-sky-400" />
            <span>Kleo's Bond Level 245 XP</span>
          </div>

          {/* Full Width Kleo's Wardrobe Button */}
          <button
            onClick={onOpenWardrobe}
            className="w-full py-2 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-sky-500 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-all hover:bg-slate-800"
          >
            <Shirt size={15} /> Kleo's Wardrobe
          </button>
        </div>
      </div>
    </div>
  );
};
