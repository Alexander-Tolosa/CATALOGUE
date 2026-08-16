import React from 'react';
import { LanguageTrack } from '../../types';
import { ScriptFoundations } from '../ScriptModule/ScriptFoundations';

interface ScriptModuleViewProps {
  selectedLanguage: LanguageTrack;
  onFinishFoundations: () => void;
}

export const ScriptModuleView: React.FC<ScriptModuleViewProps> = ({
  selectedLanguage,
  onFinishFoundations
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      <ScriptFoundations
        language={selectedLanguage}
        onFinishFoundations={onFinishFoundations}
      />
    </div>
  );
};
