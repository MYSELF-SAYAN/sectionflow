export type Engine = 'framer-motion';

export type TransitionCategory =
  | 'Creative'
  | 'Split & Fragment'
  | '3D'
  | 'Scroll'
  | 'Particles'
  | 'Premium';

/**
 * Framework the host project uses. Drives import-path emission in `add` hints.
 * The installed file layout is framework-agnostic in every case — the v2 core
 * and transitions are pure React + framer-motion.
 */
export type Framework = 'next-app' | 'next-pages' | 'vite' | 'cra';

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
  isTypeScript: boolean;
  hasTailwind: boolean;
  /** Detected framework — drives hint text and import alias resolution. */
  framework: Framework;
  /** Back-compat with older callers; true for any Next.js variant. */
  isNextJs: boolean;
  /** Next.js router type; 'unknown' for non-Next frameworks. */
  router: 'app' | 'pages' | 'unknown';
  /** Import alias the emitted hints should use (e.g. '@/components/...' or './components/...'). */
  alias: string;
  componentsDir: string;
  sectionflowDir: string;
  coreDir: string;
  transitionsDir: string;
}
