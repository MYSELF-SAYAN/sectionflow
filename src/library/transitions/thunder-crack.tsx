'use client';

import { motion, useMotionTemplate, useTransform, type MotionValue } from 'framer-motion';
import type { TransitionProps, TransitionComponent } from '../core/types';

/**
 * v2 — Thunder Crack (Cinematic Fracture Edition).
 *
 * A highly realistic, jagged lightning bolt fractures the screen diagonally.
 * At the exact strike point, the outgoing section shatters into two halves
 * that supercharge and blast apart. A strobe flash bleaches the screen,
 * leaving the incoming section glowing in the aftermath.
 */
const TRIGGER = 0.15;

// A realistic jagged diagonal path from (0,0) to (100,100)
const FRACTURE_POINTS = [
  [0, 0], [15, 5], [10, 20], [35, 25], [25, 45],
  [55, 50], [45, 75], [80, 80], [70, 95], [100, 100]
];

// Generate exact clip-paths to cleanly slice the section into two pieces
const polyString = FRACTURE_POINTS.map(([x, y]) => `${x}% ${y}%`).join(', ');
const POLY_TOP_RIGHT = `polygon(${polyString}, 100% 0%)`;
const POLY_BOTTOM_LEFT = `polygon(${polyString}, 0% 100%)`;

// Format points for the SVG polyline
const svgPoints = FRACTURE_POINTS.map(([x, y]) => `${x},${y}`).join(' ');

export function ThunderCrack({ progress, outgoing, incoming }: TransitionProps) {
  /*
   * Base Choreography
   */
  // Outgoing layer hides immediately at the strike (replaced by fractured clones)
  outgoing.style.opacity = useTransform(progress, [0, TRIGGER - 0.01, TRIGGER], [1, 1, 0]);

  // Incoming layer fades in instantly during the flash, glowing intensely
  incoming.style.opacity = useTransform(progress, [0, TRIGGER, TRIGGER + 0.05], [0, 0, 1]);
  const inBrightness = useTransform(progress, [TRIGGER, TRIGGER + 0.1, 1], [3, 1, 1]);
  incoming.style.filter = useMotionTemplate`brightness(${inBrightness})`;

  /*
   * Lightning & Flash Strobe: Double-flash effect typical of real thunder
   */
  const strobeOpacity = useTransform(
    progress,
    [0, TRIGGER - 0.01, TRIGGER, TRIGGER + 0.03, TRIGGER + 0.06, TRIGGER + 0.15, TRIGGER + 0.25],
    [0, 0,            1,       0.2,          1,            0.8,            0]
  );

  /*
   * Fracture Physics: The two halves of the outgoing section blow apart
   */
  const trX = useTransform(progress, [TRIGGER, 0.6], ['0%', '10%']);
  const trY = useTransform(progress, [TRIGGER, 0.6], ['0%', '-10%']);
  
  const blX = useTransform(progress, [TRIGGER, 0.6], ['0%', '-10%']);
  const blY = useTransform(progress, [TRIGGER, 0.6], ['0%', '10%']);
  
  const fractureScale = useTransform(progress, [TRIGGER, 0.6], [1, 1.15]);
  const fractureOpacity = useTransform(progress, [TRIGGER + 0.1, 0.5], [1, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden">

      {/* Top-Right Shattered Half */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          clipPath: POLY_TOP_RIGHT,
          x: trX as MotionValue<string>,
          y: trY as MotionValue<string>,
          scale: fractureScale,
          opacity: fractureOpacity,
          filter: 'brightness(1.5)', // Supercharges before fading
        }}
      >
        {outgoing.render?.()}
      </motion.div>

      {/* Bottom-Left Shattered Half */}
      <motion.div
        className="absolute inset-0 will-change-transform"
        style={{
          clipPath: POLY_BOTTOM_LEFT,
          x: blX as MotionValue<string>,
          y: blY as MotionValue<string>,
          scale: fractureScale,
          opacity: fractureOpacity,
          filter: 'brightness(1.5)',
        }}
      >
        {outgoing.render?.()}
      </motion.div>

      {/* Blinding Screen Flash */}
      <motion.div
        className="absolute inset-0 bg-white"
        style={{
          opacity: strobeOpacity,
          mixBlendMode: 'overlay',
        }}
      />

      {/* The Lightning Bolt Vector */}
      <motion.svg
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full"
        style={{ opacity: strobeOpacity }}
      >
        {/* Plasma Core */}
        <polyline
          points={svgPoints}
          fill="none"
          stroke="#ffffff"
          strokeWidth={0.5}
          strokeLinejoin="miter"
        />
        {/* Cyan Inner Glow */}
        <polyline
          points={svgPoints}
          fill="none"
          stroke="#a5f3fc"
          strokeWidth={2}
          strokeLinejoin="miter"
          filter="blur(2px)"
        />
        {/* Wide Ambient Glow */}
        <polyline
          points={svgPoints}
          fill="none"
          stroke="#22d3ee"
          strokeWidth={6}
          strokeLinejoin="miter"
          filter="blur(6px)"
          opacity={0.6}
        />
      </motion.svg>
    </div>
  );
}

// Ensure SectionFlow knows it needs to provide `outgoing.render()` for the fractured clones
(ThunderCrack as TransitionComponent).copies = true;