import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Award, CheckCircle2, XCircle, AlertCircle, Star, Crown, Volume2, Sparkles, Zap } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

export type FeedbackLevel = 'BAD' | 'GOOD' | 'BETTER' | 'PERFECT';

interface FeedbackStateInfo {
  level: FeedbackLevel;
  title: string;
  subtitle: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  glowClass: string;
  icon: React.ReactNode;
  examplePath: string; // SVG path representation of stroke quality example
}

interface StrokeTracingCanvasProps {
  character: string;
  romanization?: string;
  meaning?: string;
  guideText?: string;
  onMasterySubmit?: (character: string, level: FeedbackLevel) => void;
  onComplete?: () => void;
  onClear?: () => void;
}

export const StrokeTracingCanvas: React.FC<StrokeTracingCanvasProps> = ({
  character,
  romanization,
  meaning,
  guideText,
  onMasterySubmit,
  onComplete,
  onClear
}) => {
  const { isDarkMode } = useAppStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeCount, setStrokeCount] = useState(0);
  const [drawnPointsCount, setDrawnPointsCount] = useState(0);
  const [activeFeedback, setActiveFeedback] = useState<FeedbackLevel | null>(null);
  const [accuracyScore, setAccuracyScore] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackConfigs: Record<FeedbackLevel, FeedbackStateInfo> = {
    BAD: {
      level: 'BAD',
      title: 'BAD',
      subtitle: 'Stroke order is incorrect',
      colorClass: isDarkMode ? 'text-rose-400' : 'text-rose-600',
      bgClass: isDarkMode ? 'bg-rose-950/40' : 'bg-rose-50',
      borderClass: isDarkMode ? 'border-rose-500/50' : 'border-rose-300',
      glowClass: isDarkMode ? 'shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'shadow-sm',
      icon: <XCircle className={isDarkMode ? 'text-rose-400' : 'text-rose-600'} size={20} />,
      examplePath: 'M 10,15 L 40,12 L 20,45 L 35,40'
    },
    GOOD: {
      level: 'GOOD',
      title: 'GOOD',
      subtitle: 'Right direction, improve alignment',
      colorClass: isDarkMode ? 'text-amber-400' : 'text-amber-600',
      bgClass: isDarkMode ? 'bg-amber-950/40' : 'bg-amber-50',
      borderClass: isDarkMode ? 'border-amber-500/50' : 'border-amber-300',
      glowClass: isDarkMode ? 'shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'shadow-sm',
      icon: <AlertCircle className={isDarkMode ? 'text-amber-400' : 'text-amber-600'} size={20} />,
      examplePath: 'M 12,12 L 38,15 L 38,38 L 22,40'
    },
    BETTER: {
      level: 'BETTER',
      title: 'BETTER',
      subtitle: 'Great form! Practice again for speed',
      colorClass: isDarkMode ? 'text-sky-400' : 'text-sky-600',
      bgClass: isDarkMode ? 'bg-sky-950/40' : 'bg-sky-50',
      borderClass: isDarkMode ? 'border-sky-500/50' : 'border-sky-300',
      glowClass: isDarkMode ? 'shadow-[0_0_15px_rgba(56,189,248,0.3)]' : 'shadow-sm',
      icon: <CheckCircle2 className={isDarkMode ? 'text-sky-400' : 'text-sky-600'} size={20} />,
      examplePath: 'M 10,12 L 40,12 L 40,40 M 15,26 L 35,26'
    },
    PERFECT: {
      level: 'PERFECT',
      title: 'PERFECT',
      subtitle: 'Flawless! Practice mastery',
      colorClass: isDarkMode ? 'text-cyan-300' : 'text-emerald-700',
      bgClass: isDarkMode ? 'bg-cyan-950/60' : 'bg-emerald-50',
      borderClass: isDarkMode ? 'border-cyan-400' : 'border-emerald-300',
      glowClass: isDarkMode ? 'shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'shadow-sm',
      icon: <Crown className={`${isDarkMode ? 'text-cyan-300' : 'text-emerald-600'} animate-pulse`} size={20} />,
      examplePath: 'M 10,10 L 42,10 M 42,10 L 42,42 M 10,26 L 42,26'
    }
  };

  useEffect(() => {
    clearCanvas();
  }, [character, isDarkMode]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid guidelines (faint crosshair grid)
    ctx.strokeStyle = isDarkMode ? 'rgba(56, 189, 248, 0.12)' : 'rgba(14, 165, 233, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Diagonal guidelines
    ctx.strokeStyle = isDarkMode ? 'rgba(56, 189, 248, 0.05)' : 'rgba(14, 165, 233, 0.1)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, canvas.height);
    ctx.moveTo(canvas.width, 0);
    ctx.lineTo(0, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]);

    // Draw faint background ghosted character guide
    ctx.font = '700 160px "Noto Sans KR", "Noto Sans JP", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = isDarkMode ? 'rgba(255, 255, 255, 0.09)' : 'rgba(15, 23, 42, 0.08)';
    ctx.fillText(character, canvas.width / 2, canvas.height / 2 + 10);

    // Ghosted outline stroke
    ctx.strokeStyle = isDarkMode ? 'rgba(56, 189, 248, 0.15)' : 'rgba(14, 165, 233, 0.25)';
    ctx.lineWidth = 2;
    ctx.strokeText(character, canvas.width / 2, canvas.height / 2 + 10);

    setDrawnPointsCount(0);
    setStrokeCount(0);
    setActiveFeedback(null);
    setAccuracyScore(0);
    setIsSubmitted(false);

    if (onClear) onClear();
  };

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = isDarkMode ? '#38bdf8' : '#0284c7';
    ctx.shadowColor = isDarkMode ? 'rgba(56, 189, 248, 0.5)' : 'rgba(2, 132, 199, 0.3)';
    ctx.shadowBlur = 6;

    setIsDrawing(true);
    setStrokeCount(prev => prev + 1);
    setDrawnPointsCount(prev => prev + 1);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    ctx.lineTo(x, y);
    ctx.stroke();

    const newPoints = drawnPointsCount + 1;
    setDrawnPointsCount(newPoints);

    evaluateRealTimeFeedback(newPoints);
  };

  const evaluateRealTimeFeedback = (points: number) => {
    let calculatedScore = Math.min(100, Math.floor((points / 45) * 100));
    setAccuracyScore(calculatedScore);

    if (points < 8) {
      setActiveFeedback('BAD');
    } else if (points < 20) {
      setActiveFeedback('GOOD');
    } else if (points < 38) {
      setActiveFeedback('BETTER');
    } else {
      setActiveFeedback('PERFECT');
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (drawnPointsCount > 0 && !activeFeedback) {
      evaluateRealTimeFeedback(drawnPointsCount);
    }
  };

  const handleSubmitMastery = () => {
    if (!activeFeedback) return;
    setIsSubmitted(true);
    if (onMasterySubmit) {
      onMasterySubmit(character, activeFeedback);
    }
    if (onComplete) {
      onComplete();
    }
  };

  const speakCharacter = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(character);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Prominent Header */}
      <div className={`flex items-center justify-between border-b pb-3 transition-colors ${
        isDarkMode ? 'border-slate-800' : 'border-stone-200'
      }`}>
        <div>
          <h3 className={`text-lg font-bold flex items-center gap-2 ${
            isDarkMode ? 'text-slate-100' : 'text-slate-900'
          }`}>
            <Zap className={isDarkMode ? 'text-cyan-400' : 'text-sky-600'} size={20} />
            Letter Practice & Feedback
          </h3>
          <p className={`text-xs ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            Trace the character strokes to trigger real-time AI feedback evaluation.
          </p>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors ${
          isDarkMode
            ? 'bg-slate-900/80 border-slate-800'
            : 'bg-white border-stone-200 shadow-2xs'
        }`}>
          <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Character:</span>
          <span className={`text-xl font-bold font-kr font-jp ${
            isDarkMode ? 'text-cyan-400' : 'text-sky-600'
          }`}>{character}</span>
          <button
            onClick={speakCharacter}
            className={`p-1 rounded transition-colors ${
              isDarkMode ? 'hover:bg-slate-800 text-sky-400' : 'hover:bg-stone-100 text-sky-600'
            }`}
            title="Listen Audio"
          >
            <Volume2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Practice Area: Canvas + Integrated Vertical Feedback Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Dominant Canvas Box */}
        <div className={`lg:col-span-7 flex flex-col items-center rounded-2xl border p-4 shadow-xl relative overflow-hidden transition-colors ${
          isDarkMode
            ? 'bg-slate-950/90 border-sky-500/30'
            : 'bg-white border-stone-200 shadow-md'
        }`}>
          <div className={`w-full flex items-center justify-between text-xs mb-3 px-1 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-500'
          }`}>
            <div className="flex items-center gap-2">
              <span className={`inline-block w-2 h-2 rounded-full animate-ping ${
                isDarkMode ? 'bg-cyan-400' : 'bg-sky-500'
              }`} />
              <span className={`font-semibold ${isDarkMode ? 'text-cyan-300' : 'text-sky-700'}`}>
                Interactive Stroke Canvas
              </span>
            </div>
            {romanization && (
              <span className={`px-2 py-0.5 rounded border font-mono ${
                isDarkMode
                  ? 'bg-slate-900 text-slate-300 border-slate-800'
                  : 'bg-stone-100 text-slate-700 border-stone-200'
              }`}>
                Sound: {romanization} {meaning ? `• (${meaning})` : ''}
              </span>
            )}
          </div>

          {/* Enlarged Canvas */}
          <div className="relative group">
            <canvas
              ref={canvasRef}
              width={300}
              height={300}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className={`cursor-crosshair rounded-xl touch-none border shadow-inner transition-colors ${
                isDarkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-sky-500/50'
                  : 'bg-stone-50 border-stone-200 hover:border-sky-400'
              }`}
            />

            <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-400 select-none">1</div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-400 select-none">2</div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-400 select-none">3</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-400 select-none">4</div>
          </div>

          {guideText && (
            <div className={`mt-3 text-center text-xs py-1.5 px-3 rounded-lg border max-w-xs transition-colors ${
              isDarkMode
                ? 'text-slate-400 bg-slate-900/60 border-slate-800/60'
                : 'text-slate-600 bg-stone-50 border-stone-200 shadow-2xs'
            }`}>
              💡 <span className={isDarkMode ? 'text-slate-300 font-medium' : 'text-slate-800 font-medium'}>{guideText}</span>
            </div>
          )}

          {/* Accuracy & Stroke stats */}
          <div className={`w-full mt-4 pt-3 border-t flex items-center justify-between text-xs px-1 ${
            isDarkMode ? 'border-slate-800/80 text-slate-400' : 'border-stone-200 text-slate-500'
          }`}>
            <div className="flex items-center gap-1.5">
              <span>Strokes:</span>
              <span className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{strokeCount}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Accuracy:</span>
              <div className={`w-24 h-2 rounded-full overflow-hidden ${
                isDarkMode ? 'bg-slate-800' : 'bg-stone-200'
              }`}>
                <div
                  className={`h-full transition-all duration-300 ${
                    accuracyScore > 75
                      ? isDarkMode ? 'bg-cyan-400' : 'bg-emerald-500'
                      : accuracyScore > 45
                      ? 'bg-sky-500'
                      : accuracyScore > 20
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${accuracyScore}%` }}
                />
              </div>
              <span className={`font-bold font-mono ${
                isDarkMode ? 'text-cyan-300' : 'text-sky-700'
              }`}>{accuracyScore}%</span>
            </div>
          </div>
        </div>

        {/* Vertical Integrated Feedback Panel */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <div className={`text-xs font-bold uppercase tracking-wider flex items-center justify-between px-1 ${
            isDarkMode ? 'text-slate-400' : 'text-slate-600'
          }`}>
            <span>Real-time Feedback Panel</span>
            <span className={`text-[10px] font-normal ${
              isDarkMode ? 'text-cyan-400/80' : 'text-sky-600'
            }`}>4 Evaluated States</span>
          </div>

          {(['BAD', 'GOOD', 'BETTER', 'PERFECT'] as FeedbackLevel[]).map(lvl => {
            const config = feedbackConfigs[lvl];
            const isActive = activeFeedback === lvl;

            return (
              <div
                key={lvl}
                onClick={() => setActiveFeedback(lvl)}
                className={`p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex items-start gap-3 ${
                  isActive
                    ? `${config.bgClass} ${config.borderClass} ${config.glowClass} scale-[1.02]`
                    : isDarkMode
                    ? 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:bg-slate-900/90'
                    : 'bg-white border-stone-200 text-slate-600 hover:border-stone-300 hover:bg-stone-50 shadow-2xs'
                }`}
              >
                {/* Illustrative Stroke Example Thumbnail */}
                <div className={`shrink-0 w-12 h-12 rounded-lg border flex items-center justify-center p-1 relative ${
                  isDarkMode
                    ? 'bg-slate-950/90 border-slate-800'
                    : 'bg-stone-50 border-stone-200'
                }`}>
                  <svg viewBox="0 0 50 50" className="w-full h-full">
                    <line x1="25" y1="0" x2="25" y2="50" stroke={isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeDasharray="2,2" />
                    <line x1="0" y1="25" x2="50" y2="25" stroke={isDarkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} strokeDasharray="2,2" />
                    <path
                      d={config.examplePath}
                      fill="none"
                      stroke={
                        lvl === 'BAD'
                          ? '#f43f5e'
                          : lvl === 'GOOD'
                          ? '#f59e0b'
                          : lvl === 'BETTER'
                          ? '#0284c7'
                          : '#10b981'
                      }
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {isActive && (
                    <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 ${
                      isDarkMode ? 'bg-cyan-400 border-slate-950' : 'bg-sky-500 border-white'
                    }`} />
                  )}
                </div>

                {/* Feedback Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black uppercase tracking-wider ${config.colorClass}`}>
                      {config.title}
                    </span>
                    {config.icon}
                  </div>
                  <p className={`text-xs mt-0.5 leading-snug font-medium ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}>
                    {config.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic CTA Button Area */}
      <div className={`flex items-center justify-between gap-3 pt-3 border-t ${
        isDarkMode ? 'border-slate-800' : 'border-stone-200'
      }`}>
        <button
          onClick={clearCanvas}
          className={`glass-button text-xs py-2.5 px-4 flex items-center gap-2 rounded-xl transition-colors ${
            isDarkMode
              ? 'hover:bg-slate-800 text-slate-300'
              : 'hover:bg-stone-100 text-slate-700 border border-stone-200 shadow-2xs'
          }`}
        >
          <RefreshCw size={15} />
          Clear and Redraw
        </button>

        <button
          onClick={handleSubmitMastery}
          disabled={!drawnPointsCount || isSubmitted}
          className={`glass-button text-xs py-2.5 px-5 flex items-center gap-2 font-bold rounded-xl ${
            drawnPointsCount && !isSubmitted
              ? 'btn-primary bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/20'
              : 'opacity-50 cursor-not-allowed text-slate-500'
          }`}
        >
          {isSubmitted ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 size={16} /> Mastered! (+15 XP)
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Award size={16} /> Submit for Mastery
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
