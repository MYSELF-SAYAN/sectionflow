'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p          = useTrackProgress();
  const leftY      = useTransform(p, [0.25, 0.75], ['-102%', '0%']);
  const rightY     = useTransform(p, [0.25, 0.75], ['102%', '0%']);
  const innerScale = useTransform(p, [0.25, 0.75], [0.94, 1]);
  const dim        = useTransform(p, [0.25, 0.72], [1, 0]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ y: leftY }} className="absolute left-0 top-0 h-full w-1/2 overflow-hidden">
        <motion.div style={{ scale: innerScale }} className="absolute left-0 top-0 h-full w-[200%]">{second}</motion.div>
      </motion.div>
      <motion.div style={{ y: rightY }} className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
        <motion.div style={{ scale: innerScale }} className="absolute -left-full top-0 h-full w-[200%]">{second}</motion.div>
      </motion.div>
    </>
  );
}

export function VerticalSplit({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
