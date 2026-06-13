'use client';

import { motion, useSpring, useTransform, useVelocity } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  const v = useVelocity(p);
  const skew = useSpring(useTransform(v, [-3, 3], [7, -7]), { stiffness: 260, damping: 24 });
  const stretch = useSpring(useTransform(v, [-3, 0, 3], [1.1, 1, 1.1]), { stiffness: 260, damping: 24 });
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const y1 = useTransform(p, [0.30, 0.96], ['0%', '-100%']);
  const y2 = useTransform(p, [0.38, 1.00], ['100%', '0%']);

  return (
    <motion.div style={{ skewY: skew, scaleY: stretch }} className="absolute inset-0">
      <motion.div style={{ y: y1 }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ y: y2 }} className="absolute inset-0">{second}</motion.div>
    </motion.div>
  );
}

/** ScrollWarp – scroll velocity skews and stretches the handoff between sections. */
export function ScrollWarp({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
