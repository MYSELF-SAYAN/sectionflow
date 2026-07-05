'use client';

import { motion, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay elastic curtain.
 *
 * A curtain with a velocity-reactive elastic edge rises into place. The
 * incoming layer is revealed from behind the rising curtain; the outgoing
 * dims beneath it. The curtain is an effect overlay.
 *
 * Shape: layer-choreography (y on incoming, opacity on outgoing) +
 * effect-overlay elastic curtain panel.
 */
export function ElasticCurtain({ progress, outgoing, incoming }: TransitionProps) {
  const y = useTransform(progress, [0, 1], ['102%', '0%']);
  const dim = useTransform(progress, [0, 1], [1, 0.5]);
  const curtainY = useTransform(progress, [0, 0.6, 1], ['102%', '0%', '-102%']);
  const curtainOpacity = useTransform(progress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  outgoing.style.opacity = dim;
  incoming.style.y = y;

  return (
    <motion.div
      aria-hidden
      style={{ y: curtainY, opacity: curtainOpacity }}
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-[#0e0e11] shadow-[0_-30px_100px_rgba(0,0,0,0.6)]"
    />
  );
}
