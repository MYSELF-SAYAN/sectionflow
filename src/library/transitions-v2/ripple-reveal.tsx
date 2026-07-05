'use client';

import { motion, useMotionTemplate, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

const RIPPLE_COUNT = 5;
const PEAK = [0.6, 0.5, 0.4, 0.3, 0.25] as const;

/**
 * v2 — Mask reveal with concentric overlay rings.
 *
 * Five concentric ripple rings expand outward from viewport centre; the
 * innermost wave acts as a growing reveal mask. Outer rings glow with a cyan
 * halo. The incoming layer is revealed through the radial mask; the outgoing
 * fades out.
 *
 * Shape: mask-reveal (radial mask on the incoming layer) + effect-overlay
 * rings.
 */
export function RippleReveal({ progress, outgoing, incoming }: TransitionProps) {
  // Top-level hooks only — the ring set is a fixed length, so the call order
  // is stable across renders.
  const radii: MotionValue<number>[] = [];
  const opacities: MotionValue<number>[] = [];
  const sizes: MotionValue<string>[] = [];
  const offsets: MotionValue<string>[] = [];
  for (let i = 0; i < RIPPLE_COUNT; i++) {
    const r = useTransform(progress, [0.03 * i, 1], [0, 160 - i * 5]);
    radii.push(r);
    opacities.push(
      useTransform(progress, [0.03 * i, 0.09 + 0.03 * i, 0.9, 1], [0, PEAK[i], PEAK[i], 0]),
    );
    sizes.push(useMotionTemplate`${r}vmax`);
    offsets.push(useMotionTemplate`calc(-${r}vmax / 2)`);
  }

  const revealMask = useMotionTemplate`radial-gradient(circle ${radii[0]}vmax at 50% 50%, #000 72%, transparent 100%)`;
  const firstDim = useTransform(progress, [0, 1], [1, 0]);

  outgoing.style.opacity = firstDim;
  incoming.style.WebkitMaskImage = revealMask;
  incoming.style.maskImage = revealMask;

  return (
    <>
      {Array.from({ length: RIPPLE_COUNT }, (_, i) => (
        <motion.div
          // biome-ignore lint/suspicious/noArrayIndexKey: index is stable for a fixed-length ring set
          key={i}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-20"
          style={{ opacity: opacities[i] }}
        >
          <motion.div
            className="absolute rounded-full border border-cyan-300/70"
            style={{
              width: sizes[i],
              height: sizes[i],
              top: offsets[i],
              left: offsets[i],
              boxShadow: '0 0 12px 2px rgba(34,211,238,0.3)',
            }}
          />
        </motion.div>
      ))}
    </>
  );
}
