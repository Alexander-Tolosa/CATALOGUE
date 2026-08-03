import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Award, CheckCircle2, XCircle, AlertCircle, Star, Crown, Volume2, Sparkles, Zap } from 'lucide-react';

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
      colorClass: 'text-rose-400',
      bgClass: 'bg-rose-950/40',
      borderClass: 'border-rose-500/50',
      glowClass: 'shadow-[0_0_15px_rgba(244,63,94,0.3)]',
      icon: <XCircle className="text-rose-400" size={20} />,
      examplePath: 'M 10,15 L 40,12 L 20,45 L 35,40'
    },
    GOOD: {
      level: 'GOOD',
      title: 'GOOD',
      subtitle: 'Right direction, improve alignment',
      colorClass: 'text-amber-400',
      bgClass: 'bg-amber-950/40',
      borderClass: 'border-amber-500/50',
      glowClass: 'shadow-[0_0_15px_rgba(245,158,11,0.3)]',
      icon: <AlertCircle className="text-amber-400" size={20} />,
      examplePath: 'M 12,12 L 38,15 L 38,38 L 22,40'
    },
    BETTER: {
      level: 'BETTER',
      title: 'BETTER',
      subtitle: 'Great form! Practice again for speed',
      colorClass: 'text-sky-400',
      bgClass: 'bg-sky-950/40',
      borderClass: 'border-sky-500/50',
      glowClass: 'shadow-[0_0_15px_rgba(56,189,248,0.3)]',
      icon: <CheckCircle2 className="text-sky-400" size={20} />,
      examplePath: 'M 10,12 L 40,12 L 40,40 M 15,26 L 35,26'
    },
    PERFECT: {
      level: 'PERFECT',
      title: 'PERFECT',
      subtitle: 'Flawless! Practice mastery',
      colorClass: 'text-cyan-300',
      bgClass: 'bg-cyan-950/60',
      borderClass: 'border-cyan-400',
      glowClass: 'shadow-[0_0_20px_rgba(34,211,238,0.5)]',
      icon: <Crown className="text-cyan-300 animate-pulse" size={20} />,
      examplePath: 'M 10,10 L 42,10 M 42,10 L 42,42 M 10,26 L 42,26'
    }
  };

  useEffect(() => {
    clearCanvas();
  }, [character]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid guidelines (faint crosshair grid)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6, 6]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    // Diagonal guidelines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.05)';
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
    ctx.fillStyle = 'rgba(255, 255, 255, 0.09)';
    ctx.fillText(character, canvas.width / 2, canvas.height / 2 + 10);

    // Ghosted outline stroke
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';
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
    ctx.strokeStyle = '#38bdf8';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.5)';
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
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Zap className="text-cyan-400" size={20} />
            Letter Practice & Feedback
          </h3>
          <p className="text-xs text-slate-400">
            Trace the character strokes to trigger real-time AI feedback evaluation.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400">Character:</span>
          <span className="text-xl font-bold text-cyan-400 font-kr font-jp">{character}</span>
          <button
            onClick={speakCharacter}
            className="p-1 rounded hover:bg-slate-800 text-sky-400 transition-colors"
            title="Listen Audio"
          >
            <Volume2 size={16} />
          </button>
        </div>
      </div>

      {/* Main Practice Area: Canvas + Integrated Vertical Feedback Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Dominant Canvas Box */}
        <div className="lg:col-span-7 flex flex-col items-center bg-slate-950/90 rounded-2xl border border-sky-500/30 p-4 shadow-xl relative overflow-hidden">
          <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-semibold text-cyan-300">Interactive Stroke Canvas</span>
            </div>
            {romanization && (
              <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-800 font-mono">
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
              className="cursor-crosshair rounded-xl touch-none bg-slate-900/80 border border-slate-800 shadow-inner hover:border-sky-500/50 transition-colors"
            />

            <div className="absolute top-2 left-2 text-[10px] font-mono text-slate-600 select-none">1</div>
            <div className="absolute top-2 right-2 text-[10px] font-mono text-slate-600 select-none">2</div>
            <div className="absolute bottom-2 left-2 text-[10px] font-mono text-slate-600 select-none">3</div>
            <div className="absolute bottom-2 right-2 text-[10px] font-mono text-slate-600 select-none">4</div>
          </div>

          {guideText && (
            <div className="mt-3 text-center text-xs text-slate-400 bg-slate-900/60 py-1.5 px-3 rounded-lg border border-slate-800/60 max-w-xs">
              💡 <span className="text-slate-300 font-medium">{guideText}</span>
            </div>
          )}

          {/* Accuracy & Stroke stats */}
          <div className="w-full mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <span>Strokes:</span>
              <span className="font-bold text-slate-200">{strokeCount}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>Accuracy:</span>
              <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    accuracyScore > 75
                      ? 'bg-cyan-400'
                      : accuracyScore > 45
                      ? 'bg-sky-400'
                      : accuracyScore > 20
                      ? 'bg-amber-400'
                      : 'bg-rose-400'
                  }`}
                  style={{ width: `${accuracyScore}%` }}
                />
              </div>
              <span className="font-bold font-mono text-cyan-300">{accuracyScore}%</span>
            </div>
          </div>
        </div>

        {/* Vertical Integrated Feedback Panel */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between px-1">
            <span>Real-time Feedback Panel</span>
            <span className="text-[10px] text-cyan-400/80 font-normal">4 Evaluated States</span>
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
                    : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:bg-slate-900/90'
                }`}
              >
                {/* Illustrative Stroke Example Thumbnail */}
                <div className="shrink-0 w-12 h-12 rounded-lg bg-slate-950/90 border border-slate-800 flex items-center justify-center p-1 relative">
                  <svg viewBox="0 0 50 50" className="w-full h-full">
                    <line x1="25" y1="0" x2="25" y2="50" stroke="rgba(255,255,255,0.06)" strokeDasharray="2,2" />
                    <line x1="0" y1="25" x2="50" y2="25" stroke="rgba(255,255,255,0.06)" strokeDasharray="2,2" />
                    <path
                      d={config.examplePath}
                      fill="none"
                      stroke={
                        lvl === 'BAD'
                          ? '#f43f5e'
                          : lvl === 'GOOD'
                          ? '#f59e0b'
                          : lvl === 'BETTER'
                          ? '#38bdf8'
                          : '#22d3ee'
                      }
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {isActive && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950" />
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
                  <p className="text-xs text-slate-300 mt-0.5 leading-snug font-medium">
                    {config.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dynamic CTA Button Area */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-800">
        <button
          onClick={clearCanvas}
          className="glass-button text-xs py-2.5 px-4 flex items-center gap-2 hover:bg-slate-800 text-slate-300"
        >
          <RefreshCw size={15} />
          Clear and Redraw
        </button>

        <button
          onClick={handleSubmitMastery}
          disabled={!drawnPointsCount || isSubmitted}
          className={`glass-button text-xs py-2.5 px-5 flex items-center gap-2 font-bold ${
            drawnPointsCount && !isSubmitted
              ? 'btn-primary bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-400 hover:to-cyan-400 text-white shadow-lg shadow-cyan-500/20'
              : 'opacity-50 cursor-not-allowed text-slate-500'
          }`}
        >
          {isSubmitted ? (
            <span className="flex items-center gap-1.5 text-emerald-300">
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
