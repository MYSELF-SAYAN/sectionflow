'use client';

import { motion, useMotionTemplate, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay transition.
 *
 * An SVG wave cap rides the top edge of the incoming section as it slides up
 * from below, while the outgoing section dims behind it. The wave is an
 * overlay owned entirely by this transition — the section content is never
 * touched.
 *
 * Shape: effect-overlay (overlay SVG painted above the two layers) + minor
 * layer choreography (y on incoming, opacity on outgoing).
 */
export function WaveReveal({ progress, outgoing, incoming }: TransitionProps) {
  const y = useTransform(progress, [0, 1], ['102%', '0%']);
  const dim = useTransform(progress, [0, 1], [1, 0.55]);
  const waveScale = useTransform(progress, [0, 0.5, 1], [1, 1.6, 0.0001]);

  outgoing.style.opacity = dim;
  incoming.style.y = y;

  return (
    <motion.div
      aria-hidden
      style={{
        scaleY: waveScale,
        color: '#0e0e11',
      }}
      className="pointer-events-none absolute top-[-12vh] left-0 z-20 h-[12.5vh] w-full origin-bottom"
    >
      <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 1440 100">
        <path
          fill="currentColor"
          d="M0 100 C 240 20 480 0 720 30 C 960 60 1200 30 1440 70 L 1440 100 Z"
        />
      </svg>
    </motion.div>
  );
}
