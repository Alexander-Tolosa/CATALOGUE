import React, { useState } from 'react';
import { UserProfile, LanguageTrack, LessonNode } from '../../types';
import { Sidebar } from './Sidebar';
import { SkillTreePath } from './SkillTreePath';
import { RightSidebar } from './RightSidebar';

interface DashboardProps {
  profile: UserProfile;
  activeNodes: LessonNode[];
  onSelectLanguage: (lang: LanguageTrack) => void;
  onSelectNode: (node: LessonNode) => void;
  onOpenFoundations: () => void;
  onOpenTranslator: () => void;
  onOpenReviewDeck: () => void;
  onOpenLeaderboard: () => void;
  onOpenJournal: () => void;
  onOpenWardrobe: () => void;
  onOpenPitchModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  profile,
  activeNodes,
  onSelectLanguage,
  onSelectNode,
  onOpenFoundations,
  onOpenTranslator,
  onOpenReviewDeck,
  onOpenLeaderboard,
  onOpenJournal,
  onOpenWardrobe,
  onOpenPitchModal
}) => {
  const [activeTab, setActiveTab] = useState<'learn' | 'letters' | 'leaderboards' | 'review' | 'wardrobe' | 'profile' | 'pitch'>('learn');

  const handleTabChange = (tab: 'learn' | 'letters' | 'leaderboards' | 'review' | 'wardrobe' | 'profile' | 'pitch') => {
    setActiveTab(tab);
    if (tab === 'letters') onOpenFoundations();
    else if (tab === 'leaderboards') onOpenLeaderboard();
    else if (tab === 'review') onOpenReviewDeck();
    else if (tab === 'wardrobe') onOpenWardrobe();
    else if (tab === 'profile') onOpenJournal();
    else if (tab === 'pitch') onOpenPitchModal();
  };

  return (
    <div className="flex min-h-screen bg-[#040711] text-slate-100 font-sans">
      {/* 1. Left Vertical Menu Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={handleTabChange}
        onOpenTutor={onOpenTranslator}
      />

      {/* 2. Main Center Section (Skill Tree Path) */}
      <main className="flex-1 p-6 overflow-y-auto">
        <SkillTreePath
          nodes={activeNodes}
          completedNodeIds={profile.completedNodeIds}
          selectedLanguage={profile.selectedLanguage}
          onSelectNode={onSelectNode}
          onOpenGuidebook={onOpenFoundations}
          equippedCosmetics={profile.equippedCosmetics}
        />
      </main>

      {/* 3. Right Sidebar Column (Stats & Cards) */}
      <RightSidebar
        profile={profile}
        onSelectLanguage={onSelectLanguage}
        onOpenWardrobe={onOpenWardrobe}
        onOpenLeaderboard={onOpenLeaderboard}
        onOpenReviewDeck={onOpenReviewDeck}
      />
    </div>
  );
};
