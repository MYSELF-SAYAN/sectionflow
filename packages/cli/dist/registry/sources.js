import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/**
 * Reads a v2 transition's source. The canonical copies live in
 * src/library/transitions-v2/ (dev) and are mirrored into packages/cli/transitions/
 * by scripts/sync-sources.mjs when published. Both implement the v2 handle
 * contract (TransitionProps with outgoing/incoming layer handles — no
 * first/second wrapper).
 */
export function getTransitionSource(slug, _engine) {
    const searchPaths = [
        // When running from inside the monorepo (dev/test)
        path.resolve(__dirname, '../../../../src/library/transitions', `${slug}.tsx`),
        // When installed as npm package (mirrored files live next to dist/)
        path.resolve(__dirname, '../../transitions', `${slug}.tsx`),
    ];
    for (const p of searchPaths) {
        if (fs.existsSync(p))
            return fs.readFileSync(p, 'utf8');
    }
    // Minimal placeholder matching the v2 handle contract so the file is valid.
    return [
        `'use client';`,
        `// TODO: source for ${slug} not found — re-run: npx sectionflow add ${slug}`,
        `import { useTransform } from 'framer-motion';`,
        `import type { TransitionProps } from '../core/types';`,
        ``,
        `export function ${toPascalCase(slug)}({ progress, outgoing, incoming }: TransitionProps) {`,
        `  const opacity = useTransform(progress, [0, 1], [1, 0]);`,
        `  outgoing.style.opacity = opacity;`,
        `  return null;`,
        `}`,
    ].join('\n');
}
function toPascalCase(slug) {
    return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
//# sourceMappingURL=sources.js.map