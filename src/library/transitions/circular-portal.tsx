'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
  const r          = useTransform(p, [0.25, 0.75], [0, 150]);
  const clipPath   = useMotionTemplate`circle(${r}% at 50% 50%)`;
  const firstScale = useTransform(p, [0.25, 0.75], [1, 1.18]);
  const innerScale = useTransform(p, [0.25, 0.75], [1.15, 1]);

  return (
    <>
      <motion.div style={{ scale: firstScale }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ clipPath }} className="absolute inset-0">
        <motion.div style={{ scale: innerScale }} className="h-full w-full">{second}</motion.div>
      </motion.div>
    </>
  );
}

export function CircularPortal({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
