'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * CameraFlythrough v2 - Cinematic Warp Edition
 *
 * Mapped Timeline
 * 0.00 - 0.30: Dead zone — first section fully visible, planes invisible.
 * 0.30: Outgoing section INSTANTLY vanishes to reveal the deep space tunnel.
 * 0.30 - 0.85: Staggered planes rush aggressively toward and past the camera.
 * 0.65 - 1.00: Incoming section arrives from the deep.
 */
const DEPTH_PLANES = 8;

function DepthPlane({
  index,
  progress,
  outgoing,
}: {
  index: number;
  progress: MotionValue<number>;
  outgoing: TransitionProps['outgoing'];
}) {
  const norm = index / DEPTH_PLANES;
  
  // Cinematic adjustments: Start much smaller and further back
  const startScale = 0.04 + norm * 0.5;
  const startZ = -1000 + index * 100;
  
  // Stagger planes smoothly
  const delay = 0.30 + norm * 0.25;
  const end = delay + 0.45;

  const preDelay = Math.max(0, delay - 0.001);

  // Push the scale much larger (3.5) so it aggressively flies past the camera
  const scale = useTransform(
    progress,
    [0, preDelay, delay, end],
    [startScale, startScale, startScale, 3.5]
  );

  const z = useTransform(
    progress,
    [0, preDelay, delay, end],
    [startZ, startZ, startZ, 300]
  );

  // Snap to visible, hold, then fade out just as it hits the camera
  const opacity = useTransform(
    progress,
    [0, preDelay, delay, end - 0.1, end],
    [0, 0, 1, 1, 0]
  );

  // Planes in the deep background are darker, becoming fully bright as they approach
  const brightness = 0.3 + norm * 0.7;
  const borderRadius = Math.max(0, 16 - index * 1.5);

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden will-change-transform"
      style={{
        scale: scale as MotionValue<number>,
        z: z as MotionValue<number>,
        opacity: opacity as MotionValue<number>,
        filter: `brightness(${brightness})`,
        borderRadius: `${borderRadius}px`,
        border: '1px solid rgba(255,255,255,0.1)',
        // Cinematic drop shadow to separate planes in 3D space
        boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,0,0,0.5)',
      }}
    >
      {/* Render the outgoing section inside the rushing planes */}
      {outgoing.render?.()}
      
      {/* Cinematic Vignette: Darkens the edges of the rushing frames slightly */}
      <div className="pointer-events-none absolute inset-0 bg-black/20" />
    </motion.div>
  );
}

export function CameraFlythrough({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * 1. Outgoing Layer
   * 0.00 -> 0.30: Fully visible.
   * At exactly 0.30, INSTANTLY drop opacity to 0. 
   * This removes the "double text" ghosting bug completely.
   */
  outgoing.style.opacity = useTransform(progress, [0, 0.299, 0.30], [1, 1, 0]);

  /*
   * 2. Incoming Layer
   * 0.65 -> 1.00: second section smoothly arrives
   */
  incoming.style.opacity = useTransform(progress, [0, 0.65, 1], [0, 0, 1]);
  incoming.style.scale = useTransform(progress, [0, 0.65, 1], [0.85, 0.85, 1]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      // Deepened perspective from 800px to 1200px for a more dramatic field of view
      style={{ perspective: '1200px', transformStyle: 'preserve-3d' }}
    >
      {Array.from({ length: DEPTH_PLANES }).map((_, i) => (
        <DepthPlane
          key={i}
          index={i}
          progress={progress}
          outgoing={outgoing}
        />
      ))}
    </div>
  );
}

// Ensure SectionFlow knows it needs to provide `outgoing.render()`
(CameraFlythrough as TransitionComponent).copies = true;