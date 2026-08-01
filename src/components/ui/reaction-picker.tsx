import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smile, Heart, Flame, Sparkles, Star, ThumbsUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ReactionPickerProps {
  onSelectReaction: (emoji: string) => void;
  className?: string;
}

export const ReactionPicker: React.FC<ReactionPickerProps> = ({
  onSelectReaction,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const emojiList = [
    { emoji: '💖', label: 'Love' },
    { emoji: '🔥', label: 'Fire' },
    { emoji: '🎉', label: 'Celebrate' },
    { emoji: '🐾', label: 'Paw Bump' },
    { emoji: '⭐', label: 'Star' },
    { emoji: '👏', label: 'Applaud' },
    { emoji: '😍', label: 'Adore' }
  ];

  return (
    <div className={cn("relative inline-block select-none", className)}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-bold text-slate-700 dark:text-slate-200 hover:border-[#f97316] transition-all cursor-pointer"
      >
        <Smile size={14} className="text-[#f97316]" />
        <span>React</span>
      </motion.button>

      {/* Popover Reaction Picker */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: -45, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 flex items-center gap-1 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md"
          >
            {emojiList.map((item) => (
              <motion.button
                key={item.emoji}
                onClick={() => {
                  onSelectReaction(item.emoji);
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.3, y: -4 }}
                whileTap={{ scale: 0.9 }}
                className="p-1.5 rounded-xl hover:bg-orange-50 dark:hover:bg-slate-800 text-lg transition-transform cursor-pointer"
                title={item.label}
              >
                {item.emoji}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
