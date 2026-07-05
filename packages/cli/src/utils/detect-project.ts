import fs from 'node:fs';
import path from 'node:path';
import type { Framework, ProjectConfig } from '../types.js';

function exists(p: string): boolean {
  return fs.existsSync(p);
}

function readJson(p: string): Record<string, unknown> {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return {}; }
}

/**
 * Resolve the import alias the emitted hints should use.
 *
 * - Next.js (both routers) ships a `@/*` → `./src/*` (or `./`) convention, so
 *   we always emit `@/components/sectionflow/...` for it.
 * - Vite / CRA: use `@/...` only if the project already configures that alias
 *   (in vite.config or tsconfig paths); otherwise fall back to a relative
 *   `./components/sectionflow/...` that works with zero configuration.
 */
function resolveAlias(cwd: string, framework: Framework, hasSrc: boolean): string {
  if (framework === 'next-app' || framework === 'next-pages') {
    return '@/components/sectionflow';
  }

  // Vite: look for resolve.alias '@' in any vite.config.{js,ts,mjs,mts}
  if (framework === 'vite') {
    for (const name of ['vite.config.js', 'vite.config.ts', 'vite.config.mjs', 'vite.config.mts']) {
      const p = path.join(cwd, name);
      if (exists(p)) {
        const txt = fs.readFileSync(p, 'utf8');
        // Naive but robust: detect an '@' alias entry.
        if (/alias\s*:/.test(txt) && /['"]@['"]/.test(txt)) {
          return '@/components/sectionflow';
        }
      }
    }
  }

  // Vite / CRA: check tsconfig paths for a `@/*` mapping.
  const tsconfig = readJson(path.join(cwd, 'tsconfig.json'));
  const paths = (tsconfig.compilerOptions as { paths?: Record<string, string[]> } | undefined)?.paths;
  if (paths && '@/*' in paths) {
    return '@/components/sectionflow';
  }

  // Fallback: relative path from the project root. Works everywhere, zero config.
  // `./src/components/...` when a src/ dir exists, else `./components/...`.
  return hasSrc ? './src/components/sectionflow' : './components/sectionflow';
}

export function detectProject(cwd: string = process.cwd()): ProjectConfig {
  const pkg     = readJson(path.join(cwd, 'package.json'));
  const deps    = { ...(pkg.dependencies as object ?? {}), ...(pkg.devDependencies as object ?? {}) };
  const hasSrc  = exists(path.join(cwd, 'src'));

  // TypeScript
  const isTypeScript = exists(path.join(cwd, 'tsconfig.json'));

  // Framework detection
  const hasNext  = 'next' in deps;
  const hasVite  = 'vite' in deps;

  let framework: Framework = 'cra';
  let router: ProjectConfig['router'] = 'unknown';

  if (hasNext) {
    if (exists(path.join(cwd, hasSrc ? 'src/app' : 'app'))) {
      framework = 'next-app';
      router = 'app';
    } else if (exists(path.join(cwd, hasSrc ? 'src/pages' : 'pages'))) {
      framework = 'next-pages';
      router = 'pages';
    } else {
      // Next.js installed but no app/ or pages/ yet — assume App Router.
      framework = 'next-app';
      router = 'unknown';
    }
  } else if (hasVite) {
    framework = 'vite';
  }

  // Tailwind
  const hasTailwind = 'tailwindcss' in deps
    || exists(path.join(cwd, 'tailwind.config.js'))
    || exists(path.join(cwd, 'tailwind.config.ts'));

  // Directories — framework-agnostic layout
  const base           = hasSrc ? path.join(cwd, 'src') : cwd;
  const componentsDir  = path.join(base, 'components');
  const sectionflowDir = path.join(componentsDir, 'sectionflow');
  const coreDir        = path.join(sectionflowDir, 'core');
  const transitionsDir = path.join(sectionflowDir, 'transitions');

  const alias = resolveAlias(cwd, framework, hasSrc);

  return {
    hasSrc,
    isTypeScript,
    hasTailwind,
    framework,
    isNextJs: hasNext,
    router,
    alias,
    componentsDir,
    sectionflowDir,
    coreDir,
    transitionsDir,
  };
}
