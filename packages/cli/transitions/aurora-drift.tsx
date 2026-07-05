'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay aurora borealis.
 *
 * Flowing aurora-like curtains of iridescent light sweep across the viewport,
 * dissolving the outgoing section into shifting waves before the next scene
 * crystallises beneath. Pure geometry overlay.
 *
 * Shape: effect-overlay (aurora curtains) + minor layer choreography.
 */
const AURORA_BANDS = 6;

function seeded(i: number): number {
  const x = Math.sin((i + 0.5) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

export function AuroraDrift({ progress, outgoing, incoming }: TransitionProps) {
  const firstOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  const secondOpacity = useTransform(progress, [0.4, 0.9], [0, 1]);

  outgoing.style.opacity = firstOpacity;
  incoming.style.opacity = secondOpacity;

  const bands = Array.from({ length: AURORA_BANDS }, (_, i) => {
    const s = seeded(i);
    const hue = 120 + i * 40 + s * 30; // green → violet
    const delay = s * 0.15;
    const x = useTransform(progress, [delay, 1], ['-30%', '30%']);
    const opacity = useTransform(progress, [delay, delay + 0.15, 0.85, 1], [0, 0.4 + s * 0.2, 0.4 + s * 0.2, 0]);
    const scaleY = useTransform(progress, [delay, Math.min(1, delay + 0.5)], [0.3, 1]);
    const skewX = useTransform(progress, [delay, Math.min(1, delay + 0.5)], [(s - 0.5) * 10, 0]);
    return { i, hue, x, opacity, scaleY, skewX, top: `${15 + i * 12}%` } as const;
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {bands.map(({ i, hue, x, opacity, scaleY, skewX, top }) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: band index is stable
          key={i}
          aria-hidden
          className="absolute left-[-30%] w-[160%]"
          style={{
            top,
            height: '30%',
            x: x as MotionValue<string>,
            opacity: opacity as MotionValue<number>,
            scaleY: scaleY as MotionValue<number>,
            skewX: skewX as MotionValue<number>,
            background: `linear-gradient(180deg, transparent, hsla(${hue}, 70%, 50%, 0.3) 30%, hsla(${hue}, 80%, 60%, 0.5) 50%, hsla(${hue}, 70%, 50%, 0.3) 70%, transparent)`,
            filter: `blur(${12 + seeded(i) * 16}px)`,
          }}
        />
      ))}
    </div>
  );
}
