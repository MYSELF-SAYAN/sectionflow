'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Mask reveal with an iris portal overlay.
 *
 * A glowing iris portal opens from a central point, expanding via a circular
 * clip-path to reveal the incoming layer. A spinning ring and central glow
 * accent the portal opening. The outgoing dims as the iris engulfs the frame.
 *
 * Shape: mask-reveal (circle clip-path on the incoming layer) + effect-overlay
 * glow + ring.
 */
export function DynamicPortal({ progress, outgoing, incoming }: TransitionProps) {
  // Glow appears first
  const glowOpacity = useTransform(progress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);
  const glowScale = useTransform(progress, [0, 0.15], [0, 1]);

  // Spinning ring
  const ringScale = useTransform(progress, [0.05, 1], [0.05, 1.4]);
  const ringRotation = useTransform(progress, [0.05, 1], [-90, 30]);
  const ringOpacity = useTransform(progress, [0.05, 0.7, 1], [0.8, 0.8, 0]);

  // Iris portal (two phases: expand to 75%, then fill to 100%)
  const irisRadius = useTransform(progress, [0.05, 0.65, 1], [0, 75, 100]);
  const clipPath = useMotionTemplate`circle(${irisRadius}% at 50% 50%)`;

  // Outgoing dims behind the portal
  const dim = useTransform(progress, [0.05, 0.5], [1, 0]);

  outgoing.style.opacity = dim;
  outgoing.style.scale = useTransform(progress, [0.05, 0.5], [1, 0.96]);

  incoming.style.clipPath = clipPath;

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: 'rgba(34,211,238,1)',
          boxShadow:
            '0 0 40px 20px rgba(34,211,238,0.6), 0 0 80px 40px rgba(99,102,241,0.3)',
          scale: glowScale,
          opacity: glowOpacity,
        }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '50vmin',
          height: '50vmin',
          borderRadius: '50%',
          border: '3px solid rgba(34,211,238,0.7)',
          boxShadow:
            '0 0 30px rgba(34,211,238,0.5), inset 0 0 30px rgba(34,211,238,0.2)',
          scale: ringScale,
          rotate: ringRotation,
          opacity: ringOpacity,
        }}
      />
    </>
  );
}
