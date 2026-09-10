import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Award,
  CheckCircle2,
  Lock,
  Sparkles,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Download,
  Loader2,
  Trophy,
  ExternalLink
} from 'lucide-react';
import { Language, ProficiencyLevel, LevelDetail } from '../../types/proficiency';
import { LevelDetailModal } from './LevelDetailModal';
import { LevelQuizModal } from './LevelQuizModal';
import { useAppStore } from '../../store/useAppStore';

interface ProficiencyRoadmapViewProps {
  initialLanguage?: string;
}

export const ProficiencyRoadmapView: React.FC<ProficiencyRoadmapViewProps> = ({
  initialLanguage
}) => {
  const { profile, selectLanguageTrack } = useAppStore();
  const currentLangCode = profile.selectedLanguage || initialLanguage || 'ko';

  const [languages, setLanguages] = useState<Language[]>([]);
  const [levels, setLevels] = useState<ProficiencyLevel[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedLevelIdForDetail, setSelectedLevelIdForDetail] = useState<string | null>(null);
  const [activeQuizLevel, setActiveQuizLevel] = useState<LevelDetail | null>(null);

  // Fetch languages list
  useEffect(() => {
    async function loadLanguages() {
      try {
        const res = await fetch('/api/languages');
        const data = await res.json();
        if (data.languages) {
          setLanguages(data.languages);
        }
      } catch (err) {
        console.error('Failed to fetch languages:', err);
      }
    }
    loadLanguages();
  }, []);

  // Fetch levels with user progress for selected language
  const fetchLevels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/languages/${currentLangCode}/levels?userId=usr-1`);
      const data = await res.json();
      if (data.levels) {
        setLevels(data.levels);
      }
    } catch (err) {
      console.error('Failed to fetch levels:', err);
    } finally {
      setLoading(false);
    }
  }, [currentLangCode]);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const passedCount = levels.filter((l) => l.status === 'passed').length;
  const progressPercent = levels.length > 0 ? Math.round((passedCount / levels.length) * 100) : 0;

  const getLanguageLabel = (code: string) => {
    switch (code) {
      case 'ko':
        return { name: 'Korean', standard: 'TOPIK Standard (Level 1–6)', flag: '🇰🇷' };
      case 'ja':
        return { name: 'Japanese', standard: 'JLPT Standard (N5–N1)', flag: '🇯🇵' };
      case 'en':
      default:
        return { name: 'English', standard: 'CEFR Standard (A1–C2)', flag: '🇬🇧' };
    }
  };

  const currentInfo = getLanguageLabel(currentLangCode);

  return (
    <div className="pt-20 px-4 md:px-8 pb-20 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start">
      {/* Main Roadmap Area */}
      <section className="flex-1 w-full space-y-8">
        {/* Language Track Selector Header */}
        <div className="p-6 rounded-3xl bg-[#0f1523] border border-slate-800/80 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 block">
              Accredited Language Proficiency System
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2.5">
              <span>{currentInfo.flag}</span>
              <span>{currentInfo.name} Proficiency Roadmap</span>
            </h1>
            <p className="text-xs text-slate-400">{currentInfo.standard}</p>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
            {(['ko', 'ja', 'en'] as const).map((lang) => {
              const info = getLanguageLabel(lang);
              const isActive = currentLangCode === lang;
              return (
                <button
                  key={lang}
                  onClick={() => selectLanguageTrack(lang)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/20 scale-102'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <span>{info.flag}</span>
                  <span>{info.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Roadmap Snake Path */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0b0f19] border border-slate-800/60 shadow-2xl relative min-h-[500px]">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 size={36} className="animate-spin text-sky-400" />
              <p className="text-xs font-bold">Synchronizing leveled curriculum & progression...</p>
            </div>
          ) : (
            <div className="max-w-xl mx-auto flex flex-col items-center relative">
              {levels.map((level, idx) => {
                const isPassed = level.status === 'passed';
                const isInProgress = level.status === 'in_progress';
                const isLocked = level.status === 'locked';
                const isFinal = level.isFinalLevel;

                return (
                  <div key={level.id} className="w-full flex flex-col items-center relative mb-14 last:mb-0 group">
                    {/* Connecting Line to Next Node */}
                    {idx < levels.length - 1 && (
                      <div
                        className={`absolute top-24 left-1/2 -translate-x-1/2 w-1.5 h-16 rounded-full transition-colors z-0 ${
                          isPassed ? 'bg-emerald-500 shadow-sm shadow-emerald-500/40' : 'bg-slate-800'
                        }`}
                      />
                    )}

                    {/* Interactive Level Node Orb */}
                    <motion.div
                      whileHover={!isLocked ? { scale: 1.06 } : {}}
                      whileTap={!isLocked ? { scale: 0.96 } : {}}
                      onClick={() => !isLocked && setSelectedLevelIdForDetail(level.id)}
                      className={`relative z-10 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl p-1 flex items-center justify-center transition-all ${
                        isLocked
                          ? 'opacity-40 grayscale cursor-not-allowed bg-slate-900 border border-slate-800'
                          : isPassed
                          ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-xl shadow-emerald-500/20 cursor-pointer'
                          : 'bg-gradient-to-tr from-sky-400 to-cyan-300 shadow-xl shadow-sky-500/30 cursor-pointer ring-4 ring-sky-400/20 animate-pulse'
                      }`}
                    >
                      <div className="w-full h-full rounded-[22px] bg-[#0f172a] flex flex-col items-center justify-center text-center p-2">
                        {isPassed ? (
                          <CheckCircle2 size={32} className="text-emerald-400" />
                        ) : isLocked ? (
                          <Lock size={28} className="text-slate-500" />
                        ) : isFinal ? (
                          <Trophy size={32} className="text-amber-400 animate-bounce" />
                        ) : (
                          <Sparkles size={30} className="text-sky-400" />
                        )}

                        <span className={`mt-1 font-black text-xs sm:text-sm tracking-wider ${
                          isPassed ? 'text-emerald-300' : isLocked ? 'text-slate-500' : 'text-white'
                        }`}>
                          {level.code}
                        </span>
                      </div>

                      {/* Final Certificate Stamp Badge */}
                      {isFinal && (
                        <div className="absolute -top-2.5 -right-2.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider shadow-md flex items-center gap-1">
                          <Award size={11} />
                          <span>Cert</span>
                        </div>
                      )}
                    </motion.div>

                    {/* Level Meta Text Below Node */}
                    <div className="mt-3 text-center max-w-sm space-y-1">
                      <div className="flex items-center justify-center gap-2">
                        <h3 className={`font-black text-sm sm:text-base ${
                          isLocked ? 'text-slate-500' : 'text-white'
                        }`}>
                          {level.name}
                        </h3>
                      </div>

                      <p className="text-[11px] text-slate-400 line-clamp-2 px-4">
                        {level.description}
                      </p>

                      <div className="flex items-center justify-center gap-2 pt-1">
                        {isPassed ? (
                          <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            Passed • {level.bestScore ? `${Math.round(level.bestScore * 100)}%` : 'Completed'}
                          </span>
                        ) : isInProgress ? (
                          <button
                            onClick={() => setSelectedLevelIdForDetail(level.id)}
                            className="text-[10px] font-black text-sky-400 bg-sky-500/15 hover:bg-sky-500/25 px-3 py-1 rounded-full border border-sky-500/30 flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <span>Open Level</span>
                            <ArrowRight size={10} />
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-slate-500">
                            Locked • Complete previous level
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Right Sidebar: Track Overview & Official Certificate Preview */}
      <aside className="w-full lg:w-84 space-y-6 shrink-0">
        {/* Progress Card */}
        <div className="p-6 rounded-3xl bg-[#0f1523] border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">Track Progress</span>
            <span className="text-sm font-black text-sky-400">{progressPercent}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-sky-400 to-emerald-400"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-center pt-1">
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-xl font-black text-white">{passedCount}</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">Levels Passed</p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
              <p className="text-xl font-black text-sky-400">{levels.length}</p>
              <p className="text-[10px] font-bold uppercase text-slate-400">Total Milestones</p>
            </div>
          </div>
        </div>

        {/* Official Certificate Information Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-[#12192c] via-[#0f1523] to-[#0a0e18] border border-amber-500/30 shadow-2xl space-y-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center font-black shadow-lg shadow-amber-500/20">
              <Award size={22} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 block">Graduation Credential</span>
              <h4 className="text-sm font-black text-white">Landscape A4 Certificate</h4>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Upon successfully passing the final proficiency evaluation ({currentInfo.standard.split(' ')[0]}), an official verified Certificate of Proficiency with an immutable QR code is automatically generated.
          </p>

          <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>Cryptographically verifiable online</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Download size={14} className="text-sky-400 shrink-0" />
              <span>Exportable high-resolution PDF format</span>
            </div>
          </div>
        </div>

        {/* Academic Standard Overview */}
        <div className="p-6 rounded-3xl bg-[#0f1523] border border-slate-800 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <BookOpen size={14} className="text-sky-400" />
            <span>Academic Standard</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {currentLangCode === 'ko' && (
              <>
                The <strong>Test of Proficiency in Korean (TOPIK)</strong> is administered to assess and certify the Korean language skills of non-native speakers across Levels 1 through 6.
              </>
            )}
            {currentLangCode === 'ja' && (
              <>
                The <strong>Japanese-Language Proficiency Test (JLPT)</strong> evaluates Japanese proficiency from foundational N5 through mastery level N1.
              </>
            )}
            {currentLangCode === 'en' && (
              <>
                The <strong>Common European Framework of Reference for Languages (CEFR)</strong> is the international benchmark for grading language proficiency from A1 to C2.
              </>
            )}
          </p>
        </div>
      </aside>

      {/* Level Detail Modal (Curriculum & Lessons) */}
      <AnimatePresence>
        {selectedLevelIdForDetail && (
          <LevelDetailModal
            levelId={selectedLevelIdForDetail}
            onClose={() => setSelectedLevelIdForDetail(null)}
            onStartQuiz={(levelDetail) => {
              setSelectedLevelIdForDetail(null);
              setActiveQuizLevel(levelDetail);
            }}
          />
        )}
      </AnimatePresence>

      {/* Level Quiz Modal (Interactive Test & Certification) */}
      <AnimatePresence>
        {activeQuizLevel && (
          <LevelQuizModal
            levelDetail={activeQuizLevel}
            onClose={() => setActiveQuizLevel(null)}
            onQuizCompleted={() => {
              fetchLevels();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
