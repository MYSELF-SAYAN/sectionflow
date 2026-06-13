'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const yFirst = useTransform(p, [0.30, 1.00], ['0%', '-32%']);
  const dim = useTransform(p, [0.30, 0.94], [1, 0.35]);
  const scaleFirst = useTransform(p, [0.30, 1.00], [1, 0.96]);
  const yWrap = useTransform(p, [0.30, 0.96], ['100%', '0%']);
  const yInner = useTransform(p, [0.30, 0.96], ['-44%', '0%']);

  return (
    <>
      <motion.div style={{ y: yFirst, opacity: dim, scale: scaleFirst }} className="absolute inset-0">
        {first}
      </motion.div>
      <motion.div style={{ y: yWrap }} className="absolute inset-0 overflow-hidden shadow-[0_-30px_80px_rgba(0,0,0,0.45)]">
        <motion.div style={{ y: yInner }} className="h-full w-full">{second}</motion.div>
      </motion.div>
    </>
  );
}

/** DepthLayers – layers move at different depths for a true parallax handoff. */
export function DepthLayers({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
