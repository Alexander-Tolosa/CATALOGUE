import React, { useState } from 'react';
import { UserProfile, LanguageTrack } from '../../types';
import { Settings, Volume2, Type, Shield, User, Globe, Sun, Moon, Palette, Languages, CheckCircle2 } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { FlagIcon } from '../Common/FlagIcon';

interface SettingsViewProps {
  profile: UserProfile;
  onSelectLanguage: (lang: LanguageTrack) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ profile, onSelectLanguage }) => {
  const { isDarkMode, toggleThemeMode, interfaceLanguage, setInterfaceLanguage } = useAppStore();
  const { t, getLanguageName } = useTranslation();
  const [audioSpeed, setAudioSpeed] = useState<number>(1.0);
  const [fontSize, setFontSize] = useState<string>('medium');
  const [colorblindMode, setColorblindMode] = useState<boolean>(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header Banner */}
      <div className={`p-6 rounded-3xl border shadow-xl flex items-center justify-between transition-colors ${
        isDarkMode ? 'bg-[#131b2e] border-[#1e293b] text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        <div>
          <span className="text-xs font-black text-[#FF6B35] uppercase tracking-widest block mb-1">
            {t.settings.title}
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-black flex items-center gap-2">
            <Settings size={26} className="text-[#FF6B35]" /> {t.settings.title}
          </h2>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.settings.subtitle}
          </p>
        </div>
      </div>

      {/* 1. Theme & Appearance Settings (Light / Dark Mode) */}
      <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
        isDarkMode ? 'bg-[#131b2e] border-[#1e293b]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h3 className={`font-display font-black text-sm flex items-center gap-2 ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          <Palette size={18} className="text-[#FF6B35]" /> {t.settings.appearance}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Light Mode Option Tile */}
          <button
            onClick={() => isDarkMode && toggleThemeMode()}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              !isDarkMode
                ? 'bg-[#fff7ed] border-[#FF6B35] shadow-md ring-2 ring-[#FF6B35]/20'
                : 'bg-[#0b0f19] border-[#1e293b] hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 font-bold border border-amber-200">
                <Sun size={20} />
              </div>
              {!isDarkMode && (
                <span className="bg-[#FF6B35] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
            </div>
            <div>
              <span className={`font-display text-sm font-black block ${!isDarkMode ? 'text-slate-900' : 'text-white'}`}>
                {t.settings.lightMode} ☀️
              </span>
              <span className={`text-[11px] block mt-0.5 ${!isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                {t.settings.appearanceDesc}
              </span>
            </div>
          </button>

          {/* Dark Mode Option Tile */}
          <button
            onClick={() => !isDarkMode && toggleThemeMode()}
            className={`p-5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-[#FF6B35]/15 border-[#FF6B35] shadow-md ring-2 ring-[#FF6B35]/20'
                : 'bg-slate-50 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-950 flex items-center justify-center text-indigo-400 font-bold border border-indigo-800">
                <Moon size={20} />
              </div>
              {isDarkMode && (
                <span className="bg-[#FF6B35] text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Active
                </span>
              )}
            </div>
            <div>
              <span className={`font-display text-sm font-black block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {t.settings.darkMode} 🌙
              </span>
              <span className={`text-[11px] block mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {t.settings.appearanceDesc}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Interface Language & Localization */}
      <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
        isDarkMode ? 'bg-[#131b2e] border-[#1e293b]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h3 className={`font-display font-black text-sm flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <Languages size={18} className="text-[#FF6B35]" /> {t.settings.interfaceLanguage}
          </h3>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.settings.interfaceLanguageDesc}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            onClick={() => setInterfaceLanguage('en')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              interfaceLanguage === 'en'
                ? 'bg-[#fff7ed] dark:bg-[#FF6B35]/20 border-[#FF6B35] text-[#FF6B35] font-black shadow-sm ring-1 ring-[#FF6B35]/30'
                : isDarkMode
                ? 'bg-[#0b0f19] border-[#1e293b] text-slate-300 hover:border-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <FlagIcon code="us" size="md" />
              <div>
                <div className="text-xs font-bold">{t.settings.englishTrack}</div>
                <div className="text-[10px] text-slate-400">English UI</div>
              </div>
            </div>
            {interfaceLanguage === 'en' && <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />}
          </button>

          <button
            onClick={() => setInterfaceLanguage('ko')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              interfaceLanguage === 'ko'
                ? 'bg-[#fff7ed] dark:bg-[#FF6B35]/20 border-[#FF6B35] text-[#FF6B35] font-black shadow-sm ring-1 ring-[#FF6B35]/30'
                : isDarkMode
                ? 'bg-[#0b0f19] border-[#1e293b] text-slate-300 hover:border-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <FlagIcon code="kr" size="md" />
              <div>
                <div className="text-xs font-bold">{t.settings.koreanTrack}</div>
                <div className="text-[10px] text-slate-400">한국어 화면</div>
              </div>
            </div>
            {interfaceLanguage === 'ko' && <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />}
          </button>

          <button
            onClick={() => setInterfaceLanguage('ja')}
            className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
              interfaceLanguage === 'ja'
                ? 'bg-[#fff7ed] dark:bg-[#FF6B35]/20 border-[#FF6B35] text-[#FF6B35] font-black shadow-sm ring-1 ring-[#FF6B35]/30'
                : isDarkMode
                ? 'bg-[#0b0f19] border-[#1e293b] text-slate-300 hover:border-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <FlagIcon code="jp" size="md" />
              <div>
                <div className="text-xs font-bold">{t.settings.japaneseTrack}</div>
                <div className="text-[10px] text-slate-400">日本語画面</div>
              </div>
            </div>
            {interfaceLanguage === 'ja' && <CheckCircle2 className="w-4 h-4 text-[#FF6B35]" />}
          </button>
        </div>
      </div>

      {/* 3. Active Learning Target Track */}
      <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
        isDarkMode ? 'bg-[#131b2e] border-[#1e293b]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div>
          <h3 className={`font-display font-black text-sm flex items-center gap-2 ${
            isDarkMode ? 'text-white' : 'text-slate-900'
          }`}>
            <Globe size={18} className="text-emerald-400" /> {t.settings.languageTrack}
          </h3>
          <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.settings.languageTrackDesc}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => onSelectLanguage('ko')}
            className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              profile.selectedLanguage === 'ko'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black shadow-sm ring-1 ring-emerald-500/30'
                : isDarkMode
                ? 'bg-[#0b0f19] border-[#1e293b] text-slate-400 hover:border-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FlagIcon code="kr" size="lg" className="mb-2" />
            <span className="text-xs">{t.settings.koreanTrack}</span>
          </button>

          <button
            onClick={() => onSelectLanguage('ja')}
            className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              profile.selectedLanguage === 'ja'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black shadow-sm ring-1 ring-emerald-500/30'
                : isDarkMode
                ? 'bg-[#0b0f19] border-[#1e293b] text-slate-400 hover:border-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FlagIcon code="jp" size="lg" className="mb-2" />
            <span className="text-xs">{t.settings.japaneseTrack}</span>
          </button>

          <button
            onClick={() => onSelectLanguage('en')}
            className={`p-4 rounded-2xl border text-center flex flex-col items-center justify-center transition-all cursor-pointer ${
              profile.selectedLanguage === 'en'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black shadow-sm ring-1 ring-emerald-500/30'
                : isDarkMode
                ? 'bg-[#0b0f19] border-[#1e293b] text-slate-400 hover:border-slate-700'
                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FlagIcon code="us" size="lg" className="mb-2" />
            <span className="text-xs">{t.settings.englishTrack}</span>
          </button>
        </div>
      </div>

      {/* 4. Audio & Accessibility Config */}
      <div className={`p-6 rounded-3xl border space-y-4 transition-colors ${
        isDarkMode ? 'bg-[#131b2e] border-[#1e293b]' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <h3 className={`font-display font-black text-sm flex items-center gap-2 ${
          isDarkMode ? 'text-white' : 'text-slate-900'
        }`}>
          <Volume2 size={18} className="text-sky-400" /> {t.settings.audioSpeed}
        </h3>

        <div className="space-y-3">
          <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-[#0b0f19] border-[#1e293b]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{t.settings.audioSpeed}</div>
              <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.settings.soundEffectsDesc}</div>
            </div>
            <select
              value={audioSpeed}
              onChange={(e) => setAudioSpeed(parseFloat(e.target.value))}
              className={`rounded-lg px-3 py-1 text-xs font-bold border ${
                isDarkMode ? 'bg-[#131b2e] text-white border-slate-700' : 'bg-white text-slate-900 border-slate-300'
              }`}
            >
              <option value={0.75}>0.75x</option>
              <option value={1.0}>1.0x</option>
              <option value={1.25}>1.25x</option>
            </select>
          </div>

          <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
            isDarkMode ? 'bg-[#0b0f19] border-[#1e293b]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div>
              <div className={`text-xs font-black ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{t.settings.colorblindPalette}</div>
              <div className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{t.settings.colorblindPaletteDesc}</div>
            </div>
            <input
              type="checkbox"
              checked={colorblindMode}
              onChange={(e) => setColorblindMode(e.target.checked)}
              className="w-4 h-4 accent-[#FF6B35] cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
