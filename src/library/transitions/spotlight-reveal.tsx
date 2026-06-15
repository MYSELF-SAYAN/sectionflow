'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p    = useTrackProgress();
  const r    = useTransform(p, [0.25, 0.75], [0, 140]);
  const mask = useMotionTemplate`radial-gradient(circle ${r}vmax at 50% 45%, #000 60%, transparent 100%)`;
  const dim  = useTransform(p, [0.25, 0.72], [1, 0.35]);
  const filter = useMotionTemplate`brightness(${dim})`;

  return (
    <>
      <motion.div style={{ filter }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ WebkitMaskImage: mask, maskImage: mask }} className="absolute inset-0">
        {second}
      </motion.div>
    </>
  );
}

export function SpotlightReveal({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
