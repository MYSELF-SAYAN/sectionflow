'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay neon corridor flythrough.
 *
 * The camera flies down a neon-lit corridor of receding frames that narrow to
 * a point before detonating into the next full-screen section — a cyberpunk
 * flythrough. The frames are pure geometric overlays with neon borders; the
 * outgoing dims as the corridor takes over, and the incoming blooms in.
 *
 * Shape: effect-overlay (neon-bordered frames above the two layers) + minor
 * layer choreography (opacity on both layers).
 */
const FRAMES = 10;

export function NeonCorridor({ progress, outgoing, incoming }: TransitionProps) {
  const firstOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  const secondOpacity = useTransform(progress, [0.6, 1], [0, 1]);
  const corridorScale = useTransform(progress, [0.8, 1], [0.85, 1.2]);
  const corridorOpacity = useTransform(progress, [0.8, 1], [1, 0]);

  outgoing.style.opacity = firstOpacity;
  incoming.style.opacity = secondOpacity;

  const frames = Array.from({ length: FRAMES }, (_, i) => {
    const norm = i / (FRAMES - 1);
    const startScale = 1 - norm * 0.85;
    const delay = norm * 0.25;
    const hue = 280 + norm * 60; // violet → cyan
    const scale = useTransform(progress, [delay, Math.min(1, delay + 0.3)], [startScale, 0.05]);
    const opacity = useTransform(progress, [delay, delay + 0.06, Math.min(1, delay + 0.3)], [0, 0.9, 0]);
    return { i, scale, opacity, hue } as const;
  });

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      style={{ scale: corridorScale, opacity: corridorOpacity }}
    >
      {frames.map((f) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: frame index is stable
          key={f.i}
          style={{
            scale: f.scale as MotionValue<number>,
            opacity: f.opacity as MotionValue<number>,
            border: `2px solid hsla(${f.hue}, 100%, 65%, 0.6)`,
            boxShadow: `0 0 20px hsla(${f.hue}, 100%, 60%, 0.3), inset 0 0 20px hsla(${f.hue}, 100%, 60%, 0.15)`,
          }}
          className="absolute inset-4 overflow-hidden rounded-sm"
        />
      ))}
    </motion.div>
  );
}
