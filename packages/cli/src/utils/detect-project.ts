import fs from 'node:fs';
import path from 'node:path';
import type { ProjectConfig } from '../types.js';

function exists(p: string): boolean {
  return fs.existsSync(p);
}

function readJson(p: string): Record<string, unknown> {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch { return {}; }
}

export function detectProject(cwd: string = process.cwd()): ProjectConfig {
  const pkg     = readJson(path.join(cwd, 'package.json'));
  const deps    = { ...(pkg.dependencies as object ?? {}), ...(pkg.devDependencies as object ?? {}) };
  const hasSrc  = exists(path.join(cwd, 'src'));

  // TypeScript
  const isTypeScript = exists(path.join(cwd, 'tsconfig.json'));

  // Next.js detection
  const isNextJs = 'next' in deps;

  // Router detection
  let router: ProjectConfig['router'] = 'unknown';
  if (exists(path.join(cwd, hasSrc ? 'src/app' : 'app')))    router = 'app';
  else if (exists(path.join(cwd, hasSrc ? 'src/pages' : 'pages'))) router = 'pages';

  // Tailwind
  const hasTailwind = 'tailwindcss' in deps
    || exists(path.join(cwd, 'tailwind.config.js'))
    || exists(path.join(cwd, 'tailwind.config.ts'));

  // Directories
  const base           = hasSrc ? path.join(cwd, 'src') : cwd;
  const componentsDir  = path.join(base, 'components');
  const sectionflowDir = path.join(componentsDir, 'sectionflow');
  const coreDir        = path.join(sectionflowDir, 'core');
  const transitionsDir = path.join(sectionflowDir, 'transitions');

  return { hasSrc, isNextJs, isTypeScript, hasTailwind, router, componentsDir, sectionflowDir, coreDir, transitionsDir };
}
