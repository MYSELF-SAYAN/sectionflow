'use client';

import { useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography progressive morph.
 *
 * Horizontal bands dissolve progressively from top to bottom while the
 * incoming section slides in from the right. A pulsing outline frame marks
 * the morphing boundary. The outgoing fades and drifts; the incoming enters
 * with a subtle scale-up.
 *
 * Shape: layer-choreography (y/opacity/scale on both layers).
 */
export function ProgressiveMorph({ progress, outgoing, incoming }: TransitionProps) {
  const outY = useTransform(progress, [0, 1], ['0%', '-20%']);
  const outOpacity = useTransform(progress, [0, 0.65], [1, 0]);
  const inY = useTransform(progress, [0, 1], ['8%', '0%']);
  const inScale = useTransform(progress, [0, 1], [0.98, 1]);
  const inOpacity = useTransform(progress, [0.1, 0.55], [0, 1]);

  outgoing.style.y = outY;
  outgoing.style.opacity = outOpacity;

  incoming.style.y = inY;
  incoming.style.scale = inScale;
  incoming.style.opacity = inOpacity;
  incoming.style.border = '2px solid rgba(34,211,238,0.15)';

  return null;
}
