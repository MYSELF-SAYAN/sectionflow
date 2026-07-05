'use client';

import { useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Pure mask-reveal transition.
 *
 * A soft spotlight mask grows from viewport centre until the incoming section
 * fills the frame; the outgoing section dims behind it.
 *
 * Shape: mask-reveal (radial-gradient mask on the incoming layer).
 */
export function SpotlightReveal({ progress, outgoing, incoming }: TransitionProps) {
  const r = useTransform(progress, [0, 1], [0, 140]);
  const mask = useMotionTemplate`radial-gradient(circle ${r}vmax at 50% 45%, #000 60%, transparent 100%)`;
  const dim = useTransform(progress, [0, 0.95], [1, 0.35]);
  const filter = useMotionTemplate`brightness(${dim})`;

  outgoing.style.filter = filter;
  incoming.style.WebkitMaskImage = mask;
  incoming.style.maskImage = mask;

  return null;
}
