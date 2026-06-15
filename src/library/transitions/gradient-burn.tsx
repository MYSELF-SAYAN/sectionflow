'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p        = useTrackProgress();
  const edge     = useTransform(p, [0.25, 0.75], [104, -4]);
  const clipPath = useMotionTemplate`inset(${edge}% 0% 0% 0%)`;
  const lineTop  = useMotionTemplate`${edge}%`;
  const glow     = useTransform(p, [0.25, 0.33, 0.70, 0.78], [0, 1, 1, 0]);
  const dim      = useTransform(p, [0.25, 0.75], [1, 0.45]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ clipPath }} className="absolute inset-0">{second}</motion.div>
      <motion.div
        style={{ top: lineTop, opacity: glow }}
        className="pointer-events-none absolute left-0 right-0 h-[3px] -translate-y-1/2 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_60px_18px_rgba(251,191,36,0.35)]"
      />
    </>
  );
}

export function GradientBurn({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
