import React, { useState } from 'react';
import { LessonNode, KleoMood } from '../../types';
import { useTranslation } from '../../lib/i18n/useTranslation';
import { ExerciseCard } from './ExerciseCard';
import { KleoAvatar } from '../Kleo/KleoAvatar';
import confetti from 'canvas-confetti';
import { X, Heart, Sparkles, ArrowRight, RotateCcw } from 'lucide-react';

interface LessonPlayerProps {
  node: LessonNode;
  userHearts: number;
  onDeductHeart: () => void;
  onComplete: (xpReward: number) => void;
  onClose: () => void;
  equippedCosmetics?: { hat?: string; scarf?: string; glasses?: string };
}

export const LessonPlayer: React.FC<LessonPlayerProps> = ({
  node,
  userHearts,
  onDeductHeart,
  onComplete,
  onClose,
  equippedCosmetics
}) => {
  const { t } = useTranslation();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [kleoMood, setKleoMood] = useState<KleoMood>('happy');
  const [kleoSpeech, setKleoSpeech] = useState<string>("You've got this! Take your time!");
  const [isLessonFinished, setIsLessonFinished] = useState(false);

  const currentExercise = node.exercises[currentExerciseIndex];
  const progressPercent = Math.round(((currentExerciseIndex + 1) / node.exercises.length) * 100);

  const handleAnswer = (isCorrect: boolean, reaction: KleoMood) => {
    setKleoMood(reaction);

    if (isCorrect) {
      setKleoSpeech("Purr-fect! Excellent answer!");
    } else {
      onDeductHeart();
      setKleoSpeech("No worries! Mistakes are just steps toward mastery! 🐾");
    }
  };

  const handleNextExercise = () => {
    if (currentExerciseIndex < node.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setKleoMood('happy');
      setKleoSpeech("Let's keep up this momentum!");
    } else {
      // Finished all exercises in this lesson!
      setIsLessonFinished(true);
      setKleoMood('celebrating');
      setKleoSpeech("🎉 WOHOO! Lesson completed! You earned XP and grew your bond!");

      // Fire celebratory confetti burst!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel w-full max-w-3xl p-6 relative space-y-6 max-h-[92vh] overflow-y-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            title="Exit Lesson"
          >
            <X size={22} />
          </button>

          {/* Progress Bar */}
          <div className="flex-1 mx-6">
            <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
              <span>{node.title}</span>
              <span>{currentExerciseIndex + 1} / {node.exercises.length}</span>
            </div>
            <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-sky-500 to-emerald-400 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Hearts Display */}
          <div className="flex items-center gap-1 bg-rose-950/80 px-3 py-1.5 rounded-full border border-rose-800 text-rose-300 font-bold text-sm">
            <Heart size={18} fill="#f43f5e" className="animate-pulse" />
            <span>{userHearts}</span>
          </div>
        </div>

        {!isLessonFinished ? (
          <>
            {/* Top Kleo Encouragement Banner */}
            <div className="flex items-center gap-4 bg-slate-950/70 p-3 rounded-2xl border border-sky-500/20">
              <KleoAvatar mood={kleoMood} equippedCosmetics={equippedCosmetics} size={70} />
              <div className="flex-1 bg-sky-950/60 p-3 rounded-xl border border-sky-800/50 relative">
                <p className="text-xs md:text-sm font-medium text-sky-200">{kleoSpeech}</p>
              </div>
            </div>

            {/* Current Exercise */}
            <ExerciseCard
              key={currentExercise.id}
              exercise={currentExercise}
              onAnswer={handleAnswer}
            />

            {/* Next / Continue Control */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextExercise}
                className="glass-button btn-primary text-sm px-6 py-3 cursor-pointer"
              >
                {t.lesson.nextExercise} <ArrowRight size={18} />
              </button>
            </div>
          </>
        ) : (
          /* Celebratory Completion Screen */
          <div className="text-center py-8 space-y-6 animate-fadeIn">
            <div className="inline-block p-4 rounded-full bg-emerald-950/80 border border-emerald-500/50 shadow-2xl">
              <KleoAvatar mood="celebrating" equippedCosmetics={equippedCosmetics} size={150} />
            </div>

            <div className="space-y-2">
              <h2 className="font-brand text-3xl font-extrabold text-slate-100">
                {t.lesson.lessonComplete}
              </h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                You mastered <span className="text-sky-300 font-bold">{node.title}</span>!
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 py-4">
              <div className="bg-slate-900/90 border border-sky-500/40 p-4 rounded-2xl min-w-32 shadow-lg">
                <span className="text-xs text-slate-400 uppercase font-bold block">{t.lesson.xpEarned}</span>
                <span className="text-2xl font-extrabold text-sky-400">+{node.xpReward} XP</span>
              </div>
              <div className="bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl min-w-32 shadow-lg">
                <span className="text-xs text-slate-400 uppercase font-bold block">{t.lesson.kleoBond}</span>
                <span className="text-2xl font-extrabold text-amber-400">+15 Bond XP</span>
              </div>
            </div>

            <button
              onClick={() => {
                onComplete(node.xpReward);
                onClose();
              }}
              className="glass-button btn-orange text-lg font-bold px-8 py-3.5 cursor-pointer"
            >
              {t.lesson.collectRewards}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
