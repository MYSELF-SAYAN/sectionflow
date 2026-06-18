'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

const BANDS = 12;

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p             = useTrackProgress();
  // 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
  const firstOpacity  = useTransform(p, [0.25, 0.72], [1, 0]);
  const secondOpacity = useTransform(p, [0.45, 0.85], [0, 1]);
  const bands = Array.from({ length: BANDS }, (_, i) => {
    const start = 0.25 + (i / BANDS) * 0.40;
    const end   = start + 0.22;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(p, [start, end], [1, 0]);
  });
  const secondX       = useTransform(p, [0.25, 0.78], ['6%', '0%']);
  const outlineScale  = useTransform(p, [0.25, 0.52, 0.75], [0.9, 1.0, 1.1]);
  const outlineOpacity = useTransform(p, [0.25, 0.38, 0.65, 0.75], [0, 0.5, 0.5, 0]);

  return (
    <>
      <motion.div style={{ opacity: secondOpacity, x: secondX }} className="absolute inset-0">{second}</motion.div>
      <motion.div className="pointer-events-none absolute inset-6 rounded-2xl border border-cyan-400/40" style={{ scale: outlineScale, opacity: outlineOpacity }} />
      <motion.div style={{ opacity: firstOpacity }} className="absolute inset-0">
        <div className="grid h-full w-full" style={{ gridTemplateRows: `repeat(${BANDS}, 1fr)` }}>
          {bands.map((bandOp, i) => (
            <motion.div key={i} style={{ opacity: bandOp }} className="relative overflow-hidden">
              <div className="pointer-events-none absolute" style={{ width: '100%', height: `${BANDS * 100}%`, top: `${-i * 100}%` }}>{first}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

export function ProgressiveMorph({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
