import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm
}) => {
  const { isDarkMode } = useAppStore();

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-md p-4 select-none">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="relative w-full max-w-[420px] z-10"
        >
          {/* Main Playful Card */}
          <div
            className={`relative rounded-[28px] border-4 border-[#3A2E27] pt-20 px-7 pb-7 text-center shadow-[8px_8px_0_#3A2E27] ${
              isDarkMode
                ? 'bg-[#1b2234] text-slate-100 shadow-[8px_8px_0_#0f1422]'
                : 'bg-[#FFFCF3] text-[#3A2E27]'
            }`}
          >

            {/* Floating Animated Mascot (Worried Book Study Buddy) */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 pointer-events-none z-10">
              {/* Mascot Shadow */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3.5 bg-[#3A2E27]/20 rounded-full animate-pulse" />

              {/* Mascot Vector SVG */}
              <motion.div
                animate={{
                  y: [0, -7, 0],
                  rotate: [-3, -1, -3]
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2.6,
                  ease: 'easeInOut'
                }}
                className="w-28 h-28"
              >
                <svg
                  width="112"
                  height="112"
                  viewBox="0 0 120 120"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full drop-shadow-md"
                >
                  {/* Book Body */}
                  <rect
                    x="24"
                    y="34"
                    width="72"
                    height="62"
                    rx="14"
                    fill="#6C5CE7"
                    stroke="#3A2E27"
                    strokeWidth="4"
                  />
                  {/* Spine Center Line */}
                  <path d="M60 34 V96" stroke="#3A2E27" strokeWidth="3" />
                  {/* Page Lines */}
                  <path
                    d="M32 46 h20 M32 56 h18 M68 46 h20 M68 56 h18"
                    stroke="#EFE9FF"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Bookmark Ribbon */}
                  <path
                    d="M60 34 L60 10 L70 18 L80 10 L80 34 Z"
                    fill="#FFC93C"
                    stroke="#3A2E27"
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  {/* Arms */}
                  <path
                    d="M24 60 C6 60 4 78 16 84"
                    stroke="#3A2E27"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle
                    cx="16"
                    cy="85"
                    r="6"
                    fill="#FFDCA8"
                    stroke="#3A2E27"
                    strokeWidth="3.5"
                  />
                  <path
                    d="M96 60 C114 66 110 80 100 82"
                    stroke="#3A2E27"
                    strokeWidth="5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle
                    cx="99"
                    cy="83"
                    r="6"
                    fill="#FFDCA8"
                    stroke="#3A2E27"
                    strokeWidth="3.5"
                  />
                  {/* Cute Big Worried Eyes */}
                  <ellipse
                    cx="44"
                    cy="68"
                    rx="8"
                    ry="9"
                    fill="#FFFFFF"
                    stroke="#3A2E27"
                    strokeWidth="3"
                  />
                  <ellipse
                    cx="76"
                    cy="68"
                    rx="8"
                    ry="9"
                    fill="#FFFFFF"
                    stroke="#3A2E27"
                    strokeWidth="3"
                  />
                  {/* Pupils */}
                  <circle cx="45" cy="71" r="3.4" fill="#3A2E27" />
                  <circle cx="77" cy="71" r="3.4" fill="#3A2E27" />
                  {/* Worried Mouth */}
                  <path
                    d="M52 84 Q60 78 68 84"
                    stroke="#3A2E27"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    fill="none"
                  />
                  {/* Worried Eyebrows */}
                  <path
                    d="M37 58 L50 61"
                    stroke="#3A2E27"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <path
                    d="M83 58 L70 61"
                    stroke="#3A2E27"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Legs */}
                  <rect x="40" y="94" width="10" height="14" rx="4" fill="#3A2E27" />
                  <rect x="70" y="94" width="10" height="14" rx="4" fill="#3A2E27" />
                </svg>
              </motion.div>
            </div>

            {/* Heading */}
            <h2 className="font-extrabold text-2xl tracking-tight mb-6">
              Log out of{' '}
              <span className="text-[#6C5CE7] dark:text-[#a29bfe]">CATALOGUE</span>?
            </h2>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3.5">
              {/* Primary Motivational Button: Keep Studying */}
              <button
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-2xl border-3 border-[#3A2E27] bg-[#35D0BA] hover:bg-[#2bc4ae] text-[#0C4A41] font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_6px_0_#1FA994] active:translate-y-1.5 active:shadow-none transition-all cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path d="M12 8V4l8 8-8 8v-4H4V8h8z" fill="#0C4A41" />
                </svg>
                <span>Keep studying</span>
              </button>

              {/* Danger Button: Log Out Anyway */}
              <button
                onClick={onConfirm}
                className="w-full py-3.5 px-4 rounded-2xl border-3 border-[#3A2E27] bg-[#FF5A5F] hover:bg-[#f0484e] text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-2 shadow-[0_6px_0_#D63A3F] active:translate-y-1.5 active:shadow-none transition-all cursor-pointer"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="shrink-0"
                >
                  <path
                    d="M16 17l5-5-5-5M21 12H9M13 21H7a2 2 0 01-2-2V5a2 2 0 012-2h6"
                    stroke="#FFFFFF"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Log out anyway</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
