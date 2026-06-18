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
import { TYPES_SOURCE, TRACK_SOURCE } from '../core-files.js';
function toPascalCase(slug) {
    return slug.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
}
function ensureCore(config) {
    const typesPath = path.join(config.coreDir, 'types.ts');
    const trackPath = path.join(config.coreDir, 'transition-track.tsx');
    if (!fs.existsSync(typesPath) || !fs.existsSync(trackPath)) {
        ensureDir(config.coreDir);
        if (!fs.existsSync(typesPath))
            fs.writeFileSync(typesPath, TYPES_SOURCE, 'utf8');
        if (!fs.existsSync(trackPath))
            fs.writeFileSync(trackPath, TRACK_SOURCE, 'utf8');
        logger.info('Core files auto-installed');
    }
}
export async function addCommand(transitions) {
    intro(pc.bgCyan(pc.black(' sectionflow add ')));
    logger.blank();
    const cwd = process.cwd();
    const config = detectProject(cwd);
    const allSlugs = getAllSlugs();
    // Validate all slugs first
    const invalid = [];
    for (const slug of transitions) {
        if (!allSlugs.includes(slug))
            invalid.push(slug);
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
    // Ensure core
    ensureCore(config);
    ensureDir(config.transitionsDir);
    // Collect all npm deps needed
    const allNpmDeps = new Set(['framer-motion']);
    for (const slug of transitions) {
        const entry = getEntry(slug);
        if (!entry)
            continue;
        entry.npmDependencies.forEach((d) => allNpmDeps.add(d));
    }
    // Install npm packages
    logger.step('Resolving dependencies');
    await installNpmDeps([...allNpmDeps], cwd);
    logger.blank();
    // Write each transition
    for (const slug of transitions) {
        const entry = getEntry(slug);
        if (!entry)
            continue;
        logger.step(`Installing ${pc.bold(entry.title)}`);
        const s = spinner();
        s.start('Writing files');
        for (const file of entry.files) {
            const filePath = path.join(config.sectionflowDir, file.path);
            await writeFile(filePath, file.content, false);
            logger.info(path.relative(cwd, filePath));
        }
        s.stop('Files written');
        logger.blank();
        // Success output
        const componentName = toPascalCase(slug);
        const importPath = `@/components/sectionflow/transitions/${slug}`;
        const corePath = `@/components/sectionflow/core/transition-track`;
        logger.success(`${entry.title} installed successfully`);
        logger.blank();
        logger.dim('Next steps:');
        logger.blank();
        logger.dim(`  1. Import the transition`);
        logger.dim(`     import { ${componentName} } from "${importPath}"`);
        logger.dim(`     import { TransitionTrack } from "${corePath}"`);
        logger.blank();
        logger.dim(`  2. Use it in your page`);
        logger.dim(`     <${componentName}`);
        logger.dim(`       height={300}`);
        logger.dim(`       first={<YourFirstSection />}`);
        logger.dim(`       second={<YourSecondSection />}`);
        logger.dim(`     />`);
        logger.blank();
        logger.dim(`  3. View documentation`);
        logger.dim(`     /docs/transitions/${slug}`);
        logger.blank();
        logger.divider();
        logger.blank();
    }
    outro(pc.green(`✓ ${transitions.length === 1 ? 'Transition' : `${transitions.length} transitions`} installed`));
}
//# sourceMappingURL=add.js.map