import path from 'node:path';
import { intro, outro, spinner } from '@clack/prompts';
import pc from 'picocolors';
import { detectProject } from '../utils/detect-project.js';
import { ensureDir, writeFile } from '../utils/file-writer.js';
import { installNpmDeps } from '../utils/install-deps.js';
import { logger } from '../utils/logger.js';
import { TYPES_SOURCE, SECTION_FLOW_SOURCE, REGISTRY_SKELETON } from '../core-files.js';
/** Human-readable label for each framework, for the detection log. */
const FRAMEWORK_LABEL = {
    'next-app': 'Next.js (App Router)',
    'next-pages': 'Next.js (Pages Router)',
    'vite': 'Vite + React',
    'cra': 'React (CRA / standard)',
};
export async function initCommand() {
    intro(pc.bgCyan(pc.black(' sectionflow init ')));
    logger.blank();
    const cwd = process.cwd();
    const config = detectProject(cwd);
    logger.step('Detecting project');
    logger.info(`Framework: ${FRAMEWORK_LABEL[config.framework] ?? config.framework}`);
    logger.info(config.isTypeScript ? 'TypeScript detected' : 'JavaScript detected');
    logger.info(config.hasTailwind ? 'Tailwind CSS detected' : 'No Tailwind detected');
    logger.info(`Import alias: ${config.alias}`);
    logger.info(`Components dir: ${path.relative(cwd, config.componentsDir)}`);
    logger.blank();
    // Create directory structure
    logger.step('Creating core directory');
    ensureDir(config.coreDir);
    ensureDir(config.transitionsDir);
    logger.info(path.relative(cwd, config.coreDir));
    logger.info(path.relative(cwd, config.transitionsDir));
    logger.blank();
    // Write core files (v2 architecture: types + section-flow + registry)
    const s = spinner();
    s.start('Writing core files');
    await writeFile(path.join(config.coreDir, 'types.ts'), TYPES_SOURCE, false);
    await writeFile(path.join(config.coreDir, 'section-flow.tsx'), SECTION_FLOW_SOURCE, false);
    await writeFile(path.join(config.coreDir, 'registry.ts'), REGISTRY_SKELETON, false);
    s.stop('Core files written');
    logger.blank();
    // Install framer-motion (the only v2 runtime dependency)
    logger.step('Installing dependencies');
    await installNpmDeps(['framer-motion'], cwd);
    logger.blank();
    outro(pc.green('✓ SectionFlow initialized successfully'));
    logger.blank();
    logger.dim('Next steps:');
    logger.dim('  npx sectionflow add card-stack');
    logger.dim('  npx sectionflow list');
    logger.blank();
}
//# sourceMappingURL=init.js.map