'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Mask reveal with a travelling glow line.
 *
 * A glowing burn line travels up the screen as an inset clip-path reveals the
 * incoming section from the bottom; the outgoing section dims behind it.
 *
 * Shape: mask-reveal (inset clip-path on the incoming layer) + effect-overlay
 * glow line.
 */
export function GradientBurn({ progress, outgoing, incoming }: TransitionProps) {
  const edge = useTransform(progress, [0, 1], [104, -4]);
  const clipPath = useMotionTemplate`inset(${edge}% 0% 0% 0%)`;
  const lineTop = useMotionTemplate`${edge}%`;
  const glow = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const dim = useTransform(progress, [0, 1], [1, 0.45]);

  outgoing.style.opacity = dim;
  incoming.style.clipPath = clipPath;

  return (
    <motion.div
      aria-hidden
      style={{ top: lineTop, opacity: glow }}
      className="pointer-events-none absolute left-0 right-0 z-20 h-[3px] -translate-y-1/2 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_60px_18px_rgba(251,191,36,0.35)]"
    />
  );
}
