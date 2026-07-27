'use client';

import { motion, useTransform } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * Reality Tear
 * 
 * A jagged tear appears in the center, ripping the page apart like fabric. 
 * The next page exists underneath and stretches into view.
 */

const TEAR_LEFT = [
  [0, 0],
  [50, 0],
  [47, 5],
  [52, 12],
  [46, 18],
  [53, 25],
  [45, 32],
  [51, 40],
  [46, 48],
  [52, 55],
  [47, 62],
  [51, 70],
  [46, 78],
  [53, 85],
  [48, 92],
  [50, 100],
  [0, 100],
];

const TEAR_RIGHT = [
  [50, 0],
  [100, 0],
  [100, 100],
  [50, 100],
  [48, 92],
  [53, 85],
  [46, 78],
  [51, 70],
  [47, 62],
  [52, 55],
  [46, 48],
  [51, 40],
  [45, 32],
  [53, 25],
  [46, 18],
  [52, 12],
  [47, 5],
];

const pts = (points: number[][]) =>
  `polygon(${points.map(([x, y]) => `${x}% ${y}%`).join(', ')})`;

const LEFT_CLIP = pts(TEAR_LEFT);
const RIGHT_CLIP = pts(TEAR_RIGHT);

export function RealityTear({
  progress,
  outgoing,
  incoming,
}: TransitionProps) {
  const leftX = useTransform(progress, [0, 1], ['0%', '-60%']);
  const rightX = useTransform(progress, [0, 1], ['0%', '60%']);
  
  const leftRotate = useTransform(progress, [0, 1], [0, -4]);
  const rightRotate = useTransform(progress, [0, 1], [0, 4]);

  const leftY = useTransform(progress, [0, 1], ['0%', '-5%']);
  const rightY = useTransform(progress, [0, 1], ['0%', '5%']);

  const coverOpacity = useTransform(progress, [0, 0.015], [1, 0]);
  const tearOpacity = useTransform(progress, [0, 0.98, 0.99, 1], [1, 1, 0, 0]);

  // The incoming layer stretches into view
  incoming.style.scale = useTransform(progress, [0, 1], [0.85, 1]);
  incoming.style.opacity = useTransform(progress, [0, 0.015, 0.02], [0, 0, 1]);

  // Outgoing layer disappears immediately, replaced by the torn halves
  outgoing.style.opacity = useTransform(progress, [0, 0.015, 0.02], [1, 1, 0]);

  // Flash of light from the tear and shadow
  const flashOpacity = useTransform(progress, [0, 0.1, 0.4, 1], [0, 1, 0, 0]);
  const flashScaleX = useTransform(progress, [0, 0.1, 0.5], [0, 0.5, 1]);
  
  const seamShadow = useTransform(progress, [0, 0.1, 0.5, 1], [0, 0.8, 0.3, 0]);

  return (
    <>
      {/* Incoming reveal shadow */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          opacity: seamShadow,
          background:
            'linear-gradient(to right, transparent 35%, rgba(0,0,0,0.7) 50%, transparent 65%)',
        }}
      />

      {/* Brilliant flash from the tear crack */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
        style={{ opacity: flashOpacity }}
      >
        <motion.div 
          className="h-full w-full bg-white blur-2xl opacity-50"
          style={{ scaleX: flashScaleX, transformOrigin: 'center' }}
        />
      </motion.div>

      {/* Left torn half */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden origin-bottom-left"
        style={{
          x: leftX,
          y: leftY,
          rotate: leftRotate,
          clipPath: LEFT_CLIP,
          opacity: tearOpacity,
        }}
      >
        {outgoing.render?.()}
        
        {/* Edge gradient for left half to give 3D fabric feel */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, transparent 40%, rgba(255,255,255,0.15) 48%, rgba(0,0,0,0.4) 50%)',
          }}
        />
      </motion.div>

      {/* Right torn half */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-20 overflow-hidden origin-top-right"
        style={{
          x: rightX,
          y: rightY,
          rotate: rightRotate,
          clipPath: RIGHT_CLIP,
          opacity: tearOpacity,
        }}
      >
        {outgoing.render?.()}
        
        {/* Edge gradient for right half to give 3D fabric feel */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to left, transparent 40%, rgba(255,255,255,0.15) 48%, rgba(0,0,0,0.4) 50%)',
          }}
        />
      </motion.div>

      {/* Seamless cover before tear begins */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-30"
        style={{
          opacity: coverOpacity,
        }}
      >
        {outgoing.render?.()}
      </motion.div>
    </>
  );
}

(RealityTear as TransitionComponent).copies = true;
