'use client';

import { motion, useMotionTemplate, useTransform, type MotionValue } from 'framer-motion';
import { useMemo } from 'react';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Starfield Warp (Cinematic Spaceship POV).
 *
 * Stars and hyperspace streaks originate near the center and physically 
 * shoot outward past the camera, fading out rapidly to create a sense of 
 * immense speed.
 */
const STAR_COUNT = 220;
const STREAK_COUNT = 60;

function seeded(i: number): number {
  const x = Math.sin((i + 1.3) * 7919.1 + 3571.7) * 99991.3;
  return x - Math.floor(x);
}

function WarpStar({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const cfg = useMemo(() => {
    const s1 = seeded(index);
    const s2 = seeded(index + 100);
    const s3 = seeded(index + 200);
    const s4 = seeded(index + 300);
    const s5 = seeded(index + 400);

    const angle = s1 * Math.PI * 2;
    const radius = 5 + s2 * 30; // Starts close to the center
    
    const startX = Math.cos(angle) * radius;
    const startY = Math.sin(angle) * radius;
    const endX = Math.cos(angle) * (radius * 4 + s3 * 50);
    const endY = Math.sin(angle) * (radius * 4 + s3 * 50);

    // Continuous movement until they vanish
    const tStart = 0.20 + s5 * 0.10; 
    const tMid = tStart + 0.25; 
    const tFadeEnd = 0.80 + s1 * 0.05; // Fade out dynamically near the end

    const hue = s4 > 0.7 ? 185 : s4 > 0.4 ? 220 : 60;
    const size = 1 + s3 * 2;
    const targetOpacity = s4 * 0.5 + 0.2;

    return {
      times: [0, tStart, tMid, tFadeEnd, 1],
      xMap: [0, 0, startX * 10, endX * 25, endX * 25],
      yMap: [0, 0, startY * 10, endY * 25, endY * 25],
      scaleMap: [0.3, 0.3, 1, 1, 1],
      opacityMap: [0, 0, targetOpacity, 0, 0], // Fades out smoothly while moving
      hue,
      size,
      left: `calc(50% + ${startX}vmin)`,
      top: `calc(50% + ${startY}vmin)`,
    };
  }, [index]);

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
        left: cfg.left,
        top: cfg.top,
        x,
        y,
        scale,
        opacity,
        background: `hsl(${cfg.hue}, 80%, 90%)`,
        boxShadow: `0 0 ${cfg.size * 2}px hsl(${cfg.hue}, 80%, 80%)`,
      }}
    />
  );
}

function WarpStreak({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const cfg = useMemo(() => {
    const s1 = seeded(index + 500);
    const s2 = seeded(index + 600);
    const s3 = seeded(index + 700);
    const s4 = seeded(index + 800);

    const angle = s1 * Math.PI * 2;
    const dist = 4 + s2 * 15; 
    const len = 20 + s3 * 80; 
    const width = 0.5 + s4 * 0.5; 

    // FIX: Calculate actual physical translation pixels so they fly outward
    const travelPx = 150 + s3 * 300; 
    const moveX = Math.cos(angle) * travelPx;
    const moveY = Math.sin(angle) * travelPx;

    const tStart = 0.20 + s4 * 0.10;
    const tPeak = tStart + 0.15; // Reaches max opacity/stretch quickly
    const tEnd = tPeak + 0.25;   // Disappears entirely as it flies past

    const targetOpacity = s3 * 0.2 + 0.05;

    return {
      times: [0, tStart, tPeak, tEnd, 1],
      scaleMap: [0, 0, 1, 1.5, 1.5], // Stretches as it flies
      xMap: [0, 0, moveX * 0.3, moveX, moveX], // Physically translates outward
      yMap: [0, 0, moveY * 0.3, moveY, moveY],
      opacityMap: [0, 0, targetOpacity, 0, 0], // Shoots past and vanishes
      left: `calc(50% + ${Math.cos(angle) * dist}vmin)`,
      top: `calc(50% + ${Math.sin(angle) * dist}vmin)`,
      rotation: `${(angle * 180) / Math.PI}deg`,
      len: `${len}px`,
      width: `${width}px`,
    };
  }, [index]);

  const scaleX = useTransform(progress, cfg.times, cfg.scaleMap);
  const x = useTransform(progress, cfg.times, cfg.xMap);
  const y = useTransform(progress, cfg.times, cfg.yMap);
  const opacity = useTransform(progress, cfg.times, cfg.opacityMap);

  return (
    <motion.div
      aria-hidden
      className="absolute will-change-transform"
      style={{
        width: cfg.len,
        height: cfg.width,
        left: cfg.left,
        top: cfg.top,
        x,
        y,
        transformOrigin: '0% 50%',
        rotate: cfg.rotation,
        scaleX,
        opacity,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.8) 0%, rgba(180,220,255,0.3) 50%, transparent 100%)',
      }}
    />
  );
}

export function StarfieldWarp({ progress, outgoing, incoming }: TransitionProps) {
  // Outgoing fades away early, leaving the empty void for the warp effect
  outgoing.style.opacity = useTransform(progress, [0, 0.10, 0.45], [1, 1, 0]);
  const outBrightness = useTransform(progress, [0, 0.10, 0.45], [1, 1, 0.1]);
  outgoing.style.filter = useMotionTemplate`brightness(${outBrightness})`;

  // Incoming materializes smoothly as the warp peaks
  incoming.style.opacity = useTransform(progress, [0, 0.75, 0.85, 1], [0, 0, 1, 1]);
  incoming.style.scale = useTransform(progress, [0, 0.75, 1], [0.95, 0.95, 1]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: STAR_COUNT }).map((_, i) => (
          <WarpStar key={`star-${i}`} index={i} progress={progress} />
        ))}
        {Array.from({ length: STREAK_COUNT }).map((_, i) => (
          <WarpStreak key={`streak-${i}`} index={i} progress={progress} />
        ))}
      </div>
    </div>
  );
}

(StarfieldWarp as TransitionComponent).copies = true;