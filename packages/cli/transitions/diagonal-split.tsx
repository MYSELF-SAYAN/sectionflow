'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p   = useTrackProgress();
  const a   = useTransform(p, [0.25, 0.75], ['-120%', '0%']);
  const b   = useTransform(p, [0.25, 0.75], ['120%', '0%']);
  const dim = useTransform(p, [0.25, 0.72], [1, 0.4]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ x: a, y: a, clipPath: 'polygon(0% 0%, 100.5% 0%, 0% 100.5%)' }} className="absolute inset-0">
        {second}
      </motion.div>
      <motion.div style={{ x: b, y: b, clipPath: 'polygon(100% -0.5%, 100% 100%, -0.5% 100%)' }} className="absolute inset-0">
        {second}
      </motion.div>
    </>
  );
}

export function DiagonalSplit({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
