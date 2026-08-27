import React, { useState } from 'react';
import { LessonNode, LanguageTrack } from '../../types';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { LessonPlayer } from '../Lesson/LessonPlayer';

interface LearnViewProps {
  nodes: LessonNode[];
  completedNodeIds: string[];
  userHearts: number;
  selectedLanguage: LanguageTrack;
  onDeductHeart: () => void;
  onCompleteNode: (nodeId: string, xpReward: number) => void;
  equippedCosmetics?: { hat?: string; scarf?: string; glasses?: string };
}

export const LearnView: React.FC<LearnViewProps> = ({
  nodes,
  completedNodeIds,
  userHearts,
  selectedLanguage,
  onDeductHeart,
  onCompleteNode,
  equippedCosmetics
}) => {
  const { t } = useTranslation();
  const [activeSessionNode, setActiveSessionNode] = useState<LessonNode | null>(null);

  const unitTitle =
    selectedLanguage === 'ko'
      ? t.learn.foundationHangul
      : selectedLanguage === 'ja'
      ? t.learn.foundationNihongo
      : t.learn.foundationEnglish;

  return (
    <div className="pt-20 px-4 md:px-8 pb-16 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      {/* Skill Tree Main Content Area */}
      <section className="flex-1 w-full">
        <div className="max-w-2xl mx-auto flex flex-col items-center">
          {/* Unit Heading */}
          <div className="text-center mb-10">
            <span className="text-[#5affff] font-bold text-xs uppercase tracking-widest">{t.learn.unit1}</span>
            <h2 className="font-display text-3xl font-extrabold text-white mt-1">{unitTitle}</h2>
            <p className="text-xs text-[#bacac9] mt-1.5">{t.learn.masterScriptsDesc}</p>
          </div>

          {/* Skill Map Vertical Snake Path */}
          <div className="relative flex flex-col items-center w-full gap-20">
            {/* Node 1: Mastered Node */}
            <div className="relative z-10 flex flex-col items-center group">
              <div
                onClick={() => nodes[0] && setActiveSessionNode(nodes[0])}
                className="w-24 h-24 rounded-full bg-[#5affff] text-[#003737] flex items-center justify-center glow-primary cursor-pointer transition-transform hover:scale-110 active:scale-95"
              >
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: "'wght' 700" }}>
                  check
                </span>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-display text-lg font-bold text-[#5affff]">
                  {nodes[0] ? nodes[0].title : 'Letters: Foundations 1'}
                </h3>
                <p className="text-xs text-[#bacac9]">{t.learn.mastered100}</p>
              </div>
              {/* Connection Line */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 h-20 w-1 bg-[#5affff]"></div>
            </div>

            {/* Node 2: Current Highlighted Active Node */}
            <div className="relative z-10 flex flex-col items-center mt-2 group">
              <div
                onClick={() => nodes[1] && setActiveSessionNode(nodes[1])}
                className="w-32 h-32 rounded-full border-4 border-[#5affff] p-2 current-node-pulse bg-[#161b2b] cursor-pointer transition-transform hover:scale-105"
              >
                <div className="w-full h-full rounded-full bg-[#5affff]/20 flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[#5affff] text-[48px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    waving_hand
                  </span>
                </div>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-display text-lg font-bold text-white">
                  {nodes[1] ? nodes[1].title : 'Basic Words: Greetings'}
                </h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="w-32 h-1.5 bg-[#2f3445] rounded-full overflow-hidden">
                    <div className="h-full bg-[#5affff] w-1/3"></div>
                  </div>
                  <span className="text-xs font-bold text-[#5affff]">35%</span>
                </div>
              </div>
              {/* Connection Line */}
              <div className="absolute top-32 left-1/2 -translate-x-1/2 h-20 w-1 bg-[#2f3445]"></div>
            </div>

            {/* Node 3: Locked Node */}
            <div className="relative z-10 flex flex-col items-center mt-2 opacity-50 grayscale group">
              <div className="w-24 h-24 rounded-full bg-[#2f3445] flex items-center justify-center border border-[#849493]/20">
                <span className="material-symbols-outlined text-[#bacac9] text-[32px]">lock</span>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-display text-lg font-bold text-white">Phrases: Self Intro</h3>
                <p className="text-xs text-[#bacac9]">{t.learn.locked}</p>
              </div>
              {/* Connection Line */}
              <div className="absolute top-24 left-1/2 -translate-x-1/2 h-20 w-1 bg-[#2f3445]"></div>
            </div>

            {/* Node 4: Locked Node */}
            <div className="relative z-10 flex flex-col items-center mt-2 opacity-50 grayscale">
              <div className="w-24 h-24 rounded-full bg-[#2f3445] flex items-center justify-center border border-[#849493]/20">
                <span className="material-symbols-outlined text-[#bacac9] text-[32px]">shopping_cart</span>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-display text-lg font-bold text-white">Dialogues: At the Store</h3>
                <p className="text-xs text-[#bacac9]">{t.learn.locked}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side Stats Panel */}
      <aside className="w-full lg:w-80 space-y-6 shrink-0">
        <h3 className="font-display text-lg font-bold text-white">{t.learn.unitStats}</h3>

        <div className="space-y-4">
          {/* Daily Goal Card */}
          <div className="glass-panel p-4 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[#bacac9]">{t.dashboard.dailyGoal}</span>
              <span className="text-[#5affff]">1,250 XP</span>
            </div>
            <div className="w-full h-2 bg-[#2f3445] rounded-full overflow-hidden">
              <div className="h-full bg-[#5affff] shadow-[0_0_8px_rgba(90,255,255,0.4)]" style={{ width: '68%' }}></div>
            </div>
            <p className="text-[10px] text-[#bacac9]/70 text-right">850 / 1,250 XP</p>
          </div>

          {/* Vocab Mastery */}
          <div className="glass-panel p-4 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#cebdff] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                book
              </span>
              Vocab Mastery
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#2f3445]/40 p-3 rounded-xl border border-white/5 text-center">
                <p className="text-xl font-black text-[#5affff]">42</p>
                <p className="text-[10px] text-[#bacac9] uppercase font-bold">Learned</p>
              </div>
              <div className="bg-[#2f3445]/40 p-3 rounded-xl border border-white/5 text-center">
                <p className="text-xl font-black text-[#cebdff]">15</p>
                <p className="text-[10px] text-[#bacac9] uppercase font-bold">Critical</p>
              </div>
            </div>
          </div>

          {/* Streak Flame Indicator */}
          <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-[#93000a]/20 to-transparent border border-[#ffb4ab]/20 text-center space-y-2">
            <span className="material-symbols-outlined text-[48px] text-[#ffb4ab] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
              local_fire_department
            </span>
            <div className="text-2xl font-display font-bold text-white">12 Days</div>
            <p className="text-xs text-[#bacac9]">Don't break the chain!</p>
          </div>

          {/* Pro CTA */}
          <button className="w-full py-3.5 px-4 bg-[#5affff] text-[#003737] font-extrabold rounded-xl shadow-[0_4px_15px_rgba(90,255,255,0.3)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 text-xs">
            <span className="material-symbols-outlined text-lg">auto_awesome</span>
            {t.learn.unlockPro}
          </button>
        </div>
      </aside>

      {/* Lesson Session Player Modal */}
      {activeSessionNode && (
        <LessonPlayer
          node={activeSessionNode}
          userHearts={userHearts}
          onDeductHeart={onDeductHeart}
          onComplete={(xpReward) => {
            onCompleteNode(activeSessionNode.id, xpReward);
            setActiveSessionNode(null);
          }}
          onClose={() => setActiveSessionNode(null)}
          equippedCosmetics={equippedCosmetics}
        />
      )}
    </div>
  );
};
