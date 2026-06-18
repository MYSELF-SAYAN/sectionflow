'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p      = useTrackProgress();
  const dim    = useTransform(p, [0.25, 0.75], [1, 0.5]);
  const filter = useMotionTemplate`brightness(${dim})`;
  const y      = useTransform(p, [0.25, 0.80], ['100%', '0%']);

  return (
    <>
      <motion.div style={{ filter }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ y }} className="absolute inset-0 shadow-[0_-40px_100px_rgba(0,0,0,0.5)]">
        {second}
      </motion.div>
    </>
  );
}

export function PinReveal({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
