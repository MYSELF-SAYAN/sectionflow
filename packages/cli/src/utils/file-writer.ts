import fs from 'node:fs';
import path from 'node:path';
import { confirm } from '@clack/prompts';
import { logger } from './logger.js';

export function ensureDir(dir: string): void {
  fs.mkdirSync(dir, { recursive: true });
}

export async function writeFile(
  filePath: string,
  content: string,
  overwriteAll: boolean,
): Promise<'written' | 'skipped'> {
  ensureDir(path.dirname(filePath));

  if (fs.existsSync(filePath) && !overwriteAll) {
    const rel = path.relative(process.cwd(), filePath);
    const answer = await confirm({
      message: `${rel} already exists. Overwrite?`,
      initialValue: false,
    });
    if (!answer) {
      logger.dim(`Skipped ${rel}`);
      return 'skipped';
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  return 'written';
}
