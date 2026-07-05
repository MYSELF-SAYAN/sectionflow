'use client';

import { useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography fold (V1 Timing Edition).
 *
 * The incoming layer unfolds downward like a hinged panel with real shading,
 * rotating from -78° to flat while brightening; the outgoing layer dims and
 * settles back beneath it.
 *
 * Mapped Timeline:
 * 0.00 - 0.25: Dead zone (Next section is completely hidden).
 * 0.25 - 0.75: Incoming folds down and brightens.
 * 0.25 - 0.72: Outgoing scales down and dims.
 */
export function FoldReveal({ progress, outgoing, incoming }: TransitionProps) {
  // V1 Exact Timings
  const rx = useTransform(progress, [0.25, 0.75], [-78, 0]);
  const shade = useTransform(progress, [0.25, 0.75], [0.3, 1]);
  const filter = useMotionTemplate`brightness(${shade})`;
  
  const dimFirst = useTransform(progress, [0.25, 0.72], [1, 0.45]);
  const scaleFirst = useTransform(progress, [0.25, 0.75], [1, 0.94]);

  // FIX: Ensure the fold remains completely invisible during the initial scroll dead zone
  const incomingOpacity = useTransform(progress, [0, 0.249, 0.25], [0, 0, 1]);

  // Apply to Outgoing
  outgoing.style.opacity = dimFirst;
  outgoing.style.scale = scaleFirst;

  // Apply to Incoming
  incoming.style.opacity = incomingOpacity;
  incoming.style.rotateX = rx;
  incoming.style.filter = filter;
  incoming.style.transformOrigin = 'center top';
  incoming.style.transformPerspective = 1600; // Directly applies 3D depth in Framer Motion
  incoming.style.boxShadow = '0 60px 120px rgba(0,0,0,0.5)';

  return null;
}