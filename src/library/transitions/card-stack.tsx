'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const scale = useTransform(p, [0.30, 0.84], [1, 0.88]);
  const radius = useTransform(p, [0.30, 0.84], [0, 36]);
  const dim = useTransform(p, [0.30, 0.84], [1, 0.45]);
  const filter = useMotionTemplate`brightness(${dim})`;
  const y = useTransform(p, [0.38, 0.97], ['102%', '0%']);
  const radius2 = useTransform(p, [0.38, 0.97], [44, 0]);

  return (
    <>
      <motion.div style={{ scale, filter, borderRadius: radius }} className="absolute inset-0 overflow-hidden">
        {first}
      </motion.div>
      <motion.div
        style={{ y, borderTopLeftRadius: radius2, borderTopRightRadius: radius2 }}
        className="absolute inset-0 overflow-hidden shadow-[0_-40px_120px_rgba(0,0,0,0.5)]"
      >
        {second}
      </motion.div>
    </>
  );
}

/** CardStack – the current section settles back like a card while the next slides over it. */
export function CardStack({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
