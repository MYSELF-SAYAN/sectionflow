'use client';

import { motion, useTransform, useMotionTemplate } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Mirror Reflection (Premium).
 *
 * A frosted mirror surface sweeps vertically across the viewport.
 * The outgoing section dims and blurs behind the advancing mirror, while
 * the incoming section is progressively revealed beneath it.
 *
 * Clean, minimal overlay — just the frosted band with backdrop-blur.
 */
export function MirrorReflection({ progress, outgoing, incoming }: TransitionProps) {
  // ── Outgoing: dim and soften behind the advancing mirror ───────────────
  const outOpacity = useTransform(progress, [0.10, 0.70], [1, 0]);
  const outBlur = useTransform(progress, [0.10, 0.50], [0, 6]);
  const outBrightness = useTransform(progress, [0.10, 0.50], [1, 0.4]);
  const outFilter = useMotionTemplate`blur(${outBlur}px) brightness(${outBrightness})`;

  outgoing.style.opacity = outOpacity;
  outgoing.style.filter = outFilter;

  // ── Incoming: revealed via clip-path following the mirror edge ──────────
  const clipTop = useTransform(progress, [0.10, 0.75], [0, 100]);
  const clipPath = useMotionTemplate`inset(0 0 ${useTransform(clipTop, (v) => 100 - v)}% 0)`;

  incoming.style.clipPath = clipPath;
  incoming.style.opacity = useTransform(progress, [0.10, 0.20], [0, 1]);

  // ── Mirror surface position ────────────────────────────────────────────
  const mirrorY = useTransform(progress, [0.10, 0.75], [0, 100]);
  const mirrorOpacity = useTransform(
    progress,
    [0.08, 0.15, 0.70, 0.80],
    [0, 1, 1, 0],
  );
  const mirrorTop = useMotionTemplate`${mirrorY}%`;

  return (
    <motion.div
      className="pointer-events-none absolute left-0 right-0 z-30"
      style={{
        top: mirrorTop,
        height: '12vh',
        opacity: mirrorOpacity,
        translateY: '-50%',
        background: `linear-gradient(
          to bottom,
          transparent 0%,
          rgba(200, 215, 230, 0.08) 15%,
          rgba(210, 225, 240, 0.25) 35%,
          rgba(235, 245, 255, 0.5) 48%,
          rgba(255, 255, 255, 0.65) 50%,
          rgba(235, 245, 255, 0.5) 52%,
          rgba(210, 225, 240, 0.25) 65%,
          rgba(200, 215, 230, 0.08) 85%,
          transparent 100%
        )`,
        backdropFilter: 'blur(8px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(8px) saturate(1.5)',
      }}
    />
  );
}

(MirrorReflection as TransitionComponent).copies = false;
