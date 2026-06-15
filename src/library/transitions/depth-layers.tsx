'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p       = useTrackProgress();
  const yFirst  = useTransform(p, [0.25, 0.85], ['0%', '-32%']);
  const dim     = useTransform(p, [0.25, 0.78], [1, 0.35]);
  const sFFirst = useTransform(p, [0.25, 0.85], [1, 0.96]);
  const yWrap   = useTransform(p, [0.25, 0.80], ['100%', '0%']);
  const yInner  = useTransform(p, [0.25, 0.80], ['-44%', '0%']);

  return (
    <>
      <motion.div style={{ y: yFirst, opacity: dim, scale: sFFirst }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ y: yWrap }} className="absolute inset-0 overflow-hidden shadow-[0_-30px_80px_rgba(0,0,0,0.45)]">
        <motion.div style={{ y: yInner }} className="h-full w-full">{second}</motion.div>
      </motion.div>
    </>
  );
}

export function DepthLayers({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
