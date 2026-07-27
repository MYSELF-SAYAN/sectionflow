'use client';

import { motion, useTransform } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Gravity Flip
 *
 * The world's gravity rotates 180°. The outgoing section "falls" upward
 * (rotating and shrinking as if gravity reversed), while the incoming
 * section drops in from above, overshoots, and bounces into place —
 * like a UI that just had its gravity flipped.
 *
 * Mapped Timeline:
 * 0.00 – 0.10: Dead zone (reading window).
 * 0.10 – 0.50: Outgoing lifts off, rotates, shrinks, fades.
 * 0.35 – 0.80: Incoming falls in from above with rotation.
 * 0.80 – 1.00: Incoming settles with elastic bounce.
 */
export function GravityFlip({ progress, outgoing, incoming }: TransitionProps) {
  // ── Outgoing: gravity reverses, section "falls" upward ─────────────────
  const outY = useTransform(progress, [0.1, 0.5], ['0%', '-120%']);
  const outRotate = useTransform(progress, [0.1, 0.5], [0, -8]);
  const outScale = useTransform(progress, [0.1, 0.5], [1, 0.85]);
  const outOpacity = useTransform(progress, [0.1, 0.45, 0.5], [1, 0.6, 0]);

  // ── Incoming: drops in from above, bounces on landing ──────────────────
  const inY = useTransform(
    progress,
    [0.35, 0.65, 0.80, 0.90, 1.0],
    ['100%', '-4%', '2%', '-1%', '0%'],
  );
  const inRotate = useTransform(
    progress,
    [0.35, 0.65, 0.80, 1.0],
    [6, -1.5, 0.5, 0],
  );
  const inScale = useTransform(
    progress,
    [0.35, 0.65, 0.80, 0.90, 1.0],
    [0.9, 1.03, 0.99, 1.01, 1],
  );
  const inOpacity = useTransform(progress, [0.35, 0.45], [0, 1]);

  // Apply to outgoing layer
  outgoing.style.y = outY;
  outgoing.style.rotate = outRotate;
  outgoing.style.scale = outScale;
  outgoing.style.opacity = outOpacity;
  outgoing.style.transformOrigin = 'center top';

  // Apply to incoming layer
  incoming.style.y = inY;
  incoming.style.rotate = inRotate;
  incoming.style.scale = inScale;
  incoming.style.opacity = inOpacity;
  incoming.style.transformOrigin = 'center bottom';

  // Overlay: a brief shadow that sweeps through mid-transition
  const shadowOpacity = useTransform(
    progress,
    [0.3, 0.5, 0.7],
    [0, 0.25, 0],
  );

  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-30"
      style={{
        opacity: shadowOpacity,
        background:
          'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.6) 100%)',
      }}
    />
  );
}
