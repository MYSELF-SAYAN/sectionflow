'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay page burn.
 *
 * An organic burn frontier sweeps upward from the bottom, simulated by a
 * row of strips that dissolve bottom-to-top with a travelling glow line.
 * Strips are pure geometry overlays; embers drift upward. The outgoing
 * dims while the incoming fades in beneath the ash.
 *
 * Shape: effect-overlay (burning strips + embers + glow line) + minor layer
 * choreography.
 */
const BURN_STRIPS = 24;
const EMBER_COUNT = 40;

function seeded(i: number): number {
  const x = Math.sin((i + 0.4) * 9337.1 + 1999.3) * 71993.7;
  return x - Math.floor(x);
}

export function PageBurn({ progress, outgoing, incoming }: TransitionProps) {
  const secondOpacity = useTransform(progress, [0.05, 0.5, 0.85], [0, 1, 1]);
  outgoing.style.opacity = useTransform(progress, [0, 0.5], [1, 0]);
  incoming.style.opacity = secondOpacity;

  // Glow line sweeps upward
  const glowY = useTransform(progress, [0, 0.8], ['100%', '-100%']);
  const glowOpacity = useTransform(progress, [0, 0.08, 0.8, 0.9], [0, 1, 1, 0]);
  const glowScaleX = useTransform(progress, [0, 0.05], [0.2, 1]);

  // Strips dissolve bottom-to-top
  const strips = Array.from({ length: BURN_STRIPS }, (_, i) => {
    const normalised = i / (BURN_STRIPS - 1); // 0=top, 1=bottom (bottom burns first)
    const burnStart = (1 - normalised) * 0.45 + seeded(i) * 0.03;
    const burnEnd = Math.min(1, burnStart + 0.12);
    const opacity = useTransform(progress, [burnStart, burnEnd], [1, 0]);
    return { i, opacity } as const;
  });

  // Embers
  const embers = Array.from({ length: EMBER_COUNT }, (_, i) => {
    const s = seeded(i);
    const startT = 0.05 + s * 0.25;
    const endT = Math.min(1, startT + 0.25);
    const x = useTransform(progress, [startT, endT], [0, (s - 0.5) * 120]);
    const y = useTransform(progress, [startT, endT], [0, -(60 + s * 120)]);
    const opacity = useTransform(progress, [startT, startT + 0.05, endT], [0, s * 0.5 + 0.3, 0]);
    const size = 2 + s * 4;
    const hue = 20 + s * 30;
    return { i, x, y, opacity, size, hue, left: `${s * 100}%`, bottom: `${s * 60}%` } as const;
  });

  return (
    <>
      {/* Strips */}
      <div className="pointer-events-none absolute inset-0 z-20" style={{ display: 'grid', gridTemplateRows: `repeat(${BURN_STRIPS}, 1fr)` }}>
        {strips.map(({ i, opacity }) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: strip index is stable
            key={i}
            aria-hidden
            className="bg-[#1a0f05]"
            style={{ opacity: opacity as MotionValue<number> }}
          />
        ))}
      </div>
      {/* Glow line */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-30 h-[3px]"
        style={{
          y: glowY as MotionValue<string>,
          opacity: glowOpacity as MotionValue<number>,
          scaleX: glowScaleX as MotionValue<number>,
          transformOrigin: 'center',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,100,0,0.8) 20%, rgba(255,200,0,1) 50%, rgba(255,100,0,0.8) 80%, transparent 100%)',
          boxShadow: '0 0 20px 8px rgba(255,120,0,0.6), 0 0 60px 20px rgba(255,60,0,0.3)',
        }}
      />
      {/* Embers */}
      <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden">
        {embers.map(({ i, x, y, opacity, size, hue, left, bottom }) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: ember index is stable
            key={i}
            aria-hidden
            className="absolute rounded-full"
            style={{
              left,
              bottom,
              width: size,
              height: size,
              x: x as MotionValue<number>,
              y: y as MotionValue<number>,
              opacity: opacity as MotionValue<number>,
              background: `hsl(${hue}, 100%, 60%)`,
              boxShadow: `0 0 ${size * 3}px hsl(${hue}, 100%, 50%)`,
            }}
          />
        ))}
      </div>
    </>
  );
}
