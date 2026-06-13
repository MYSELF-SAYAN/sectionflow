'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const r = useTransform(p, [0.30, 0.95], [0, 150]);
  const clipPath = useMotionTemplate`circle(${r}% at 50% 50%)`;
  const firstScale = useTransform(p, [0.30, 0.95], [1, 1.18]);
  const innerScale = useTransform(p, [0.30, 0.95], [1.15, 1]);

  return (
    <>
      <motion.div style={{ scale: firstScale }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ clipPath }} className="absolute inset-0">
        <motion.div style={{ scale: innerScale }} className="h-full w-full">{second}</motion.div>
      </motion.div>
    </>
  );
}

/** CircularPortal – the next section blooms out of a circular portal in the center. */
export function CircularPortal({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
