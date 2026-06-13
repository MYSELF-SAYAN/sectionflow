'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

const BANDS = 12;

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const firstOpacity = useTransform(p, [0.30, 0.88], [1, 0]);
  const secondOpacity = useTransform(p, [0.50, 1.00], [0, 1]);

  // Horizontal scan-line dissolve — shifted into active window [0.30, 1.00]
  const bands = Array.from({ length: BANDS }, (_, i) => {
    const start = 0.30 + (i / BANDS) * 0.42;
    const end = start + 0.24;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useTransform(p, [start, end], [1, 0]);
  });

  const secondX = useTransform(p, [0.30, 0.94], ['6%', '0%']);
  const outlineScale = useTransform(p, [0.30, 0.60, 0.90], [0.9, 1.0, 1.1]);
  const outlineOpacity = useTransform(p, [0.30, 0.46, 0.72, 0.90], [0, 0.5, 0.5, 0]);

  return (
    <>
      <motion.div style={{ opacity: secondOpacity, x: secondX }} className="absolute inset-0">{second}</motion.div>
      <motion.div
        className="pointer-events-none absolute inset-6 rounded-2xl border border-cyan-400/40"
        style={{ scale: outlineScale, opacity: outlineOpacity }}
      />
      <motion.div style={{ opacity: firstOpacity }} className="absolute inset-0">
        <div className="grid h-full w-full" style={{ gridTemplateRows: `repeat(${BANDS}, 1fr)` }}>
          {bands.map((bandOp, i) => (
            <motion.div key={i} style={{ opacity: bandOp }} className="relative overflow-hidden">
              <div className="pointer-events-none absolute" style={{ width: '100%', height: `${BANDS * 100}%`, top: `${-i * 100}%` }}>
                {first}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </>
  );
}

/** ProgressiveMorph – horizontal bands dissolve progressively while the next section slides in. */
export function ProgressiveMorph({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
