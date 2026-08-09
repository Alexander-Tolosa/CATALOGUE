import React, { useState } from 'react';
import { LanguageTrack } from '../../types';
import { ScriptFoundations } from '../ScriptModule/ScriptFoundations';
import { LetterFeedbackView } from './LetterFeedbackView';
import { useAppStore } from '../../store/useAppStore';

interface ScriptModuleViewProps {
  selectedLanguage: LanguageTrack;
  onFinishFoundations: () => void;
}

export const ScriptModuleView: React.FC<ScriptModuleViewProps> = ({
  selectedLanguage,
  onFinishFoundations
}) => {
  const { isDarkMode } = useAppStore();
  const [activeTab, setActiveTab] = useState<'letters' | 'feedback'>('letters');

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Section Tab Navigation */}
      <div className={`p-1.5 rounded-2xl border flex items-center gap-2 ${
        isDarkMode ? 'bg-[#111827] border-[#1e293b]' : 'bg-slate-100 border-slate-200'
      }`}>
        <button
          onClick={() => setActiveTab('letters')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'letters'
              ? 'bg-[#f97316] text-white shadow-md shadow-orange-500/20 scale-[1.01]'
              : isDarkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-lg">draw</span>
          <span>Character & Stroke Tracing</span>
        </button>

        <button
          onClick={() => setActiveTab('feedback')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'feedback'
              ? 'bg-[#f97316] text-white shadow-md shadow-orange-500/20 scale-[1.01]'
              : isDarkMode
              ? 'text-slate-400 hover:text-white'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="material-symbols-outlined text-lg">edit_note</span>
          <span>AI Letter & Essay Feedback</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'letters' ? (
        <ScriptFoundations
          language={selectedLanguage}
          onFinishFoundations={onFinishFoundations}
        />
      ) : (
        <LetterFeedbackView />
      )}
    </div>
  );
};
