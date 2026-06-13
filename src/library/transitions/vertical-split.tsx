'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const leftY = useTransform(p, [0.30, 0.90], ['-102%', '0%']);
  const rightY = useTransform(p, [0.30, 0.90], ['102%', '0%']);
  const innerScale = useTransform(p, [0.30, 0.90], [0.94, 1]);
  const dim = useTransform(p, [0.30, 0.82], [1, 0]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      {/* Left door – carries the left half of a seamless 200%-wide canvas. */}
      <motion.div style={{ y: leftY }} className="absolute left-0 top-0 h-full w-1/2 overflow-hidden">
        <motion.div style={{ scale: innerScale }} className="absolute left-0 top-0 h-full w-[200%]">{second}</motion.div>
      </motion.div>
      {/* Right door – carries the right half of the same canvas. */}
      <motion.div style={{ y: rightY }} className="absolute right-0 top-0 h-full w-1/2 overflow-hidden">
        <motion.div style={{ scale: innerScale }} className="absolute -left-full top-0 h-full w-[200%]">{second}</motion.div>
      </motion.div>
    </>
  );
}

/** VerticalSplit – two half-screen doors slide vertically and lock into a seamless panel. */
export function VerticalSplit({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
