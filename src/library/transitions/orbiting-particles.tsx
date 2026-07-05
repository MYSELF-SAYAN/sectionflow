'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Galactic Vortex & Revortex (Cinematic Plasma Edition).
 *
 * Particles spiral inward (Vortex) gaining angular velocity, compress to 
 * a high-energy point, and spiral outward (Revortex) to reveal the new section.
 */
const PARTICLE_COUNT = 72;

function seeded(i: number): number {
  const x = Math.sin((i + 0.5) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

function VortexParticle({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const s = seeded(index);
  
  // Base properties
  const baseAngle = (index / PARTICLE_COUNT) * Math.PI * 2;
  const orbitRadius = 200 + s * 100; // Random starting distances
  
  // The Vortex Physics
  // progress 0 -> 0.5: Radius shrinks (Vortex)
  // progress 0.5 -> 1.0: Radius expands (Revortex)
  const radius = useTransform(progress, [0, 0.5, 1], [orbitRadius, 10, orbitRadius]);
  
  // Acceleration: Spin faster as we get closer to the center
  const angle = useTransform(progress, (v) => {
    const turns = v < 0.5 ? v * 4 : (v - 0.5) * 4;
    return baseAngle + (turns * Math.PI * 4); // 2 full rotations during compression
  });

  // Calculate X and Y based on polar coordinates
  const x = useTransform(radius, (r) => Math.cos(angle.get()) * r);
  const y = useTransform(radius, (r) => Math.sin(angle.get()) * r);
  
  // Visuals
  const opacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0, 0.5, 1], [1, 0.2, 1]);
  const hue = 180 + (s * 60);

  return (
    <motion.div
      className="absolute rounded-full"
      style={{
        x,
        y,
        opacity,
        scale,
        width: 4 + s * 4,
        height: 4 + s * 4,
        background: `hsl(${hue}, 80%, 70%)`,
        boxShadow: `0 0 15px hsl(${hue}, 80%, 60%)`,
        mixBlendMode: 'screen',
      }}
    />
  );
}

export function OrbitingParticles({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * Choreography
   * Outgoing dims as particles compress; Incoming fades as particles expand.
   */
  outgoing.style.opacity = useTransform(progress, [0, 0.4], [1, 0]);
  incoming.style.opacity = useTransform(progress, [0.6, 1], [0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
      {/* Central energy bloom that pulses with the vortex */}
      <motion.div
        className="absolute rounded-full bg-cyan-400/20 blur-3xl"
        style={{
          width: '50vmin',
          height: '50vmin',
          scale: useTransform(progress, [0, 0.5, 1], [0, 1, 0]),
          opacity: useTransform(progress, [0.2, 0.5, 0.8], [0, 0.8, 0]),
        }}
      />

      {/* Orbiting Particles */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <VortexParticle key={i} index={i} progress={progress} />
      ))}
    </div>
  );
}

(OrbitingParticles as TransitionComponent).copies = true;