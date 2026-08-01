import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KleoMood } from '../../types';
import { useKleoStore } from '../../store/useKleoStore';
import kleo2dCatImg from '../../assets/kleo_2d_isolated.png';

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
  const petKleo = useKleoStore((state) => state.petKleo);
  const [isPetting, setIsPetting] = useState(false);
  const [petParticles, setPetParticles] = useState<{ id: number; x: number; icon: string; size: number }[]>([]);

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

    setPetParticles((prev) => [...prev.slice(-12), newParticle]);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      onClick={handleMouseEnter}
      className="relative flex items-center justify-center select-none cursor-pointer group"
      style={{ width: `${size}px`, height: `${size}px` }}
      title="Pet Kleo! 🐾 (Hover to activate purring hearts animation)"
    >
      {/* Background Soft Glow Aura (Expands & glows warm orange on hover) */}
      <div className={`absolute inset-0 rounded-full blur-2xl pointer-events-none transition-all duration-500 ${
        isPetting
          ? 'bg-[#f97316]/30 scale-125 opacity-100'
          : 'bg-[#f97316]/10 opacity-40 group-hover:opacity-100'
      }`} />

      {/* Floating Red Hearts Animation Stream (Matching Shared Video) */}
      <AnimatePresence>
        {petParticles.map((particle) => (
          <motion.span
            key={particle.id}
            initial={{ opacity: 0.9, y: 10, scale: 0.5 }}
            animate={{
              opacity: [0.9, 1, 0],
              y: -80,
              scale: [0.5, 1.3, 1],
              x: [particle.x, particle.x + (Math.random() * 20 - 10), particle.x + (Math.random() * 30 - 15)]
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

      {/* Official 2D Siamese Cat Mascot Image with Hover Bliss Reaction (Matching Video) */}
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
            : mood === 'celebrating'
            ? { y: [0, -10, 0] }
            : { y: [0, -2, 0] }
        }
        transition={
          isPetting
            ? { repeat: Infinity, duration: 0.7, ease: 'easeInOut' }
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
