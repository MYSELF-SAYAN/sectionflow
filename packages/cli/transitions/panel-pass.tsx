'use client';

import { motion, useTransform } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Content-sampling horizontal panel pass (V1 Architecture).
 *
 * Two horizontal panels (top and bottom) slide in from opposite sides,
 * carrying the incoming content, scale to 1, and fuse into a seamless whole.
 *
 * Mapped Timeline:
 * 0.00 - 0.25: Dead zone.
 * 0.25 - 0.75: Top panel slides from -102% to 0%; Bottom slides from 102% to 0%.
 * 0.25 - 0.72: Outgoing layer dims.
 * 0.75: Panels lock, real incoming layer becomes visible.
 */
export function PanelPass({ progress, outgoing, incoming }: TransitionProps) {
  // Exact V1 timing mapping
  const topX = useTransform(progress, [0.25, 0.75], ['-102%', '0%']);
  const bottomX = useTransform(progress, [0.25, 0.75], ['102%', '0%']);
  const innerScale = useTransform(progress, [0.25, 0.75], [0.94, 1]);
  const dim = useTransform(progress, [0.25, 0.72], [1, 0.4]);

  // Choreography
  outgoing.style.opacity = dim;

  // Hide the real incoming layer until panels lock (at 0.75)
  incoming.style.opacity = useTransform(progress, [0, 0.749, 0.75], [0, 0, 1]);

  // Panels opacity (fade out as they lock to reveal the real layer seamlessly)
  const panelOpacity = useTransform(progress, [0, 0.749, 0.75], [1, 1, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {/* Top Panel */}
      <motion.div
        style={{ x: topX, opacity: panelOpacity }}
        className="absolute left-0 top-0 h-1/2 w-full overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.3)]"
      >
        <motion.div
          style={{ scale: innerScale }}
          className="absolute left-0 top-0 h-[200%] w-full"
        >
          {incoming.render?.()}
        </motion.div>
      </motion.div>

      {/* Bottom Panel */}
      <motion.div
        style={{ x: bottomX, opacity: panelOpacity }}
        className="absolute bottom-0 left-0 h-1/2 w-full overflow-hidden shadow-[0_-15px_30px_rgba(0,0,0,0.3)]"
      >
        <motion.div
          style={{ scale: innerScale }}
          className="absolute left-0 top-[-100%] h-[200%] w-full"
        >
          {incoming.render?.()}
        </motion.div>
      </motion.div>
    </div>
  );
}

// Ensure SectionFlow renders the clones required for this effect
(PanelPass as TransitionComponent).copies = true;