import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
/**
 * Reads the transition source from the project's library/transitions directory.
 * When the CLI is published, source files are bundled alongside the package.
 * Falls back to a placeholder if the file cannot be found.
 */
export function getTransitionSource(slug, engine) {
    // Paths to search (in priority order)
    const searchPaths = [
        // When running from inside the monorepo (dev/test)
        path.resolve(__dirname, '../../../../src/library/transitions', `${slug}.tsx`),
        // When installed as npm package (bundled files live next to dist/)
        path.resolve(__dirname, '../../transitions', `${slug}.tsx`),
    ];
    for (const p of searchPaths) {
        if (fs.existsSync(p))
            return fs.readFileSync(p, 'utf8');
    }
    // Minimal placeholder so the file is valid TypeScript
    const importLine = engine === 'gsap'
        ? `import gsap from 'gsap';\nimport { ScrollTrigger } from 'gsap/ScrollTrigger';`
        : `import { motion, useTransform } from 'framer-motion';\nimport { TransitionTrack, useTrackProgress } from '../core/transition-track';`;
    return [
        `'use client';`,
        `// TODO: source for ${slug} not found — re-run: npx sectionflow add ${slug}`,
        importLine,
        `import type { SectionTransitionProps } from '../core/types';`,
        ``,
        `export function ${toPascalCase(slug)}({ first, second, height, className }: SectionTransitionProps) {`,
        `  return null; // replace with the full implementation`,
        `}`,
    ].join('\n');
}
function toPascalCase(slug) {
    return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
//# sourceMappingURL=sources.js.map