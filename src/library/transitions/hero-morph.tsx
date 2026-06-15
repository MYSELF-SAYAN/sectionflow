'use client';

import { motion, useTransform, useMotionTemplate } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p                = useTrackProgress();
  // 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
  const heroScale        = useTransform(p, [0.25, 0.78], [0.12, 1]);
  const heroBorderRadius = useTransform(p, [0.25, 0.68], [32, 0]);
  const borderRadiusTemplate = useMotionTemplate`${heroBorderRadius}px`;
  const firstScale       = useTransform(p, [0.25, 0.75], [1, 0.88]);
  const firstOpacity     = useTransform(p, [0.25, 0.65], [1, 0]);
  const firstBlur        = useTransform(p, [0.40, 0.68], [0, 12]);
  const firstFilter      = useMotionTemplate`blur(${firstBlur}px)`;
  const secondOpacity    = useTransform(p, [0.30, 0.58], [0, 1]);
  const glowOpacity      = useTransform(p, [0.25, 0.38, 0.70, 0.78], [0, 0.8, 0.8, 0]);
  const glowScale        = useTransform(p, [0.25, 0.78], [0.14, 1.04]);

  return (
    <>
      <motion.div style={{ scale: firstScale, opacity: firstOpacity, filter: firstFilter }} className="absolute inset-0">{first}</motion.div>
      <motion.div className="pointer-events-none absolute inset-0 flex items-center justify-center" style={{ opacity: glowOpacity, scale: glowScale }}>
        <div className="aspect-square w-1/3" style={{ borderRadius: '50%', boxShadow: '0 0 80px 40px rgba(34,211,238,0.25), 0 0 160px 80px rgba(99,102,241,0.15)' }} />
      </motion.div>
      <motion.div style={{ scale: heroScale, borderRadius: borderRadiusTemplate, opacity: secondOpacity }} className="absolute inset-0 overflow-hidden shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
        {second}
      </motion.div>
    </>
  );
}

export function HeroMorph({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
