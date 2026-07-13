/**
 * Catalog metadata for SectionFlow's v2 transition registry.
 *
 * Every entry here MUST resolve in `transitionRegistry` (core/registry-v2.ts)
 * when its status is 'available'. The gallery, docs sidebar, search and demo
 * pages all read from this metadata.
 *
 * v2 has a single animation engine (scroll-driven framer-motion MotionValues
 * written into persistent layer handles), so the legacy `engine` field is now
 * informational only. `viewing` surfaces each transition's viewing-phase
 * profile so the UI can show how long the section rests before the handoff.
 */

export type TransitionCategory =
  | 'Creative'
  | 'Split & Fragment'
  | '3D'
  | 'Scroll'
  | 'Particles'
  | 'Premium';

/**
 * Viewing-phase profile, mirroring the per-transition `timing` overrides set
 * in registry-v2.ts.
 * - 'standard' — the stage default rest window (≈100vh).
 * - 'long'      — mask reveals & content-heavy handoffs rest longer for
 *                 readability (≈160vh).
 * - 'short'     — quick slides rest less (≈60vh).
 */
export type ViewingPhase = 'short' | 'standard' | 'long';

export interface TransitionMeta {
  slug: string;
  name: string;
  category: TransitionCategory;
  /** Informational only — v2 is a single scroll-driven motion-value engine. */
  engine: 'framer-motion' | 'gsap';
  description: string;
  status: 'available' | 'planned';
  viewing: ViewingPhase;
  featured?: boolean;
  group?: TransitionCategory;
  tags?: string[];
  prompt?: string;
}

export const transitionGroups = ['Creative', 'Split & Fragment', '3D', 'Scroll', 'Particles', 'Premium'] as const;

export function getTransitionGroup(meta: TransitionMeta) {
  return meta.category;
}

export const transitions: TransitionMeta[] = [
  // ── Mask reveal ──────────────────────────────────────────────────────────
  { slug: 'wave-reveal', name: 'Wave Reveal', category: 'Creative', engine: 'framer-motion', description: 'An SVG wave cap rides the incoming section as it sweeps upward.', status: 'available', viewing: 'standard', featured: true, tags: ['svg', 'wave', 'overlay'] },
  { slug: 'circular-portal', name: 'Circular Portal', category: 'Creative', engine: 'framer-motion', description: 'The next section blooms out of a circular portal in the center.', status: 'available', viewing: 'long', featured: true, tags: ['portal', 'mask'] },
  { slug: 'spotlight-reveal', name: 'Spotlight Reveal', category: 'Creative', engine: 'framer-motion', description: 'A soft spotlight mask grows until the next section fills the frame.', status: 'available', viewing: 'long', featured: true, tags: ['spotlight', 'mask'] },
  { slug: 'ink-spread', name: 'Ink Spread', category: 'Creative', engine: 'framer-motion', description: 'Two organic ink blots spread and merge to reveal the next section.', status: 'available', viewing: 'long', featured: true, tags: ['ink', 'morph'] },
  { slug: 'diagonal-wipe', name: 'Dynamic Mask Reveal', category: 'Creative', engine: 'framer-motion', description: 'A slanted mask wipes across the viewport with a clean angled seam.', status: 'available', viewing: 'standard' },
  { slug: 'gradient-burn', name: 'Gradient Burn', category: 'Creative', engine: 'framer-motion', description: 'A glowing burn line travels up the screen, igniting the next section.', status: 'available', viewing: 'standard' },
  { slug: 'liquid-morph', name: 'Liquid Morph', category: 'Creative', engine: 'framer-motion', description: 'Four organic ink-like blobs grow from the corners and merge to flood the viewport, revealing the next section through pure shape and motion.', status: 'available', viewing: 'long', tags: ['liquid', 'blob', 'mask'] },
  { slug: 'mesh-gradient-morph', name: 'Mesh Gradient Morph', category: 'Creative', engine: 'framer-motion', description: 'Animated mesh gradient nodes drift across the screen, eroding the outgoing section while a colour-bleeding overlay bridges the two backgrounds.', status: 'available', viewing: 'standard', tags: ['mesh', 'gradient', 'morph'] },
  { slug: 'glass-distortion', name: 'Glass Distortion', category: 'Creative', engine: 'framer-motion', description: 'A frosted-glass panel slides up from below, creating lenticular refraction across the viewport before dissolving to reveal the next section.', status: 'available', viewing: 'standard', tags: ['glass', 'blur', 'distortion'] },
  { slug: 'ripple-reveal', name: 'Ripple Reveal', category: 'Creative', engine: 'framer-motion', description: 'Five concentric ripple rings expand outward from the viewport centre, the innermost wave acting as a growing reveal mask. Outer rings glow with a cyan halo.', status: 'available', viewing: 'long', tags: ['ripple', 'mask', 'circles'] },
  { slug: 'svg-shape-morph', name: 'SVG Shape Morph', category: 'Premium', engine: 'framer-motion', description: 'A clip-path mask morphs through a sequence of shapes — diamond → starburst → hexagonal shield → full rectangle — progressively revealing the incoming section.', status: 'available', viewing: 'long', tags: ['svg', 'shape', 'morph', 'mask'] },

  // ── Split & fragment ─────────────────────────────────────────────────────
  { slug: 'vertical-split', name: 'Vertical Split', category: 'Split & Fragment', engine: 'framer-motion', description: 'Two half-screen doors slide vertically and lock into a seamless panel.', status: 'available', viewing: 'standard' },
  { slug: 'curtain-split', name: 'Curtain Split', category: 'Split & Fragment', engine: 'framer-motion', description: 'Top and bottom curtains slide in from opposite sides and seal shut.', status: 'available', viewing: 'standard' },
  { slug: 'diagonal-split', name: 'Diagonal Split', category: 'Split & Fragment', engine: 'framer-motion', description: 'Two triangular shards fly in from opposite corners and fuse.', status: 'available', viewing: 'standard' },
  { slug: 'blinds-reveal', name: 'Blinds Reveal', category: 'Split & Fragment', engine: 'framer-motion', description: 'Vertical blinds open strip by strip to expose the next section.', status: 'available', viewing: 'standard' },
  { slug: 'dot-matrix', name: 'Dot Matrix Reveal', category: 'Split & Fragment', engine: 'framer-motion', description: 'A field of growing dots dissolves the screen into the next section.', status: 'available', viewing: 'standard' },
  { slug: 'shatter', name: 'Shatter Transition', category: 'Split & Fragment', engine: 'framer-motion', description: 'The viewport fractures into 20+ irregular shards that explode outward from the centre with physics-inspired stagger, revealing the incoming section beneath.', status: 'available', viewing: 'standard', tags: ['shatter', 'fragments', 'explosion'] },
  { slug: 'paper-tear', name: 'Paper Tear', category: 'Split & Fragment', engine: 'framer-motion', description: 'The viewport rips apart along a jagged horizontal edge. Upper and lower halves separate with counter-rotation, revealing the incoming section behind the torn pages.', status: 'available', viewing: 'standard', tags: ['tear', 'paper', 'rip'] },
  { slug: 'crystal-shatter', name: 'Crystal Shatter', category: 'Split & Fragment', engine: 'framer-motion', description: 'The viewport fractures into a grid of crystalline shards — each with refraction highlights — that scatter and fade with glacial elegance before the next section assembles.', status: 'available', viewing: 'standard', tags: ['crystal', 'shatter', 'refraction'] },
  { slug: 'thunder-crack', name: 'Thunder Crack', category: 'Split & Fragment', engine: 'framer-motion', description: 'A jagged lightning bolt fractures the screen diagonally, the two halves supercharging outward with a white flash — leaving the incoming section glowing in the aftermath.', status: 'available', viewing: 'standard', tags: ['lightning', 'crack', 'flash'] },
  { slug: 'panel-pass', name: 'Panel Pass', category: 'Split & Fragment', engine: 'framer-motion', description: 'The top and bottom halves of the next section slide in from opposite sides and fuse into a solid whole, carrying the incoming content with a subtle inner zoom.', status: 'available', viewing: 'standard', tags: ['panels', 'sliding', 'split'] },
  // ── 3D / perspective ─────────────────────────────────────────────────────
  { slug: 'perspective-flip', name: 'Perspective Flip', category: '3D', engine: 'framer-motion', description: 'Sections rotate through 3D space around a shared horizon.', status: 'available', viewing: 'standard' },
  { slug: 'fold-reveal', name: 'Fold Reveal', category: '3D', engine: 'framer-motion', description: 'The next section unfolds downward like a hinged panel with real shading.', status: 'available', viewing: 'standard' },
  { slug: 'card-stack', name: 'Card Stack', category: '3D', engine: 'framer-motion', description: 'The current section settles back like a card while the next slides over.', status: 'available', viewing: 'standard' },
  { slug: 'cinematic-zoom', name: 'Cinematic Zoom', category: '3D', engine: 'framer-motion', description: 'Zooms through the current section, landing inside the next one.', status: 'available', viewing: 'standard' },
  { slug: 'depth-layers', name: 'Layered Depth Shift', category: '3D', engine: 'framer-motion', description: 'Layers move at different depths for a true parallax handoff.', status: 'available', viewing: 'standard' },
  { slug: 'infinite-tunnel', name: 'Infinite Tunnel', category: '3D', engine: 'framer-motion', description: 'A perspective tunnel of shrinking frames flies toward the camera. Each nested frame rushes past the viewer, creating a warp-speed telescoping illusion.', status: 'available', viewing: 'standard', tags: ['tunnel', '3d', 'depth'] },
  { slug: 'spatial-warp', name: 'Spatial Warp', category: '3D', engine: 'framer-motion', description: 'Space itself bends between sections. Horizontal strips skew and stretch in a gravitational-lens wave before snapping back with the new section in place.', status: 'available', viewing: 'standard', tags: ['warp', 'skew', 'space'] },
  { slug: 'hero-morph', name: 'Hero Morph', category: '3D', engine: 'framer-motion', description: 'A small rounded hero card at the centre morphs outward into a full-bleed panel. Corners soften and sharpen as it expands, with an ambient glow ring for depth.', status: 'available', viewing: 'standard', tags: ['hero', 'morph', '3d'] },
  { slug: 'dynamic-portal', name: 'Dynamic Portal', category: '3D', engine: 'framer-motion', description: 'A glowing iris portal opens from a single point at screen centre, expanding with a spinning ring until it consumes the entire viewport.', status: 'available', viewing: 'standard', tags: ['portal', 'iris', '3d'] },
  { slug: 'camera-flythrough', name: 'Camera Flythrough', category: '3D', engine: 'framer-motion', description: 'The camera rockets through a series of receding depth planes before landing inside the next section. Each plane rushes past the viewer like a warp-speed jump.', status: 'available', viewing: 'standard', tags: ['camera', 'flythrough', '3d', 'depth'] },
  { slug: 'neon-corridor', name: 'Neon Corridor', category: '3D', engine: 'framer-motion', description: 'The camera flies down a neon-lit corridor of receding frames that narrow to a point before detonating into the next full-screen section — a cyberpunk flythrough.', status: 'available', viewing: 'standard', tags: ['neon', 'corridor', '3d'] },
  { slug: 'starfield-warp', name: 'Starfield Warp', category: '3D', engine: 'framer-motion', description: 'Hundreds of star particles stretch into hyperspace streaks and converge toward a central vanishing point, accelerating the viewer into the next section at warp speed.', status: 'available', viewing: 'standard', tags: ['stars', 'hyperspace', 'warp'] },

  // ── Scroll ───────────────────────────────────────────────────────────────
  { slug: 'zoom-fade', name: 'Zoom Scroll', category: 'Scroll', engine: 'framer-motion', description: 'The current section zooms and dissolves while the next scales in.', status: 'available', viewing: 'short' },
  { slug: 'elastic-curtain', name: 'Elastic Curtain', category: 'Scroll', engine: 'framer-motion', description: 'A curtain with a velocity-reactive elastic edge rises into place.', status: 'available', viewing: 'short' },
  { slug: 'parallax-shift', name: 'Parallax Section Shift', category: 'Scroll', engine: 'framer-motion', description: 'Sections cross at different scroll speeds for a deep parallax feel.', status: 'available', viewing: 'standard' },
  { slug: 'pin-reveal', name: 'Section Pin Reveal', category: 'Scroll', engine: 'framer-motion', description: 'The current section pins in place while the next slides over it.', status: 'available', viewing: 'short' },
  { slug: 'scroll-warp', name: 'Scroll Warp', category: 'Scroll', engine: 'framer-motion', description: 'Scroll velocity skews and stretches the handoff between sections.', status: 'available', viewing: 'standard' },
  { slug: 'progressive-morph', name: 'Progressive Morph', category: 'Scroll', engine: 'framer-motion', description: 'Horizontal bands dissolve progressively from top to bottom while the incoming section slides in from the right. A pulsing outline frame marks the morphing boundary.', status: 'available', viewing: 'standard', tags: ['bands', 'dissolve', 'morph'] },
  { slug: 'direction-reveal', name: 'Direction-Based Reveal', category: 'Scroll', engine: 'framer-motion', description: 'The incoming section slides from the direction of scroll with a glowing motion-trail edge line. A subtle skew on entry straightens as the panel lands.', status: 'available', viewing: 'standard', tags: ['direction', 'slide', 'trail'] },
  { slug: 'multi-layer-scroll', name: 'Multi-Layer Scroll', category: 'Scroll', engine: 'framer-motion', description: 'Six layers of the incoming section enter from different directions with unique skews and delays, assembling like a kinetic collage on a single scroll-driven timeline.', status: 'available', viewing: 'standard', tags: ['layers', 'stagger', 'collage'] },
  { slug: 'magnetic-pull', name: 'Magnetic Pull', category: 'Scroll', engine: 'framer-motion', description: 'Sections are treated as polar magnets. The outgoing repels away and the incoming snaps into place with elastic physics — like two charged plates meeting across the viewport.', status: 'available', viewing: 'standard', tags: ['magnet', 'elastic', 'physics'] },

  // ── Particles / premium ──────────────────────────────────────────────────
  { slug: 'particle-explosion', name: 'Particle Explosion', category: 'Particles', engine: 'framer-motion', description: 'The outgoing section shatters into a tile grid that explodes radially from the centre. Each tile travels a physics-driven trajectory with rotation and fade.', status: 'available', viewing: 'standard', tags: ['explosion', 'tiles', 'particles'] },
  { slug: 'particle-assembly', name: 'Particle Assembly', category: 'Particles', engine: 'framer-motion', description: 'The incoming section assembles tile by tile from scattered chaos. Tiles fly in from random off-screen positions to snap into their correct grid slots from the centre outward.', status: 'available', viewing: 'standard', tags: ['assembly', 'tiles', 'particles'] },
  { slug: 'particle-dissolve', name: 'Particle Dissolve', category: 'Particles', engine: 'framer-motion', description: 'The section dissolves into drifting particles that fan outward as a dot mask grows.', status: 'available', viewing: 'standard' },
  { slug: 'orbiting-particles', name: 'Orbiting Particle Reveal', category: 'Particles', engine: 'framer-motion', description: 'Four rings of luminous particles spiral inward like a galactic accretion disk, compressing to a point before exploding outward to reveal the next section.', status: 'available', viewing: 'standard', tags: ['orbit', 'spiral', 'particles'] },
  { slug: 'dust-simulation', name: 'Dust Simulation', category: 'Particles', engine: 'framer-motion', description: 'Wind pressure from the left blows the outgoing section away as a grid of fine particles. Each cell drifts rightward with turbulent lift and velocity variance.', status: 'available', viewing: 'standard', tags: ['dust', 'wind', 'particles'] },
  { slug: 'thanos-snap', name: 'Thanos Snap', category: 'Particles', engine: 'framer-motion', description: 'The outgoing section dissolves into fine particles that fly outward in random directions, creating a sense of chaos and disintegration.', status: 'available', viewing: 'standard', tags: ['particles', 'chaos', 'disintegration'] },
  { slug: 'energy-burst', name: 'Energy Burst', category: 'Particles', engine: 'framer-motion', description: 'An energy shockwave erupts from viewport centre — three pulsing rings and 24 radial rays bleach the outgoing section before the incoming one materialises from the glow.', status: 'available', viewing: 'standard', tags: ['energy', 'shockwave', 'burst'] },
  { slug: 'floating-particles', name: 'Floating Particle Flow', category: 'Particles', engine: 'framer-motion', description: 'Sixty luminous particles drift upward from the bottom, each on a unique path governed by seeded pseudo-random physics, forming a living particle curtain between sections.', status: 'available', viewing: 'standard', tags: ['float', 'ambient', 'particles'] },
  { slug: 'interactive-particles', name: 'Interactive Particles', category: 'Particles', engine: 'framer-motion', description: 'Particles converge from scatter into a concentric-ring formation, pulse as if alive, then burst radially outward as the incoming section takes over.', status: 'available', viewing: 'standard', tags: ['interactive', 'formation', 'particles'] },
  { slug: 'cloth-reveal', name: 'Cloth Simulation Reveal', category: 'Premium', engine: 'framer-motion', description: 'A simulated cloth of staggered strips lifts off the next section as it peels away.', status: 'available', viewing: 'standard' },
  { slug: 'lens-distortion', name: 'Lens Distortion', category: 'Premium', engine: 'framer-motion', description: 'A barrel-lens warp grows from a glowing point at viewport centre. Concentric refraction rings distort the outgoing section before the lens inflates to fill the screen.', status: 'available', viewing: 'standard', tags: ['lens', 'distortion', 'refraction'] },
  { slug: 'prism-refraction', name: 'Prism Refraction', category: 'Premium', engine: 'framer-motion', description: 'A virtual prism splits light into seven spectral bands that fan outward across the viewport, each band sweeping the incoming section into view at a different angle.', status: 'available', viewing: 'standard', tags: ['prism', 'light', 'spectrum'] },
  { slug: 'volumetric-light', name: 'Volumetric Light Reveal', category: 'Premium', engine: 'framer-motion', description: 'God rays descend from a radiant source, bleaching the outgoing section before the new one materialises from the light. Fourteen volumetric beams create cinematic depth.', status: 'available', viewing: 'long', tags: ['god-rays', 'volumetric', 'light'] },
  { slug: 'pixel-melt', name: 'Pixel Melt', category: 'Creative', engine: 'framer-motion', description: 'The outgoing section melts downward column by column in a staggered left-to-right cascade, each column sliding off the bottom at a different speed before the next section is revealed.', status: 'available', viewing: 'standard', tags: ['pixel', 'melt', 'cascade'] },
  { slug: 'page-burn', name: 'Page Burn', category: 'Creative', engine: 'framer-motion', description: 'The outgoing section catches fire from the bottom edge. An organic burn frontier sweeps upward through horizontal strips, leaving glowing embers drifting in the air before the next section is revealed beneath the ash.', status: 'available', viewing: 'standard', tags: ['fire', 'burn', 'organic'] },
  { slug: 'aurora-drift', name: 'Aurora Drift', category: 'Premium', engine: 'framer-motion', description: 'Flowing aurora-borealis curtains of iridescent light sweep across the viewport, dissolving the outgoing section into shifting green-violet waves before the next scene crystallises beneath.', status: 'available', viewing: 'standard', tags: ['aurora', 'light', 'organic'] },
  { slug: 'holographic-glitch', name: 'Holographic Glitch', category: 'Premium', engine: 'framer-motion', description: 'Scanline corruption, RGB channel splits, and chromatic aberration tear the outgoing section apart like a failing hologram — leaving the next section fully intact.', status: 'available', viewing: 'standard', tags: ['glitch', 'chromatic', 'scanlines'] },
  { slug: 'molten-pour', name: 'Molten Pour', category: 'Creative', engine: 'framer-motion', description: 'Viscous molten metal pours down from the top of the viewport in thick rivulets, cooling and solidifying to reveal the incoming section cast in a metallic sheen.', status: 'available', viewing: 'standard', tags: ['liquid', 'metal', 'pour'] },
  { slug: 'black-hole', name: 'Black Hole', category: 'Premium', engine: 'framer-motion', description: 'A gravitational singularity forms at viewport centre, pulling every pixel of the outgoing section into a vortex before the incoming scene explodes outward from the same point.', status: 'available', viewing: 'long', tags: ['vortex', 'gravity'] },
  { slug: 'time-freeze', name: 'Time Freeze', category: '3D', engine: 'framer-motion', description: 'The outgoing page freezes into hundreds of floating fragments while the camera moves through them, revealing the next page behind.', status: 'planned', viewing: 'standard', tags: ['freeze', 'fragments', 'camera'] },
  { slug: 'reality-tear', name: 'Reality Tear', category: 'Split & Fragment', engine: 'framer-motion', description: 'A jagged tear appears in the center, ripping the page apart like fabric. The next page exists underneath and stretches into view.', status: 'planned', viewing: 'standard', tags: ['tear', 'fabric', 'rip'] },
  { slug: 'liquid-refraction', name: 'Liquid Refraction', category: 'Creative', engine: 'framer-motion', description: 'The screen becomes liquid glass. Ripples distort the content before it melts into the incoming page.', status: 'planned', viewing: 'standard', tags: ['liquid', 'glass', 'refraction'] },
  { slug: 'origami-fold', name: 'Origami Fold', category: '3D', engine: 'framer-motion', description: 'The page folds into intricate paper structures, then unfolds into an entirely different layout.', status: 'planned', viewing: 'standard', tags: ['origami', 'fold', 'paper'] },
  { slug: 'dimensional-slice', name: 'Dimensional Slice', category: '3D', engine: 'framer-motion', description: 'Invisible planes slice the page into thick 3D slabs that slide independently, exposing the next section between them.', status: 'planned', viewing: 'standard', tags: ['slice', '3d', 'slabs'] },
  { slug: 'gravity-flip', name: 'Gravity Flip', category: 'Creative', engine: 'framer-motion', description: 'The world\'s gravity rotates 90° or 180°. All UI elements fall toward the new direction and settle into the next layout.', status: 'planned', viewing: 'standard', tags: ['gravity', 'physics', 'flip'] },
  { slug: 'smoke-dissolve', name: 'Smoke Dissolve', category: 'Particles', engine: 'framer-motion', description: 'The page evaporates into volumetric smoke that drifts away while the new page condenses from the smoke.', status: 'planned', viewing: 'standard', tags: ['smoke', 'evaporate', 'volumetric'] },
  { slug: 'page-curl', name: 'Page Curl', category: '3D', engine: 'framer-motion', description: 'A realistic page curl begins from any corner, with thickness, shadows, and bending, revealing the content beneath.', status: 'planned', viewing: 'standard', tags: ['curl', 'page', 'bend'] },
  { slug: 'mirror-reflection', name: 'Mirror Reflection', category: 'Creative', engine: 'framer-motion', description: 'The screen becomes a mirror. The reflection starts behaving differently, then the reflected world replaces reality.', status: 'planned', viewing: 'standard', tags: ['mirror', 'reflection'] },
  { slug: 'elastic-stretch', name: 'Elastic Stretch', category: 'Creative', engine: 'framer-motion', description: 'The page behaves like rubber—stretching, wobbling, snapping, and rebounding into the next section.', status: 'planned', viewing: 'standard', tags: ['elastic', 'stretch', 'rubber'] },
  { slug: 'domino-collapse', name: 'Domino Collapse', category: '3D', engine: 'framer-motion', description: 'The page is divided into vertical panels that topple one after another like dominoes, revealing the next page.', status: 'planned', viewing: 'standard', tags: ['domino', 'panels', 'collapse'] },
];

export const availableTransitions = transitions.filter(
  (t) => t.status === 'available',
);
