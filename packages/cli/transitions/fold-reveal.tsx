'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p          = useTrackProgress();
  const rx         = useTransform(p, [0.25, 0.75], [-78, 0]);
  const shade      = useTransform(p, [0.25, 0.75], [0.3, 1]);
  const filter     = useMotionTemplate`brightness(${shade})`;
  const dimFirst   = useTransform(p, [0.25, 0.72], [1, 0.45]);
  const scaleFirst = useTransform(p, [0.25, 0.75], [1, 0.94]);

  return (
    <div className="absolute inset-0" style={{ perspective: 1600 }}>
      <motion.div style={{ opacity: dimFirst, scale: scaleFirst }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ rotateX: rx, filter, transformOrigin: 'center top' }} className="absolute inset-0 shadow-[0_60px_120px_rgba(0,0,0,0.5)]">
        {second}
      </motion.div>
    </div>
  );
}

export function FoldReveal({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
