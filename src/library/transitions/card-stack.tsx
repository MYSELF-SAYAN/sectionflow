'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p       = useTrackProgress();
  const scale   = useTransform(p, [0.25, 0.72], [1, 0.88]);
  const radius  = useTransform(p, [0.25, 0.72], [0, 36]);
  const dim     = useTransform(p, [0.25, 0.72], [1, 0.45]);
  const filter  = useMotionTemplate`brightness(${dim})`;
  const y       = useTransform(p, [0.30, 0.80], ['102%', '0%']);
  const radius2 = useTransform(p, [0.30, 0.80], [44, 0]);

  return (
    <>
      <motion.div style={{ scale, filter, borderRadius: radius }} className="absolute inset-0 overflow-hidden">
        {first}
      </motion.div>
      <motion.div
        style={{ y, borderTopLeftRadius: radius2, borderTopRightRadius: radius2 }}
        className="absolute inset-0 overflow-hidden shadow-[0_-40px_120px_rgba(0,0,0,0.5)]"
      >
        {second}
      </motion.div>
    </>
  );
}

export function CardStack({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
