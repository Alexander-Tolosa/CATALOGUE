import React, { useState } from 'react';
import { Exercise, KleoMood } from '../../types';
import { StrokeTracingCanvas } from '../ScriptModule/StrokeTracingCanvas';
import { Volume2, Mic, CheckCircle2, XCircle } from 'lucide-react';

interface ExerciseCardProps {
  exercise: Exercise;
  onAnswer: (isCorrect: boolean, kleoReaction: KleoMood) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [assembledSentence, setAssembledSentence] = useState<string[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  const speakAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleMultipleChoiceSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleToggleWordBubble = (word: string) => {
    if (isSubmitted) return;
    if (assembledSentence.includes(word)) {
      setAssembledSentence(assembledSentence.filter(w => w !== word));
    } else {
      setAssembledSentence([...assembledSentence, word]);
    }
  };

  const checkAnswer = () => {
    if (isSubmitted) return;
    let correct = false;

    if (exercise.type === 'multiple-choice' || exercise.type === 'listening') {
      correct = selectedOption === exercise.correctAnswer;
    } else if (exercise.type === 'sentence-assembly') {
      const expected = Array.isArray(exercise.correctAnswer)
        ? exercise.correctAnswer.join(' ')
        : exercise.correctAnswer;
      correct = assembledSentence.join(' ') === expected;
    } else if (exercise.type === 'tracing' || exercise.type === 'speaking') {
      correct = true; // Verified canvas or speech
    }

    setIsCorrect(correct);
    setIsSubmitted(true);
    onAnswer(correct, correct ? 'happy' : 'nuzzling');
  };

  return (
    <div className="space-y-6">
      {/* Exercise Prompt Header */}
      <div className="space-y-2 text-center md:text-left">
        <span className="text-xs font-bold text-sky-400 uppercase tracking-widest bg-sky-950/80 px-3 py-1 rounded-full border border-sky-800">
          Exercise Type: {exercise.type.replace('-', ' ')}
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-slate-100 mt-2">
          {exercise.prompt}
        </h3>

        {exercise.targetScript && (
          <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
            <span className="text-4xl font-extrabold text-sky-300 font-kr font-jp">
              {exercise.targetScript}
            </span>
            {exercise.romanization && (
              <span className="text-sm text-slate-400 font-mono">({exercise.romanization})</span>
            )}
            <button
              onClick={() => speakAudio(exercise.targetScript || '')}
              className="p-2 rounded-lg bg-sky-950 border border-sky-800 text-sky-400 hover:bg-sky-900 transition-colors"
              title="Listen pronunciation"
            >
              <Volume2 size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Exercise Content Area */}
      <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-4">
        {/* 1. Multiple Choice / Listening */}
        {(exercise.type === 'multiple-choice' || exercise.type === 'listening') && exercise.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exercise.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              let btnStyle = 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500';

              if (isSubmitted) {
                if (option === exercise.correctAnswer) {
                  btnStyle = 'bg-emerald-950/90 border-emerald-500 text-emerald-200 font-bold';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200';
                }
              } else if (isSelected) {
                btnStyle = 'bg-sky-950 border-sky-400 text-sky-100 font-bold shadow-lg';
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleMultipleChoiceSelect(option)}
                  disabled={isSubmitted}
                  className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all font-medium ${btnStyle}`}
                >
                  <span className="font-kr font-jp">{option}</span>
                  {isSubmitted && option === exercise.correctAnswer && (
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  )}
                  {isSubmitted && isSelected && !isCorrect && (
                    <XCircle size={20} className="text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 2. Sentence Assembly */}
        {exercise.type === 'sentence-assembly' && exercise.options && (
          <div className="space-y-4">
            {/* Target Assembly Drop Slot */}
            <div className="min-h-16 p-3 bg-slate-950 rounded-xl border border-dashed border-sky-500/40 flex flex-wrap items-center gap-2">
              {assembledSentence.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Click word bubbles below in order to assemble...</span>
              ) : (
                assembledSentence.map((word, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleToggleWordBubble(word)}
                    disabled={isSubmitted}
                    className="bg-sky-600 text-white font-bold px-3 py-1.5 rounded-lg text-sm font-kr shadow-md hover:bg-sky-700"
                  >
                    {word}
                  </button>
                ))
              )}
            </div>

            {/* Word Bubbles Pool */}
            <div className="flex flex-wrap gap-2 pt-2">
              {exercise.options.map((word, idx) => {
                const isUsed = assembledSentence.includes(word);
                return (
                  <button
                    key={idx}
                    onClick={() => handleToggleWordBubble(word)}
                    disabled={isUsed || isSubmitted}
                    className={`px-4 py-2 rounded-xl border font-bold text-sm font-kr transition-all ${
                      isUsed
                        ? 'opacity-30 border-slate-800 bg-slate-900 cursor-not-allowed'
                        : 'bg-slate-800 hover:bg-slate-700 border-slate-600 text-slate-200'
                    }`}
                  >
                    {word}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Tracing Exercise */}
        {exercise.type === 'tracing' && exercise.targetScript && (
          <StrokeTracingCanvas
            character={exercise.targetScript}
            guideText="Trace the character above carefully"
            onComplete={() => {
              setIsCorrect(true);
              setIsSubmitted(true);
              onAnswer(true, 'happy');
            }}
          />
        )}

        {/* 4. Speaking Exercise */}
        {exercise.type === 'speaking' && (
          <div className="flex flex-col items-center justify-center p-6 space-y-4">
            <button
              onClick={() => {
                setIsRecording(true);
                setTimeout(() => {
                  setIsRecording(false);
                  setIsCorrect(true);
                  setIsSubmitted(true);
                  onAnswer(true, 'celebrating');
                }, 2000);
              }}
              disabled={isSubmitted}
              className={`p-6 rounded-full border-2 transition-all ${
                isRecording
                  ? 'bg-rose-600 border-rose-400 animate-pulse text-white'
                  : 'bg-sky-600 hover:bg-sky-500 border-sky-300 text-white shadow-xl'
              }`}
            >
              <Mic size={32} />
            </button>
            <span className="text-xs text-slate-400">
              {isRecording ? 'Listening... speak clearly!' : 'Tap mic and pronounce the phrase out loud'}
            </span>
          </div>
        )}
      </div>

      {/* Cultural Note or Explanation */}
      {isSubmitted && (
        <div className={`p-4 rounded-xl border animate-fadeIn ${
          isCorrect
            ? 'bg-emerald-950/70 border-emerald-800/80 text-emerald-200'
            : 'bg-rose-950/70 border-rose-800/80 text-rose-200'
        }`}>
          <div className="font-bold flex items-center gap-2">
            {isCorrect ? '🎉 Great Job!' : '💡 Don\'t worry, mistakes help us learn!'}
          </div>
          {exercise.explanation && <p className="text-sm mt-1">{exercise.explanation}</p>}
          {exercise.culturalNote && (
            <p className="text-xs italic mt-2 text-amber-300 bg-amber-950/40 p-2 rounded-lg border border-amber-800/50">
              ⛩️ Cultural Note: {exercise.culturalNote}
            </p>
          )}
        </div>
      )}

      {/* Submit Button */}
      {exercise.type !== 'tracing' && (
        <button
          onClick={checkAnswer}
          disabled={isSubmitted}
          className={`w-full py-3.5 rounded-xl font-bold font-brand text-lg transition-all ${
            isSubmitted
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'btn-primary'
          }`}
        >
          {isSubmitted ? 'Answer Submitted' : 'Check Answer'}
        </button>
      )}
    </div>
  );
};
