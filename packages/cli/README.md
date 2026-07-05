# SectionFlow CLI

A shadcn-style CLI for adding scroll-driven section transitions to your React project.

## Quick Start

```bash
# Initialize SectionFlow in your project
npx sectionflow-cli init

# Add a transition
npx sectionflow-cli add wave-reveal

# Add multiple transitions at once
npx sectionflow-cli add card-stack cinematic-zoom depth-layers

# Browse all available transitions
npx sectionflow-cli list
```

## Commands

### `init`

Detects your project structure and installs the two core files:

```
components/sectionflow/
└── core/
    ├── types.ts              ← TransitionProps & LayerHandle interfaces
    ├── section-flow.tsx      ← Sticky scroll staging components
    └── registry.ts           ← Auto-updated transition map
```

Supports:
- Next.js App Router and Pages Router
- `src/` and non-`src/` layouts
- Automatic npm package detection (npm / yarn / pnpm)

### `add <transition(s)>`

Installs one or more transitions:

```bash
npx sectionflow-cli add wave-reveal
npx sectionflow-cli add page-burn pixel-melt starfield-warp
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
    ...

  ⊞ Split & Fragment
    ...

  55 transitions available
```

## Usage After Installation

```tsx
import { SectionFlow, Section } from '@/components/sectionflow/core/section-flow';

export default function Page() {
  return (
    <main>
      <SectionFlow>
        <Section transition="wave-reveal">
          <div className="h-screen w-full bg-zinc-950 flex items-center justify-center text-white">
            <h2>Outgoing section</h2>
          </div>
        </Section>

        <Section>
          <div className="h-screen w-full bg-zinc-900 flex items-center justify-center text-white">
            <h2>Incoming section</h2>
          </div>
        </Section>
      </SectionFlow>
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
    │   ├── section-flow.tsx
    │   └── registry.ts
    └── transitions/
        ├── wave-reveal.tsx
        ├── card-stack.tsx
        └── ...
```

## Dependencies

- Framer Motion transitions require: `framer-motion`

The CLI installs required packages automatically using your project's package manager (npm/yarn/pnpm).

## Adding New Registry Entries

To register a new transition for the CLI itself, add an entry to the canonical metadata file `src/library/registry.ts`:

```ts
{ slug: 'my-transition', name: 'My Transition', category: 'Creative', engine: 'framer-motion', description: '...' },
```

Then create the source file at `src/library/transitions/my-transition.tsx` in the main project. The CLI copies files directly from the canonical library during `npm run sync:sources`.

## License

MIT
