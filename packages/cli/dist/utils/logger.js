import pc from 'picocolors';
export const logger = {
    info: (msg) => console.log(pc.cyan('  ◇ ') + msg),
    success: (msg) => console.log(pc.green('  ✓ ') + msg),
    warn: (msg) => console.log(pc.yellow('  ⚠ ') + msg),
    error: (msg) => console.log(pc.red('  ✖ ') + msg),
    step: (msg) => console.log(pc.bold(pc.white('\n◆ ')) + pc.bold(msg)),
    dim: (msg) => console.log(pc.dim('    ' + msg)),
    blank: () => console.log(),
    divider: () => console.log(pc.dim('  ' + '─'.repeat(48))),
};
//# sourceMappingURL=logger.js.map