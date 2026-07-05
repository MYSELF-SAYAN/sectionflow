import { getTransitionSource } from './sources.js';
/**
 * The 61 canonical v2 transitions. Every entry implements the v2 handle
 * contract (TransitionProps with outgoing/incoming layer handles) and runs on
 * framer-motion only — GSAP is not used by any v2 transition.
 *
 * Kept in sync with src/library/transitions-v2/ via scripts/sync-sources.mjs.
 */
const RAW = [
    // ── Creative ────────────────────────────────────────────────────────────
    { slug: 'wave-reveal', title: 'Wave Reveal', category: 'Creative', engine: 'framer-motion', description: 'An SVG wave cap rides the incoming section as it sweeps upward.' },
    { slug: 'circular-portal', title: 'Circular Portal', category: 'Creative', engine: 'framer-motion', description: 'The next section blooms out of a circular portal in the center.' },
    { slug: 'spotlight-reveal', title: 'Spotlight Reveal', category: 'Creative', engine: 'framer-motion', description: 'A soft spotlight mask grows until the next section fills the frame.' },
    { slug: 'ink-spread', title: 'Ink Spread', category: 'Creative', engine: 'framer-motion', description: 'Two organic ink blots spread and merge to reveal the next section.' },
    { slug: 'diagonal-wipe', title: 'Dynamic Mask Reveal', category: 'Creative', engine: 'framer-motion', description: 'A slanted mask wipes across the viewport with a clean angled seam.' },
    { slug: 'gradient-burn', title: 'Gradient Burn', category: 'Creative', engine: 'framer-motion', description: 'A glowing burn line travels up the screen, igniting the next section.' },
    { slug: 'liquid-morph', title: 'Liquid Morph', category: 'Creative', engine: 'framer-motion', description: 'Four organic blobs grow and merge to flood the viewport.' },
    { slug: 'mesh-gradient-morph', title: 'Mesh Gradient Morph', category: 'Creative', engine: 'framer-motion', description: 'Animated mesh gradient nodes erode the outgoing section.' },
    { slug: 'glass-distortion', title: 'Glass Distortion', category: 'Creative', engine: 'framer-motion', description: 'A frosted-glass panel slides up, refracts, then dissolves.' },
    { slug: 'ripple-reveal', title: 'Ripple Reveal', category: 'Creative', engine: 'framer-motion', description: 'Five concentric ripple rings expand from viewport centre.' },
    { slug: 'page-burn', title: 'Page Burn', category: 'Creative', engine: 'framer-motion', description: 'Fire sweeps upward through the outgoing section.' },
    { slug: 'pixel-melt', title: 'Pixel Melt', category: 'Creative', engine: 'framer-motion', description: 'The page melts column by column in a staggered cascade.' },
    // ── Split & Fragment ────────────────────────────────────────────────────
    { slug: 'vertical-split', title: 'Vertical Split', category: 'Split & Fragment', engine: 'framer-motion', description: 'Two half-screen doors slide vertically and lock.' },
    { slug: 'curtain-split', title: 'Curtain Split', category: 'Split & Fragment', engine: 'framer-motion', description: 'Top and bottom curtains slide in from opposite sides.' },
    { slug: 'diagonal-split', title: 'Diagonal Split', category: 'Split & Fragment', engine: 'framer-motion', description: 'Two triangular shards fly in from opposite corners.' },
    { slug: 'blinds-reveal', title: 'Blinds Reveal', category: 'Split & Fragment', engine: 'framer-motion', description: 'Vertical blinds open strip by strip.' },
    { slug: 'dot-matrix', title: 'Dot Matrix Reveal', category: 'Split & Fragment', engine: 'framer-motion', description: 'A field of growing dots dissolves the screen.' },
    { slug: 'shatter', title: 'Shatter Transition', category: 'Split & Fragment', engine: 'framer-motion', description: 'The viewport fractures into 20+ irregular shards.' },
    { slug: 'paper-tear', title: 'Paper Tear', category: 'Split & Fragment', engine: 'framer-motion', description: 'The viewport rips apart along a jagged horizontal edge.' },
    { slug: 'crystal-shatter', title: 'Crystal Shatter', category: 'Split & Fragment', engine: 'framer-motion', description: 'The viewport fractures into hundreds of crystalline shards.' },
    { slug: 'thunder-crack', title: 'Thunder Crack', category: 'Split & Fragment', engine: 'framer-motion', description: 'A jagged lightning bolt fractures the screen diagonally.' },
    { slug: 'panel-pass', title: 'Panel Pass', category: 'Split & Fragment', engine: 'framer-motion', description: 'Top and bottom halves slide in from opposite sides and fuse into a solid whole.' },
    // ── 3D ──────────────────────────────────────────────────────────────────
    { slug: 'perspective-flip', title: 'Perspective Flip', category: '3D', engine: 'framer-motion', description: 'Sections rotate through 3D space around a shared horizon.' },
    { slug: 'fold-reveal', title: 'Fold Reveal', category: '3D', engine: 'framer-motion', description: 'The next section unfolds downward like a hinged panel.' },
    { slug: 'card-stack', title: 'Card Stack', category: '3D', engine: 'framer-motion', description: 'The current section settles back like a card.' },
    { slug: 'cinematic-zoom', title: 'Cinematic Zoom', category: '3D', engine: 'framer-motion', description: 'Zooms through the current section into the next.' },
    { slug: 'depth-layers', title: 'Layered Depth Shift', category: '3D', engine: 'framer-motion', description: 'Layers move at different depths for a true parallax handoff.' },
    { slug: 'hero-morph', title: 'Hero Morph', category: '3D', engine: 'framer-motion', description: 'A small hero card morphs outward into a full-bleed panel.' },
    { slug: 'infinite-tunnel', title: 'Infinite Tunnel', category: '3D', engine: 'framer-motion', description: 'A perspective tunnel of frames flies toward the camera.' },
    { slug: 'spatial-warp', title: 'Spatial Warp', category: '3D', engine: 'framer-motion', description: 'Horizontal strips skew in a gravitational-lens wave.' },
    { slug: 'dynamic-portal', title: 'Dynamic Portal', category: '3D', engine: 'framer-motion', description: 'A glowing iris portal opens from a central point.' },
    { slug: 'camera-flythrough', title: 'Camera Flythrough', category: '3D', engine: 'framer-motion', description: 'The camera rockets through receding depth planes.' },
    { slug: 'neon-corridor', title: 'Neon Corridor', category: '3D', engine: 'framer-motion', description: 'The camera flies down a neon-lit corridor of receding frames.' },
    { slug: 'starfield-warp', title: 'Starfield Warp', category: '3D', engine: 'framer-motion', description: 'Stars stretch into hyperspace streaks at warp speed.' },
    // ── Scroll ──────────────────────────────────────────────────────────────
    { slug: 'zoom-fade', title: 'Zoom Scroll', category: 'Scroll', engine: 'framer-motion', description: 'Current section zooms and dissolves while next scales in.' },
    { slug: 'elastic-curtain', title: 'Elastic Curtain', category: 'Scroll', engine: 'framer-motion', description: 'A curtain with a velocity-reactive elastic edge rises.' },
    { slug: 'parallax-shift', title: 'Parallax Section Shift', category: 'Scroll', engine: 'framer-motion', description: 'Sections cross at different scroll speeds.' },
    { slug: 'pin-reveal', title: 'Section Pin Reveal', category: 'Scroll', engine: 'framer-motion', description: 'Current section pins while the next slides over it.' },
    { slug: 'scroll-warp', title: 'Scroll Warp', category: 'Scroll', engine: 'framer-motion', description: 'Scroll velocity skews and stretches the handoff.' },
    { slug: 'progressive-morph', title: 'Progressive Morph', category: 'Scroll', engine: 'framer-motion', description: 'Horizontal bands dissolve progressively.' },
    { slug: 'direction-reveal', title: 'Direction-Based Reveal', category: 'Scroll', engine: 'framer-motion', description: 'Incoming section slides from the direction of scroll.' },
    { slug: 'multi-layer-scroll', title: 'Multi-Layer Scroll', category: 'Scroll', engine: 'framer-motion', description: 'Six layers enter from different directions.' },
    { slug: 'magnetic-pull', title: 'Magnetic Pull', category: 'Scroll', engine: 'framer-motion', description: 'Sections snap together like polar magnets.' },
    // ── Particles ───────────────────────────────────────────────────────────
    { slug: 'particle-explosion', title: 'Particle Explosion', category: 'Particles', engine: 'framer-motion', description: 'Outgoing section tile-grid explodes radially.' },
    { slug: 'particle-assembly', title: 'Particle Assembly', category: 'Particles', engine: 'framer-motion', description: 'Incoming section assembles tile by tile from chaos.' },
    { slug: 'particle-dissolve', title: 'Particle Dissolve', category: 'Particles', engine: 'framer-motion', description: 'Section dissolves into drifting particles.' },
    { slug: 'orbiting-particles', title: 'Orbiting Particle Reveal', category: 'Particles', engine: 'framer-motion', description: 'Rings of particles spiral inward then explode outward.' },
    { slug: 'dust-simulation', title: 'Dust Simulation', category: 'Particles', engine: 'framer-motion', description: 'Wind blows the outgoing section away as fine dust.' },
    { slug: 'thanos-snap', title: 'Thanos Snap', category: 'Particles', engine: 'framer-motion', description: 'Outgoing section shatters into hundreds of pieces and blows away as dust.' },
    { slug: 'energy-burst', title: 'Energy Burst', category: 'Particles', engine: 'framer-motion', description: 'Shockwave rings and rays erupt from viewport centre.' },
    { slug: 'floating-particles', title: 'Floating Particle Flow', category: 'Particles', engine: 'framer-motion', description: 'Sixty luminous particles drift upward as a living curtain.' },
    { slug: 'interactive-particles', title: 'Interactive Particles', category: 'Particles', engine: 'framer-motion', description: 'Particles converge, pulse, then burst outward.' },
    // ── Premium ─────────────────────────────────────────────────────────────
    { slug: 'cloth-reveal', title: 'Cloth Simulation Reveal', category: 'Premium', engine: 'framer-motion', description: 'A simulated cloth lifts off the next section.' },
    { slug: 'lens-distortion', title: 'Lens Distortion', category: 'Premium', engine: 'framer-motion', description: 'A barrel-lens warp grows and refracts from centre.' },
    { slug: 'svg-shape-morph', title: 'SVG Shape Morph', category: 'Premium', engine: 'framer-motion', description: 'Clip-path morphs through diamond→starburst→shield→full.' },
    { slug: 'prism-refraction', title: 'Prism Refraction', category: 'Premium', engine: 'framer-motion', description: 'Light splits into seven spectral bands that fan outward.' },
    { slug: 'volumetric-light', title: 'Volumetric Light Reveal', category: 'Premium', engine: 'framer-motion', description: 'God rays descend and bleach the outgoing section.' },
    { slug: 'aurora-drift', title: 'Aurora Drift', category: 'Premium', engine: 'framer-motion', description: 'Flowing aurora curtains of iridescent light sweep across.' },
    { slug: 'holographic-glitch', title: 'Holographic Glitch', category: 'Premium', engine: 'framer-motion', description: 'Scanline corruption and RGB channel splits tear the screen.' },
    { slug: 'molten-pour', title: 'Molten Pour', category: 'Creative', engine: 'framer-motion', description: 'Viscous molten metal pours down and solidifies.' },
    { slug: 'black-hole', title: 'Black Hole', category: 'Premium', engine: 'framer-motion', description: 'A gravitational singularity pulls every pixel into a vortex.' },
];
const FM_DEPS = ['framer-motion'];
export function getAllSlugs() {
    return RAW.map((r) => r.slug);
}
export function getEntry(slug) {
    const raw = RAW.find((r) => r.slug === slug);
    if (!raw)
        return null;
    return {
        name: raw.slug,
        title: raw.title,
        description: raw.description,
        category: raw.category,
        engine: raw.engine,
        dependencies: ['./core/types'],
        npmDependencies: FM_DEPS,
        files: [
            {
                path: `transitions/${raw.slug}.tsx`,
                content: getTransitionSource(raw.slug, raw.engine),
            },
        ],
    };
}
export function getGrouped() {
    const map = new Map();
    for (const r of RAW) {
        if (!map.has(r.category))
            map.set(r.category, []);
        map.get(r.category).push(r);
    }
    return map;
}
//# sourceMappingURL=index.js.map