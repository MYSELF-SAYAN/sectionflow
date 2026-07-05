'use client';

import { motion, useTransform } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Content-sampling vertical split (V1 Architecture).
 *
 * Two vertical panels slide in from top/bottom (carrying the incoming content),
 * fuse, and then reveal the underlying incoming layer once locked.
 *
 * Mapped Timeline:
 * 0.00 - 0.25: Dead zone.
 * 0.25 - 0.75: Panels slide from 102% offset to 0%.
 * 0.25 - 0.72: Outgoing layer dims.
 * 0.75: Panels lock, real incoming layer becomes visible.
 */
export function VerticalSplit({ progress, outgoing, incoming }: TransitionProps) {
  // Exact V1 timing mapping
  const leftY = useTransform(progress, [0.25, 0.75], ['-102%', '0%']);
  const rightY = useTransform(progress, [0.25, 0.75], ['102%', '0%']);
  const innerScale = useTransform(progress, [0.25, 0.75], [0.94, 1]);
  const dim = useTransform(progress, [0.25, 0.72], [1, 0]);

  // Choreography
  outgoing.style.opacity = dim;
  
  // Hide real incoming layer until doors lock (at 0.75)
  incoming.style.opacity = useTransform(progress, [0, 0.749, 0.75], [0, 0, 1]);
  
  // Doors opacity (fade out as they lock to reveal real layer)
  const doorOpacity = useTransform(progress, [0, 0.749, 0.75], [1, 1, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Left Panel */}
      <motion.div 
        style={{ y: leftY, opacity: doorOpacity }} 
        className="absolute left-0 top-0 h-full w-1/2 overflow-hidden"
      >
        <motion.div 
          style={{ scale: innerScale }} 
          className="absolute left-0 top-0 h-full w-[200%]"
        >
          {incoming.render?.()}
        </motion.div>
      </motion.div>

      {/* Right Panel */}
      <motion.div 
        style={{ y: rightY, opacity: doorOpacity }} 
        className="absolute right-0 top-0 h-full w-1/2 overflow-hidden"
      >
        <motion.div 
          style={{ scale: innerScale }} 
          className="absolute -left-full top-0 h-full w-[200%]"
        >
          {incoming.render?.()}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Ensure SectionFlow renders the clones
(VerticalSplit as TransitionComponent).copies = true;