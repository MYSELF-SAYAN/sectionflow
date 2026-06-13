'use client';

import { motion, useTransform, useMotionTemplate } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, hero panel hidden at scale 0
  const heroScale = useTransform(p, [0.30, 0.92], [0.12, 1]);
  const heroBorderRadius = useTransform(p, [0.30, 0.82], [32, 0]);
  const borderRadiusTemplate = useMotionTemplate`${heroBorderRadius}px`;

  const firstScale = useTransform(p, [0.30, 0.90], [1, 0.88]);
  const firstOpacity = useTransform(p, [0.30, 0.76], [1, 0]);
  const firstBlur = useTransform(p, [0.48, 0.82], [0, 12]);
  const firstFilter = useMotionTemplate`blur(${firstBlur}px)`;

  const secondOpacity = useTransform(p, [0.36, 0.68], [0, 1]);

  const glowOpacity = useTransform(p, [0.30, 0.46, 0.82, 0.94], [0, 0.8, 0.8, 0]);
  const glowScale = useTransform(p, [0.30, 0.92], [0.14, 1.04]);

  return (
    <>
      <motion.div style={{ scale: firstScale, opacity: firstOpacity, filter: firstFilter }} className="absolute inset-0">
        {first}
      </motion.div>
      <motion.div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ opacity: glowOpacity, scale: glowScale }}
      >
        <div
          className="aspect-square w-1/3"
          style={{ borderRadius: '50%', boxShadow: '0 0 80px 40px rgba(34,211,238,0.25), 0 0 160px 80px rgba(99,102,241,0.15)' }}
        />
      </motion.div>
      <motion.div
        style={{ scale: heroScale, borderRadius: borderRadiusTemplate, opacity: secondOpacity }}
        className="absolute inset-0 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)]"
      >
        {second}
      </motion.div>
    </>
  );
}

/** HeroMorph – a small rounded card at centre morphs outward into a full-bleed panel. */
export function HeroMorph({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
