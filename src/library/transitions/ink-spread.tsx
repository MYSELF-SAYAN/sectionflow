'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p   = useTrackProgress();
  const r1  = useTransform(p, [0.25, 0.75], [0, 130]);
  const r2  = useTransform(p, [0.30, 0.78], [0, 115]);
  const r3  = useTransform(p, [0.35, 0.82], [0, 100]);
  const mask = useMotionTemplate`radial-gradient(circle ${r1}vmax at 28% 32%, #000 72%, transparent 100%), radial-gradient(circle ${r2}vmax at 74% 68%, #000 72%, transparent 100%), radial-gradient(circle ${r3}vmax at 55% 20%, #000 72%, transparent 100%)`;
  const dim  = useTransform(p, [0.25, 0.75], [1, 0.5]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ WebkitMaskImage: mask, maskImage: mask }} className="absolute inset-0">
        {second}
      </motion.div>
    </>
  );
}

export function InkSpread({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
