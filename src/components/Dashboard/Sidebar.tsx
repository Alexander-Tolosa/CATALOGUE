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
    <aside className="w-64 bg-[#090e1c] border-r border-slate-800/90 p-4 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 shadow-2xl">
      <div className="space-y-6">
        {/* Brand Logo */}
        <div className="px-3 pt-2">
          <h1 className="font-brand text-2xl font-black text-sky-400 tracking-tight flex items-center gap-2 drop-shadow-md">
            <span>🐾</span> CATALOGUE
          </h1>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block mt-0.5">
            Enterprise Language SaaS
          </span>
        </div>

        {/* Vertical Nav List */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isPitch = item.id === 'pitch';

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as any)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black tracking-wider transition-all duration-200 ${
                  isPitch
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40 hover:bg-amber-500/20'
                    : isActive
                    ? 'bg-sky-950/90 text-sky-400 border-2 border-sky-400/80 shadow-lg shadow-sky-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border-2 border-transparent'
                }`}
              >
                <span className={isPitch ? 'text-amber-400' : isActive ? 'text-sky-400' : 'text-slate-400'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* AI Tutor Button at Bottom */}
      <div className="pt-4 border-t border-slate-800/80 space-y-2">
        <button
          onClick={onOpenTutor}
          className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 text-slate-950 font-black text-xs tracking-wider shadow-xl hover:brightness-110 transition-all"
        >
          <MessageSquare size={18} fill="#090e1c" />
          <span>AI TUTOR COACH</span>
        </button>
      </div>
    </aside>
  );
};
