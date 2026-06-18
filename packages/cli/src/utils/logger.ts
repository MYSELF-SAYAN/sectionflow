import pc from 'picocolors';

export const logger = {
  info:    (msg: string) => console.log(pc.cyan('  ◇ ') + msg),
  success: (msg: string) => console.log(pc.green('  ✓ ') + msg),
  warn:    (msg: string) => console.log(pc.yellow('  ⚠ ') + msg),
  error:   (msg: string) => console.log(pc.red('  ✖ ') + msg),
  step:    (msg: string) => console.log(pc.bold(pc.white('\n◆ ')) + pc.bold(msg)),
  dim:     (msg: string) => console.log(pc.dim('    ' + msg)),
  blank:   ()            => console.log(),
  divider: ()            => console.log(pc.dim('  ' + '─'.repeat(48))),
};
