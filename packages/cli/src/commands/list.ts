import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import { getGrouped } from '../registry/index.js';
import { logger } from '../utils/logger.js';

const CATEGORY_ICONS: Record<string, string> = {
  'Creative':        '✦',
  'Split & Fragment':'⊞',
  '3D':              '◈',
  'Scroll':          '↕',
  'Particles':       '✦',
  'Premium':         '★',
  'GSAP Powered':    '⚡',
};

export async function listCommand(): Promise<void> {
  intro(pc.bgCyan(pc.black(' sectionflow list ')));
  logger.blank();

  const grouped = getGrouped();
  let total = 0;

  for (const [category, entries] of grouped) {
    const icon = CATEGORY_ICONS[category] ?? '•';
    console.log(pc.bold(pc.white(`  ${icon} ${category}`)));

    for (const entry of entries) {
      const engine = entry.engine === 'gsap'
        ? pc.dim(pc.yellow('  gsap          '))
        : pc.dim(pc.cyan('  framer-motion '));
      console.log(`    ${pc.white(entry.slug.padEnd(28))}${engine}${pc.dim(entry.title)}`);
      total++;
    }
    logger.blank();
  }

  logger.divider();
  logger.info(`${pc.bold(String(total))} transitions available`);
  logger.blank();
  logger.dim(`Install a transition:`);
  logger.dim(`  npx sectionflow add wave-reveal`);
  logger.blank();
  logger.dim(`Install multiple at once:`);
  logger.dim(`  npx sectionflow add card-stack cinematic-zoom depth-layers`);
  logger.blank();

  outro(pc.green('Ready to install'));
}
