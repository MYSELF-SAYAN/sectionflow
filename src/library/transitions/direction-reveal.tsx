'use client';

import { motion, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography direction-based reveal.
 *
 * The incoming section slides up with a glowing motion-trail edge line. A
 * subtle skew on entry straightens as the panel lands. The outgoing drifts
 * upward and fades.
 *
 * Shape: layer-choreography (y/skewX/scale/opacity on both layers) +
 * effect-overlay glow trail.
 */
export function DirectionReveal({ progress, outgoing, incoming }: TransitionProps) {
  const secondY = useTransform(progress, [0, 1], ['100%', '0%']);
  const secondSkewX = useTransform(progress, [0, 0.5, 1], [1.5, 0.8, 0]);
  const secondScale = useTransform(progress, [0, 1], [0.96, 1]);
  const firstY = useTransform(progress, [0, 1], ['0%', '-40%']);
  const firstOpacity = useTransform(progress, [0, 0.7], [1, 0]);
  const firstScale = useTransform(progress, [0, 1], [1, 0.92]);
  const trailOpacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 0.8, 0.8, 0]);
  const trailY = useTransform(progress, [0, 1], ['100%', '-5%']);

  outgoing.style.y = firstY;
  outgoing.style.opacity = firstOpacity;
  outgoing.style.scale = firstScale;

  incoming.style.y = secondY;
  incoming.style.skewX = secondSkewX;
  incoming.style.scale = secondScale;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 z-20 h-px"
      style={{
        y: trailY,
        opacity: trailOpacity,
        background:
          'linear-gradient(90deg, transparent, rgba(34,211,238,0.9) 30%, rgba(255,255,255,1) 50%, rgba(34,211,238,0.9) 70%, transparent)',
        boxShadow: '0 0 20px 4px rgba(34,211,238,0.4)',
      }}
    />
  );
}
