import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KleoMood } from '../../types';
import { useKleoStore } from '../../store/useKleoStore';
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
  const petKleo = useKleoStore((state) => state.petKleo);
  const [isPetting, setIsPetting] = useState(false);
  const [petParticles, setPetParticles] = useState<{ id: number; x: number; icon: string; size: number }[]>([]);
  const [engagementGreeting, setEngagementGreeting] = useState<string>("Annyeong! 👋 Pet me to start!");
  const [greetingIndex, setGreetingIndex] = useState(0);

  const greetings = [
    "Annyeong! 👋 Pet me to start!",
    "Konnichiwa! 🌸 Ready to learn?",
    "Meow! 🐾 Korean, Japanese & English!",
    "Click or hover to stroke Kleo! 💖",
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

  // Continuous stream of floating bliss hearts when hovering (matching video)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPetting) {
      interval = setInterval(() => {
        spawnHeartParticle();
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPetting, size]);

  const handleMouseEnter = () => {
    setIsPetting(true);
    petKleo();
    spawnHeartParticle();
  };

  const handleMouseLeave = () => {
    setIsPetting(false);
  };

  const handleMouseMove = () => {
    if (Math.random() > 0.4) {
      spawnHeartParticle();
    }
  };

  const spawnHeartParticle = () => {
    const icons = ['💖', '❤️', '💕', '✨', '🌸', '🐾'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];
    const randomX = (Math.random() - 0.5) * (size * 0.9);
    const randomSize = 14 + Math.random() * 12;
    const newParticle = {
      id: Date.now() + Math.random(),
      x: randomX,
      icon: randomIcon,
      size: randomSize
    };

    setPetParticles((prev) => [...prev.slice(-14), newParticle]);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleMouseEnter}
      className="relative flex items-center justify-center select-none cursor-pointer group"
      style={{ width: `${size}px`, height: `${size}px` }}
      title="Pet Kleo! 🐾 (Hover to stroke & activate purring hearts animation)"
    >
      {/* Background Soft Glow Aura & Pulsing Ring for Hero Engagement */}
      <div className={`absolute inset-0 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
        isPetting
          ? 'bg-[#f97316]/35 scale-135 opacity-100'
          : interactiveEngagement
          ? 'bg-gradient-to-tr from-[#f97316]/20 to-[#fb923c]/30 animate-pulse opacity-80 group-hover:opacity-100 group-hover:scale-115'
          : 'bg-[#f97316]/10 opacity-40 group-hover:opacity-100'
      }`} />

      {/* Hero Engagement Wave Speech Balloon */}
      {interactiveEngagement && !isPetting && (
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

      {/* Floating Red Hearts Animation Stream (Matching Shared Video) */}
      <AnimatePresence>
        {petParticles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{ opacity: 0.9, y: 10, scale: 0.5 }}
            animate={{
              opacity: [0.9, 1, 0],
              y: -90,
              scale: [0.5, 1.4, 1],
              x: [particle.x, particle.x + (Math.random() * 24 - 12), particle.x + (Math.random() * 36 - 18)]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            className="absolute top-0 z-30 pointer-events-none font-bold drop-shadow-md select-none"
            style={{ fontSize: `${particle.size}px` }}
          >
            {particle.icon}
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Animated Petting Hand Stroke Overlay */}
      <AnimatePresence>
        {isPetting && (
          <motion.div
            initial={{ opacity: 0, y: -20, rotate: -15 }}
            animate={{
              opacity: 1,
              x: [-15, 15, -15],
              y: [-12, -2, -12],
              rotate: [-15, 15, -15]
            }}
            exit={{ opacity: 0 }}
            transition={{
              x: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' },
              y: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' },
              rotate: { repeat: Infinity, duration: 0.8, ease: 'easeInOut' }
            }}
            className="absolute -top-4 z-40 text-3xl pointer-events-none drop-shadow-lg"
          >
            🖐️
          </motion.div>
        )}
      </AnimatePresence>

      {/* Official 2D Siamese Cat Mascot Image with Dynamic Engagement Motion */}
      <motion.img
        src={kleo2dCatImg}
        alt="2D Kleo Siamese Cat Mascot"
        animate={
          isPetting
            ? {
                rotate: [-5, 5, -5, 5, 0],
                y: [0, -6, 2, 0],
                scale: [1, 1.08, 1.03, 1]
              }
            : interactiveEngagement
            ? {
                rotate: [0, -4, 4, -3, 3, 0],
                y: [0, -8, 0, -5, 0],
                scale: [1, 1.04, 1, 1.02, 1]
              }
            : mood === 'celebrating'
            ? { y: [0, -10, 0] }
            : { y: [0, -2, 0] }
        }
        transition={
          isPetting
            ? { repeat: Infinity, duration: 0.7, ease: 'easeInOut' }
            : interactiveEngagement
            ? { repeat: Infinity, duration: 2.8, ease: 'easeInOut' }
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
