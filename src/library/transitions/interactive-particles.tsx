'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useMemo } from 'react';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Interactive Particles (V1 GSAP Port).
 *
 * Particles converge from a scattered state, pulse in a concentric ring 
 * formation, and burst radially outward. 
 *
 * Mapped Timeline:
 * 0.00 - 0.30: Dead zone (First section fully visible, particles hidden).
 * 0.30 - 0.50: Outgoing section fades out.
 * 0.30 - 0.64: Particles converge and pulse.
 * 0.64 - 1.00: Particles burst out.
 * 0.72 - 1.00: Incoming section fades and scales in.
 */
const PARTICLE_COUNT = 80;

function seeded(i: number): number {
  const x = Math.sin((i + 0.3) * 8221.7 + 3331.1) * 61843.9;
  return x - Math.floor(x);
}

function Particle({ index, progress }: { index: number; progress: MotionValue<number> }) {
  // Memoize the heavy physics calculations so they only run once per particle
  const cfg = useMemo(() => {
    // 1. Scatter (From)
    const startAngle = seeded(index) * Math.PI * 2;
    const startDist = 250 + seeded(index + 100) * 300;
    const fromX = Math.cos(startAngle) * startDist;
    const fromY = Math.sin(startAngle) * startDist;

    // 2. Formation (To)
    const ring = Math.floor(index / 20);
    const posInRing = index % 20;
    const formAngle = (posInRing / 20) * Math.PI * 2 + ring * 0.4;
    const formRadius = 40 + ring * 55;
    const toX = Math.cos(formAngle) * formRadius;
    const toY = Math.sin(formAngle) * formRadius;

    // 3. Pulse (Jitter)
    const pulseX = toX + (seeded(index + 300) - 0.5) * 20;
    const pulseY = toY + (seeded(index + 400) - 0.5) * 20;

    // 4. Burst (Out)
    const burstAngle = formAngle + (seeded(index + 600) - 0.5) * 1.5;
    const burstDist = 300 + seeded(index + 700) * 400;
    const burstX = Math.cos(burstAngle) * burstDist;
    const burstY = Math.sin(burstAngle) * burstDist;

    // Timeline mapping (ensuring strictly increasing arrays for Framer Motion)
    const tStart = 0.30 + seeded(index + 200) * 0.07;
    const tForm = tStart + 0.24; // Max is ~0.61, strictly < 0.64
    const tBurst = 0.64;

    const size = 3 + seeded(index) * 5;
    const hue = 185 + seeded(index + 800) * 80;

    return {
      times: [0, tStart, tForm, tBurst, 1],
      xMap: [fromX, fromX, toX, pulseX, burstX],
      yMap: [fromY, fromY, toY, pulseY, burstY],
      scaleMap: [0.2, 0.2, 1, 1, 0],
      opacityMap: [0, 0, 1, 1, 0],
      size,
      hue,
    };
  }, [index]);

  // Map the continuous scroll progress to the exact V1 staggered phases
  const x = useTransform(progress, cfg.times, cfg.xMap);
  const y = useTransform(progress, cfg.times, cfg.yMap);
  const scale = useTransform(progress, cfg.times, cfg.scaleMap);
  const opacity = useTransform(progress, cfg.times, cfg.opacityMap);

  return (
    <motion.div
      aria-hidden
      className="absolute rounded-full will-change-transform"
      style={{
        width: cfg.size,
        height: cfg.size,
        x,
        y,
        scale,
        opacity,
        background: `radial-gradient(circle, hsl(${cfg.hue}, 90%, 75%) 0%, hsl(${cfg.hue}, 80%, 55%) 100%)`,
        boxShadow: `0 0 ${cfg.size * 2.5}px hsl(${cfg.hue}, 90%, 65%)`,
      }}
    />
  );
}

export function InteractiveParticles({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * Base Layer Choreography (Exact V1 Timing)
   */
  // Outgoing fades out early (0.30 -> 0.50)
  outgoing.style.opacity = useTransform(progress, [0, 0.30, 0.50], [1, 1, 0]);

  // Incoming scales up and fades in late (0.72 -> 1.00)
  incoming.style.opacity = useTransform(progress, [0, 0.72, 1], [0, 0, 1]);
  incoming.style.scale = useTransform(progress, [0, 0.72, 1], [0.94, 0.94, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
      {/* 
        Particles act as an effect overlay.
        Extracted to <Particle /> to safely execute 80+ useTransform hooks.
      */}
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <Particle key={i} index={i} progress={progress} />
      ))}
    </div>
  );
}

(InteractiveParticles as TransitionComponent).copies = true;