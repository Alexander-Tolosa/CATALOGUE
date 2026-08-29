import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
import sadSiameseCat from '../../assets/sad_siamese_cat.png';

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
  const { isDarkMode, profile } = useAppStore();
  const { t } = useTranslation();

  const streakDays = profile?.streakDays || 7;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 select-none">
        {/* Backdrop click to close */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 z-0"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
          className="relative w-full max-w-[400px] z-10"
        >
          {/* Main Playful Card */}
          <div className="relative rounded-[32px] border-[3.5px] border-[#222B45] bg-white pt-18 sm:pt-20 px-6 sm:px-7 pb-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            {/* Mascot (Sad Siamese Cat with Blue Cap & Scarf - Floating/Peeking on Top) */}
            <div className="absolute -top-16 sm:-top-18 left-1/2 -translate-x-1/2 pointer-events-none z-20 flex flex-col items-center">
              <div className="w-32 h-32 sm:w-36 sm:h-36 relative flex items-center justify-center">
                <img
                  src={sadSiameseCat}
                  alt="Sad Siamese Cat Companion"
                  className="w-full h-full object-contain drop-shadow-md"
                  draggable={false}
                />
              </div>
            </div>

            {/* Streak Safety Pill Badge */}
            <div className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFF0E6] text-[#E05330] text-xs sm:text-sm font-bold shadow-xs mx-auto mb-3.5">
              <span>🔥</span>
              <span>{streakDays} {t.logoutModal.streakSafe}</span>
            </div>

            {/* Heading */}
            <h2 className="font-extrabold text-2xl sm:text-[26px] text-[#1E293B] tracking-tight mb-2.5">
              {t.logoutModal.title}
            </h2>

            {/* Subtext Description */}
            <p className="text-sm sm:text-[15px] text-[#5A687D] leading-relaxed max-w-[320px] mx-auto mb-7 font-normal">
              {t.logoutModal.description}
            </p>

            {/* Action Buttons Stack */}
            <div className="flex flex-col gap-3">
              {/* Primary Motivation Button: Keep Studying */}
              <button
                onClick={onClose}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#FF5A36] hover:bg-[#F24E2A] text-white font-extrabold text-base sm:text-[17px] tracking-wide shadow-[0_5px_0_#D93815] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center"
              >
                <span>{t.logoutModal.stayLoggedIn}</span>
              </button>

              {/* Secondary Button: Sign out */}
              <button
                onClick={onConfirm}
                className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-50 border-2 border-[#E2E8F0] text-[#64748B] hover:text-[#475569] font-extrabold text-base sm:text-[17px] tracking-wide shadow-[0_4px_0_#E2E8F0] active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center"
              >
                <span>{t.logoutModal.confirmLogout}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

