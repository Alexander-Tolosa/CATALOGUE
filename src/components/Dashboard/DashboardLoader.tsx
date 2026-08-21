import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useAppStore } from '../../store/useAppStore';

interface DashboardLoaderProps {
  onFinish?: () => void;
}

export const DashboardLoader: React.FC<DashboardLoaderProps> = ({ onFinish }) => {
  const { isDarkMode } = useAppStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1200);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02, filter: 'blur(6px)' }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`fixed inset-0 w-screen h-screen z-[99999] flex items-center justify-center transition-colors duration-300 select-none overflow-hidden ${
        isDarkMode ? 'bg-[#0b0f19]' : 'bg-[#FAF6F0]'
      }`}
    >
      <div style={{ width: '320px', height: '320px' }} className="flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/1d9b3064-7e18-43ac-8329-64175e1f6827/uQnFW5Tt64.lottie"
          loop
          autoplay
        />
      </div>
    </motion.div>
  );
};
