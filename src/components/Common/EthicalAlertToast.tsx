import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';
import { ETHICAL_WARNING_EVENT, ETHICAL_WARNING_MESSAGE } from '../../lib/ethicalGuard';

export const EthicalAlertToast: React.FC = () => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleEthicalWarning = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      const msg = customEvent.detail?.message || ETHICAL_WARNING_MESSAGE;
      setToastMessage(msg);
    };

    window.addEventListener(ETHICAL_WARNING_EVENT, handleEthicalWarning);
    return () => {
      window.removeEventListener(ETHICAL_WARNING_EVENT, handleEthicalWarning);
    };
  }, []);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: -40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className="fixed top-5 left-1/2 transform -translate-x-1/2 z-[9999] max-w-md w-[92%] sm:w-auto"
        >
          <div className="bg-rose-950/95 border-2 border-rose-500/80 text-rose-100 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center gap-3.5 ring-4 ring-rose-500/20">
            <div className="p-2 rounded-xl bg-rose-900/80 border border-rose-500/40 text-rose-300 flex-shrink-0 animate-pulse">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
            
            <div className="flex-1 pr-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider bg-rose-900/90 text-rose-200 px-2 py-0.5 rounded-md border border-rose-700/60">
                  Ethical Restriction
                </span>
              </div>
              <p className="text-sm font-bold text-rose-100 mt-0.5">
                {toastMessage}
              </p>
            </div>

            <button
              onClick={() => setToastMessage(null)}
              className="p-1.5 rounded-lg text-rose-300 hover:text-rose-100 hover:bg-rose-900/60 transition-colors"
              title="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
