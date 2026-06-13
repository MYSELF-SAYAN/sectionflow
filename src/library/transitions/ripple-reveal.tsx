'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

const RIPPLE_COUNT = 5;

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();
  // Dead zone: 0→0.30 — all radii are 0, nothing visible
  const r0 = useTransform(p, [0.30, 0.88], [0, 160]);
  const r1 = useTransform(p, [0.34, 0.90], [0, 155]);
  const r2 = useTransform(p, [0.38, 0.92], [0, 150]);
  const r3 = useTransform(p, [0.42, 0.94], [0, 145]);
  const r4 = useTransform(p, [0.46, 0.96], [0, 140]);

  const revealMask = useMotionTemplate`radial-gradient(circle ${r0}vmax at 50% 50%, #000 72%, transparent 100%)`;

  const ring0Op = useTransform(p, [0.30, 0.40, 0.76, 0.88], [0, 0.6, 0.6, 0]);
  const ring1Op = useTransform(p, [0.34, 0.44, 0.78, 0.90], [0, 0.5, 0.5, 0]);
  const ring2Op = useTransform(p, [0.38, 0.48, 0.80, 0.92], [0, 0.4, 0.4, 0]);
  const ring3Op = useTransform(p, [0.42, 0.52, 0.82, 0.94], [0, 0.3, 0.3, 0]);
  const ring4Op = useTransform(p, [0.46, 0.56, 0.84, 0.96], [0, 0.25, 0.25, 0]);

  const ringOpacities = [ring0Op, ring1Op, ring2Op, ring3Op, ring4Op];
  const ringRadii = [r0, r1, r2, r3, r4];

  const firstDim = useTransform(p, [0.30, 0.90], [1, 0]);

  return (
    <>
      <motion.div style={{ opacity: firstDim }} className="absolute inset-0">{first}</motion.div>
      <motion.div style={{ WebkitMaskImage: revealMask, maskImage: revealMask }} className="absolute inset-0">
        {second}
      </motion.div>
      {Array.from({ length: RIPPLE_COUNT }, (_, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute left-1/2 top-1/2"
          style={{ opacity: ringOpacities[i], width: 2, height: 2, marginLeft: -1, marginTop: -1 }}
        >
          <motion.div
            className="absolute rounded-full border border-white/70"
            style={{
              width: useMotionTemplate`${ringRadii[i]}vmax`,
              height: useMotionTemplate`${ringRadii[i]}vmax`,
              top: useMotionTemplate`calc(-${ringRadii[i]}vmax / 2)`,
              left: useMotionTemplate`calc(-${ringRadii[i]}vmax / 2)`,
              boxShadow: '0 0 12px 2px rgba(34,211,238,0.3)',
            }}
          />
        </motion.div>
      ))}
    </>
  );
}

/** RippleReveal – concentric ripple rings expand from centre, the innermost acting as a reveal mask. */
export function RippleReveal({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
