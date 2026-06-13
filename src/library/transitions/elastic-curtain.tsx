'use client';

import { motion, useSpring, useTransform, useVelocity } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

export interface ElasticCurtainProps extends SectionTransitionProps {
  /** Color class for the elastic cap – should match the second section's background. */
  capClassName?: string;
}

function Inner({ first, second, capClassName }: Omit<ElasticCurtainProps, 'height' | 'className'>) {
  const p = useTrackProgress();
  const v = useVelocity(p);
  // The cap stretches with scroll velocity, then springs back – the elastic feel.
  const stretch = useSpring(useTransform(v, [-2.5, 0, 2.5], [2.2, 1, 2.2]), {
    stiffness: 320,
    damping: 22,
  });
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const y = useTransform(p, [0.30, 0.96], ['102%', '0%']);
  const dim = useTransform(p, [0.30, 0.92], [1, 0.45]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.div
          style={{ scaleY: stretch }}
          className={`absolute top-[-10vh] left-0 h-[10.5vh] w-full origin-bottom ${capClassName ?? 'text-[#0e0e11]'}`}
        >
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <path fill="currentColor" d="M0 100 Q 50 0 100 100 Z" />
          </svg>
        </motion.div>
        <div className="h-full w-full">{second}</div>
      </motion.div>
    </>
  );
}

/** ElasticCurtain – a curtain with a velocity-reactive elastic edge rises into place. */
export function ElasticCurtain({ first, second, height, className, capClassName }: ElasticCurtainProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} capClassName={capClassName} />
    </TransitionTrack>
  );
}
