'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p        = useTrackProgress();
  const rxFirst  = useTransform(p, [0.25, 0.58], [0, -22]);
  const oFirst   = useTransform(p, [0.42, 0.58], [1, 0]);
  const sFirst   = useTransform(p, [0.25, 0.58], [1, 0.9]);
  const rxSecond = useTransform(p, [0.48, 0.80], [58, 0]);
  const ySecond  = useTransform(p, [0.48, 0.80], ['42%', '0%']);
  const oSecond  = useTransform(p, [0.48, 0.60], [0, 1]);

  return (
    <div className="absolute inset-0" style={{ perspective: 1400 }}>
      <motion.div style={{ rotateX: rxFirst, opacity: oFirst, scale: sFirst, transformOrigin: 'center top' }} className="absolute inset-0">
        {first}
      </motion.div>
      <motion.div style={{ rotateX: rxSecond, y: ySecond, opacity: oSecond, transformOrigin: 'center bottom' }} className="absolute inset-0">
        {second}
      </motion.div>
    </div>
  );
}

export function PerspectiveFlip({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
