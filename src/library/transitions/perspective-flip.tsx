'use client';

import { useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Layer-choreography 3D flip (V1 Exact Timings).
 *
 * Sections rotate through 3D space around a shared horizon. The outgoing layer
 * tilts back and fades while the incoming layer rotates up from below and
 * settles into place. Both layers carry rotateX transforms via their handles.
 *
 * Mapped Timeline:
 * 0.25 - 0.58: Outgoing layer tilts back (-22deg) and scales down.
 * 0.42 - 0.58: Outgoing layer fades out.
 * 0.48 - 0.80: Incoming layer rotates up (58deg to 0deg) and moves up (42% to 0%).
 * 0.48 - 0.60: Incoming layer fades in.
 */
export function PerspectiveFlip({ progress, outgoing, incoming }: TransitionProps) {
  // V1 Exact Timings - Outgoing
  const rxFirst = useTransform(progress, [0.25, 0.58], [0, -22]);
  const oFirst = useTransform(progress, [0.42, 0.58], [1, 0]);
  const sFirst = useTransform(progress, [0.25, 0.58], [1, 0.9]);

  // V1 Exact Timings - Incoming
  const rxSecond = useTransform(progress, [0.48, 0.80], [58, 0]);
  const ySecond = useTransform(progress, [0.48, 0.80], ['42%', '0%']);
  const oSecond = useTransform(progress, [0.48, 0.60], [0, 1]);

  // Apply to Outgoing
  outgoing.style.rotateX = rxFirst;
  outgoing.style.opacity = oFirst;
  outgoing.style.scale = sFirst;
  outgoing.style.transformOrigin = 'center top';
  outgoing.style.transformPerspective = 1400; // Directly applies V1 wrapper perspective

  // Apply to Incoming
  incoming.style.rotateX = rxSecond;
  incoming.style.y = ySecond;
  incoming.style.opacity = oSecond;
  incoming.style.transformOrigin = 'center bottom';
  incoming.style.transformPerspective = 1400; // Directly applies V1 wrapper perspective

  // Pure layer choreography, no extra overlays needed
  return null;
}