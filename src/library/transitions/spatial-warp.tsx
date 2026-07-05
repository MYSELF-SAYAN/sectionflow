'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay gravitational-lens warp.
 *
 * Horizontal strips skew and stretch in a wave centred on the viewport midline,
 * bending space between sections before snapping back with the new section in
 * place. The strips are effect overlays; the outgoing dims while the incoming
 * fades in at peak warp.
 *
 * Shape: effect-overlay (warped strips above the two layers) + minor layer
 * choreography (opacity on both layers).
 */
const STRIP_COUNT = 20;

function stripCenter(i: number): number {
  return Math.abs(i - (STRIP_COUNT - 1) / 2) / ((STRIP_COUNT - 1) / 2);
}

export function SpatialWarp({ progress, outgoing, incoming }: TransitionProps) {
  const strips = Array.from({ length: STRIP_COUNT }, (_, i) => {
    const dist = stripCenter(i);
    const skewMag = 18 * (1 - dist);
    const scaleMag = 1 + 0.6 * (1 - dist);
    const peak = 0.3 + dist * 0.16;
    // Warp out to peak, then snap back to identity.
    const skew = useTransform(progress, [0, peak, peak + 0.26, 1], [0, skewMag, 0, 0]);
    const scale = useTransform(progress, [0, peak, peak + 0.22, 1], [1, scaleMag, 1, 1]);
    return { i, skew, scale } as const;
  });

  const firstOpacity = useTransform(progress, [0, 0.55], [1, 0]);
  const secondOpacity = useTransform(progress, [0.4, 0.85], [0, 1]);

  outgoing.style.opacity = firstOpacity;
  incoming.style.opacity = secondOpacity;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col overflow-hidden">
      {strips.map((s) => (
        <motion.div
          key={s.i}
          aria-hidden
          style={{
            skewY: s.skew as MotionValue<number>,
            scaleX: s.scale as MotionValue<number>,
          }}
          className="relative flex-1 overflow-hidden bg-[#0e0e11]/30"
        />
      ))}
    </div>
  );
}
