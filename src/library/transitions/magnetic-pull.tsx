'use client';

import { useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography magnetic pull.
 *
 * Sections are treated as polar magnets. The outgoing repels away and the
 * incoming snaps into place with elastic physics — like two charged plates
 * meeting across the viewport. The incoming bounces past its rest position
 * and settles, creating an elastic overshoot feel.
 *
 * Shape: layer-choreography (y/scale/opacity on both layers, spring-driven).
 */
export function MagneticPull({ progress, outgoing, incoming }: TransitionProps) {
  // Outgoing repels upward
  const outY = useTransform(progress, [0, 0.7], ['0%', '-45%']);
  const outOpacity = useTransform(progress, [0, 0.65], [1, 0]);
  const outScale = useTransform(progress, [0, 0.7], [1, 0.88]);

  // Incoming snaps up with elastic bounce
  const inY = useTransform(progress, [0.2, 1], ['105%', '0%']);
  const inScale = useTransform(progress, [0.2, 0.7, 0.85, 1], [0.92, 1.02, 0.99, 1]);
  const inOpacity = useTransform(progress, [0.2, 0.55], [0, 1]);

  outgoing.style.y = outY;
  outgoing.style.opacity = outOpacity;
  outgoing.style.scale = outScale;

  incoming.style.y = inY;
  incoming.style.scale = inScale;
  incoming.style.opacity = inOpacity;

  return null;
}
