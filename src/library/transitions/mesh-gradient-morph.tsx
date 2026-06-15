'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p  = useTrackProgress();
  // 0.00–0.25 safe zone · 0.25–0.75 buildup · 0.75–1.00 handoff
  // Node positions animate only after dead zone
  const x1 = useTransform(p, [0.25, 0.85], [18, 80]);
  const y1 = useTransform(p, [0.25, 0.85], [88, 60]);
  const x2 = useTransform(p, [0.25, 0.85], [82, 20]);
  const y2 = useTransform(p, [0.25, 0.85], [12, 30]);
  const x3 = useTransform(p, [0.25, 0.85], [50, 70]);
  const y3 = useTransform(p, [0.25, 0.85], [50, 10]);
  const x4 = useTransform(p, [0.25, 0.85], [28, 55]);
  const y4 = useTransform(p, [0.25, 0.85], [18, 85]);
  // Radii start at 0 — mask is fully collapsed at rest
  const r1 = useTransform(p, [0.25, 0.75], [0, 100]);
  const r2 = useTransform(p, [0.30, 0.78], [0, 95]);
  const r3 = useTransform(p, [0.35, 0.82], [0, 90]);
  const r4 = useTransform(p, [0.40, 0.86], [0, 85]);
  const meshMask = useMotionTemplate`
    radial-gradient(circle ${r1}vmax at ${x1}% ${y1}%, #000 60%, transparent 100%),
    radial-gradient(circle ${r2}vmax at ${x2}% ${y2}%, #000 60%, transparent 100%),
    radial-gradient(circle ${r3}vmax at ${x3}% ${y3}%, #000 60%, transparent 100%),
    radial-gradient(circle ${r4}vmax at ${x4}% ${y4}%, #000 60%, transparent 100%)
  `;
  const firstOpacity = useTransform(p, [0.25, 0.75], [1, 0]);
  const glowOpacity  = useTransform(p, [0.25, 0.42, 0.78, 0.85], [0, 0.9, 0.9, 0]);

  return (
    <>
      {/* Incoming section revealed by growing blob mask */}
      <motion.div style={{ WebkitMaskImage: meshMask, maskImage: meshMask }} className="absolute inset-0">
        {second}
      </motion.div>
      {/* Colour bleed overlay — invisible at rest */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 80% at 20% 20%, rgba(99,102,241,0.25) 0%, transparent 50%), ' +
            'radial-gradient(ellipse 60% 60% at 80% 80%, rgba(34,211,238,0.22) 0%, transparent 50%), ' +
            'radial-gradient(ellipse 70% 70% at 60% 10%, rgba(244,114,182,0.18) 0%, transparent 50%)',
          opacity: glowOpacity as unknown as number,
        }}
      />
      {/* Outgoing section fades with plain opacity — no distorting mask */}
      <motion.div style={{ opacity: firstOpacity }} className="absolute inset-0">{first}</motion.div>
    </>
  );
}

export function MeshGradientMorph({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
