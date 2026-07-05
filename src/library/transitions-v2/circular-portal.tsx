'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Pure mask-reveal transition.
 *
 * The incoming section blooms out of a circular portal at viewport centre,
 * while the outgoing section scales back gently. Pure effect: this transition
 * writes only into the layer handles it receives; it owns no section content.
 *
 * Shape: mask-reveal (ClipPath on the incoming layer).
 */
export function CircularPortal({
  progress,
  outgoing,
  incoming,
}: TransitionProps) {
  const radius = useTransform(progress, [0, 1], [0, 150]);
  const clipPath = useMotionTemplate`circle(${radius}% at 50% 50%)`;

  const outScale = useTransform(progress, [0, 1], [1, 1.18]);
  const inScale = useTransform(progress, [0, 1], [1.15, 1]);

  outgoing.style.scale = outScale;
  incoming.style.clipPath = clipPath;
  // Counter-scale the incoming content so it lands crisp.
  incoming.style.scale = inScale;

  return null;
}
