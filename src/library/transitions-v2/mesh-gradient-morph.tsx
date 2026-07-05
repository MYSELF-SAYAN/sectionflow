'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Mask reveal with drifting mesh nodes.
 *
 * Animated mesh gradient nodes drift across the screen, eroding the outgoing
 * section while a colour-bleeding overlay bridges the two backgrounds. The
 * incoming layer is revealed through a soft composite mask.
 *
 * Shape: mask-reveal (radial mask on the incoming layer) + effect-overlay
 * drifting nodes.
 */
export function MeshGradientMorph({ progress, outgoing, incoming }: TransitionProps) {
  const r = useTransform(progress, [0, 1], [0, 95]);
  const mask = useMotionTemplate`radial-gradient(circle ${r}vmax at 30% 30%, #000 72%, transparent 100%), radial-gradient(circle ${r}vmax at 70% 70%, #000 72%, transparent 100%)`;
  const dim = useTransform(progress, [0, 1], [1, 0.35]);
  const overlayOpacity = useTransform(progress, [0, 0.5, 1], [0, 0.55, 0]);

  outgoing.style.opacity = dim;
  incoming.style.WebkitMaskImage = mask;
  incoming.style.maskImage = mask;

  return (
    <>
      <motion.div
        aria-hidden
        style={{ opacity: overlayOpacity, background: 'linear-gradient(120deg, #f0abfc, #818cf8, #22d3ee)' }}
        className="pointer-events-none absolute inset-0 z-20 mix-blend-screen blur-2xl"
      />
    </>
  );
}
