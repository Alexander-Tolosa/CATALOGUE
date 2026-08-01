import React from 'react';
import { KleoMood } from '../../types';
import kleoCatImg from '../../assets/kleo_cat_isolated.png';

interface KleoAvatarProps {
  mood?: KleoMood;
  equippedCosmetics?: {
    hat?: string;
    scarf?: string;
    glasses?: string;
    skin?: string;
  };
  size?: number;
}

export const KleoAvatar: React.FC<KleoAvatarProps> = ({
  mood = 'happy',
  equippedCosmetics,
  size = 140
}) => {
  // Determine CSS animation based on Kleo's current mood
  const getMoodAnimClass = () => {
    switch (mood) {
      case 'celebrating':
        return 'animate-bounce';
      case 'curious':
        return 'hover:rotate-6 transition-transform';
      case 'encouraging':
      case 'happy':
        return 'animate-pulse';
      case 'nuzzling':
        return 'animate-wiggle';
      case 'sleepy':
      default:
        return '';
    }
  };

  return (
    <div
      className={`relative flex items-center justify-center select-none ${getMoodAnimClass()}`}
      style={{ width: `${size}px`, height: `${size}px` }}
    >
      {/* Glow Aura Backdrop */}
      <div className="absolute inset-0 rounded-full bg-[#5affff]/15 blur-xl pointer-events-none" />

      {/* Isolated 3D Siamese Cat Mascot Image (No background card or speech bubbles) */}
      <img
        src={kleoCatImg}
        alt="Kleo the Siamese Cat Mascot"
        className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] transition-transform duration-300 hover:scale-105"
        onError={(e) => {
          (e.target as HTMLImageElement).src = '/kleo_cat_isolated.png';
        }}
      />

      {/* Equipped Cosmetic Overlays */}
      {equippedCosmetics?.hat === 'blue_beret' && (
        <div className="absolute -top-2 right-4 text-3xl z-20 animate-bounce">
          🧢
        </div>
      )}

      {equippedCosmetics?.hat === 'chef_hat' && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-4xl z-20 drop-shadow-md">
          👨‍🍳
        </div>
      )}

      {equippedCosmetics?.glasses === 'cyber_glass' && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 text-2xl z-20 opacity-95">
          👓
        </div>
      )}

      {equippedCosmetics?.hat === 'golden_crown' && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-4xl z-20 filter drop-shadow">
          👑
        </div>
      )}
    </div>
  );
};
