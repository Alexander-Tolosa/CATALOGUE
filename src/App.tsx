import React, { useState } from 'react';
import { useAppStore } from './store/useAppStore';
import { useKleoStore } from './store/useKleoStore';
import { useAuthStore } from './store/useAuthStore';
import { AppView, LessonNode } from './types';
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
    <div className="min-h-screen bg-[#0e1322] text-[#dee1f7] font-sans selection:bg-[#5affff]/30">
      {/* 1. Persistent SideNavBar */}
      <SidebarNav
        activeView={activeView}
        onSelectView={setActiveView}
        reviewItemsDueCount={profile.savedPhrases.length}
      />

      {/* 2. Main Canvas & TopAppBar */}
      <main className="md:ml-64 min-h-screen relative">
        {/* Top Header */}
        <TopAppBar
          profile={profile}
          activeView={activeView}
          onSelectLanguage={selectLanguageTrack}
          onOpenPitchModal={() => setIsPitchModalOpen(true)}
        />

        {/* View Stage */}
        <div className="min-h-screen">
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
