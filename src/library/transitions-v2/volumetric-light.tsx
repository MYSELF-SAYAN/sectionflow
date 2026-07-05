'use client';

import { motion, useMotionTemplate, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay volumetric light reveal.
 *
 * God rays descend from a radiant source, bleaching the outgoing section
 * before the new one materialises. Rays and a halo are pure geometry
 * overlays; the outgoing dims via brightness filter while the incoming fades
 * in from light.
 *
 * Shape: effect-overlay (god rays + halo) + minor layer choreography (filter
 * + opacity on both layers).
 */
const RAY_COUNT = 14;

function seeded(i: number): number {
  const x = Math.sin((i + 1.4) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

export function VolumetricLight({ progress, outgoing, incoming }: TransitionProps) {
  const firstBrightness = useTransform(progress, [0, 0.45, 0.65], [1, 3, 1]);
  const firstOpacity = useTransform(progress, [0.55, 0.65], [1, 0]);
  const outFilter = useMotionTemplate`brightness(${firstBrightness})`;
  const secondBrightness = useTransform(progress, [0.6, 0.85], [3, 1]);
  const secondOpacity = useTransform(progress, [0.6, 0.85], [0, 1]);
  const inFilter = useMotionTemplate`brightness(${secondBrightness})`;

  outgoing.style.filter = outFilter;
  outgoing.style.opacity = firstOpacity;
  incoming.style.filter = inFilter;
  incoming.style.opacity = secondOpacity;

  // Halo
  const haloScale = useTransform(progress, [0, 0.3, 0.85, 1], [0.1, 1, 1, 0.5]);
  const haloOpacity = useTransform(progress, [0, 0.15, 0.8, 1], [0, 1, 1, 0]);

  // Rays
  const rays = Array.from({ length: RAY_COUNT }, (_, i) => {
    const delay = seeded(i) * 0.08;
    const scaleY = useTransform(progress, [delay, delay + 0.3, Math.min(1, delay + 0.55)], [0, 1, 0.5]);
    const opacity = useTransform(progress, [delay, delay + 0.1, delay + 0.35, Math.min(1, delay + 0.55)], [0, seeded(i) * 0.4 + 0.3, seeded(i) * 0.4 + 0.3, 0]);
    const xPos = (i / (RAY_COUNT - 1)) * 100;
    const angle = -25 + (i / (RAY_COUNT - 1)) * 50;
    const width = 4 + seeded(i + 200) * 8;
    return { i, scaleY, opacity, xPos, angle, width } as const;
  });

  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-10vh] z-20 -translate-x-1/2"
        style={{
          width: '60vw',
          height: '60vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,255,255,0.55) 0%, rgba(200,220,255,0.3) 25%, rgba(120,180,255,0.1) 50%, transparent 70%)',
          filter: 'blur(20px)',
          scale: haloScale as MotionValue<number>,
          opacity: haloOpacity as MotionValue<number>,
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
        {rays.map(({ i, scaleY, opacity, xPos, angle, width }) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: ray index is stable
            key={i}
            aria-hidden
            className="absolute"
            style={{
              left: `${xPos}%`,
              top: 0,
              width: `${width}px`,
              height: '130vh',
              transformOrigin: 'top center',
              rotate: angle,
              scaleY: scaleY as MotionValue<number>,
              opacity: opacity as MotionValue<number>,
              background: `linear-gradient(180deg, rgba(200,220,255,${0.4 + seeded(i + 200) * 0.3}) 0%, rgba(150,180,255,${0.1 + seeded(i + 200) * 0.1}) 60%, transparent 100%)`,
              filter: `blur(${2 + seeded(i + 200) * 4}px)`,
            }}
          />
        ))}
      </div>
    </>
  );
}
