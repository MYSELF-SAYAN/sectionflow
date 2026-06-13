'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const s = useTransform(p, [0.30, 0.94], [0, 12.6]);
  const mask = useMotionTemplate`repeating-linear-gradient(90deg, #000 0%, #000 ${s}%, transparent ${s}%, transparent 12.5%)`;
  const dim = useTransform(p, [0.30, 0.88], [1, 0.4]);
  const drift = useTransform(p, [0.30, 0.94], ['2%', '0%']);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ WebkitMaskImage: mask, maskImage: mask, x: drift }} className="absolute inset-0">
        {second}
      </motion.div>
    </>
  );
}

/** BlindsReveal – vertical blinds open strip by strip to expose the next section. */
export function BlindsReveal({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
