<div align="center">

# SectionFlow

**52 production-ready, scroll-driven section transitions for modern React websites.**

Powered by Framer Motion.

[Browse the Gallery](http://localhost:3000/docs/templates) · [Read the Docs](http://localhost:3000/docs) · [Live Demos](http://localhost:3000/demo/wave-reveal)

</div>

---

## What is SectionFlow?

SectionFlow is a curated library of **scroll-driven section transition components** built for Next.js and React. Every transition is a single self-contained `.tsx` file with a consistent two-prop API (`first` / `second`). Drop one between any two sections on your page and the transition fires as the user scrolls — no JavaScript event listeners, no scroll handlers, no layout shifts.

The library ships **52 available transitions** across 7 motion families, with **12 more in active development**.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Core Architecture](#core-architecture)
- [Transition API](#transition-api)
- [Transition Catalog](#transition-catalog)
- [Usage Examples](#usage-examples)
- [Customisation](#customisation)
- [Adding New Transitions](#adding-new-transitions)
- [Tech Stack](#tech-stack)
- [Development](#development)
- [License](#license)

---

## Quick Start

```bash
# Clone and install
git clone <repo-url>
cd sectionflow
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.  
Open [http://localhost:3000/docs/templates](http://localhost:3000/docs/templates) to browse all transitions.

---

## Project Structure

```
sectionflow/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout — includes SiteFooter
│   │   ├── page.tsx                # Landing page
│   │   ├── demo/[slug]/            # Full-screen demo for each transition
│   │   ├── docs/                   # Documentation area
│   │   │   ├── layout.tsx          # Docs layout (sidebar + main)
│   │   │   ├── templates/          # Transition gallery page
│   │   │   └── transitions/[slug]/ # Per-transition doc page
│   │   └── api/search/             # Fumadocs search endpoint
│   │
│   ├── components/                 # Shared UI components
│   │   ├── docs-shell.tsx          # Docs layout wrapper with sidebar
│   │   ├── docs-sidebar.tsx        # Sidebar with search + grouped nav
│   │   ├── docs-home-content.tsx   # Docs homepage content
│   │   ├── site-footer.tsx         # Site-wide footer
│   │   ├── template-demo.tsx       # Transition demo renderer (iframe source)
│   │   ├── transition-docs-shell.tsx # Per-transition docs page UI
│   │   └── coming-soon-card.tsx    # Planned transition placeholder card
│   │
│   ├── library/                    # 📦 The transition library itself
│   │   ├── registry.ts             # Master catalog — all transition metadata
│   │   ├── index.ts                # Barrel export for all transitions
│   │   ├── core/
│   │   │   ├── types.ts            # SectionTransitionProps interface
│   │   │   └── transition-track.tsx # Sticky scroll track + progress context
│   │   ├── transitions/            # One file per transition component
│   │   │   ├── wave-reveal.tsx
│   │   │   ├── circular-portal.tsx
│   │   │   └── ... (52 total)
│   │   └── demo/
│   │       └── demo-section.tsx    # Reusable full-screen section for demos
│   │
│   └── lib/
│       └── transition-docs.ts      # Server helpers (grouping, source loading, Shiki)
│
├── content/docs/                   # MDX documentation content (Fumadocs)
│   ├── index.mdx
│   ├── installation.mdx
│   └── api.mdx
│
├── public/                         # Static assets
├── next.config.ts
├── source.config.ts                # Fumadocs MDX configuration
└── tailwind.config (via postcss)
```

---

## Core Architecture

### The Scroll Track

Every Framer Motion transition is built on a shared sticky scroll track:

```tsx
// src/library/core/transition-track.tsx
export function TransitionTrack({ children, height = 300, className }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });
  // Spring-smoothed 0 → 1 progress value
  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.4,
  });

  return (
    <div ref={ref} style={{ height: `${height}vh` }} className="relative w-full">
      {/* Sticky viewport — stays pinned while user scrolls through height */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <ProgressContext.Provider value={smooth}>
          {children}
        </ProgressContext.Provider>
      </div>
    </div>
  );
}
```

**How it works:**

1. `TransitionTrack` renders a `height`-vh-tall scrollable region
2. The inner `sticky` div is pinned to the top of the viewport for the entire scroll distance
3. `useScroll` maps that distance to a `0 → 1` progress value
4. `useSpring` smooths it, removing jitter and adding cinematic feel
5. The progress value is shared via React context — every child animation reads from `useTrackProgress()`

### The Dead Zone

Every transition reserves the **first 30% of scroll progress** as a content-reading zone. No animation fires until `p > 0.30`. This gives users time to read section content before the transition begins.

```tsx
// Bad — starts immediately on enter
const y = useTransform(p, [0.05, 0.85], ['100%', '0%']);

// Good — 30% dead zone before animation
const y = useTransform(p, [0.30, 0.95], ['100%', '0%']);
```

---

## Transition API

All transitions share the same `SectionTransitionProps` interface:

```ts
interface SectionTransitionProps {
  /** The outgoing section — fills the screen when the track starts. */
  first: ReactNode;

  /** The incoming section — fills the screen when the track ends. */
  second: ReactNode;

  /** Scroll track height in vh. Longer = slower transition. @default 300 */
  height?: number;

  className?: string;
}
```

Some transitions extend this with additional props (e.g. `WaveReveal` accepts `waveClassName`, `ElasticCurtain` accepts `capClassName`).

---

## Transition Catalog

### ✅ Available (52)

#### Creative & SVG
| Name | Slug | Engine |
|------|------|--------|
| Wave Reveal | `wave-reveal` | Framer Motion |
| Circular Portal | `circular-portal` | Framer Motion |
| Spotlight Reveal | `spotlight-reveal` | Framer Motion |
| Ink Spread | `ink-spread` | Framer Motion |
| Dynamic Mask Reveal | `diagonal-wipe` | Framer Motion |
| Gradient Burn | `gradient-burn` | Framer Motion |
| Liquid Morph | `liquid-morph` | Framer Motion |
| Mesh Gradient Morph | `mesh-gradient-morph` | Framer Motion |
| Glass Distortion | `glass-distortion` | Framer Motion |
| Ripple Reveal | `ripple-reveal` | Framer Motion |

#### Split & Fragment
| Name | Slug | Engine |
|------|------|--------|
| Vertical Split | `vertical-split` | Framer Motion |
| Curtain Split | `curtain-split` | Framer Motion |
| Diagonal Split | `diagonal-split` | Framer Motion |
| Blinds Reveal | `blinds-reveal` | Framer Motion |
| Dot Matrix Reveal | `dot-matrix` | Framer Motion |
| Paper Tear | `paper-tear` | Framer Motion |
| Shatter Transition | `shatter` | Framer Motion |
| Infinite Grid | `infinite-grid` | Framer Motion |

#### 3D & Perspective
| Name | Slug | Engine |
|------|------|--------|
| Perspective Flip | `perspective-flip` | Framer Motion |
| Fold Reveal | `fold-reveal` | Framer Motion |
| Card Stack | `card-stack` | Framer Motion |
| Cinematic Zoom | `cinematic-zoom` | Framer Motion |
| Layered Depth Shift | `depth-layers` | Framer Motion |
| Hero Morph | `hero-morph` | Framer Motion |
| Infinite Tunnel | `infinite-tunnel` | Framer Motion |
| Spatial Warp | `spatial-warp` | Framer Motion |
| Dynamic Portal | `dynamic-portal` | Framer Motion |
| Camera Flythrough | `camera-flythrough` | Framer Motion |

#### Scroll Physics
| Name | Slug | Engine |
|------|------|--------|
| Zoom Scroll | `zoom-fade` | Framer Motion |
| Elastic Curtain | `elastic-curtain` | Framer Motion |
| Parallax Section Shift | `parallax-shift` | Framer Motion |
| Section Pin Reveal | `pin-reveal` | Framer Motion |
| Scroll Warp | `scroll-warp` | Framer Motion |
| Progressive Morph | `progressive-morph` | Framer Motion |
| Direction-Based Reveal | `direction-reveal` | Framer Motion |
| Multi-Layer Scroll | `multi-layer-scroll` | Framer Motion |

#### Particles
| Name | Slug | Engine |
|------|------|--------|
| Particle Dissolve | `particle-dissolve` | Framer Motion |
| Floating Particle Flow | `floating-particles` | Framer Motion |
| Particle Explosion | `particle-explosion` | Framer Motion |
| Particle Assembly | `particle-assembly` | Framer Motion |
| Orbiting Particle Reveal | `orbiting-particles` | Framer Motion |
| Dust Simulation | `dust-simulation` | Framer Motion |
| Energy Burst | `energy-burst` | Framer Motion |
| Interactive Particles | `interactive-particles` | Framer Motion |

#### Premium
| Name | Slug | Engine |
|------|------|--------|
| Cloth Simulation Reveal | `cloth-reveal` | Framer Motion |
| Lens Distortion | `lens-distortion` | Framer Motion |
| SVG Shape Morph | `svg-shape-morph` | Framer Motion |
| Prism Refraction | `prism-refraction` | Framer Motion |
| Volumetric Light Reveal | `volumetric-light` | Framer Motion |



---

### 🔜 Coming Soon (12)

| Name | Description |
|------|-------------|
| **Aurora Drift** | Iridescent aurora-borealis curtains sweep across the viewport |
| **Black Hole** | A gravitational singularity pulls the outgoing section into a vortex |
| **Holographic Glitch** | Scanline corruption and RGB channel splits tear the scene apart |
| **Molten Pour** | Viscous molten metal pours down to reveal the incoming section |
| **Starfield Warp** | Hundreds of stars stretch into hyperspace streaks at warp speed |
| **Pixel Melt** | The page melts column by column in a staggered pixel cascade |
| **Thunder Crack** | A lightning bolt fractures the screen with a white flash |
| **Neon Corridor** | Cyberpunk flythrough down a neon-lit 3D corridor of frames |
| **Smoke Disperse** | Translucent smoke particles billow upward, exposing the next scene |
| **Crystal Shatter** | Hundreds of crystalline shards with refraction highlights scatter |
| **Magnetic Pull** | Sections behave as polar magnets — repel and snap with elastic physics |
| **Page Burn** | Fire consumes the outgoing section in an organic irregular frontier |

---

## Usage Examples

### Basic usage

```tsx
import { WaveReveal } from '@/library/transitions/wave-reveal';

export default function Page() {
  return (
    <main>
      <HeroSection />

      <WaveReveal
        first={
          <section className="h-full w-full bg-zinc-950 flex items-center justify-center">
            <h2 className="text-white text-5xl font-bold">Section One</h2>
          </section>
        }
        second={
          <section className="h-full w-full bg-zinc-900 flex items-center justify-center">
            <h2 className="text-white text-5xl font-bold">Section Two</h2>
          </section>
        }
      />

      <FooterSection />
    </main>
  );
}
```

### Controlling transition speed

The `height` prop controls how many viewport-heights of scroll the transition takes. Higher values = slower, more cinematic transitions.

```tsx
// Fast (default)
<CinematicZoom height={300} first={...} second={...} />

// Slow and deliberate
<CinematicZoom height={500} first={...} second={...} />
```

### Chaining multiple transitions

```tsx
<main>
  <Section1 />
  <WaveReveal first={<Section1 />} second={<Section2 />} />
  <CardStack first={<Section2 />} second={<Section3 />} />
  <ParallaxShift first={<Section3 />} second={<Section4 />} />
  <Section4 />
</main>
```

> **Note:** When chaining, each section content is rendered twice — once as `second` in the previous transition and once as `first` in the next. This is intentional and correct; the transitions are purely visual overlays driven by scroll.



### Custom wave colour

Some transitions expose additional style props:

```tsx
import { WaveReveal } from '@/library/transitions/wave-reveal';

<WaveReveal
  waveClassName="text-white"  // matches second section bg
  first={<DarkHero />}
  second={<WhiteFeatures />}
/>
```

---

## Customisation

### Adjusting the dead zone

The dead zone (30% of scroll before animation begins) is hardcoded per transition. To change it, edit the `useTransform` keyframe start points in any transition file:

```tsx
// Default — 30% dead zone
const y = useTransform(p, [0.30, 0.95], ['100%', '0%']);

// Shorter dead zone — animation starts earlier
const y = useTransform(p, [0.15, 0.90], ['100%', '0%']);

// Longer dead zone — more reading time
const y = useTransform(p, [0.45, 0.95], ['100%', '0%']);
```

### Modifying spring physics

Edit the spring config in `src/library/core/transition-track.tsx`:

```tsx
const smooth = useSpring(scrollYProgress, {
  stiffness: 90,   // higher = snappier
  damping: 28,     // higher = less oscillation
  mass: 0.4,       // higher = more inertia
  restDelta: 0.0001,
});
```

### Overriding animation easing

Each transition uses `useTransform` keyframes. Swap any range to adjust pacing:

```tsx
// Linear
const y = useTransform(p, [0.30, 0.95], ['100%', '0%']);

// Ease in the middle using extra keyframes
const y = useTransform(
  p,
  [0.30, 0.50, 0.80, 0.95],
  ['100%', '60%', '10%', '0%']
);
```

---

## Adding New Transitions

### 1. Create the component file

```bash
# Convention: src/library/transitions/{slug}.tsx
touch src/library/transitions/my-transition.tsx
```

Follow this template:

```tsx
'use client';

import { motion, useTransform } from 'framer-motion';
import { TransitionTrack, useTrackProgress } from '../core/transition-track';
import type { SectionTransitionProps } from '../core/types';

function Inner({ first, second }: Pick<SectionTransitionProps, 'first' | 'second'>) {
  const p = useTrackProgress(); // Spring-smoothed 0→1 progress

  // ✅ Dead zone: nothing animates until p > 0.30
  const y = useTransform(p, [0.30, 0.95], ['100%', '0%']);
  const dim = useTransform(p, [0.30, 0.90], [1, 0]);

  return (
    <>
      <motion.div style={{ opacity: dim }} className="absolute inset-0">
        {first}
      </motion.div>
      <motion.div style={{ y }} className="absolute inset-0">
        {second}
      </motion.div>
    </>
  );
}

export function MyTransition({ first, second, height, className }: SectionTransitionProps) {
  return (
    <TransitionTrack height={height} className={className}>
      <Inner first={first} second={second} />
    </TransitionTrack>
  );
}
```

### 2. Register it

Add an entry to `src/library/registry.ts`:

```ts
{
  slug: 'my-transition',
  name: 'My Transition',
  category: 'Creative',        // one of the TransitionCategory values
  engine: 'framer-motion',
  description: 'One sentence describing the visual effect.',
  status: 'available',          // 'available' | 'planned'
  group: 'SVG',                 // optional — controls gallery grouping
  tags: ['my', 'tags'],
}
```

### 3. Export from the barrel

Add to `src/library/index.ts`:

```ts
export { MyTransition } from './transitions/my-transition';
```

### 4. Register the demo

Add to the `components` map in `src/components/template-demo.tsx`:

```ts
'my-transition': MyTransition,
```

That's it. The docs page at `/docs/transitions/my-transition` and the demo at `/demo/my-transition` are fully automatic — they're generated from the registry at build time.

---

## Tech Stack

| Technology | Role |
|-----------|------|
| **Next.js 16** | App Router, static generation, server components |
| **React 19** | UI rendering |
| **Framer Motion 12** | Primary animation engine — motion values, springs, transforms |

| **Tailwind CSS v4** | Utility styling |
| **Fumadocs** | MDX docs system — sidebar, search, MDX rendering |
| **Shiki** | Server-side syntax highlighting for the code tab |
| **TypeScript 5** | Type safety across the entire codebase |
| **Geist** | Typography — sans + mono variants |

---

## Development

```bash
# Install dependencies
npm install

# Start dev server (Turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm start
```

### Key commands

```bash
# Check TypeScript
npx tsc --noEmit

# Lint
npx next lint

# Add a new transition (creates the file + reminds you to register)
# (manual — see Adding New Transitions above)
```

### Environment

No environment variables are required. The project is fully static with no external API calls.

### File naming conventions

| Pattern | Example |
|---------|---------|
| Transition slug | `kebab-case` — `wave-reveal` |
| Component export | `PascalCase` — `WaveReveal` |
| Source file | `{slug}.tsx` — `wave-reveal.tsx` |
| CSS class prefix | `sf-` — `sf-cloth-strip`, `sf-tunnel-frame` |

The `sf-` prefix on DOM class names prevents collisions when transitions are used inside existing projects.

---

## Docs System

The documentation site is built with [Fumadocs](https://fumadocs.vercel.app). MDX files live in `content/docs/`.

- `/docs` → Home (stats, quick links)
- `/docs/installation` → Setup guide
- `/docs/api` → API reference
- `/docs/templates` → Full transition gallery, grouped by motion family
- `/docs/transitions/[slug]` → Per-transition page with:
  - Live preview iframe
  - Shiki-highlighted source code
  - Copy-to-clipboard (source + AI prompt)
  - Related transitions
  - AI prompt including full source code + usage example

---

## License

MIT — use freely in personal and commercial projects. Attribution appreciated but not required.

---

<div align="center">

Built with ❤️ using Framer Motion + Next.js

</div>
