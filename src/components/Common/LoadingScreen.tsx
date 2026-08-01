import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  size?: number;
  src?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = 'Loading lesson data...',
  fullScreen = false,
  size = 260,
  src = 'https://lottie.host/1d9b3064-7e18-43ac-8329-64175e1f6827/uQnFW5Tt64.lottie'
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center select-none ${
        fullScreen
          ? 'fixed inset-0 z-50 bg-white/95 dark:bg-[#0b0f17]/95 backdrop-blur-md'
          : 'w-full py-12'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center text-center space-y-3"
      >
        {/* Official DotLottieReact Component */}
        <div style={{ width: `${size}px`, height: `${size}px` }} className="flex items-center justify-center">
          <DotLottieReact
            src={src}
            loop
            autoplay
          />
        </div>

        {/* Loading Message & Purr Indicator */}
        <div className="space-y-1">
          <h3 className="font-display font-bold text-sm text-slate-800 dark:text-slate-200 tracking-tight">
            {message}
          </h3>
          <p className="text-[11px] font-semibold text-[#f97316] uppercase tracking-widest animate-pulse">
            🐾 Kleo is fetching your content...
          </p>
        </div>
      </motion.div>
    </div>
  );
};
