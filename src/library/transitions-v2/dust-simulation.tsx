'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Dust Simulation (GSAP Wind-Dissolve ported to Framer Motion).
 *
 * Wind pressure from the left blows the outgoing section away as a grid of fine particles.
 * Each cell drifts rightward with turbulent lift and velocity variance.
 */
const DUST_COLS = 20;
const DUST_ROWS = 14;
const TOTAL = DUST_COLS * DUST_ROWS;

function seeded(i: number): number {
  const x = Math.sin((i + 0.9) * 4133.7 + 1597.3) * 46327.9;
  return x - Math.floor(x);
}

// Pre-calculate particle properties for performance
const PARTICLES = Array.from({ length: TOTAL }, (_, i) => {
  const col = i % DUST_COLS;
  const row = Math.floor(i / DUST_COLS);

  // left cols blow first; remap delay into 0.25→0.55
  const windDelay = 0.25 + (col / DUST_COLS) * 0.28 + seeded(i) * 0.06;
  const duration = 0.30 + seeded(i + 700) * 0.16;
  const windEnd = Math.min(1, windDelay + duration);

  const windX = 300 + seeded(i + 100) * 500;
  const windY = -(40 + seeded(i + 200) * 120);
  const turbX = (seeded(i + 300) - 0.5) * 80;
  const turbY = (seeded(i + 400) - 0.5) * 60;

  const tx = windX + turbX;
  const ty = windY + turbY;
  const rot = (seeded(i + 500) - 0.5) * 120;
  const targetScale = 0.15 + seeded(i + 600) * 0.3;

  return {
    i,
    col,
    row,
    windDelay,
    windEnd,
    tx,
    ty,
    rot,
    targetScale,
    left: `${(col / DUST_COLS) * 100}%`,
    top: `${(row / DUST_ROWS) * 100}%`,
    width: `${100 / DUST_COLS}%`,
    height: `${100 / DUST_ROWS}%`,
  };
});

function DustParticleComponent({
  particle,
  progress,
  outgoing,
}: {
  particle: typeof PARTICLES[number];
  progress: MotionValue<number>;
  outgoing: TransitionProps['outgoing'];
}) {
  const x = useTransform(progress, [0, particle.windDelay, particle.windEnd], [0, 0, particle.tx]);
  const y = useTransform(progress, [0, particle.windDelay, particle.windEnd], [0, 0, particle.ty]);
  const rotate = useTransform(progress, [0, particle.windDelay, particle.windEnd], [0, 0, particle.rot]);
  const scale = useTransform(progress, [0, particle.windDelay, particle.windEnd], [1, 1, particle.targetScale]);

  // Particles are invisible before 0.25, swap in at 0.25, and fade out as they blow away
  const opacity = useTransform(
    progress,
    [0, 0.249, 0.25, Math.max(0.25, particle.windEnd - 0.05), particle.windEnd],
    [0, 0, 1, 1, 0]
  );

  return (
    <motion.div
      aria-hidden
      className="absolute overflow-hidden will-change-transform"
      style={{
        left: particle.left,
        top: particle.top,
        width: particle.width,
        height: particle.height,
        x: x as MotionValue<number>,
        y: y as MotionValue<number>,
        rotate: rotate as MotionValue<number>,
        scale: scale as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
        zIndex: 20,
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          width: `${DUST_COLS * 100}%`,
          height: `${DUST_ROWS * 100}%`,
          left: `-${particle.col * 100}%`,
          top: `-${particle.row * 100}%`,
        }}
      >
        {outgoing.render?.()}
      </div>
    </motion.div>
  );
}

export function DustSimulation({ progress, outgoing, incoming }: TransitionProps) {
  // 1. Outgoing Cover
  // Fades out exactly at 0.25 as the particle grid swaps in
  outgoing.style.opacity = useTransform(progress, [0, 0.25, 0.2501], [1, 1, 0]);

  // 2. Incoming Cover
  // Reveals starting at 0.55 and fully takes over at 0.77 (duration 0.22)
  incoming.style.opacity = useTransform(progress, [0, 0.55, 0.77], [0, 0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {PARTICLES.map((particle) => (
        <DustParticleComponent
          key={particle.i}
          particle={particle}
          progress={progress}
          outgoing={outgoing}
        />
      ))}
    </div>
  );
}

(DustSimulation as TransitionComponent).copies = true;
