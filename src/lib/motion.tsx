import React from 'react';
import { Variants, Transition, motion, AnimatePresence } from 'framer-motion';

// ==========================================
// 1. REUSABLE SPRING & TRANSITION PRESETS
// ==========================================

export const springs = {
  /** Soft, natural spring for general layout & modal entry */
  gentle: {
    type: 'spring',
    stiffness: 260,
    damping: 24,
    mass: 0.9
  } as Transition,

  /** Fast, responsive spring for buttons, tabs, micro-interactions */
  snappy: {
    type: 'spring',
    stiffness: 400,
    damping: 28,
    mass: 0.8
  } as Transition,

  /** Bouncy spring for gamification badges, rewards, confetti celebrations */
  bouncy: {
    type: 'spring',
    stiffness: 500,
    damping: 15,
    mass: 1
  } as Transition,

  /** Crisp, stiff spring for drag and drop, drawers, sheets */
  stiff: {
    type: 'spring',
    stiffness: 600,
    damping: 35
  } as Transition,

  /** Smooth easeInOut curve for subtle fades and color shifts */
  smooth: {
    duration: 0.25,
    ease: [0.25, 0.1, 0.25, 1.0]
  } as Transition
};

// ==========================================
// 2. UNIVERSAL ANIMATION VARIANTS
// ==========================================

/** Basic Fade In / Out */
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: springs.smooth },
  exit: { opacity: 0, transition: { duration: 0.18 } }
};

/** Fade In Up (Standard entrance for cards, headers, and sections) */
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: springs.gentle },
  exit: { opacity: 0, y: -12, transition: { duration: 0.18 } }
};

/** Fade In Down */
export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0, transition: springs.gentle },
  exit: { opacity: 0, y: 12, transition: { duration: 0.18 } }
};

/** Fade In Left / Right */
export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0, transition: springs.gentle },
  exit: { opacity: 0, x: 20, transition: { duration: 0.18 } }
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0, transition: springs.gentle },
  exit: { opacity: 0, x: -20, transition: { duration: 0.18 } }
};

/** Scale In & Pop */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1, transition: springs.snappy },
  exit: { opacity: 0, scale: 0.92, transition: { duration: 0.15 } }
};

export const popIn: Variants = {
  initial: { opacity: 0, scale: 0.75 },
  animate: { opacity: 1, scale: 1, transition: springs.bouncy },
  exit: { opacity: 0, scale: 0.85, transition: { duration: 0.15 } }
};

/** Modal / Dialog Animation Preset */
export const modalBackdrop: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.18 } }
};

export const modalContent: Variants = {
  initial: { opacity: 0, scale: 0.94, y: 12 },
  animate: { opacity: 1, scale: 1, y: 0, transition: springs.gentle },
  exit: { opacity: 0, scale: 0.96, y: 8, transition: { duration: 0.15 } }
};

/** Stagger Container & Child Items */
export const staggerContainer = (staggerChildren = 0.06, delayChildren = 0): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren,
      delayChildren
    }
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1
    }
  }
});

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0, transition: springs.gentle },
  exit: { opacity: 0, y: -10, transition: { duration: 0.15 } }
};

/** Micro-interactions / Gestures */
export const gestures = {
  tapScale: { scale: 0.96 },
  hoverScale: { scale: 1.025, y: -2 },
  hoverGlow: { scale: 1.02, transition: springs.snappy },
  subtleHover: { scale: 1.015, transition: springs.snappy }
};

// ==========================================
// 3. READY-TO-USE PREBUILT WRAPPERS
// ==========================================

export interface FadeInProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  direction = 'up',
  className = '',
  ...props
}) => {
  const getVariants = () => {
    switch (direction) {
      case 'down': return fadeInDown;
      case 'left': return fadeInLeft;
      case 'right': return fadeInRight;
      case 'none': return fadeIn;
      case 'up':
      default: return fadeInUp;
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={getVariants()}
      transition={{ ...springs.gentle, delay }}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
};

export interface StaggerListProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerList: React.FC<StaggerListProps> = ({
  children,
  staggerDelay = 0.06,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={staggerContainer(staggerDelay)}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = ''
}) => {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  );
};

export interface CardHoverProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const MotionCard: React.FC<CardHoverProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      whileTap={{ scale: 0.985 }}
      transition={springs.snappy}
      className={className}
      {...(props as any)}
    >
      {children}
    </motion.div>
  );
};

// Export core framer-motion tools for unified imports
export { motion, AnimatePresence };
