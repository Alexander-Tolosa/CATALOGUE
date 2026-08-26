import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MatchingCategoryId, MatchingGameStats, LanguageTrack } from '../../types';
import { MATCHING_CATEGORIES } from '../../data/matchingData';
import { MatchingCategorySelect } from './MatchingCategorySelect';
import { MatchingGameBoard } from './MatchingGameBoard';
import { MatchingCelebrationModal } from './MatchingCelebrationModal';
import { useAppStore } from '../../store/useAppStore';

interface MatchingModuleViewProps {
  onNavigateDashboard?: () => void;
}

export const MatchingModuleView: React.FC<MatchingModuleViewProps> = ({
  onNavigateDashboard
}) => {
  const { addXP, profile, selectLanguageTrack } = useAppStore();
  const [activeLang, setActiveLang] = useState<LanguageTrack>(profile.selectedLanguage || 'ko');

  const [viewMode, setViewMode] = useState<'category_select' | 'game'>('category_select');
  const [selectedCategory, setSelectedCategory] = useState<MatchingCategoryId>('food');
  const [pairCount, setPairCount] = useState<number>(8);
  const [gameStats, setGameStats] = useState<MatchingGameStats | null>(null);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const handleLanguageChange = (lang: LanguageTrack) => {
    setActiveLang(lang);
    selectLanguageTrack(lang);
  };

  const handleSelectCategory = (categoryId: MatchingCategoryId, count: number) => {
    setSelectedCategory(categoryId);
    setPairCount(count);
    setViewMode('game');
  };

  const handleGameComplete = (stats: MatchingGameStats) => {
    setGameStats(stats);
    setShowCelebration(true);
    // Award XP and increment study metrics in user profile
    addXP(stats.xpEarned || 25);
  };

  const handlePlayAgain = () => {
    setShowCelebration(false);
    // Trigger game rerender with newly shuffled cards
    setViewMode('category_select');
    setTimeout(() => {
      setViewMode('game');
    }, 50);
  };

  const handleSelectAnotherCategory = () => {
    setShowCelebration(false);
    setViewMode('category_select');
  };

  const handleNavigateHome = () => {
    setShowCelebration(false);
    if (onNavigateDashboard) {
      onNavigateDashboard();
    } else {
      window.dispatchEvent(new CustomEvent('catalogue:navigate-view', { detail: 'dashboard' }));
    }
  };

  const categoryMeta = (MATCHING_CATEGORIES[activeLang] || MATCHING_CATEGORIES.ko).find(
    (c) => c.id === selectedCategory
  ) || MATCHING_CATEGORIES.ko[0];

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {viewMode === 'category_select' ? (
          <motion.div
            key={`category-select-stage-${activeLang}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <MatchingCategorySelect
              currentLanguage={activeLang}
              onSelectLanguage={handleLanguageChange}
              onSelectCategory={handleSelectCategory}
              selectedPairCount={pairCount}
              onChangePairCount={setPairCount}
            />
          </motion.div>
        ) : (
          <motion.div
            key={`game-board-stage-${selectedCategory}-${activeLang}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <MatchingGameBoard
              categoryId={selectedCategory}
              pairCount={pairCount}
              currentLanguage={activeLang}
              onSelectLanguage={handleLanguageChange}
              onBackToCategories={() => setViewMode('category_select')}
              onGameComplete={handleGameComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Round Completion Victory Modal */}
      <AnimatePresence>
        {showCelebration && gameStats && (
          <MatchingCelebrationModal
            stats={gameStats}
            categoryTitle={categoryMeta.title}
            onPlayAgain={handlePlayAgain}
            onSelectCategory={handleSelectAnotherCategory}
            onNavigateHome={handleNavigateHome}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
