import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, BookOpen, Award, CheckCircle2, ChevronDown, ChevronUp, ArrowRight, Loader2 } from 'lucide-react';
import { LevelDetail } from '../../types/proficiency';

interface LevelDetailModalProps {
  levelId: string;
  onClose: () => void;
  onStartQuiz: (level: LevelDetail) => void;
}

export const LevelDetailModal: React.FC<LevelDetailModalProps> = ({
  levelId,
  onClose,
  onStartQuiz
}) => {
  const [levelDetail, setLevelDetail] = useState<LevelDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLevel() {
      try {
        const res = await fetch(`/api/levels/${levelId}`);
        const data = await res.json();
        if (isMounted && data.level) {
          setLevelDetail(data.level);
          if (data.level.lessons?.length > 0) {
            setExpandedLessonId(data.level.lessons[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load level detail:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadLevel();
    return () => {
      isMounted = false;
    };
  }, [levelId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-2xl bg-[#0f1523] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
              Curriculum & Proficiency Evaluation
            </span>
            <h2 className="text-xl font-black text-white mt-1">
              {levelDetail ? levelDetail.name : 'Loading Level...'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {loading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 size={32} className="animate-spin text-sky-400" />
              <p className="text-xs font-semibold">Loading curriculum & assessment module...</p>
            </div>
          ) : levelDetail ? (
            <>
              {/* Level Overview Card */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <span className="text-[10px] font-black tracking-wider uppercase text-sky-400">Proficiency Competencies</span>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                  {levelDetail.description}
                </p>
              </div>

              {/* Lessons Accordion */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <BookOpen size={14} className="text-sky-400" />
                    <span>Curriculum Lessons ({levelDetail.lessons.length})</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Read before taking the quiz</span>
                </div>

                <div className="space-y-2.5">
                  {levelDetail.lessons.map((lesson, idx) => {
                    const isExpanded = expandedLessonId === lesson.id;
                    return (
                      <div
                        key={lesson.id}
                        className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-colors hover:border-slate-700"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedLessonId(isExpanded ? null : lesson.id)}
                          className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-lg bg-slate-800 text-sky-400 text-xs font-black flex items-center justify-center shrink-0">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-xs sm:text-sm text-slate-100">{lesson.title}</span>
                          </div>
                          {isExpanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </button>

                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 border-t border-slate-800/60 bg-slate-950/40 text-xs text-slate-300 leading-relaxed">
                            {lesson.content}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Assessment Card */}
              {levelDetail.quiz && (
                <div className="p-5 rounded-2xl bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-transparent border border-sky-500/30 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <Award size={16} />
                      <span className="text-xs font-bold uppercase tracking-wider">Proficiency Evaluation</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      {levelDetail.quiz.questions.length} Questions • {Math.round(levelDetail.quiz.passThreshold * 100)}% Passing Threshold
                    </p>
                  </div>
                  <button
                    onClick={() => onStartQuiz(levelDetail)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-sky-500/20 hover:scale-105 transition-all shrink-0 cursor-pointer"
                  >
                    <span>Start Quiz</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center text-rose-400 text-xs font-bold">
              Level could not be loaded. Please try again.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Passing unlocks the subsequent level on your roadmap.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};
