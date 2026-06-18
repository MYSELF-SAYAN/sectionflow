import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { logger } from './logger.js';

function getPackageManager(cwd: string): 'pnpm' | 'yarn' | 'npm' {
  if (fs.existsSync(path.join(cwd, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fs.existsSync(path.join(cwd, 'yarn.lock')))      return 'yarn';
  return 'npm';
}

function getInstalledDeps(cwd: string): Set<string> {
  try {
    const pkg  = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    const deps = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
    return new Set(Object.keys(deps));
  } catch { return new Set(); }
}

export async function installNpmDeps(deps: string[], cwd: string = process.cwd()): Promise<void> {
  if (deps.length === 0) return;

  const installed = getInstalledDeps(cwd);
  const missing   = deps.filter((d) => !installed.has(d));
  if (missing.length === 0) return;

  const pm  = getPackageManager(cwd);
  const cmd = pm === 'yarn'
    ? `yarn add ${missing.join(' ')}`
    : `${pm} install ${missing.join(' ')}`;

  logger.info(`Installing ${missing.join(', ')} via ${pm}`);

  try {
    execSync(cmd, { cwd, stdio: 'pipe' });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    logger.warn(`Could not auto-install packages. Run manually:\n    ${cmd}\n    ${msg}`);
  }
}
