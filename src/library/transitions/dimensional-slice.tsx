'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Dimensional Slice (Premium).
 *
 * Invisible planes slice the viewport into thick 3D slabs. The slabs
 * separate from each other vertically — pulling apart to expose the
 * incoming section in the widening gaps. Each slab tilts slightly on
 * its own axis and drifts at a different speed, selling the illusion
 * of heavy physical pieces floating apart in 3D space.
 *
 * The 3D feel comes from:
 *   • Strong perspective on a parent container
 *   • rotateX tilt that differs per slab (top slabs tilt back, bottom forward)
 *   • Subtle lateral drift (not extreme slide)
 *   • Shadow strips between slabs to fake edge thickness
 *   • Scale-down as slabs recede into depth
 */

const SLAB_COUNT = 5;

function Slab({
  index,
  total,
  progress,
  outgoing,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  outgoing: TransitionProps['outgoing'];
}) {
  // Slab geometry
  const slabHeight = 100 / total;
  const topPercent = index * slabHeight;

  // How far from centre this slab is (−1 to +1, 0 = middle)
  const normPos = (index - (total - 1) / 2) / ((total - 1) / 2);

  // Stagger: centre slabs move first, edges follow
  const centrality = 1 - Math.abs(normPos);
  const delay = 0.12 + (1 - centrality) * 0.10;
  const endMove = Math.min(0.82, delay + 0.45);
  const endFade = Math.min(0.95, endMove + 0.12);

  // ── Vertical separation: slabs pull apart from each other ──────────────
  // Top slabs move up, bottom slabs move down, middle barely moves
  const separationY = normPos * (55 + Math.abs(normPos) * 30);
  const y = useTransform(progress, [0, delay, endMove], [0, 0, separationY]);

  // ── Subtle lateral drift (NOT extreme slide) ───────────────────────────
  const lateralDir = index % 2 === 0 ? -1 : 1;
  const lateralDist = lateralDir * (3 + Math.abs(normPos) * 5);
  const x = useTransform(progress, [0, delay, endMove], [0, 0, lateralDist]);

  // ── 3D rotation: top slabs tilt back, bottom tilt forward ──────────────
  const tiltX = -normPos * 12; // degrees
  const rotateX = useTransform(progress, [0, delay, endMove], [0, 0, tiltX]);

  // Very subtle Y-axis rotation for lateral feel
  const tiltY = lateralDir * 3;
  const rotateY = useTransform(progress, [0, delay, endMove], [0, 0, tiltY]);

  // ── Depth recession ────────────────────────────────────────────────────
  const zDepth = -(20 + Math.abs(normPos) * 40);
  const z = useTransform(progress, [0, delay, endMove], [0, 0, zDepth]);

  // Scale down as they recede
  const scale = useTransform(progress, [0, delay, endMove], [1, 1, 0.96]);

  // Opacity
  const opacity = useTransform(
    progress,
    [0, 0.11, 0.12, endMove, endFade],
    [0, 0, 1, 0.9, 0],
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 will-change-transform"
      style={{
        clipPath: `inset(${topPercent}% 0 ${100 - topPercent - slabHeight}% 0)`,
        x: x as MotionValue<number>,
        y: y as MotionValue<number>,
        z: z as MotionValue<number>,
        rotateX: rotateX as MotionValue<number>,
        rotateY: rotateY as MotionValue<number>,
        scale: scale as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
        transformOrigin: 'center center',
        // Fake edge shadow on exposed top/bottom faces
        boxShadow:
          normPos < 0
            ? '0 8px 24px -4px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)'
            : '0 -8px 24px -4px rgba(0,0,0,0.5), 0 -2px 6px rgba(0,0,0,0.3)',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {outgoing.render?.()}
      </div>
    </motion.div>
  );
}

export function DimensionalSlice({ progress, outgoing, incoming }: TransitionProps) {
  // Outgoing cover: solid until trigger, then vanishes to reveal slabs
  outgoing.style.opacity = useTransform(
    progress,
    [0, 0.11, 0.12],
    [1, 1, 0],
  );

  // Incoming revealed underneath as gaps widen
  incoming.style.opacity = useTransform(progress, [0.15, 0.50], [0, 1]);

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      style={{ perspective: '900px' }}
    >
      {Array.from({ length: SLAB_COUNT }, (_, i) => (
        <Slab
          key={i}
          index={i}
          total={SLAB_COUNT}
          progress={progress}
          outgoing={outgoing}
        />
      ))}
    </div>
  );
}

(DimensionalSlice as TransitionComponent).copies = true;
