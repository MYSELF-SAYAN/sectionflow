'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Multi-Layer Scroll (Horizontal Interlaced Edition).
 *
 * Horizontal strips of the incoming section slide in from alternating 
 * left and right edges. They have uneven, randomized timings for an 
 * organic assembly effect, resolving seamlessly into the final section.
 */
const LAYER_COUNT = 6;

function seeded(i: number): number {
  const x = Math.sin((i + 1.2) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

function LayerStrip({
  index,
  progress,
  incoming,
}: {
  index: number;
  progress: MotionValue<number>;
  incoming: TransitionProps['incoming'];
}) {
  const s = seeded(index);
  
  // Alternating entry: Even indices from the left, Odd from the right
  const isLeft = index % 2 === 0;
  const startX = isLeft ? '-100%' : '100%';

  // Uneven stagger: completely randomized start times for the "uneven" look
  const delay = 0.10 + s * 0.35; 
  const end = Math.min(0.90, delay + 0.45);

  // Pure horizontal sliding motion
  const x = useTransform(progress, [delay, end], [startX, '0%']);

  // Strips fade in as they start moving, hold their position once they arrive,
  // and instantly hand off to the main layer at 0.95 to hide layer lines.
  const opacity = useTransform(
    progress,
    [0, delay - 0.01, delay + 0.05, 0.95, 0.96],
    [0, 0, 1, 1, 0]
  );

  return (
    <motion.div
      aria-hidden
      className="absolute w-full overflow-hidden will-change-transform bg-[#0e0e11]"
      style={{
        top: `${(index / LAYER_COUNT) * 100}%`,
        height: `${100 / LAYER_COUNT}%`,
        x: x as MotionValue<string>,
        opacity: opacity as MotionValue<number>,
        zIndex: 30,
        // Drop shadow separates the sliding layers from the background
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* Clones the incoming section and aligns it inside the horizontal strip */}
      <div
        className="absolute w-full"
        style={{
          top: `-${index * 100}%`,
          height: `${LAYER_COUNT * 100}%`,
        }}
      >
        {incoming.render?.()}
      </div>
    </motion.div>
  );
}

export function MultiLayerScroll({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * Base Layer Choreography
   */
  // Outgoing fades out in the background as the strips cover it
  outgoing.style.opacity = useTransform(progress, [0, 0.5], [1, 0]);

  // The solid incoming layer is hidden during the strip assembly.
  // It instantly becomes visible at 0.95, locking everything together flawlessly.
  incoming.style.opacity = useTransform(progress, [0, 0.95, 0.96], [0, 0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {Array.from({ length: LAYER_COUNT }).map((_, i) => (
        <LayerStrip
          key={i}
          index={i}
          progress={progress}
          incoming={incoming}
        />
      ))}
    </div>
  );
}

(MultiLayerScroll as TransitionComponent).copies = true;