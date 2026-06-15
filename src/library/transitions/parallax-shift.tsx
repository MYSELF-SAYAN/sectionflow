'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p   = useTrackProgress();
  const y1  = useTransform(p, [0.25, 0.85], ['0%', '-30%']);
  const dim = useTransform(p, [0.25, 0.85], [1, 0.3]);
  const y2  = useTransform(p, [0.25, 0.80], ['100%', '0%']);

  return (
    <>
      <motion.div style={{ y: y1, opacity: dim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ y: y2 }} className="absolute inset-0 shadow-[0_-30px_80px_rgba(0,0,0,0.4)]">
        {second}
      </motion.div>
    </>
  );
}

export function ParallaxShift({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
