#!/usr/bin/env node
/**
 * sync-sources.mjs — keeps the CLI package in sync with the canonical v2
 * source in src/library/.
 *
 * Run automatically before every publish (prepublishOnly) and manually via
 * `npm run sync:sources`. Produces:
 *
 *   1. packages/cli/src/generated/core-sources.ts
 *      Exports TYPES_SOURCE + SECTION_FLOW_SOURCE (verbatim copies of the
 *      canonical core files) and REGISTRY_SKELETON (the canonical registry
 *      with all transition imports/entries stripped — the empty map the CLI
 *      writes on `init`, which `add` then appends to). Also exports
 *      TIMING_OVERRIDES: a slug → 'LONG_HOLD' | 'SHORT_HOLD' map the `add`
 *      command reads to decide whether to attach a `.timing` override.
 *
 *   2. packages/cli/transitions/*.tsx
 *      Verbatim copies of every canonical transition file. These ship in the
 *      published package so `add` can read them without a network call.
 *
 * This is the single point that mirrors canonical source into the CLI; nothing
 * in the CLI hand-writes v2 content.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..', '..', '..');
const CLI = path.resolve(__dirname, '..');

const CORE_DIR = path.join(ROOT, 'src', 'library', 'core');
const TRANSITIONS_DIR = path.join(ROOT, 'src', 'library', 'transitions-v2');

const GENERATED_DIR = path.join(CLI, 'src', 'generated');
const GENERATED_FILE = path.join(GENERATED_DIR, 'core-sources.ts');
const BUNDLED_DIR = path.join(CLI, 'transitions');

// ── tiny helpers ───────────────────────────────────────────────────────────
const read = (p) => fs.readFile(p, 'utf8');
const write = (p, content) => fs.writeFile(p, content, 'utf8');
const ensureDir = (p) => fs.mkdir(p, { recursive: true });

/**
 * Wrap a file's raw source as a TypeScript string-literal export. We use
 * String.raw with a backtick-safe guard: backticks and ${ in source are
 * escaped so the generated literal reproduces the file verbatim.
 */
function asStringLiteral(name, raw) {
  // Escape backslashes first, then backticks, then ${...} interpolations.
  const escaped = raw
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$\{/g, '\\${');
  return `export const ${name} = \`${escaped}\`;\n`;
}

/**
 * Produce the registry skeleton from the canonical registry-v2.ts:
 *   - drop every `import { ... } from '../transitions-v2/...'` line
 *   - drop every entry line inside the `transitionRegistry = { ... }` object
 *   - drop the per-transition `.timing = ...` assignment block
 *   - keep the type imports, LONG_HOLD/SHORT_HOLD constants, the empty
 *     `transitionRegistry` map, and the resolveTransition function
 */
function buildSkeleton(raw) {
  const lines = raw.split('\n');
  const out = [];

  // Phase 1: keep everything except transition imports.
  let inRegistryObject = false;
  let registryEmptied = false;
  let inTimingBlock = false;

  for (const line of lines) {
    // ── drop transition imports ──
    if (/^import\s+\{[^}]+\}\s+from\s+'\.\.\/transitions-v2\//.test(line)) {
      continue;
    }

    // ── detect & skip the per-transition timing assignment block ──
    // The canonical registry has one or more `(X as TransitionComponent).timing`
    // assignment runs (LONG_HOLD, then SHORT_HOLD), optionally separated by blank
    // lines and preceded by a comment. We drop all of them; `add` re-appends the
    // relevant lines per installed transition.
    if (inTimingBlock) {
      if (/^\([A-Z][A-Za-z0-9]*\s+as\s+TransitionComponent\)\.timing\s*=/.test(line)) {
        continue; // an assignment line
      }
      if (line.trim() === '') {
        continue; // a blank line inside/between assignment runs
      }
      // Anything else (e.g. `export const transitionRegistry`) ends the block;
      // fall through and let normal handling process this line.
      inTimingBlock = false;
    }
    if (/^\/\/ Attach per-transition timing/.test(line)) {
      inTimingBlock = true;
      continue;
    }
    if (/^\([A-Z][A-Za-z0-9]*\s+as\s+TransitionComponent\)\.timing\s*=/.test(line)) {
      inTimingBlock = true;
      continue;
    }

    // ── strip the registry object body, leaving an empty map ──
    if (/^export\s+const\s+transitionRegistry\s*:\s*Record<string,\s*TransitionComponent>\s*=\s*\{/.test(line)) {
      out.push(line); // keep the opening `export const ... = {`
      inRegistryObject = true;
      continue;
    }
    if (inRegistryObject) {
      if (/^\};/.test(line)) {
        out.push(line); // keep the closing `};`
        inRegistryObject = false;
        registryEmptied = true;
      }
      // drop everything between (entries, comments, blank lines)
      continue;
    }

    out.push(line);
  }

  // Collapse 3+ consecutive blank lines down to 1 for tidiness.
  const text = out.join('\n').replace(/\n{3,}/g, '\n\n');
  return text;
}

/**
 * Parse the timing override assignments from the canonical registry so the
 * `add` command knows which transitions need a `.timing` line. Returns a map
 * like { 'circular-portal': 'LONG_HOLD', 'zoom-fade': 'SHORT_HOLD' }.
 */
function parseTimingOverrides(raw) {
  const map = {};
  const re = /^\(([A-Z][A-Za-z0-9]*)\s+as\s+TransitionComponent\)\.timing\s*=\s*(LONG_HOLD|SHORT_HOLD);/gm;
  let m;
  while ((m = re.exec(raw)) !== null) {
    // ComponentName → we need the slug. We invert the registry object below,
    // so just store by component name here and resolve to slug by the caller.
    map[m[1]] = m[2];
  }
  return map;
}

/** Component name → slug lookup, built from the registry object. */
function buildComponentToSlug(raw) {
  const map = {};
  const re = /^\s*'([a-z0-9-]+)':\s*([A-Z][A-Za-z0-9]*),/gm;
  let m;
  while ((m = re.exec(raw)) !== null) {
    map[m[2]] = m[1];
  }
  return map;
}

// ── main ───────────────────────────────────────────────────────────────────
async function main() {
  console.log('▸ sync-sources: mirroring canonical v2 source into packages/cli');

  // 1. Read canonical core files.
  const typesRaw = await read(path.join(CORE_DIR, 'types.ts'));
  const sectionFlowRaw = (await read(path.join(CORE_DIR, 'section-flow.tsx')))
    .replace(/'\.\/registry-v2'/g, "'./registry'");
  const registryRaw = await read(path.join(CORE_DIR, 'registry-v2.ts'));

  // 2. Build the registry skeleton + timing map.
  const skeleton = buildSkeleton(registryRaw);
  const compToTiming = parseTimingOverrides(registryRaw);
  const compToSlug = buildComponentToSlug(registryRaw);
  const timingOverrides = {};
  for (const [comp, timing] of Object.entries(compToTiming)) {
    const slug = compToSlug[comp];
    if (slug) timingOverrides[slug] = timing;
  }

  // 3. Write the generated core-sources.ts.
  await ensureDir(GENERATED_DIR);
  const generated = [
    '/* eslint-disable */',
    '/**',
    ' * GENERATED FILE — do not edit by hand.',
    ' * Produced by packages/cli/scripts/sync-sources.mjs from the canonical',
     '* source in src/library/core/. Re-run `npm run sync:sources` to refresh.',
     '*/',
    '',
    asStringLiteral('TYPES_SOURCE', typesRaw),
    asStringLiteral('SECTION_FLOW_SOURCE', sectionFlowRaw),
    asStringLiteral('REGISTRY_SKELETON', skeleton),
    `export const TIMING_OVERRIDES: Record<string, 'LONG_HOLD' | 'SHORT_HOLD'> = ${JSON.stringify(timingOverrides, null, 2)};\n`,
  ].join('\n');
  await write(GENERATED_FILE, generated);
  console.log(`  ✓ wrote ${path.relative(CLI, GENERATED_FILE)}`);

  // 4. Mirror every canonical transition file into packages/cli/transitions/.
  await ensureDir(BUNDLED_DIR);
  const files = (await fs.readdir(TRANSITIONS_DIR)).filter((f) => f.endsWith('.tsx'));
  let copied = 0;
  for (const file of files) {
    const src = path.join(TRANSITIONS_DIR, file);
    const dest = path.join(BUNDLED_DIR, file);
    await fs.copyFile(src, dest);
    copied++;
  }
  console.log(`  ✓ copied ${copied} transition files → ${path.relative(CLI, BUNDLED_DIR)}/`);

  console.log('▸ sync-sources: done');
}

main().catch((err) => {
  console.error('✗ sync-sources failed:', err);
  process.exit(1);
});
