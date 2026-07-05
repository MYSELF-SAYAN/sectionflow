'use client';

import { useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography parallax shift.
 *
 * Sections cross at different scroll speeds for a deep parallax feel. The
 * outgoing layer drifts upward and fades while the incoming rises from below.
 *
 * Shape: layer-choreography (y/opacity on both layers).
 */
export function ParallaxShift({ progress, outgoing, incoming }: TransitionProps) {
  const y1 = useTransform(progress, [0, 1], ['0%', '-30%']);
  const dim = useTransform(progress, [0, 1], [1, 0.3]);
  const y2 = useTransform(progress, [0, 1], ['100%', '0%']);

  outgoing.style.y = y1;
  outgoing.style.opacity = dim;

  incoming.style.y = y2;
  incoming.style.boxShadow = '0 -30px 80px rgba(0,0,0,0.4)';

  return null;
}
