import React, { useRef, useEffect } from 'react';

interface TransparentVideoProps {
  src: string;
  className?: string;
  size?: number;
  bgThreshold?: number; // Distance threshold for grey background removal
}

export const TransparentVideo: React.FC<TransparentVideoProps> = ({
  src,
  className = '',
  size = 400,
  bgThreshold = 35
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = size;
    canvas.height = size;

    const render = () => {
      if (video.readyState >= 2 && !video.paused && !video.ended) {
        const vw = video.videoWidth || 720;
        const vh = video.videoHeight || 405;

        // Crop center area around the cat mascot so it's much bigger
        const cropW = vw * 0.55;
        const cropH = vh * 0.85;
        const cropX = (vw - cropW) / 2;
        const cropY = (vh - cropH) / 2;

        ctx.clearRect(0, 0, size, size);
        ctx.drawImage(video, cropX, cropY, cropW, cropH, 0, 0, size, size);

        const frame = ctx.getImageData(0, 0, size, size);
        const data = frame.data;
        const len = data.length / 4;

        // Sample background color from top-left pixel
        const bgR = data[0];
        const bgG = data[1];
        const bgB = data[2];

        for (let i = 0; i < len; i++) {
          const r = data[i * 4 + 0];
          const g = data[i * 4 + 1];
          const b = data[i * 4 + 2];

          // Calculate color difference from background sample or light grey check
          const dist = Math.hypot(r - bgR, g - bgG, b - bgB);
          const isLightGrey = r > 185 && g > 185 && b > 185 && Math.abs(r - g) < 20 && Math.abs(g - b) < 20;

          if (dist < bgThreshold || isLightGrey) {
            // Soft alpha edge feathering for smooth anti-aliased edges
            const alphaRatio = Math.max(0, Math.min(1, (dist - 15) / (bgThreshold - 15)));
            data[i * 4 + 3] = isLightGrey ? Math.floor(alphaRatio * 255) : 0;
          }
        }

        ctx.putImageData(frame, 0, 0);
      }
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [size, bgThreshold]);

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Hidden Source Video Element */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        crossOrigin="anonymous"
        className="hidden"
      />
      {/* Real-time Transparent Chroma Canvas */}
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="w-full h-full object-contain pointer-events-none drop-shadow-xl"
      />
    </div>
  );
};
