'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay pixel melt.
 *
 * The outgoing section melts downward column by column in a staggered
 * left-to-right cascade. Each column drops at a slightly different speed.
 * Columns are pure geometry overlays; the incoming fades in beneath.
 *
 * Shape: effect-overlay (melting columns) + minor layer choreography.
 */
const MELT_COLS = 32;

function seeded(i: number): number {
  const x = Math.sin((i + 0.6) * 6173.9 + 2311.1) * 83221.7;
  return x - Math.floor(x);
}

export function PixelMelt({ progress, outgoing, incoming }: TransitionProps) {
  const secondOpacity = useTransform(progress, [0.05, 0.4, 0.85], [0, 1, 1]);
  outgoing.style.opacity = useTransform(progress, [0, 0.5], [1, 0]);
  incoming.style.opacity = secondOpacity;

  const cols = Array.from({ length: MELT_COLS }, (_, i) => {
    const norm = i / (MELT_COLS - 1);
    const delay = norm * 0.28 + seeded(i) * 0.04;
    const dropY = 110 + seeded(i + 200) * 20;
    const end = Math.min(1, delay + 0.18 + seeded(i + 100) * 0.06);
    const y = useTransform(progress, [delay, end], ['0%', `${dropY}%`]);
    const opacity = useTransform(progress, [delay, end], [1, 0]);
    return { i, y, opacity } as const;
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-20" style={{ display: 'grid', gridTemplateColumns: `repeat(${MELT_COLS}, 1fr)` }}>
      {cols.map(({ i, y, opacity }) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: column index is stable
          key={i}
          aria-hidden
          className="bg-[#0e0e11]"
          style={{
            y: y as MotionValue<string>,
            opacity: opacity as MotionValue<number>,
          }}
        />
      ))}
    </div>
  );
}
