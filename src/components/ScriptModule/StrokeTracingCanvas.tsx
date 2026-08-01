import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Check } from 'lucide-react';

interface StrokeTracingCanvasProps {
  character: string;
  guideText?: string;
  onComplete?: () => void;
}

export const StrokeTracingCanvas: React.FC<StrokeTracingCanvasProps> = ({
  character,
  guideText,
  onComplete
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    clearCanvas();
  }, [character]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw faint background guide character
    ctx.font = '110px "Noto Sans KR", "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.fillText(character, canvas.width / 2, canvas.height / 2);

    // Grid guidelines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.1)';
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();

    ctx.setLineDash([]);
    setHasDrawn(false);
    setIsSubmitted(false);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 12;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#38bdf8';

    setIsDrawing(true);
    setHasDrawn(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const handleVerify = () => {
    setIsSubmitted(true);
    if (onComplete) onComplete();
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative bg-slate-950/80 rounded-2xl border border-sky-500/30 p-2 shadow-inner">
        <canvas
          ref={canvasRef}
          width={240}
          height={240}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="cursor-crosshair rounded-xl touch-none"
        />

        {guideText && (
          <div className="text-center text-xs text-sky-300/80 mt-1 font-medium">
            💡 {guideText}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={clearCanvas}
          className="glass-button text-xs py-2 px-3 hover:bg-slate-800"
          title="Clear Canvas"
        >
          <RefreshCw size={14} /> Clear
        </button>

        <button
          onClick={handleVerify}
          disabled={!hasDrawn || isSubmitted}
          className={`glass-button text-xs py-2 px-4 ${
            hasDrawn && !isSubmitted
              ? 'btn-primary'
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          {isSubmitted ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <Check size={14} /> Verified!
            </span>
          ) : (
            'Check Tracing'
          )}
        </button>
      </div>
    </div>
  );
};
