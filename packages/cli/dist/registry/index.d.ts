import type { RegistryEntry, TransitionCategory, Engine } from '../types.js';
interface RawEntry {
    slug: string;
    title: string;
    description: string;
    category: TransitionCategory;
    engine: Engine;
}
export declare function getAllSlugs(): string[];
export declare function getEntry(slug: string): RegistryEntry | null;
export declare function getGrouped(): Map<TransitionCategory, RawEntry[]>;
export {};
//# sourceMappingURL=index.d.ts.map