'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

const SLICES = 16;

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p                = useTrackProgress();
  // 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
  const panelY           = useTransform(p, [0.25, 0.75], ['100%', '0%']);
  const glassPanelOpacity = useTransform(p, [0.25, 0.40, 0.70, 0.78], [0, 1, 1, 0]);
  const firstDim         = useTransform(p, [0.25, 0.75], [1, 0]);
  const secondReveal     = useTransform(p, [0.60, 0.80], [0, 1]);

  return (
    <>
      <motion.div style={{ opacity: firstDim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ opacity: secondReveal }} className="absolute inset-0">{second}</motion.div>
      <motion.div style={{ y: panelY, opacity: glassPanelOpacity }} className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 backdrop-blur-xl backdrop-saturate-150" />
        <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
        <div className="absolute inset-0 flex flex-col overflow-hidden">
          {Array.from({ length: SLICES }, (_, i) => {
            const phase  = (i / SLICES) * Math.PI * 2;
            const xShift = Math.sin(phase) * 12;
            return (
              <div key={i} className="flex-1 overflow-hidden" style={{ transform: `translateX(${xShift}px)`, backdropFilter: 'blur(8px) brightness(1.04)', WebkitBackdropFilter: 'blur(8px) brightness(1.04)', borderTop: i % 3 === 0 ? '1px solid rgba(255,255,255,0.06)' : 'none' }} />
            );
          })}
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 40%, transparent 70%)' }} />
      </motion.div>
    </>
  );
}

export function GlassDistortion({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
