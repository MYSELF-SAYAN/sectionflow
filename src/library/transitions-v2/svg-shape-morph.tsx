'use client';

import { motion, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — SvgShapeMorph
 *
 * A clip-path mask morphs through a sequence of shapes — invisible dot → diamond 
 * → starburst → hexagonal shield → full rectangle — progressively revealing the incoming
 * section. The outgoing section dims behind the morph.
 *
 * All shapes have been standardized to exactly 10 coordinate points. 
 * This ensures Framer Motion's string interpolator can smoothly tween every 
 * vertex without snapping or breaking the SVG topology.
 */
const SHAPES = [
  // 0: Invisible dot at dead center
  'polygon(50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%, 50% 50%)',
  
  // 1: Tiny diamond (mapped to 10 points for interpolation stability)
  'polygon(50% 45%, 52.5% 47.5%, 55% 50%, 53.3% 51.6%, 51.6% 53.3%, 50% 55%, 47.5% 52.5%, 45% 50%, 46.6% 48.3%, 48.3% 46.6%)',
  
  // 2: Starburst (original 10-point shape)
  'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  
  // 3: Hexagonal Shield (mapped from 6 to 10 points)
  'polygon(50% 0%, 75% 12.5%, 100% 25%, 100% 50%, 100% 75%, 50% 100%, 0% 75%, 0% 50%, 0% 25%, 25% 12.5%)',
  
  // 4: Full Screen Rectangle (mapped from 4 to 10 points)
  'polygon(50% 0%, 100% 0%, 100% 50%, 100% 75%, 100% 100%, 50% 100%, 0% 100%, 0% 50%, 0% 0%, 25% 0%)',
] as const;

export function SvgShapeMorph({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * 1. Shape Morphing (Incoming Section Mask)
   */
  // Distributed evenly across the active phase [0.30 -> 1.00] 
  const clipPath = useTransform(
    progress,
    [0, 0.30, 0.53, 0.76, 1],
    [...SHAPES]
  );
  incoming.style.clipPath = clipPath;

  /*
   * 2. Outgoing Dimming
   */
  // Matches V1: fades out from 1 to 0 between progress 0.30 and 0.54
  outgoing.style.opacity = useTransform(
    progress,
    [0, 0.30, 0.54, 1],
    [1, 1, 0, 0]
  );

  /*
   * 3. Glow Border Outline
   */
  // Matches V1: fades in at 0.31 -> 0.39, then fades out at 0.80 -> 0.92
  const glowOpacity = useTransform(
    progress,
    [0, 0.31, 0.39, 0.80, 0.92, 1],
    [0, 0, 1, 1, 0, 0]
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-10 will-change-[clip-path]"
      style={{
        clipPath,
        opacity: glowOpacity,
        // Using the exact V1 box-shadow configuration
        boxShadow: 'inset 0 0 0 2px rgba(34,211,238,0.8), 0 0 30px rgba(34,211,238,0.4)',
      }}
    />
  );
}