import type { Engine } from '../types.js';
/**
 * Reads a v2 transition's source. The canonical copies live in
 * src/library/transitions-v2/ (dev) and are mirrored into packages/cli/transitions/
 * by scripts/sync-sources.mjs when published. Both implement the v2 handle
 * contract (TransitionProps with outgoing/incoming layer handles — no
 * first/second wrapper).
 */
export declare function getTransitionSource(slug: string, _engine: Engine): string;
//# sourceMappingURL=sources.d.ts.map