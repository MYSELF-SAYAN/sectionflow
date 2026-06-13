'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const scale1 = useTransform(p, [0.30, 0.82], [1, 9]);
  const o1 = useTransform(p, [0.60, 0.82], [1, 0]);
  const blur = useTransform(p, [0.50, 0.82], [0, 16]);
  const filter = useMotionTemplate`blur(${blur}px)`;
  const scale2 = useTransform(p, [0.52, 1.00], [0.65, 1]);
  const o2 = useTransform(p, [0.52, 0.72], [0, 1]);

  return (
    <>
      <motion.div style={{ scale: scale2, opacity: o2 }} className="absolute inset-0">{second}</motion.div>
      <motion.div style={{ scale: scale1, opacity: o1, filter }} className="absolute inset-0">{first}</motion.div>
    </>
  );
}

/** CinematicZoom – zooms through the current section and lands inside the next one. */
export function CinematicZoom({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
