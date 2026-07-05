'use client';

import { useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography zoom-fade.
 *
 * The outgoing layer zooms in and dissolves while the incoming layer scales
 * down from 1.1 and rises into place.
 *
 * Shape: layer-choreography (scale/opacity/y on both layers).
 */
export function ZoomFade({ progress, outgoing, incoming }: TransitionProps) {
  const scale1 = useTransform(progress, [0, 0.85], [1, 1.35]);
  const o1 = useTransform(progress, [0.5, 0.85], [1, 0]);
  const scale2 = useTransform(progress, [0.45, 1], [1.1, 1]);
  const o2 = useTransform(progress, [0.45, 0.85], [0, 1]);
  const y2 = useTransform(progress, [0.45, 1], ['10%', '0%']);

  outgoing.style.scale = scale1;
  outgoing.style.opacity = o1;

  incoming.style.scale = scale2;
  incoming.style.opacity = o2;
  incoming.style.y = y2;

  return null;
}
