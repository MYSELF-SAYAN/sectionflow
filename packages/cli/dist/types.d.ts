export type Engine = 'framer-motion' | 'gsap';
export type TransitionCategory = 'Creative' | 'Split & Fragment' | '3D' | 'Scroll' | 'Particles' | 'Premium' | 'GSAP Powered';
export interface RegistryFile {
    path: string;
    content: string;
}
export interface RegistryEntry {
    name: string;
    title: string;
    description: string;
    category: TransitionCategory;
    engine: Engine;
    dependencies: string[];
    npmDependencies: string[];
    files: RegistryFile[];
}
export interface ProjectConfig {
    hasSrc: boolean;
    isNextJs: boolean;
    isTypeScript: boolean;
    hasTailwind: boolean;
    router: 'app' | 'pages' | 'unknown';
    componentsDir: string;
    sectionflowDir: string;
    coreDir: string;
    transitionsDir: string;
}
//# sourceMappingURL=types.d.ts.map