import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from './store/useAppStore';
import { useKleoStore } from './store/useKleoStore';
import { useAuthStore } from './store/useAuthStore';
import { AppView } from './types';
import { TopAppBar } from './components/Dashboard/Header';
import { SidebarNav } from './components/Navigation/SidebarNav';
import { DashboardView } from './components/Dashboard/DashboardView';
import { LearnView } from './components/Learn/LearnView';
import { ScriptModuleView } from './components/Script/ScriptModuleView';
import { TranslatorView } from './components/Translator/TranslatorView';
import { KleoHubView } from './components/Kleo/KleoHubView';
import { GamifyHubView } from './components/Gamify/GamifyHubView';
import { ReviewDeckView } from './components/Review/ReviewDeckView';
import { SettingsView } from './components/Settings/SettingsView';
import { GlobalAIChatbox } from './components/Chatbox/GlobalAIChatbox';
import { InvestorPitchModal } from './components/Investor/InvestorPitchModal';
import { AuthScreen } from './components/Auth/AuthScreen';

export const App: React.FC = () => {
  const { isAuthenticated, token } = useAuthStore();
  const {
    isDarkMode,
    profile,
    selectLanguageTrack,
    deductHeart,
    refillHearts,
    completeLessonNode,
    savePhraseToReview,
    getActiveNodes
  } = useAppStore();

  const { equippedCosmetics } = useKleoStore();

  const [activeView, setActiveView] = useState<AppView>('dashboard');
  const [isPitchModalOpen, setIsPitchModalOpen] = useState(false);

  // Auth Gate: Render Auth Landing Screen if not authenticated
  if (!isAuthenticated || !token) {
    return <AuthScreen />;
  }

  const activeNodes = getActiveNodes();

  const handleUpdateDailyGoal = (minutes: number) => {
    useAppStore.setState(prev => ({
      profile: { ...prev.profile, dailyGoalMinutes: minutes }
    }));
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-[#FF6B35]/20 transition-colors duration-300 ${
      isDarkMode ? 'bg-[#0b0f19] text-white' : 'bg-[#f8fafc] text-slate-900'
    }`}>
      {/* 1. Persistent SideNavBar */}
      <SidebarNav
        activeView={activeView}
        onSelectView={setActiveView}
        reviewItemsDueCount={profile.savedPhrases.length}
      />

      {/* 2. Main Canvas & TopAppBar */}
      <main className={`md:ml-64 min-h-screen relative transition-colors duration-300 ${
        isDarkMode ? 'bg-[#0b0f19]' : 'bg-[#f8fafc]'
      }`}>
        {/* Top Header */}
        <TopAppBar
          profile={profile}
          activeView={activeView}
          onSelectLanguage={selectLanguageTrack}
          onOpenPitchModal={() => setIsPitchModalOpen(true)}
        />

        {/* Animated View Stage with Framer Motion AnimatePresence */}
        <div className="min-h-screen">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {activeView === 'dashboard' && (
                <DashboardView
                  profile={profile}
                  activeNodes={activeNodes}
                  savedPhrases={profile.savedPhrases}
                  onSelectLanguage={selectLanguageTrack}
                  onSelectNode={(node) => setActiveView('learn')}
                  onNavigate={setActiveView}
                />
              )}

              {activeView === 'learn' && (
                <LearnView
                  nodes={activeNodes}
                  completedNodeIds={profile.completedNodeIds}
                  userHearts={profile.hearts}
                  selectedLanguage={profile.selectedLanguage}
                  onDeductHeart={deductHeart}
                  onCompleteNode={completeLessonNode}
                  equippedCosmetics={equippedCosmetics}
                />
              )}

              {activeView === 'letters' && (
                <div className="pt-20 px-4 md:px-8">
                  <ScriptModuleView
                    selectedLanguage={profile.selectedLanguage}
                    onFinishFoundations={() => setActiveView('learn')}
                  />
                </div>
              )}

              {activeView === 'translator' && (
                <div className="pt-20 px-4 md:px-8">
                  <TranslatorView onSaveToReview={savePhraseToReview} />
                </div>
              )}

              {activeView === 'kleo' && (
                <div className="pt-20 px-4 md:px-8">
                  <KleoHubView />
                </div>
              )}

              {activeView === 'gamify' && (
                <div className="pt-20 px-4 md:px-8">
                  <GamifyHubView
                    profile={profile}
                    onRefillHearts={refillHearts}
                    onUpdateDailyGoal={handleUpdateDailyGoal}
                  />
                </div>
              )}

              {activeView === 'review' && (
                <div className="pt-20 px-4 md:px-8">
                  <ReviewDeckView
                    items={profile.savedPhrases}
                    onRefillHearts={refillHearts}
                  />
                </div>
              )}

              {activeView === 'settings' && (
                <div className="pt-20 px-4 md:px-8">
                  <SettingsView
                    profile={profile}
                    onSelectLanguage={selectLanguageTrack}
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Investor Pitch Modal */}
      <InvestorPitchModal
        isOpen={isPitchModalOpen}
        onClose={() => setIsPitchModalOpen(false)}
      />

      {/* Persistent Global AI Chatbox */}
      <GlobalAIChatbox currentLanguage={profile.selectedLanguage} />
    </div>
  );
};

export default App;
