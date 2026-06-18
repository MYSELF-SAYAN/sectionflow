'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p          = useTrackProgress();
  const topX       = useTransform(p, [0.25, 0.75], ['-102%', '0%']);
  const bottomX    = useTransform(p, [0.25, 0.75], ['102%', '0%']);
  const innerScale = useTransform(p, [0.25, 0.75], [0.94, 1]);
  const dim        = useTransform(p, [0.25, 0.72], [1, 0.4]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ x: topX }} className="absolute left-0 top-0 h-1/2 w-full overflow-hidden">
        <motion.div style={{ scale: innerScale }} className="absolute left-0 top-0 h-[200%] w-full">{second}</motion.div>
      </motion.div>
      <motion.div style={{ x: bottomX }} className="absolute bottom-0 left-0 h-1/2 w-full overflow-hidden">
        <motion.div style={{ scale: innerScale }} className="absolute left-0 top-[-100%] h-[200%] w-full">{second}</motion.div>
      </motion.div>
    </>
  );
}

export function CurtainSplit({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
