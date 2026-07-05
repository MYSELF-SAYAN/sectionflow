'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay prism refraction.
 *
 * A virtual prism splits light into seven spectral bands that fan outward
 * across the viewport, sweeping the incoming section into view. The bands
 * are pure geometry overlays; the outgoing dims while the incoming fades in.
 *
 * Shape: effect-overlay (spectral bands) + minor layer choreography.
 */
const BANDS = 7;
const COLORS = [
  'hsl(0, 90%, 60%)',    // red
  'hsl(30, 90%, 55%)',   // orange
  'hsl(55, 90%, 55%)',   // yellow
  'hsl(120, 70%, 50%)',  // green
  'hsl(200, 80%, 55%)',  // cyan-blue
  'hsl(240, 80%, 60%)',  // blue
  'hsl(280, 70%, 60%)',  // violet
];

export function PrismRefraction({ progress, outgoing, incoming }: TransitionProps) {
  const firstOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  const secondOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);

  outgoing.style.opacity = firstOpacity;
  incoming.style.opacity = secondOpacity;

  const bands = Array.from({ length: BANDS }, (_, i) => {
    const delay = i * 0.06;
    const skewX = useTransform(progress, [delay, Math.min(1, delay + 0.5)], [(i - 3) * 8, 0]);
    const opacity = useTransform(progress, [delay, delay + 0.08, Math.min(1, delay + 0.5), Math.min(1, delay + 0.6)], [0, 0.35, 0.35, 0]);
    return { i, delay, skewX, opacity, color: COLORS[i] } as const;
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {bands.map(({ i, skewX, opacity, color }) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: band index is stable
          key={i}
          aria-hidden
          className="absolute inset-y-0"
          style={{
            left: `${(i / BANDS) * 100}%`,
            width: `${100 / BANDS}%`,
            skewX: skewX as MotionValue<number>,
            opacity: opacity as MotionValue<number>,
            background: color,
            mixBlendMode: 'screen',
          }}
        />
      ))}
    </div>
  );
}
