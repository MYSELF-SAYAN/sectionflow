'use client';

import { motion, useMotionTemplate, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Mask reveal with a molten pour overlay.
 *
 * Viscous molten rivulets pour down from the top, cooling and solidifying
 * to reveal the incoming section. The pour is simulated as a growing mask
 * from the top edge, with glowing rivulet overlays. The outgoing dims
 * behind the pour.
 *
 * Shape: mask-reveal (inset mask from top on incoming layer) + effect-overlay
 * rivulets.
 */
const RIVULET_COUNT = 8;

function seeded(i: number): number {
  const x = Math.sin((i + 0.5) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

export function MoltenPour({ progress, outgoing, incoming }: TransitionProps) {
  // Mask reveals incoming from top
  const insetTop = useTransform(progress, [0, 1], [100, -4]);
  const clipPath = useMotionTemplate`inset(${insetTop}% 0% 0% 0%)`;
  const dim = useTransform(progress, [0, 1], [1, 0.4]);

  outgoing.style.opacity = dim;
  incoming.style.clipPath = clipPath;

  // Glow line at the pour frontier
  const glowTop = useMotionTemplate`${insetTop}%`;
  const glowOpacity = useTransform(progress, [0, 0.1, 0.85, 1], [0, 1, 1, 0]);

  // Rivulets
  const rivulets = Array.from({ length: RIVULET_COUNT }, (_, i) => {
    const s = seeded(i);
    const left = `${10 + s * 80}%`;
    const width = 3 + s * 5;
    const delay = s * 0.12;
    const heightPct = useTransform(progress, [delay, Math.min(1, delay + 0.5)], [0, 100]);
    const height = useMotionTemplate`${heightPct}%`;
    const opacity = useTransform(progress, [delay, delay + 0.1, Math.min(1, delay + 0.5), Math.min(1, delay + 0.6)], [0, 0.7, 0.7, 0]);
    return { i, left, width, height, opacity } as const;
  });

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 z-30 h-[3px]"
        style={{
          top: glowTop,
          opacity: glowOpacity as MotionValue<number>,
          background: 'linear-gradient(90deg, transparent, rgba(255,160,0,0.8) 20%, rgba(255,220,100,1) 50%, rgba(255,160,0,0.8) 80%, transparent)',
          boxShadow: '0 0 20px 6px rgba(255,120,0,0.5)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {rivulets.map(({ i, left, width, height, opacity }) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: rivulet index is stable
            key={i}
            aria-hidden
            className="absolute top-0"
            style={{
              left,
              width,
              height,
              opacity: opacity as MotionValue<number>,
              background: 'linear-gradient(180deg, rgba(255,180,0,0.6), rgba(200,100,0,0.3), transparent)',
              borderRadius: '0 0 50% 50%',
              filter: 'blur(1px)',
            }}
          />
        ))}
      </div>
    </>
  );
}
