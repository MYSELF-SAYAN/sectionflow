'use client';

import { useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Grid mask reveal.
 *
 * Vertical blinds open strip by strip to expose the incoming section. The
 * incoming layer is revealed through a repeating-linear-gradient mask; the
 * outgoing dims behind it.
 *
 * Shape: mask-reveal (repeating-gradient mask on the incoming layer).
 */
export function BlindsReveal({ progress, outgoing, incoming }: TransitionProps) {
  const s = useTransform(progress, [0, 1], [0, 12.6]);
  const mask = useMotionTemplate`repeating-linear-gradient(90deg, #000 0%, #000 ${s}%, transparent ${s}%, transparent 12.5%)`;
  const dim = useTransform(progress, [0, 0.95], [1, 0.4]);
  const drift = useTransform(progress, [0, 1], ['2%', '0%']);

  outgoing.style.opacity = dim;
  incoming.style.WebkitMaskImage = mask;
  incoming.style.maskImage = mask;
  incoming.style.x = drift;

  return null;
}
