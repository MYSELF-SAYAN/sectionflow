import type { Engine } from '../types.js';
/**
 * Reads the transition source from the project's library/transitions directory.
 * When the CLI is published, source files are bundled alongside the package.
 * Falls back to a placeholder if the file cannot be found.
 */
export declare function getTransitionSource(slug: string, engine: Engine): string;
//# sourceMappingURL=sources.d.ts.map