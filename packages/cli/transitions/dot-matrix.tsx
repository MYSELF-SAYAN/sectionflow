'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p    = useTrackProgress();
  const r    = useTransform(p, [0.25, 0.75], [0, 105]);
  const mask = useMotionTemplate`radial-gradient(circle, #000 ${r}%, transparent ${r}%)`;
  const dim  = useTransform(p, [0.25, 0.72], [1, 0.4]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      <motion.div
        style={{
          WebkitMaskImage: mask, maskImage: mask,
          WebkitMaskSize: '72px 72px', maskSize: '72px 72px',
          WebkitMaskPosition: 'center', maskPosition: 'center',
        }}
        className="absolute inset-0"
      >
        {second}
      </motion.div>
    </>
  );
}

export function DotMatrixReveal({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
