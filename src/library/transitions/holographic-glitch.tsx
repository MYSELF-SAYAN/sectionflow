'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay holographic glitch.
 *
 * Scanline corruption, RGB channel splits, and chromatic aberration tear
 * the outgoing section apart like a failing hologram — leaving the next
 * section fully intact. The glitch is a pure geometry overlay with
 * colour-split scanlines; the outgoing dims while the incoming fades in.
 *
 * Shape: effect-overlay (scanlines + channel splits) + minor layer
 * choreography.
 */
const SCANLINES = 12;
const SPLITS = 6;

function seeded(i: number): number {
  const x = Math.sin((i + 0.5) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

export function HolographicGlitch({ progress, outgoing, incoming }: TransitionProps) {
  const firstOpacity = useTransform(progress, [0, 0.55], [1, 0]);
  const secondOpacity = useTransform(progress, [0.45, 0.9], [0, 1]);

  outgoing.style.opacity = firstOpacity;
  incoming.style.opacity = secondOpacity;

  // Scanlines flash on and off
  const scanlines = Array.from({ length: SCANLINES }, (_, i) => {
    const s = seeded(i);
    const top = `${10 + s * 80}%`;
    const flash = Math.floor(i / 2);
    const delay = flash * 0.08 + s * 0.03;
    const opacity = useTransform(
      progress,
      [delay, delay + 0.03, delay + 0.06, delay + 0.1, delay + 0.13],
      [0, 0.8, 0, 0.6, 0],
    );
    return { i, top, opacity, height: '2px' } as const;
  });

  // Channel-split horizontal bands
  const splits = Array.from({ length: SPLITS }, (_, i) => {
    const s = seeded(i + 50);
    const top = `${s * 90}%`;
    const height = 3 + s * 6;
    const delay = 0.05 + s * 0.2;
    const x = useTransform(progress, [delay, delay + 0.1, delay + 0.2], [0, (s - 0.5) * 20, 0]);
    const opacity = useTransform(progress, [delay, delay + 0.05, delay + 0.2], [0, 0.7, 0]);
    const hue = [0, 120, 240][i % 3];
    return { i, top, height, x, opacity, hue } as const;
  });

  return (
    <>
      <div className="pointer-events-none absolute inset-0 z-20">
        {scanlines.map(({ i, top, opacity, height }) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: scanline index is stable
            key={`sl-${i}`}
            aria-hidden
            className="absolute inset-x-0"
            style={{
              top,
              height,
              opacity: opacity as MotionValue<number>,
              background: 'rgba(255,255,255,0.8)',
              mixBlendMode: 'overlay',
            }}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {splits.map(({ i, top, height, x, opacity, hue }) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: split index is stable
            key={`sp-${i}`}
            aria-hidden
            className="absolute inset-x-0"
            style={{
              top,
              height: `${height}px`,
              x: x as MotionValue<number>,
              opacity: opacity as MotionValue<number>,
              background: `hsla(${hue}, 100%, 60%, 0.6)`,
              mixBlendMode: 'screen',
            }}
          />
        ))}
      </div>
    </>
  );
}
