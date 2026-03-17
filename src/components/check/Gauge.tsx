'use client';

import { useEffect, useState } from 'react';

interface GaugeProps {
  score: number; // 0-100
  size?: number;
  strokeWidth?: number;
  label?: string;
}

function getColor(score: number): string {
  if (score <= 20) return '#00ff88';       // neon green — blue ocean
  if (score <= 40) return '#00e5ff';       // cyan
  if (score <= 60) return '#00b4ff';       // accent blue
  if (score <= 80) return '#ffaa00';       // amber
  return '#ff3366';                         // danger red — crowded
}

export function Gauge({ score, size = 180, strokeWidth = 8, label }: GaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (animatedScore / 100) * circumference;
  const color = getColor(animatedScore);

  useEffect(() => {
    // Animate from 0 to score
    let frame: number;
    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="-rotate-90"
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border, #1a1a28)"
          strokeWidth={strokeWidth}
        />
        {/* Animated fill */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{
            transition: 'stroke 0.3s ease',
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span
          className="font-mono text-4xl font-bold tabular-nums"
          style={{ color }}
        >
          {animatedScore}
        </span>
        {label && (
          <span className="font-mono text-[11px] uppercase tracking-wider text-txt-dim mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
