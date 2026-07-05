'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useMemo } from 'react';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Luminous Particle Curtain (V1 Physics Port).
 *
 * Particles drift upward on unique, seeded paths. The outgoing section
 * shrinks and fades, while the incoming materializes behind the curtain.
 */
const PARTICLE_COUNT = 70;
const DEAD = 0.25;
const ACTIVE = 0.50; // Active window: 0.25 → 0.75

function seeded(i: number): number {
  const x = Math.sin((i + 1.7) * 9301.5 + 49297.3) * 233280.4;
  return x - Math.floor(x);
}

function particleConfig(i: number) {
  return {
    x: seeded(i) * 100,
    size: 3 + seeded(i + 100) * 8,
    speed: 0.4 + seeded(i + 200) * 0.6,
    drift: (seeded(i + 300) - 0.5) * 120,
    delay: seeded(i + 400) * 0.5,
    opacity: 0.2 + seeded(i + 500) * 0.5,
    hue: seeded(i + 600) > 0.5 ? 185 : 255,
  };
}

function FloatingParticle({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const cfg = useMemo(() => particleConfig(index), [index]);

  const startP = DEAD + cfg.delay * ACTIVE * 0.5;
  const endP = Math.min(0.75, startP + cfg.speed * ACTIVE * 0.8);
  const yTravel = -(80 + cfg.size * 12);

  // Replicating V1 trajectory physics
  const y = useTransform(progress, [startP, endP], [0, yTravel]);
  const x = useTransform(progress, [startP, endP], [0, cfg.drift]);
  const scale = useTransform(progress, [startP, startP + ACTIVE * 0.1, endP], [0.3, 1, 0.5]);
  const opacity = useTransform(
    progress,
    [startP, startP + ACTIVE * 0.06, Math.max(startP + ACTIVE * 0.1, endP - ACTIVE * 0.15), endP],
    [0, cfg.opacity, cfg.opacity, 0]
  );

  return (
    <motion.div
      className="pointer-events-none absolute rounded-full will-change-transform"
      style={{
        x,
        y,
        opacity,
        scale,
        width: cfg.size,
        height: cfg.size,
        left: `${cfg.x}%`,
        bottom: '10%',
        background: `radial-gradient(circle, hsl(${cfg.hue}, 90%, 75%) 0%, hsl(${cfg.hue}, 80%, 60%) 50%, transparent 100%)`,
        boxShadow: `0 0 ${cfg.size * 2}px hsl(${cfg.hue}, 90%, 65%)`,
      }}
    />
  );
}

export function FloatingParticles({ progress, outgoing, incoming }: TransitionProps) {
  // Choreography matching V1:
  // Outgoing fades/scales (0.25 -> 0.72/0.78)
  // Incoming fades in (0.45 -> 0.80)
  outgoing.style.opacity = useTransform(progress, [0.25, 0.72], [1, 0]);
  outgoing.style.scale = useTransform(progress, [0.25, 0.78], [1, 1.04]);
  
  incoming.style.opacity = useTransform(progress, [0.45, 0.80], [0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <FloatingParticle key={i} index={i} progress={progress} />
      ))}
    </div>
  );
}

(FloatingParticles as TransitionComponent).copies = true;