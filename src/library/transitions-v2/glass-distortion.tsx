'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography with a frosted overlay.
 *
 * A frosted-glass panel slides up from below, creating lenticular refraction
 * across the viewport before dissolving to reveal the incoming layer. The
 * incoming layer rises beneath the glass; the outgoing dims.
 *
 * Shape: layer-choreography (y on incoming) + effect-overlay frosted panel.
 */
export function GlassDistortion({ progress, outgoing, incoming }: TransitionProps) {
  const y = useTransform(progress, [0, 1], ['102%', '0%']);
  const dim = useTransform(progress, [0, 1], [1, 0.5]);
  const glassY = useTransform(progress, [0, 0.6, 1], ['102%', '0%', '-102%']);
  const glassOpacity = useTransform(progress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  outgoing.style.opacity = dim;
  incoming.style.y = y;

  return (
    <motion.div
      aria-hidden
      style={{
        y: glassY,
        opacity: glassOpacity,
        backdropFilter: 'blur(20px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.4)',
        background:
          'linear-gradient(105deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.18))',
      }}
      className="pointer-events-none absolute inset-0 z-20"
    />
  );
}
