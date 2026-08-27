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
  const { isDarkMode } = useAppStore();
  const { t } = useTranslation();

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
          className="relative w-full max-w-[420px] z-10"
        >
          {/* Main Playful Card */}
          <div
            className={`relative rounded-[28px] border-4 border-[#3A2E27] pt-20 sm:pt-22 px-7 pb-7 text-center shadow-[8px_8px_0_#3A2E27] ${isDarkMode
                ? 'bg-[#1b2234] text-slate-100 shadow-[8px_8px_0_#0f1422]'
                : 'bg-[#FFFCF3] text-[#3A2E27]'
              }`}
          >
            {/* Mascot (Sad Siamese Cat with Blue Cap & Scarf - Half Inside Card) */}
            <div className="absolute -top-14 sm:-top-16 left-1/2 -translate-x-1/2 pointer-events-none z-10 flex flex-col items-center">
              {/* Static Sad Siamese Cat Image */}
              <div className="w-32 h-32 sm:w-36 sm:h-36 relative flex items-center justify-center">
                <img
                  src={sadSiameseCat}
                  alt="Sad Siamese Cat Companion"
                  className="w-full h-full object-contain drop-shadow-md"
                  draggable={false}
                />
              </div>
            </div>

            {/* Heading */}
            <h2 className="font-extrabold text-2xl tracking-normal mb-2 mt-1">
              {t.logoutModal.title}
            </h2>
            <p className="text-xs text-slate-400 dark:text-slate-300 mb-6 leading-relaxed">
              {t.logoutModal.description}
            </p>

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
                <span>{t.logoutModal.stayLoggedIn}</span>
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>{t.logoutModal.confirmLogout}</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
