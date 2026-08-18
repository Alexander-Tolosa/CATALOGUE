import React, { useState, useEffect } from 'react';
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
import { ScannerView } from './components/Scanner/ScannerView';
import { KleoHubView } from './components/Kleo/KleoHubView';
import { KleoChatRoomView } from './components/ChatRoom/KleoChatRoomView';
import { GamifyHubView } from './components/Gamify/GamifyHubView';
import { ReviewDeckView } from './components/Review/ReviewDeckView';
import { SettingsView } from './components/Settings/SettingsView';
import { ProfilePageView } from './components/Profile/ProfilePageView';
import { DirectChatModal } from './components/Profile/DirectChatModal';
import { GlobalAIChatbox } from './components/Chatbox/GlobalAIChatbox';
import { InvestorPitchModal } from './components/Investor/InvestorPitchModal';
import { AuthScreen } from './components/Auth/AuthScreen';
import { LandingPage } from './components/Landing/LandingPage';
import { EthicalAlertToast } from './components/Common/EthicalAlertToast';

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
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleNav = (e: any) => {
      if (e.detail) {
        setActiveView(e.detail);
      }
    };
    window.addEventListener('catalogue:navigate-view', handleNav);
    return () => window.removeEventListener('catalogue:navigate-view', handleNav);
  }, []);

  // Unauthenticated Gate: Show Duolingo-style Landing Page (with Auth modal overlay)
  if (!isAuthenticated || !token) {
    if (showAuthModal) {
      return <AuthScreen onBack={() => setShowAuthModal(false)} />;
    }
    return (
      <LandingPage
        onGetStarted={() => setShowAuthModal(true)}
        onLogin={() => setShowAuthModal(true)}
      />
    );
  }

  const activeNodes = getActiveNodes();

  const handleUpdateDailyGoal = (minutes: number) => {
    useAppStore.setState(prev => ({
      profile: { ...prev.profile, dailyGoalMinutes: minutes }
    }));
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-[#F06543]/20 transition-colors duration-300 ${isDarkMode ? 'bg-[#0b0f19] text-white' : 'bg-[#FAF6F0] text-[#2B2725]'
      }`}>
      {/* 1. Persistent SideNavBar */}
      <SidebarNav
        activeView={activeView}
        onSelectView={setActiveView}
        reviewItemsDueCount={profile.savedPhrases.length}
      />

      {/* 2. Main Canvas & TopAppBar */}
      <main className={`md:ml-64 min-h-screen relative transition-colors duration-300 ${isDarkMode ? 'bg-[#0b0f17]' : 'bg-[#FAF6F0]'
        }`}>
        {/* Top Header */}
        <TopAppBar
          profile={profile}
          activeView={activeView}
          onSelectLanguage={selectLanguageTrack}
          onOpenPitchModal={() => setIsPitchModalOpen(true)}
          onSelectView={setActiveView}
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

              {activeView === 'profile' && (
                <ProfilePageView />
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

              {activeView === 'scanner' && (
                <div className="pt-20 px-4 md:px-8">
                  <ScannerView onSaveToReview={savePhraseToReview} />
                </div>
              )}

              {activeView === 'kleo' && (
                <div className="pt-20 px-4 md:px-8">
                  <KleoHubView />
                </div>
              )}

              {activeView === 'chatbot' && (
                <div className="pt-16">
                  <KleoChatRoomView />
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

      {/* Global Direct Encrypted Friend Chat Modal */}
      <DirectChatModal />

      {/* Global Ethical Restriction Toast Notification */}
      <EthicalAlertToast />
    </div>
  );
};

export default App;
