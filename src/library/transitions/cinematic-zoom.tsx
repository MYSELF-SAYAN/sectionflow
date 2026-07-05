'use client';

import { useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography zoom-through.
 *
 * The outgoing layer zooms in and blurs out as if the camera flies through it,
 * while the incoming layer scales up from 0.65 to land crisp at full size.
 *
 * Shape: layer-choreography (scale/opacity/filter on both layers).
 */
export function CinematicZoom({ progress, outgoing, incoming }: TransitionProps) {
  const scale1 = useTransform(progress, [0, 0.6], [1, 9]);
  const o1 = useTransform(progress, [0.4, 0.6], [1, 0]);
  const blur = useTransform(progress, [0.3, 0.6], [0, 16]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const scale2 = useTransform(progress, [0.35, 1], [0.65, 1]);
  const o2 = useTransform(progress, [0.35, 0.55], [0, 1]);

  outgoing.style.scale = scale1;
  outgoing.style.opacity = o1;
  outgoing.style.filter = filter;

  incoming.style.scale = scale2;
  incoming.style.opacity = o2;

  return null;
}
