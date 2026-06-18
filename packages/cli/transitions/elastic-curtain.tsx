'use client';

import { motion, useSpring, useTransform, useVelocity } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

export interface ElasticCurtainProps extends SectionTransitionProps {
  capClassName?: string;
}

function Inner({ first, second, capClassName }: Omit<ElasticCurtainProps, 'height' | 'className'>) {
  const p       = useTrackProgress();
  const v       = useVelocity(p);
  const stretch = useSpring(useTransform(v, [-2.5, 0, 2.5], [2.2, 1, 2.2]), { stiffness: 320, damping: 22 });
  const y       = useTransform(p, [0.25, 0.75], ['102%', '0%']);
  const dim     = useTransform(p, [0.25, 0.75], [1, 0.45]);

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

export function ElasticCurtain({ first, second, height, className, capClassName }: ElasticCurtainProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} capClassName={capClassName} />
    </TransitionTrack>
  );
}
