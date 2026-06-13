'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const xTop = useTransform(p, [0.30, 0.95], [0, 135]);
  const xBottom = useTransform(xTop, (v) => v - 30);
  const clipPath = useMotionTemplate`polygon(0% 0%, ${xTop}% 0%, ${xBottom}% 100%, 0% 100%)`;
  const firstX = useTransform(p, [0.30, 0.95], ['0%', '12%']);
  const seamX = useMotionTemplate`${xBottom}%`;
  const seamOpacity = useTransform(p, [0.30, 0.38, 0.88, 0.96], [0, 1, 1, 0]);

  return (
    <>
      <motion.div style={{ x: firstX }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ clipPath }} className="absolute inset-0">{second}</motion.div>
      <motion.div
        style={{ left: seamX, opacity: seamOpacity }}
        className="pointer-events-none absolute top-0 h-full w-[2px] -skew-x-[16deg] bg-white/70 shadow-[0_0_40px_8px_rgba(255,255,255,0.35)]"
      />
    </>
  );
}

/** DiagonalWipe – a slanted mask wipes across the viewport with a glowing angled seam. */
export function DiagonalWipe({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
