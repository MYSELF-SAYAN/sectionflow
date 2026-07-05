'use client';

import { motion, useTransform } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Content-sampling diagonal split (V1 Architecture).
 *
 * Two triangular shards containing the actual incoming content fly in from 
 * opposite corners and fuse together. The base incoming layer is hidden 
 * until the fusion is complete, at which point the shards disappear to 
 * restore standard interactivity.
 *
 * Mapped Timeline (from V1):
 * 0.00 - 0.25: Dead zone (No movement).
 * 0.25 - 0.72: Outgoing layer dims to 0.4.
 * 0.25 - 0.75: Incoming diagonal shards fly from +/- 120% to 0%.
 * 0.75: Shards vanish and the real interactive incoming section appears.
 */
export function DiagonalSplit({ progress, outgoing, incoming }: TransitionProps) {
  // V1 Exact Trajectories
  const a = useTransform(progress, [0.25, 0.75], ['-120%', '0%']);
  const b = useTransform(progress, [0.25, 0.75], ['120%', '0%']);
  
  // V1 Exact Dimming
  const dim = useTransform(progress, [0.25, 0.72], [1, 0.4]);

  /*
   * Base Layer Choreography
   */
  outgoing.style.opacity = dim;
  
  // Keep the real incoming section hidden until the shards finish fusing
  incoming.style.opacity = useTransform(progress, [0, 0.749, 0.75], [0, 0, 1]);

  // Shards remain visible during the flight, then vanish at the exact fusion point
  const shardOpacity = useTransform(progress, [0, 0.749, 0.75], [1, 1, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Top Left Triangle */}
      <motion.div
        aria-hidden
        style={{ 
          x: a, 
          y: a, 
          clipPath: 'polygon(0% 0%, 100.5% 0%, 0% 100.5%)',
          opacity: shardOpacity 
        }}
        className="absolute inset-0 will-change-transform"
      >
        {incoming.render?.()}
      </motion.div>

      {/* Bottom Right Triangle */}
      <motion.div
        aria-hidden
        style={{ 
          x: b, 
          y: b, 
          clipPath: 'polygon(100% -0.5%, 100% 100%, -0.5% 100%)',
          opacity: shardOpacity
        }}
        className="absolute inset-0 will-change-transform"
      >
        {incoming.render?.()}
      </motion.div>
    </div>
  );
}

// Ensure SectionFlow knows it needs to provide `incoming.render()` for the clones
(DiagonalSplit as TransitionComponent).copies = true;