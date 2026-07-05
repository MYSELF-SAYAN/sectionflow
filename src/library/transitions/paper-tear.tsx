'use client';

import { motion, useTransform } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * Paper Tear
 *
 * The outgoing section is treated like a sheet of paper. The instant the tear
 * begins, the actual outgoing layer disappears and the incoming layer is fully
 * revealed underneath. Only the two torn paper halves continue animating,
 * creating a convincing reveal effect.
 */

const TEAR_UPPER = [
  [0, 0],
  [100, 0],
  [100, 48],
  [94, 52],
  [88, 47],
  [82, 54],
  [76, 49],
  [70, 56],
  [64, 50],
  [58, 57],
  [52, 51],
  [46, 58],
  [40, 52],
  [34, 59],
  [28, 53],
  [22, 60],
  [16, 54],
  [10, 60],
  [4, 54],
  [0, 58],
];

const TEAR_LOWER = [
  [0, 58],
  [4, 62],
  [10, 56],
  [16, 63],
  [22, 57],
  [28, 64],
  [34, 58],
  [40, 65],
  [46, 59],
  [52, 66],
  [58, 60],
  [64, 67],
  [70, 61],
  [76, 68],
  [82, 62],
  [88, 68],
  [94, 62],
  [100, 68],
  [100, 100],
  [0, 100],
];

const pts = (points: number[][]) =>
  `polygon(${points
    .map(([x, y]) => `${x}% ${y}%`)
    .join(', ')})`;

const UPPER_CLIP = pts(TEAR_UPPER);
const LOWER_CLIP = pts(TEAR_LOWER);

export function PaperTear({
  progress,
  outgoing,
  incoming,
}: TransitionProps) {
  // Movement
  const upperY = useTransform(progress, [0, 1], ['0%', '-60%']);
  const lowerY = useTransform(progress, [0, 1], ['0%', '60%']);

  const upperRotate = useTransform(progress, [0, 1], [0, -4]);
  const lowerRotate = useTransform(progress, [0, 1], [0, 3]);

  // Hide seam before tear starts
  const coverOpacity = useTransform(progress, [0, 0.015], [1, 0]);

  // Tear shadow
  const seamShadow = useTransform(
    progress,
    [0, 0.15, 0.5, 1],
    [0, 0.65, 0.25, 0]
  );

  // Torn paper disappears once animation finishes
  const tearOpacity = useTransform(
    progress,
    [0, 0.98, 0.99, 1],
    [1, 1, 0, 0]
  );

  /**
   * IMPORTANT
   *
   * The instant the tear begins:
   * - outgoing layer disappears
   * - incoming layer becomes fully visible
   *
   * This creates a true reveal instead of a crossfade.
   */
  outgoing.style.opacity = useTransform(
    progress,
    [0, 0.015, 0.02],
    [1, 1, 0]
  );

  incoming.style.opacity = useTransform(
    progress,
    [0, 0.015, 0.02],
    [0, 0, 1]
  );

  return (
    <>
      {/* Incoming reveal shadow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          opacity: seamShadow,
          background:
            'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.5) 52%, transparent 65%)',
        }}
      />

      {/* Upper torn half */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden origin-top"
        style={{
          y: upperY,
          rotate: upperRotate,
          clipPath: UPPER_CLIP,
          opacity: tearOpacity,
        }}
      >
        {outgoing.render?.()}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, transparent 44%, rgba(255,255,255,0.15) 50%, transparent 52%)',
          }}
        />
      </motion.div>

      {/* Lower torn half */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden origin-bottom"
        style={{
          y: lowerY,
          rotate: lowerRotate,
          clipPath: LOWER_CLIP,
          opacity: tearOpacity,
        }}
      >
        {outgoing.render?.()}

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.25) 56%, transparent 62%)',
          }}
        />
      </motion.div>

      {/* Cover hides seam until tear begins */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          opacity: coverOpacity,
        }}
      >
        {outgoing.render?.()}
      </motion.div>
    </>
  );
}

(PaperTear as TransitionComponent).copies = true;