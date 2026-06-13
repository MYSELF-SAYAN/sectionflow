'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — first section fully visible, no animation
  const b1r = useTransform(p, [0.30, 0.82], [0, 160]);
  const b2r = useTransform(p, [0.36, 0.88], [0, 140]);
  const b3r = useTransform(p, [0.42, 0.94], [0, 130]);
  const b4r = useTransform(p, [0.48, 1.00], [0, 110]);

  const mask = useMotionTemplate`
    radial-gradient(circle ${b1r}vmax at 18% 88%, #000 65%, transparent 100%),
    radial-gradient(circle ${b2r}vmax at 82% 12%, #000 65%, transparent 100%),
    radial-gradient(circle ${b3r}vmax at 50% 50%, #000 65%, transparent 100%),
    radial-gradient(circle ${b4r}vmax at 28% 18%, #000 65%, transparent 100%)
  `;

  const dim = useTransform(p, [0.30, 0.84], [1, 0]);
  const firstScale = useTransform(p, [0.30, 0.96], [1, 1.06]);

  return (
    <>
      <motion.div style={{ opacity: dim, scale: firstScale }} className="absolute inset-0">
        {first}
      </motion.div>
      <motion.div style={{ WebkitMaskImage: mask, maskImage: mask }} className="absolute inset-0">
        {second}
      </motion.div>
    </>
  );
}

/** LiquidMorph – organic liquid blobs grow and merge to reveal the next section. */
export function LiquidMorph({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
