'use client';

import { useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Grid mask reveal.
 *
 * A field of growing dots dissolves the screen to reveal the incoming
 * section. The outgoing section dims behind the dot matrix.
 *
 * Shape: mask-reveal (tiled radial mask on the incoming layer).
 */
export function DotMatrixReveal({
  progress,
  outgoing,
  incoming,
}: TransitionProps) {
  const r = useTransform(progress, [0, 1], [0, 105]);
  const mask = useMotionTemplate`radial-gradient(circle, #000 ${r}%, transparent ${r}%)`;
  const dim = useTransform(progress, [0, 1], [1, 0.4]);

  outgoing.style.opacity = dim;
  incoming.style.WebkitMaskImage = mask;
  incoming.style.maskImage = mask;
  incoming.style.WebkitMaskSize = '72px 72px';
  incoming.style.maskSize = '72px 72px';
  incoming.style.WebkitMaskPosition = 'center';
  incoming.style.maskPosition = 'center';

  return null;
}
