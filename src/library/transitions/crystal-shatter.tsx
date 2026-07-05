'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Effect-overlay crystalline scatter (Cinematic Fracture Edition).
 *
 * Mapped Timeline:
 * 0.00 - 0.15: Normal scroll.
 * 0.15 - 0.25: The outgoing section "Crystallizes" (fractures into glass).
 * 0.25 - 0.30: Cinematic pause (Hold the cracked glass).
 * 0.30 - 0.90: Shatters into 3D space from the center outward.
 * 0.40 - 0.90: Incoming section fades in.
 */
const COLS = 8;
const ROWS = 6;
const TOTAL_SHARDS = COLS * ROWS;

function seeded(i: number): number {
  const x = Math.sin((i + 1.4) * 6271.9 + 3571.3) * 98317.1;
  return x - Math.floor(x);
}

// Pre-calculate shard math (positions, center-distances, and explosion vectors)
const SHARDS = Array.from({ length: TOTAL_SHARDS }, (_, i) => {
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  
  // Normalized center coordinates for explosion physics
  const cx = (col + 0.5) - (COLS / 2);
  const cy = (row + 0.5) - (ROWS / 2);
  const maxDist = Math.sqrt((COLS / 2) ** 2 + (ROWS / 2) ** 2);
  const dist = Math.sqrt(cx * cx + cy * cy) / maxDist; // 0 at center, 1 at corner
  
  const angle = Math.atan2(cy, cx);
  const rand = seeded(i);

  return {
    col,
    row,
    dist,
    left: `${(col / COLS) * 100}%`,
    top: `${(row / ROWS) * 100}%`,
    width: `${100 / COLS}%`,
    height: `${100 / ROWS}%`,
    // Explosive force: Center blows out toward the camera, edges fly outward
    tx: Math.cos(angle) * (200 + rand * 300),
    ty: Math.sin(angle) * (200 + rand * 300),
    tz: (1 - dist) * 600 - (rand * 200), // Pushes center pieces closer to camera
    rotX: (rand - 0.5) * 360,
    rotY: (rand - 0.5) * 360,
    rotZ: (rand - 0.5) * 180,
  };
});

function CrystalShard({
  shard,
  progress,
  outgoing,
}: {
  shard: typeof SHARDS[number];
  progress: MotionValue<number>;
  outgoing: TransitionProps['outgoing'];
}) {
  // Stagger the explosion from the center of the screen outward
  const delay = 0.30 + shard.dist * 0.2;
  const end = Math.min(1, delay + 0.4);

  const x = useTransform(progress, [delay, end], [0, shard.tx]);
  const y = useTransform(progress, [delay, end], [0, shard.ty]);
  const z = useTransform(progress, [delay, end], [0, shard.tz]);
  
  const rotateX = useTransform(progress, [delay, end], [0, shard.rotX]);
  const rotateY = useTransform(progress, [delay, end], [0, shard.rotY]);
  const rotateZ = useTransform(progress, [delay, end], [0, shard.rotZ]);

  // Shard appearance timeline
  const opacity = useTransform(
    progress,
    [0, 0.15, 0.25, end - 0.15, end],
    [0, 0, 1, 1, 0] // Fades in during the "Crystallize" phase, fades out at the end of its scatter
  );

  // The glass highlight flashes bright right before it shatters
  const glassGlare = useTransform(
    progress,
    [0.15, 0.25, 0.30, end],
    [0, 0.4, 0.8, 0]
  );

  return (
    <motion.div
      aria-hidden
      className="absolute z-20 overflow-hidden will-change-transform"
      style={{
        left: shard.left,
        top: shard.top,
        width: shard.width,
        height: shard.height,
        x: x as MotionValue<number>,
        y: y as MotionValue<number>,
        z: z as MotionValue<number>,
        rotateX: rotateX as MotionValue<number>,
        rotateY: rotateY as MotionValue<number>,
        rotateZ: rotateZ as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
        // Gives the shard a 3D depth effect while flying
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      }}
    >
      {/* 
        This renders the ACTUAL outgoing section inside the shard.
        We shift the position so the content aligns perfectly with the main background.
      */}
      <div 
        className="absolute pointer-events-none"
        style={{
          width: `${COLS * 100}%`,
          height: `${ROWS * 100}%`,
          left: `-${shard.col * 100}%`,
          top: `-${shard.row * 100}%`,
        }}
      >
        {outgoing.render?.()}
      </div>

      {/* Crystal Glass Overlays - creates the cracked/fractured look */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: glassGlare as MotionValue<number>,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 40%, transparent 60%, rgba(255,255,255,0.1) 100%)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: 'inset 0 0 15px rgba(255,255,255,0.2)',
        }}
      />
    </motion.div>
  );
}

export function CrystalShatter({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * 1. Outgoing Layer
   * Fades out EXACTLY as the shards fade in (0.15 -> 0.25).
   * This seamlessly swaps the normal section for the "crystallized" one.
   */
  outgoing.style.opacity = useTransform(progress, [0, 0.15, 0.25], [1, 1, 0]);

  /*
   * 2. Incoming Layer
   * Fades in as the shards scatter away.
   */
  incoming.style.opacity = useTransform(progress, [0.40, 0.90], [0, 1]);

  return (
    <div 
      className="pointer-events-none absolute inset-0 z-20"
      // Deep perspective needed for the 3D shatter effect
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      {SHARDS.map((shard, i) => (
        <CrystalShard 
          key={i} 
          shard={shard} 
          progress={progress} 
          outgoing={outgoing}
        />
      ))}
    </div>
  );
}

(CrystalShatter as TransitionComponent).copies = true;