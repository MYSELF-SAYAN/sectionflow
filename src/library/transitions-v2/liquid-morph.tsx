'use client';

import { useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Organic mask reveal (V1 Exact Timings).
 *
 * Four ink-like blobs grow from specific staggered coordinates and merge 
 * to flood the viewport, revealing the incoming section. The outgoing 
 * section scales up slightly and fades into the background.
 *
 * Mapped Timeline:
 * 0.25 - 0.72: Outgoing fades to 0.
 * 0.25 - 0.80: Outgoing scales up (1 to 1.06).
 * 0.25 - 0.85: Staggered radial gradients expand to reveal the incoming layer.
 */
export function LiquidMorph({ progress, outgoing, incoming }: TransitionProps) {
  // V1 Exact Timings & Radii
  const b1r = useTransform(progress, [0.25, 0.72], [0, 160]);
  const b2r = useTransform(progress, [0.30, 0.76], [0, 140]);
  const b3r = useTransform(progress, [0.35, 0.80], [0, 130]);
  const b4r = useTransform(progress, [0.40, 0.85], [0, 110]);

  // V1 Exact Gradient Coordinates
  const mask = useMotionTemplate`
    radial-gradient(circle ${b1r}vmax at 18% 88%, #000 65%, transparent 100%),
    radial-gradient(circle ${b2r}vmax at 82% 12%, #000 65%, transparent 100%),
    radial-gradient(circle ${b3r}vmax at 50% 50%, #000 65%, transparent 100%),
    radial-gradient(circle ${b4r}vmax at 28% 18%, #000 65%, transparent 100%)
  `;

  // V1 Exact Outgoing Physics
  const dim = useTransform(progress, [0.25, 0.72], [1, 0]);
  const firstScale = useTransform(progress, [0.25, 0.80], [1, 1.06]);

  // Apply to Outgoing
  outgoing.style.opacity = dim;
  outgoing.style.scale = firstScale;

  // Apply to Incoming
  incoming.style.WebkitMaskImage = mask;
  incoming.style.maskImage = mask;

  // Pure layer choreography, no extra overlays needed
  return null;
}