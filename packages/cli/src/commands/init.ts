import path from 'node:path';
import { intro, outro, spinner } from '@clack/prompts';
import pc from 'picocolors';
import { detectProject } from '../utils/detect-project.js';
import { ensureDir, writeFile } from '../utils/file-writer.js';
import { installNpmDeps } from '../utils/install-deps.js';
import { logger } from '../utils/logger.js';
import { TYPES_SOURCE, TRACK_SOURCE } from '../core-files.js';

export async function initCommand(): Promise<void> {
  intro(pc.bgCyan(pc.black(' sectionflow init ')));
  logger.blank();

  const cwd     = process.cwd();
  const config  = detectProject(cwd);

  logger.step('Detecting project');
  logger.info(config.isNextJs     ? 'Next.js detected'     : 'React project detected');
  logger.info(config.isTypeScript ? 'TypeScript detected'  : 'JavaScript detected');
  logger.info(config.hasTailwind  ? 'Tailwind CSS detected': 'No Tailwind detected');
  logger.info(`Router: ${config.router}`);
  logger.info(`Components dir: ${path.relative(cwd, config.componentsDir)}`);
  logger.blank();

  // Create directory structure
  logger.step('Creating core directory');
  ensureDir(config.coreDir);
  ensureDir(config.transitionsDir);
  logger.info(`${path.relative(cwd, config.coreDir)}`);
  logger.info(`${path.relative(cwd, config.transitionsDir)}`);
  logger.blank();

  // Write core files
  const s = spinner();
  s.start('Writing core files');

  await writeFile(path.join(config.coreDir, 'types.ts'), TYPES_SOURCE, false);
  await writeFile(path.join(config.coreDir, 'transition-track.tsx'), TRACK_SOURCE, false);

  s.stop('Core files written');
  logger.blank();

  // Install framer-motion (always needed for the track)
  logger.step('Installing dependencies');
  await installNpmDeps(['framer-motion'], cwd);
  logger.blank();

  outro(pc.green('✓ SectionFlow initialized successfully'));
  logger.blank();
  logger.dim('Next steps:');
  logger.dim('  npx sectionflow add wave-reveal');
  logger.dim('  npx sectionflow list');
  logger.blank();
}
