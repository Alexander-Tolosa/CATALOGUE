import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KleoMood } from '../../types';
import kleo2dCatImg from '../../assets/kleo_2d_isolated.png';

export interface KleoAvatarProps {
  mood?: KleoMood;
  equippedCosmetics?: {
    hat?: string;
    scarf?: string;
    glasses?: string;
    skin?: string;
  };
  size?: number;
  interactiveEngagement?: boolean;
}

export const KleoAvatar: React.FC<KleoAvatarProps> = ({
  mood = 'happy',
  equippedCosmetics,
  size = 140,
  interactiveEngagement = false
}) => {
  const [engagementGreeting, setEngagementGreeting] = useState<string>("Annyeong! 👋 Ready to learn?");
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    "Annyeong! 👋 Ready to learn?",
    "Konnichiwa! 🌸 Master daily scripts!",
    "Meow! 🐾 Korean, Japanese & English!",
    "Let meow-tivate your studies! ✨"
  ];

  // Rotate interactive greeting balloons in Hero mode every 4 seconds
  useEffect(() => {
    if (!interactiveEngagement) return;
    const interval = setInterval(() => {
      setGreetingIndex((prev) => {
        const next = (prev + 1) % greetings.length;
        setEngagementGreeting(greetings[next]);
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [interactiveEngagement]);

  return (
    <div
      className="relative flex items-center justify-center select-none group"
      style={{ width: `${size}px`, height: `${size}px` }}
      title="Kleo AI Companion"
    >
      {/* Background Soft Glow Aura */}
      <div className={`absolute inset-0 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
        interactiveEngagement
          ? 'bg-gradient-to-tr from-[#f97316]/20 to-[#fb923c]/30 animate-pulse opacity-80 group-hover:opacity-100 group-hover:scale-115'
          : 'bg-[#f97316]/10 opacity-40 group-hover:opacity-100'
      }`} />

      {/* Hero Engagement Speech Balloon */}
      {interactiveEngagement && (
        <AnimatePresence mode="wait">
          <motion.div
            key={greetingIndex}
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -size * 0.45, scale: 1 }}
            exit={{ opacity: 0, y: -size * 0.55, scale: 0.8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute z-40 bg-white/95 backdrop-blur-md text-slate-900 border-2 border-[#f97316] px-3.5 py-1.5 rounded-2xl shadow-[0_6px_20px_rgba(249,115,22,0.3)] text-xs font-black tracking-tight whitespace-nowrap pointer-events-none"
          >
            {engagementGreeting}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-[#f97316]" />
          </motion.div>
        </AnimatePresence>
      )}

      {/* 2D Siamese Cat Mascot Image with Smooth Idle Motion */}
      <motion.img
        src={kleo2dCatImg}
        alt="2D Kleo Siamese Cat Mascot"
        animate={
          interactiveEngagement
            ? {
                rotate: [0, -3, 3, -2, 2, 0],
                y: [0, -6, 0, -4, 0],
                scale: [1, 1.03, 1, 1.02, 1]
              }
            : mood === 'celebrating'
            ? { y: [0, -10, 0] }
            : { y: [0, -2, 0] }
        }
        transition={
          interactiveEngagement
            ? { repeat: Infinity, duration: 3, ease: 'easeInOut' }
            : { repeat: Infinity, duration: 2, ease: 'easeInOut' }
        }
        className="w-full h-full object-contain relative z-10 drop-shadow-[0_10px_20px_rgba(0,0,0,0.18)]"
        onError={(e) => {
          (e.target as HTMLImageElement).src = kleo2dCatImg;
        }}
      />

      {/* Equipped Cosmetics Overlays */}
      {equippedCosmetics?.hat === 'chef_hat' && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-3xl z-20 pointer-events-none drop-shadow-md">
          👨‍🍳
        </div>
      )}

      {equippedCosmetics?.glasses === 'cyber_glass' && (
        <div className="absolute top-8 left-1/2 -translate-x-1/2 text-xl z-20 pointer-events-none opacity-95">
          👓
        </div>
      )}

      {equippedCosmetics?.hat === 'golden_crown' && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl z-20 pointer-events-none drop-shadow-sm">
          👑
        </div>
      )}
    </div>
  );
};
