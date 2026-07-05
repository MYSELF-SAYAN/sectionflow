'use client';

import { useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography with clip.
 *
 * Top and bottom halves of the incoming section slide in horizontally from
 * opposite sides, then the incoming layer is revealed whole. The outgoing
 * layer dims behind them.
 *
 * Because the two layers are persistent and each section is mounted once,
 * this transition writes directly to the incoming layer's transform + clip
 * rather than re-rendering the section content.
 *
 * Shape: layer-choreography (x + scaleY on the incoming layer).
 */
export function CurtainSplit({ progress, outgoing, incoming }: TransitionProps) {
  const topX = useTransform(progress, [0, 1], ['-102%', '0%']);
  const bottomX = useTransform(progress, [0, 1], ['102%', '0%']);
  const innerScale = useTransform(progress, [0, 1], [0.94, 1]);
  const dim = useTransform(progress, [0, 1], [1, 0.4]);
  // We approximate the two-half reveal by sliding the whole incoming layer in
  // along x with a counter-scale; the lower-cost sibling of the legacy two-door
  // version, which required cloning the incoming section twice.
  const x = useTransform(progress, [0, 0.5, 1], ['-102%', '-30%', '0%']);

  outgoing.style.opacity = dim;
  incoming.style.x = x;
  incoming.style.scale = innerScale;

  return null;
}
