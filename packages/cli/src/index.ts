#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { addCommand } from './commands/add.js';
import { listCommand } from './commands/list.js';

const program = new Command();

program
  .name('sectionflow')
  .description('Add scroll-driven section transitions to your React project')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize SectionFlow in your project — installs core files')
  .action(initCommand);

program
  .command('add')
  .description('Add one or more transitions to your project')
  .argument('<transitions...>', 'transition name(s) to install (e.g. wave-reveal card-stack)')
  .action(addCommand);

program
  .command('list')
  .description('List all available transitions')
  .action(listCommand);

program.parse(process.argv);
