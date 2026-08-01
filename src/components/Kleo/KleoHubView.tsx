import React, { useState } from 'react';
import { useKleoStore } from '../../store/useKleoStore';
import { KleoAvatar } from './KleoAvatar';

export const KleoHubView: React.FC = () => {
  const { mood, bondXp, bondLevel, equippedCosmetics, equipCosmetic, react } = useKleoStore();
  const [activeTab, setActiveTab] = useState<'Head' | 'Neck' | 'Eyes'>('Head');

  const wardrobeItems = [
    {
      id: 'chef_hat',
      name: 'Chef Hat',
      description: 'Master of grammar recipes.',
      category: 'Head',
      icon: 'restaurant',
      isEquipped: equippedCosmetics.hat === 'chef_hat' || equippedCosmetics.hat === 'blue_beret',
      isUnlocked: true
    },
    {
      id: 'cyber_glass',
      name: 'Cyber Glass',
      description: 'Translates context in real-time.',
      category: 'Eyes',
      icon: 'visibility',
      isEquipped: equippedCosmetics.glasses === 'cyber_glass',
      isUnlocked: true
    },
    {
      id: 'red_scarf',
      name: 'Red Scarf',
      description: 'Cozy warmth for late study.',
      category: 'Neck',
      icon: 'sports_kabaddi',
      isEquipped: equippedCosmetics.scarf === 'red_scarf',
      isUnlocked: true
    },
    {
      id: 'beat_buds',
      name: 'Beat Buds',
      description: 'Phonetic training rhythm.',
      category: 'Head',
      icon: 'headphones',
      isEquipped: false,
      isUnlocked: true
    },
    {
      id: 'royal_crown',
      name: 'Royal Crown',
      description: 'Requires Bond Lvl 50',
      category: 'Head',
      icon: 'military_tech',
      isEquipped: false,
      isUnlocked: false
    },
    {
      id: 'wizard_cap',
      name: 'Wizard Cap',
      description: '100 Day Streak Reward',
      category: 'Head',
      icon: 'auto_fix_high',
      isEquipped: false,
      isUnlocked: false
    }
  ];

  return (
    <div className="pt-20 px-4 md:px-8 pb-16 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      {/* Left Companion & Bond Status Panel */}
      <aside className="w-full lg:w-96 space-y-6 shrink-0">
        {/* Mascot Circle Card */}
        <div className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden border border-[#5affff]/20 shadow-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#5affff]/20 border border-[#5affff] flex items-center justify-center text-[#5affff] neon-glow">
            <span className="material-symbols-outlined text-2xl">restaurant</span>
          </div>

          <div className="relative w-48 h-48 flex flex-col items-center justify-center">
            <div className="w-full h-full rounded-full border-4 border-[#5affff]/20 p-2 bg-[#161b2b] flex items-center justify-center shadow-inner">
              <KleoAvatar mood={mood} equippedCosmetics={equippedCosmetics} size={150} />
            </div>

            {/* Pet Kleo Button */}
            <button
              onClick={() => react('correct')}
              className="absolute -bottom-3 bg-[#5affff] text-[#003737] font-black text-xs px-6 py-2 rounded-full shadow-[0_0_15px_rgba(90,255,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">sparkles</span>
              Pet Kleo
            </button>
          </div>

          <div className="pt-2 text-xs font-bold text-[#bacac9]">The Syntax Sovereign</div>
        </div>

        {/* Bond Status Box */}
        <div className="glass-card rounded-3xl p-6 border border-[#5affff]/20 space-y-4 shadow-xl">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#bacac9] uppercase tracking-widest block">BOND STATUS</span>
            <div className="font-display text-xl font-bold text-[#5affff]">Level 18: Inseparable</div>
            <div className="flex justify-between items-center text-xs font-bold text-[#bacac9] pt-1">
              <span>Progress</span>
              <span>2,450 / 3,000 XP</span>
            </div>
            <div className="w-full h-2.5 bg-[#2f3445] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#5affff] to-[#cebdff] rounded-full" style={{ width: '81%' }} />
            </div>
          </div>

          {/* 3 Stat Pills */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-center">
            <div className="bg-[#5affff]/10 border border-[#5affff]/30 p-2.5 rounded-2xl">
              <span className="text-[9px] text-[#bacac9] uppercase block font-semibold">Mood</span>
              <span className="text-xs font-bold text-[#5affff]">Ecstatic</span>
            </div>

            <div className="bg-[#cebdff]/10 border border-[#cebdff]/30 p-2.5 rounded-2xl">
              <span className="text-[9px] text-[#bacac9] uppercase block font-semibold">Hunger</span>
              <span className="text-xs font-bold text-[#cebdff]">Satisfied</span>
            </div>

            <div className="bg-[#161b2b] border border-white/5 p-2.5 rounded-2xl">
              <span className="text-[9px] text-[#bacac9] uppercase block font-semibold">Focus</span>
              <span className="text-xs font-bold text-white">High</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Right Wardrobe Area */}
      <section className="flex-1 w-full space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Kleo's Wardrobe</h2>
            <p className="text-xs text-[#bacac9]">Personalize your companion with earned items</p>
          </div>

          {/* Category Tabs */}
          <div className="bg-[#161b2b] p-1 rounded-xl border border-white/5 flex gap-1">
            {(['Head', 'Neck', 'Eyes'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === tab ? 'bg-[#25293a] text-[#5affff]' : 'text-[#bacac9] hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Wardrobe Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wardrobeItems.map((item) => (
            <div
              key={item.id}
              onClick={() => item.isUnlocked && equipCosmetic(item.category === 'Head' ? 'hat' : item.category === 'Neck' ? 'scarf' : 'glasses', item.id)}
              className={`glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-3 relative cursor-pointer border transition-all ${
                item.isEquipped
                  ? 'bg-[#161b2b] border-[#5affff] shadow-[0_0_20px_rgba(90,255,255,0.15)]'
                  : item.isUnlocked
                  ? 'border-white/5 hover:border-[#5affff]/40'
                  : 'border-white/5 opacity-50 cursor-not-allowed'
              }`}
            >
              {item.isEquipped && (
                <span className="absolute top-3 right-3 bg-[#5affff] text-[#003737] font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                  EQUIPPED
                </span>
              )}

              <div className="w-14 h-14 rounded-full bg-[#161b2b] border border-white/10 flex items-center justify-center text-[#5affff] text-2xl">
                {item.isUnlocked ? (
                  <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                ) : (
                  <span className="material-symbols-outlined text-xl text-[#bacac9]">lock</span>
                )}
              </div>

              <div>
                <h3 className="font-display font-bold text-sm text-white">{item.name}</h3>
                <p className="text-[11px] text-[#bacac9] mt-1">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Customization Perk Banner */}
        <div className="glass-card p-5 rounded-2xl border border-[#5affff]/20 flex items-center gap-4 bg-[#161b2b]/60">
          <div className="w-10 h-10 rounded-full bg-[#5affff]/10 flex items-center justify-center text-[#5affff] shrink-0">
            <span className="material-symbols-outlined text-xl">info</span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#5affff]">Customization Perk</h4>
            <p className="text-[11px] text-[#bacac9] mt-0.5">
              Equipping rare items boosts your daily XP multiplier by 1.2x. Visit the Shop to discover limited-time seasonal drops!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
