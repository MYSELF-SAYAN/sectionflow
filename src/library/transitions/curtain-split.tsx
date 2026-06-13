'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const topX = useTransform(p, [0.30, 0.90], ['-102%', '0%']);
  const bottomX = useTransform(p, [0.30, 0.90], ['102%', '0%']);
  const innerScale = useTransform(p, [0.30, 0.90], [0.94, 1]);
  const dim = useTransform(p, [0.30, 0.82], [1, 0.4]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      {/* Top curtain – carries the top half of a seamless 200%-tall canvas. */}
      <motion.div style={{ x: topX }} className="absolute left-0 top-0 h-1/2 w-full overflow-hidden">
        <motion.div style={{ scale: innerScale }} className="absolute left-0 top-0 h-[200%] w-full">{second}</motion.div>
      </motion.div>
      {/* Bottom curtain – carries the bottom half of the same canvas. */}
      <motion.div style={{ x: bottomX }} className="absolute bottom-0 left-0 h-1/2 w-full overflow-hidden">
        <motion.div style={{ scale: innerScale }} className="absolute left-0 top-[-100%] h-[200%] w-full">{second}</motion.div>
      </motion.div>
    </>
  );
}

/** CurtainSplit – top and bottom curtains slide in from opposite sides and seal shut. */
export function CurtainSplit({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
