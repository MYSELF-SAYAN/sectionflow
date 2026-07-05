'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay tile assembly.
 *
 * The incoming section assembles tile by tile from scattered chaos. Tiles fly
 * in from random off-screen positions to snap into their grid slots. Pure
 * geometry overlays — no content cloning. The incoming layer fades in as
 * tiles converge.
 *
 * Shape: effect-overlay (assembling tiles) + minor layer choreography.
 */
const COLS = 14;
const ROWS = 10;
const TOTAL = COLS * ROWS;

function seeded(i: number): number {
  const x = Math.sin((i + 0.5) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

export function ParticleAssembly({ progress, outgoing, incoming }: TransitionProps) {
  const firstOpacity = useTransform(progress, [0, 0.6], [1, 0]);
  const secondOpacity = useTransform(progress, [0.3, 0.9], [0, 1]);

  outgoing.style.opacity = firstOpacity;
  incoming.style.opacity = secondOpacity;

  const tiles = Array.from({ length: TOTAL }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const cx = col / (COLS - 1);
    const cy = row / (ROWS - 1);
    const dist = Math.sqrt((cx - 0.5) ** 2 + (cy - 0.5) ** 2) / 0.707;
    const s = seeded(i);
    // Tiles near centre arrive first
    const delay = (1 - dist) * 0.3 + s * 0.08;
    const end = Math.min(1, delay + 0.35);
    // Random scatter positions
    const startX = (s - 0.5) * 300;
    const startY = (seeded(i + 100) - 0.5) * 300;

    const x = useTransform(progress, [delay, end], [startX, 0]);
    const y = useTransform(progress, [delay, end], [startY, 0]);
    const opacity = useTransform(progress, [delay, delay + 0.05, end], [0, 1, 1]);
    const scale = useTransform(progress, [delay, end], [0.5, 1]);

    return {
      i, x, y, opacity, scale,
      left: `${(col / COLS) * 100}%`,
      top: `${(row / ROWS) * 100}%`,
      width: `${100 / COLS}%`,
      height: `${100 / ROWS}%`,
    } as const;
  });

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {tiles.map((t) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: tile index is stable
          key={t.i}
          aria-hidden
          style={{
            left: t.left,
            top: t.top,
            width: t.width,
            height: t.height,
            x: t.x as MotionValue<number>,
            y: t.y as MotionValue<number>,
            opacity: t.opacity as MotionValue<number>,
            scale: t.scale as MotionValue<number>,
            background: 'rgba(34,211,238,0.08)',
            boxShadow: 'inset 0 0 1px rgba(255,255,255,0.04)',
          }}
          className="absolute"
        />
      ))}
    </div>
  );
}
