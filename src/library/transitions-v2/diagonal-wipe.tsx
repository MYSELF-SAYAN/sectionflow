'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Mask reveal with an overlay seam.
 *
 * A slanted mask wipes across the viewport with a clean angled seam. The
 * incoming layer is revealed via clip-path; the outgoing layer drifts
 * laterally. The glowing seam is an overlay owned by this transition.
 *
 * Shape: mask-reveal (clip-path on the incoming layer) + effect-overlay seam.
 */
export function DynamicMaskReveal({ progress, outgoing, incoming }: TransitionProps) {
  const xTop = useTransform(progress, [0, 1], [0, 135]);
  const xBottom = useTransform(xTop, (v) => v - 30);
  const clipPath = useMotionTemplate`polygon(0% 0%, ${xTop}% 0%, ${xBottom}% 100%, 0% 100%)`;
  const firstX = useTransform(progress, [0, 1], ['0%', '12%']);
  const seamX = useMotionTemplate`${xBottom}%`;
  const seamOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  outgoing.style.x = firstX;
  incoming.style.clipPath = clipPath;

  return (
    <motion.div
      aria-hidden
      style={{ left: seamX, opacity: seamOpacity }}
      className="pointer-events-none absolute top-0 z-20 h-full w-[2px] -skew-x-[16deg] bg-white/70 shadow-[0_0_40px_8px_rgba(255,255,255,0.35)]"
    />
  );
}
