'use client';

import { motion, useTransform, useMotionTemplate, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Origami Fold (Premium).
 *
 * The outgoing section folds inward like origami paper — four horizontal
 * strips fold in sequence, each hinging from its own edge, collapsing
 * the page into a compact folded form. Then the incoming section unfolds
 * outward from the same structure, strip by strip, settling into a flat
 * page.
 *
 * The 3D realism comes from:
 *   • Each strip rotates on its own hinge axis (top or bottom edge)
 *   • brightness() darkens as strips fold away from the viewer
 *   • Alternating hinge directions create the accordion/origami feel
 *   • Subtle shadows between folds for depth
 *
 * Timeline:
 * 0.00 – 0.10: Dead zone.
 * 0.10 – 0.50: Outgoing folds inward — strips collapse in sequence.
 * 0.45 – 0.55: Crossover — both sections at mid-fold.
 * 0.50 – 0.90: Incoming unfolds outward — strips open in sequence.
 * 0.90 – 1.00: Incoming fully flat.
 */

const STRIP_COUNT = 4;

function OutgoingStrip({
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
  const stripHeight = 100 / total;
  const topPercent = index * stripHeight;

  // Alternating hinge: even strips fold from top, odd from bottom
  const hingeTop = index % 2 === 0;
  const origin = hingeTop ? `center ${topPercent}%` : `center ${topPercent + stripHeight}%`;

  // Staggered fold timing: top strip starts first
  const delay = 0.10 + index * 0.08;
  const endFold = Math.min(0.55, delay + 0.28);

  // Fold angle: 0 → ±90° (alternating direction for accordion effect)
  const foldAngle = hingeTop ? 90 : -90;
  const rotateX = useTransform(progress, [0, delay, endFold], [0, 0, foldAngle]);

  // Darken as the strip folds away from viewer
  const brightness = useTransform(progress, [delay, endFold], [1, 0.3]);
  const filter = useMotionTemplate`brightness(${brightness})`;

  // Fade out once fully folded
  const opacity = useTransform(
    progress,
    [0, 0.09, 0.10, endFold, Math.min(0.60, endFold + 0.06)],
    [0, 0, 1, 1, 0],
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 will-change-transform"
      style={{
        clipPath: `inset(${topPercent}% 0 ${100 - topPercent - stripHeight}% 0)`,
        rotateX: rotateX as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
        filter,
        transformOrigin: origin,
        transformPerspective: 1000,
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {outgoing.render?.()}
      </div>
    </motion.div>
  );
}

function IncomingStrip({
  index,
  total,
  progress,
  incoming,
}: {
  index: number;
  total: number;
  progress: MotionValue<number>;
  incoming: TransitionProps['incoming'];
}) {
  const stripHeight = 100 / total;
  const topPercent = index * stripHeight;

  // Alternating hinge: mirrors outgoing
  const hingeTop = index % 2 === 0;
  const origin = hingeTop ? `center ${topPercent}%` : `center ${topPercent + stripHeight}%`;

  // Reverse stagger: bottom strips unfold first
  const reverseIndex = total - 1 - index;
  const delay = 0.50 + reverseIndex * 0.08;
  const endUnfold = Math.min(0.92, delay + 0.28);

  // Start folded, unfold to flat
  const startAngle = hingeTop ? -90 : 90;
  const rotateX = useTransform(progress, [delay, endUnfold], [startAngle, 0]);

  // Brighten as strip faces the viewer
  const brightness = useTransform(progress, [delay, endUnfold], [0.3, 1]);
  const filter = useMotionTemplate`brightness(${brightness})`;

  // Appear once unfolding starts
  const opacity = useTransform(
    progress,
    [0, delay - 0.01, delay, endUnfold],
    [0, 0, 1, 1],
  );

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 will-change-transform"
      style={{
        clipPath: `inset(${topPercent}% 0 ${100 - topPercent - stripHeight}% 0)`,
        rotateX: rotateX as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
        filter,
        transformOrigin: origin,
        transformPerspective: 1000,
        backfaceVisibility: 'hidden',
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {incoming.render?.()}
      </div>
    </motion.div>
  );
}

export function OrigamiFold({ progress, outgoing, incoming }: TransitionProps) {
  // Hide the real layers — the strips carry cloned content
  outgoing.style.opacity = useTransform(
    progress,
    [0, 0.09, 0.10],
    [1, 1, 0],
  );
  incoming.style.opacity = useTransform(
    progress,
    [0, 0.88, 0.90],
    [0, 0, 1],
  );

  return (
    <div
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
      style={{ perspective: '1000px' }}
    >
      {/* Outgoing strips fold in */}
      {Array.from({ length: STRIP_COUNT }, (_, i) => (
        <OutgoingStrip
          key={`out-${i}`}
          index={i}
          total={STRIP_COUNT}
          progress={progress}
          outgoing={outgoing}
        />
      ))}

      {/* Incoming strips unfold out */}
      {Array.from({ length: STRIP_COUNT }, (_, i) => (
        <IncomingStrip
          key={`in-${i}`}
          index={i}
          total={STRIP_COUNT}
          progress={progress}
          incoming={incoming}
        />
      ))}
    </div>
  );
}

(OrigamiFold as TransitionComponent).copies = true;
