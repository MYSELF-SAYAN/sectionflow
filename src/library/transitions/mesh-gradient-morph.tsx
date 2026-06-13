'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress();

  // ── Fix: Do NOT apply any mask/clip to `first`. The mask was collapsing
  // `first` to nothing because at p=0 all radii=0, making the mask
  // show nothing. Instead, `first` fades out normally (opacity only)
  // and `second` is revealed by the growing mask. ──

  // Dead zone: 0→0.30 — first fully visible, second hidden, no mask active

  // Mesh node positions animate after dead zone
  const x1 = useTransform(p, [0.30, 1.00], [18, 80]);
  const y1 = useTransform(p, [0.30, 1.00], [88, 60]);
  const x2 = useTransform(p, [0.30, 1.00], [82, 20]);
  const y2 = useTransform(p, [0.30, 1.00], [12, 30]);
  const x3 = useTransform(p, [0.30, 1.00], [50, 70]);
  const y3 = useTransform(p, [0.30, 1.00], [50, 10]);
  const x4 = useTransform(p, [0.30, 1.00], [28, 55]);
  const y4 = useTransform(p, [0.30, 1.00], [18, 85]);

  // Radii all start at 0 — nothing visible before 0.30
  const r1 = useTransform(p, [0.30, 0.86], [0, 100]);
  const r2 = useTransform(p, [0.36, 0.90], [0, 95]);
  const r3 = useTransform(p, [0.42, 0.96], [0, 90]);
  const r4 = useTransform(p, [0.48, 1.00], [0, 85]);

  // Mask applied to SECOND section (reveal) — not to first
  const meshMask = useMotionTemplate`
    radial-gradient(circle ${r1}vmax at ${x1}% ${y1}%, #000 60%, transparent 100%),
    radial-gradient(circle ${r2}vmax at ${x2}% ${y2}%, #000 60%, transparent 100%),
    radial-gradient(circle ${r3}vmax at ${x3}% ${y3}%, #000 60%, transparent 100%),
    radial-gradient(circle ${r4}vmax at ${x4}% ${y4}%, #000 60%, transparent 100%)
  `;

  // First section fades out starting at 0.30 (simple opacity, no mask)
  const firstOpacity = useTransform(p, [0.30, 0.88], [1, 0]);
  // Colour bleed overlay — invisible before 0.30
  const glowOpacity = useTransform(p, [0.30, 0.52, 0.90, 1.00], [0, 0.9, 0.9, 0]);

  return (
    <>
      {/* Outgoing section — pure opacity fade, no distorting mask */}
      <motion.div style={{ opacity: firstOpacity }} className="absolute inset-0">
        {first}
      </motion.div>

      {/* Colour bleed overlay — appears only during transition */}
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

      {/* Incoming section — revealed via growing blob mask */}
      <motion.div
        style={{ WebkitMaskImage: meshMask, maskImage: meshMask }}
        className="absolute inset-0"
      >
        {second}
      </motion.div>
    </>
  );
}

/**
 * MeshGradientMorph – animated mesh gradient blobs grow to reveal the incoming section.
 * The outgoing section fades out cleanly (no mask applied to it).
 * Dead zone 0→0.30 keeps the first section fully readable.
 */
export function MeshGradientMorph({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
