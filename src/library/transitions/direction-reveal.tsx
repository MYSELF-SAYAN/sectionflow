'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p            = useTrackProgress();
  // 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
  const secondY      = useTransform(p, [0.25, 0.75], ['100%', '0%']);
  const secondSkewX  = useTransform(p, [0.25, 0.50, 0.75], [1.5, 0.8, 0]);
  const secondScale  = useTransform(p, [0.25, 0.75], [0.96, 1]);
  const firstY       = useTransform(p, [0.25, 0.75], ['0%', '-40%']);
  const firstOpacity = useTransform(p, [0.25, 0.62], [1, 0]);
  const firstScale   = useTransform(p, [0.25, 0.75], [1, 0.92]);
  const trailOpacity = useTransform(p, [0.25, 0.34, 0.70, 0.78], [0, 0.8, 0.8, 0]);
  const trailY       = useTransform(p, [0.25, 0.75], ['100%', '-5%']);

  return (
    <>
      <motion.div style={{ y: firstY, opacity: firstOpacity, scale: firstScale }} className="absolute inset-0">{first}</motion.div>
      <motion.div
        className="pointer-events-none absolute inset-x-0 h-px"
        style={{ y: trailY, opacity: trailOpacity, background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.9) 30%, rgba(255,255,255,1) 50%, rgba(34,211,238,0.9) 70%, transparent)', boxShadow: '0 0 20px 4px rgba(34,211,238,0.4)' }}
      />
      <motion.div style={{ y: secondY, skewX: secondSkewX, scale: secondScale }} className="absolute inset-0">{second}</motion.div>
    </>
  );
}

export function DirectionReveal({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
