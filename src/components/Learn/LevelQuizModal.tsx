import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle,
  XCircle,
  Award,
  Download,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { LevelDetail, QuizSubmissionResult } from '../../types/proficiency';

interface LevelQuizModalProps {
  levelDetail: LevelDetail;
  onClose: () => void;
  onQuizCompleted: () => void;
}

export const LevelQuizModal: React.FC<LevelQuizModalProps> = ({
  levelDetail,
  onClose,
  onQuizCompleted
}) => {
  const quiz = levelDetail.quiz;
  const questions = quiz?.questions || [];

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<QuizSubmissionResult | null>(null);

  if (!quiz || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentQuestionIdx];
  const allAnswered = questions.every((q) => Boolean(selectedAnswers[q.id]));

  const handleSelectChoice = (questionId: string, choice: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: choice
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/levels/${levelDetail.id}/quiz/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: 'usr-1',
          userName: 'Alexander Michael Tolosa',
          answers: selectedAnswers
        })
      });
      const data: QuizSubmissionResult = await res.json();
      setSubmissionResult(data);

      if (data.passed) {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
      onQuizCompleted();
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentQuestionIdx(0);
    setSubmissionResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-[#0f1523] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-400 border border-sky-500/30">
                {levelDetail.code} Assessment
              </span>
              <span className="text-xs text-slate-400">Pass: {Math.round((quiz.passThreshold || 0.8) * 100)}%</span>
            </div>
            <h2 className="text-lg font-black text-white mt-1">{levelDetail.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!submissionResult ? (
            <>
              {/* Progress bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
                  <span>{Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}% Complete</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-sky-400 to-emerald-400"
                    initial={false}
                    animate={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>

              {/* Current Question */}
              <div className="space-y-4 pt-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-100">
                  {currentQ.prompt}
                </h3>

                <div className="space-y-2.5">
                  {currentQ.choices.map((choice, idx) => {
                    const isSelected = selectedAnswers[currentQ.id] === choice;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectChoice(currentQ.id, choice)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/20 border-sky-400 text-white ring-2 ring-sky-400/30'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/80 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                            isSelected ? 'bg-sky-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                          }`}>
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="font-semibold text-sm">{choice}</span>
                        </div>
                        {isSelected && <CheckCircle size={18} className="text-sky-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            /* Results Screen */
            <div className="space-y-6 py-4 text-center">
              {submissionResult.passed ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 border-2 border-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
                    <CheckCircle size={44} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Proficiency Exam Passed!</h3>
                  <p className="text-sm text-slate-300">
                    You scored <strong className="text-emerald-400">{submissionResult.scorePercentage}%</strong> ({submissionResult.correctCount}/{submissionResult.totalQuestions} correct). Required threshold was {Math.round(submissionResult.passThreshold * 100)}%.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-20 h-20 rounded-full bg-rose-500/20 text-rose-400 border-2 border-rose-400 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/10">
                    <XCircle size={44} />
                  </div>
                  <h3 className="text-2xl font-black text-white">Score: {submissionResult.scorePercentage}%</h3>
                  <p className="text-sm text-slate-300">
                    You answered {submissionResult.correctCount} of {submissionResult.totalQuestions} correctly. You need at least {Math.round(submissionResult.passThreshold * 100)}% to unlock the next level.
                  </p>
                </div>
              )}

              {/* Official Certificate Award Banner (if earned) */}
              {submissionResult.certificate && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-6 rounded-3xl bg-gradient-to-tr from-amber-500/20 via-sky-500/15 to-emerald-500/20 border-2 border-amber-400/40 text-left space-y-4 shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-lg">
                      <Award size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black tracking-widest text-amber-300 uppercase">
                          Official Graduation Credential
                        </span>
                        <Sparkles size={14} className="text-amber-300" />
                      </div>
                      <h4 className="text-base font-black text-white">
                        Certificate of Language Proficiency Earned!
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    Congratulations! By passing the final level evaluation, an official landscape A4 verifiable certificate has been issued under ID <strong className="text-amber-300 font-mono">{submissionResult.certificate.certificateCode}</strong>.
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <a
                      href={`/api/certificates/${submissionResult.certificate.certificateCode}/download`}
                      download
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-md cursor-pointer"
                    >
                      <Download size={15} />
                      <span>Download Official PDF</span>
                    </a>

                    <a
                      href={`/verify/${submissionResult.certificate.certificateCode}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 border border-slate-700 transition-colors"
                    >
                      <ShieldCheck size={15} className="text-emerald-400" />
                      <span>Verify Credential Online</span>
                      <ExternalLink size={12} className="text-slate-400" />
                    </a>
                  </div>
                </motion.div>
              )}

              {/* Answers breakdown */}
              <div className="text-left space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Review Questions</h4>
                <div className="space-y-2">
                  {submissionResult.results.map((r, i) => (
                    <div
                      key={r.questionId}
                      className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                        r.isCorrect
                          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                      }`}
                    >
                      {r.isCorrect ? (
                        <CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold text-slate-200">
                          {i + 1}. {questions[i]?.prompt}
                        </p>
                        <p className="text-[11px] mt-1 text-slate-300">
                          Your answer: <span className="font-semibold">{r.submitted || 'None'}</span>
                          {!r.isCorrect && (
                            <span className="text-emerald-300 ml-2">Correct: {r.correctAnswer}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          {!submissionResult ? (
            <>
              <button
                type="button"
                disabled={currentQuestionIdx === 0}
                onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIdx < questions.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentQuestionIdx((p) => Math.min(questions.length - 1, p + 1))}
                    className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!allAnswered || isSubmitting}
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-400 to-emerald-400 hover:from-sky-300 hover:to-emerald-300 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-sky-500/20 disabled:opacity-40 cursor-pointer"
                  >
                    <span>{isSubmitting ? 'Evaluating...' : 'Submit Evaluation'}</span>
                    <CheckCircle size={15} />
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="w-full flex items-center justify-between">
              <button
                onClick={handleRetake}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw size={14} />
                <span>Retake Quiz</span>
              </button>

              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-black cursor-pointer shadow-md"
              >
                Continue to Roadmap
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
