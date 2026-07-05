'use client';

import { motion, useTransform, useMotionTemplate, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Cinematic Black Hole (Singularity Edition).
 *
 * A true gravitational well. The outgoing section is "spaghettified" 
 * (spinning, blurring, and curving into a point) while an accretion disk
 * of superheated plasma forms. A pitch-black Event Horizon swallows the 
 * light before exploding outward in a white-hole "Big Bang" to reveal 
 * the incoming section.
 */
const DEBRIS_COUNT = 70;

function seeded(i: number): number {
  const x = Math.sin((i + 0.5) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

function DebrisParticle({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const s = seeded(index);
  const baseAngle = s * Math.PI * 2;
  
  // Starting distance from the center (in vmin)
  const maxRadius = 20 + s * 50; 

  // Radius: Collapses to 0 at the singularity (0.5), then shoots out
  const radius = useTransform(progress, [0, 0.45, 0.55, 1], [maxRadius, 0, 0, maxRadius * 1.5]);

  // Angular Momentum: Spins increasingly faster as it gets closer to the center
  const angle = useTransform(progress, (v) => {
    // Accelerate spin near the center
    const spin = v < 0.5 ? Math.pow(v * 2, 3) : Math.pow((1 - v) * 2, 3);
    return baseAngle + (v * Math.PI * 6) + (spin * Math.PI * 4);
  });

  // Convert polar coordinates (radius & angle) to Cartesian (x & y)
  const xVmin = useTransform(() => Math.cos(angle.get()) * radius.get());
  const yVmin = useTransform(() => Math.sin(angle.get()) * radius.get());
  
  const x = useMotionTemplate`${xVmin}vmin`;
  const y = useMotionTemplate`${yVmin}vmin`;

  // Visuals: Brightest at the center, fading at the edges
  const opacity = useTransform(progress, [0, 0.1, 0.45, 0.55, 0.9, 1], [0, 1, 0, 0, 1, 0]);
  const scale = useTransform(progress, [0, 0.5, 1], [1, 0, 1.5]);
  const hue = 250 + s * 60; // Violet to Cyan superheated plasma

  return (
    <motion.div
      aria-hidden
      className="absolute rounded-full will-change-transform"
      style={{
        width: 3 + s * 4,
        height: 3 + s * 4,
        x,
        y,
        scale,
        opacity,
        background: `hsl(${hue}, 90%, 75%)`,
        boxShadow: `0 0 ${8 + s * 10}px hsl(${hue}, 90%, 65%)`,
        mixBlendMode: 'screen',
      }}
    />
  );
}

export function BlackHole({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * 1. Outgoing Section (Spaghettification)
   * It gets sucked in: scales to 0, spins violently, edges curve, and it blurs heavily.
   */
  outgoing.style.scale = useTransform(progress, [0, 0.48], [1, 0]);
  outgoing.style.rotate = useTransform(progress, [0, 0.48], ['0deg', '1080deg']);
  outgoing.style.borderRadius = useTransform(progress, [0, 0.48], ['0%', '100%']); // Warps the edges
  outgoing.style.filter = useTransform(progress, [0, 0.48], ['blur(0px)', 'blur(30px)']);
  outgoing.style.opacity = useTransform(progress, [0.3, 0.48], [1, 0]);

  /*
   * 2. Incoming Section (The Big Bang)
   * Bursts out of the singularity: scales from 0, untwists, and sharpens.
   */
  incoming.style.scale = useTransform(progress, [0.52, 1], [0, 1]);
  incoming.style.rotate = useTransform(progress, [0.52, 1], ['-1080deg', '0deg']);
  incoming.style.borderRadius = useTransform(progress, [0.52, 1], ['100%', '0%']);
  incoming.style.filter = useTransform(progress, [0.52, 1], ['blur(30px)', 'blur(0px)']);
  incoming.style.opacity = useTransform(progress, [0.52, 0.7], [0, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center overflow-hidden">
      
      {/* 
        The Accretion Disk (3D Tilted Glowing Rings)
        These spin extremely fast and mimic a realistic interstellar black hole.
      */}
      <motion.div
        aria-hidden
        className="absolute rounded-full border-[8px] border-indigo-500/40"
        style={{
          width: '60vmin',
          height: '60vmin',
          rotateX: '70deg', // 3D tilt
          rotateZ: useTransform(progress, [0, 1], ['0deg', '1440deg']),
          scale: useTransform(progress, [0, 0.5, 1], [0.1, 1.5, 5]),
          opacity: useTransform(progress, [0, 0.2, 0.4, 0.6, 0.8, 1], [0, 1, 0, 0, 1, 0]),
          boxShadow: '0 0 60px 20px rgba(99,102,241,0.6), inset 0 0 60px 20px rgba(99,102,241,0.6)',
          mixBlendMode: 'screen',
        }}
      />
      <motion.div
        aria-hidden
        className="absolute rounded-full border-[4px] border-purple-400/60"
        style={{
          width: '40vmin',
          height: '40vmin',
          rotateX: '65deg',
          rotateZ: useTransform(progress, [0, 1], ['0deg', '-1080deg']),
          scale: useTransform(progress, [0, 0.5, 1], [0.1, 1.2, 4]),
          opacity: useTransform(progress, [0, 0.3, 0.45, 0.55, 0.7, 1], [0, 1, 0, 0, 1, 0]),
          boxShadow: '0 0 40px 10px rgba(168,85,247,0.8), inset 0 0 40px 10px rgba(168,85,247,0.8)',
          mixBlendMode: 'screen',
        }}
      />

      {/* Superheated Plasma Debris (Spiraling in and out) */}
      {Array.from({ length: DEBRIS_COUNT }).map((_, i) => (
        <DebrisParticle key={i} index={i} progress={progress} />
      ))}

      {/* 
        The Event Horizon (The actual Black Hole)
        A pitch-black circle that grows and shrinks, swallowing the outgoing content.
      */}
      <motion.div
        aria-hidden
        className="absolute rounded-full bg-black z-10"
        style={{
          width: '30vmin',
          height: '30vmin',
          scale: useTransform(progress, [0.2, 0.45, 0.5, 0.55, 0.8], [0, 1, 0.1, 1, 0]),
          boxShadow: '0 0 50px 20px rgba(0,0,0,1)', // Blends perfectly into the dark background
        }}
      />

      {/* Central Blinding Flash (The White Hole / Big Bang explosion) */}
      <motion.div
        className="absolute inset-0 bg-white z-20"
        style={{
          opacity: useTransform(progress, [0.48, 0.5, 0.52], [0, 1, 0]),
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}

(BlackHole as TransitionComponent).copies = true;