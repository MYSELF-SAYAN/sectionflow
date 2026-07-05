'use client';

import { useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography hero morph.
 *
 * The incoming layer morphs outward from a small rounded card at centre into a
 * full-bleed panel (corners softening then sharpening), while the outgoing
 * layer scales down, blurs, and fades.
 *
 * Shape: layer-choreography (scale/borderRadius on incoming, scale/opacity on
 * outgoing).
 */
export function HeroMorph({ progress, outgoing, incoming }: TransitionProps) {
  // Incoming layer transformations
  const heroScale = useTransform(progress, [0, 1], [0.12, 1]);
  const heroBorderRadius = useTransform(progress, [0, 0.85], [32, 0]);
  const borderRadius = useMotionTemplate`${heroBorderRadius}px`;
  const secondOpacity = useTransform(progress, [0.1, 0.6], [0, 1]);

  // Outgoing layer transformations
  const firstScale = useTransform(progress, [0, 1], [1, 0.88]);
  const firstOpacity = useTransform(progress, [0, 0.7], [1, 0]);
  const firstBlur = useTransform(progress, [0.25, 0.7], [0, 12]);
  const firstFilter = useMotionTemplate`blur(${firstBlur}px)`;

  // Apply to Outgoing
  outgoing.style.scale = firstScale;
  outgoing.style.opacity = firstOpacity;
  outgoing.style.filter = firstFilter;

  // Apply to Incoming
  incoming.style.scale = heroScale;
  incoming.style.borderRadius = borderRadius;
  incoming.style.opacity = secondOpacity;
  incoming.style.boxShadow = '0 40px 120px rgba(0,0,0,0.6)';

  // No overlay needed anymore, so we return null
  return null;
}