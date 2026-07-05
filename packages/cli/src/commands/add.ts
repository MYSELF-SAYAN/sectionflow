import fs from 'node:fs';
import path from 'node:path';
import { intro, outro, spinner } from '@clack/prompts';
import pc from 'picocolors';
import { detectProject } from '../utils/detect-project.js';
import { ensureDir, writeFile } from '../utils/file-writer.js';
import { installNpmDeps } from '../utils/install-deps.js';
import { logger } from '../utils/logger.js';
import { fuzzyMatch } from '../utils/fuzzy-match.js';
import { getAllSlugs, getEntry } from '../registry/index.js';
import {
  TYPES_SOURCE,
  SECTION_FLOW_SOURCE,
  REGISTRY_SKELETON,
  TIMING_OVERRIDES,
} from '../core-files.js';
import type { ProjectConfig } from '../types.js';

function toPascalCase(slug: string): string {
  return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}

/**
 * Ensure the three v2 core files exist. If `init` was skipped, `add` bootstraps
 * them so the installed transition has valid imports.
 */
function ensureCore(config: ProjectConfig): void {
  const typesPath        = path.join(config.coreDir, 'types.ts');
  const sectionFlowPath  = path.join(config.coreDir, 'section-flow.tsx');
  const registryPath     = path.join(config.coreDir, 'registry.ts');

  const missing =
    !fs.existsSync(typesPath) ||
    !fs.existsSync(sectionFlowPath) ||
    !fs.existsSync(registryPath);

  if (!missing) return;

  ensureDir(config.coreDir);
  if (!fs.existsSync(typesPath))       fs.writeFileSync(typesPath,       TYPES_SOURCE,        'utf8');
  if (!fs.existsSync(sectionFlowPath)) fs.writeFileSync(sectionFlowPath, SECTION_FLOW_SOURCE, 'utf8');
  if (!fs.existsSync(registryPath))    fs.writeFileSync(registryPath,    REGISTRY_SKELETON,   'utf8');
  logger.info('Core files auto-installed');
}

/* ──────────────────────────────────────────────────────────────────────────
 * Incremental registry editing
 *
 * For each installed transition, append its import + registry entry (+ optional
 * timing override) to registry-v2.ts. Line-based, zero new deps.
 * ──────────────────────────────────────────────────────────────────────── */

const TIMING_IMPORT = "import type { TransitionComponent } from './types';";

/**
 * Append one transition to the user's registry.ts:
 *   1. an `import { Component } from '../transitions/<slug>'` line
 *   2. a `'<slug>': Component,` entry inside the transitionRegistry object
 *   3. (optional) a `(Component as TransitionComponent).timing = LONG_HOLD;` line
 *
 * Idempotent: if the slug is already registered, the file is left untouched.
 */
function appendToRegistry(registryPath: string, slug: string): void {
  const componentName = toPascalCase(slug);
  let src = fs.readFileSync(registryPath, 'utf8');

  // Already registered? Skip.
  if (src.includes(`'${slug}':`)) return;

  const lines = src.split('\n');
  const out: string[] = [];
  let insertedImport = false;
  let insertedEntry = false;
  let inRegistryObject = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ── Insert the transition import after the last existing import line ──
    // We insert it just before the first non-import, non-comment line that
    // follows the import block. Simpler: insert right after the last
    // `import ... from` line.
    if (!insertedImport && /^import\s/.test(line)) {
      out.push(line);
      // Peek ahead: if the next line is not another import, insert ours here.
      const next = lines[i + 1];
      if (!next || !/^import\s/.test(next)) {
        out.push(`import { ${componentName} } from '../transitions/${slug}';`);
        insertedImport = true;
      }
      continue;
    }

    // ── Insert the registry entry inside the transitionRegistry object ──
    if (/^export\s+const\s+transitionRegistry\s*:\s*Record<string,\s*TransitionComponent>\s*=\s*\{/.test(line)) {
      inRegistryObject = true;
      out.push(line);
      // Insert the entry as the first line inside the object.
      out.push(`  '${slug}': ${componentName},`);
      insertedEntry = true;
      continue;
    }

    out.push(line);
  }

  // If the import block wasn't found (shouldn't happen with the skeleton),
  // prepend the import after the 'use client' directive.
  if (!insertedImport) {
    const useClientIdx = out.findIndex((l) => l === "'use client';");
    const insertAt = useClientIdx >= 0 ? useClientIdx + 1 : 0;
    out.splice(insertAt, 0, `import { ${componentName} } from '../transitions/${slug}';`);
  }

  // If the entry wasn't inserted (object not found), append before EOF as a
  // safety net — but this should never happen with the skeleton.
  if (!insertedEntry) {
    out.push(`'${slug}': ${componentName},`);
  }

  let result = out.join('\n');

  // ── Optional timing override ──
  const timing = TIMING_OVERRIDES[slug];
  if (timing) {
    // Ensure TransitionComponent is imported (the skeleton already imports it,
    // but guard anyway).
    if (!result.includes(TIMING_IMPORT)) {
      result = result.replace(
        /^(import type \{ TransitionResolver \} from '\.\/types';)/m,
        `$1\n${TIMING_IMPORT}`,
      );
    }
    // Append the assignment just before `export const transitionRegistry`.
    const assignment = `(${componentName} as TransitionComponent).timing = ${timing};\n`;
    result = result.replace(
      /(\nexport const transitionRegistry)/,
      `\n${assignment}$1`,
    );
  }

  fs.writeFileSync(registryPath, result, 'utf8');
}

/** Framework-aware hint for where to use the installed transition. */
function usageHint(framework: ProjectConfig['framework']): string {
  switch (framework) {
    case 'next-app':    return 'Use it in a client component (add "use client" at the top)';
    case 'next-pages':  return 'Use it in a page component';
    case 'vite':
    case 'cra':
    default:            return 'Import it in any component';
  }
}

export async function addCommand(transitions: string[]): Promise<void> {
  intro(pc.bgCyan(pc.black(' sectionflow add ')));
  logger.blank();

  const cwd      = process.cwd();
  const config   = detectProject(cwd);
  const allSlugs = getAllSlugs();

  // Validate all slugs first
  const invalid: string[] = [];
  for (const slug of transitions) {
    if (!allSlugs.includes(slug)) invalid.push(slug);
  }

  if (invalid.length > 0) {
    for (const slug of invalid) {
      logger.error(`Transition not found: ${pc.bold(slug)}`);
      const suggestions = fuzzyMatch(slug, allSlugs);
      if (suggestions.length > 0) {
        logger.blank();
        logger.dim('Did you mean?');
        suggestions.forEach((s) => logger.dim(`  - ${s}`));
      }
    }
    logger.blank();
    logger.dim(`Run ${pc.cyan('npx sectionflow list')} to see all available transitions.`);
    process.exit(1);
  }

  // Ensure core + transitions directory
  ensureCore(config);
  ensureDir(config.transitionsDir);

  // Collect npm deps (every v2 transition needs only framer-motion)
  const allNpmDeps = new Set<string>(['framer-motion']);
  for (const slug of transitions) {
    const entry = getEntry(slug);
    if (!entry) continue;
    entry.npmDependencies.forEach((d) => allNpmDeps.add(d));
  }

  // Install npm packages
  logger.step('Resolving dependencies');
  await installNpmDeps([...allNpmDeps], cwd);
  logger.blank();

  // Write each transition + register it
  for (const slug of transitions) {
    const entry = getEntry(slug);
    if (!entry) continue;

    logger.step(`Installing ${pc.bold(entry.title)}`);

    const s = spinner();
    s.start('Writing files');

    for (const file of entry.files) {
      const filePath = path.join(config.sectionflowDir, file.path);
      await writeFile(filePath, file.content, false);
      logger.info(path.relative(cwd, filePath));
    }

    // Append to the registry so <Section transition="<slug>"> resolves.
    const registryPath = path.join(config.coreDir, 'registry.ts');
    appendToRegistry(registryPath, slug);

    s.stop('Files written');
    logger.blank();

    // Success output — v2 API hints using the detected alias
    const componentName = toPascalCase(slug);
    const coreBase      = `${config.alias}/core`;

    logger.success(`${entry.title} installed successfully`);
    logger.blank();
    logger.dim('Next steps:');
    logger.blank();
    logger.dim(`  1. Import the transition + stage`);
    logger.dim(`     import { ${componentName} } from "${config.alias}/transitions/${slug}"`);
    logger.dim(`     import { SectionFlow, Section } from "${coreBase}/section-flow"`);
    logger.blank();
    logger.dim(`  2. ${usageHint(config.framework)}`);
    logger.dim(`     <SectionFlow heightPerSection={200} restHeight={100}>`);
    logger.dim(`       <Section transition={${componentName}}>`)  ;
    logger.dim(`         {/* outgoing content */}`);
    logger.dim(`       </Section>`);
    logger.dim(`       <Section>`);
    logger.dim(`         {/* incoming content */}`);
    logger.dim(`       </Section>`);
    logger.dim(`     </SectionFlow>`);
    logger.blank();
    logger.dim(`  3. View documentation`);
    logger.dim(`     /docs/transitions/${slug}`);
    logger.blank();
    logger.divider();
    logger.blank();
  }

  outro(pc.green(`✓ ${transitions.length === 1 ? 'Transition' : `${transitions.length} transitions`} installed`));
}
