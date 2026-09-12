import React from 'react';
import { motion } from 'framer-motion';

interface SiameseCatToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Animated Siamese Cat Theme Toggle Switch
 * Exactly matching the user's custom design:
 * - Coral-salmon pill capsule track with double-rim border
 * - Custom Siamese cat head with cream fur, chocolate seal-point ears and mask, whiskers
 * - Smooth transition between:
 *   - Light Mode: Almond cat slit eyes (Image 2) on the left
 *   - Dark Mode: Dilated round anime sparkling eyes with ':3' smile (Image 1) on the right
 */
export const SiameseCatToggle: React.FC<SiameseCatToggleProps> = ({
  isDarkMode,
  onToggle,
  className = '',
  size = 'md',
}) => {
  const scale = size === 'sm' ? 0.8 : size === 'lg' ? 1.2 : 1;
  const trackWidth = 154 * scale;
  const trackHeight = 52 * scale;
  const catSize = 68 * scale;
  const travelDistance = (154 - 68 - 2) * scale; // ~84px at 1x scale

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDarkMode}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onToggle();
        }
      }}
      className={`relative inline-flex items-center select-none cursor-pointer group focus:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B35]/40 rounded-full transition-transform active:scale-95 ${className}`}
      style={{
        width: trackWidth,
        height: catSize,
      }}
    >
      {/* 1. Exact Coral-Orange Capsule Pill Track */}
      <div
        className="absolute inset-x-0 rounded-full overflow-hidden transition-all duration-300 pointer-events-none"
        style={{
          height: trackHeight,
          bottom: 2 * scale,
          background: 'linear-gradient(135deg, #FF7250 0%, #FA643F 50%, #E64E2A 100%)',
          border: '2.5px solid #EA522F',
          boxShadow: isDarkMode
            ? '0 4px 18px rgba(234, 82, 47, 0.45), inset 0 2px 5px rgba(255, 255, 255, 0.3), inset 0 -2px 5px rgba(0, 0, 0, 0.2)'
            : '0 4px 14px rgba(234, 82, 47, 0.3), inset 0 2px 5px rgba(255, 255, 255, 0.35), inset 0 -2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* Inner thin stroke rim (matching the inner border in user's image) */}
        <div
          className="absolute inset-1 rounded-full pointer-events-none"
          style={{
            border: '1.5px solid rgba(255, 175, 150, 0.85)',
          }}
        />
      </div>

      {/* 2. Siamese Cat Head Slider Knob */}
      <motion.div
        className="absolute z-10 cursor-pointer pointer-events-none"
        style={{
          width: catSize,
          height: catSize,
          top: 0,
        }}
        initial={false}
        animate={{
          x: isDarkMode ? travelDistance : 2 * scale,
          rotate: isDarkMode ? 2 : -2,
        }}
        whileHover={{
          scale: 1.05,
          rotate: 0,
        }}
        whileTap={{
          scale: 0.95,
        }}
        transition={{
          type: 'spring',
          stiffness: 450,
          damping: 26,
          mass: 0.75,
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md overflow-visible"
        >
          <defs>
            {/* Cream Fur Color */}
            <linearGradient id="siameseCream" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF4E6" />
              <stop offset="60%" stopColor="#F8E2CD" />
              <stop offset="100%" stopColor="#EBD3BC" />
            </linearGradient>

            {/* Dark Seal Ear Outer */}
            <linearGradient id="earOuter" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#311F17" />
              <stop offset="100%" stopColor="#3E271D" />
            </linearGradient>

            {/* Inner Ear Warm Mocha */}
            <linearGradient id="earInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#5B3E30" />
              <stop offset="100%" stopColor="#6F4F3F" />
            </linearGradient>

            {/* Dark Chocolate Face Mask */}
            <linearGradient id="faceMask" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3E271D" />
              <stop offset="100%" stopColor="#342017" />
            </linearGradient>

            {/* Daytime Sky Blue Iris (Image 2) */}
            <linearGradient id="slitIris" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7EB3F5" />
              <stop offset="100%" stopColor="#629DE8" />
            </linearGradient>

            {/* Anime Sparkle Blue Iris (Image 1) */}
            <linearGradient id="animeIris" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6EA8F7" />
              <stop offset="100%" stopColor="#5294EC" />
            </linearGradient>
          </defs>

          {/* EARS (Pointed Siamese Ears - Dynamic posture between Happy and Angry) */}
          <motion.g
            className="origin-center"
            animate={{
              rotate: isDarkMode ? 0 : 0,
            }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {/* Left Ear Outer */}
            <motion.path
              d="M 19 50 C 17 38, 15 20, 16 9 C 26 14, 37 21, 45 29 Z"
              fill="url(#earOuter)"
              stroke="#2B1A13"
              strokeWidth="1"
              strokeLinejoin="round"
              animate={{
                d: isDarkMode
                  ? "M 18 52 C 15 40, 11 23, 11 13 C 22 17, 34 23, 43 31 Z" // slightly flared angry ear
                  : "M 19 50 C 17 38, 15 20, 16 9 C 26 14, 37 21, 45 29 Z", // perked happy ear
              }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            />
            {/* Left Ear Inner */}
            <motion.path
              d="M 23 44 C 21 34, 19 21, 20 15 C 26 19, 35 24, 41 30 Z"
              fill="url(#earInner)"
              animate={{
                d: isDarkMode
                  ? "M 22 46 C 19 36, 15 24, 15 18 C 22 22, 32 26, 39 32 Z"
                  : "M 23 44 C 21 34, 19 21, 20 15 C 26 19, 35 24, 41 30 Z",
              }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            />

            {/* Right Ear Outer */}
            <motion.path
              d="M 81 50 C 83 38, 85 20, 84 9 C 74 14, 63 21, 55 29 Z"
              fill="url(#earOuter)"
              stroke="#2B1A13"
              strokeWidth="1"
              strokeLinejoin="round"
              animate={{
                d: isDarkMode
                  ? "M 82 52 C 85 40, 89 23, 89 13 C 78 17, 66 23, 57 31 Z" // slightly flared angry ear
                  : "M 81 50 C 83 38, 85 20, 84 9 C 74 14, 63 21, 55 29 Z", // perked happy ear
              }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            />
            {/* Right Ear Inner */}
            <motion.path
              d="M 77 44 C 79 34, 81 21, 80 15 C 74 19, 65 24, 59 30 Z"
              fill="url(#earInner)"
              animate={{
                d: isDarkMode
                  ? "M 78 46 C 81 36, 85 24, 85 18 C 78 22, 68 26, 61 32 Z"
                  : "M 77 44 C 79 34, 81 21, 80 15 C 74 19, 65 24, 59 30 Z",
              }}
              transition={{ type: 'spring', stiffness: 450, damping: 26 }}
            />
          </motion.g>

          {/* HEAD SILHOUETTE (Round cream head) */}
          <ellipse
            cx="50"
            cy="58"
            rx="35"
            ry="31"
            fill="url(#siameseCream)"
          />

          {/* SIAMESE DARK CHOCOLATE SEAL MASK */}
          <path
            d="M 23 56 C 23 41, 35 37, 50 37 C 65 37, 77 41, 77 56 C 79 73, 69 83, 50 83 C 31 83, 21 73, 23 56 Z"
            fill="url(#faceMask)"
          />

          {/* WHISKERS (Two curved whiskers on each side) */}
          <g stroke="#342017" strokeWidth="2.8" strokeLinecap="round" fill="none">
            {/* Left Whiskers */}
            <path d="M 24 69 Q 14 69, 4 70" />
            <path d="M 25 75 Q 16 78, 6 82" />

            {/* Right Whiskers */}
            <path d="M 76 69 Q 86 69, 96 70" />
            <path d="M 75 75 Q 84 78, 94 82" />
          </g>

          {/* ========================================================================= */}
          {/* STATE 1: HAPPY (Light Mode - Reference 'Eggy')                          */}
          {/* Big round sparkling anime eyes, dual white highlights, cute ':3' smile   */}
          {/* ========================================================================= */}
          <g
            className={`transition-all duration-300 origin-center ${
              !isDarkMode ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            {/* Cute Happy ':3' Smiling Mouth */}
            <path
              d="M 43.5 71.5 Q 46.8 76.5, 50 71.5 Q 53.2 76.5, 56.5 71.5"
              stroke="#F8E2CD"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Left Eye - Round Happy Anime Sparkling Eye */}
            <ellipse
              cx="36.5"
              cy="58.5"
              rx="8.5"
              ry="9"
              fill="url(#animeIris)"
              stroke="#1E1510"
              strokeWidth="1.2"
            />
            {/* Left Pupil Dark Ring */}
            <circle cx="36.5" cy="58.5" r="5.2" fill="#1C140F" />
            {/* Left Dual Highlights */}
            <circle cx="34" cy="55.5" r="3.2" fill="#FFFFFF" />
            <circle cx="39.5" cy="62" r="1.5" fill="#FFFFFF" />

            {/* Right Eye - Round Happy Anime Sparkling Eye */}
            <ellipse
              cx="63.5"
              cy="58.5"
              rx="8.5"
              ry="9"
              fill="url(#animeIris)"
              stroke="#1E1510"
              strokeWidth="1.2"
            />
            {/* Right Pupil Dark Ring */}
            <circle cx="63.5" cy="58.5" r="5.2" fill="#1C140F" />
            {/* Right Dual Highlights */}
            <circle cx="61" cy="55.5" r="3.2" fill="#FFFFFF" />
            <circle cx="66.5" cy="62" r="1.5" fill="#FFFFFF" />
          </g>

          {/* ========================================================================= */}
          {/* STATE 2: ANGRY (Dark Mode - Reference 'Pushkin')                         */}
          {/* Slanted intense almond eyes, sharp slit pupils, angry furrow & mouth     */}
          {/* ========================================================================= */}
          <g
            className={`transition-all duration-300 origin-center ${
              isDarkMode ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            {/* Stern / Angry Cat Mouth (Downturned stern pout) */}
            <path
              d="M 45.5 73.5 Q 50 71.5, 54.5 73.5"
              stroke="#24160E"
              strokeWidth="2.2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Angry Brow Creases between eyes */}
            <path
              d="M 46 47.5 L 48 51.5 M 54 47.5 L 52 51.5"
              stroke="#24160E"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Left Eye - Slanted Angry Almond Eye */}
            <path
              d="M 26 55.5 C 31 52.5, 41 57.5, 45 62.5 C 40 66, 29 65.5, 26 55.5 Z"
              fill="url(#slitIris)"
              stroke="#1E1510"
              strokeWidth="1.3"
            />
            {/* Left Slit Pupil (Tilted with eye angle) */}
            <path
              d="M 35.8 54.5 C 37.4 57.2, 37.4 60.5, 35.8 63.5 C 34.2 60.5, 34.2 57.2, 35.8 54.5 Z"
              fill="#1C140F"
            />
            {/* Left Tiny Glare Highlight */}
            <circle cx="34" cy="56.5" r="1" fill="#FFFFFF" opacity="0.8" />

            {/* Right Eye - Slanted Angry Almond Eye */}
            <path
              d="M 74 55.5 C 69 52.5, 59 57.5, 55 62.5 C 60 66, 71 65.5, 74 55.5 Z"
              fill="url(#slitIris)"
              stroke="#1E1510"
              strokeWidth="1.3"
            />
            {/* Right Slit Pupil (Tilted with eye angle) */}
            <path
              d="M 64.2 54.5 C 65.8 57.2, 65.8 60.5, 64.2 63.5 C 62.6 60.5, 62.6 57.2, 64.2 54.5 Z"
              fill="#1C140F"
            />
            {/* Right Tiny Glare Highlight */}
            <circle cx="66" cy="56.5" r="1" fill="#FFFFFF" opacity="0.8" />
          </g>
        </svg>
      </motion.div>
    </button>
  );
};
