import React from 'react';
import { LessonNode } from '../../types';
import { Lock, Check, Play, Star } from 'lucide-react';

interface SkillTreeProps {
  nodes: LessonNode[];
  completedNodeIds: string[];
  onSelectNode: (node: LessonNode) => void;
  onOpenFoundations: () => void;
}

export const SkillTree: React.FC<SkillTreeProps> = ({
  nodes,
  completedNodeIds,
  onSelectNode,
  onOpenFoundations
}) => {
  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 bg-slate-950/80 shadow-xl space-y-3 flex flex-col h-full">
      {/* Header Title */}
      <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider border-b border-slate-800/80 pb-2">
        Skill Tree Learning Path
      </h3>

      {/* Top Unit Banner */}
      <div className="bg-slate-100 text-slate-900 rounded-xl p-2.5 text-center shadow-md">
        <span className="text-xs font-bold uppercase tracking-wider block">Unit 1 - Letters</span>
        <span className="text-xs font-extrabold flex items-center justify-center gap-1 mt-0.5">
          <Star size={12} fill="#d97706" className="text-amber-600" /> 140 XP
        </span>
      </div>

      {/* Vertical Stack of Unit Node Cards */}
      <div className="space-y-2.5 flex-1">
        {nodes.map((node, index) => {
          const isCompleted = completedNodeIds.includes(node.id);
          const isCurrent = !isCompleted && (index === 0 || completedNodeIds.includes(nodes[index - 1].id));
          const isLocked = !isCompleted && !isCurrent;

          return (
            <div
              key={node.id}
              onClick={() => !isLocked && onSelectNode(node)}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer ${
                isCompleted
                  ? 'bg-slate-100 text-slate-900 border-slate-300 shadow-md'
                  : isCurrent
                  ? 'bg-slate-100 text-slate-900 border-slate-300 shadow-md ring-2 ring-sky-500'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800/80 opacity-60'
              }`}
            >
              {/* Icon Container */}
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-xs ${
                  isCompleted || isCurrent
                    ? 'bg-slate-900 text-slate-100'
                    : 'bg-slate-950 text-slate-500 border border-slate-800'
                }`}
              >
                {isCompleted ? (
                  <Check size={18} strokeWidth={3} className="text-emerald-400" />
                ) : isCurrent ? (
                  <Play size={18} fill="#ffffff" className="ml-0.5 text-white" />
                ) : (
                  <Lock size={16} />
                )}
              </div>

              {/* Title & Subtitle */}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-extrabold truncate">{node.title}</div>
                <div className="text-[11px] opacity-80 truncate">{node.description}</div>
              </div>

              {/* XP Indicator */}
              {(isCompleted || isCurrent) && (
                <div className="text-[10px] font-bold shrink-0 flex items-center gap-0.5">
                  <Star size={10} fill="#d97706" className="text-amber-600" /> {node.xpReward} XP
                </div>
              )}
            </div>
          );
        })}

        {/* Extra Locked Cards to match screenshot */}
        <div className="p-3 rounded-xl border bg-slate-900/40 border-slate-800/80 text-slate-500 flex items-center justify-center gap-2 opacity-50 text-xs font-bold">
          <Lock size={16} /> Unit 2 - Phrases & Politeness
        </div>

        <div className="p-3 rounded-xl border bg-slate-900/40 border-slate-800/80 text-slate-500 flex items-center justify-center gap-2 opacity-50 text-xs font-bold">
          <Lock size={16} /> Full Sentences & Dialogues
        </div>
      </div>
    </div>
  );
};
