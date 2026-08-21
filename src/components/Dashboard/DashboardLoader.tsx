import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
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
    }, 900);

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <motion.div
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999999
      }}
      className={`fixed inset-0 w-screen h-screen flex items-center justify-center select-none overflow-hidden ${
        isDarkMode ? 'bg-[#0b0f19]' : 'bg-[#FAF6F0]'
      }`}
    >
      <div style={{ width: '300px', height: '300px' }} className="flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/1d9b3064-7e18-43ac-8329-64175e1f6827/uQnFW5Tt64.lottie"
          loop
          autoplay
        />
      </div>
    </motion.div>,
    document.body
  );
};
