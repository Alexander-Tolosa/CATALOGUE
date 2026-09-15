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
  const onFinishRef = React.useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinishRef.current) onFinishRef.current();
    }, 850);

    return () => clearTimeout(timer);
  }, []);

  if (typeof document === 'undefined') return null;

  return ReactDOM.createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
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
      className={`fixed inset-0 w-screen h-screen flex flex-col items-center justify-center select-none overflow-hidden ${
        isDarkMode ? 'bg-[#0b0f19]' : 'bg-[#FAF6F0]'
      }`}
    >
      <div style={{ width: '280px', height: '280px' }} className="relative flex items-center justify-center">
        <DotLottieReact
          src="https://lottie.host/1d9b3064-7e18-43ac-8329-64175e1f6827/uQnFW5Tt64.lottie"
          loop
          autoplay
        />
      </div>
      <motion.p
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 0.75, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className={`text-xs font-semibold tracking-widest uppercase mt-2 ${
          isDarkMode ? 'text-amber-400/80' : 'text-amber-700/80'
        }`}
      >
        Loading your workspace...
      </motion.p>
    </motion.div>,
    document.body
  );
};
