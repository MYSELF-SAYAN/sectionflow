'use client';

import { useSpring, useTransform, useVelocity } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography scroll warp (V1 Velocity Edition).
 *
 * Scroll velocity drives a dynamic spring that skews and stretches the
 * sections in real-time. The outgoing section slides up while the 
 * incoming section slides in from the bottom.
 *
 * Mapped Timeline:
 * 0.25 - 0.78: Outgoing layer slides up (0% to -100%).
 * 0.30 - 0.82: Incoming layer slides up (100% to 0%).
 */
export function ScrollWarp({ progress, outgoing, incoming }: TransitionProps) {
  // V1 Velocity Physics
  // Tracks the speed of the scroll progress and applies a spring-loaded skew/stretch
  const v = useVelocity(progress);
  const skew = useSpring(useTransform(v, [-3, 3], [7, -7]), { 
    stiffness: 260, 
    damping: 24 
  });
  const stretch = useSpring(useTransform(v, [-3, 0, 3], [1.1, 1, 1.1]), { 
    stiffness: 260, 
    damping: 24 
  });

  // V1 Exact Timings
  const outY = useTransform(progress, [0.25, 0.78], ['0%', '-100%']);
  const inY = useTransform(progress, [0.30, 0.82], ['100%', '0%']);

  // Apply to Outgoing
  outgoing.style.y = outY;
  outgoing.style.skewY = skew;
  outgoing.style.scaleY = stretch;

  // Apply to Incoming
  incoming.style.y = inY;
  incoming.style.skewY = skew;
  incoming.style.scaleY = stretch;

  // Pure layer choreography, no extra effect overlays needed
  return null;
}