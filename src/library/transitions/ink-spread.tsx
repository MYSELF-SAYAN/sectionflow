'use client';

import { useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Organic mask reveal.
 *
 * Two ink blots spread from offset anchor points and merge to reveal the
 * incoming section; the outgoing section dims behind them.
 *
 * Shape: mask-reveal (radial-gradient mask on the incoming layer).
 */
export function InkSpread({ progress, outgoing, incoming }: TransitionProps) {
  const r1 = useTransform(progress, [0, 1], [0, 130]);
  const r2 = useTransform(progress, [0, 1], [0, 115]);
  const r3 = useTransform(progress, [0, 1], [0, 100]);

  const mask = useMotionTemplate`radial-gradient(circle ${r1}vmax at 28% 32%, #000 72%, transparent 100%), radial-gradient(circle ${r2}vmax at 74% 68%, #000 72%, transparent 100%), radial-gradient(circle ${r3}vmax at 55% 20%, #000 72%, transparent 100%)`;

  const dim = useTransform(progress, [0, 1], [1, 0.5]);

  outgoing.style.opacity = dim;
  incoming.style.WebkitMaskImage = mask;
  incoming.style.maskImage = mask;

  return null;
}
