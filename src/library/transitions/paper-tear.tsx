'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

const TEAR_UPPER = [[0,0],[100,0],[100,48],[94,52],[88,47],[82,54],[76,49],[70,56],[64,50],[58,57],[52,51],[46,58],[40,52],[34,59],[28,53],[22,60],[16,54],[10,60],[4,54],[0,58]];
const TEAR_LOWER = [[0,58],[4,62],[10,56],[16,63],[22,57],[28,64],[34,58],[40,65],[46,59],[52,66],[58,60],[64,67],[70,61],[76,68],[82,62],[88,68],[94,62],[100,68],[100,100],[0,100]];
const pts = (p: number[][]) => `polygon(${p.map(([x, y]) => `${x}% ${y}%`).join(', ')})`;
const UPPER_CLIP = pts(TEAR_UPPER);
const LOWER_CLIP = pts(TEAR_LOWER);

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
  const coverOpacity   = useTransform(p, [0.24, 0.26], [1, 0]);
  const upperY         = useTransform(p, [0.25, 0.75], ['0%', '-60%']);
  const lowerY         = useTransform(p, [0.25, 0.75], ['0%', '60%']);
  const upperRotate    = useTransform(p, [0.25, 0.75], [0, -4]);
  const lowerRotate    = useTransform(p, [0.25, 0.75], [0, 3]);
  const secondOpacity  = useTransform(p, [0.25, 0.55], [0, 1]);
  const shadowIntensity = useTransform(p, [0.25, 0.55, 0.75], [0, 0.6, 0]);

  return (
    <>
      <motion.div style={{ opacity: secondOpacity }} className="absolute inset-0">{second}</motion.div>
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 52%, transparent 65%)', opacity: shadowIntensity }} />
      <motion.div style={{ y: upperY, rotate: upperRotate, clipPath: UPPER_CLIP }} className="absolute inset-0 overflow-hidden origin-top">
        {first}
        <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 44%, rgba(255,255,255,0.15) 50%, transparent 52%)' }} />
      </motion.div>
      <motion.div style={{ y: lowerY, rotate: lowerRotate, clipPath: LOWER_CLIP }} className="absolute inset-0 overflow-hidden origin-bottom">
        {first}
        <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 56%, transparent 62%)' }} />
      </motion.div>
      {/* Clean cover — hides tear seam until animation begins at 0.25 */}
      <motion.div style={{ opacity: coverOpacity }} className="absolute inset-0 pointer-events-none">{first}</motion.div>
    </>
  );
}

export function PaperTear({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
