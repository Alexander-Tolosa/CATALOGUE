import React from 'react';
import { BookOpen, Languages, Trophy, ShieldCheck, Shirt, User, MessageSquare, Sparkles, Presentation } from 'lucide-react';

interface SidebarProps {
  activeTab: 'learn' | 'letters' | 'leaderboards' | 'review' | 'wardrobe' | 'profile' | 'pitch';
  onSelectTab: (tab: 'learn' | 'letters' | 'leaderboards' | 'review' | 'wardrobe' | 'profile' | 'pitch') => void;
  onOpenTutor: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenTutor
}) => {
  const navItems = [
    { id: 'learn', label: 'LEARN', icon: <BookOpen size={20} /> },
    { id: 'letters', label: 'LETTERS & SCRIPTS', icon: <Languages size={20} /> },
    { id: 'leaderboards', label: 'LEADERBOARDS', icon: <Trophy size={20} /> },
    { id: 'review', label: 'REVIEW & REPETITION', icon: <ShieldCheck size={20} /> },
    { id: 'wardrobe', label: 'KLEO WARDROBE', icon: <Shirt size={20} /> },
    { id: 'profile', label: 'PROFILE & STATS', icon: <User size={20} /> },
    { id: 'pitch', label: 'INVESTOR DECK', icon: <Presentation size={20} /> },
  ];

  return (
    <aside className="w-64 bg-[#0c101c] border-r border-white/[0.04] p-4 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-[8px_0_28px_rgba(0,0,0,0.65),inset_1px_0_0_rgba(255,255,255,0.04)]">
      <div className="space-y-6">
        {/* Brand Logo Plate */}
        <div className="p-3 bg-[#131929] border border-white/[0.04] rounded-2xl shadow-[-3px_-3px_8px_rgba(255,255,255,0.03),3px_3px_10px_rgba(0,0,0,0.6)]">
          <h1 className="font-brand text-2xl font-black text-orange-400 tracking-tight flex items-center gap-2 drop-shadow-md">
            <span>🐾</span> CATALOGUE
          </h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mt-0.5">
            Enterprise Language SaaS
          </span>
        </div>

        {/* Vertical Nav List */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isPitch = item.id === 'pitch';

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as any)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wider transition-all duration-200 cursor-pointer ${
                  isPitch
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-[-2px_-2px_6px_rgba(255,255,255,0.02),3px_3px_8px_rgba(0,0,0,0.5)] hover:bg-amber-500/20'
                    : isActive
                    ? 'bg-gradient-to-r from-[#F06543] to-[#EA580C] text-white shadow-[-2px_-2px_6px_rgba(255,255,255,0.05),3px_3px_14px_rgba(240,101,67,0.45),inset_1px_1px_1.5px_rgba(255,255,255,0.25)] border border-orange-400/25'
                    : 'text-slate-400 hover:text-white bg-transparent hover:bg-[#131929] hover:shadow-[-2px_-2px_6px_rgba(255,255,255,0.03),3px_3px_8px_rgba(0,0,0,0.55)] border border-transparent'
                }`}
              >
                <span className={isPitch ? 'text-amber-400' : isActive ? 'text-white drop-shadow-xs' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI Tutor Button at Bottom */}
      <div className="pt-4 border-t border-white/[0.06] space-y-2">
        <button
          onClick={onOpenTutor}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-slate-950 font-black text-xs tracking-wider shadow-[-2px_-2px_6px_rgba(255,255,255,0.08),3px_3px_12px_rgba(249,115,22,0.4),inset_1px_1px_1.5px_rgba(255,255,255,0.4)] hover:brightness-110 active:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.3)] transition-all cursor-pointer"
        >
          <MessageSquare size={18} fill="#090e1c" />
          <span>AI TUTOR COACH</span>
        </button>
      </div>
    </aside>
  );
};
