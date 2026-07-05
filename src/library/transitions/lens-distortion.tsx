'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * Lens Distortion v2 - Cinematic Suspense Edition
 *
 * Mapped Timeline
 * 0.00 - 0.25: Dead zone (Invisible)
 * 0.25 - 0.40: Lens appears and grows to scale 1.
 * 0.25 - 0.55: Outgoing content fully fades to black.
 * 0.40 - 0.70: CINEMATIC HOLD - Lens stays scale 1. From 0.55 to 0.70 it hovers alone in the dark.
 * 0.70 - 0.95: Lens smoothly explodes outward (scale 1 -> 8) and fades out.
 * 0.80 - 1.00: Second section fades in smoothly.
 */

const RING_SLICES = 12;

// Extract Ring component to safely use Hooks inside a mapped array
function LensRing({
  index,
  totalSlices,
  progress,
  outgoing,
}: {
  index: number;
  totalSlices: number;
  progress: MotionValue<number>;
  outgoing: TransitionProps['outgoing'];
}) {
  const pct = (index / totalSlices) * 100;
  const radius = 50 - pct / 2.2;
  const blur = (1 - index / totalSlices) * 4;
  const brightness = 0.7 + (index / totalSlices) * 0.6;
  const filter = `blur(${blur}px) brightness(${brightness})`;

  // Progressive optical zoom during the "hold" phase 
  const innerScale = useTransform(
    progress,
    [0.40, 0.70],
    [1.2 + index * 0.02, 1.6 + index * 0.07] // Deepens the refraction per ring
  );

  // Subtle progressive twist to simulate a camera lens focusing
  const innerRotate = useTransform(
    progress,
    [0.40, 0.70],
    [0, index * 1.2]
  );

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-full"
      style={{
        clipPath: `circle(${radius}% at 50% 50%)`,
        filter: filter,
      }}
    >
      {/* Refracted Outgoing Section (Distorts during hold phase) */}
      <div className="absolute inset-[-50%] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            scale: innerScale as MotionValue<number>,
            rotate: innerRotate as MotionValue<number>,
            willChange: 'transform',
          }}
        >
          {outgoing.render?.()}
        </motion.div>
      </div>

      {/* Glass tint - sharp highlight */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,.15) 0%, transparent 45%)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}

export function LensDistortion({
  progress,
  outgoing,
  incoming,
}: TransitionProps) {
  /*
   * 1. Layers Crossfade
   */

  // Fades out completely BEFORE the lens explodes (0.25 -> 0.55)
  outgoing.style.opacity = useTransform(
    progress,
    [0, 0.25, 0.55],
    [1, 1, 0]
  );

  // Second appears seamlessly as the lens explodes
  incoming.style.opacity = useTransform(
    progress,
    [0, 0.80, 1],
    [0, 0, 1]
  );

  /*
   * 2. Lens Container Transformations
   */

  // Appears -> Cinematic Hold (0.40 to 0.70) -> Massive Smooth Explosion (0.70 to 0.95)
  const lensScale = useTransform(
    progress,
    [0, 0.25, 0.40, 0.70, 0.95],
    [0.04, 0.04, 1, 1, 8] // Pushed to scale 8 for a more cinematic engulfing effect
  );

  const lensOpacity = useTransform(
    progress,
    [0, 0.25, 0.30, 0.75, 0.95],
    [0, 0, 1, 1, 0]
  );

  return (
    <>
      {/* Lens Main Container */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full will-change-transform"
        style={{
          width: '60vmin',
          height: '60vmin',

          scale: lensScale as MotionValue<number>,
          opacity: lensOpacity as MotionValue<number>,

          boxShadow: '0 20px 50px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.15), inset 0 0 20px rgba(255,255,255,.08)',
        }}
      >
        {/* Render Rings cleanly without breaking Hook Rules */}
        {Array.from({ length: RING_SLICES }).map((_, i) => (
          <LensRing
            key={i}
            index={i}
            totalSlices={RING_SLICES}
            progress={progress}
            outgoing={outgoing}
          />
        ))}

        {/* Main glass shading */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            background: `
              radial-gradient(circle at 35% 30%, rgba(255,255,255,.25) 0%, transparent 45%),
              radial-gradient(circle at 75% 75%, rgba(0,0,0,.4) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, transparent 65%, rgba(0,0,0,.35) 100%)
            `,
            border: '1px solid rgba(255,255,255,.2)',
          }}
        />

        {/* Inner shadow/glow for glass density */}
        <div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            boxShadow: 'inset 0 0 20px rgba(255,255,255,.15), inset 0 0 60px rgba(0,0,0,.5)',
          }}
        />

        {/* Outer ambient shadow */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            opacity: useTransform(
              progress,
              [0, 0.30, 0.70, 0.90],
              [0, 1, 1, 0]
            ),
            boxShadow: '0 30px 60px rgba(0,0,0,.4), 0 0 40px rgba(255,255,255,.08)',
          }}
        />

        {/* Crisp Edge highlight */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            opacity: useTransform(
              progress,
              [0, 0.40, 0.70, 0.90],
              [0, 1, 1, 0]
            ),
            border: '1px solid rgba(255,255,255,.3)',
          }}
        />
      </motion.div>
    </>
  );
}

(LensDistortion as TransitionComponent).copies = true;