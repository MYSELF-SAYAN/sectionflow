'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Particle Explosion (Wind Dissolve Edition).
 *
 * The outgoing section seamlessly fractures into hundreds of tiny particles.
 * A directional "wind" sweeps across the screen, blowing the particles away 
 * with uneven, chaotic turbulence (3D tumbling and drifting).
 *
 * Mapped Timeline:
 * 0.00 - 0.15: Normal scroll (No transition visible).
 * 0.15 - 0.20: Section seamlessly swaps with the particle grid.
 * 0.20 - 0.85: Wind sweeps from bottom-left to top-right, blowing particles away.
 * 0.50 - 0.95: Incoming section fades in smoothly behind the dust.
 */
const COLS = 24; 
const ROWS = 16;
const TOTAL_PARTICLES = COLS * ROWS;

function seeded(i: number): number {
  const x = Math.sin((i + 1.4) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

// Pre-calculate particle properties for performance
const PARTICLES = Array.from({ length: TOTAL_PARTICLES }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const rand1 = seeded(i);
  const rand2 = seeded(i + TOTAL_PARTICLES);

  // Wind sweeps diagonally from bottom-left to top-right
  const sweepProgress = (col / COLS) * 0.6 + (1 - row / ROWS) * 0.4; 

  return {
    col,
    row,
    sweepProgress,
    left: `${(col / COLS) * 100}%`,
    top: `${(row / ROWS) * 100}%`,
    width: `${100 / COLS}%`,
    height: `${100 / ROWS}%`,
    
    // Wind physics: Blows heavily to the right and slightly up, with chaotic turbulence
    tx: (150 + rand1 * 400) * (rand1 > 0.1 ? 1 : -0.3), // Mostly right, occasional left drift
    ty: -(100 + rand2 * 300), // Drifting upward
    tz: (rand1 - 0.5) * 600, // 3D swirling depth
    
    // Tumbling
    rotX: (rand1 - 0.5) * 720,
    rotY: (rand2 - 0.5) * 720,
    rotZ: (rand1 - 0.5) * 360,
    
    // Uneven particle shapes (so they don't look like perfect squares as they shrink)
    borderRadius: `${rand1 * 50}% ${rand2 * 50}% ${(1 - rand1) * 50}% ${(1 - rand2) * 50}%`,
  };
});

function DustParticle({
  particle,
  progress,
  outgoing,
}: {
  particle: typeof PARTICLES[number];
  progress: MotionValue<number>;
  outgoing: TransitionProps['outgoing'];
}) {
  // The wind hits particles progressively based on their position
  const delay = 0.20 + particle.sweepProgress * 0.45;
  const end = Math.min(1, delay + 0.35);

  const x = useTransform(progress, [delay, end], [0, particle.tx]);
  const y = useTransform(progress, [delay, end], [0, particle.ty]);
  const z = useTransform(progress, [delay, end], [0, particle.tz]);
  
  const rotateX = useTransform(progress, [delay, end], [0, particle.rotX]);
  const rotateY = useTransform(progress, [delay, end], [0, particle.rotY]);
  const rotateZ = useTransform(progress, [delay, end], [0, particle.rotZ]);

  // Shrinks into nothingness like dust
  const scale = useTransform(progress, [delay, end], [1, 0]);

  // Particle visibility timeline (hidden until 0.15, stays until blown away)
  const opacity = useTransform(
    progress,
    [0, 0.15, 0.20, end - 0.1, end],
    [0, 0, 1, 1, 0]
  );

  return (
    <motion.div
      aria-hidden
      className="absolute z-20 overflow-hidden will-change-transform"
      style={{
        left: particle.left,
        top: particle.top,
        width: particle.width,
        height: particle.height,
        x: x as MotionValue<number>,
        y: y as MotionValue<number>,
        z: z as MotionValue<number>,
        rotateX: rotateX as MotionValue<number>,
        rotateY: rotateY as MotionValue<number>,
        rotateZ: rotateZ as MotionValue<number>,
        scale: scale as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
        borderRadius: particle.borderRadius,
      }}
    >
      {/* 
        Renders the actual outgoing section inside the particle.
        Negative margins perfectly align the content across all 384 pieces.
      */}
      <div 
        className="absolute pointer-events-none"
        style={{
          width: `${COLS * 100}%`,
          height: `${ROWS * 100}%`,
          left: `-${particle.col * 100}%`,
          top: `-${particle.row * 100}%`,
        }}
      >
        {outgoing.render?.()}
      </div>
    </motion.div>
  );
}

export function ParticleExplosion({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * 1. Outgoing Layer
   * Fades out EXACTLY as the particle grid fades in (0.15 -> 0.20).
   * This prevents double-rendering and hides the grid lines until the wind hits.
   */
  outgoing.style.opacity = useTransform(progress, [0, 0.15, 0.20], [1, 1, 0]);

  /*
   * 2. Incoming Layer
   * Fades in slowly as the dust clears.
   */
  incoming.style.opacity = useTransform(progress, [0.40, 0.95], [0, 1]);

  return (
    <div 
      className="pointer-events-none absolute inset-0 z-20"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      {PARTICLES.map((particle, i) => (
        <DustParticle 
          key={i} 
          particle={particle} 
          progress={progress} 
          outgoing={outgoing}
        />
      ))}
    </div>
  );
}

(ParticleExplosion as TransitionComponent).copies = true;