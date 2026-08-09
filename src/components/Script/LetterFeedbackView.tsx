import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { useKleoStore } from '../../store/useKleoStore';
import { processAILetterFeedback } from '../../lib/aiService';
import { AILetterFeedbackResponse } from '../../types';

export const LetterFeedbackView: React.FC = () => {
  const { isDarkMode, profile, savePhraseToReview } = useAppStore();
  const { react } = useKleoStore();

  const [letterType, setLetterType] = useState('Self-Introduction & Letter');
  const [letterContent, setLetterContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [feedback, setFeedback] = useState<AILetterFeedbackResponse | null>(null);
  const [savedStatus, setSavedStatus] = useState<Record<string, boolean>>({});

  const sampleTemplates: Record<string, { type: string; prompt: string }> = {
    ko: {
      type: 'Self-Introduction Letter (자기소개서)',
      prompt: `안녕하십니까! 저는 CATalouge에서 한국어를 공부하는 학생입니다.\n만나서 반갑습니다. 저는 한국 문화와 고양이를 아주 좋아합니다.\n앞으로 열심히 공부하겠습니다. 잘 부탁드립니다.`
    },
    ja: {
      type: 'Polite Email (丁寧なお手紙)',
      prompt: `拝啓\n初めまして、CATalougeで日本語を勉强している学生です。\nどうぞよろしくお願いいたします。\n日本の文化と猫がとても好きです。これからも頑張ります。`
    },
    en: {
      type: 'Cover Letter / Introduction',
      prompt: `Dear Hiring Team,\n\nI am writing to express my strong interest in learning languages with CATalouge.\nI have been practicing daily and am excited to apply my skills.\n\nSincerely,\nLanguage Learner`
    }
  };

  const handleInsertTemplate = () => {
    const lang = profile.selectedLanguage;
    const template = sampleTemplates[lang] || sampleTemplates.en;
    setLetterType(template.type);
    setLetterContent(template.prompt);
  };

  const handleAnalyze = async () => {
    if (!letterContent.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    react('correct');

    try {
      const result = await processAILetterFeedback({
        letterContent,
        language: profile.selectedLanguage,
        userLevel: profile.level,
        struggledVocab: profile.struggledVocab,
        letterType
      });

      setFeedback(result);
      react('celebrate');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSavePhrase = (term: string, translation: string) => {
    savePhraseToReview({
      term,
      translation,
      language: profile.selectedLanguage,
      phonetic: ''
    });
    setSavedStatus(prev => ({ ...prev, [term]: true }));
  };

  const currentStruggled = profile.struggledVocab || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header Banner */}
      <div className={`p-6 rounded-2xl border backdrop-blur-md relative overflow-hidden ${
        isDarkMode ? 'bg-[#111827]/90 border-[#1e293b]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 shrink-0">
              <span className="material-symbols-outlined text-2xl">draw</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`font-display text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  AI Letter & Composition Feedback
                </h2>
                <span className="bg-orange-500/10 border border-orange-500/30 text-orange-500 font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
                  Unified AI Pipeline
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Draft formal emails, letters, and essays. Kleo analyzes tone, grammar, and reuses vocabulary context from your Chatbot practice!
              </p>
            </div>
          </div>

          <button
            onClick={handleInsertTemplate}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all cursor-pointer ${
              isDarkMode
                ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span className="material-symbols-outlined text-base">auto_fix_high</span>
            <span>Load Sample Draft</span>
          </button>
        </div>

        {/* Cross-Feature Context Sharing Banner */}
        <div className={`mt-4 p-3 rounded-xl border flex items-center gap-3 text-xs ${
          isDarkMode ? 'bg-[#1e293b]/70 border-[#334155]' : 'bg-orange-50/80 border-orange-200'
        }`}>
          <span className="material-symbols-outlined text-orange-500 text-lg">sync_alt</span>
          <div className="flex-1 min-w-0">
            <span className={`font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-800'}`}>
              Cross-Feature Context Sync:
            </span>{' '}
            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
              {currentStruggled.length > 0
                ? `Reusing recent chat struggles: ${currentStruggled.map(s => s.word).join(', ')}`
                : 'No recent chat struggles recorded yet. Practice in Chatbot to automatically populate weak areas here!'}
            </span>
          </div>
        </div>
      </div>

      {/* Editor Box */}
      <div className={`p-6 rounded-2xl border space-y-4 ${
        isDarkMode ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-slate-200 shadow-sm'
      }`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            Letter Title / Topic
          </label>
          <input
            type="text"
            value={letterType}
            onChange={(e) => setLetterType(e.target.value)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium max-w-xs focus:outline-none focus:border-orange-500 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
            }`}
            placeholder="e.g. Job Application, Email to Teacher"
          />
        </div>

        <div className="relative">
          <textarea
            rows={8}
            value={letterContent}
            onChange={(e) => setLetterContent(e.target.value)}
            placeholder="Paste or write your letter or composition draft here... (e.g. self introduction, request letter, polite message)"
            className={`w-full p-4 rounded-xl border text-sm font-sans resize-y focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all ${
              isDarkMode ? 'bg-[#0b0f17] border-slate-800 text-white placeholder-slate-600' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 font-mono">
            {letterContent.length} chars
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={handleAnalyze}
            disabled={!letterContent.trim() || isAnalyzing}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs text-white shadow-lg transition-all cursor-pointer ${
              !letterContent.trim() || isAnalyzing
                ? 'bg-slate-600 opacity-50 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-orange-500/25 active:scale-98'
            }`}
          >
            {isAnalyzing ? (
              <>
                <span className="material-symbols-outlined text-base animate-spin">progress_activity</span>
                <span>Analyzing Draft with Kleo AI...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base">analytics</span>
                <span>Get Detailed AI Feedback</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Feedback Results Display */}
      <AnimatePresence mode="wait">
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            {/* Score & Summary Banner */}
            <div className={`p-6 rounded-2xl border ${
              isDarkMode ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                {/* Score Gauge */}
                <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-orange-500/5 border border-orange-500/20 text-center">
                  <span className="text-4xl font-black text-orange-500 tracking-tight">
                    {feedback.overallScore}
                    <span className="text-lg font-normal text-slate-500">/100</span>
                  </span>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">
                    Composition Score
                  </span>
                </div>

                {/* Politeness Rating & Summary */}
                <div className="md:col-span-2 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-amber-500 text-lg">verified</span>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Tone & Register Evaluation
                    </span>
                    <span className="bg-amber-500/10 border border-amber-500/30 text-amber-500 text-[11px] font-bold px-2 py-0.5 rounded-full">
                      {feedback.politenessRating}
                    </span>
                  </div>
                  <p className={`text-xs leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {feedback.summary}
                  </p>
                </div>
              </div>

              {/* Addressed Struggled Words from Chat */}
              {feedback.struggledVocabAddressed && feedback.struggledVocabAddressed.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800/20 dark:border-slate-800 flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-bold text-emerald-500 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Chat Vocab Reinforcement:
                  </span>
                  {feedback.struggledVocabAddressed.map((w, idx) => (
                    <span
                      key={idx}
                      className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[11px] font-semibold px-2 py-0.5 rounded-md"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Line-by-Line Corrections */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDarkMode ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-500 text-xl">find_replace</span>
                <h3 className={`font-display text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Line-by-Line Recommendations
                </h3>
              </div>

              <div className="space-y-3">
                {feedback.lineCorrections.map((item, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border space-y-2 ${
                      isDarkMode ? 'bg-[#0b0f17] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 text-rose-500">
                        <span className="material-symbols-outlined text-sm">close</span>
                        <span className="font-mono line-through">{item.originalLine}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-500 font-bold">
                        <span className="material-symbols-outlined text-sm">done</span>
                        <span>{item.suggestedLine}</span>
                      </div>
                    </div>
                    <p className={`text-[11px] pl-5 border-l-2 border-orange-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                      💡 {item.explanation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested High-Level Expressions */}
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDarkMode ? 'bg-[#111827] border-[#1e293b]' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500 text-xl">stars</span>
                <h3 className={`font-display text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  Recommended Expressions to Level-Up Your Writing
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {feedback.suggestedPhrases.map((phrase, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 ${
                      isDarkMode ? 'bg-[#0b0f17] border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-sm text-orange-500">{phrase.term}</span>
                        <button
                          onClick={() => handleSavePhrase(phrase.term, phrase.translation)}
                          disabled={savedStatus[phrase.term]}
                          className={`text-[10px] font-bold px-2 py-1 rounded-md border flex items-center gap-1 transition-all cursor-pointer ${
                            savedStatus[phrase.term]
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500'
                              : 'bg-orange-500/10 border-orange-500/30 text-orange-500 hover:bg-orange-500 hover:text-white'
                          }`}
                        >
                          <span className="material-symbols-outlined text-xs">
                            {savedStatus[phrase.term] ? 'check' : 'bookmark_add'}
                          </span>
                          <span>{savedStatus[phrase.term] ? 'Saved' : 'Save to Review'}</span>
                        </button>
                      </div>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        {phrase.translation}
                      </p>
                    </div>
                    <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                      {phrase.context}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
