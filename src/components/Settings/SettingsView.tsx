import React, { useState } from 'react';
import { UserProfile, LanguageTrack } from '../../types';
import { Settings, Volume2, Type, Shield, User, Globe } from 'lucide-react';

interface SettingsViewProps {
  profile: UserProfile;
  onSelectLanguage: (lang: LanguageTrack) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ profile, onSelectLanguage }) => {
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [fontSize, setFontSize] = useState<string>('medium');
  const [colorblindMode, setColorblindMode] = useState<boolean>(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className="glass-panel p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-sky-950 border border-slate-800 shadow-xl flex items-center justify-between">
        <div>
          <span className="text-xs font-black text-sky-400 uppercase tracking-widest block mb-1">
            Application Preferences
          </span>
          <h2 className="font-brand text-3xl font-black text-white flex items-center gap-2">
            <Settings size={26} className="text-sky-400" /> Platform Settings
          </h2>
          <p className="text-xs text-slate-300 mt-1">Configure language tracks, audio playback, font display, and accessibility</p>
        </div>
      </div>

      {/* Language Tracks Config */}
      <div className="glass-panel p-6 bg-slate-950/90 border border-slate-800 space-y-4">
        <h3 className="font-brand font-black text-slate-100 text-sm flex items-center gap-2">
          <Globe size={18} className="text-sky-400" /> Active Language Track
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onSelectLanguage('ko')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              profile.selectedLanguage === 'ko'
                ? 'bg-sky-950 border-sky-400 text-white font-black shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-2xl block mb-1">🇰🇷</span>
            <span className="text-xs">Korean (한글)</span>
          </button>

          <button
            onClick={() => onSelectLanguage('ja')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              profile.selectedLanguage === 'ja'
                ? 'bg-sky-950 border-sky-400 text-white font-black shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-2xl block mb-1">🇯🇵</span>
            <span className="text-xs">Japanese (日本語)</span>
          </button>

          <button
            onClick={() => onSelectLanguage('en')}
            className={`p-4 rounded-2xl border text-center transition-all ${
              profile.selectedLanguage === 'en'
                ? 'bg-sky-950 border-sky-400 text-white font-black shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
            }`}
          >
            <span className="text-2xl block mb-1">🇺🇸</span>
            <span className="text-xs">English</span>
          </button>
        </div>
      </div>

      {/* Audio & Accessibility Config */}
      <div className="glass-panel p-6 bg-slate-950/90 border border-slate-800 space-y-4">
        <h3 className="font-brand font-black text-slate-100 text-sm flex items-center gap-2">
          <Volume2 size={18} className="text-emerald-400" /> Audio & Accessibility Options
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-black text-slate-200">Audio Playback Speed</div>
              <div className="text-[10px] text-slate-400">Adjust TTS speech speed for listening exercises</div>
            </div>
            <select
              value={audioSpeed}
              onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
              className="bg-slate-950 text-slate-100 border border-slate-700 rounded-lg px-3 py-1 text-xs font-bold"
            >
              <option value={0.75}>0.75x (Slow)</option>
              <option value={1.0}>1.0x (Normal)</option>
              <option value={1.25}>1.25x (Fast)</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-900 rounded-xl border border-slate-800">
            <div>
              <div className="text-xs font-black text-slate-200">Colorblind Accessibility Palette</div>
              <div className="text-[10px] text-slate-400">Enable high-contrast color accents for UI nodes</div>
            </div>
            <input
              type="checkbox"
              checked={colorblindMode}
              onChange={(e) => setColorblindMode(e.target.checked)}
              className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
