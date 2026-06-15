'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p      = useTrackProgress();
  const scale1 = useTransform(p, [0.25, 0.72], [1, 1.35]);
  const o1     = useTransform(p, [0.48, 0.72], [1, 0]);
  const scale2 = useTransform(p, [0.50, 0.85], [1.1, 1]);
  const o2     = useTransform(p, [0.50, 0.72], [0, 1]);
  const y2     = useTransform(p, [0.50, 0.85], ['10%', '0%']);

  return (
    <>
      <motion.div style={{ scale: scale1, opacity: o1 }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ scale: scale2, opacity: o2, y: y2 }} className="absolute inset-0">{second}</motion.div>
    </>
  );
}

export function ZoomFade({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
