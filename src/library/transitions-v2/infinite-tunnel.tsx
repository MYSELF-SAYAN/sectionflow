'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps } from '../core/types';

/**
 * v2 — Effect-overlay perspective tunnel (Cinematic Edition).
 *
 * Nested rectangular frames rush toward the camera in a telescoping 
 * tunnel illusion. 
 */
const FRAMES = 12; 

function TunnelFrame({
  index,
  progress,
}: {
  index: number;
  progress: MotionValue<number>;
}) {
  const norm = index / (FRAMES - 1);
  const startScale = 0.04 + norm * 0.6;
  
  // Stagger the movement of each frame
  const delay = norm * 0.4;
  const peak = delay + 0.3; // The moment it flies past the camera
  const end = Math.min(1, peak + 0.15);

  // Smooth scale expansion to simulate massive forward speed
  const scale = useTransform(
    progress,
    [0, delay, peak, end],
    [startScale, startScale, 3.5, 5] 
  );

  // FIX: Fade in quickly, but fade out completely BEFORE it fills the screen (at peak).
  // This prevents the frames from stacking into a solid black wall.
  const opacity = useTransform(
    progress,
    [0, delay, delay + 0.1, peak, end],
    [0, 0, 0.8, 0, 0]
  );

  // Distant frames are darker (atmospheric depth), closer frames are brighter
  const brightness = 0.4 + norm * 0.6;
  const borderRadius = Math.max(0, 24 - index * 2);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden will-change-transform"
      style={{
        scale: scale as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
        filter: `brightness(${brightness})`,
        borderRadius: `${borderRadius}px`,
        
        // Cinematic lighting: Sharp inner rim, deep outer void shadow
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 0 60px rgba(0,0,0,1), inset 0 0 30px rgba(255,255,255,0.05)',
        
        // FIX: Transparent center! This acts as the "hollow" part of the tunnel
        // allowing the incoming and outgoing text to be perfectly visible.
        background: 'radial-gradient(circle at 50% 50%, transparent 35%, rgba(10,10,12,0.95) 100%)',
      }}
    />
  );
}

export function InfiniteTunnel({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * 1. Outgoing Layer Choreography
   * Fades out and shrinks slightly, simulating falling backward into the dark tunnel.
   */
  outgoing.style.opacity = useTransform(progress, [0, 0.25, 0.55], [1, 1, 0]);
  outgoing.style.scale = useTransform(progress, [0, 0.55], [1, 0.85]);

  /*
   * 2. Incoming Layer Choreography
   * Fades in and scales down, blooming into the viewport from the end of the tunnel.
   */
  incoming.style.opacity = useTransform(progress, [0.45, 1], [0, 1]);
  incoming.style.scale = useTransform(progress, [0.45, 1], [1.15, 1]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-transparent"
      style={{ perspective: '1000px' }}
    >
      {/* Rushing Tunnel Frames */}
      {Array.from({ length: FRAMES }).map((_, i) => (
        <TunnelFrame 
          key={i} 
          index={i} 
          progress={progress} 
        />
      ))}
    </div>
  );
}