import React from 'react';
import { COSMETIC_ITEMS } from '../../store/useAppStore';
import { CosmeticItem } from '../../types';
import { KleoAvatar } from './KleoAvatar';
import { X, Lock, Check } from 'lucide-react';

interface KleoWardrobeModalProps {
  isOpen: boolean;
  onClose: () => void;
  kleoBondLevel: number;
  equippedCosmetics: {
    hat?: string;
    scarf?: string;
    glasses?: string;
    skin?: string;
  };
  onEquip: (category: 'hat' | 'scarf' | 'glasses' | 'skin', id?: string) => void;
}

export const KleoWardrobeModal: React.FC<KleoWardrobeModalProps> = ({
  isOpen,
  onClose,
  kleoBondLevel,
  equippedCosmetics,
  onEquip
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <X size={22} />
        </button>

        <div className="text-center mb-6">
          <h2 className="font-brand text-2xl font-bold text-slate-100 flex items-center justify-center gap-2">
            <span>🐾</span> Kleo's Wardrobe & Accessories
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Increase your bond level with Kleo by completing daily lessons to unlock stylish gear!
          </p>
        </div>

        {/* Live Preview */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800 mb-6">
          <KleoAvatar mood="happy" equippedCosmetics={equippedCosmetics} size={150} />
          <div className="mt-2 text-xs font-semibold text-sky-400 bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800">
            Bond Level {kleoBondLevel} Active
          </div>
        </div>

        {/* Items Grid */}
        <div className="space-y-4 max-h-60 overflow-y-auto pr-1">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Available Accessories</h3>
          <div className="grid grid-cols-2 gap-3">
            {COSMETIC_ITEMS.map((item: CosmeticItem) => {
              const isUnlocked = kleoBondLevel >= item.requiredBondLevel;
              const isEquipped = (equippedCosmetics as any)[item.category] === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                    isEquipped
                      ? 'bg-sky-950/70 border-sky-400/80 shadow-md shadow-sky-500/10'
                      : isUnlocked
                      ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      : 'bg-slate-950/40 border-slate-900 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-slate-200">{item.name}</div>
                      <div className="text-xs text-slate-400">
                        {isUnlocked ? `Req: Bond Lvl ${item.requiredBondLevel}` : `Locked (Lvl ${item.requiredBondLevel})`}
                      </div>
                    </div>
                  </div>

                  {isUnlocked ? (
                    <button
                      onClick={() => onEquip(item.category, isEquipped ? undefined : item.id)}
                      className={`p-2 rounded-lg text-xs font-semibold transition-all ${
                        isEquipped
                          ? 'bg-sky-500 text-white'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      {isEquipped ? <Check size={16} /> : 'Equip'}
                    </button>
                  ) : (
                    <div className="p-2 text-slate-500">
                      <Lock size={16} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
