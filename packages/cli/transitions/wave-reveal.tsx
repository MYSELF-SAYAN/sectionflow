'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

export interface WaveRevealProps extends SectionTransitionProps {
  waveClassName?: string;
}

function Inner({ first, second, waveClassName }: Omit<WaveRevealProps, 'height' | 'className'>) {
  const p = useTrackProgress();
  // 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
  const y          = useTransform(p, [0.25, 0.75], ['102%', '0%']);
  const dim        = useTransform(p, [0.25, 0.75], [1, 0.55]);
  const waveScale  = useTransform(p, [0.25, 0.52, 0.75], [1, 1.6, 0.0001]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.div
          style={{ scaleY: waveScale }}
          className={`absolute top-[-12vh] left-0 h-[12.5vh] w-full origin-bottom ${waveClassName ?? 'text-[#0e0e11]'}`}
        >
          <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 100">
            <path fill="currentColor" d="M0 100 C 240 20 480 0 720 30 C 960 60 1200 30 1440 70 L 1440 100 Z" />
          </svg>
        </motion.div>
        <div className="h-full w-full">{second}</div>
      </motion.div>
    </>
  );
}

export function WaveReveal({ first, second, height, className, waveClassName }: WaveRevealProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} waveClassName={waveClassName} />
    </TransitionTrack>
  );
}
