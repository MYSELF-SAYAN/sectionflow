# SectionFlow CLI

A shadcn-style CLI for adding scroll-driven section transitions to your React project.

## Quick Start

```bash
# Initialize SectionFlow in your project
npx sectionflow init

# Add a transition
npx sectionflow add wave-reveal

# Add multiple transitions at once
npx sectionflow add card-stack cinematic-zoom depth-layers

# Browse all available transitions
npx sectionflow list
```

## Commands

### `init`

Detects your project structure and installs the two core files:

```
components/sectionflow/
└── core/
    ├── types.ts              ← SectionTransitionProps interface
    └── transition-track.tsx  ← Sticky scroll track + spring progress
```

Supports:
- Next.js App Router and Pages Router
- `src/` and non-`src/` layouts
- Automatic npm package detection (npm / yarn / pnpm)

### `add <transition(s)>`

Installs one or more transitions:

```bash
npx sectionflow add wave-reveal
npx sectionflow add page-burn pixel-melt starfield-warp
```

Each transition is written to:

```
components/sectionflow/transitions/<slug>.tsx
```

Core files are auto-installed if not already present. Existing files prompt for confirmation before overwriting.

Invalid transition names show fuzzy suggestions:

```
✖ Transition not found: wave-revael

Did you mean?
  - wave-reveal
  - ripple-reveal
```

### `list`

Displays all available transitions grouped by category with engine labels:

```
  ✦ Creative
    wave-reveal          framer-motion   Wave Reveal
    circular-portal      framer-motion   Circular Portal
    page-burn            gsap            Page Burn
    pixel-melt           gsap            Pixel Melt
    ...

  ⊞ Split & Fragment
    ...

  55 transitions available
```

## Usage After Installation

```tsx
import { WaveReveal } from '@/components/sectionflow/transitions/wave-reveal';

export default function Page() {
  return (
    <main>
      <HeroSection />

      <WaveReveal
        height={300}
        first={
          <div className="h-full w-full bg-zinc-950 flex items-center justify-center text-white">
            <h2>Outgoing section</h2>
          </div>
        }
        second={
          <div className="h-full w-full bg-zinc-900 flex items-center justify-center text-white">
            <h2>Incoming section</h2>
          </div>
        }
      />

      <FooterSection />
    </main>
  );
}
```

## Transition Timeline

Every transition follows the same scroll timing convention:

| Progress  | Phase               |
|-----------|---------------------|
| 0% – 25%  | Content viewing     |
| 25% – 75% | Transition buildup  |
| 75% – 100%| Section handoff     |

The first 25% of scroll is always a safe zone — sections are fully readable before any animation begins.

## File Structure

```
components/
└── sectionflow/
    ├── core/
    │   ├── types.ts
    │   └── transition-track.tsx
    └── transitions/
        ├── wave-reveal.tsx
        ├── card-stack.tsx
        └── ...
```

## Dependencies

- Framer Motion transitions require: `framer-motion`
- GSAP transitions require: `gsap`

The CLI installs required packages automatically using your project's package manager (npm/yarn/pnpm).

## Adding New Registry Entries

To register a new transition, add an entry to `src/registry/index.ts`:

```ts
{ slug: 'my-transition', title: 'My Transition', category: 'Creative', engine: 'framer-motion', description: '...' },
```

Then create the source file at `src/library/transitions/my-transition.tsx` in the main project. The CLI reads source files directly from the project.

## License

MIT
