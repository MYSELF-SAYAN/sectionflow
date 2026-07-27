'use client';

import { useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Elastic Stretch Transition
 * 
 * The page behaves like rubber—stretching, wobbling, snapping, and rebounding into the next section.
 * - Outgoing: Anticipates by squishing down slightly, then stretches up aggressively.
 * - Incoming: Takes over mid-stretch, overshoots into a squish, and wobbles back to resting state.
 */
export function ElasticStretch({ progress, outgoing, incoming }: TransitionProps) {
  // Outgoing animation: 0 -> 0.5
  // Squish down (anticipation) then stretch up (release)
  const outScaleY = useTransform(progress, [0, 0.15, 0.5], [1, 0.9, 1.6]);
  const outScaleX = useTransform(progress, [0, 0.15, 0.5], [1, 1.05, 0.8]);
  const outY = useTransform(progress, [0, 0.15, 0.5], ['0%', '5%', '-40%']);
  const outOpacity = useTransform(progress, [0, 0.45, 0.5], [1, 1, 0]);
  
  // Incoming animation: 0.5 -> 1
  // Start stretched, overshoot squish, settle
  const inScaleY = useTransform(progress, [0.5, 0.7, 0.85, 1], [1.6, 0.9, 1.05, 1]);
  const inScaleX = useTransform(progress, [0.5, 0.7, 0.85, 1], [0.8, 1.1, 0.98, 1]);
  const inY = useTransform(progress, [0.5, 0.7, 0.85, 1], ['40%', '-5%', '2%', '0%']);
  const inOpacity = useTransform(progress, [0.5, 0.55, 1], [0, 1, 1]);

  outgoing.style.scaleY = outScaleY;
  outgoing.style.scaleX = outScaleX;
  outgoing.style.y = outY;
  outgoing.style.opacity = outOpacity;
  outgoing.style.transformOrigin = 'center center';

  incoming.style.scaleY = inScaleY;
  incoming.style.scaleX = inScaleX;
  incoming.style.y = inY;
  incoming.style.opacity = inOpacity;
  incoming.style.transformOrigin = 'center center';

  return null;
}
